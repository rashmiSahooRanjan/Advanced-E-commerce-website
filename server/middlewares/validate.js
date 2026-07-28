import FlintError from "./errorMiddleware.js";

export const validate = (schema) => {
    return (req, res, next) => {

        const { error, value } =
            schema.validate(req.body, {
                abortEarly: true,
                stripUnknown: true
            });

        if (error) {
            return next(
                new FlintError(
                    error.details[0].message,
                    400
                )
            );
        }

        req.body = value;

        next();
    };
};