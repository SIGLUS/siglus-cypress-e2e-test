// E2E test for stockmanagement receive scenario

import { getYesterday, getFutureDate } from '../../utils/date-util'

describe('stockmanagement receive scenario',() => {

  beforeEach(() =>{
    cy.login(Cypress.env("username"),Cypress.env("password"))
  })

  // afterEach(() => {
  //   cy.logout()
  // })

  it('stockmanagement receive', () => {
    // go to receive products page
    cy.get(':nth-child(4) > [bs-dropdown="dropdown"]').click().then(() => {
      cy.get('.open > .ng-isolate-scope > :nth-child(3) > .ng-binding').should('contain', 'Receive').click().then(() => {
        cy.url().should('contain','stockmanagement/receive')
        cy.get('.breadcrumb > :nth-child(1) > .ng-binding').should('contain','Home')
        cy.get('.breadcrumb > :nth-child(2) > .ng-binding').should('contain','Stock Management')
        cy.get('.breadcrumb > :nth-child(3) > .ng-binding').should('contain','Receive')
        cy.get('tbody > .ng-isolate-scope > .ng-binding').should('contain', 'All Products')
        cy.get('#proceedButton').click().wait(10000).then(() => {
          // clear if draft existed
          if (!cy.get('.pagination-info').should('contain', 'Showing no items')) {
            cy.get('[ng-click="vm.removeDisplayItems()"]').click().then(() => {
              cy.get('[ng-click="vm.confirm()"]').click()
            })
          }
        })
      })
    })

    // add products and fill value
    const IBUPROFENO = 'Ibuprofeno'
    const HIDRALAZINA = 'Hidralazina'
    const KIT = 'KIT AL/US'
    const products = [IBUPROFENO, HIDRALAZINA, KIT]
    cy.wrap(products).each((product, index) => {
      // add product
      cy.get('#select2-productSelect-container').click().then(() => {
        cy.get('.select2-search__field').type(product).type('{enter}')
        cy.get('.add').click()
      })
      if (product !== KIT) {
        // fill 'Lot Code', create new lot
        cy.get(':nth-child(1) > :nth-child(3) > .stock-select-container > [ng-if="!enableInput"] > .form-control').click().then(() => {
          cy.contains('Auto generate lot').click({force: true})
        })
        // fill 'Expiry Date'
        cy.get(':nth-child(1) > :nth-child(4) > .input-control').type(getFutureDate())
      }
      // fill 'Received From'
      cy.get(':nth-child(1) > :nth-child(6) > .input-control').click().then(() => {
        cy.contains('District(DDM)').click({force: true})
      })
      // fill 'Quantity'
      cy.get(':nth-child(1) > :nth-child(7) > .input-control').type(String(index + 1))
      // fill 'Date'
      cy.get(':nth-child(1) > :nth-child(8) > .input-control').click().then(()=> {
        cy.get('.datepicker-days > .table-condensed > tfoot > :nth-child(2) > .clear').click()
        cy.get(':nth-child(1) > :nth-child(8) > .input-control').type(getYesterday())
      })
      // fill 'Documentation No.'
      cy.get(':nth-child(1) > :nth-child(9) > .input-control').type('Doc-' + product)
    })

    // click 'Save' button
    cy.get('[ng-click="vm.save()"]').click().then(() => {
      cy.contains('Save is successful')
    })

    // go to receive products page again
    cy.get(':nth-child(4) > [bs-dropdown="dropdown"]').click().then(() => {
      cy.get('.open > .ng-isolate-scope > :nth-child(3) > .ng-binding').should('contain', 'Receive').click().then(() => {
        cy.url().should('contain','stockmanagement/receive')
        cy.get('#proceedButton').should('have.value', 'Continue').click().wait(10000).then(() => {
          cy.get('.pagination-info').should('contain', 'Showing 3 item(s) out of 3 total')
        })
      })
    })

    // click 'Submit' button
    cy.get('[ng-click="vm.submit()"]').click().then(() => {
      cy.get('.form-group > .is-required').should('contain', 'Signature')
      cy.get('[name="vm.signature"]').type('Cypress Robot')
      cy.get('[ng-click="vm.confirm()"]').click().then(() => {
        cy.contains('Stock receive event has successfully been submitted')
        cy.get('.breadcrumb > :nth-child(1) > .ng-binding').should('contain','Home')
        cy.get('.breadcrumb > :nth-child(2) > .ng-binding').should('contain', 'Stock Management')
        cy.get('.breadcrumb > :nth-child(3) > .ng-binding').should('contain', 'Stock on Hand')
      })
    })

  })
})