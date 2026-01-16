"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import { products as apiProducts, Product } from "@/lib/api";

// Products list cache
const productsCache = { data: null as Product[] | null, timestamp: 0 };
const PRODUCTS_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Clear products cache function
const clearProductsCache = () => {
    productsCache.data = null;
    productsCache.timestamp = 0;
};

// Export for external use (only on client side)
if (typeof window !== 'undefined') {
    (window as any).clearProductsCache = clearProductsCache;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFromCache, setIsFromCache] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            // Check cache first
            if (productsCache.data && Date.now() - productsCache.timestamp < PRODUCTS_CACHE_DURATION) {
                setProducts(productsCache.data);
                setIsFromCache(true);
                setLoading(false);
                return;
            }

            try {
                const response = await apiProducts.list();
                setProducts(response.data);
                setIsFromCache(false); // Fresh data from API
                productsCache.data = response.data;
                productsCache.timestamp = Date.now();

                // Preload product images (only on client side)
                if (typeof window !== 'undefined') {
                    response.data.forEach(product => {
                        if (product.thumbnail_url) {
                            const img = new window.Image();
                            img.src = product.thumbnail_url;
                        }
                    });
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

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

    if (loading) {
        return (
            <main className="min-h-screen bg-secondary flex items-center justify-center">
                <div className="animate-pulse text-primary text-xl font-serif">Loading our collection...</div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-secondary">
            <section className="pt-32 pb-20 container mx-auto px-6">
                <motion.div
                    initial={isFromCache ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={isFromCache ? { duration: 0 } : { duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Our Collection</h1>
                    <p className="text-primary/70 max-w-2xl mx-auto">
                        Experience the potency of nature with our carefully crafted Ayurvedic formulations.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial={isFromCache ? "show" : "hidden"}
                    animate="show"
                    transition={isFromCache ? { duration: 0 } : undefined}
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
                                        <span className="text-lg font-bold text-tertiary">₹{product.selling_price}</span>
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
