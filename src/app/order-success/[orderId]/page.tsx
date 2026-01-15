"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { CheckCircle, Package, Truck, Home, ShoppingBag, MapPin, User, Calendar } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const statusSteps = [
    { id: "placed", label: "Order Placed", icon: ShoppingBag },
    { id: "packing", label: "Packing", icon: Package },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "delivered", label: "Delivered", icon: Home },
];

export default function OrderSuccessPage() {
    const params = useParams();
    const orderId = params.orderId as string;
    const [orderData, setOrderData] = useState<any>(null);

    useEffect(() => {
        const savedOrder = localStorage.getItem("lastOrder");
        if (savedOrder) {
            const parsed = JSON.parse(savedOrder);
            if (parsed.orderId === orderId) {
                setOrderData(parsed);
            }
        }
    }, [orderId]);

    const currentStatus = orderData?.status || "order placed";
    const currentStepIndex = 0; // "order placed" is index 0

    if (!orderData) {
        return (
            <main className="min-h-screen bg-secondary">
                <Navbar />
                <div className="container mx-auto px-6 pt-32 text-center">
                    <p className="text-primary/60">Loading order details...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-secondary">
            <Navbar />

            <div className="container mx-auto px-6 pt-32 pb-20 max-w-5xl">
                {/* Header Success Message */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600"
                    >
                        <CheckCircle className="w-10 h-10" />
                    </motion.div>
                    <h1 className="text-4xl font-serif font-bold text-primary mb-2">Order Confirmed!</h1>
                    <p className="text-primary/60">Your order #{orderId} has been placed successfully.</p>
                </div>

                {/* Status Tracker */}
                <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-primary/5 mb-12 relative overflow-hidden">
                    <h2 className="text-xl font-serif font-bold text-primary mb-12 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-tertiary" /> Track Your Order
                    </h2>

                    <div className="relative flex flex-col md:flex-row justify-between gap-8 md:gap-0">
                        {/* Desktop Background Line */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-secondary -translate-y-1/2" />

                        {/* Mobile Background Line */}
                        <div className="md:hidden absolute top-0 left-6 w-0.5 h-full bg-secondary" />

                        {/* Desktop Progress Line */}
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                            className="hidden md:block absolute top-1/2 left-0 h-0.5 bg-tertiary -translate-y-1/2 z-10"
                        />

                        {/* Mobile Progress Line */}
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                            className="md:hidden absolute top-0 left-6 w-0.5 bg-tertiary z-10"
                        />

                        {statusSteps.map((step, index) => {
                            const isCompleted = index <= currentStepIndex;
                            const isCurrent = index === currentStepIndex;
                            const StepIcon = step.icon;

                            return (
                                <div key={step.id} className="relative z-20 flex flex-row md:flex-col items-center gap-4 md:gap-0">
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-500 shrink-0 ${isCompleted ? "bg-white border-tertiary text-tertiary" : "bg-white border-secondary text-primary/20"
                                            } ${isCurrent ? "ring-4 ring-tertiary/10" : ""}`}
                                    >
                                        <StepIcon className="w-6 h-6" />
                                    </motion.div>
                                    <span className={`md:absolute md:-bottom-8 whitespace-nowrap text-sm md:text-xs font-bold transition-colors duration-500 ${isCompleted ? "text-primary" : "text-primary/30"
                                        }`}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Order Details */}
                    <div className="space-y-8">
                        <section className="bg-white p-8 rounded-3xl shadow-sm border border-primary/5">
                            <h2 className="text-xl font-serif font-bold text-primary mb-6">Order Items</h2>
                            <div className="space-y-4">
                                {orderData.items.map((item: any) => (
                                    <div key={item.id} className="flex gap-4 p-4 bg-secondary/30 rounded-2xl">
                                        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-1 shrink-0">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                            ) : (
                                                <div className="w-full h-full bg-primary/10" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-primary">{item.name}</h4>
                                            <p className="text-sm text-primary/50">Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="font-bold text-primary">₹{item.price * item.quantity}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-6 border-t border-primary/10 space-y-2">
                                <div className="flex justify-between text-sm text-primary/60">
                                    <span>Subtotal</span>
                                    <span>₹{orderData.subtotal}</span>
                                </div>
                                {orderData.discount > 0 && (
                                    <div className="flex justify-between text-sm text-tertiary font-bold">
                                        <span>Discount (99.99%)</span>
                                        <span>-₹{(orderData.subtotal * orderData.discount).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-bold text-primary pt-2">
                                    <span>Total Paid</span>
                                    <span>₹{orderData.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Customer & Shipping Summary */}
                    <div className="space-y-8">
                        <section className="bg-white p-8 rounded-3xl shadow-sm border border-primary/5">
                            <h2 className="text-xl font-serif font-bold text-primary mb-6 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-tertiary" /> Shipping Details
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <User className="w-5 h-5 text-primary/30 mt-1" />
                                    <div>
                                        <p className="text-sm font-bold text-primary">{orderData.customer.fullName}</p>
                                        <p className="text-sm text-primary/60">{orderData.customer.email}</p>
                                        <p className="text-sm text-primary/60">{orderData.customer.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 pt-4 border-t border-primary/5">
                                    <MapPin className="w-5 h-5 text-primary/30 mt-1" />
                                    <div className="text-sm text-primary/70 leading-relaxed">
                                        {orderData.customer.address},<br />
                                        {orderData.customer.city}, {orderData.customer.state} - {orderData.customer.pincode}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="flex gap-4">
                            <Link
                                href="/profile"
                                className="flex-1 bg-white border border-primary/10 text-primary py-4 rounded-xl font-bold text-center hover:bg-secondary/50 transition-colors"
                            >
                                View Orders
                            </Link>
                            <Link
                                href="/products"
                                className="flex-1 bg-primary text-secondary py-4 rounded-xl font-bold text-center hover:bg-primary-dark transition-colors shadow-lg"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
