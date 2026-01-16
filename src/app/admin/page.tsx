"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { auth, admin } from "@/lib/api";

interface AdminUser {
    id: number;
    email: string;
    name: string;
    role: 'admin' | 'super_admin';
    permissions: string[];
    metadata: {
        access_level: number;
        can_manage_users: boolean;
        can_manage_settings: boolean;
        can_view_analytics: boolean;
        created_by?: string;
    };
    created_at: string;
    last_login?: string;
}

export default function AdminEntry() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check if admin is already authenticated
        checkAuthentication();
    }, []);

    const checkAuthentication = () => {
        // Check for both token and admin_user structure
        const token = localStorage.getItem('token');
        const adminUser = localStorage.getItem('admin_user');

        if (token && adminUser) {
            try {
                const user = JSON.parse(adminUser);
                if (user.role && ['admin', 'super_admin'].includes(user.role)) {
                    setIsAuthenticated(true);
                    // Redirect to dashboard after a brief delay
                    setTimeout(() => {
                        router.replace('/admin/dashboard');
                    }, 1000);
                    return;
                }
            } catch (error) {
                // Invalid data - clear it
                localStorage.removeItem('token');
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_user');
                localStorage.removeItem('admin_logged_in');
            }
        }

        setIsAuthenticated(false);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoggingIn(true);
        setError("");
        setSuccess(false);

        try {
            // 1. Authenticate with backend
            const response = await auth.login(credentials.email, credentials.password);
            const { access_token } = response.data;

            if (!access_token) {
                throw new Error("No access token received");
            }

            // Store token for subsequent requests
            localStorage.setItem("token", access_token);
            // Also store as admin_token for compatibility with existing AdminLayout
            localStorage.setItem("admin_token", access_token);

            // 2. Fetch admin user details
            const userResponse = await admin.me();
            const user = userResponse.data;

            if (!user.role || !['admin', 'super_admin'].includes(user.role)) {
                setError("Access denied. You do not have admin permissions.");
                localStorage.removeItem("token");
                localStorage.removeItem("admin_token");
                return;
            }

            // 3. Construct AdminUser object for local storage (matching AdminLayout expectations)
            const adminUser: AdminUser = {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role as 'admin' | 'super_admin',
                permissions: user.permissions || [],
                metadata: {
                    access_level: user.role === 'super_admin' ? 100 : 50,
                    can_manage_users: user.role === 'super_admin' || (user.permissions && user.permissions.includes('users:*')) || false,
                    can_manage_settings: user.role === 'super_admin' || (user.permissions && user.permissions.includes('settings:*')) || false,
                    can_view_analytics: true,
                    created_by: 'system'
                },
                created_at: user.created_at || new Date().toISOString(),
                last_login: new Date().toISOString()
            };

            localStorage.setItem('admin_user', JSON.stringify(adminUser));
            localStorage.setItem('admin_logged_in', 'true');
            localStorage.setItem('admin_role', adminUser.role);
            localStorage.setItem('admin_access_level', adminUser.metadata.access_level.toString());

            setSuccess(true);

            // Redirect to admin dashboard after success message
            setTimeout(() => {
                router.replace('/admin/dashboard');
            }, 1500);

        } catch (err: any) {
            console.error("Login error:", err);
            if (err.response?.status === 401) {
                setError("Invalid email or password");
            } else if (err.response?.data?.detail) {
                setError(err.response.data.detail);
            } else {
                setError("Login failed. Please check your connection and try again.");
            }
        } finally {
            setIsLoggingIn(false);
        }
    };

    const fillCredentials = () => {
        setCredentials({
            email: "bhawna@Prashayan.com",
            password: "Hellohello@0"
        });
    };

    // Show loading while checking authentication
    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Admin Panel</h2>
                    <p className="text-gray-600">Checking authentication...</p>
                </div>
            </div>
        );
    }

    // If authenticated, show redirect message
    if (isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
                    <p className="text-gray-600 mb-4">
                        You are already logged in as admin. Redirecting to dashboard...
                    </p>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                </div>
            </div>
        );
    }

    // Show success message after login
    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Login Successful!</h1>
                    <p className="text-gray-600 mb-4">
                        Welcome to the Prashayan admin panel. Redirecting...
                    </p>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                </div>
            </div>
        );
    }

    // Show login form
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Panel Login</h1>
                    <p className="text-gray-600 mt-2">Enter your credentials to access the admin panel</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="text-sm text-blue-800">
                        <strong>Admin Access Only:</strong> This login is exclusively for administrators.
                        Regular users should use the main login page.
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start">
                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                            <div className="text-sm text-red-800">
                                {error}
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Admin Email
                        </label>
                        <input
                            type="email"
                            required
                            value={credentials.email}
                            onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="admin@Prashayan.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={credentials.password}
                                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Enter admin password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                ) : (
                                    <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoggingIn}
                        className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                    >
                        {isLoggingIn ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Signing In...
                            </>
                        ) : (
                            <>
                                <Shield className="w-4 h-4" />
                                Sign In to Admin Panel
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 space-y-4">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Quick Actions</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <button
                            onClick={fillCredentials}
                            className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                            Fill Demo Credentials
                        </button>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                    <div className="text-center">
                        <p className="text-sm text-gray-600">Regular user login?</p>
                        <a
                            href="/auth/signin"
                            className="text-primary hover:underline text-sm font-medium"
                        >
                            User Sign In →
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
