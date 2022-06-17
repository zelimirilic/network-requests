///<reference types="cypress" />

describe("Network request", () => {
    var errorMessage = 'Unable to find comment!!!';

    beforeEach(() => {
        cy.visit("https://example.cypress.io/commands/network-requests");

        //Start a server to begin routing responses to cy.route() and cy.request()
        //cy.server();
    });

    it("GET request", () => {
        //Listen for GET request which use the following: comments/ within the url
        //cy.route("GET", "comments/*").as("getComment");

        //cy.route({
        cy.intercept({
            method: "GET",
            url: "**/comments/*", },
            {
            body: {
                "postId": 1,
                "id": 1,
                "name": "id labore ex et quam laborum",
                "email": "Eliseo@gardner.biz",
                "body": "Una bella signorina!"
            }
        }).as("getComment");

        cy.get('.network-btn').click();

        cy.wait("@getComment").its("response.statusCode").should("equal", 200);

    });

    it("POST request", () => {

        //cy.route("POST", "comments").as("postComment");
        cy.intercept("POST", "comments").as("postComment");

        cy.get('.network-post').click();

        cy.wait("@postComment").should(({ request, response }) => {
            console.log(request);

            //expect(xhr.requestBody).to.include('email');
            expect(request.body).to.include('email');

            console.log(response);

            //expect(xhr.responseBody).to.have.property('name', "Using POST in cy.intercept()");
            expect(response.body).to.have.property('name', "Using POST in cy.intercept()");
            expect(response.body).to.have.property('body', "You can change the method used for cy.intercept() to be GET, POST, PUT, PATCH, or DELETE");

            expect(request.headers).to.have.property("content-type");
            expect(request.headers).to.have.property("content-length", "160");
            //expect(xhr.requestHeaders).to.have.property("Content-Type");
            expect(response.headers).to.have.property('connection');
            expect(request.headers).to.have.property('user-agent', "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36");
        });

    });

    it("PUT request", () => {

        //cy.route({
        cy.intercept({
            method: "PUT",
            url: "**/comments/*"
        },
            {
                statusCode: 404,
                body: { error: errorMessage },
                delay: 500
            }).as('putComment');

        cy.get('.network-put').click();

        cy.wait('@putComment');

        cy.get('.network-put-comment').should('contain', errorMessage);



    });

});