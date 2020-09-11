import {getYesterday, getFutureDate} from '../../utils/date-util'
// E2E test for stockmanagement unpack scenario

describe('physical inventory', () => {
  before(() => {
    cy.login(Cypress.env('username'), Cypress.env('password'))
  })

  after(() => {
    cy.logout()
  })

  it('check unpack  entrance list, input and clear', () => {
    cy.get(':nth-child(4) > [bs-dropdown="dropdown"]')
      .click()
      .then(() => {
        cy.contains('Unpack')
          .click()
        cy.url()
          .should('contain', 'stockmanagement/unpack')
        cy.contains('Kit Unpack for')
          .should('be.visible')

        //get KIT AL/US (Artemeter+Lumefantrina); 170 Tratamentos+ 400 Testes; KIT and Unpack
        cy.contains(
          'KIT AL/US (Artemeter+Lumefantrina); 170 Tratamentos+ 400 Testes; KIT')
          .should('contain', 'KIT')
          .should('contain', 'US')
          .parent('tr')
          .within(() => {
            cy.get('td')
              .eq(1)
              .should(($div) => {
                const n = parseFloat($div.text())
                expect(n)
                  .to
                  .be
                  .gte(1)
              })
            cy.get('td', {timeout: 15000})
              .eq(2)
              .click()
          })

        cy.url()
          .should('include', '/create')
        cy.get('tbody > .ng-isolate-scope > :nth-child(2)')
          .should('contain',
            'KIT AL/US (Artemeter+Lumefantrina); 170 Tratamentos+ 400 Testes; KIT')
        cy.get(':nth-child(4) > .input-control')
          .type('1')
        cy.get(':nth-child(5) > .input-control')
          .type('doc-01')
          .then(() => {
            cy.get(
              'tbody > .ng-isolate-scope > :nth-child(6) > .ng-binding')
              .click()
              .then(
                () => {
                  cy.contains('Quantity in KIT')
                    .should('be.visible')
                  cy.get('div[ng-if=\'vm.showProducts\']')
                    .find('[ng-repeat="products in vm.groupedProducts"]')
                    .first()
                    .within(() => {
                      cy.containValueById('td', 0, '08O05')
                      cy.containValueById('td', 1,
                        'Artemeter+Lumefantrina; 120mg+20mg 1x6; Comp')
                      cy.fillQuantiy(31)

                    })
                  cy.get('.custom-item-container')
                    .eq(0)
                    .click()
                    .wait(1000)
                    .then(() => {
                      cy.get('.adjustment-custom-item .option-list')
                        .then(() => {
                          cy.get('body>.adjustment-custom-item .option-list')
                            .children()
                            .eq(0)
                            .click()
                        })
                    })
                  cy.get('.danger')
                    .click()
                  cy.get('.custom-item-container')
                    .eq(0)
                    .should('contain', 'Select an option')
                  cy.get(':nth-child(4) > .input-control')
                    .eq(0)
                    .should('contain', '')
                  cy.get('tr.ng-scope > .digit-cell > .input-control')
                    .should('contain', '')
                })
          })
      })
  })
})
