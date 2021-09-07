const joi = require("joi");

let validator = {};

validator.toggleWishlist = (obj) => {
  const schema = joi.object({
    userid: joi.string().length(36).required(),
    _id: joi.number().min(1).required(),
    name: joi.string().required(),
    rating: joi.number().min(1).max(5).required(),
    price: joi.number().min(1).required(),
    image: joi.string().required(),
    discount: joi.number().min(0).max(100).required(),
    idealFor: joi.string().valid("men", "women", "kids").required(),
  });
  const { error, value } = schema.validate(obj);
  if (error) return false;
  else return true;
};
validator.getAttendance = (id) => {
  const schema = joi.string().required();
  const { error, value } = schema.validate(id);
  if (error) return false;
  else return true;
};

module.exports = validator;
