"use client";

import { useCartStore } from "@/store/cart";
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { useState } from "react";

export default function CartPage() {
    const { items, updateQuantity, removeFromCart, total, subtotal, applyCoupon, couponCode, discount, removeCoupon } = useCartStore();
    const [couponInput, setCouponInput] = useState("");
    const [couponError, setCouponError] = useState("");

    const handleApplyCoupon = () => {
        setCouponError("");
        const success = applyCoupon(couponInput);
        if (!success) {
            setCouponError("Invalid coupon code");
        } else {
            setCouponInput("");
        }
    };

    return (
        <main className="min-h-screen bg-secondary">
            <div className="container mx-auto px-6 pt-32 pb-20">
                <h1 className="text-3xl font-serif font-bold text-primary mb-8">Your Cart</h1>

                {items.length === 0 ? (
                    <div className="text-center py-20 bg-white/50 rounded-3xl border border-primary/5">
                        <p className="text-primary/60 text-lg mb-6">Your cart is currently empty.</p>
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 text-tertiary font-bold hover:underline"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Cart Items */}
                        <div className="flex-1 space-y-6">
                            {items.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-6 p-6 bg-white rounded-2xl shadow-sm border border-primary/5"
                                >
                                    <div className="w-24 h-24 bg-secondary rounded-xl flex items-center justify-center p-2 shrink-0">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                        ) : (
                                            <div className="w-full h-full bg-primary/10 rounded-lg" />
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-xl font-serif font-semibold text-primary">{item.name}</h3>
                                        <p className="text-tertiary font-bold mt-1">₹{item.price}</p>
                                    </div>

                                    <div className="flex items-center gap-3 bg-secondary rounded-full px-3 py-1">
                                        <button
                                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                            className="p-1 hover:text-tertiary transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="text-primary font-medium w-4 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="p-1 hover:text-tertiary transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-primary/40 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </motion.div>
                            ))}

                            {/* Coupon Section */}
                            <div className="p-8 bg-white/50 rounded-3xl border border-primary/5">
                                <h3 className="font-serif font-bold text-primary mb-4">Have a Coupon?</h3>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={couponInput}
                                        onChange={(e) => setCouponInput(e.target.value)}
                                        placeholder="Enter code (Try NEW99)"
                                        className="bg-white border border-primary/10 rounded-xl px-4 py-3 outline-none focus:border-tertiary transition-colors flex-1"
                                    />
                                    <button
                                        onClick={handleApplyCoupon}
                                        className="bg-primary text-secondary px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {couponError && (
                                    <p className="text-red-500 text-sm mt-2 ml-1">{couponError}</p>
                                )}
                                {couponCode && (
                                    <div className="mt-4 flex items-center justify-between bg-tertiary/10 text-tertiary-dark px-4 py-2 rounded-xl border border-tertiary/20">
                                        <span className="font-bold text-sm">Coupon {couponCode} Applied!</span>
                                        <button onClick={removeCoupon} className="text-xs underline hover:no-underline">Remove</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:w-96">
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-primary/5 sticky top-32">
                                <h2 className="text-xl font-serif font-bold text-primary mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-primary/70">
                                        <span>Subtotal</span>
                                        <span>₹{subtotal()}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-tertiary font-bold">
                                            <span>Discount (99.99%)</span>
                                            <span>-₹{(subtotal() * discount).toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-primary/70">
                                        <span>Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    <div className="border-t border-primary/10 pt-4 flex justify-between text-lg font-bold text-primary">
                                        <span>Total</span>
                                        <span>₹{total().toFixed(2)}</span>
                                    </div>
                                </div>

                                <Link
                                    href="/checkout"
                                    className="w-full block text-center bg-primary text-secondary py-4 rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-lg"
                                >
                                    Proceed to Checkout
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
