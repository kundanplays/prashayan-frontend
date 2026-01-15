"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-secondary">
            {/* Background Graphic Element - Abstract Circle/Blob */}
            <motion.div
                className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-tertiary/10 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, -45, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-tertiary font-medium tracking-[0.2em] uppercase mb-4">Pure Ayurvedic Essence</h2>
                </motion.div>

                <motion.h1
                    className="text-5xl md:text-8xl font-serif font-bold text-primary leading-tight mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Heal with Nature,<br />
                    <span className="italic font-light text-primary/80">Live with Balance.</span>
                </motion.h1>

                <motion.p
                    className="text-lg md:text-xl text-primary/70 max-w-2xl mx-auto mb-10 leading-relaxed"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    Discover our curated collection of high-purity herbal supplements, rooted in ancient wisdom and backed by modern purity.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 bg-primary text-secondary px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-xl hover:bg-primary-dark transition-all duration-300 group"
                    >
                        Shop Now
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
