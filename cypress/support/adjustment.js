const addProduct = (productName) => {
  return cy.get('#select2-productSelect-container').click().then(() => {
    cy.get('.select2-search__field').type(productName).type('{enter}')
    cy.get('button.add').click()
  })
}

const fillAdjustmentLineItem = (lineItemIdx, reason, comment, documentNo, increaseQty) => {
  return cy.get('input.custom-item-container').eq(lineItemIdx).focus().then(() => {
    return cy.get('body>.adjustment-custom-item .option-list>div').eq(lineItemIdx).click()
  })
    .then(() => {
      return cy.get('select[name=\'lineItem.reason\']').eq(lineItemIdx).parent().click()
    })
    .then(() => {
      cy.get('.select2-search__field').type(reason).type('{enter}')
      cy.get('input[name=\'lineItem.reasonFreeText\']').eq(lineItemIdx).focus().type(comment)
      cy.get('table tbody>tr td:nth-child(5)').eq(lineItemIdx).then(($soh) => {
        cy.get('input[name=\'lineItem.quantity\']').eq(lineItemIdx).type(Number($soh.text()) + (increaseQty || 0))
      })
      cy.get('input[name=\'lineItem.documentationNo\']').eq(lineItemIdx).type(documentNo)
    })
}

Cypress.Commands.add('adjustmentOutProduct', (productName) => {
  addProduct(productName).then(() => {
    cy.get('input.custom-item-container').focus()
    cy.get('body>.adjustment-custom-item .option-list>div').each(($div, index) => {
      if (index) {
        return addProduct(productName)
      }
    }).then(($divs) => {
      $divs.each((index) => {
        return fillAdjustmentLineItem(index, 'Negative Correction', 'adjust out qty', 'doc')
      })
    })
  })
})

Cypress.Commands.add('adjustmentProduct', (productName, increaseQty) => {
  addProduct(productName).then(() => {
    fillAdjustmentLineItem(0, 'Positive Correction', 'adjust increase qty', 'doc', increaseQty)
  })
})
