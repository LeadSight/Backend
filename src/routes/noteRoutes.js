const { Router } = require('express');
const NoteController = require('../controllers/noteControllers');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.get('/notes/:id', authMiddleware, NoteController.getNotesById);
router.post('/notes', authMiddleware, NoteController.addNote);

module.exports = router;