"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart";
import { motion } from "framer-motion";
import { CreditCard, Truck, ShoppingBag, MapPin, User, Phone, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { users } from "@/lib/api";

interface UserProfile {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: {
        address?: string;
        city?: string;
        state?: string;
        pincode?: string;
    } | null;
}

export default function CheckoutPage() {
    const { items, total, subtotal, discount, clearCart } = useCartStore();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<string>("");
    const [checkoutStep, setCheckoutStep] = useState<"details" | "payment">("details");
    const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
    const [paymentError, setPaymentError] = useState<string>("");
    const [paymentSuccess, setPaymentSuccess] = useState<string>("");

    // Form State
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Check if user is logged in and fetch profile data
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            users.me()
                .then((response) => {
                    const userData = response.data;
                    setUser(userData);

                    // Auto-fill form with user data
                    setFormData({
                        fullName: userData.name || "",
                        email: userData.email || "",
                        phone: userData.phone || "",
                        address: userData.address?.address || "",
                        city: userData.address?.city || "",
                        state: userData.address?.state || "",
                        pincode: userData.address?.pincode || ""
                    });

                    // If user has saved address, set it as selected
                    if (userData.address) {
                        setSelectedAddress("saved");
                    }
                })
                .catch((error) => {
                    console.error("Failed to fetch user data:", error);
                    // User not logged in, continue with empty form
                });
        }
    }, []);

    const handleAddressSelect = (addressType: string) => {
        setSelectedAddress(addressType);
        if (addressType === "saved" && user?.address) {
            setFormData({
                ...formData,
                address: user.address.address || "",
                city: user.address.city || "",
                state: user.address.state || "",
                pincode: user.address.pincode || ""
            });
        } else if (addressType === "new") {
            // Clear address fields for new address entry
            setFormData({
                ...formData,
                address: "",
                city: "",
                state: "",
                pincode: ""
            });
        }
    };

    const handleContinueToPayment = (e: React.FormEvent) => {
        e.preventDefault();
        setCheckoutStep("payment");
    };

    const handlePlaceOrder = async () => {
        setIsProcessing(true);
        setPaymentError('');
        setPaymentSuccess('');

        try {
            if (paymentMethod === "online") {
                // Initialize Razorpay payment
                await initiateRazorpayPayment();
            } else {
                // COD - Place order directly
                await placeOrder();
            }
        } catch (error) {
            console.error("Payment/Order error:", error);
            setIsProcessing(false);
        }
    };

    const initiateRazorpayPayment = async () => {
        try {
            // Step 1: Create order through backend
            const headers: Record<string, string> = {
                'Content-Type': 'application/json'
            };

            // Only add Authorization header if token exists (for logged-in users)
            const token = localStorage.getItem('token');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const orderResponse = await fetch('http://127.0.0.1:8000/api/v1/orders/', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    items: items.map(item => ({
                        product_id: item.id,
                        quantity: item.quantity
                    })),
                    shipping_address: {
                        full_name: formData.fullName,
                        email: formData.email,
                        phone: formData.phone,
                        address: formData.address,
                        city: formData.city,
                        state: formData.state,
                        pincode: formData.pincode
                    },
                    payment_method: 'online'
                })
            });

            if (!orderResponse.ok) {
                throw new Error('Failed to create order');
            }

            const order = await orderResponse.json();

            // Step 2: Get Razorpay order details from backend
            const paymentHeaders: Record<string, string> = {};

            // Only add Authorization header if token exists (for logged-in users)
            const token = localStorage.getItem('token');
            if (token) {
                paymentHeaders['Authorization'] = `Bearer ${token}`;
            }

            const paymentResponse = await fetch(`http://127.0.0.1:8000/api/v1/payment/create-order?amount=${order.final_amount}`, {
                method: 'POST',
                headers: paymentHeaders
            });

            if (!paymentResponse.ok) {
                throw new Error('Failed to create payment order');
            }

            const razorpayOrder = await paymentResponse.json();

            // Step 3: Initialize Razorpay Checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_RpmbLNWYTAOaex',
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                order_id: razorpayOrder.id, // Use Razorpay order ID
                name: 'Prashayan',
                description: `Order ${order.order_id}`,
                handler: function (response: any) {
                    // Payment successful - proceed to order success page
                    const orderData = {
                        orderId: order.order_id,
                        items,
                        total: order.final_amount,
                        subtotal: subtotal(),
                        discount,
                        customer: formData,
                        paymentMethod: 'online',
                        status: "order placed",
                        date: new Date().toLocaleDateString(),
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature
                    };
                    localStorage.setItem("lastOrder", JSON.stringify(orderData));
                    clearCart();
                    router.push(`/order-success/${order.order_id}`);
                },
                prefill: {
                    name: order.shipping_address.full_name,
                    email: order.shipping_address.email,
                    contact: order.shipping_address.phone
                },
                notes: {
                    internal_order_id: order.id.toString() // Links payment to backend order
                },
                theme: {
                    color: '#2E5C55'
                },
                modal: {
                    ondismiss: function() {
                        setIsProcessing(false);
                        setPaymentError('Payment cancelled. Please try again.');
                    }
                }
            };

            const rzp = new (window as any).Razorpay(options);

            // Handle payment failure
            rzp.on('payment.failed', function (response: any) {
                console.error('Payment failed:', response);
                setIsProcessing(false);
                setPaymentError('Payment failed. Please try again.');
                setPaymentSuccess('');
            });

            rzp.open();
        } catch (error) {
            console.error('Razorpay initialization failed:', error);
            setIsProcessing(false);
            setPaymentError('Payment initialization failed. Please try again.');
        }
    };


    const placeOrder = async () => {
        setIsProcessing(true);
        setPaymentError('');

        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/orders/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify({
                    items: items.map(item => ({
                        product_id: item.id,
                        quantity: item.quantity
                    })),
                    shipping_address: {
                        full_name: formData.fullName,
                        email: formData.email,
                        phone: formData.phone,
                        address: formData.address,
                        city: formData.city,
                        state: formData.state,
                        pincode: formData.pincode
                    },
                    payment_method: 'cod'
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to place order');
            }

            const order = await response.json();
            const orderId = order.order_number || `PR${order.id}`;

            // Store order data in session/local storage for the success page demo
            const orderData = {
                orderId,
                items,
                total: order.final_amount,
                subtotal: subtotal(),
                discount,
                customer: formData,
                paymentMethod,
                shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
                status: "order placed",
                date: new Date().toLocaleDateString()
            };
            localStorage.setItem("lastOrder", JSON.stringify(orderData));

            setIsProcessing(false);
            clearCart();
            router.push(`/order-success/${orderId}`);
        } catch (error) {
            console.error("Order error:", error);
            setPaymentError(error instanceof Error ? error.message : "Failed to place order");
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        return (
            <main className="min-h-screen bg-secondary">
                <div className="container mx-auto px-6 pt-32 text-center">
                    <p className="text-primary/60 text-lg mb-6">Your cart is empty.</p>
                    <Link href="/products" className="bg-primary text-secondary px-8 py-3 rounded-full font-bold">
                        Browse Products
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-secondary">
            <div className="container mx-auto px-6 pt-32 pb-20">
                <Link href="/cart" className="inline-flex items-center text-primary/60 hover:text-primary mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
                </Link>

                <h1 className="text-4xl font-serif font-bold text-primary mb-10">
                    {checkoutStep === "payment" ? "Review & Payment" : "Checkout"}
                </h1>

                {/* Step Indicator */}
                <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center space-x-4">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                            checkoutStep === "details" || checkoutStep === "payment"
                                ? "bg-tertiary text-secondary"
                                : "bg-primary/20 text-primary/60"
                        }`}>
                            1
                        </div>
                        <div className={`h-px w-12 ${
                            checkoutStep === "payment" ? "bg-tertiary" : "bg-primary/20"
                        }`}></div>
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                            checkoutStep === "payment"
                                ? "bg-tertiary text-secondary"
                                : "bg-primary/20 text-primary/60"
                        }`}>
                            2
                        </div>
                    </div>
                    <div className="ml-4 text-sm text-primary/60">
                        <span className={checkoutStep === "details" ? "text-tertiary font-medium" : ""}>Shipping Details</span>
                        <span className="mx-2">→</span>
                        <span className={checkoutStep === "payment" ? "text-tertiary font-medium" : ""}>Payment</span>
                    </div>
                </div>

                <form onSubmit={checkoutStep === "details" ? handleContinueToPayment : handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-7">
                        {checkoutStep === "details" ? (
                            <div className="space-y-8">
                                <section className="bg-white p-8 rounded-3xl shadow-sm border border-primary/5">
                            <h2 className="text-xl font-serif font-bold text-primary mb-6 flex items-center gap-2">
                                <User className="w-5 h-5 text-tertiary" /> Customer Information
                                {user && <span className="text-xs bg-tertiary/10 text-tertiary px-2 py-1 rounded-full ml-2">Auto-filled</span>}
                            </h2>
                            {user && (
                                <p className="text-xs text-primary/60 mb-4">
                                    Your information is auto-filled from your account. You can edit it if needed.
                                </p>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-primary/60">Full Name</label>
                                    <input
                                        required name="fullName" value={formData.fullName} onChange={handleChange}
                                        className="w-full bg-secondary/50 border border-primary/10 rounded-xl px-4 py-3 outline-none focus:border-tertiary"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-primary/60">Email Address</label>
                                    <input
                                        required type="email" name="email" value={formData.email} onChange={handleChange}
                                        className="w-full bg-secondary/50 border border-primary/10 rounded-xl px-4 py-3 outline-none focus:border-tertiary"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-primary/60">Phone Number</label>
                                    <input
                                        required type="tel" name="phone" value={formData.phone} onChange={handleChange}
                                        className="w-full bg-secondary/50 border border-primary/10 rounded-xl px-4 py-3 outline-none focus:border-tertiary"
                                        placeholder="+91 9876543210"
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="bg-white p-8 rounded-3xl shadow-sm border border-primary/5">
                            <h2 className="text-xl font-serif font-bold text-primary mb-6 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-tertiary" /> Shipping Address
                            </h2>

                            {/* Address Selection - Only show if user is logged in and has saved address */}
                            {user?.address && (
                                <div className="mb-6 p-4 bg-secondary/30 rounded-xl border border-primary/10">
                                    <h3 className="text-sm font-semibold text-primary mb-3">Choose Address</h3>
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleAddressSelect("saved")}
                                            className={`flex-1 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                                                selectedAddress === "saved"
                                                    ? "bg-tertiary text-secondary border-tertiary"
                                                    : "bg-white border-primary/20 text-primary hover:border-tertiary"
                                            }`}
                                        >
                                            Use Saved Address
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleAddressSelect("new")}
                                            className={`flex-1 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                                                selectedAddress === "new"
                                                    ? "bg-tertiary text-secondary border-tertiary"
                                                    : "bg-white border-primary/20 text-primary hover:border-tertiary"
                                            }`}
                                        >
                                            Enter New Address
                                        </button>
                                    </div>

                                    {selectedAddress === "saved" && user.address && (
                                        <div className="mt-3 p-3 bg-tertiary/10 rounded-lg border border-tertiary/20">
                                            <p className="text-sm text-primary font-medium">{user.name}</p>
                                            <p className="text-xs text-primary/70 mt-1">
                                                {user.address.address}<br />
                                                {user.address.city}, {user.address.state} - {user.address.pincode}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-primary/60">Street Address</label>
                                    <textarea
                                        required name="address" value={formData.address} onChange={handleChange}
                                        className="w-full bg-secondary/50 border border-primary/10 rounded-xl px-4 py-3 outline-none focus:border-tertiary h-24 resize-none"
                                        placeholder="Suite, House No, Street name"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-primary/60">City</label>
                                        <input
                                            required name="city" value={formData.city} onChange={handleChange}
                                            className="w-full bg-secondary/50 border border-primary/10 rounded-xl px-4 py-3 outline-none focus:border-tertiary"
                                            placeholder="Mumbai"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-primary/60">State</label>
                                        <input
                                            required name="state" value={formData.state} onChange={handleChange}
                                            className="w-full bg-secondary/50 border border-primary/10 rounded-xl px-4 py-3 outline-none focus:border-tertiary"
                                            placeholder="Maharashtra"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-primary/60">Pincode</label>
                                        <input
                                            required name="pincode" value={formData.pincode} onChange={handleChange}
                                            className="w-full bg-secondary/50 border border-primary/10 rounded-xl px-4 py-3 outline-none focus:border-tertiary"
                                            placeholder="400001"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* Payment Step */}
                                <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white p-8 rounded-3xl shadow-sm border border-primary/5 space-y-8"
                            >
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-serif font-bold text-primary flex items-center gap-2">
                                        <CreditCard className="w-5 h-5 text-tertiary" /> Payment Method
                                    </h2>
                                    <button
                                        onClick={() => setCheckoutStep("details")}
                                        className="text-primary/60 hover:text-primary text-sm underline"
                                    >
                                        ← Back to details
                                    </button>
                                </div>

                                {/* Payment Messages */}
                                {paymentError && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                        <p className="text-red-600 text-sm font-medium">{paymentError}</p>
                                    </div>
                                )}
                                {paymentSuccess && (
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                                        <p className="text-green-600 text-sm font-medium">{paymentSuccess}</p>
                                    </div>
                                )}

                                {/* Payment Method Selection */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-primary">Choose Payment Method</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod("cod")}
                                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                                                paymentMethod === "cod"
                                                    ? "border-tertiary bg-tertiary/5 text-primary"
                                                    : "border-primary/10 bg-secondary/30 text-primary/70 hover:border-tertiary/50"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                                    paymentMethod === "cod" ? "border-tertiary" : "border-primary/30"
                                                }`}>
                                                    {paymentMethod === "cod" && (
                                                        <div className="w-2 h-2 bg-tertiary rounded-full"></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold">Cash on Delivery</p>
                                                    <p className="text-xs text-primary/60">Pay when you receive your order</p>
                                                </div>
                                            </div>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod("online")}
                                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                                                paymentMethod === "online"
                                                    ? "border-tertiary bg-tertiary/5 text-primary"
                                                    : "border-primary/10 bg-secondary/30 text-primary/70 hover:border-tertiary/50"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                                    paymentMethod === "online" ? "border-tertiary" : "border-primary/30"
                                                }`}>
                                                    {paymentMethod === "online" && (
                                                        <div className="w-2 h-2 bg-tertiary rounded-full"></div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold">Online Payment</p>
                                                    <p className="text-xs text-primary/60 mb-2">Secure payment via Razorpay</p>
                                                    <div className="flex items-center gap-2">
                                                        <img src="/payment-razorpay.png" alt="Razorpay" className="h-4 w-auto" />
                                                        <img src="/payment-visa.png" alt="Visa" className="h-4 w-auto" />
                                                        <img src="/payment-mastercard.png" alt="Mastercard" className="h-4 w-auto" />
                                                        <img src="/payment-upi.png" alt="BHIM UPI" className="h-4 w-auto" />
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="border-t border-primary/10 pt-6 space-y-4">
                                    <h3 className="text-sm font-semibold text-primary">Order Summary</h3>

                                    <div className="bg-secondary/30 rounded-xl p-4 space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-primary/70">Customer:</span>
                                            <span className="text-primary font-medium">{formData.fullName}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-primary/70">Email:</span>
                                            <span className="text-primary font-medium">{formData.email}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-primary/70">Phone:</span>
                                            <span className="text-primary font-medium">{formData.phone}</span>
                                        </div>
                                        <div className="text-sm">
                                            <span className="text-primary/70">Delivery Address:</span>
                                            <div className="text-primary font-medium mt-1">
                                                {formData.address}<br />
                                                {formData.city}, {formData.state} - {formData.pincode}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-2 border-t border-primary/10">
                                        <span className="font-semibold text-primary">Total Amount:</span>
                                        <span className="text-xl font-bold text-tertiary">₹{total().toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={isProcessing}
                                    className="w-full bg-primary text-secondary py-4 rounded-xl font-bold text-lg hover:bg-primary-dark disabled:opacity-50 transition-colors shadow-lg flex items-center justify-center gap-2 group"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="w-5 h-5" />
                                            {paymentMethod === "cod" ? "Confirm Order" : "Pay Now"} (₹{total().toFixed(2)})
                                        </>
                                    )}
                                </button>
                            </motion.div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Column */}
                    <div className="lg:col-span-5">
                        {checkoutStep === "details" ? (
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-primary/5 sticky top-32 space-y-6">
                            <h2 className="text-xl font-serif font-bold text-primary flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-tertiary" /> Your Order
                            </h2>

                            <div className="max-h-[40vh] overflow-y-auto space-y-4 pr-2">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4 p-3 rounded-2xl hover:bg-secondary/30 transition-colors">
                                        <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center p-1 shrink-0 overflow-hidden">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                            ) : (
                                                <div className="w-full h-full bg-primary/10" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-primary truncate">{item.name}</h4>
                                            <p className="text-xs text-primary/50">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-sm font-bold text-primary">₹{item.price * item.quantity}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-4 border-t border-primary/10">
                                <div className="flex justify-between text-sm text-primary/70">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal()}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-sm text-tertiary font-bold">
                                        <span>Discount (99.99%)</span>
                                        <span>-₹{(subtotal() * discount).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm text-primary/70">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-primary pt-2 border-t border-primary/5">
                                    <span>Total Amount</span>
                                    <span>₹{total().toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="pt-6">
                                <p className="text-[10px] text-primary/40 text-center mb-4">
                                    By placing your order, you agree to Prashayan's terms of use and privacy policy.
                                    Secure checkout powered by Razorpay.
                                </p>
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full bg-primary text-secondary py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition-all shadow-lg flex items-center justify-center gap-3 active:scale-[0.98]"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="w-5 h-5" />
                                            Continue to Payment (₹{total().toFixed(2)})
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                        ) : (
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-primary/5 sticky top-32 space-y-6">
                            <h2 className="text-xl font-serif font-bold text-primary flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-tertiary" /> Order Summary
                            </h2>

                            <div className="max-h-[40vh] overflow-y-auto space-y-4 pr-2">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4 p-3 rounded-2xl hover:bg-secondary/30 transition-colors">
                                        <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center p-1 shrink-0 overflow-hidden">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                            ) : (
                                                <div className="w-full h-full bg-primary/10" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-primary truncate">{item.name}</h4>
                                            <p className="text-xs text-primary/50">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-sm font-bold text-primary">₹{item.price * item.quantity}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-4 border-t border-primary/10">
                                <div className="flex justify-between text-sm text-primary/70">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal()}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-sm text-tertiary font-bold">
                                        <span>Discount (99.99%)</span>
                                        <span>-₹{(subtotal() * discount).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm text-primary/70">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-primary pt-2 border-t border-primary/5">
                                    <span>Total Amount</span>
                                    <span>₹{total().toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
                </form>
            </div>
        </main>
    );
}
