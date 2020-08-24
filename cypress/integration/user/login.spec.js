// E2E test for stockmanagement login scenario

describe('login test', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('baseUrl'))
  })

  it('greet with sign in', () => {
    cy.get('h1.ng-binding').should('contain', 'Logistics Management Information System')
  })
  it('links to Powered by OpenLMIS', () => {
    cy.get('.modal-footer > .ng-binding').should('contain', 'Powered by OpenLMIS')
    cy.get('.modal-footer > .ng-binding').should('have.attr', 'href', 'http://openlmis.org')

  })
  it('links to forgot to password', () => {
    cy.get('#forgotPasswordLink').should('have.attr', 'href', '#!/forgotPassword')
  })

  it('valide user', () => {
    cy.get('#login-username').type('test')
    cy.get('#login-password').type(Cypress.env('password'))
    cy.contains('Sign In').click()
    cy.contains('Close').click()
    cy.get('#loginError').should('contain', 'The username or password you entered is incorrect. Please try again.')
  })

  it('valide password', () => {
    cy.get('#login-username').type(Cypress.env('username'))
    cy.get('#login-password').type('12234')
    cy.contains('Sign In').click()
    cy.contains('Close').click()
    cy.get('#loginError').should('contain', 'The username or password you entered is incorrect. Please try again.')
  })

  it('login successfully and then log out', () => {
    cy.get('#login-username').type(Cypress.env('username'))
    cy.get('#login-password').type(Cypress.env('password'))
    cy.contains('Sign In').click()
    cy.url().should('include', '/home')
    cy.get('.home-page > :nth-child(2)').should('contain', 'Welcome to OpenLMIS Mozambique')
    cy.get('.system-notification-list > h2.ng-binding').should('contain', 'System Notification')
    cy.get('.navbar-right.ng-binding').click()
    cy.url().should('include', '/login')
  })
})