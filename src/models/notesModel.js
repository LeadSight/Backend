const pool = require('../helpers/db');
const NotFoundError = require('../exceptions/NotFoundError');

const NotesModel = {
    getNotesById: async(id) => {
        const query = `
        SELECT n.id, n.title, n.body
        FROM notes n
        JOIN customer_sales_notes csn 
            ON csn.note_id = n.id
        WHERE csn.customer_id = $1;
        `;

        const result = await pool.query(query, [id]);

        if (!result.rows.length) {
            throw new NotFoundError('Customer ID Not Registered');
        }
    },
    addNote: async({ noteId, title, body }) => {
        const query = `
        INSERT INTO notes (id, title, body)
        VALUES ($1, $2, $3)
        RETURNING id
        `;
        const result = await pool.query(query, [noteId, title, body]);
                
        return result.rows[0].id;
    },
    addCustomerSalesNotes: async({ id, customerId, salesId, noteId, }) => {
        const query = `
        INSERT INTO customer_sales_notes (id, customer_id, sales_id, note_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id
        `;
        const result = await pool.query(query, [id, customerId, salesId, noteId]);
                
        return result.rows[0].id;
    }
}

module.exports = NotesModel;