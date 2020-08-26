// E2E test for stockmanagement issue scenario

import {getToday} from '../../utils/date-util'

describe('stockmanagement issue scenario', () => {

  before(() => {
    cy.login(Cypress.env('username'), Cypress.env('password'))
  })

  after(() => {
    cy.logout()
  })

  it('stockmanagement issue', () => {
    // go to issue page
    cy.enterMenu(4, 2, 'Issue', 'stockmanagement/issue').then(() => {
      cy.enterAllProductsClearDraft('Issue')
    })

    // add products and fill value
    const KIT = 'KIT AL/US'
    const products = ['Ibuprofeno', 'Hidralazina', KIT, 'Acarbose']
    cy.wrap(products).each((product) => {
      // add product
      cy.get('#select2-productSelect-container').click().then(() => {
        cy.get('#select2-productSelect-results').contains(product).click().then(
          () => {
            if (product === KIT) {
              cy.get('.add').click()
            } else {
              cy.get('#select2-lotSelect-container').click().then(() => {
                cy.get('.select2-results__option--highlighted').click().then(
                  () => {
                    cy.get('.add').click()
                  })
              })
            }
          })
      })
      cy.fillCommonData(1, getToday(), 'Doc-' + product)
    })

    // click 'Save' button
    cy.get('[ng-click="vm.save()"]').click().then(() => {
      cy.contains('Save is successful')
    })

    // go to issue page again
    cy.enterMenu(4, 2, 'Issue', 'stockmanagement/issue').then(() => {
      cy.get('#proceedButton').should('have.value', 'Continue').click().wait(10000)
        .then(() => {
          cy.get('.pagination-info').should('contain', 'Showing 4 item(s) out of 4 total')
        })
    })

    // click "Remove' button
    cy.get(':nth-child(1) > :nth-child(10) > .danger').click().then(() => {
      cy.get('.pagination-info').should('contain', 'Showing 3 item(s) out of 3 total')
    })

    cy.submitAndShowSoh()

  })
})