const express = require('express');
const router = express.Router();

const contactsController = require('../controllers/patients');

router.get('/', contactsController.getAll);

router.get('/:id', contactsController.getSingle);

router.post('/', contactsController.createPatient);

router.put('/:id', contactsController.updatePatient);

router.delete('/:id', contactsController.deletePatient);

module.exports = router;

