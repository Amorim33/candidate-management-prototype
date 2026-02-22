import { test, expect } from '@playwright/test';
import { getAllCandidates, createCandidate, decideCandidate, resetData } from '../helpers/api-helpers';

test.describe('API routes validation', () => {
  test.beforeEach(async ({ request }) => {
    await resetData(request);
  });

  test('GET /api/candidates returns envelope with all 9 candidates', async ({ request }) => {
    const response = await getAllCandidates(request);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('items');
    expect(body).toHaveProperty('filteredCount', 9);
    expect(body).toHaveProperty('statusCount', 9);
    expect(body).toHaveProperty('availableTags');
    expect(body).toHaveProperty('counts');

    expect(body.items).toHaveLength(9);
    expect(body.items[0]).toHaveProperty('id');
    expect(body.items[0]).toHaveProperty('name');
    expect(body.items[0]).toHaveProperty('status');
    expect(body.items[0]).toHaveProperty('role');
    expect(body.filteredCount).toBe(body.items.length);
  });

  test('GET /api/candidates supports backend status + search + tags + sort', async ({ request }) => {
    const response = await getAllCandidates(request, {
      status: 'SHORTLISTED',
      search: 'engineer',
      tags: 'backend,devops',
      sort: 'name-az',
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body.items).toHaveLength(2);
    expect(body.items.map((candidate: { name: string }) => candidate.name)).toEqual([
      'Diego Morales',
      'Lucas Ferreira',
    ]);
    expect(body.statusCount).toBe(3);
    expect(body.filteredCount).toBe(2);
  });

  test('GET /api/candidates uses default newest sort when sort is omitted', async ({ request }) => {
    const response = await getAllCandidates(request, {
      status: 'NEW',
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.items.map((candidate: { id: string }) => candidate.id)).toEqual([
      'c_4',
      'c_3',
      'c_2',
      'c_1',
    ]);
  });

  test('GET /api/candidates validates invalid status', async ({ request }) => {
    const response = await getAllCandidates(request, {
      status: 'INVALID',
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBeTruthy();
  });

  test('GET /api/candidates validates invalid sort', async ({ request }) => {
    const response = await getAllCandidates(request, {
      sort: 'invalid-sort',
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBeTruthy();
  });

  test('POST /api/candidates validates missing name', async ({ request }) => {
    const response = await createCandidate(request, {});
    expect(response.status()).toBe(400);
  });

  test('POST /api/candidates validates empty name', async ({ request }) => {
    const response = await createCandidate(request, { name: '' });
    expect(response.status()).toBe(400);
  });

  test('POST /api/candidates validates invalid LinkedIn URL', async ({ request }) => {
    const response = await createCandidate(request, {
      name: 'Test User',
      linkedin: 'not-a-linkedin-url',
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('LinkedIn');
  });

  test('POST /api/candidates accepts empty LinkedIn string as optional', async ({ request }) => {
    const response = await createCandidate(request, {
      name: 'Optional Linkedin Candidate',
      linkedin: '',
    });

    expect(response.status()).toBe(201);
  });

  test('POST /api/candidates/[id]/decision validates missing fields', async ({ request }) => {
    const response = await decideCandidate(request, 'c_1', {});
    expect(response.status()).toBe(400);
  });

  test('POST /api/candidates/[id]/decision validates short reason', async ({ request }) => {
    const response = await decideCandidate(request, 'c_1', {
      decision: 'SHORTLIST',
      reason: 'short',
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('10');
  });

  test('POST /api/candidates/[id]/decision validates invalid decision value', async ({ request }) => {
    const response = await decideCandidate(request, 'c_1', {
      decision: 'INVALID',
      reason: 'This is a long enough reason',
    });
    expect(response.status()).toBe(400);
  });

  test('POST /api/candidates/[id]/decision returns 404 for non-existent candidate', async ({ request }) => {
    const response = await decideCandidate(request, 'c_999', {
      decision: 'SHORTLIST',
      reason: 'This is a long enough reason',
    });
    expect(response.status()).toBe(404);
  });

  test('POST /api/candidates/[id]/decision returns 409 for already-shortlisted candidate', async ({ request }) => {
    const response = await decideCandidate(request, 'c_5', {
      decision: 'SHORTLIST',
      reason: 'Trying to shortlist again with enough text',
    });
    expect(response.status()).toBe(409);
  });

  test('POST /api/candidates/[id]/decision returns 409 for already-rejected candidate', async ({ request }) => {
    const response = await decideCandidate(request, 'c_8', {
      decision: 'REJECT',
      reason: 'Trying to reject again with enough text',
    });
    expect(response.status()).toBe(409);
  });

  test('POST /api/candidates/[id]/decision returns 409 for cross-status transition', async ({ request }) => {
    // Cannot shortlist a rejected candidate
    const response = await decideCandidate(request, 'c_8', {
      decision: 'SHORTLIST',
      reason: 'Trying to shortlist a rejected candidate',
    });
    expect(response.status()).toBe(409);
  });

  test('POST /api/candidates creates candidate with tags', async ({ request }) => {
    const response = await createCandidate(request, {
      name: 'Tag Test User',
      tags: ['frontend', 'senior'],
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.tags).toEqual(['frontend', 'senior']);
  });

  test('POST /api/candidates creates candidate without tags', async ({ request }) => {
    const response = await createCandidate(request, { name: 'No Tags User' });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.tags).toBeUndefined();
  });

  test('POST /api/candidates validates empty tag strings', async ({ request }) => {
    const response = await createCandidate(request, {
      name: 'Bad Tag User',
      tags: ['valid-tag', ''],
    });
    expect(response.status()).toBe(400);
  });

  test('POST /api/candidates validates tags containing commas', async ({ request }) => {
    const response = await createCandidate(request, {
      name: 'Comma Tag Candidate',
      tags: ['c++, c#'],
    });

    expect(response.status()).toBe(400);
  });

  test('POST /api/candidates/[id]/decision preserves tags after decision', async ({ request }) => {
    // Create candidate with tags, then decide — tags should be preserved
    const createResponse = await createCandidate(request, {
      name: 'Tagged Candidate',
      tags: ['technical', 'culture-fit'],
    });
    const created = await createResponse.json();

    const decisionResponse = await decideCandidate(request, created.id, {
      decision: 'SHORTLIST',
      reason: 'Great candidate with strong skills',
    });
    expect(decisionResponse.status()).toBe(200);
    const body = await decisionResponse.json();
    expect(body.tags).toEqual(['technical', 'culture-fit']);
  });

  test('GET /api/candidates returns tags on seeded candidates', async ({ request }) => {
    const response = await getAllCandidates(request);
    const body = await response.json();
    const shortlistedWithTags = body.items.find((candidate: { id: string }) => candidate.id === 'c_5');
    expect(shortlistedWithTags.tags).toEqual(['devops', 'infrastructure']);
  });
});
