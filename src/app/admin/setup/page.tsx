"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Shield, CheckCircle, AlertCircle } from "lucide-react";

interface AdminUser {
    id: number;
    email: string;
    name: string;
    password: string;
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

export default function AdminSetup() {
    const [formData, setFormData] = useState({
        email: "bhawna@Prashayan.com",
        password: "Hellohello@0",
        name: "Bhawna Admin",
        role: "super_admin"
    });

    const [isCreating, setIsCreating] = useState(false);
    const [created, setCreated] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const createAdminUser = () => {
        setIsCreating(true);
        setError("");

        try {
            // Validate input
            if (!formData.email || !formData.password || !formData.name) {
                throw new Error("All fields are required");
            }

            if (formData.password.length < 8) {
                throw new Error("Password must be at least 8 characters");
            }

            // Create admin user object with role-based metadata
            const isSuperAdmin = formData.role === 'super_admin';

            const adminUser: AdminUser = {
                id: Date.now(), // Simple ID generation
                email: formData.email,
                name: formData.name,
                password: formData.password, // In production, this would be hashed
                role: formData.role as 'admin' | 'super_admin',
                permissions: isSuperAdmin ? [
                    // Super admin gets all permissions
                    'dashboard:*',
                    'users:*',
                    'products:*',
                    'orders:*',
                    'reviews:*',
                    'blogs:*',
                    'payments:*',
                    'analytics:*',
                    'settings:*'
                ] : [
                    // Regular admin gets limited permissions
                    'dashboard:read',
                    'users:read',
                    'products:*', // Can manage products
                    'orders:*',   // Can manage orders
                    'reviews:*',  // Can manage reviews
                    'blogs:*',    // Can manage blogs
                    'payments:read', // Can only view payments
                    'analytics:read' // Can only view analytics
                    // No settings access for regular admin
                ],
                metadata: {
                    access_level: isSuperAdmin ? 100 : 50,
                    can_manage_users: isSuperAdmin,
                    can_manage_settings: isSuperAdmin,
                    can_view_analytics: true,
                    created_by: 'system'
                },
                created_at: new Date().toISOString()
            };

            // Store in localStorage for development
            localStorage.setItem('dev_admin_user', JSON.stringify(adminUser));
            localStorage.setItem('admin_bypass', 'true');

            setCreated(true);

            // Redirect to admin entry after 2 seconds
            setTimeout(() => {
                router.push('/admin');
            }, 2000);

        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create admin user");
        } finally {
            setIsCreating(false);
        }
    };

    if (created) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin User Created!</h1>
                    <p className="text-gray-600 mb-4">
                        Admin user <strong>{formData.name}</strong> has been created successfully.
                        Redirecting to admin login...
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 text-left mb-4">
                        <div className="text-sm space-y-1">
                            <p><strong>Email:</strong> {formData.email}</p>
                            <p><strong>Role:</strong> {formData.role}</p>
                            <p><strong>Permissions:</strong> All Admin Permissions</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500">Redirecting to admin panel...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Create Admin User</h1>
                    <p className="text-gray-600 mt-2">Set up an admin user for your Prashayan store</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                        <Shield className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div className="text-sm text-blue-800">
                            <strong>Development Setup:</strong> This creates a mock admin user for testing purposes.
                            In production, admin users should be created through your backend system.
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
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Enter admin name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
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
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Enter password"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Admin Role
                        </label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="admin">Admin (Limited Access)</option>
                            <option value="super_admin">Super Admin (Full Access)</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            {formData.role === 'super_admin'
                                ? 'Full system access including user management and settings'
                                : 'Limited access to products, orders, reviews, and blogs only'
                            }
                        </p>
                    </div>

                    <button
                        onClick={createAdminUser}
                        disabled={isCreating}
                        className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                    >
                        {isCreating ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Creating Admin User...
                            </>
                        ) : (
                            <>
                                <UserPlus className="w-4 h-4" />
                                Create Admin User
                            </>
                        )}
                    </button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="text-center">
                        <p className="text-sm text-gray-500 mb-2">Already have admin access?</p>
                        <a
                            href="/admin/dev-login"
                            className="text-primary hover:underline text-sm font-medium"
                        >
                            Go to Admin Login
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}