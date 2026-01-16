"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Mail, Lock } from "lucide-react";

import { auth } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const res = await auth.login(email, password);
            localStorage.setItem("token", res.data.access_token);
            // Dispatch auth change event to update Navbar state
            window.dispatchEvent(new Event("auth-change"));
            // Redirect to profile
            router.push("/profile");
        } catch (err: any) {
            // Extract the specific error message from backend response
            const errorMessage = err.response?.data?.detail || "Login failed. Please try again.";
            setError(errorMessage);
            console.error("Login failed", err);
        }
    };

    return (
        <main className="min-h-screen bg-secondary">
            <div className="container mx-auto px-6 pt-32 pb-20 flex items-center justify-center min-h-[80vh]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white p-8 md:p-12 rounded-3xl shadow-xl w-full max-w-md relative overflow-hidden"
                >
                    {/* Decorative background blob */}
                    <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-tertiary/10 rounded-full blur-2xl" />

                    <h1 className="text-3xl font-serif font-bold text-primary mb-2 text-center">Welcome Back</h1>
                    <p className="text-primary/60 text-center mb-8">Sign in to your Prashayan account</p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-primary block ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary/50 border border-primary/10 focus:border-tertiary focus:ring-1 focus:ring-tertiary outline-none transition-all text-primary"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-primary block ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary/50 border border-primary/10 focus:border-tertiary focus:ring-1 focus:ring-tertiary outline-none transition-all text-primary"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Link href="/auth/forgot-password" className="text-sm text-tertiary hover:underline font-medium">
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary text-secondary py-3.5 rounded-xl font-bold text-lg hover:bg-primary-dark transition-colors shadow-lg flex items-center justify-center gap-2 group"
                        >
                            Sign In
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-8 text-center text-primary/60 text-sm">
                        Don't have an account?{" "}
                        <Link href="/auth/signup" className="text-tertiary font-bold hover:underline">
                            Create one
                        </Link>
                    </div>
                </motion.div>
            </div>
        </main >
    );
}
