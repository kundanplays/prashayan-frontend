"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, AlertTriangle, AlertCircle } from "lucide-react";

export default function DevAdminLogin() {
    const [credentials, setCredentials] = useState({
        email: "bhawna@Prashayan.com",
        password: "Hellohello@0"
    });
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const loginAsAdmin = () => {
        setIsLoggingIn(true);
        setError("");

        try {
            // Check if admin user exists in localStorage
            const storedAdmin = localStorage.getItem('dev_admin_user');
            if (!storedAdmin) {
                setError("No admin user found. Please create an admin user first at /admin/setup");
                setIsLoggingIn(false);
                return;
            }

            const adminUser = JSON.parse(storedAdmin);

            // Verify credentials
            if (adminUser.email !== credentials.email || adminUser.password !== credentials.password) {
                setError("Invalid email or password");
                setIsLoggingIn(false);
                return;
            }

            // Store authentication
            localStorage.setItem('admin_bypass', 'true');
            localStorage.setItem('dev_admin_logged_in', 'true');
            localStorage.setItem('dev_admin_data', JSON.stringify(adminUser));

            // Redirect to admin panel
            router.push('/admin');

        } catch (err) {
            setError("Login failed. Please try again.");
        } finally {
            setIsLoggingIn(false);
        }
    };

    const quickEnableAdmin = () => {
        localStorage.setItem('admin_bypass', 'true');
        router.push('/admin');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Development Admin Access</h1>
                    <p className="text-gray-600 mt-2">Enable admin panel for development testing</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div className="text-sm text-blue-800">
                            <strong>Development Only:</strong> This simulates admin login for testing purposes.
                            Do not use in production!
                        </div>
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

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={credentials.email}
                            onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="admin@prashayan.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={credentials.password}
                            onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Enter password"
                        />
                    </div>

                    <button
                        onClick={loginAsAdmin}
                        disabled={isLoggingIn}
                        className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                    >
                        {isLoggingIn ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Logging In...
                            </>
                        ) : (
                            <>
                                <Shield className="w-4 h-4" />
                                Login as Admin
                            </>
                        )}
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or</span>
                        </div>
                    </div>

                    <button
                        onClick={quickEnableAdmin}
                        className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                        Quick Admin Access (Bypass)
                    </button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="text-center space-y-2">
                        <p className="text-sm text-gray-600">Don't have an admin user yet?</p>
                        <a
                            href="/admin/setup"
                            className="text-primary hover:underline text-sm font-medium"
                        >
                            Create Admin User →
                        </a>
                    </div>
                    <div className="mt-4 text-xs text-gray-500 space-y-1">
                        <p><strong>Default Admin:</strong></p>
                        <p>Email: bhawna@prashayan.com</p>
                        <p>Password: Hellohello@0</p>
                    </div>
                </div>
            </div>
        </div>
    );
}