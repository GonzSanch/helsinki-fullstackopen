Cypress.Commands.add('login', ({ username, password }) => {
    cy.request('POST', 'http://localhost:3003/api/login', {
        username,
        password
    }).then(({ body }) => {
        localStorage.setItem('loggedUser', JSON.stringify(body))
        cy.visit('http://localhost:3000')
    })
})

Cypress.Commands.add('createBlog', ({ title, author, url, likes }, user) => {
    cy.request('POST', 'http://localhost:3003/api/login', user)
        .then(({ body }) => {
            cy.request({
                url: 'http://localhost:3003/api/blogs',
                method: 'POST',
                body: { title, author, url, likes },
                headers: {
                    'Authorization': `bearer ${body.token}`
                }
            })
        })
})