describe('physical inventory', () => {
  beforeEach(() =>{
    cy.login(Cypress.env('username'), Cypress.env('password'))
  })

  afterEach(() => {
    // cy.logout()
  })

  it('Physical inventory', () => {
    //entry
    cy.goToNavigation(['Stock Management', 'Physical inventory'])
    cy.get('th').contains('Program').should('be.visible')
    cy.get('th').contains('Status').should('be.visible')
    cy.get('th').contains('Actions').should('be.visible')
    cy.get('td').contains('All Products').should('be.visible')
    cy.get('td').eq(1).then(element => {
      if (element.text() === 'Not yet started') {
        cy.get('td').contains('Not yet started').should('be.visible')
        cy.get('#proceedButton').should('have.attr', 'value', 'Start')
      } else {
        cy.get('td').contains('Draft').should('be.visible')
        cy.get('#proceedButton').should('have.attr', 'value', 'Continue')
      }
    })

    const allProductProgram = '00000000-0000-0000-0000-000000000000'
    //detail page
    cy.get('#proceedButton').click().wait(10000).then(() => {
      cy.url().should('include', allProductProgram)

      cy.get('table thead>tr>th').then(elements => {
        expect(elements.length).equal(10)
        expect(elements.eq(0).text()).equal('Product Code')
        expect(elements.eq(1).text()).equal('Product')
        expect(elements.eq(2).text()).equal('Lot Code')
        expect(elements.eq(3).text()).equal('Expiry Date')
        expect(elements.eq(4).text()).equal('Stock on Hand')
        expect(elements.eq(5).text()).equal('Current Stock')
        expect(elements.eq(6).text()).equal('Reasons')
        expect(elements.eq(7).text()).equal('Comments')
        expect(elements.eq(8).text()).equal('Unaccounted Quantity')
        expect(elements.eq(9).text()).equal('Actions')
      })

      // fill soh what already have
      cy.get('table tbody tr[ng-repeat="lineItem in lineItems"]').then(elements => {
        elements.toArray().forEach(row => {
          const allTd = [...row.querySelectorAll('td')]
          if (allTd[5].querySelector('input')) {
            const soh = allTd[4].innerHTML
            if (!isNaN(parseInt(soh.trim()))) {
              cy.wrap(allTd[5]).within(() => {
                cy.get('input').focus().type(soh.trim(), {force: true})
              })
            }
          }

        })
      })

    })

  })

})
