// Cypress.Commands.add('selectProgram', (program = 'All Products') => {
//   cy.get('#selectProgram').parent().click().then(() => {
//     return cy.contains('#select2-selectProgram-results li', program).click()
//   })
//     .then(() => {
//       return cy.get('input[type=\'submit\']').click()
//     })
// })
Cypress.Commands.add('selectProgram', (program = 'All Products') => {
  cy.get('#selectProgram').select(program, {force: true}).then(() => {
    return cy.get('input[type=\'submit\']').click()
  })
})

Cypress.Commands.add('isStockOut', (program = 'All Products', productCode) => {
  return cy.goToNavigation(['Stock Management', 'Stock on Hand']).then(() => {
    return cy.selectProgram(program)
  }).then(() => {
    return cy.viewProductByProduct(productCode)
  }).then(() => {
    return cy.contains('Stock on hand', {timeout: 10000}).parent()
  })
    .then(($soh) => {
      return !Number($soh.text().replace('Stock on hand', '').trim())
    })
})

const findProduct = (productName) => {
  cy.wait(4000)
  cy.contains('div.loading', {timeout: 10000}).should('not.exist').then(() => {
    return cy.get('section.openlmis-table-container')
  }).then(($section) => {
    if ($section.text().includes(productName)) {
      return true
    } else if ($section.find('a:contains(\'Next\')').parent('li.disabled').length) {
      return false
    }
    cy.contains('a', 'Next').click().then(() => {
      return findProduct(productName)
    })
  })
}

Cypress.Commands.add('isArchivedProduct', (program = 'All Products', productName) => {
  return cy.goToNavigation(['Stock Management', 'Archived Products']).then(() => {
    return cy.selectProgram(program)
  }).then(() => {
    return findProduct(productName)
  })
})

// After this command will route to product detail page
Cypress.Commands.add('stockOutWithSOH', (program = 'All Products', productName, productCode) => {
  cy.isStockOut(program, productCode).then((isStockOut) => {
    if (!isStockOut) {
      return cy.goToNavigation(['Stock Management', 'Adjustments']).then(() => {
        return cy.enterAllProductsClearDraft('Adjustments')
      }).then(() => {
        cy.adjustmentOutProduct(productName)
      }).then(() => {
        return cy.submitAndShowSoh()
      })
        .then(() => {
          return cy.viewProductByProduct(productCode)
        })
    }
  })
})

const activateWhenArchived = (program = 'All Products', productName, productCode) => {
  return cy.isArchivedProduct(program, productName).then((isArchived) => {
    if (isArchived) {
      return cy.activateProduct(program, productName, productCode).then(() => {
        return true
      })
    }
  })
}

Cypress.Commands.add('archiveProduct', (program = 'All Products', productName, productCode) => {
  activateWhenArchived(program, productName, productCode).then((activated) => {
    if (activated) {
      return cy.viewProductByProduct(productCode)
    }
    return cy.stockOutWithSOH(program, productName, productCode)
  }).then(() => {
    return cy.contains('button', 'Archive').click()
  })
    .then(() => {
      return cy.get('.modal-body').contains('Are you sure you want to archive this product?')
    })
    .then(() => {
      return cy.get('.modal-footer').contains('button', 'Archive').click()
    })
    .then(() => {
      cy.contains('Product has been successfully archived!', {timeout: 10000})
      cy.contains('Related draft has been updated', {timeout: 10000})
      cy.contains('Archived Products', {timeout: 10000})
    })
})

Cypress.Commands.add('activateProduct', (program = 'All Products', productName, productCode) => {
  cy.goToNavigation(['Stock Management', 'Archived Products']).then(() => {
    return cy.selectProgram(program)
  }).then(() => {
    return cy.viewProductByProduct(productCode)
  }).then(() => {
    return cy.contains('button', 'Activate').click()
  })
    .then(() => {
      cy.get('.modal-body').contains('Are you sure you want to activate the product?')
      return cy.get('.modal-body').contains('This product will be added back to SOH after the activate action')
    })
    .then(() => {
      return cy.get('.modal-footer').contains('button', 'Activate').click()
    })
    .then(() => {
      cy.contains('Product has been successfully added back to SOH!', {timeout: 10000})
      cy.contains('Stock on Hand', {timeout: 10000})
      cy.contains('Multiple Programs', {timeout: 10000})
    })
})
