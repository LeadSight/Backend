const { Router } = require('express');
const promptController = require('../controllers/prompt.contollers');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.post('/prompt', authMiddleware, promptController.generateInsight);

module.exports = router;