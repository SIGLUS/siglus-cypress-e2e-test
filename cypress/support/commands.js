// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
//login by UI
Cypress.Commands.add('login', (user, password) => {
  cy.visit(Cypress.env('baseUrl'))
  cy.get('#login-username').type(user)
  cy.get('#login-password').type(password)
  cy.contains('Sign In').click()
  cy.url({timeout: 15000}).should('include', '/home')
  cy.get('.home-page > :nth-child(2)').should('contain',
    'Welcome to OpenLMIS Mozambique')
})

//get ID th element and it contain value
Cypress.Commands.add('containValueById', (element, id, value) => {
  cy.get(element).eq(id).should('contain', value)
})

// logout by UI
Cypress.Commands.add('logout', () => {
  cy.wait(5000).get('.navbar-right.ng-binding').click({force: true}).then(() => {
    cy.url().should('include', 'login')
  })
})

Cypress.Commands.add('fillCustomInput', (option = {
  enableInput: false,
  enableDateColumn: true,
  forceAutoGerate: false,
  cb: () => {
  }
}) => {
  const {enableInput, enableDateColumn, forceAutoGerate, cb} = option
  cy.get('.stock-select-container').each((el, index) => {
    if (enableInput) {
      const firstOption = el.find('.option-list>div').first()
      if (firstOption) {
        cy.wrap(el.find('.adjustment-input')).type(firstOption.text(), {force: true})
      } else {
        cy.wrap(el.find('.adjustment-input')).type(`INPUT-${Math.random().toFixed(5) * 100000}`, {force: true})
        cy.get('[openlmis-datepicker="openlmis-datepicker"]').eq(
          index * (enableDateColumn ? 2 : 1)).click({force: true}).wait(500)
          .then(() => {
            cy.get('.datepicker .datepicker-days tbody tr td').eq(
              index % 7).click({force: true})
          })
      }
      return
    }
    cy.get('.custom-item-container').eq(index).focus().click({force: true})
      .wait(1000)
      .then(() => {
        cy.get('.adjustment-custom-item .option-list').then(element => {
        // if has lot option, then pick first option
          if (element.children().length > 0 && !forceAutoGerate) {
            cy.get('body>.adjustment-custom-item .option-list').children().eq(
              0).click({force: true})
          } else {
            cy.get('body>.adjustment-custom-item .auto').first().click({force: true})
            cy.get('[openlmis-datepicker="openlmis-datepicker"]').eq(
              index * (enableDateColumn ? 2 : 1)).click({force: true}).wait(500)
              .then(() => {
                cy.get('.datepicker .datepicker-days tbody tr td').eq(
                  index % 7).click({force: true})
              })
          }
        })
      })
  })

  if (cb && typeof cb === 'function') {
    cb()
  }
})

// enter menu
Cypress.Commands.add('enterMenu', (index, subIndex, menuName, url) => {
  cy.get(':nth-child(' + index + ') > [bs-dropdown="dropdown"]').click().then(
    () => {
      cy.get('.open > .ng-isolate-scope > :nth-child(' + subIndex
        + ') > .ng-binding').should('contain', menuName).click().then(
        () => {
          cy.url().should('contain', url)
        })
    })
})

// enter All Products clear draft(for issue, receive, adjustments)
Cypress.Commands.add('enterAllProductsClearDraft', (menuName) => {
  cy.get('.breadcrumb > :nth-child(1) > .ng-binding').should('contain', 'Home')
  cy.get('.breadcrumb > :nth-child(2) > .ng-binding').should('contain', 'Stock Management')
  cy.get('.breadcrumb > :nth-child(3) > .ng-binding').should('contain', menuName)
  cy.get('tbody > .ng-isolate-scope > .ng-binding').should('contain', 'All Products')
  cy.get('#proceedButton').click().wait(10000).then(() => {
    // clear if draft existed
    cy.get('.pagination-info').then(element => {
      if (!element.text().includes('Showing no items')) {
        cy.get('[ng-click="vm.removeDisplayItems()"]').click().then(() => {
          cy.get('[ng-click="vm.confirm()"]').click()
        })
      }
    })
  })
})

Cypress.Commands.add('goToNavigation', (navigation = []) => {
  cy.get('[bs-dropdown="dropdown"]').contains(navigation[0]).click().then(() => {
    if (navigation[1]) {
      cy.get('a').contains(navigation[1]).click()
    }
  })
})

// fill common data(for issue, receive, adjustments)
Cypress.Commands.add('fillCommonData', (quantity, date, documentationNo) => {
  // fill 'Issue To' / 'Received From'
  cy.get(':nth-child(1) > :nth-child(6) > .input-control').click()
  // fill 'Quantity'
  cy.get(':nth-child(1) > :nth-child(7) > .input-control').type(quantity)
  // fill 'Date'
  cy.get(':nth-child(1) > :nth-child(8) > .input-control').click().then(() => {
    cy.get('.datepicker-days > .table-condensed > tfoot > :nth-child(2) > .clear').click()
    cy.get(':nth-child(1) > :nth-child(8) > .input-control').type(date)
  })
  // fill 'Documentation No.'
  cy.get(':nth-child(1) > :nth-child(9) > .input-control').click().type(documentationNo)
})

// submit and show soh(for issue, receive, adjustments)
Cypress.Commands.add('submitAndShowSoh', (isPhysicalInventory) => {
  // click 'Submit' button
  cy.get('[ng-click="vm.submit()"]').click().then(() => {
    if (isPhysicalInventory) {
      cy.get('form label.is-required').should('contain', 'Signature')
    } else {
      cy.get('.form-group > .is-required').should('contain', 'Signature')
    }
    cy.get('[name="vm.signature"]').type('Cypress Robot')
    let btnSelector = '[ng-click="vm.confirm()"]'
    if (isPhysicalInventory) {
      btnSelector = '.modal-footer input[type="submit"]'
    } else {
      btnSelector = '[ng-click="vm.confirm()"]'
    }
    cy.get(btnSelector).click().then(() => {
      if (isPhysicalInventory) {
        cy.wait(5000).contains('Physical Inventory has successfully been submitted', {timeout: 20000})
      } else {
        cy.wait(5000).contains('event has successfully been submitted')
      }
      cy.get('.breadcrumb > :nth-child(1) > .ng-binding').should('contain', 'Home')
      cy.get('.breadcrumb > :nth-child(2) > .ng-binding').should('contain', 'Stock Management')
      cy.get('.breadcrumb > :nth-child(3) > .ng-binding').should('contain', 'Stock on Hand')
    })
  })
})

