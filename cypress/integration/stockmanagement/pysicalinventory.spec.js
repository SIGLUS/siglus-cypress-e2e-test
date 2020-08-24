// E2E test for stockmanagement physical inventory scenario

describe('physical inventory', () => {
  before(() => {
    cy.login(Cypress.env('username'), Cypress.env('password'))
  })

  after(() => {
    cy.logout()
  })

  it('check  Physical inventory entrance', () => {

    cy.get(':nth-child(4) > [bs-dropdown="dropdown"]').click().then(() => {
      cy.contains('Physical inventory').click()
      cy.url().should('contain', 'stockmanagement/physicalInventory')
      cy.contains('Physical inventory for')
      cy.get('tbody > .ng-isolate-scope > :nth-child(1)').should('contain', 'All Products')
      cy.get('tbody > .ng-isolate-scope > :nth-child(2)').then(element => {
        if (element.text.includes('Draft')) {
          cy.get('#proceedButton').should('have.value', 'Continue').click()
        } else {
          cy.get('#proceedButton').should('have.value', 'Start').click()
        }
      })
      // 超时设置
      cy.url({timeout: 30000}).should('include',
        'stockmanagement/physicalInventory/00000000-0000-0000-0000-000000000000')
    })
  })
})
