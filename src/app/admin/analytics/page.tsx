"use client";

import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, TrendingDown, Users, Package, ShoppingCart, MessageSquare, DollarSign } from "lucide-react";
import { admin } from "@/lib/api";

interface AnalyticsData {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    totalProducts: number;
    totalReviews: number;
    monthlyRevenue: number[];
    monthlyOrders: number[];
    monthlyUsers: number[];
    topProducts: Array<{
        name: string;
        sales: number;
        revenue: number;
    }>;
    recentActivity: Array<{
        type: string;
        description: string;
        timestamp: string;
    }>;
}

export default function AnalyticsDashboard() {
    const [analytics, setAnalytics] = useState<AnalyticsData>({
        totalRevenue: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalProducts: 0,
        totalReviews: 0,
        monthlyRevenue: [],
        monthlyOrders: [],
        monthlyUsers: [],
        topProducts: [],
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState("30d");

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const [overviewRes, revenueRes, usersRes, productsRes] = await Promise.all([
                admin.analytics.overview(),
                admin.analytics.revenue(),
                admin.analytics.users(),
                admin.analytics.products()
            ]);

            setAnalytics({
                totalRevenue: overviewRes.data.totalRevenue,
                totalOrders: overviewRes.data.totalOrders,
                totalUsers: overviewRes.data.totalUsers,
                totalProducts: overviewRes.data.totalProducts,
                totalReviews: overviewRes.data.totalReviews,
                monthlyRevenue: revenueRes.data.monthly,
                monthlyOrders: overviewRes.data.monthlyOrders,
                monthlyUsers: usersRes.data.monthly,
                topProducts: productsRes.data.topProducts,
                recentActivity: overviewRes.data.recentActivity
            });
        } catch (error) {
            console.error("Error fetching analytics:", error);
            alert(error instanceof Error ? error.message : "Failed to load analytics data. Please check your permissions.");
            // Fallback to empty data
            setAnalytics({
                totalRevenue: 0,
                totalOrders: 0,
                totalUsers: 0,
                totalProducts: 0,
                totalReviews: 0,
                monthlyRevenue: [],
                monthlyOrders: [],
                monthlyUsers: [],
                topProducts: [],
                recentActivity: []
            });
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case "order":
                return <ShoppingCart className="w-4 h-4 text-blue-500" />;
            case "user":
                return <Users className="w-4 h-4 text-green-500" />;
            case "review":
                return <MessageSquare className="w-4 h-4 text-yellow-500" />;
            case "product":
                return <Package className="w-4 h-4 text-purple-500" />;
            default:
                return <BarChart3 className="w-4 h-4 text-gray-500" />;
        }
    };

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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                    <p className="text-gray-600 mt-1">Insights and performance metrics</p>
                </div>
                <div className="flex items-center space-x-2">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                        <option value="1y">Last year</option>
                    </select>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.totalRevenue)}</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-green-500" />
                    </div>
                    <div className="flex items-center mt-2">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">+12.5% from last month</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-900">{analytics.totalOrders}</p>
                        </div>
                        <ShoppingCart className="w-8 h-8 text-blue-500" />
                    </div>
                    <div className="flex items-center mt-2">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">+8.2% from last month</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900">{analytics.totalUsers}</p>
                        </div>
                        <Users className="w-8 h-8 text-purple-500" />
                    </div>
                    <div className="flex items-center mt-2">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">+15.3% from last month</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Products</p>
                            <p className="text-2xl font-bold text-gray-900">{analytics.totalProducts}</p>
                        </div>
                        <Package className="w-8 h-8 text-orange-500" />
                    </div>
                    <div className="flex items-center mt-2">
                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                        <span className="text-sm text-red-600">-2.1% from last month</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                            <p className="text-2xl font-bold text-gray-900">{analytics.totalReviews}</p>
                        </div>
                        <MessageSquare className="w-8 h-8 text-yellow-500" />
                    </div>
                    <div className="flex items-center mt-2">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">+5.7% from last month</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                    <div className="h-64 flex items-end justify-between space-x-2">
                        {analytics.monthlyRevenue.map((revenue, index) => {
                            const maxRevenue = Math.max(...analytics.monthlyRevenue);
                            const height = (revenue / maxRevenue) * 100;
                            return (
                                <div key={index} className="flex-1 flex flex-col items-center">
                                    <div
                                        className="w-full bg-primary rounded-t"
                                        style={{ height: `${height}%` }}
                                    ></div>
                                    <span className="text-xs text-gray-600 mt-2">
                                        {formatCurrency(revenue)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-gray-500">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                    </div>
                </div>

                {/* Orders Chart */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders Trend</h3>
                    <div className="h-64 flex items-end justify-between space-x-2">
                        {analytics.monthlyOrders.map((orders, index) => {
                            const maxOrders = Math.max(...analytics.monthlyOrders);
                            const height = (orders / maxOrders) * 100;
                            return (
                                <div key={index} className="flex-1 flex flex-col items-center">
                                    <div
                                        className="w-full bg-blue-500 rounded-t"
                                        style={{ height: `${height}%` }}
                                    ></div>
                                    <span className="text-xs text-gray-600 mt-2">{orders}</span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-gray-500">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                    </div>
                </div>
            </div>

            {/* Top Products and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
                    <div className="space-y-4">
                        {analytics.topProducts.map((product, index) => (
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
                                    <p className="font-medium text-gray-900">{formatCurrency(product.revenue)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {analytics.recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-start space-x-3 py-2 border-b border-gray-100 last:border-b-0">
                                <div className="mt-1">
                                    {getActivityIcon(activity.type)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-900">{activity.description}</p>
                                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Additional Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Average Order Value</h4>
                    <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(analytics.totalRevenue / analytics.totalOrders)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Per order</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Conversion Rate</h4>
                    <p className="text-2xl font-bold text-gray-900">3.2%</p>
                    <p className="text-sm text-gray-600 mt-1">Visitors to customers</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Customer Satisfaction</h4>
                    <p className="text-2xl font-bold text-gray-900">4.8/5</p>
                    <p className="text-sm text-gray-600 mt-1">Average rating</p>
                </div>
            </div>
        </div>
    );
}