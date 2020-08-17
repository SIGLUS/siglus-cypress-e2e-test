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
    cy.visit('https://qa.siglus.us/#!/login')
    cy.get('#login-username').type(user)
    cy.get('#login-password').type(password)
    cy.contains('Sign In').click()
    cy.url( { timeout: 15000 }).should('include','/home')
    cy.get('.home-page > :nth-child(2)').should('contain','Welcome to OpenLMIS Mozambique')
})

Cypress.Commands.add('containValueById',(element,id,value) =>{
    cy.get(element)
        .eq(id)
        .should('contain',value)
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

Cypress.Commands.add("logout",() => {
    cy.window.its('locaStorage')
        .invoke('getItem','jwt')
        .should('not.exist')
})

//
//
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
