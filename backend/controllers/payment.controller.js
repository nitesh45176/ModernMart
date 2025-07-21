import Order from "../models/order.model.js";
import { stripe } from "../lib/stripe.js";
import Coupon from "../models/coupon.model.js";

// 🔹 Create Stripe Checkout Session
export const createCheckoutSession = async (req, res) => {
	let stripeCouponId = null;
	console.log("✅ Stripe success_url is:", `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`);

	try {
		const { products, couponCode } = req.body;

		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ error: "Invalid or empty products array" });
		}

		let totalAmount = 0;

		const lineItems = products.map((product) => {
			const amount = Math.round(product.price * 100); // Stripe expects amount in cents
			totalAmount += amount * product.quantity;

			return {
				price_data: {
					currency: "usd",
					product_data: {
						name: product.name,
						images: [product.image],
					},
					unit_amount: amount,
				},
				quantity: product.quantity || 1,
			};
		});

		// 🔸 Check and apply coupon (if any)
		let coupon = null;
		if (couponCode) {
			coupon = await Coupon.findOne({
				code: couponCode,
				userId: req.user._id,
				isActive: true,
			});

			if (coupon) {
				totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);

				try {
					stripeCouponId = await createStripeCoupon(coupon.discountPercentage);
				} catch (err) {
					console.error("❌ Stripe coupon creation failed:", err.message);
					return res.status(500).json({ error: "Stripe coupon creation failed" });
				}
			}
		}

		// 🔹 Create Stripe checkout session
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",
			success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
			discounts: stripeCouponId ? [{ coupon: stripeCouponId }] : [],
			metadata: {
				userId: req.user._id.toString(),
				couponCode: couponCode || "",
				products: JSON.stringify(
					products.map((p) => ({
						id: p._id,
						quantity: p.quantity,
						price: p.price,
					}))
				),
			},
		});

		// 🔹 Gift a new coupon if totalAmount >= $200
		if (totalAmount >= 20000) {
			await createNewCoupon(req.user._id);
		}

		return res.status(200).json({
			id: session.id,
			totalAmount: totalAmount / 100,
		});
	} catch (error) {
		console.error("🔥 FULL Checkout Error 🔥", {
			message: error.message,
			stack: error.stack,
		});
		return res.status(500).json({ error: "Internal Server Error" });
	}
};

// 🔹 After successful payment
export const checkoutSuccess = async (req, res) => {
	try {
		const { sessionId } = req.body;
		const session = await stripe.checkout.sessions.retrieve(sessionId);

		if (session.payment_status === "paid") {
			// Deactivate used coupon (if any)
			if (session.metadata.couponCode) {
				await Coupon.findOneAndUpdate(
					{
						code: session.metadata.couponCode,
						userId: session.metadata.userId,
					},
					{
						isActive: false,
					}
				);
			}

			// Create order
			const products = JSON.parse(session.metadata.products);
			const newOrder = new Order({
				user: session.metadata.userId,
				products: products.map((product) => ({
					product: product.id,
					quantity: product.quantity,
					price: product.price,
				})),
				totalAmount: session.amount_total / 100,
				stripeSessionId: sessionId,
			});

			await newOrder.save();

			res.status(200).json({
				success: true,
				message: "Payment successful, order created, and coupon deactivated if used.",
				orderId: newOrder._id,
			});
		}
	} catch (error) {
		console.error("Error processing successful checkout:", error);
		res.status(500).json({
			message: "Error processing successful checkout",
			error: error.message,
		});
	}
};

// 🔸 Stripe coupon helper
async function createStripeCoupon(discountPercentage) {
	const coupon = await stripe.coupons.create({
		percent_off: discountPercentage,
		duration: "once",
	});
	return coupon.id;
}

// 🔸 Gift a new coupon if order was big
async function createNewCoupon(userId) {
	await Coupon.findOneAndDelete({ userId });

	const newCoupon = new Coupon({
		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
		discountPercentage: 10,
		expirationDates: [new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)], // 30 days from now
		isActive: true, // ✅ Add this
		userId: userId,
	});

	await newCoupon.save();
	return newCoupon;
}

