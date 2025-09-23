const { body, validationResult } = require('express-validator');

// ✅ Validation rules for patients
const patientValidationRules = () => {
  return [
    body('fName').notEmpty().withMessage('First name is required'),
    body('lName').notEmpty().withMessage('Last name is required'),
    body('birthdate').isISO8601().withMessage('Birthday must be a valid date'),
    body('maritalStatus').isIn(['single', 'married', 'divorced', 'widowed'])
      .withMessage('Marital status must be single, married, divorced, or widowed'),
    body('contact').isLength({ min: 6 }).withMessage('Contact must be at least 6 characters'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('caseHistory').optional().isString().withMessage('Case history must be a string'),
  ];
};

// ✅ NEW: Validation rules for users
const userValidationRules = () => {
  return [
    // name must not be empty
    body('name').notEmpty().withMessage('Name is required'),

    // email must be valid
    body('email').isEmail().withMessage('Valid email is required'),

    // role must be one of the allowed roles
    body('role').isIn(['admin', 'doctor', 'nurse', 'receptionist', 'accountant'])
      .withMessage('Role must be admin, doctor, nurse, accountant or receptionist'),
  ];
};

// ✅ Generic validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = {
  patientValidationRules, 
  userValidationRules, 
  validate,
};
