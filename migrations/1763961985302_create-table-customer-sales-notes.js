/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('customer_sales_notes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    customer_id: {
      type: 'VARCHAR(50)',
      references: 'customers(id)',
    },
    sales_id: {
      type: 'VARCHAR(50)',
      references: 'users(id)',
    },
    note_id: {
      type: 'VARCHAR(50)',
      references: 'notes(id)',
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('customer_sales_notes');
};