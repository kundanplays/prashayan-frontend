"use client";

import { useParams } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, Check, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { Reviews } from "@/components/Reviews";
import { products as apiProducts, Product } from "@/lib/api";

// Product cache to prevent reloading on navigation
const productCache = new Map<string, { data: Product; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCachedProduct = (slug: string): Product | null => {
    const cached = productCache.get(slug);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }
    return null;
};

const setCachedProduct = (slug: string, product: Product) => {
    productCache.set(slug, { data: product, timestamp: Date.now() });

    // Preload images to browser cache (only on client side)
    if (typeof window !== 'undefined') {
        if (product.image_url) {
            const img = new window.Image();
            img.src = product.image_url;
        }
        if (product.thumbnail_url) {
            const img = new window.Image();
            img.src = product.thumbnail_url;
        }
        if (product.image_urls) {
            product.image_urls.forEach(url => {
                const img = new window.Image();
                img.src = url;
            });
        }
        if (product.full_image_urls) {
            product.full_image_urls.forEach(url => {
                const img = new window.Image();
                img.src = url;
            });
        }
    }
};

// Clear cache function (can be called when products are updated)
const clearProductCache = (slug?: string) => {
    if (slug) {
        productCache.delete(slug);
    } else {
        productCache.clear();
    }
};

// Export for external use (only on client side)
if (typeof window !== 'undefined') {
    (window as any).clearProductCache = clearProductCache;
}

export default function ProductDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFromCache, setIsFromCache] = useState(false);
    const addItem = useCartStore((state) => state.addItem);
    const [added, setAdded] = useState(false);
    const [activeTab, setActiveTab] = useState('Benefits');

    useEffect(() => {
        const fetchProduct = async () => {
            // Check cache first
            const cachedProduct = getCachedProduct(slug);
            if (cachedProduct) {
                setProduct(cachedProduct);
                setIsFromCache(true);
                setLoading(false);
                return;
            }

            // Fetch from API if not cached or cache expired
            try {
                const response = await apiProducts.get(slug);
                setProduct(response.data);
                setIsFromCache(false); // Fresh data from API
                setCachedProduct(slug, response.data);
            } catch (error) {
                console.error("Failed to fetch product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-secondary">
                <div className="animate-pulse text-primary text-xl font-serif">Loading product details...</div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-secondary">
                <p className="text-primary text-xl">Product not found.</p>
            </div>
        );
    }

    const handleAddToCart = () => {
        addItem({
            id: String(product.id),
            name: product.name,
            price: product.selling_price,
            image: product.image_url
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <main className="min-h-screen bg-secondary">
            <div className="container mx-auto px-6 pt-32 pb-20">
                <Link href="/products" className="inline-flex items-center text-primary/60 hover:text-primary mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">

                    {/* Image Side - Animated */}
                    <motion.div
                        initial={isFromCache ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={isFromCache ? { duration: 0 } : { duration: 0.6 }}
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
                        initial={isFromCache ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={isFromCache ? { duration: 0 } : { duration: 0.6, delay: 0.2 }}
                        className="flex flex-col justify-center h-full"
                    >
                        <div className="inline-block px-4 py-1.5 rounded-full bg-tertiary/10 text-tertiary-dark font-semibold text-sm w-fit mb-4">
                            Premium Ayurvedic Formulation
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-6 leading-tight">{product.name}</h1>
                        <p className="text-3xl font-bold text-primary mb-8 flex items-center gap-3">
                            ₹{product.selling_price}
                            <span className="text-lg font-normal text-primary/50 line-through">₹{product.mrp}</span>
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
                        <h3
                            className={`text-xl font-serif font-semibold cursor-pointer pb-4 -mb-[17px] transition-all ${activeTab === 'Benefits' ? 'text-primary border-b-2 border-tertiary' : 'text-primary/40'}`}
                            onClick={() => setActiveTab('Benefits')}
                        >
                            Benefits
                        </h3>
                        <h3
                            className={`text-xl font-serif font-semibold cursor-pointer pb-4 -mb-[17px] transition-all ${activeTab === 'Ingredients' ? 'text-primary border-b-2 border-tertiary' : 'text-primary/40'}`}
                            onClick={() => setActiveTab('Ingredients')}
                        >
                            Ingredients
                        </h3>
                        <h3
                            className={`text-xl font-serif font-semibold cursor-pointer pb-4 -mb-[17px] transition-all ${activeTab === 'How to Use' ? 'text-primary border-b-2 border-tertiary' : 'text-primary/40'}`}
                            onClick={() => setActiveTab('How to Use')}
                        >
                            How to Use
                        </h3>
                    </div>

                    <div className="prose prose-lg text-primary/80 min-h-[200px]">
                        {activeTab === 'Benefits' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <p className="leading-relaxed border-l-4 border-tertiary pl-6 italic mb-8">
                                    Experience the holistic power of Ayurveda. Regular usage supports physical vitality, mental clarity, and emotional well-being.
                                </p>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                                    {product.benefits.split(',').map((benefit, idx) => (
                                        <li key={idx} className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-tertiary shrink-0"></div>
                                            <span>{benefit.trim()}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {activeTab === 'Ingredients' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <p className="leading-relaxed">{product.ingredients}</p>
                                <p className="mt-4 text-sm text-primary/60">Derived from the purest sources, ensuring you get the most potent bio-active compounds.</p>
                            </div>
                        )}

                        {activeTab === 'How to Use' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <p className="leading-relaxed">{product.how_to_use}</p>
                                <div className="mt-8 p-6 bg-primary/5 rounded-2xl border border-primary/10">
                                    <p className="text-sm font-medium text-primary uppercase tracking-widest mb-2">Pro Tip</p>
                                    <p className="text-primary/70">Consistency is key in Ayurveda. For best results, follow the recommended dosage daily.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <Reviews />
            </div>
        </main>
    );
}
