const express = require('express');
const router = express.Router();
const productionController = require('../controllers/productionController');

router.get('/', productionController.getAllProductions);
router.post('/', productionController.createProduction);
router.put('/:id', productionController.updateProduction);
router.delete('/:id', productionController.deleteProduction);

module.exports = router;
