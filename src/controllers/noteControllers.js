const response = require('../helpers/response');
const NotesModel = require('../models/notesModel');
const { nanoid } = require("nanoid");

const NotesValidator = require('../validator/notes');

const NoteController = {
    addNote: async (req, res) => {
        try {
            NotesValidator.validateNotePayload(req.body);
            
            const { title, body, createdAt, customerId, sales } = req.body;
            const noteId = `note-${nanoid(16)}`;
            const customerSalesNotesId = nanoid(16);

            const note = {
                noteId,
                title,
                body,
                createdAt,
                customerSalesNotesId,
                customerId,
                sales,
                noteId,
            };

            await NotesModel.addNote(note);
            
            return response(res, 'Note Added Successfully', 201, 'success', { noteId });
        } catch (err) {
            return response(res, 'Failed to Add Note', err.statusCode ? err.statusCode : 500, 'fail', { error: err.message });
        }
    },
    editNote: async (req, res) => {
        try {
            NotesValidator.validateEditNotePayload(req.body);
            const { id } = req.params;
            
            const { title, body } = req.body;

            const note = {
                id,
                title,
                body,
            };

            await NotesModel.editNote(note);
            
            return response(res, 'Note Edited Successfully', 200, 'success', { id });
        } catch (err) {
            return response(res, 'Failed to Edit Note', err.statusCode ? err.statusCode : 500, 'fail', { error: err.message });
        }
    },
    deleteNote: async (req, res) => {
        try {
            const { id } = req.params;

            await NotesModel.deleteNote(id);
            
            return response(res, 'Note Deleted Successfully', 200, 'success', { id });
        } catch (err) {
            return response(res, 'Failed to Delete Note', err.statusCode ? err.statusCode : 500, 'fail', { error: err.message });
        }
    }
};

module.exports = NoteController;