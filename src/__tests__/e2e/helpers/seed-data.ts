/** Seed data constants matching src/data/storage.ts */

export const SEED = {
  counts: { total: 9, new: 4, shortlisted: 3, rejected: 2 },

  newCandidates: [
    { id: 'c_1', name: 'Maria Santos', role: 'Senior Frontend Engineer', location: 'Lisbon, Portugal' },
    { id: 'c_2', name: 'João Pereira', role: 'Backend Developer', location: 'Porto, Portugal' },
    { id: 'c_3', name: 'Ana Costa', role: 'Product Designer', location: 'São Paulo, Brazil' },
    { id: 'c_4', name: 'Carlos Fernandez', role: 'Full Stack Engineer', location: 'Barcelona, Spain' },
  ],

  shortlistedCandidates: [
    { id: 'c_5', name: 'Lucas Ferreira', role: 'DevOps Engineer', location: 'Rio de Janeiro, Brazil' },
    { id: 'c_6', name: 'Isabella Silva', role: 'UX Researcher', location: 'Curitiba, Brazil' },
    { id: 'c_7', name: 'Diego Morales', role: 'Senior Backend Engineer', location: 'Buenos Aires, Argentina' },
  ],

  rejectedCandidates: [
    { id: 'c_8', name: 'Ricardo Torres', role: 'QA Engineer', location: 'Madrid, Spain' },
    { id: 'c_9', name: 'Patricia Mendes', role: 'Junior Developer', location: 'Braga, Portugal' },
  ],
} as const;
