describe('Archive product', function() {
  beforeEach(() => {
    cy.login(Cypress.env('username'), Cypress.env('password'))
  })

  afterEach(() => {
    cy.logout()
  })

  describe('Verify archive product button', () => {
    it('Should not show archive product button when product SOH is 0 but is kit product', () => {
      let program = 'Multiple Programs'
      let kitProduct = 'Artemeter+Lumefantrina; 120mg+20mg 2x6; Comp'
      let kitCode = '08O05Z'
      cy.stockOutWithSOH(program, kitProduct, kitCode).then(() => {
        cy.contains('Stock on hand', {timeout: 10000}).parent().should('have.value', 0)
        cy.get('button', {timeout: 10000}).should('not.contain', 'Archive')
      })
    })

    it('Should not show archive product button when product SOH is not 0', () => {
      let program = 'Multiple Programs'
      let productName = 'Gonadotrofina coriónica humana5000UI/mLInjectável'
      let productCode = '04E010'
      cy.isActivatedProduct(program, productName).then((isActivated) => {
        if (isActivated) {
          return cy.isStockOut(program, productCode)
        }
        return cy.activateProduct(program, productName, productCode).then(() => {
          return true
        })
      }).then((isStockOut) => {
        if (isStockOut) {
          return cy.adjustmentProduct(productName, 1).then(() => {
            return cy.submitAndShowSoh()
          })
            .then(() => {
              return cy.viewProductByProduct(productCode)
            })
        }
      }).then(() => {
        cy.get('button', {timeout: 10000}).should('not.contain', 'Archive')
      })
    })
  })

  describe('Archive product', () => {
    it('Should archive product when product SOH is 0 and is not in kit', () => {
      let productName = 'Tenofovir/Lamivudina/Efavirenz; 300+300+600mg 30Comp; Embalagem'
      let productCode = '08S18Y'
      cy.archiveProduct('ARV', productName, productCode)
    })
  })

  describe('Activate product', () => {
    it('Should activate product when product SOH is 0 and is not in kit in archived page', () => {
      let program = 'ARV'
      let productName = 'Zidovudina/Lamivudina/Nevirapina; 150mg+300mg+200mg 60Cps; Embalagem'
      let productCode = '08S42'
      cy.isArchivedProduct(program, productName).then((isArchived) => {
        if (!isArchived) {
          return cy.archiveProductWithSOH(program, productName, productCode)
        }
      }).then(() => {
        cy.activateProduct(program, productName, productCode)
      })
    })

    it('Should auto activate product in adjustment', () => {
      let program = 'ARV'
      let productName = 'Abacavir (ABC)+Lamivudina (3TC); 600mg+300mg, 30Comp; Embalagem'
      let productCode = '08S01ZY'
      cy.isArchivedProduct(program, productName).then((isArchived) => {
        if (!isArchived) {
          return cy.archiveProductWithSOH(program, productName, productCode)
        }
      }).then(() => {
        cy.adjustmentProduct(productName, 1)
      }).then(() => {
        return cy.submitAndShowSoh()
      })
        .then(() => {
          return cy.isActivatedProduct(program, productName)
        })
        .then((isActivated) => {
          assert.isTrue(isActivated, 'activated success')
        })
    })
  })
})
