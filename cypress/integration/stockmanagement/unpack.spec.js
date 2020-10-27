import KITJson from '../../fixtures/KITandChildren.json'
// E2E test for stockmanagement unpack scenario

describe('Unpack case', () => {
  beforeEach(() => {
    cy.login(Cypress.env('username'), Cypress.env('password'))
  })

  afterEach(() => {
    cy.logout()
  })

  it('check unpack  entrance list, input and clear', () => {
    cy.enterAndCliskUnpack('KIT AL/US (Artemeter+Lumefantrina); 170 Tratamentos+ 400 Testes; KIT', 1, 'doc-01')
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

  it('submit unpack ', () => {
    cy.enterAndCliskUnpack('KIT AL/US (Artemeter+Lumefantrina); 170 Tratamentos+ 400 Testes; KIT', 1, 'unpack-01')
      .then(
        () => {
          cy.get('tbody > .ng-isolate-scope > :nth-child(6) > .ng-binding')
            .click()
            .wait(1000)
            .then(() => {
              cy.contains('Product Name')
              cy.wrap(KITJson.children)
                .should('have.length', 5)
                .each((object, index) => {
                  cy.get('div[ng-if=\'vm.showProducts\']')
                    .find('[ng-repeat="products in vm.groupedProducts"]')
                    .eq(index)
                    .within(() => {
                      cy.containValueById('td', 0, object.code)
                      cy.containValueById('td', 1, object.productName)
                      cy.fillQuantiy(object.quantity + 1)

                    })
                  cy.get('.custom-item-container')
                    .eq(index)
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
                })
              cy.submitAndShowSoh()
              cy.viewProductByProduct('08O05Y', '11')
              // cy.wrap(KITJson.children).should('have.length',5)
              //   .each((object,index) => {
              //     cy.log('code:'+object.code)
              //     cy.viewProductByProduct(object.code, object.quantity+1)
              //     cy.get('.breadcrumb > :nth-child(3) > .ng-binding').click().wait(1000)
              //   })
            })
        })
  })

})