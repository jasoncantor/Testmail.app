const GraphQLClient = require('graphql-request').GraphQLClient;
const testmailClient = new GraphQLClient(
  // API endpoint:
  'https://api.testmail.app/api/graphql',
  // Use your API key:
  { headers: { 'Authorization': '6fc8d7e0-aacb-427e-bbe4-f73ceb266b0b' } }
);
