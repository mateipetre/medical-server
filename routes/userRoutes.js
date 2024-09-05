import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Secret key for JWT
const JWT_SECRET = 'secret-key';

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET);

    res.json({ token, user: { id: user._id, givenName: user.givenName, familyName: user.familyName } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Current Session Route
router.get('/session/:username', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ id: user._id, givenName: user.givenName, familyName: user.familyName });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout Route (Optional)
router.post('/logout', (req, res) => {
  // Since we are using JWT, logging out can be managed by the client by simply deleting the token.
  // This endpoint can be used if you have server-side session management.
  res.json({ message: 'Logout successful' });
});

export default router;