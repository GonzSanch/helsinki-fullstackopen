describe('Blog app', () => {
    beforeEach(() => {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        const user = {
            name: 'root',
            username: 'root',
            password: 'sekret'
        }
        cy.request('POST', 'http://localhost:3003/api/users', user)
        cy.visit('http://localhost:3000')
    })
    it('Login form is shown', () => {
        cy.contains('log in to application')
    })

    describe('Login', () => {
        it('succeeds with correct credentials', () => {
            cy.contains('login')
            cy.get('#username').type('root')
            cy.get('#password').type('sekret')
            cy.get('#login-button').click()

            cy.contains('root logged in')
        })

        it('fails with wrong credentials', () => {
            cy.contains('login')
            cy.get('#username').type('root')
            cy.get('#password').type('wrong')
            cy.get('#login-button').click()

            cy.get('.error')
                .should('contain', 'Wrong credentials')
                .should('have.css', 'color', 'rgb(255, 0, 0)')
                .should('have.css', 'border-style', 'solid')

            cy.get('html').should('not.contain', 'root logged in')
        })
    })

    describe('when logged in', () => {
        beforeEach(() => {
            cy.login({ username: 'root', password: 'sekret' })
        })

        it('a blog can be created', () => {
            cy.contains('new blog').click()
            cy.get('#title').type('Test with cypress')
            cy.get('#author').type('CY')
            cy.get('#url').type('test-domain')
            cy.get('#createBlog-button').click()
            cy.contains('Test with cypress CY')
        })

        it('like button works', () => {
            cy.contains('new blog').click()
            cy.get('#title').type('Test like')
            cy.get('#author').type('CY')
            cy.get('#url').type('test-domain')
            cy.get('#createBlog-button').click()

            cy.contains('Test like CY')
                .get('#blog-view').click()
                .get('#like-button').click()
        })
    })

})

