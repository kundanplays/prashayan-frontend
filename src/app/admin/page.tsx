"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";

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
        const adminToken = localStorage.getItem('admin_token');
        const adminUser = localStorage.getItem('admin_user');

        if (adminToken && adminUser) {
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
            // Check if admin user exists in localStorage (from setup)
            let storedAdmin = localStorage.getItem('dev_admin_user');

            // If no admin user exists, create one automatically for development
            if (!storedAdmin && process.env.NODE_ENV === 'development') {
                console.log('No admin user found, creating development admin user...');
                const mockAdminUser = {
                    id: Date.now(),
                    email: "bhawna@Prashayan.com",
                    name: "Bhawna Admin",
                    password: "Hellohello@0",
                    role: "super_admin" as const,
                    permissions: [
                        'dashboard:*',
                        'users:*',
                        'products:*',
                        'orders:*',
                        'reviews:*',
                        'blogs:*',
                        'payments:*',
                        'analytics:*',
                        'settings:*'
                    ],
                    metadata: {
                        access_level: 100,
                        can_manage_users: true,
                        can_manage_settings: true,
                        can_view_analytics: true,
                        created_by: 'development'
                    },
                    created_at: new Date().toISOString(),
                    last_login: new Date().toISOString()
                };

                // Store the admin user
                localStorage.setItem('dev_admin_user', JSON.stringify(mockAdminUser));
                storedAdmin = JSON.stringify(mockAdminUser);
            }

            if (!storedAdmin) {
                setError("No admin user configured. Please set up admin user first.");
                return;
            }

            const adminUser = JSON.parse(storedAdmin);

            // Verify credentials
            if (adminUser.email !== credentials.email || adminUser.password !== credentials.password) {
                setError("Invalid email or password");
                return;
            }

            // Validate admin user structure and role
            if (!adminUser.role || !['admin', 'super_admin'].includes(adminUser.role)) {
                setError("Invalid admin user configuration. Please recreate admin user.");
                return;
            }

            if (!adminUser.metadata || typeof adminUser.metadata.access_level !== 'number') {
                setError("Invalid admin metadata. Please recreate admin user.");
                return;
            }

            // Create admin session with metadata validation
            const adminToken = btoa(`${adminUser.email}:${Date.now()}:${adminUser.role}`);
            const sessionUser = {
                ...adminUser,
                last_login: new Date().toISOString()
            };

            localStorage.setItem('admin_token', adminToken);
            localStorage.setItem('admin_user', JSON.stringify(sessionUser));
            localStorage.setItem('admin_logged_in', 'true');
            localStorage.setItem('admin_role', adminUser.role);
            localStorage.setItem('admin_access_level', adminUser.metadata.access_level.toString());

            setSuccess(true);

            // Log admin login details for verification
            console.log('Admin Login Successful:', {
                email: adminUser.email,
                role: adminUser.role,
                access_level: adminUser.metadata.access_level,
                permissions: adminUser.permissions,
                can_manage_users: adminUser.metadata.can_manage_users,
                can_manage_settings: adminUser.metadata.can_manage_settings
            });

            // Redirect to admin dashboard after success message
            setTimeout(() => {
                router.replace('/admin/dashboard');
            }, 1500);

        } catch (err) {
            setError("Login failed. Please try again.");
        } finally {
            setIsLoggingIn(false);
        }
    };

    const enableDevelopmentAdmin = () => {
        // Create a mock admin user directly
        const mockAdminUser = {
            id: Date.now(),
            email: "bhawna@Prashayan.com",
            name: "Bhawna Admin",
            password: "Hellohello@0",
            role: "super_admin" as const,
            permissions: [
                'dashboard:*',
                'users:*',
                'products:*',
                'orders:*',
                'reviews:*',
                'blogs:*',
                'payments:*',
                'analytics:*',
                'settings:*'
            ],
            metadata: {
                access_level: 100,
                can_manage_users: true,
                can_manage_settings: true,
                can_view_analytics: true,
                created_by: 'development'
            },
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString()
        };

        // Store in localStorage
        localStorage.setItem('dev_admin_user', JSON.stringify(mockAdminUser));

        // Create admin session
        const adminToken = btoa(`${mockAdminUser.email}:${Date.now()}:${mockAdminUser.role}`);
        localStorage.setItem('admin_token', adminToken);
        localStorage.setItem('admin_user', JSON.stringify(mockAdminUser));
        localStorage.setItem('admin_logged_in', 'true');
        localStorage.setItem('admin_role', mockAdminUser.role);
        localStorage.setItem('admin_access_level', mockAdminUser.metadata.access_level.toString());

        setSuccess(true);

        // Redirect to dashboard
        setTimeout(() => {
            router.replace('/admin/dashboard');
        }, 1000);
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
                            onClick={enableDevelopmentAdmin}
                            className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            <Shield className="w-4 h-4" />
                            Enable Development Admin Access
                        </button>

                        <div className="text-center text-sm text-gray-500">or</div>

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
                        <p className="text-sm text-gray-600">Need to set up admin user?</p>
                        <a
                            href="/admin/setup"
                            className="text-primary hover:underline text-sm font-medium"
                        >
                            Create Admin Account →
                        </a>
                    </div>

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