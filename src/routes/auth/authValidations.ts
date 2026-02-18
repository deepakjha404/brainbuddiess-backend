import joi from "joi";

const Register = joi.object().keys({
  name: joi.string().trim().required(),
  email: joi.string().trim().required(),
  role: joi.string().trim().required(),
  avtar: joi.string().trim().required(),
});

export { Register };
