const express = require('express');
const router = express.Router();
const stationsController = require('../controller/stationsController.js');

router.get('/', stationsController.getAll);
router.get('/:id', stationsController.getById);
router.post('/create', stationsController.create);
router.delete('/delete/:id', stationsController.delete);
router.patch('/modify/:id', stationsController.modify);

module.exports = router;
