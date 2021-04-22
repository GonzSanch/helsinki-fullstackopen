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

            const guess = {
                name: 'guess',
                username: 'guess',
                password: 'sekret'
            }
            cy.request('POST', 'http://localhost:3003/api/users', guess)
            cy.createBlog({ title: 'already exist', author: 'GUEST', url: 'local', likes: 0 }, guess)
            cy.createBlog({ title: 'list like', author: 'GUEST', url: 'local', likes: 3 }, guess)
            cy.createBlog({ title: 'the most liked', author: 'GUEST', url: 'local', likes: 10 }, guess)
            cy.visit('http://localhost:3000')
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
                .contains('view').click()
                .get('#like-button').click()
        })

        it('user can delete own blogs', () => {
            cy.contains('new blog').click()
            cy.get('#title').type('Test delete')
            cy.get('#author').type('CY')
            cy.get('#url').type('test-domain')
            cy.get('#createBlog-button').click()

            cy.contains('Test delete CY')
                .contains('view').click()
            cy.contains('Test delete CY')
                .contains('delete').click()

            cy.get('html').should('not.contain', 'Test delete CY')
        })

        it('user can not delete blogs from other user', () => {
            cy.contains('already exist GUEST')
                .contains('view').click()
            cy.contains('already exist GUEST')
                .contains('delete').click()

            cy.get('html').should('contain', 'already exist GUEST')
        })

        it.only('blogs order by likes is the correct ASC', () => {
            cy.get('.blog-view')
                .click({ multiple: true })
            cy.get('.likes')
                .then((likes) => {
                    return (
                        Cypress.$.makeArray(likes)
                            .map((likes) => likes.innerText.replace('like', ''))
                    )
                }).should('deep.equal', ['10', '3', '0'])
        })
    })
})