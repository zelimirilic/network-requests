///<reference types="cypress" />

describe("Network request", () => {
    var errorMessage = 'Unable to find comment!!!';

    beforeEach(() => {
        cy.visit("https://example.cypress.io/commands/network-requests");

        //Start a server to begin routing responses to cy.route() and cy.request()
        cy.server();
    });

    it("GET request", () => {
        //Listen for GET request which use the following: comments/ within the url
        //cy.route("GET", "comments/*").as("getComment");

        cy.route({
            method: "GET",
            url: "comments/*",
            response: {
                "postId": 1,
                "id": 1,
                "name": "id labore ex et quam laborum",
                "email": "Eliseo@gardner.biz",
                "body": "Una bella signorina!"
              }
        }).as("getComment");

        cy.get('.network-btn').click();

        cy.wait("@getComment").its("status").should("equal", 200);

    });

    it("POST request", () => {
        
        cy.route("POST", "comments").as("postComment");

        cy.get('.network-post').click();

        cy.wait("@postComment").should((xhr) => {
            expect(xhr.requestBody).to.include('email');
            expect(xhr.responseBody).to.have.property('name', "Using POST in cy.intercept()");
            expect(xhr.requestHeaders).to.have.property("Content-Type");
            expect(xhr.responseHeaders).to.have.property('cache-control');

        });

    });

    it.only("PUT request", () => {
       
        cy.route({
            method: "PUT",
            url: "comments/*",
            status: 404,
            response: {error: errorMessage},
            delay: 500
        }).as('putComment');

        cy.get('.network-put').click();

        cy.wait('@putComment');

        cy.get('.network-put-comment').should('contain', errorMessage);

        

        });

    });