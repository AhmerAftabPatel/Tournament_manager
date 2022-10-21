const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
    let errors = {};

    data.phone_number = !isEmpty(data.phone_number) ? data.phone_number : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if (!Validator.isLength(data.phone_number, { min: 10, max: 12 })) {
        errors.email = 'phone number is invalid';
    }

    if (Validator.isEmpty(data.phone_number)) {
        errors.phone_number = 'phone number field is required';
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};