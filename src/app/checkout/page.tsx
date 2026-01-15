"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useCartStore } from "@/store/cart";
import { motion } from "framer-motion";
import { CreditCard, Truck, ShoppingBag, MapPin, User, Phone, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    const { items, total, subtotal, discount, clearCart } = useCartStore();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

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

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate Order Placement
        setTimeout(() => {
            const orderId = "PR" + Math.floor(Math.random() * 1000000);

            // Store order data in session/local storage for the success page demo
            const orderData = {
                orderId,
                items,
                total: total(),
                subtotal: subtotal(),
                discount,
                customer: formData,
                status: "order placed",
                date: new Date().toLocaleDateString()
            };
            localStorage.setItem("lastOrder", JSON.stringify(orderData));

            setIsProcessing(false);
            clearCart();
            router.push(`/order-success/${orderId}`);
        }, 2000);
    };

    if (items.length === 0) {
        return (
            <main className="min-h-screen bg-secondary">
                <Navbar />
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
            <Navbar />

            <div className="container mx-auto px-6 pt-32 pb-20">
                <Link href="/cart" className="inline-flex items-center text-primary/60 hover:text-primary mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
                </Link>

                <h1 className="text-4xl font-serif font-bold text-primary mb-10">Checkout</h1>

                <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Shipping Form */}
                    <div className="lg:col-span-7 space-y-8">
                        <section className="bg-white p-8 rounded-3xl shadow-sm border border-primary/5">
                            <h2 className="text-xl font-serif font-bold text-primary mb-6 flex items-center gap-2">
                                <User className="w-5 h-5 text-tertiary" /> Customer Information
                            </h2>
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

                    {/* Order Summary Column */}
                    <div className="lg:col-span-5">
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
                                            Place Order (₹{total().toFixed(2)})
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
}

