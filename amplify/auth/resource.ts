import { defineAuth, secret } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),
        clientSecret: secret('GOOGLE_CLIENT_SECRET'),
        scopes: ['email', 'openid', 'profile'],
        attributeMapping: {
          email: 'email',
          givenName: 'given_name',
          familyName: 'family_name',
        },
      },
      callbackUrls: [
        'http://localhost:3000/beta',
        'https://main.d1o5rb1rgoyo2l.amplifyapp.com/beta',
      ],
      logoutUrls: [
        'http://localhost:3000/',
        'https://main.d1o5rb1rgoyo2l.amplifyapp.com/',
      ],
    },
  },
});
