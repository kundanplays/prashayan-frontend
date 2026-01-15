"use client";

import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-secondary">
            <Navbar />

            <section className="pt-32 pb-20 container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-7xl mx-auto text-center"
                >
                    <h1 className="text-5xl font-serif font-bold text-primary mb-8">Our Story</h1>
                    <p className="text-xl text-primary/80 leading-relaxed mb-16 max-w-4xl mx-auto">
                        Prashayan was born from a desire to bridge the gap between ancient Ayurvedic wisdom and modern wellness needs.
                        We believe that true health comes from balance—balance in the body, mind, and spirit.
                        Our products are meticulously sourced, rigorously tested, and crafted with the utmost respect for tradition.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-left">
                        <motion.div
                            className="relative flex justify-center md:justify-end"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <img
                                src="/bhawna.png"
                                alt="Bhawna Kaushik, CEO"
                                className="w-full max-w-[1200px] md:max-w-[1600px] object-contain drop-shadow-2xl"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-primary/5">
                                <h2 className="text-4xl font-serif font-bold text-primary mb-2">Bhawna Kaushik</h2>
                                <p className="text-tertiary font-medium tracking-widest uppercase mb-6">CEO, Prashayan</p>
                                <div className="w-16 h-1 bg-tertiary mb-6"></div>
                                <p className="text-primary/70 leading-relaxed italic text-lg">
                                    "We are not just selling supplements; we are delivering a promise of purity and a path to holistic well-being. My mission is to make the ancient science of Ayurveda accessible and trusted for the modern world."
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}
