import axios from "axios";
import { showAlert } from "./alert";

const stripe = Stripe(
  "pk_test_51RyWx5LOctMSlRxe4EGWA322Tb0E2CwWg6IrScbiEE8YHW2y7oUbAVC8rMxBBI4R0twlvnhiMmadjqYuJy8uNfVh0057wPp2Cf",
);

export async function bookTour(tourId) {
  try {
    const url = `http://localhost:5500/api/v1/bookings/checkout-session/${tourId}`;
    const response = await axios.get(url);
    const { session } = response.data;
    await stripe.redirectToCheckout({ sessionId: session.id });
  } catch (error) {
    showAlert("error", error.response.data.message);
  }
}
