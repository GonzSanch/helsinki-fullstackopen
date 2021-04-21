describe('Blog app', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000')
    })
    it('front page can be opened', () => {
        cy.contains('log in to application')
    })

    it('login form can be completed', () => {
        cy.contains('login')
        cy.get('#username').type('root')
        cy.get('#password').type('sekret')
        cy.get('#login-button').click()

        cy.contains('root logged in')
    })

    describe('when logged in', () => {
        beforeEach(() => {
            cy.contains('login')
            cy.get('#username').type('root')
            cy.get('#password').type('sekret')
            cy.get('#login-button').click()

            cy.contains('root logged in')
        })

        it('a new blog can be created', () => {
            cy.contains('new blog').click()
            cy.get('#title').type('Test with cypress')
            cy.get('#author').type('CY')
            cy.get('#url').type('test-domain')
            cy.get('#createBlog-button').click()
            cy.contains('Test with cypress CY')
        })
    })

})

