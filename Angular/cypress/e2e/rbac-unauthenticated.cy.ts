describe('RBAC - unauthenticated access', () => {
  const protectedRoutes = [
    '/users',
    '/visits',
    '/visits/new?patientId=123',
    '/patients',
    '/patients/new',
    '/patients/123',
    '/patients/123/edit',
    '/allergies',
    '/allergies/new?patientId=123',
    '/prescriptions',
    '/prescriptions/new?patientId=123'
  ];

  protectedRoutes.forEach((routePath) => {
    it(`(DT-RBAC-13): Redirects ${routePath} to login page`, () => {
      cy.visit(routePath, { failOnStatusCode: false });
      cy.location('pathname', { timeout: 5000 }).should('eq', '/login');
    });
  });
});