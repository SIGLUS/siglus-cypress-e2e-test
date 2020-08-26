describe('physical inventory', () => {
  beforeEach(() =>{
    cy.login(Cypress.env('username'), Cypress.env('password'))
  })

  afterEach(() => {
    cy.logout()
  })

  it('Physical inventory save', () => {
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
    cy.get('#proceedButton').click().wait(12000).then(() => {
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

      cy.get('.progress-bar-container .progress-bar>span').then(el => expect(el.text()).equal('0%'))

      // filter
      // cy.get('button.filters').click({force:true}).then(() => {
      //   cy.get('#searchFor')
      //   .type('Artemeter+Lumefantrina; 120mg+20mg 1x6; Comp')
      //   cy.get('.popover-content input[value="Search"]').click({force: true})
      // })

      // add product
      cy.get('button[ng-click="vm.addProducts()"]').click().wait(1000).then(() => {
        cy.get('.modal-dialog').click(68, 100).then(() => {
          // eslint-disable-next-line max-len
          cy.get('ul.select2-results__options>li').contains('Artemeter+Lumefantrina; 120mg+20mg 1x6; Comp').click({force: true})
        })

        cy.get('.modal-dialog').click(300, 100).then(() => {
          cy.get('ul.select2-results__options>li').contains('SEM-LOTE-08O05-012022-0').click({force: true})
        })

        cy.get('.modal-body button.add').click()

        cy.wait(500).get('.modal-body input[ng-model="item.quantity"]').type(1)

        cy.get('.modal-footer button[ng-click="vm.confirm()"]').click()
      })

      cy.get('button.danger[ng-click="vm.removeLot(lineItem)"]').focus().wait(1000).click({force: true})

      // fillLots();

      cy.get('button[ng-click="vm.saveDraft()"]').click()

      // fill soh what already have
      // fillPageDataSoh()

    })

  })

  it('delete draft', () => {
    //entry
    cy.goToNavigation(['Stock Management', 'Physical inventory'])

    cy.get('td').contains('Draft').should('be.visible')
    cy.get('#proceedButton').should('have.attr', 'value', 'Continue')

    //detail page
    cy.get('#proceedButton').click().wait(12000).then(() => {

      cy.get('button[ng-click="vm.delete()"]').click().then(() => {
        cy.get('.modal-footer .danger[ng-click="vm.confirm()"]').click().wait(2000)
      })
    })

  })

  it('submit', () => {
    //entry
    cy.goToNavigation(['Stock Management', 'Physical inventory'])

    //detail page
    cy.get('#proceedButton').click().wait(12000).then(() => {
      fillLots()
      fillPageDataSoh()
    })

  })

  function fillPageDataSoh() {
    cy.get('table tbody tr[ng-repeat="lineItem in lineItems"]').then(elements => {
      elements.toArray().forEach(row => {
        const allTd = [...row.querySelectorAll('td')]
        if (allTd[5].querySelector('input')) {
          const soh = allTd[4].innerHTML
          const value = isNaN(parseInt(soh.trim())) ? 0 : soh.trim()
          cy.wrap(allTd[5]).within(() => {
            cy.get('input').focus().type(value, {force: true})
          })
        }
      })
    })

    cy.get('.openlmis-pagination ul>li:last-child').then(e => {
      const el = e[0]
      cy.wait(1000).then(() => {
        goNextPage(el, fillPageDataSoh)
      })
    })
  }

  const goNextPage = (el, cb) => {
    if (el.classList.contains('disabled')) {
      cy.focused().blur()
      cy.get('.progress-bar-container .progress-bar>span').then(el => expect(el.text()).equal('100%'))
      cy.submitAndShowSoh(true)
    } else {
      el.querySelector('a').click()
      cy.wait(1000).then(() => {
        cb()
      })
    }
  }

  const fillLots = () => {
    // eslint-disable-next-line max-len
    cy.get('input[ng-model="lineItem.quantity"]').first().type(parseInt(Math.random().toFixed(4) * 10000), {force: true}).wait(500)
      .blur()
      .then(() => {
        cy.get('input[ng-model="lineItem.reasonFreeText"]').first().type('random comments', {force: true})
      })

    // add lot by input
    cy.get('button[ng-click="vm.addLot(lineItems[0])"]').eq(0).focus().click({force: true})
      .then(() => {
        cy.fillCustomInput({enableDateColumn: false,
          enableInput: true})
      })

    // add lot by select if option exist
    cy.get('button[ng-click="vm.addLot(lineItems[0])"]').eq(1).focus().click({force: true})
      .then(() => {
        cy.fillCustomInput({enableDateColumn: false})
      })

    // // add lot by select if option exist
    cy.get('button[ng-click="vm.addLot(lineItems[0])"]').eq(2).focus().click({force: true})
      .then(() => {
        cy.fillCustomInput({enableDateColumn: false,
          forceAutoGerate: true})

        cy.wait(2000).then(() => {
          cy.get('.stock-select-container').last().then((el) => {
            const invalidEl = el.find('div.is-invalid')
            if (invalidEl && invalidEl[0]) {
              cy.get('.stock-select-container div.is-invalid input').clear({force: true})
              cy.fillCustomInput({enableDateColumn: false,
                enableInput: true})
            }
          })
        })
      })
  }
})
