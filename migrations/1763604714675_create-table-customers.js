/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('customers', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    age: {
      type: 'INT',
      notNull: true,
    },
    job: {
      type: 'VARCHAR(15)',
      notNull: true,
    },
    marital: {
      type: 'VARCHAR(8)',
      notNull: true,
    },
    education: {
      type: 'VARCHAR(20)',
      notNull: true,
    },
    default: {
      type: 'VARCHAR(7)',
      notNull: true,
    },
    balance: {
      type: 'INT',
      notNull: true,
    },
    housing: {
      type: 'VARCHAR(7)',
      notNull: true,
    },
    loan: {
      type: 'VARCHAR(7)',
      notNull: true,
    },
    contact: {
      type: 'VARCHAR(9)',
      notNull: true,
    },
    day: {
      type: 'VARCHAR(3)',
      notNull: true,
    },
    month: {
      type: 'VARCHAR(3)',
      notNull: true,
    },
    duration: {
      type: 'INT',
      notNull: true,
    },
    campaign: {
      type: 'INT',
      notNull: true,
    },
    pdays: {
      type: 'INT',
      notNull: true,
    },
    previous: {
      type: 'INT',
      notNull: true,
    },
    poutcome: {
      type: 'VARCHAR(11)',
      notNull: true,
    },
    y: {
      type: 'VARCHAR(3)',
      notNull: true,
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('customers');
};