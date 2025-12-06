const { Router } = require('express');
const NoteController = require('../controllers/noteControllers');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

/**
 * @swagger
 * /private/notes:
 *   post:
 *     summary: Create a new note
 *     description: Adds a new note associated with a specific customer.
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - body
 *               - createdAt
 *               - customerId
 *               - sales
 *             properties:
 *               title:
 *                 type: string
 *                 example: Follow-up Call
 *               body:
 *                 type: string
 *                 example: Called the client to discuss loan options.
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-01-30T10:15:00Z
 *               customerId:
 *                 type: string
 *                 example: customer-gXavd7PCPF
 *               sales:
 *                 type: string
 *                 example: johndoe@gmail.com
 *     responses:
 *       201:
 *         description: Note Added Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Note Added Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     noteId:
 *                       type: string
 *                       example: note-uSzKki3sIYefOxLz
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized — missing or invalid token
 *       500:
 *         description: Internal server error
 */
router.post('/notes', authMiddleware, NoteController.addNote);

/**
 * @swagger
 * /private/notes/{id}:
 *   put:
 *     summary: Update a note
 *     description: Updates the title and body of an existing note.
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the note to update
 *         schema:
 *           type: string
 *           example: note-uSzKki3sIYefOxLz
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Note Title
 *               body:
 *                 type: string
 *                 example: Updated body content of the note.
 *     responses:
 *       200:
 *         description: Note Edited Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Note Edited Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: note-uSzKki3sIYefOxLz
 *       400:
 *         description: Invalid request or validation error
 *       401:
 *         description: Unauthorized — missing or invalid token
 *       404:
 *         description: Note not found
 *       500:
 *         description: Internal server error
 */
router.put('/notes/:id', authMiddleware, NoteController.editNote);

/**
 * @swagger
 * /private/notes/{id}:
 *   delete:
 *     summary: Delete a note
 *     description: Deletes a note by its unique ID.
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the note to delete
 *         schema:
 *           type: string
 *           example: note-uSzKki3sIYefOxLz
 *     responses:
 *       200:
 *         description: Note Deleted Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Note Deleted Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: note-uSzKki3sIYefOxLz
 * 
 *       401:
 *         description: Unauthorized — missing or invalid access token
 *       404:
 *         description: Note not found
 *       500:
 *         description: Internal server error
 */
router.delete('/notes/:id', authMiddleware, NoteController.deleteNote);

module.exports = router;