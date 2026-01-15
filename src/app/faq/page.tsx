"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
    {
        question: "Are your products 100% organic?",
        answer: "Yes, all our ingredients are sourced from certified organic farms in the Himalayas. We adhere to strict quality control to ensure purity."
    },
    {
        question: "How long does shipping take?",
        answer: "Orders are typically processed within 24 hours. Domestic shipping takes 3-5 business days, while international shipping can take 7–14 days."
    },
    {
        question: "Is there a return policy?",
        answer: "We offer a 30-day money-back guarantee on all unopened products. Please verify the Returns page for more detailed information."
    },
    {
        question: "Can I take these supplements with my medication?",
        answer: "While our products are natural, we always recommend consulting with your healthcare provider before starting any new supplement regimen."
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <main className="min-h-screen pt-32 pb-20 px-6 bg-secondary">
            <div className="container mx-auto max-w-3xl">
                <motion.h1
                    className="text-4xl md:text-5xl font-serif font-bold text-primary mb-12 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Frequently Asked Questions
                </motion.h1>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            className="bg-white rounded-xl border border-primary/10 overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-primary/5 transition-colors"
                            >
                                <span className="font-serif font-medium text-lg text-primary">{faq.question}</span>
                                {openIndex === index ? (
                                    <Minus className="w-5 h-5 text-tertiary" />
                                ) : (
                                    <Plus className="w-5 h-5 text-tertiary" />
                                )}
                            </button>
                            <motion.div
                                initial={false}
                                animate={{ height: openIndex === index ? "auto" : 0 }}
                                className="overflow-hidden"
                            >
                                <div className="p-6 pt-0 text-primary/70 leading-relaxed border-t border-primary/5">
                                    {faq.answer}
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
}
