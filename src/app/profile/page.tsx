"use client";

import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { User, Package, MapPin, LogOut } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("profile");

    // Mock User Data
    const user = {
        name: "Aditi Sharma",
        email: "aditi.sharma@example.com",
        avatar: "AS"
    };

    const orders = [
        { id: "ORD-9821", date: "Jan 12, 2024", total: 1499, status: "Delivered", tracking: "TRK12345678" }
    ];

    return (
        <main className="min-h-screen bg-secondary">
            <Navbar />

            <div className="container mx-auto px-6 pt-32 pb-20">
                <h1 className="text-3xl font-serif font-bold text-primary mb-8">My Account</h1>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 bg-white rounded-2xl shadow-sm border border-primary/5 h-fit p-4">
                        <div className="flex items-center gap-4 p-4 mb-4 border-b border-primary/5">
                            <div className="w-12 h-12 bg-tertiary rounded-full flex items-center justify-center text-white font-bold text-xl">
                                {user.avatar}
                            </div>
                            <div>
                                <h3 className="font-semibold text-primary">{user.name}</h3>
                                <p className="text-xs text-primary/60 truncate max-w-[120px]">{user.email}</p>
                            </div>
                        </div>

                        <nav className="space-y-1">
                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "profile" ? "bg-secondary text-primary font-medium" : "text-primary/70 hover:bg-secondary/50"}`}
                            >
                                <User className="w-5 h-5" /> Profile Info
                            </button>
                            <button
                                onClick={() => setActiveTab("orders")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "orders" ? "bg-secondary text-primary font-medium" : "text-primary/70 hover:bg-secondary/50"}`}
                            >
                                <Package className="w-5 h-5" /> Order History
                            </button>
                            <button
                                onClick={() => setActiveTab("address")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "address" ? "bg-secondary text-primary font-medium" : "text-primary/70 hover:bg-secondary/50"}`}
                            >
                                <MapPin className="w-5 h-5" /> Saved Addresses
                            </button>
                            <div className="h-px bg-primary/5 my-2"></div>
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors">
                                <LogOut className="w-5 h-5" /> Sign Out
                            </button>
                        </nav>
                    </aside>

                    {/* Content Area */}
                    <div className="flex-1">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === "profile" && (
                                <div className="bg-white rounded-2xl shadow-sm border border-primary/5 p-8">
                                    <h2 className="text-xl font-serif font-bold text-primary mb-6">Profile Information</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-sm font-medium text-primary/70 block mb-2">Full Name</label>
                                            <input type="text" value={user.name} readOnly className="w-full px-4 py-3 rounded-xl bg-secondary/30 border-none text-primary" />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-primary/70 block mb-2">Email Address</label>
                                            <input type="text" value={user.email} readOnly className="w-full px-4 py-3 rounded-xl bg-secondary/30 border-none text-primary" />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-primary/70 block mb-2">Phone Number</label>
                                            <input type="text" value="+91 98765 43210" readOnly className="w-full px-4 py-3 rounded-xl bg-secondary/30 border-none text-primary" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "orders" && (
                                <div className="space-y-6">
                                    {orders.map(order => (
                                        <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-primary/5 p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="font-bold text-primary text-lg">Order #{order.id}</h3>
                                                    <p className="text-sm text-primary/60">Placed on {order.date}</p>
                                                </div>
                                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">{order.status}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-t border-primary/5 pt-4">
                                                <p className="font-bold text-primary">Total: ₹{order.total}</p>
                                                <Link href="/track-order" className="text-tertiary font-medium hover:underline text-sm">
                                                    Track Order &rarr;
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {activeTab === "address" && (
                                <div className="bg-white rounded-2xl shadow-sm border border-primary/5 p-8 flex items-center justify-center min-h-[200px]">
                                    <p className="text-primary/60">No saved addresses found.</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </main>
    );
}
