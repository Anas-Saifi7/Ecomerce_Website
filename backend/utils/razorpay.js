import Razorpay from 'razorpay';

export const isRazorpayConfigured = () =>
  Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

export const getRazorpayClient = () => {
  if (!isRazorpayConfigured()) {
    const error = new Error('Payment gateway is not configured');
    error.statusCode = 503;
    throw error;
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};
