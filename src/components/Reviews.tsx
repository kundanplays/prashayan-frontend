"use client";

import { Star, User } from "lucide-react";
import { motion } from "framer-motion";

const mockReviews = [
    {
        id: 1,
        user: "Aarav P.",
        rating: 5,
        date: "2 days ago",
        comment: "Absolutely love the purity of this Shilajit. Felt the difference in energy within a week."
    },
    {
        id: 2,
        user: "Neha S.",
        rating: 4,
        date: "1 week ago",
        comment: "Great packaging and fast delivery. The product quality seems very authentic."
    },
    {
        id: 3,
        user: "Vikram R.",
        rating: 5,
        date: "2 weeks ago",
        comment: "Been using Ayurvedic products for years, and Prashayan is definitely top tier. Highly recommend."
    }
];

export function Reviews() {
    return (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-secondary-dark mt-16">
            <h3 className="text-2xl font-serif font-bold text-primary mb-8">Customer Reviews</h3>

            <div className="space-y-8">
                {mockReviews.map((review, idx) => (
                    <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="border-b border-secondary-dark pb-8 last:border-0 last:pb-0"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                                    {review.user[0]}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-primary">{review.user}</h4>
                                    <p className="text-xs text-primary/50">{review.date}</p>
                                </div>
                            </div>
                            <div className="flex text-tertiary">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-gray-300"}`} />
                                ))}
                            </div>
                        </div>
                        <p className="text-primary/70 leading-relaxed text-sm">
                            "{review.comment}"
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
