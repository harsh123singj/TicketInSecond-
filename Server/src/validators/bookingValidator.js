import Joi from "joi";

export const createBookingSchema = Joi.object({
    eventId: Joi.number()
        .integer()
        .positive()
        .required(),

    seatNumber: Joi.string()
        .trim()
        .min(2)
        .max(10)
        .required(),

    paymentMethod: Joi.string()
        .valid("CARD", "UPI", "CASH" ,"FAIL")
        .required()
});