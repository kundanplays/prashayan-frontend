"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { orders } from "@/lib/api";

interface Order {
    id: number;
    order_number?: string;
    total_amount: number;
    status: string;
    created_at: string;
    shipping_address: any;
    items?: any[];
}

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState("");
    const [email, setEmail] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userOrders, setUserOrders] = useState<Order[]>([]);
    const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
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
                loadUserOrders();
                // Pre-fill order ID if provided in URL
                if (urlOrderId) {
                    setOrderId(urlOrderId);
                }
            } else {
                setShowGuestForm(true);
                // Pre-fill order ID if provided in URL
                if (urlOrderId) {
                    setOrderId(urlOrderId);
                }
            }
        }
    }, [searchParams]);

    const loadUserOrders = async () => {
        try {
            const response = await orders.list();
            setUserOrders(response.data);
        } catch (error) {
            console.error("Failed to load user orders:", error);
        }
    };

    const trackOrder = async (searchOrderId: string, searchEmail?: string) => {
        setLoading(true);
        setError("");

        try {
            // For logged-in users, search through their orders
            if (isLoggedIn) {
                const foundOrder = userOrders.find(order =>
                    order.order_number?.toLowerCase() === searchOrderId.toLowerCase() ||
                    order.id.toString() === searchOrderId
                );

                if (foundOrder) {
                    setTrackedOrder(foundOrder);
                } else {
                    setError("Order not found. Please check your order ID.");
                }
            } else {
                // For guest users, we'd need a backend endpoint to search by email + order ID
                // For now, show a message that guest tracking is not implemented
                setError("Guest order tracking is not yet available. Please sign in to track your orders.");
            }
        } catch (err) {
            setError("Failed to track order. Please try again.");
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

                {isLoggedIn ? (
                    // Logged-in user view - show their orders
                    <div className="space-y-6">
                        {userOrders.length === 0 ? (
                            <motion.div
                                className="text-center py-12 bg-white/50 rounded-2xl border border-primary/5"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            >
                                <Package className="w-16 h-16 text-primary/30 mx-auto mb-4" />
                                <p className="text-primary/60 text-lg">No orders found</p>
                                <p className="text-primary/40 text-sm">Your order history will appear here</p>
                            </motion.div>
                        ) : (
                            <div className="grid gap-6">
                                {userOrders.map((order, index) => (
                                    <motion.div
                                        key={order.id}
                                        className="bg-white p-6 rounded-2xl shadow-sm border border-primary/5"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.1 * index }}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="font-serif font-bold text-primary text-lg">
                                                    Order #{order.order_number || order.id}
                                                </h3>
                                                <p className="text-primary/60 text-sm">
                                                    Placed on {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Unknown date'}
                                                </p>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                                                <div className="flex items-center gap-1">
                                                    {getStatusIcon(order.status)}
                                                    {order.status || 'Unknown'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="text-primary font-semibold">
                                                Total: ₹{order.total_amount}
                                            </div>
                                            <button
                                                onClick={() => setTrackedOrder(order)}
                                                className="text-tertiary font-medium hover:underline text-sm"
                                            >
                                                View Details →
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    // Guest user view - email + order ID form
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
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-primary/60 mb-2">
                                    Order ID
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={orderId}
                                        onChange={(e) => setOrderId(e.target.value)}
                                        className="w-full pl-4 pr-14 py-3 rounded-xl border border-primary/10 bg-white/50 focus:bg-white focus:outline-none focus:border-tertiary transition-all"
                                        placeholder="Enter Order ID (e.g., PR-12345)"
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
                    </motion.div>
                )}

                {/* Order Details Modal/View */}
                {trackedOrder && (
                    <motion.div
                        className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-primary/5"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h3 className="font-serif font-bold text-primary text-xl mb-4">
                            Order #{trackedOrder.order_number || trackedOrder.id} Details
                        </h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-primary mb-2">Shipping Address</h4>
                                <div className="text-primary/70 text-sm">
                                    {trackedOrder.shipping_address?.full_name}<br />
                                    {trackedOrder.shipping_address?.address}<br />
                                    {trackedOrder.shipping_address?.city}, {trackedOrder.shipping_address?.state} - {trackedOrder.shipping_address?.pincode}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-primary mb-2">Order Status</h4>
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(trackedOrder.status)}`}>
                                    {getStatusIcon(trackedOrder.status)}
                                    {trackedOrder.status}
                                </div>
                                <p className="text-primary/60 text-sm mt-2">
                                    Ordered on {new Date(trackedOrder.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-primary/10">
                            <h4 className="font-semibold text-primary mb-4">Order Items</h4>
                            <div className="space-y-3">
                                {trackedOrder.items?.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center py-2">
                                        <div>
                                            <p className="font-medium text-primary">Product #{item.product_id}</p>
                                            <p className="text-primary/60 text-sm">Quantity: {item.quantity}</p>
                                        </div>
                                        <p className="font-semibold text-primary">₹{item.price_at_purchase * item.quantity}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 pt-4 border-t border-primary/10 flex justify-between items-center">
                                <span className="font-semibold text-primary">Total Amount:</span>
                                <span className="text-xl font-bold text-tertiary">₹{trackedOrder.total_amount}</span>
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
