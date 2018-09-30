const ADMIN = {
  // all available threads
  THREADS: {
    ROOT: 0,
    PROVISIONING: 1,
    ISSUANCE: 2
  },
  // reverse lookup map/array for the threads
  THREAD_MAP: ['ROOT', 'PROVISIONING', 'ISSUANCE'],

  // all available operations
  OPERATIONS: {
    ADD_KEY: 0,
    REVOKE_KEY: 1,
    ISSUE_FUNDS: 2,
    DESTROY_FUNDS: 3
  },
  // reverse lookup map/array for the operations
  OPERATION_MAP: ['ADD_KEY', 'REVOKE_KEY', 'ISSUE_FUNDS', 'DESTROY_FUNDS'],

  // key types, grouped by thread
  KEY_TYPES: {
    ROOT: {
      PROVISIONING_KEY: 0,
      ISSUANCE_KEY: 1
    },
    PROVISIONING: {
      VALIDATOR_KEY: 2,
      ACCOUNT_SERVICE_PROVIDER_KEY: 3
    }
  },
  // reverse lookup map/array for the threads
  KEY_TYPE_MAP: [
    { thread: 'ROOT', type: 'PROVISIONING_KEY' },
    { thread: 'ROOT', type: 'ISSUANCE_KEY' },
    { thread: 'PROVISIONING', type: 'VALIDATOR_KEY' },
    { thread: 'PROVISIONING', type: 'ACCOUNT_SERVICE_PROVIDER_KEY' }
  ]
};

module.exports = ADMIN;
