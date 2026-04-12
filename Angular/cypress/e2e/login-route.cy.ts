describe('Login route behaviour', () => {
  it('Ensures user is redirected to login page', () => {
    cy.visit('/login/login-form');

    cy.location('pathname').should('eq', '/login');
    cy.contains('MediTrack').should('be.visible');
  });

  it('Shows sign in with Google button on login page', () => {
    cy.visit('/login');

    cy.contains('Sign in with Google').should('be.visible');
  });
});
