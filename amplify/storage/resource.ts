import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'zenithStorage',
  access: (allow) => ({
    'avatars/{identity_id}/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
    'public/*': [
      allow.authenticated.to(['read', 'write']),
      allow.guest.to(['read']),
    ],
  }),
});
