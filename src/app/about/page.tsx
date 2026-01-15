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
                    className="max-w-4xl mx-auto text-center"
                >
                    <h1 className="text-5xl font-serif font-bold text-primary mb-8">Our Story</h1>
                    <p className="text-xl text-primary/80 leading-relaxed mb-12">
                        Prashayan was born from a desire to bridge the gap between ancient Ayurvedic wisdom and modern wellness needs.
                        We believe that true health comes from balance—balance in the body, mind, and spirit.
                        Our products are meticulously sourced, rigorously tested, and crafted with the utmost respect for tradition.
                    </p>

                    <div className="bg-white p-10 rounded-3xl shadow-lg inline-block">
                        <div className="mb-6 relative w-48 h-48 mx-auto">
                            <div className="absolute inset-0 bg-tertiary/20 rounded-full blur-xl transform translate-y-4"></div>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/images/bhawna.png"
                                alt="Bhawna Kaushik, CEO"
                                className="rounded-full w-48 h-48 object-cover border-4 border-secondary relative z-10"
                            />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-primary mb-2">Bhawna Kaushik</h2>
                        <p className="text-tertiary font-medium tracking-widest uppercase mb-6">CEO, Prashayan</p>
                        <p className="text-primary/70 italic">
                            "We are not just selling supplements; we are delivering a promise of purity and a path to holistic well-being."
                        </p>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}
