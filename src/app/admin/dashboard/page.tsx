"use client";

import { useEffect, useState } from "react";
import { Users, Package, ShoppingCart, MessageSquare, FileText, CreditCard, TrendingUp, DollarSign } from "lucide-react";
import { admin } from "@/lib/api";

interface DashboardStats {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalReviews: number;
    totalBlogs: number;
    pendingPayments: number;
    monthlyRevenue: number;
    monthlyGrowth: number;
}

interface RecentOrder {
    id: number;
    user_name: string;
    total_amount: number;
    status: string;
    created_at: string;
}

interface RecentReview {
    id: number;
    user_name: string;
    product_name: string;
    rating: number;
    comment: string;
    created_at: string;
}

interface TopProduct {
    name: string;
    sales: number;
    revenue: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalReviews: 0,
        totalBlogs: 0,
        pendingPayments: 0,
        monthlyRevenue: 0,
        monthlyGrowth: 0
    });
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [recentReviews, setRecentReviews] = useState<RecentReview[]>([]);
    const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await admin.dashboard.stats();
                const data = response.data;

                setStats({
                    totalUsers: data.totalUsers,
                    totalProducts: data.totalProducts,
                    totalOrders: data.totalOrders,
                    totalReviews: data.totalReviews,
                    totalBlogs: data.totalBlogs,
                    pendingPayments: data.pendingPayments,
                    monthlyRevenue: data.monthlyRevenue,
                    monthlyGrowth: data.monthlyGrowth
                });

                setRecentOrders(data.recentOrders || []);
                setRecentReviews(data.recentReviews || []);
                setTopProducts(data.topProducts || []);
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
                // Show error state instead of fallback data
                alert("Failed to load dashboard data. Please check your permissions and backend connection.");
                setStats({
                    totalUsers: 0,
                    totalProducts: 0,
                    totalOrders: 0,
                    totalReviews: 0,
                    totalBlogs: 0,
                    pendingPayments: 0,
                    monthlyRevenue: 0,
                    monthlyGrowth: 0
                });
                setRecentOrders([]);
                setRecentReviews([]);
                setTopProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        {
            title: "Total Users",
            value: stats.totalUsers.toLocaleString(),
            icon: Users,
            color: "bg-blue-500"
        },
        {
            title: "Total Products",
            value: stats.totalProducts.toString(),
            icon: Package,
            color: "bg-green-500"
        },
        {
            title: "Total Orders",
            value: stats.totalOrders.toString(),
            icon: ShoppingCart,
            color: "bg-purple-500"
        },
        {
            title: "Total Reviews",
            value: stats.totalReviews.toString(),
            icon: MessageSquare,
            color: "bg-yellow-500"
        },
        {
            title: "Total Blogs",
            value: stats.totalBlogs.toString(),
            icon: FileText,
            color: "bg-indigo-500"
        },
        {
            title: "Pending Payments",
            value: stats.pendingPayments.toString(),
            icon: CreditCard,
            color: "bg-red-500"
        },
        {
            title: "Monthly Revenue",
            value: `₹${stats.monthlyRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: "bg-emerald-500"
        },
        {
            title: "Growth",
            value: `+${stats.monthlyGrowth}%`,
            icon: TrendingUp,
            color: "bg-orange-500"
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome to your admin panel. Here's what's happening with your store.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-lg ${stat.color}`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
                    <div className="space-y-4">
                        {recentOrders.length > 0 ? recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Order #{order.id}</p>
                                    <p className="text-xs text-gray-500">{order.user_name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">₹{order.total_amount}</p>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-500 text-sm">No recent orders</p>
                        )}
                    </div>
                    <button className="mt-4 text-primary hover:text-primary-dark text-sm font-medium">
                        View all orders →
                    </button>
                </div>

                {/* Recent Reviews */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reviews</h3>
                    <div className="space-y-4">
                        {recentReviews.length > 0 ? recentReviews.map((review) => (
                            <div key={review.id} className="py-2 border-b border-gray-100 last:border-b-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-gray-900">{review.user_name}</span>
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i < review.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">{review.product_name}</p>
                                <p className="text-sm text-gray-700">{review.comment}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(review.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        )) : (
                            <p className="text-gray-500 text-sm">No recent reviews</p>
                        )}
                    </div>
                    <button className="mt-4 text-primary hover:text-primary-dark text-sm font-medium">
                        View all reviews →
                    </button>
                </div>
            </div>

            {/* Top Products and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
                    <div className="space-y-4">
                        {topProducts.length > 0 ? topProducts.map((product, index) => (
                            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{product.name}</p>
                                        <p className="text-sm text-gray-600">{product.sales} sales</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-gray-900">₹{product.revenue.toLocaleString()}</p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-500 text-sm">No product sales data available</p>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                            <Package className="w-8 h-8 text-primary mb-2" />
                            <h4 className="font-medium text-gray-900">Add New Product</h4>
                            <p className="text-sm text-gray-600">Create and publish new products</p>
                        </button>
                        <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                            <FileText className="w-8 h-8 text-primary mb-2" />
                            <h4 className="font-medium text-gray-900">Create Blog Post</h4>
                            <p className="text-sm text-gray-600">Write and publish new blog content</p>
                        </button>
                        <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                            <Users className="w-8 h-8 text-primary mb-2" />
                            <h4 className="font-medium text-gray-900">Manage Users</h4>
                            <p className="text-sm text-gray-600">View and manage user accounts</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}