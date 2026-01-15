"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-secondary">
            {/* Background Gradient Blob */}
            <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-tertiary/10 to-transparent pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-left"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-tertiary font-medium tracking-[0.2em] uppercase mb-6 flex items-center gap-3">
                            <span className="w-8 h-[1px] bg-tertiary"></span>
                            Pure Ayurvedic Essence
                        </h2>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-primary leading-[1.1] mb-8">
                        Heal with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">Nature.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-primary/70 max-w-lg mb-10 leading-relaxed">
                        Discover our curated collection of high-purity herbal supplements, rooted in 5,000 years of wisdom.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="/products"
                            className="bg-primary text-secondary px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-xl hover:bg-primary-dark transition-all duration-300"
                        >
                            Shop Collection
                        </Link>
                        <Link
                            href="/about"
                            className="px-8 py-4 rounded-full text-lg font-medium border border-primary/20 hover:bg-primary/5 transition-all duration-300"
                        >
                            Our Story
                        </Link>
                    </div>
                </motion.div>

                {/* Product Image */}
                <motion.div
                    className="relative flex justify-center lg:justify-end"
                    initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                >
                    <div className="relative w-[300px] h-[400px] md:w-[400px] md:h-[550px]">
                        {/* Glowing Backdrop */}
                        <div className="absolute inset-0 bg-tertiary/20 blur-[60px] rounded-full transform translate-y-10"></div>

                        {/* Floating Interaction */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <img
                                src="/hero-product.svg"
                                alt="Prashayan Premium Supplement"
                                className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
                            />
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent opacity-80 pointer-events-none" />
        </section>
    );
}
