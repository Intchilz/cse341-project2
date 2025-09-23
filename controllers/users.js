const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;
const { userValidationRules, validate } = require('../middleware/validation');
const asyncHandler = require('../middleware/asyncHandler');

// Get all users
const getAll = asyncHandler(async (req, res) => {
  //#swagger.tags = ['Users']
  const result = await mongodb.getDatabase().db('project2').collection('users').find();
  const users = await result.toArray();
  res.status(200).json(users);
});

// Get single user
const getSingle = asyncHandler(async (req, res, next) => {
  //#swagger.tags = ['Users']
  let userId;
  try {
    userId = new ObjectId(req.params.id);
  } catch (err) {
    err.statusCode = 400;
    err.message = 'Invalid user ID format';
    throw err;
  }

  const result = await mongodb.getDatabase().db('project2').collection('users').find({ _id: userId });
  const user = await result.toArray();

  if (!user[0]) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json(user[0]);
});

// Create user
const createUser = [
  userValidationRules(),
  validate,
  asyncHandler(async (req, res) => {
    const user = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };

    const response = await mongodb.getDatabase().db('project2').collection('users').insertOne(user);
    if (!response.acknowledged) {
      const error = new Error('Failed to create user');
      error.statusCode = 500;
      throw error;
    }

    res.status(201).json(response);
  })
];

// Update user
const updateUser = [
  userValidationRules(),
  validate,
  asyncHandler(async (req, res) => {
    let userId;
    try {
      userId = new ObjectId(req.params.id);
    } catch (err) {
      err.statusCode = 400;
      err.message = 'Invalid user ID format';
      throw err;
    }

    const user = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };

    const response = await mongodb.getDatabase().db('project2').collection('users').replaceOne({ _id: userId }, user);

    if (response.modifiedCount === 0) {
      const error = new Error('No user updated — check ID');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(response);
  })
];

const deleteUser = asyncHandler(async (req, res) => {
  let userId;
  try {
    userId = new ObjectId(req.params.id);
  } catch (err) {
    err.statusCode = 400;
    err.message = 'Invalid user ID format';
    throw err;
  }

  const response = await mongodb.getDatabase().db('project2').collection('users').deleteOne({ _id: userId });

  if (response.deletedCount === 0) {
    const error = new Error('User not found or already deleted');
    error.statusCode = 404;
    throw error;
  }

  res.status(204).send();
});

module.exports = {
  getAll,
  getSingle,
  createUser,
  updateUser,
  deleteUser,
};
