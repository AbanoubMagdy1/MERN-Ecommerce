 /* eslint-disable */

const qty = '2'

describe('Test loging in, adding to cart and logging out', () => {
    it('Test loging in, adding to cart and logging out', () => {
        //Log in
        cy.visit('http://localhost:3000/login')
        cy.findByPlaceholderText(/enter email/i).type("bebomagdy@gmail.com")
        cy.findByPlaceholderText(/enter password/i).type("123456")
        cy.findByRole('button', {
            name: /sign in/i
          }).click()

        //Open canon camera product
        cy.findByText(/cannon eos 80d dslr camera/i).click()
        //Add To cart with 2 quantity
        cy.findByRole('combobox').select(qty);

        let price;
        cy.findByTestId('price').then(p => {
            const textPrice = p.text().replace(/\$/g, '')
            price = +textPrice

            cy.findByText(/add to cart/i).click();
            //Check balance
            cy.log(price)
            cy.findByTestId('cartPrice')
                .should('have.text', `$${(qty * price).toFixed(2)}`)
            //Log out  
            
        })
    })
})