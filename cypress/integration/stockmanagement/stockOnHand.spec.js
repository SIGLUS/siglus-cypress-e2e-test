describe('stock on hand', () => {
  beforeEach(() => {
    cy.login(Cypress.env('username'), Cypress.env('password'))
  })

  it('check all program stock overview list', () => {
    cy.get(':nth-child(4) > [bs-dropdown="dropdown"]').click().then(() => {
      cy.contains('Stock on Hand').click()
      cy.url().should('contain', 'stockmanagement/stockCardSummaries')

      cy.get('#select2-selectProgram-container').click().then(() => {
        cy.get('body>.select2-container .select2-dropdown').within(() => {
          cy.contains('All Products').click()
        }).then(() => {
          cy.get('input[type="submit"]').click().then(() => {
            expect('tbody > tr').to.have.length.greaterThan(1)
            let productName = ''
            cy.get('tbody > :nth-child(1) > :nth-child(2)').then(elements => {
              productName = elements.text()
            })

            let productOnHand = ''
            cy.get(':nth-child(1) > .text-align-right').then(elements => {
              productOnHand = elements.text()
            })
            cy.get(':nth-child(1) > :nth-child(7) > .primary').click().wait(1000).then(() => {
              cy.log(productName)
              cy.get('.product-name-header > .ng-binding').should('contain', productName)
              cy.log(productOnHand)
              cy.get('ul > .text-align-right').should('contain', productOnHand)
              cy.get('tbody > :nth-child(1) > :nth-child(6)').then(elements => {
                expect(elements.text()).equal(productOnHand)
              })
            })
          })
        })
      })
    })
  })

  it('check multiple  program stock overview list by product', () => {
    cy.get(':nth-child(4) > [bs-dropdown="dropdown"]').click().then(() => {
      cy.contains('Stock on Hand').click()
      cy.url().should('contain', 'stockmanagement/stockCardSummaries')

      cy.get('#select2-selectProgram-container').click().then(() => {
        cy.get('body>.select2-container .select2-dropdown').within(() => {
          cy.contains('Multiple Programs').click()
        }).then(() => {
          cy.get('input[type="submit"]').click().then(() => {
            expect('tbody > tr').to.have.length.greaterThan(1)
            let productName = ''
            cy.get('tbody > :nth-child(1) > :nth-child(2)').then(elements => {
              productName = elements.text()
            })

            let productOnHand = ''
            cy.get(':nth-child(1) > .text-align-right').then(elements => {
              productOnHand = elements.text()
            })
            cy.get(':nth-child(1) > :nth-child(7) > .primary').click().wait(1000).then(() => {
              cy.log(productName)
              cy.get('.product-name-header > .ng-binding').should('contain', productName)
              cy.log(productOnHand)
              cy.get('ul > .text-align-right').should('contain', productOnHand)
              cy.get('.stock-card-info > ul > :nth-child(3)').should('contain', 'Multiple Programs')
              cy.get('tbody > :nth-child(1) > :nth-child(6)').then(elements => {
                expect(elements.text()).equal(productOnHand)
              })
              cy.contains('Lot number').should('not.be.visible')
            })
          })
        })
      })
    })
  })

  it('check multiple  program stock overview list by lot', () => {
    cy.get(':nth-child(4) > [bs-dropdown="dropdown"]').click().then(() => {
      cy.contains('Stock on Hand').click()
      cy.url().should('contain', 'stockmanagement/stockCardSummaries')

      cy.get('#select2-selectProgram-container').click().then(() => {
        cy.get('body>.select2-container .select2-dropdown').within(() => {
          cy.contains('Multiple Programs').click()
        }).then(() => {
          cy.get('input[type="submit"]').click().then(() => {
            expect('tbody > tr').to.have.length.greaterThan(1)
            let productName = ''
            cy.get('tbody > :nth-child(2) > :nth-child(2)').then(elements => {
              productName = elements.text()
            })

            let lotCode = ''
            cy.get('tbody > :nth-child(2) > :nth-child(3)').then(elements => {
              lotCode = elements.text()
            })

            let lotOnHand = ''
            cy.get(':nth-child(2) > .text-align-right').then(elements => {
              lotOnHand = elements.text()
            })
            cy.get(':nth-child(2) > :nth-child(7) > .primary').click().wait(1000).then(() => {
              cy.log(productName)
              cy.get('.product-name-header > .ng-binding').should('contain', productName)
              cy.log(lotOnHand)
              cy.get('ul > .text-align-right').should('contain', lotOnHand)
              cy.get('tbody > :nth-child(1) > :nth-child(6)').then(elements => {
                expect(elements.text()).equal(lotOnHand)
              })
              cy.contains('Lot number').should('be.visible')
              cy.get('.stock-card-info > ul > :nth-child(5)').should('contain', lotCode)
            })
          })
        })
      })
    })
  })
})
