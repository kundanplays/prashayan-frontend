"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";

export default function TrackOrderPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-6 bg-secondary">
            <div className="container mx-auto max-w-2xl text-center">
                <motion.h1
                    className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Track Your Order
                </motion.h1>

                <motion.p
                    className="text-primary/70 mb-12 text-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Enter your order ID below to check the current status of your shipment.
                </motion.p>

                <motion.div
                    className="relative max-w-md mx-auto"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <input
                        type="text"
                        placeholder="Enter Order ID (e.g., PR-12345)"
                        className="w-full pl-6 pr-14 py-4 rounded-full border border-primary/20 bg-white/50 focus:bg-white focus:outline-none focus:border-tertiary transition-all"
                    />
                    <button className="absolute right-2 top-2 p-2 bg-primary text-secondary rounded-full hover:bg-tertiary hover:text-primary transition-colors">
                        <Search className="w-5 h-5" />
                    </button>
                </motion.div>

                <div className="mt-12 p-6 bg-primary/5 rounded-2xl border border-primary/10">
                    <h3 className="font-serif font-semibold text-primary mb-2">Need Help?</h3>
                    <p className="text-sm text-primary/60">
                        If you can't find your order ID, please check your confirmation email or contact support at <a href="mailto:support@prashayan.com" className="text-tertiary hover:underline">support@prashayan.com</a>.
                    </p>
                </div>
            </div>
        </main>
    );
}
