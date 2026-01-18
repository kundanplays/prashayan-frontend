"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle, CreditCard, ImageIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { orders } from "@/lib/api";
import Image from "next/image";

interface Payment {
    id: number;
    payment_id?: string;
    razorpay_order_id?: string;
    amount: number;
    method: string;
    status: string;
    created_at: string;
    updated_at?: string;
}

interface OrderItem {
    id: number;
    name: string;
    slug?: string;
    image?: string;
    images?: string[];
    price: number;
    quantity: number;
    total: number;
}

interface TrackedOrder {
    orderId: number;
    order_number: string;
    items: OrderItem[];
    total: number;
    subtotal: number;
    discount: number;
    customer: {
        fullName: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        pincode: string;
    };
    status: string;
    payment_status: string;
    payment_method: string;
    date: string;
    tracking_id?: string;
    payments: Payment[];
}

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState("");
    const [email, setEmail] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [trackedOrder, setTrackedOrder] = useState<TrackedOrder | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showGuestForm, setShowGuestForm] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Check if user is logged in - only on client side
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem("token");
            const urlOrderId = searchParams.get('orderId');

            if (token) {
                setIsLoggedIn(true);
            } else {
                setShowGuestForm(true);
            }

            // Pre-fill order ID if provided in URL and track it automatically
            if (urlOrderId) {
                setOrderId(urlOrderId);
                // Auto-track if order ID is provided in URL
                setTimeout(() => trackOrder(urlOrderId), 500);
            }
        }
    }, [searchParams]);

    const trackOrder = async (searchOrderId: string, searchEmail?: string) => {
        setLoading(true);
        setError("");

        try {
            const normalizedOrderId = searchOrderId.trim().toUpperCase();
            // Use the track endpoint with order number
            const response = await orders.track(normalizedOrderId, searchEmail);
            setTrackedOrder(response.data);
        } catch (err: any) {
            if (err.response?.status === 404) {
                setError("Order not found. Please check your order ID.");
            } else if (err.response?.status === 403) {
                setError("You don't have permission to view this order.");
            } else {
                setError("Failed to track order. Please try again.");
            }
            console.error("Track order error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId.trim()) {
            setError("Please enter an order ID");
            return;
        }

        if (!isLoggedIn && !email.trim()) {
            setError("Please enter your email address");
            return;
        }

        trackOrder(orderId, email);
    };

    const getStatusIcon = (status: string) => {
        if (!status) return <Package className="w-5 h-5 text-gray-500" />;
        switch (status.toLowerCase()) {
            case 'placed':
            case 'ordered':
                return <Clock className="w-5 h-5 text-blue-500" />;
            case 'shipped':
                return <Truck className="w-5 h-5 text-orange-500" />;
            case 'delivered':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            default:
                return <Package className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        if (!status) return 'bg-gray-50 text-gray-700 border-gray-200';
        switch (status.toLowerCase()) {
            case 'placed':
            case 'ordered':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'shipped':
                return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'delivered':
                return 'bg-green-50 text-green-700 border-green-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const getImageSrc = (src?: string) => {
        if (!src) return "";
        const trimmed = src.trim();
        if (!trimmed) return "";
        if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
            return trimmed;
        }
        // Normalize relative paths to be valid URLs for Next/Image
        return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    };

    const isAbsoluteUrl = (src?: string) => {
        if (!src) return false;
        const trimmed = src.trim();
        return trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:") || trimmed.startsWith("blob:");
    };

    return (
        <main className="min-h-screen pt-32 pb-20 px-6 bg-secondary">
            <div className="container mx-auto max-w-4xl">
                <motion.h1
                    className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Track Your Order
                </motion.h1>

                <motion.p
                    className="text-primary/70 mb-12 text-lg text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {isLoggedIn
                        ? "View and track all your orders below."
                        : "Enter your email and order ID to track your shipment."
                    }
                </motion.p>

                {!trackedOrder ? (
                    // Show tracking form when no order is being tracked
                    <motion.div
                        className="max-w-md mx-auto"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLoggedIn && (
                                <div>
                                    <label className="block text-sm font-medium text-primary/60 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white/50 focus:bg-white focus:outline-none focus:border-tertiary transition-all"
                                        placeholder="Enter your email"
                                        required={!isLoggedIn}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-primary/60 mb-2">
                                    Order Number
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={orderId}
                                        onChange={(e) => setOrderId(e.target.value)}
                                        className="w-full pl-4 pr-14 py-3 rounded-xl border border-primary/10 bg-white/50 focus:bg-white focus:outline-none focus:border-tertiary transition-all"
                                        placeholder="Enter Order Number (e.g., PR00046)"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="absolute right-2 top-2 p-2 bg-primary text-secondary rounded-lg hover:bg-tertiary hover:text-primary transition-colors disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin"></div>
                                        ) : (
                                            <Search className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>

                        {!isLoggedIn && (
                            <div className="mt-8 text-center">
                                <p className="text-primary/60 text-sm mb-4">
                                    For easier tracking, <button
                                        onClick={() => router.push('/auth/signin')}
                                        className="text-tertiary hover:underline font-medium"
                                    >
                                        sign in to your account
                                    </button>
                                </p>
                            </div>
                        )}
                    </motion.div>
                ) : null}

                {/* Order Details View */}
                {trackedOrder && (
                    <motion.div
                        className="mt-8 space-y-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {/* Order Header */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-primary/5">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h3 className="font-serif font-bold text-primary text-2xl mb-2">
                                        Order #{trackedOrder.order_number}
                                    </h3>
                                    <p className="text-primary/60">
                                        Ordered on {new Date(trackedOrder.date).toLocaleDateString('en-IN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border mb-2 ${getStatusColor(trackedOrder.status)}`}>
                                        {getStatusIcon(trackedOrder.status)}
                                        {trackedOrder.status}
                                    </div>
                                    <p className="text-primary/60 text-sm">Payment: {trackedOrder.payment_status}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* Order Items */}
                            <div className="lg:col-span-2">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-primary/5">
                                    <h4 className="font-semibold text-primary text-lg mb-4">Order Items</h4>
                                    <div className="space-y-4">
                                        {trackedOrder.items.map((item, index) => (
                                            <div key={index} className="flex gap-4 p-4 bg-secondary/30 rounded-xl">
                                                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    {getImageSrc(item.image) ? (
                                                        isAbsoluteUrl(item.image) ? (
                                                            <Image
                                                                src={getImageSrc(item.image)}
                                                                alt={item.name}
                                                                width={64}
                                                                height={64}
                                                                className="w-full h-full object-cover rounded-lg"
                                                            />
                                                        ) : (
                                                            <img
                                                                src={getImageSrc(item.image)}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover rounded-lg"
                                                                width={64}
                                                                height={64}
                                                            />
                                                        )
                                                    ) : (
                                                        <ImageIcon className="w-8 h-8 text-primary/40" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h5 className="font-medium text-primary truncate">{item.name}</h5>
                                                    <p className="text-primary/60 text-sm">₹{item.price} each</p>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <span className="text-primary/70 text-sm">Qty: {item.quantity}</span>
                                                        <span className="font-semibold text-tertiary">₹{item.total}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Summary */}
                                    <div className="mt-6 pt-4 border-t border-primary/10">
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-primary/70">Subtotal:</span>
                                                <span className="text-primary">₹{trackedOrder.subtotal}</span>
                                            </div>
                                            {trackedOrder.discount > 0 && (
                                                <div className="flex justify-between">
                                                    <span className="text-primary/70">Discount:</span>
                                                    <span className="text-green-600">-₹{trackedOrder.discount}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between pt-2 border-t border-primary/10">
                                                <span className="font-semibold text-primary">Total:</span>
                                                <span className="text-xl font-bold text-tertiary">₹{trackedOrder.total}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping & Payment Info */}
                            <div className="space-y-6">
                                {/* Shipping Address */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-primary/5">
                                    <h4 className="font-semibold text-primary mb-4 flex items-center gap-2">
                                        <Package className="w-5 h-5" />
                                        Shipping Address
                                    </h4>
                                    <div className="text-primary/70 text-sm space-y-1">
                                        <p className="font-medium text-primary">{trackedOrder.customer.fullName}</p>
                                        <p>{trackedOrder.customer.address}</p>
                                        <p>{trackedOrder.customer.city}, {trackedOrder.customer.state} - {trackedOrder.customer.pincode}</p>
                                        <p>{trackedOrder.customer.phone}</p>
                                        <p>{trackedOrder.customer.email}</p>
                                    </div>
                                </div>

                                {/* Payment Information */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-primary/5">
                                    <h4 className="font-semibold text-primary mb-4 flex items-center gap-2">
                                        <CreditCard className="w-5 h-5" />
                                        Payment Details
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-primary/70">Method:</span>
                                            <span className="text-primary capitalize">{trackedOrder.payment_method}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-primary/70">Status:</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                trackedOrder.payment_status === 'success'
                                                    ? 'bg-green-100 text-green-700'
                                                    : trackedOrder.payment_status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}>
                                                {trackedOrder.payment_status}
                                            </span>
                                        </div>

                                        {trackedOrder.payments && trackedOrder.payments.length > 0 && (
                                            <div className="pt-3 border-t border-primary/10">
                                                <h5 className="font-medium text-primary text-sm mb-2">Transaction Details</h5>
                                                {trackedOrder.payments.map((payment, index) => (
                                                    <div key={index} className="text-xs text-primary/60 space-y-1">
                                                        {payment.payment_id && (
                                                            <p><span className="font-medium">ID:</span> {payment.payment_id}</p>
                                                        )}
                                                        {payment.razorpay_order_id && (
                                                            <p><span className="font-medium">Order ID:</span> {payment.razorpay_order_id}</p>
                                                        )}
                                                        <p><span className="font-medium">Amount:</span> ₹{payment.amount}</p>
                                                        <p><span className="font-medium">Date:</span> {new Date(payment.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Tracking Info */}
                                {trackedOrder.tracking_id && (
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-primary/5">
                                        <h4 className="font-semibold text-primary mb-4 flex items-center gap-2">
                                            <Truck className="w-5 h-5" />
                                            Tracking Information
                                        </h4>
                                        <p className="text-primary/70 text-sm">
                                            Tracking ID: <span className="font-mono text-primary">{trackedOrder.tracking_id}</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                <div className="mt-12 p-6 bg-primary/5 rounded-2xl border border-primary/10 text-center">
                    <h3 className="font-serif font-semibold text-primary mb-2">Need Help?</h3>
                    <p className="text-sm text-primary/60">
                        If you can't find your order ID, please check your confirmation email or contact support at{" "}
                        <a href="mailto:support@prashayan.com" className="text-tertiary hover:underline">support@prashayan.com</a>.
                    </p>
                </div>
            </div>
        </main>
    );
}
