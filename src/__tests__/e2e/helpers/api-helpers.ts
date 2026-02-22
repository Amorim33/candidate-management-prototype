import { APIRequestContext } from '@playwright/test';

const BASE = '/api/candidates';

export async function resetData(request: APIRequestContext) {
  return request.post('/api/reset');
}

export async function getAllCandidates(
  request: APIRequestContext,
  query?: Record<string, string>,
) {
  if (!query) {
    return request.get(BASE);
  }

  const params = new URLSearchParams(query);
  return request.get(`${BASE}?${params.toString()}`);
}

export async function createCandidate(
  request: APIRequestContext,
  body: Record<string, unknown>,
) {
  return request.post(BASE, { data: body });
}

export async function decideCandidate(
  request: APIRequestContext,
  id: string,
  body: Record<string, unknown>,
) {
  return request.post(`${BASE}/${id}/decision`, { data: body });
}
