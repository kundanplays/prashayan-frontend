"use client";

import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { useCartStore } from "@/store/cart";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, Check, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock Data (matches listing)
const products = [
    {
        id: 1,
        name: "Pure Himalayan Shilajit",
        slug: "shilajit-resin",
        price: 1499,
        image_url: "/images/shilajit.webp",
        description: "Original, high-potency Shilajit resin sourced from the highest altitudes of the Himalayas. Boosts energy and vitality.",
    },
    {
        id: 2,
        name: "Shilajit Gold Plus",
        slug: "shilajit-gold",
        price: 2499,
        image_url: "/images/shilajit-gold.webp",
        description: "A premium blend of Shilajit and Swarna Bhasma (Gold Ash) for enhanced vigor, immunity, and anti-aging benefits.",
    },
    {
        id: 3,
        name: "Ashwagandha Vitality",
        slug: "ashwagandha-vitality",
        price: 899,
        image_url: "/images/ashwagandha.webp",
        description: "Organic Ashwagandha root extract to reduce stress, improve sleep, and increase muscle strength.",
    },
    {
        id: 4,
        name: "Triphala Pure Detox",
        slug: "triphala-detox",
        price: 499,
        image_url: "/images/triphala.webp",
        description: "A classic Ayurvedic herbal blend for digestive health, detoxification, and rejuvenation.",
    },
    {
        id: 5,
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Image Side - Animated */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl bg-white"
                    >
                        <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                    </motion.div>

                    {/* Details Side - Animated */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">{product.name}</h1>
                        <p className="text-2xl font-bold text-tertiary mb-6">₹{product.price}</p>

                        <p className="text-primary/70 mb-8 leading-relaxed text-lg">
                            {product.description}
                        </p>

                        <button
                            onClick={handleAddToCart}
                            className={`flex items-center justify-center gap-2 w-full md:w-auto px-10 py-4 rounded-full text-lg font-bold transition-all duration-300 ${added ? 'bg-green-600 text-white' : 'bg-primary text-secondary hover:bg-primary-dark hover:shadow-lg'}`}
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
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
