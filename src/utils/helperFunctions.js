/* eslint-disable linebreak-style */
exports.IsValuePresentInArray = (array, field, value) => array.some((statusArray) => statusArray[field] === value);
