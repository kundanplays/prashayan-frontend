"use client";

import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { useCartStore } from "@/store/cart";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, Check, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Reviews } from "@/components/Reviews";

// Mock Data (matches listing)
const products = [
    {
        id: "1",
        name: "Pure Himalayan Shilajit",
        slug: "shilajit-resin",
        price: 1499,
        image_url: "/images/shilajit.webp",
        description: "Original, high-potency Shilajit resin sourced from the highest altitudes of the Himalayas. Boosts energy and vitality.",
    },
    {
        id: "2",
        name: "Shilajit Gold Plus",
        slug: "shilajit-gold",
        price: 2499,
        image_url: "/images/shilajit-gold.webp",
        description: "A premium blend of Shilajit and Swarna Bhasma (Gold Ash) for enhanced vigor, immunity, and anti-aging benefits.",
    },
    {
        id: "3",
        name: "Ashwagandha Vitality",
        slug: "ashwagandha-vitality",
        price: 899,
        image_url: "/images/ashwagandha.webp",
        description: "Organic Ashwagandha root extract to reduce stress, improve sleep, and increase muscle strength.",
    },
    {
        id: "4",
        name: "Triphala Pure Detox",
        slug: "triphala-detox",
        price: 499,
        image_url: "/images/triphala.webp",
        description: "A classic Ayurvedic herbal blend for digestive health, detoxification, and rejuvenation.",
    },
    {
        id: "5",
        name: "Kesar Radiance Elixir",
        slug: "kesar-elixir",
        price: 3999,
        image_url: "/images/kesar.webp",
        description: "Rare Kashmiri Saffron extract infused with essential oils for glowing skin and mental clarity.",
    },
];

export default function ProductDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const product = products.find((p) => p.slug === slug);
    const addItem = useCartStore((state) => state.addItem);
    const [added, setAdded] = useState(false);
    const [activeTab, setActiveTab] = useState('Benefits');

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-secondary">
                <p className="text-primary text-xl">Product not found.</p>
            </div>
        );
    }

    const handleAddToCart = () => {
        addItem(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <main className="min-h-screen bg-secondary">
            <Navbar />

            <div className="container mx-auto px-6 pt-32 pb-20">
                <Link href="/products" className="inline-flex items-center text-primary/60 hover:text-primary mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">

                    {/* Image Side - Animated */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl bg-white border border-primary/5 relative z-10">
                            <Image
                                src={product.image_url}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        {/* Decorative Background Blob */}
                        <div className="absolute top-10 -left-10 w-full h-full bg-primary/5 rounded-[3rem] -z-10 blur-xl"></div>
                    </motion.div>

                    {/* Details Side - Animated */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col justify-center h-full"
                    >
                        <div className="inline-block px-4 py-1.5 rounded-full bg-tertiary/10 text-tertiary-dark font-semibold text-sm w-fit mb-4">
                            Premium Ayurvedic Formulation
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-6 leading-tight">{product.name}</h1>
                        <p className="text-3xl font-bold text-primary mb-8 flex items-center gap-3">
                            ₹{product.price}
                            <span className="text-lg font-normal text-primary/50 line-through">₹{product.price + 500}</span>
                        </p>

                        <p className="text-primary/70 mb-10 leading-relaxed text-lg border-l-4 border-tertiary pl-6">
                            {product.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-10">
                            <div className="bg-white p-4 rounded-xl border border-primary/5">
                                <h4 className="font-semibold text-primary mb-1">100% Natural</h4>
                                <p className="text-xs text-primary/60">Zero synthetic additives</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-primary/5">
                                <h4 className="font-semibold text-primary mb-1">GMP Certified</h4>
                                <p className="text-xs text-primary/60">Quality manufacturing</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                className={`flex-1 flex items-center justify-center gap-2 px-10 py-5 rounded-full text-lg font-bold transition-all duration-300 ${added ? 'bg-green-600 text-white' : 'bg-primary text-secondary hover:bg-primary-dark hover:shadow-lg'}`}
                            >
                                {added ? (
                                    <>
                                        <Check className="w-5 h-5" /> Added to Cart
                                    </>
                                ) : (
                                    <>
                                        <ShoppingBag className="w-5 h-5" /> Add to Cart
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Expanded Info Tabs */}
                <div className="max-w-4xl mx-auto mb-24">
                    <div className="flex flex-wrap gap-8 border-b border-primary/10 pb-4 mb-10">
                        <h3 className="text-xl font-serif font-semibold text-primary cursor-pointer border-b-2 border-tertiary pb-4 -mb-[17px]">Benefits</h3>
                        <h3 className="text-xl font-serif font-semibold text-primary/40 cursor-pointer pb-4">Ingredients</h3>
                        <h3 className="text-xl font-serif font-semibold text-primary/40 cursor-pointer pb-4">How to Use</h3>
                    </div>

                    <div className="prose prose-lg text-primary/80">
                        <p className="leading-relaxed">
                            Experience the holistic power of Ayurveda. This formulation is designed to restore balance to your Doshas.
                            Regular usage supports physical vitality, mental clarity, and emotional well-being.
                            Derived from the purest sources in the Himalayas, ensuring you get the most potent bio-active compounds.
                        </p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                            <li className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                                <span>Boosts Immunity naturally</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                                <span>Improves Stamina and Energy</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                                <span>Reduces Stress and Anxiety</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                                <span>Supports deep, restorative sleep</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <Reviews />
            </div>
        </main>
    );
}
