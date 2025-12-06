/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('economic_indicators', {
    emp_var_rate: {
      type: 'DOUBLE PRECISION',
      notNull: true,
    },
    cons_price_idx: {
      type: 'DOUBLE PRECISION',
      notNull: true,
    },
    cons_conf_idx: {
      type: 'DOUBLE PRECISION',
      notNull: true,
    },
    euribor3m: {
      type: 'DOUBLE PRECISION',
      notNull: true,
    },
    nr_employed: {
      type: 'DOUBLE PRECISION',
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
  pgm.dropTable('economic_indicators');
};