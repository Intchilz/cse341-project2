const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// Import validation middleware
const { patientValidationRules, validate } = require('../middleware/validation');
const asyncHandler = require('../middleware/asyncHandler'); // reuse asyncHandler

// Get all patients
const getAll = asyncHandler(async (req, res) => {
    //#swagger.tags = ['Patients']
    const result = await mongodb.getDatabase().db('project2').collection('patient').find();
    const patients = await result.toArray();
    res.status(200).json(patients);
});

// Get single patient
const getSingle = asyncHandler(async (req, res) => {
    //#swagger.tags = ['Patients']
    let patientId;
    try {
        patientId = new ObjectId(req.params.id);
    } catch (err) {
        err.statusCode = 400;
        err.message = 'Invalid patient ID format';
        throw err;
    }

    const result = await mongodb.getDatabase().db('project2').collection('patient').find({ _id: patientId });
    const patient = await result.toArray();

    if (!patient[0]) {
        const error = new Error('Patient not found');
        error.statusCode = 404;
        throw error;
    }

    res.status(200).json(patient[0]);
});

// Create patient with validation
const createPatient = [
    patientValidationRules(),
    validate,
    asyncHandler(async (req, res) => {
        //#swagger.tags = ['Patients']
        const patient = {
            firstName: req.body.fName,
            lastName: req.body.lName,
            Birthday: req.body.birthdate,
            maritalStatus: req.body.maritalStatus,
            contact: req.body.contact,
            email: req.body.email,
            caseHistory: req.body.caseHistory,
        };

        const response = await mongodb.getDatabase().db('project2').collection('patient').insertOne(patient);
        if (!response.acknowledged) {
            const error = new Error('Failed to create patient');
            error.statusCode = 500;
            throw error;
        }

        res.status(201).json(response);
    })
];

// Update patient with validation
const updatePatient = [
    patientValidationRules(),
    validate,
    asyncHandler(async (req, res) => {
        //#swagger.tags = ['Patients']
        let patientId;
        try {
            patientId = new ObjectId(req.params.id);
        } catch (err) {
            err.statusCode = 400;
            err.message = 'Invalid patient ID format';
            throw err;
        }

        const patient = {
            firstName: req.body.fName,
            lastName: req.body.lName,
            Birthday: req.body.birthdate,
            maritalStatus: req.body.maritalStatus,
            contact: req.body.contact,
            email: req.body.email,
            caseHistory: req.body.caseHistory,
        };

        const response = await mongodb.getDatabase().db('project2').collection('patient').replaceOne({ _id: patientId }, patient);
        if (response.modifiedCount === 0) {
            const error = new Error('No patient updated — check ID');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json(response);
    })
];

// Delete patient
const deletePatient = asyncHandler(async (req, res) => {
    //#swagger.tags = ['Patients']
    let patientId;
    try {
        patientId = new ObjectId(req.params.id);
    } catch (err) {
        err.statusCode = 400;
        err.message = 'Invalid patient ID format';
        throw err;
    }

    const response = await mongodb.getDatabase().db('project2').collection('patient').deleteOne({ _id: patientId });

    if (response.deletedCount === 0) {
        const error = new Error('Patient not found or already deleted');
        error.statusCode = 404;
        throw error;
    }

    res.status(204).send();
});

module.exports = {
    getAll,
    getSingle,
    createPatient,
    updatePatient,
    deletePatient,
};
