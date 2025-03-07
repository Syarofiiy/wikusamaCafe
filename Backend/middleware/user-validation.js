const Joi = require(`joi`);

const validateUser = (request, response, next) => {
  const rules = Joi.object()
    .keys({
      nama_user: Joi.string().required().messages({
        "string.empty": `"nama_user" is required`,
      }),
      role: Joi.string()
        .valid(`admin`, `kasir`, `manager`)
        .required()
        .messages({
          "any.required": `"role" is required`,
          "any.only": `"role" must be one of [admin, kasir, manager]`,
        }),
      username: Joi.string().min(3).required().messages({
        "string.empty": `"username" is required`,
        "string.min": `"username" should have a minimum length of {#limit}`,
      }),
      password: Joi.string().min(6).required().messages({
        "string.empty": `"password" is required`,
        "string.min": `"password" should have a minimum length of {#limit}`,
      }),
    })
    .options({ abortEarly: false });

  let { error } = rules.validate(request.body);

  if (error != null) {
    let errMessage = error.details.map((it) => it.message).join(", ");

    return response.status(422).json({
      success: false,
      message: errMessage,
    });
  }
  next();
};

const validateLogin = (request, response, next) => {
  const rules = Joi.object()
    .keys({
      username: Joi.string().min(3).required().messages({
        "string.empty": `"username" is required`,
        "string.min": `"username" should have a minimum length of {#limit}`,
      }),
      password: Joi.string().min(6).required().messages({
        "string.empty": `"password" is required`,
        "string.min": `"password" should have a minimum length of {#limit}`,
      }),
    })
    .options({ abortEarly: false });

  let { error } = rules.validate(request.body);

  if (error != null) {
    let errMessage = error.details.map((it) => it.message).join(", ");

    return response.status(422).json({
      success: false,
      message: errMessage,
    });
  }
  next();
};
module.exports = { validateUser, validateLogin };
