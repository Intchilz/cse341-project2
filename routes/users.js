const express = require('express');
const router = express.Router();

const contactsController = require('../controllers/users');

const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', contactsController.getAll);

router.get('/:id', contactsController.getSingle);

router.post('/', isAuthenticated, contactsController.createUser);

router.put('/:id', isAuthenticated, contactsController.updateUser);

router.delete('/:id', isAuthenticated, contactsController.deleteUser);

module.exports = router;

