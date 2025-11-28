const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const bcrypt = require('bcrypt');

require("dotenv").config();

const pool = new Pool();

async function addSuperUser() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const id = `user-${nanoid(16)}`;
    const username = "user1@gmail.com";
    const hashedPassword = await bcrypt.hash("pass1", 10);

    const insertQuery = `
      INSERT INTO users (id, username, password)
      VALUES ($1, $2, $3)
    `;

    await client.query(insertQuery, [id, username, hashedPassword]);

    await client.query("COMMIT");
    console.log("Superuser created:", username);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error creating superuser:", err);
  } finally {
    client.release();
    process.exit(0);
  }
}

addSuperUser();