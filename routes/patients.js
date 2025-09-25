const express = require('express');
const router = express.Router();

const contactsController = require('../controllers/patients');

const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', contactsController.getAll);

router.get('/:id', contactsController.getSingle);

router.post('/', isAuthenticated, contactsController.createPatient);

router.put('/:id', isAuthenticated, contactsController.updatePatient);

router.delete('/:id', isAuthenticated, contactsController.deletePatient);

module.exports = router;

