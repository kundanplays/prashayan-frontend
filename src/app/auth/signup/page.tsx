"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Mail, Lock, User, ShieldCheck, RefreshCw, Phone } from "lucide-react";
import { auth } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
    const [step, setStep] = useState<"details" | "otp">("details");
    const [signupData, setSignupData] = useState({ name: "", email: "", password: "", phone: "" });
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [timer, setTimer] = useState(0);
    const router = useRouter();
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    useEffect(() => {
        if (step === "otp") {
            // Auto-focus first OTP input when OTP step is shown
            setTimeout(() => otpRefs.current[0]?.focus(), 100);
        }
    }, [step]);

    const handleInitialSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            // 1. Generate OTP first (don't register user yet)
            await auth.otp.generate(signupData.email);

            setStep("otp");
            setTimer(60);
        } catch (err: any) {
            const msg = err.response?.data?.detail || "Failed to send OTP. Please try again.";
            setError(msg);
            console.error("OTP generation error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            // 1. Verify OTP
            await auth.otp.verify(signupData.email, otp);

            // 2. Register the user (now that OTP is verified)
            await auth.register(signupData.email, signupData.password, signupData.name, signupData.phone);

            // 3. Log them in automatically
            const res = await auth.login(signupData.email, signupData.password);
            localStorage.setItem("token", res.data.access_token);
            // Dispatch auth change event to update Navbar state
            window.dispatchEvent(new Event("auth-change"));

            router.push("/profile");
        } catch (err: any) {
            const msg = err.response?.data?.detail || "Verification failed. Please check your OTP and try again.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (timer > 0) return;
        setError("");
        try {
            await auth.otp.generate(signupData.email);
            setTimer(60);
        } catch (err) {
            setError("Failed to resend OTP.");
        }
    };

    return (
        <main className="min-h-screen bg-secondary">
            <div className="container mx-auto px-6 pt-32 pb-20 flex items-center justify-center min-h-[80vh]">
                <div className="w-full max-w-md">
                    <AnimatePresence mode="wait">
                        {step === "details" ? (
                            <motion.div
                                key="details-form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-white p-8 md:p-12 rounded-3xl shadow-xl relative overflow-hidden"
                            >
                                <div className="absolute bottom-[-50px] left-[-50px] w-32 h-32 bg-primary/10 rounded-full blur-2xl" />

                                <h1 className="text-3xl font-serif font-bold text-primary mb-2 text-center">Join Prashayan</h1>
                                <p className="text-primary/60 text-center mb-8">Start your holistic wellness journey</p>

                                {error && (
                                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 animate-pulse">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleInitialSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-primary block ml-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
                                            <input
                                                type="text"
                                                value={signupData.name}
                                                onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary/50 border border-primary/10 focus:border-tertiary focus:ring-1 focus:ring-tertiary outline-none transition-all text-primary"
                                                placeholder="Your Name"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-primary block ml-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
                                            <input
                                                type="email"
                                                value={signupData.email}
                                                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary/50 border border-primary/10 focus:border-tertiary focus:ring-1 focus:ring-tertiary outline-none transition-all text-primary"
                                                placeholder="you@example.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-primary block ml-1">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
                                            <input
                                                type="tel"
                                                value={signupData.phone}
                                                onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary/50 border border-primary/10 focus:border-tertiary focus:ring-1 focus:ring-tertiary outline-none transition-all text-primary"
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-primary block ml-1">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
                                            <input
                                                type="password"
                                                value={signupData.password}
                                                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary/50 border border-primary/10 focus:border-tertiary focus:ring-1 focus:ring-tertiary outline-none transition-all text-primary"
                                                placeholder="Create a strong password"
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-primary text-secondary py-3.5 rounded-xl font-bold text-lg hover:bg-primary-dark disabled:opacity-50 transition-colors shadow-lg flex items-center justify-center gap-2 group"
                                    >
                                        {loading ? "Creating Account..." : "Create Account"}
                                        {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                                    </button>
                                </form>

                                <div className="mt-8 text-center text-primary/60 text-sm">
                                    Already have an account?{" "}
                                    <Link href="/auth/signin" className="text-tertiary font-bold hover:underline">
                                        Sign in
                                    </Link>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="otp-form"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white p-8 md:p-12 rounded-3xl shadow-xl relative overflow-hidden"
                            >
                                <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-tertiary/10 rounded-full blur-2xl" />

                                <div className="w-20 h-20 bg-tertiary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <ShieldCheck className="w-10 h-10 text-tertiary" />
                                </div>

                                <h1 className="text-3xl font-serif font-bold text-primary mb-2 text-center">Verify Email</h1>
                                <p className="text-primary/60 text-center mb-8">
                                    We've sent a 6-digit code to <span className="font-bold text-primary">{signupData.email}</span>
                                </p>

                                {error && (
                                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleOtpSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-center gap-3">
                                            {[0, 1, 2, 3, 4, 5].map((index) => (
                                                <div key={index} className="relative">
                                                    <input
                                                        ref={(el) => { otpRefs.current[index] = el; }}
                                                        type="text"
                                                        value={otp[index] || ""}
                                                        onChange={(e) => {
                                                            const value = e.target.value.replace(/\D/g, "");
                                                            if (value.length <= 1) {
                                                                const newOtp = otp.split("");
                                                                newOtp[index] = value;
                                                                setOtp(newOtp.join(""));
                                                                // Auto-focus next input
                                                                if (value && index < 5) {
                                                                    otpRefs.current[index + 1]?.focus();
                                                                }
                                                            }
                                                        }}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Backspace" && !otp[index] && index > 0) {
                                                                otpRefs.current[index - 1]?.focus();
                                                            }
                                                        }}
                                                        onPaste={(e) => {
                                                            e.preventDefault();
                                                            const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
                                                            if (pastedData) {
                                                                setOtp(pastedData);
                                                                // Focus the next empty input or the last input
                                                                const nextIndex = Math.min(pastedData.length, 5);
                                                                otpRefs.current[nextIndex]?.focus();
                                                            }
                                                        }}
                                                        onFocus={(e) => e.target.select()}
                                                        className="w-12 h-12 text-center text-xl font-bold rounded-xl bg-secondary/50 border-2 border-primary/10 focus:border-tertiary focus:ring-0 outline-none transition-all text-primary"
                                                        maxLength={1}
                                                    />
                                                    {!otp[index] && (
                                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                            <img src="/shilajit.png" alt="" className="w-6 h-6 opacity-20 rounded" />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || otp.replace(/\s/g, "").length !== 6}
                                        className="w-full bg-primary text-secondary py-3.5 rounded-xl font-bold text-lg hover:bg-primary-dark disabled:opacity-50 transition-colors shadow-lg flex items-center justify-center gap-2 group"
                                    >
                                        {loading ? "Verifying..." : "Verify & Continue"}
                                        {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                                    </button>
                                </form>

                                <div className="mt-8 text-center space-y-4">
                                    <div className="text-primary/60 text-sm">
                                        Didn't receive the code?
                                    </div>
                                    <button
                                        onClick={handleResendOtp}
                                        disabled={timer > 0}
                                        className={`flex items-center justify-center gap-2 mx-auto font-bold text-sm transition-colors ${timer > 0 ? "text-primary/40 cursor-not-allowed" : "text-tertiary hover:underline"}`}
                                    >
                                        {timer > 0 ? (
                                            `Resend in ${timer}s`
                                        ) : (
                                            <>
                                                <RefreshCw className="w-4 h-4" /> Resend OTP
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={() => setStep("details")}
                                        className="block mx-auto text-primary/40 text-xs hover:text-primary transition-colors"
                                    >
                                        Use a different email address
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </main>
    );
}
