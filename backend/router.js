const express = require("express");
const router = express.Router();

// Protected routes
router.get('/users/:id');
router.get('/users');
router.delete('/users/:id');
router.put('/users/:id');
router.post('/users');

module.exports = router;
