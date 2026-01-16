"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { ShoppingBag, Search, Menu, X, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

const navLinks = [
    { name: "Shop", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Ayurveda", href: "/ayurveda" },
    { name: "Contact", href: "/contact" },
];

export function Navbar() {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Cart Store - Client side only to avoid hydration mismatch
    const cartItems = useCartStore((state) => state.items);
    const [mounted, setMounted] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const checkAuth = () => {
            const currentToken = localStorage.getItem("token");
            console.log("Navbar - token check:", !!currentToken);
            setToken(currentToken);
        };

        setMounted(true);
        checkAuth();

        // Listen for storage changes
        const handleStorageChange = () => {
            console.log("Navbar - storage/auth change detected");
            checkAuth();
        };
        window.addEventListener("storage", handleStorageChange);
        // Also listen for custom login/logout events if we want immediate reactivity in same tab
        window.addEventListener("auth-change", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("auth-change", handleStorageChange);
        };
    }, []);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    return (
        <motion.header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-secondary/80 backdrop-blur-md shadow-sm py-4"
                    : "bg-transparent py-6"
            )}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="font-serif text-3xl font-bold text-primary tracking-wide">
                    <img src="/logo.png" alt="Prashayan" className="h-24 md:h-30 w-auto object-contain" />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="relative text-primary/80 hover:text-primary transition-colors group"
                        >
                            {link.name}
                            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-tertiary transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                </nav>

                {/* Icons */}
                <div className="flex items-center space-x-6 text-primary">
                    <Link
                        href={mounted && token ? "/profile" : "/auth/signin"}
                        className="hover:text-tertiary transition-transform hover:scale-110"
                    >
                        <User className="w-5 h-5" />
                    </Link>
                    {mounted && token && (
                        <button
                            onClick={() => {
                                localStorage.removeItem("token");
                                localStorage.clear(); // Clear all localStorage
                                setToken(null);
                                window.dispatchEvent(new Event("auth-change"));
                                window.location.href = "/auth/signin";
                            }}
                            className="hover:text-red-500 transition-transform hover:scale-110"
                            title="Sign Out"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    )}
                    <button className="hover:text-tertiary transition-transform hover:scale-110">
                        <Search className="w-5 h-5" />
                    </button>
                    <Link href="/cart" className="relative hover:text-tertiary transition-transform hover:scale-110">
                        <ShoppingBag className="w-5 h-5" />
                        {mounted && cartItems.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-tertiary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                {cartItems.length}
                            </span>
                        )}
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 w-full bg-secondary shadow-lg py-6 md:hidden flex flex-col items-center space-y-4"
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-lg text-primary font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    {mounted && token && (
                        <button
                            onClick={() => {
                                localStorage.removeItem("token");
                                setToken(null);
                                window.dispatchEvent(new Event("auth-change"));
                                window.location.href = "/auth/signin";
                            }}
                            className="text-lg text-red-500 font-medium pt-4 border-t border-primary/10 w-full text-center"
                        >
                            Sign Out
                        </button>
                    )}
                </motion.div>
            )}
        </motion.header>
    );
}
