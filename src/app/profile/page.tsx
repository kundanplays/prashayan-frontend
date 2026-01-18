"use client";

import { motion, AnimatePresence } from "framer-motion";
import { User as UserIcon, Package, MapPin, LogOut, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { users as apiUsers, orders as apiOrders } from "@/lib/api";
import { useRouter } from "next/navigation";

interface UserProfile {
    id: number;
    name: string;
    email: string;
    phone: string;
    image_url: string;
    full_image_url: string;
    address: {
        address?: string;
        city?: string;
        state?: string;
        pincode?: string;
    } | null;
}

interface Order {
    id: string | number;
    order_number: string;
    created_at: string;
    total_amount: number;
    status: string;
}

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [user, setUser] = useState<UserProfile | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            console.log("Profile page - token check:", !!token);

            if (!token) {
                console.log("No token found, redirecting to signin");
                router.push("/auth/signin");
                return;
            }

            try {
                console.log("Fetching user and orders data...");
                const [userRes, ordersRes] = await Promise.all([
                    apiUsers.me(),
                    apiOrders.list()
                ]);
                console.log("Data fetched successfully:", { user: !!userRes.data, orders: ordersRes.data?.length });
                setUser(userRes.data as UserProfile);
                setOrders(ordersRes.data);
            } catch (err: any) {
                console.error("Failed to fetch profile data:", err);
                console.error("Error response:", err.response);

                // Only redirect on 401 if we're sure the token is invalid
                if (err.response?.status === 401) {
                    console.log("401 error - token might be invalid, clearing and redirecting");
                    localStorage.removeItem("token");
                    router.push("/auth/signin");
                } else {
                    console.log("Non-401 error, showing error message");
                    setError("Failed to load profile information.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    useEffect(() => {
        const handleAuthChange = () => {
            if (!localStorage.getItem("token")) {
                router.push("/auth/signin");
            }
        };
        window.addEventListener("auth-change", handleAuthChange);
        return () => window.removeEventListener("auth-change", handleAuthChange);
    }, [router]);

    const handleSignOut = () => {
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("auth-change"));
        router.push("/auth/signin");
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-secondary flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-tertiary animate-spin" />
                    <p className="text-primary font-serif">Loading your sanctuary...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-secondary flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button onClick={() => window.location.reload()} className="text-tertiary font-bold hover:underline">Try Again</button>
                </div>
            </main>
        );
    }

    if (!user) return null;

    const avatarLetters = user.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "??";

    return (
        <main className="min-h-screen bg-secondary">
            <div className="container mx-auto px-6 pt-32 pb-20">
                <h1 className="text-3xl font-serif font-bold text-primary mb-8">My Account</h1>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 bg-white rounded-2xl shadow-sm border border-primary/5 h-fit p-4">
                        <div className="flex items-center gap-4 p-4 mb-4 border-b border-primary/5">
                            {user.full_image_url ? (
                                <img src={user.full_image_url} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                            ) : (
                                <div className="w-12 h-12 bg-tertiary rounded-full flex items-center justify-center text-white font-bold text-xl">
                                    {avatarLetters}
                                </div>
                            )}
                            <div className="overflow-hidden">
                                <h3 className="font-semibold text-primary truncate" title={user.name}>{user.name || "Ayurvedic Seeker"}</h3>
                                <p className="text-xs text-primary/60 truncate" title={user.email}>{user.email}</p>
                            </div>
                        </div>

                        <nav className="space-y-1">
                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "profile" ? "bg-secondary text-primary font-medium" : "text-primary/70 hover:bg-secondary/50"}`}
                            >
                                <UserIcon className="w-5 h-5" /> Profile Info
                            </button>
                            <button
                                onClick={() => setActiveTab("orders")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "orders" ? "bg-secondary text-primary font-medium" : "text-primary/70 hover:bg-secondary/50"}`}
                            >
                                <Package className="w-5 h-5" /> Order History
                            </button>
                            <button
                                onClick={() => setActiveTab("address")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "address" ? "bg-secondary text-primary font-medium" : "text-primary/70 hover:bg-secondary/50"}`}
                            >
                                <MapPin className="w-5 h-5" /> Saved Addresses
                            </button>
                            <div className="h-px bg-primary/5 my-2"></div>
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="w-5 h-5" /> Sign Out
                            </button>
                        </nav>
                    </aside>

                    {/* Content Area */}
                    <div className="flex-1">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {activeTab === "profile" && (
                                    <div className="bg-white rounded-2xl shadow-sm border border-primary/5 p-8">
                                        <h2 className="text-xl font-serif font-bold text-primary mb-6">Profile Information</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-sm font-medium text-primary/70 block mb-2">Full Name</label>
                                                <input type="text" value={user.name || ""} readOnly className="w-full px-4 py-3 rounded-xl bg-secondary/30 border-none text-primary" placeholder="Not provided" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-primary/70 block mb-2">Email Address</label>
                                                <input type="text" value={user.email} readOnly className="w-full px-4 py-3 rounded-xl bg-secondary/30 border-none text-primary" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-primary/70 block mb-2">Phone Number</label>
                                                <input type="text" value={user.phone || ""} readOnly className="w-full px-4 py-3 rounded-xl bg-secondary/30 border-none text-primary" placeholder="Not provided" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "orders" && (
                                    <div className="space-y-6">
                                        {orders.length === 0 ? (
                                            <div className="bg-white rounded-2xl shadow-sm border border-primary/5 p-8 flex items-center justify-center min-h-[200px]">
                                                <p className="text-primary/60">You haven't placed any orders yet.</p>
                                            </div>
                                        ) : (
                                            orders.map(order => (
                                                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-primary/5 p-6">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h3 className="font-bold text-primary text-lg">#{order.id} Order ID{order.order_number ? ` - ${order.order_number}` : ''}</h3>
                                                            <p className="text-sm text-primary/60">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                                'bg-tertiary/10 text-tertiary'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center border-t border-primary/5 pt-4">
                                                        <p className="font-bold text-primary">Total: ₹{order.total_amount}</p>
                                                        <Link href={`/track-order?orderId=${order.order_number || order.id}`} className="text-tertiary font-medium hover:underline text-sm">
                                                            Track Order &rarr;
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}

                                {activeTab === "address" && (
                                    <div className="bg-white rounded-2xl shadow-sm border border-primary/5 p-8">
                                        <h2 className="text-xl font-serif font-bold text-primary mb-6">Saved Addresses</h2>
                                        {user.address ? (
                                            <div className="p-6 rounded-xl bg-secondary/30 border border-primary/5 relative">
                                                <div className="absolute top-4 right-4 text-tertiary font-medium text-xs uppercase tracking-widest">Default</div>
                                                <div className="flex gap-4 items-start">
                                                    <MapPin className="w-5 h-5 text-tertiary mt-1" />
                                                    <div>
                                                        <p className="text-primary font-medium mb-1">{user.name}</p>
                                                        <p className="text-primary/70 text-sm leading-relaxed">
                                                            {user.address.address}<br />
                                                            {user.address.city}, {user.address.state} - {user.address.pincode}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
                                                <MapPin className="w-12 h-12 text-primary/10 mb-4" />
                                                <p className="text-primary/60 mb-6">No saved addresses found.</p>
                                                <Link href="/checkout" className="bg-primary text-secondary px-6 py-2 rounded-full font-bold text-sm">Add Address During Checkout</Link>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </main>
    );
}
