"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// Mock Blog Data
const blogPosts = [
    {
        slug: "benefits-of-shilajit",
        title: "10 Surprising Benefits of Pure Himalayan Shilajit",
        excerpt: "Discover why this ancient resin is called the 'Destroyer of Weakness'. From energy boosting to anti-aging properties.",
        image: "/images/shilajit.webp", // Reuse existing image for demo
        category: "Wellness",
        date: "Jan 10, 2026"
    },
    {
        slug: "ayurveda-daily-routine",
        title: "Dinacharya: The Ideal Ayurvedic Daily Routine",
        excerpt: "Align your body clock with nature using these simple daily practices for optimal health and vitality.",
        image: "/images/ashwagandha.webp",
        category: "Lifestyle",
        date: "Jan 08, 2026"
    },
    {
        slug: "ashwagandha-stress-relief",
        title: "Ashwagandha: Nature's Best Stress Buster",
        excerpt: "How this powerful adaptogen helps your body manage stress, anxiety, and improves sleep quality.",
        image: "/images/ashwagandha.webp",
        category: "Herbs",
        date: "Jan 05, 2026"
    },
    {
        slug: "triphala-digestion",
        title: "Triphala: The Ultimate Digestive Tonic",
        excerpt: "A deep dive into the three fruits that make up Triphala and how they detoxify your system naturally.",
        image: "/images/triphala.webp",
        category: "Detox",
        date: "Jan 02, 2026"
    },
    {
        slug: "importance-of-doshas",
        title: "Understanding Your Dosha: Vata, Pitta, Kapha",
        excerpt: "The foundation of Ayurveda lies in understanding your unique constitution. Find out which Dosha dominates you.",
        image: "/images/kesar.webp",
        category: "Education",
        date: "Dec 30, 2025"
    },
    {
        slug: "kesar-skin-glow",
        title: "Kesar (Saffron) for Radiant Skin",
        excerpt: "Why Kashmiri Saffron is considered liquid gold for your skin complexion and texture.",
        image: "/images/kesar.webp",
        category: "Beauty",
        date: "Dec 28, 2025"
    },
    {
        slug: "meditation-ayurveda",
        title: "The Role of Meditation in Ayurvedic Healing",
        excerpt: "Mental peace is just as important as physical health. Learn how to silence your mind.",
        image: "/images/shilajit-gold.webp",
        category: "Mindfulness",
        date: "Dec 25, 2025"
    },
    {
        slug: "boost-immunity-naturally",
        title: "5 Ways to Boost Immunity Naturally",
        excerpt: "Simple home remedies and habits to keep your immune system strong during flu season.",
        image: "/images/triphala.webp",
        category: "Wellness",
        date: "Dec 20, 2025"
    },
    {
        slug: "ayurvedic-diet-tips",
        title: "Eating According to Your Body Type",
        excerpt: "Food is medicine. Learn what to eat and what to avoid based on your Dosha.",
        image: "/images/ashwagandha.webp",
        category: "Nutrition",
        date: "Dec 18, 2025"
    },
    {
        slug: "sleep-better-ayurveda",
        title: "Curing Insomnia with Ayurveda",
        excerpt: "Natural remedies and bedtime rituals to ensure you get deep, restorative sleep every night.",
        image: "/images/shilajit.webp",
        category: "Wellness",
        date: "Dec 15, 2025"
    },
];

export default function AyurvedaPage() {
    return (
        <>
            <main className="pt-32 min-h-screen bg-secondary">
                {/* Header */}
                <section className="container mx-auto px-6 mb-16 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-serif text-5xl md:text-6xl font-bold text-primary mb-6"
                    >
                        The Wisdom of Ayurveda
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-primary/70 max-w-2xl mx-auto"
                    >
                        Explore articles, tips, and insights to bring balance to your mind, body, and spirit through ancient knowledge.
                    </motion.p>
                </section>

                {/* Blog Grid */}
                <section className="container mx-auto px-6 pb-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.map((post, index) => (
                            <motion.article
                                key={post.slug}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="group cursor-pointer"
                            >
                                <div className="relative h-64 mb-6 overflow-hidden rounded-xl">
                                    {/* In a real app, use different images. Reusing product images for placeholder. */}
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary uppercase tracking-wider">
                                        {post.category}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="text-sm text-tertiary font-medium">{post.date}</div>
                                    <h2 className="font-serif text-2xl font-bold text-primary group-hover:text-tertiary transition-colors">
                                        {post.title}
                                    </h2>
                                    <p className="text-primary/70 leading-relaxed">
                                        {post.excerpt}
                                    </p>
                                    <div className="pt-2">
                                        <span className="text-tertiary font-semibold hover:underline inline-flex items-center">
                                            Read Article &rarr;
                                        </span>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </section>
            </main>
        </>
    );
}
