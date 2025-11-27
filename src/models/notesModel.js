const pool = require('../helpers/db');
const NotFoundError = require('../exceptions/NotFoundError');

const NotesModel = {
    getAllNotes: async () => {
        const query = `
        SELECT 
            n.id AS note_id,
            n.title, 
            n.body,
            n.created_at,
            csn.customer_id,
            u.username AS sales_username
        FROM notes n
        JOIN customer_sales_notes csn 
            ON csn.note_id = n.id
        JOIN users u
            ON u.id = csn.sales_id;
        `;

        const result = await pool.query(query);
        return result.rows;
    },
    addNote: async({ noteId, title, body, createdAt, customerSalesNotesId, customerId, sales }) => {
        const salesIdQuery = `SELECT id FROM users WHERE username = $1`;
        
        const result = await pool.query(salesIdQuery, [sales]);
        
        if (!result.rows.length) {
            throw new NotFoundError(`Failed to add Note. Invalid User ${result.rows[0]}`);
        }
        
        const salesId = result.rows[0].id;
        
        // Add to notes table
        const noteQuery = `
        INSERT INTO notes (id, title, body, created_at)
        VALUES ($1, $2, $3, $4)
        `;
        
        await pool.query(noteQuery, [noteId, title, body, createdAt]);
        
        // Add to customer_sales_notes table
        const relationQuery = `
        INSERT INTO customer_sales_notes (id, customer_id, sales_id, note_id)
        VALUES ($1, $2, $3, $4)
        `;
        
        await pool.query(relationQuery, [customerSalesNotesId, customerId, salesId, noteId]);

        return;
    },
    editNote: async({ id, title, body }) => {
        const query = `SELECT * FROM notes WHERE id = $1`;

        const noteExist = await pool.query(query, [id]);
        
        if (!noteExist.rows.length) {
            throw new NotFoundError('Note ID Not Registered');
        }
        
        const editQuery = ` UPDATE notes SET title = $1, body = $2 WHERE id = $3`;
        
        await pool.query(editQuery, [title, body, id]);
                
        return;
    },
    deleteNote: async(id) => {
        const query = `DELETE FROM notes WHERE id = $1 RETURNING id`;

        const results = await pool.query(query, [id]);

        if (!results.rowCount) {
            throw new NotFoundError('Note ID Not Registered');
        }

        return;
    }
}

module.exports = NotesModel;