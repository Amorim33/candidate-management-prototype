import { APIRequestContext } from '@playwright/test';

const BASE = '/api/candidates';

export async function resetData(request: APIRequestContext) {
  return request.post('/api/reset');
}

export async function getAllCandidates(request: APIRequestContext) {
  return request.get(BASE);
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
