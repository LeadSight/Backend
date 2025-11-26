const response = require('../helpers/response');
const NotesModel = require('../models/notesModel');
const { nanoid } = require("nanoid");

const NotesValidator = require('../validator/notes');

const NoteController = {
    getNotesById: async (req, res) => {
        try {
            const { id } = req.params;
            const notes = NotesModel.getNotesById(id);
            
            return response(res, 'Notes Fetched Successfully', 200, 'success', { notes });
        } catch (err) {
            return response(res, 'Failed to Fetch Notes', err.statusCode ? err.statusCode : 500, 'fail', { error: err.message });
        }
    },
    addNote: async (req, res) => {
        try {
            NotesValidator.validateNotePayload(req.body);
            NotesValidator.validateCustomerSalesNotePayload(req.body);
            const { title, body, salesId, customerId } = req.body;
            const noteId = `note-${nanoid(16)}`;

            const note = {
                noteId,
                title,
                body,
            };

            const id = nanoid(16);
            const customerSalesNotes = {
                id,
                customerId,
                salesId,
                noteId,
            };

            await NotesModel.addNote(note);
            await NotesModel.addCustomerSalesNotes(customerSalesNotes);
            
            return response(res, 'Notes Fetched Successfully', 201, 'success', { noteId });
        } catch (err) {
            return response(res, 'Failed to Fetch Notes', err.statusCode ? err.statusCode : 500, 'fail', { error: err.message });
        }
    }
};

module.exports = NoteController;