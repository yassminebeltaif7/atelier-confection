const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

router.get('/items', stockController.getAllItems);
router.post('/items', stockController.createItem);
router.put('/items/:id', stockController.updateItem);
router.delete('/items/:id', stockController.deleteItem);

router.get('/movements', stockController.getAllMovements);
router.post('/movements', stockController.createMovement);

module.exports = router;