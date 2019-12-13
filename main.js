/*
 * End-to-end test: new user signup
 */

// Use any GraphQL client (or HTTP - but let's keep this simple)
const GraphQLClient = require('graphql-request').GraphQLClient;
const testmailClient = new GraphQLClient(
  // API endpoint:
  'https://api.testmail.app/api/graphql',
  // Use your API key:
  { headers: { 'Authorization': '6fc8d7e0-aacb-427e-bbe4-f73ceb266b0b' } }
);

// Randomly generating the tag
const ChanceJS = require('chance');
const chance = new ChanceJS();
const TAG = chance.string({
  length: 12,
  pool: 'abcdefghijklmnopqrstuvwxyz0123456789'
});

// Assuming "acmeinc" is your namespace
const TESTEMAIL = `mp716.${TAG}@inbox.testmail.app`;

// Use any test environment (ours is cypress)
context('Some testing suite', () => {
  context('Signup', () => {
    before(() => {
      // Your test signup page:
      cy.visit('http://localhost:8080/signup');
    });
    it('enter email', () => {
        cy.get('#emailinput')
          .type(TESTEMAIL);
      });
    it('click signup', () => {
      cy.get('#signupbutton')
        .click();
    });
  });
  context('Verify email', () => {
    let inbox;
    before((done) => {
      // Configure timeout
      this.timeout(1000 * 60 * 3); // three minutes
      // Query the inbox
      testmailClient.request(`{
        inbox (
          namespace:"acmeinc"
          tag:"${TAG}"
          livequery:true
        ) {
          result
          count
          emails {
            subject
            html
            text
          }
        }
      }`).then((data) => {
        inbox = data.inbox;
        done();
      }).catch((err) => {
        done(err);
      });
    });
    it('Should work', () => {
      expect(inbox.result).to.equal('success');
    });
    it('There should be one email in the inbox', () => {
      expect(inbox.count).to.equal(1);
    });
    it('Get the email verification link', () => {
      // Extract the verification link
      expect(inbox.emails[0].html).to.have.string('id="verifyemail"');
      const extract = /id="verifyemail">(.+?)<\//gi;
      const link = extract.exec(inbox.emails[0].html)[1];
      // Tada! Now we can proceed to test the link, etc.
    });
  });
});
