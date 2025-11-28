const { Router } = require('express');
const AuthController = require('../controllers/authControllers');
const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login to the system
 *     description: Authenticates user and returns an access token ( also sets a refresh token into the cookie)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 * /auth/refresh-token:
 *   put:
 *     summary: Refresh an expired access token
 *     description: |
 *       This endpoint issues a new access token if a valid refresh token cookie is provided.
 *       It will:
 *         - Validate and delete expired refresh tokens from the DB.
 *         - Verify the current refresh token.
 *         - Issue a new access token.
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Access token successfully refreshed.
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
 *                   example: Access token renewed
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Missing or invalid refresh token.
 *       403:
 *         description: Refresh token expired or unauthorized.
 *       500:
 *         description: Internal server error.
 */
router.put('/refresh', AuthController.refreshToken);


/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout the current user
 *     description: |
 *       Logs out the user by deleting the refresh token from the database and clearing the cookie.
 *       This effectively invalidates the user's session and prevents further token refreshes.
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout successful. The refresh token is deleted and cookie cleared.
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
 *                   example: Logout successful
 *       400:
 *         description: Missing or invalid refresh token cookie.
 *       500:
 *         description: Internal server error during logout.
 */
router.post('/logout', AuthController.logout);

/**
 * @swagger
 * /auth/uname:
 *   post:
 *     summary: Verify if a username (or email) exists
 *     description: |
 *       Checks whether a given username or email exists in the database.  
 *       Useful for features like password reset or signup validation.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Username or email exists.
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
 *                   example: Username Exists
 *                 data:
 *                   type: object
 *                   properties:
 *                     result:
 *                       type: boolean
 *                       example: true
 *       404:
 *         description: Username not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 message:
 *                   type: string
 *                   example: Username not found
 *       500:
 *         description: Internal server error.
 */
router.post('/uname', AuthController.verifyUsername);

/**
 * @swagger
 * /auth/reset:
 *   put:
 *     summary: Reset user password
 *     description: |
 *       Allows a user to reset their password using their username (or email).  
 *       Typically used after verifying that the username exists.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "newSecurePass123"
 *     responses:
 *       200:
 *         description: Password reset successfully.
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
 *                   example: Password Reset
 *                 data:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: "user@example.com"
 *       400:
 *         description: Invalid request payload (validation failed).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 message:
 *                   type: string
 *                   example: Invalid request payload
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 message:
 *                   type: string
 *                   example: Password reset failed
 */
router.put('/reset', AuthController.resetPassword);

module.exports = router;