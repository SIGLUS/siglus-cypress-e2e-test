// E2E test for stockmanagement adjustment scenario

import {getFutureDate, getToday} from '../../utils/date-util'

describe('stockmanagement adjustment scenario', () => {

  before(() => {
    cy.login(Cypress.env('username'), Cypress.env('password'))
  })

  after(() => {
    cy.logout()
  })

  it('stockmanagement adjustment', () => {
    // go to adjustment page
    cy.enterMenu(4, 5, 'Adjustments', 'stockmanagement/adjustment').then(() => {
      cy.enterAllProductsClearDraft('Adjustments')
    })

    // add products and fill value
    const KIT = 'KIT AL/US'
    const products = ['Fenobarbital', 'Sifilis', 'Prometazina', KIT]
    cy.wrap(products).each((product, index) => {
      // add product
      cy.get('#select2-productSelect-container').click().then(() => {
        cy.get('.select2-search__field').type(product).type('{enter}')
        cy.get('.add').click()
        if (product !== KIT) {
          if (product === 'Sifilis') {
            // fill 'Lot Code', use existed lot
            cy.get('.custom-item-container').eq(0).click().wait(1000)
              .then(() => {
                cy.get('.adjustment-custom-item .option-list').then(() => {
                  cy.get('body>.adjustment-custom-item .option-list').children().eq(0).click()
                })
              })
            cy.get(':nth-child(1) > :nth-child(6) > .input-control').click().then(() => {
              cy.get('.select2-search__field').type('Negative Correction').type('{enter}')
            })
            cy.get(':nth-child(1) > :nth-child(7) > .input-control').type('test')
          } else  if (product === 'Prometazina') {
            // fill 'Lot Code', input lot
            cy.get('.custom-item-container').eq(0).type('new lot')
            cy.get(':nth-child(1) > :nth-child(4) > .input-control').type(getFutureDate())
            cy.get(':nth-child(1) > :nth-child(6) > .input-control').click().then(() => {
              cy.get('.select2-search__field').type('Positive Correction').type('{enter}')
              cy.get(':nth-child(1) > :nth-child(7) > .input-control').type('test')
            })
          } else {
            // fill 'Lot Code', create new lot
            // fill 'Expiry Date'
            cy.get(':nth-child(1) > :nth-child(4) > .input-control').type(getFutureDate())
            cy.get('[ng-if="enableInput"] > .input-control')
              .click().then(() => {
                cy.contains('Auto generate lot').click({force: true})
              })
            cy.get(':nth-child(1) > :nth-child(6) > .input-control').click()
          }
        }
      })
      cy.get(':nth-child(1) > :nth-child(8) > .input-control').type(index + 1)
      cy.get(':nth-child(1) > :nth-child(10) > .input-control').click().type('Doc-' + product)
    })

    // click 'Save' button
    cy.get('[ng-click="vm.save()"]').click().then(() => {
      cy.contains('Save is successful')
    })

    // go to adjustment products page again
    cy.enterMenu(4, 5, 'Adjustments', 'stockmanagement/adjustment').then(() => {
      cy.get('#proceedButton').should('have.value', 'Continue').click().wait(10000)
        .then(() => {
          cy.get('.pagination-info').should('contain', 'Showing 4 item(s) out of 4 total')
        })
    })

    // click "Remove' button
    cy.get(':nth-child(1) > :nth-child(11) > .danger').click().then(() => {
      cy.get('.pagination-info').should('contain', 'Showing 3 item(s) out of 3 total')
    })
    // click "Remove' button
    cy.get(':nth-child(1) > :nth-child(11) > .danger').click().then(() => {
      cy.get('.pagination-info').should('contain', 'Showing 2 item(s) out of 2 total')
    })

    cy.submitAndShowSoh()

  })
})