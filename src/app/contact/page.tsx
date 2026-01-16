"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-secondary">
            <div className="container mx-auto px-6 pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Get in Touch</h1>
                    <p className="text-primary/70 max-w-xl mx-auto">
                        We'd love to hear from you. Whether you have a question about our products, need assistance, or just want to tell us how much you love Prashayan.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white p-8 rounded-3xl shadow-lg text-center border-t-4 border-tertiary"
                    >
                        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                            <Mail className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-2">Email Us</h3>
                        <a href="mailto:bhawna@prashayan.com" className="text-tertiary font-medium hover:underline">
                            bhawna@prashayan.com
                        </a>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white p-8 rounded-3xl shadow-lg text-center border-t-4 border-tertiary"
                    >
                        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                            <Phone className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-2">Call Us</h3>
                        <a href="tel:+918586838934" className="text-tertiary font-medium hover:underline">
                            +91 85868 38934
                        </a>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white p-8 rounded-3xl shadow-lg text-center border-t-4 border-tertiary"
                    >
                        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                            <MapPin className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-2">Visit Us</h3>
                        <p className="text-primary/70">
                            Chor Gali, Bandar Muhalla,<br />Gadha Bagicha
                        </p>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
