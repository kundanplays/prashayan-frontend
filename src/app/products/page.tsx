"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";

// Hardcoded for now to match seed data, eventual fetch from API
const products = [
    {
        id: 1,
        name: "Pure Himalayan Shilajit",
        slug: "shilajit-resin",
        price: 1499,
        image_url: "/images/shilajit.webp",
        description: "Original, high-potency Shilajit resin.",
    },
    {
        id: 2,
        name: "Shilajit Gold Plus",
        slug: "shilajit-gold",
        price: 2499,
        image_url: "/images/shilajit-gold.webp",
        description: "Premium blend with Swarna Bhasma.",
    },
    {
        id: 3,
        name: "Ashwagandha Vitality",
        slug: "ashwagandha-vitality",
        price: 899,
        image_url: "/images/ashwagandha.webp",
        description: "Organic root extract for stress relief.",
    },
    {
        id: 4,
        name: "Triphala Pure Detox",
        slug: "triphala-detox",
        price: 499,
        image_url: "/images/triphala.webp",
        description: "Digestive health and rejuvenation.",
    },
    {
        id: 5,
        name: "Kesar Radiance Elixir",
        slug: "kesar-elixir",
        price: 3999,
        image_url: "/images/kesar.webp",
        description: "Rare Kashmiri Saffron extract.",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export default function ProductsPage() {
    return (
        <main className="min-h-screen bg-secondary">
            <Navbar />

            <section className="pt-32 pb-20 container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Our Collection</h1>
                    <p className="text-primary/70 max-w-2xl mx-auto">
                        Experience the potency of nature with our carefully crafted Ayurvedic formulations.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {products.map((product) => (
                        <motion.div
                            key={product.id}
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
                        >
                            <Link href={`/products/${product.slug}`}>
                                <div className="relative h-64 overflow-hidden bg-primary/5">
                                    {/* Placeholder for actual image if Next.js Image fails or creating blur */}
                                    <div className="absolute inset-0 flex items-center justify-center text-primary/20 bg-primary/5">
                                        <ShoppingBag className="w-12 h-12" />
                                    </div>
                                    <Image
                                        src={product.image_url}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-serif font-bold text-primary mb-2 line-clamp-1">{product.name}</h3>
                                    <p className="text-primary/60 text-sm mb-4 line-clamp-2">{product.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold text-tertiary">₹{product.price}</span>
                                        <span className="text-sm font-medium text-primary uppercase tracking-wide border-b border-primary/20 pb-0.5 group-hover:border-primary transition-colors">View Details</span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </section>
        </main>
    );
}
