describe('The initial inventory scenario', () => {
  beforeEach(() => {
    cy.login(Cypress.env('initialUsername'), Cypress.env('initialPassword'))
  })

  afterEach(() => {
    cy.logout()
  })

  after(() => {
    cy.task('queryDb', 'reset-initial-inventory.sql')
      .then(console.log, console.error)
  })

  Cypress.on('uncaught:exception', (err, runnable) => false)

  it('can go to the profile page', () => {
    cy.get('.modal-footer .cancel').click()
    cy.get('[ui-sref="openlmis.profile.basicInformation"]').click().wait(1000)
    cy.visit(Cypress.env('baseUrl'))
    cy.get('.modal-content').should('be.visible')
  })

  it('should check the basic product and delete the draft', () => {
    let displayedBasicProducts = []

    cy.get('.modal-footer .primary').click().wait(12000)
    cy.url().should('contain', '/initialInventory')
    cy.get('h2.ng-binding').should('contain', 'All Products')
    cy.get('.openlmis-flex-table.ps-container').find('td:nth-child(1).ng-binding').each(
      e => displayedBasicProducts.push(e.text())
    )
    cy.fixture('basic-products-qa.json').then(
      qaBasicProducts => expect(displayedBasicProducts.sort()).to.deep.equal(qaBasicProducts.sort())
    )
    cy.get('.openlmis-toolbar .danger').click()
    cy.get('.modal-footer .danger').click()
    cy.get('.modal-content').should('be.visible')
  })

  it('should update product and update lot and submit the draft', () => {
    let originalProductCount

    cy.get('.modal-footer .primary').click().wait(12000)
    cy.get('.openlmis-flex-table.ps-container th').contains('Product Code').should('be.visible')
    cy.get('.openlmis-flex-table.ps-container th').contains('Product').should('be.visible')
    cy.get('.openlmis-flex-table.ps-container th').contains('Lot Code').should('be.visible')
    cy.get('.openlmis-flex-table.ps-container th').contains('Expiry Date').should('be.visible')
    cy.get('.openlmis-flex-table.ps-container th').contains('Current Stock').should('be.visible')
    cy.get('.openlmis-flex-table.ps-container th').contains('Actions').should('be.visible')
    cy.get('.progress-bar-container .progress-bar>span').contains('0%').should('be.visible')
    cy.get('.progress-bar-container span[ng-bind="vm.title"]').each(
      e => originalProductCount = getProductCount(e.text())
    )

    // add product
    const addedProductName = 'Artemeter+Lumefantrina; 120mg+20mg 1x6; Comp'
    const addedProductCode = 'SEM-LOTE-08O05-012022-0'
    const addProductQuantity = 2

    cy.get('button[ng-click="vm.addProducts()"]').click()
    cy.get('.modal-dialog').click(68, 100)
    cy.get('li.select2-results__option').contains(addedProductName).click({force: true})
    cy.get('.modal-dialog').click(300, 100)
    cy.get('li.select2-results__option').contains(addedProductCode).click({force: true})
    cy.get('.modal-body button.add').click()
    cy.get('.modal-body input[ng-model="item.quantity"]').type(addProductQuantity)
    cy.get('.modal-footer button[ng-click="vm.confirm()"]').click()
    cy.get('.progress-bar-container span[ng-bind="vm.title"]').each(
      e => expect(getProductCount(e.text())).to.equal(originalProductCount + 1)
    )

    // add lot by selecting existed lot code
    cy.fillCustomInput()

    // add lot by generating lot code
    cy.get('button[ng-click="vm.addLot(lineItem, lineItems)"]').eq(0).click({force: true})
    cy.fillCustomInput({
      forceAutoGerate: true
    })

    // add lot by inputting lot code
    cy.get('button[ng-click="vm.addLot(lineItem, lineItems)"]').eq(1).click({force: true})
    cy.fillCustomInput({
      enableDateColumn: false,
      enableInput: true
    })

    // fill current stock
    cy.get('input[name="lineItem.quantity"]').each(e => cy.wrap(e).clear({force: true}).type(2, {force: true}))

    // remove lot and remove product
    cy.get('button.danger[ng-click="vm.removeLot(lineItem)"]').last().click({force: true})
    cy.get('.progress-bar-container span[ng-bind="vm.title"]').each(
      e => expect(getProductCount(e.text())).to.equal(originalProductCount)
    )

    // submit
    cy.submitAndShowSoh(true)
    cy.get('tr:not(.is-secondary) td:nth-child(6).text-align-right').each(
      e => expect(e.text()).to.equal('2')
    )
  })

  // progress text like '0 of 7 products completed'
  const getProductCount = progressText => parseInt(progressText.substring(progressText.indexOf('of') + 3))
})
