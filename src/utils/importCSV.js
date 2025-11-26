const fs = require("fs");
const csv = require("csv-parser");
const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const format = require("pg-format");
require("dotenv").config();

const pool = new Pool();

async function insertEconomicIndicators(client, rows) {
  try {
    await client.query("BEGIN");

    const insertQuery = `
      INSERT INTO economic_indicators
      (emp_var_rate, cons_price_idx, cons_conf_idx, euribor3m, nr_employed)
      VALUES %L
    `;

    const values = rows.map((r) => [
      r.emp_var_rate,
      r.cons_price_idx,
      r.cons_conf_idx,
      r.euribor3m,
      r.nr_employed,
    ]);

    const sql = format(insertQuery, values);

    await client.query(sql);
    await client.query("COMMIT");

    console.log("✅ Import successful!");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  }
}

async function insertCustomers(client, rows) {
  try {
    await client.query("BEGIN");

    const insertQuery = `
      INSERT INTO customers
      (id, name, age, job, marital, education, "default", balance, housing, loan, contact, day, month, duration, campaign, pdays, previous, poutcome, y)
      VALUES %L
    `;

    const values = rows.map((r) => [
      r.id,
      r.name,
      r.age,
      r.job,
      r.marital,
      r.education,
      r.default,
      r.balance,
      r.housing,
      r.loan,
      r.contact,
      r.day,
      r.month,
      r.duration,
      r.campaign,
      r.pdays,
      r.previous,
      r.poutcome,
      r.y,
    ]);

    const sql = format(insertQuery, values);

    await client.query(sql);
    await client.query("COMMIT");

    console.log("✅ Import successful!");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  }
}

async function importCSV() {
  const toInt = (value) => {
    const num = parseInt(value);
    return Number.isNaN(num) ? 0 : num;
  };

  const toDouble = (value) => {
    const num = parseFloat(value);
    return Number.isNaN(num) ? 0 : num;
  }


  const client = await pool.connect();
  const rows = [];

  console.log("📥 Reading CSV file...");

  return new Promise((resolve, reject) => {
    fs.createReadStream("./src/utils/bank-additional-full.csv")
      .pipe(csv({ separator: ';' }))
      .on("data", (row) => {
        rows.push({
          id: `customer-${nanoid(10)}`,
          name: row.name || "unnamed",
          age: toInt(row.age),
          job: row.job,
          marital: row.marital,
          education: row.education,
          default: row.default,
          balance: toInt(row.balance) || 0,
          housing: row.housing,
          loan: row.loan,
          contact: row.contact,
          day: row.day_of_week,
          month: row.month,
          duration: toInt(row.duration),
          campaign: toInt(row.campaign),
          pdays: toInt(row.pdays),
          previous: toInt(row.previous),
          poutcome: row.poutcome,
          emp_var_rate: toDouble(row['emp.var.rate']),
          cons_price_idx: toDouble(row['cons.price.idx']),
          cons_conf_idx: toDouble(row['cons.conf.idx']),
          euribor3m: toDouble(row['euribor3m']),
          nr_employed: toDouble(row['nr.employed']),
          y: row.y,
        });
      })
      .on("end", async () => {
        console.log(`📄 CSV Loaded: ${rows.length} rows`);
        console.log("📤 Inserting data into PostgreSQL...");

        // await insertCustomers(client, rows);
        try {
          await insertEconomicIndicators(client, rows);
          resolve();
        } catch (err) {
          console.error("❌ Import failed:", err);
          reject(err);
        } finally {
          client.release();
        }
      });
  });
}

importCSV();