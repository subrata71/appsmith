/// <reference types="Cypress" />

import homePage from "../../../../locators/HomePage";

describe("Org Settings validation spec", function() {
  let orgid;
  let newOrganizationName;

  it("create org with long name should use ellipsis validation", function() {
    cy.NavigateToHome();
    cy.generateUUID().then((uid) => {
      orgid =
        "kadjhfkjadsjkfakjdscajdsnckjadsnckadsjcnanakdjsnckjdscnakjdscnnadjkncakjdsnckjadsnckajsdfkjadshfkjsdhfjkasdhfkjasdhfjkasdhjfasdjkfhjhdsfjhdsfjhadasdfasdfadsasdf" +
        uid;
      localStorage.setItem("OrgName", orgid);
      // create org with long name
      cy.createOrg();
      // stub the response and
      // find app name
      cy.wait("@createOrg").then((interception) => {
        newOrganizationName = interception.response.body.data.name;
        cy.renameOrg(newOrganizationName, orgid);
        cy.navigateToOrgSettings(orgid);
        // checking parent's(<a></a>) since the child(<span>) inherits css from it
        cy.get(homePage.orgHeaderName)
          .parent()
          .then((elem) => {
            assert.isBelow(elem[0].offsetWidth, elem[0].scrollWidth);
          })
          .should("have.css", "text-overflow", "ellipsis");
      });
    });
    cy.LogOut();
  });
});
