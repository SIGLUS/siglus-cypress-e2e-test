// E2E test for stockmanagement receive scenario

import {getYesterday, getFutureDate} from '../../utils/date-util'

describe('stockmanagement receive scenario', () => {

  before(() =>{
    cy.login(Cypress.env('username'), Cypress.env('password'))
  })

  after(() => {
    cy.logout()
  })

  it('stockmanagement receive', () => {
    // go to receive products page
    cy.enterMenu(4, 3, 'Receive', 'stockmanagement/receive').then(() => {
      cy.enterAllProductsClearDraft('Receive')
    })

    // add products and fill value
    const KIT = 'KIT AL/US'
    const IBUPROFENO = 'Ibuprofeno'
    const products = [KIT, IBUPROFENO, 'Hidralazina', 'Acetazolamida']
    cy.wrap(products).each((product, index) => {
      // add product
      cy.get('#select2-productSelect-container').click().then(() => {
        cy.get('.select2-search__field').type(product).type('{enter}')
        cy.get('.add').click()
      })
      if (product === KIT) {
        // 'Lot Code' should be empty
        // eslint-disable-next-line max-len
        cy.get(':nth-child(1) > :nth-child(3) > .stock-select-container > [ng-if="!enableInput"] > .form-control').should('not.exist')
        // 'Expiry Date' should be empty
        cy.get(':nth-child(1) > :nth-child(4) > .input-control').should('not.exist')
      } else if (product === IBUPROFENO) {
        // fill 'Lot Code', create new lot
        // eslint-disable-next-line max-len
        cy.get(':nth-child(1) > :nth-child(3) > .stock-select-container > [ng-if="!enableInput"] > .form-control').click().then(() => {
          cy.contains('Auto generate lot').click({force: true})
        })
        // fill 'Expiry Date'
        cy.get(':nth-child(1) > :nth-child(4) > .input-control').type(getFutureDate())
      } else {
        // fill 'Lot Code', use existed lot
        cy.get('.custom-item-container').eq(0).click().wait(1000)
          .then(() => {
            cy.get('.adjustment-custom-item .option-list').then(() => {
              cy.get('body>.adjustment-custom-item .option-list').children().eq(0).click()
            })
          })
      }
      cy.fillCommonData(index + 1, getYesterday(), 'Doc-' + product)
    })

    // click 'Save' button
    cy.get('[ng-click="vm.save()"]').click().then(() => {
      cy.contains('Save is successful')
    })

    // go to receive products page again
    cy.enterMenu(4, 3, 'Receive', 'stockmanagement/receive').then(() => {
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