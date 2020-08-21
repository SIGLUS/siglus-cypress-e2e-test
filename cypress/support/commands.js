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
Cypress.Commands.add("login", (user, password) => {
    cy.visit(Cypress.env("baseUrl"))
    cy.get('#login-username').type(user)
    cy.get('#login-password').type(password)
    cy.contains('Sign In').click()
    cy.url( { timeout: 15000 }).should('include','/home')
    cy.get('.home-page > :nth-child(2)').should('contain','Welcome to OpenLMIS Mozambique')
})

//get ID th element and it contain value
Cypress.Commands.add('containValueById',(element,id,value) =>{
    cy.get(element)
        .eq(id)
        .should('contain',value)
})

//logout by UI
Cypress.Commands.add('logout',() => {
    cy.get('.navbar-right.ng-binding').click()
    cy.url().should('include','login')
})

Cypress.Commands.add('fillCustomInput', (option = {enableInput: false, cb: () => {}}) => {
    const { enableInput, cb } = option;

    if (enableInput === true) {
      return;
    }

    cy.get('.stock-select-container').each((el, index) => {
        cy.get('.custom-item-container').eq(index).click().wait(1000).then(() => {
            cy.get('.adjustment-custom-item .option-list').then(element => {
                // if has lot option, then pick first option
                if (element.children().length > 0) {
                    cy.get('body>.adjustment-custom-item .option-list').children().eq(0).click()
                } else {
                    cy.get('body>.adjustment-custom-item .auto').first().click()
                    cy.get('[openlmis-datepicker="openlmis-datepicker"]').eq(index * 2).click().wait(500).then(() => {
                        cy.get('.datepicker .datepicker-days tbody tr td').eq(index % 7).click()
                    })
                }
            })
        })
    })

    if ( cb && typeof cb === "function") {
        cb()
    }
})

// login by API
// Cypress.Commands.add("login", (user, password) => {
//     cy.request({
//         method:'POST',
//         url:'https://qa.siglus.us/api/oauth/token?grant_type=password',
//         headers:{
//             Authorization:'Basic dXNlci1jbGllbnQ6Y2hhbmdlbWU=',
//             'Postman-Token':'af090791-a6dc-49f0-a0a8-a8e1aea41c1c',
//             Host: 'qa.siglus.us',
//             'Content-Length': 36,
//             'Cache-Control':'no-cache',
//             accept :'application/json, text/plain, \\*/\\*',
//
//         },
//         form : true,
//         body :{
//             data : {
//                 "username": user,
//                 "password": password
//             }
//         }
//
//     }).then((resp) => {
//         window.localStorage.setItem("jwt", resp.body.access_token)
//     })
//
// })
// logout by storage
// Cypress.Commands.add("logout",() => {
//     cy.window.its('locaStorage')
//         .invoke('getItem','jwt')
//         .should('not.exist')
// })


// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
