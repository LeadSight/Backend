const supabase = require('../helpers/db');
const NotFoundError = require('../exceptions/NotFoundError');

const NotesModel = {
    getAllNotes: async () => {
        const { data, error } = await supabase
            .from('notes')
            .select(`
                id,
                title,
                body,
                created_at,
                customer_sales_notes (
                    customer_id,
                    users (
                        username
                    )
                )
            `);

        if (error) throw error;

        const formatted = data.map(n => ({
            note_id: n.id,
            title: n.title,
            body: n.body,
            created_at: n.created_at,
            customer_id: n.customer_sales_notes?.customer_id ?? null,
            sales_username: n.customer_sales_notes?.users?.username ?? null,
        }));

        return formatted;
    },
    addNote: async({ noteId, title, body, createdAt, customerSalesNotesId, customerId, sales }) => {
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('username', sales)
            .limit(1);

        if (userError) throw userError;
        if (!userData || userData.length === 0) {
            throw new NotFoundError(`Failed to add Note. Invalid User ${sales}`);
        }

        const salesId = userData[0].id;

        // Insert into notes
        const { error: noteError } = await supabase
            .from('notes')
            .insert([
                {
                    id: noteId,
                    title: title,
                    body: body,
                    created_at: createdAt,
                }
            ]);

        if (noteError) throw noteError;

        // Insert into customer_sales_notes
        const { error: relError } = await supabase
            .from('customer_sales_notes')
            .insert([
                {
                    id: customerSalesNotesId,
                    customer_id: customerId,
                    sales_id: salesId,
                    note_id: noteId,
                }
            ]);

        if (relError) throw relError;

        return;
    },
    editNote: async({ id, title, body }) => {
        // Validate note exists
        const { data: existing, error: selectError } = await supabase
            .from('notes')
            .select('id')
            .eq('id', id)
            .limit(1);

        if (selectError) throw selectError;

        if (!existing || existing.length === 0) {
            throw new NotFoundError('Note ID Not Registered');
        }

        // Update
        const { error: updateError } = await supabase
            .from('notes')
            .update({
                title,
                body
            })
            .eq('id', id);

        if (updateError) throw updateError;

        return;
    },
    deleteNote: async(id) => {
        const { data, error } = await supabase
            .from('notes')
            .delete()
            .eq('id', id)
            .select('id')
            .limit(1);

        if (error) throw error;

        if (!data || data.length === 0) {
            throw new NotFoundError('Note ID Not Registered');
        }

        return;
    }
}

module.exports = NotesModel;