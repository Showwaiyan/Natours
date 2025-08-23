const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Tour = require("../models/tourModel");
const catchAsync = require("../utilities/catchAsync");
const Booking = require("../models/bookingModel");

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
              "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Ftour-group&psig=AOvVaw04mSsEB3eUDoEn9KoQToCA&ust=1755920526318000&source=images&opi=89978449",
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
