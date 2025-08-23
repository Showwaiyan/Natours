const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Tour = require("../models/tourModel");
const catchAsync = require("../utilities/catchAsync");
const Booking = require("../models/bookingModel");
const factory = require("./handlerFactory");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // Find the Tour
  const tour = await Tour.findById(req.params.tourId);

  // Create a session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    client_reference_id: req.params.tourId,
    customer_email: req.user.email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [
              `${req.protocol}://${req.get("host")}/img/tours/${tour.imageCover}`,
            ],
          },
          unit_amount: tour.price * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/?tour=${tour.id}&user=${req.user.id}&price=${tour.price}`, // Don't use this, only for play around and test purpose. Not secure exactly.
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slugify}`,
  });

  // Respond the session
  res.status(200).json({
    status: "success",
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // This middleware is only for local testing purpose, NOT SECURE
  const { tour, user, price } = req.query;

  if (!tour || !user || !price) return next();
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split("?")[0]);
});

exports.getAllBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking, [
  {
    path: "user",
  },
  {
    path: "tour",
  },
]);
exports.createBooking = factory.createOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
