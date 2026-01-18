"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    Users,
    Package,
    ShoppingCart,
    MessageSquare,
    FileText,
    CreditCard,
    LogOut,
    Menu,
    X,
    Settings,
    BarChart3,
    Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { admin } from "@/lib/api";

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

const adminNavItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, permission: "dashboard:read" },
    { name: "Users", href: "/admin/users", icon: Users, permission: "users:read" },
    { name: "Products", href: "/admin/products", icon: Package, permission: "products:read" },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart, permission: "orders:read" },
    { name: "Reviews", href: "/admin/reviews", icon: MessageSquare, permission: "reviews:read" },
    { name: "Blogs", href: "/admin/blogs", icon: FileText, permission: "blogs:read" },
    { name: "Payments", href: "/admin/payments", icon: CreditCard, permission: "payments:read" },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3, permission: "analytics:read" },
    { name: "Settings", href: "/admin/settings", icon: Settings, permission: "settings:read" },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<AdminUser | null>(null);
    const [permissions, setPermissions] = useState<string[]>([]);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        checkAdminAccess();
    }, []);

    const checkAdminAccess = async () => {
        try {
            // Check for admin authentication first
            const adminToken = localStorage.getItem('admin_token');
            const adminUserData = localStorage.getItem('admin_user');

            if (adminToken && adminUserData) {
                // Admin is logged in - validate user data
                const adminUser: AdminUser = JSON.parse(adminUserData);

                // Validate required fields and role
                if (!adminUser.role || !['admin', 'super_admin'].includes(adminUser.role)) {
                    console.error('Invalid admin role:', adminUser.role);
                    // Clear invalid data
                    localStorage.removeItem('admin_token');
                    localStorage.removeItem('admin_user');
                    router.push('/admin/login');
                    return;
                }

                // Check if user has valid permissions
                if (!adminUser.permissions || adminUser.permissions.length === 0) {
                    console.error('No permissions found for admin user');
                    localStorage.removeItem('admin_token');
                    localStorage.removeItem('admin_user');
                    router.push('/admin/login');
                    return;
                }

                // Update last login
                adminUser.last_login = new Date().toISOString();
                localStorage.setItem('admin_user', JSON.stringify(adminUser));

                setUser(adminUser);
                setPermissions(adminUser.permissions);
                return;
            }

            // No admin authentication found - redirect to admin entry (which shows login)
            if (typeof window !== 'undefined' && window.location.pathname !== '/admin') {
                router.push('/admin');
            }
            return;

        } catch (error) {
            console.error("Error checking admin access:", error);
            // Clear corrupted data and redirect to login
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            router.push('/admin/login');
        } finally {
            setIsLoading(false);
        }
    };

    const hasPermission = (permission: string) => {
        // Super admin has all permissions
        if (user?.role === 'super_admin') return true;

        // Regular admin - check specific permissions
        if (user?.role === 'admin') {
            // Check for wildcard permissions (e.g., 'users:*' covers all user permissions)
            const [resource, action] = permission.split(':');
            const wildcardPermission = `${resource}:*`;

            return permissions.includes(permission) ||
                   permissions.includes(wildcardPermission) ||
                   permissions.includes('admin:*');
        }

        // No valid role found
        return false;
    };

    // Debug function to verify admin metadata
    const verifyAdminMetadata = () => {
        if (!user) return null;

        return {
            role: user.role,
            access_level: user.metadata.access_level,
            permissions: user.permissions,
            can_manage_users: user.metadata.can_manage_users,
            can_manage_settings: user.metadata.can_manage_settings,
            can_view_analytics: user.metadata.can_view_analytics,
            available_nav_items: filteredNavItems.length,
            total_permissions: permissions.length
        };
    };

    // Log verification on mount
    useEffect(() => {
        if (user) {
            console.log('Admin Metadata Verification:', verifyAdminMetadata());
        }
    }, [user]);

    const filteredNavItems = adminNavItems.filter(item => {
        // Special checks based on metadata
        if (item.permission === 'users:read' && user?.metadata?.can_manage_users === false) {
            return false;
        }
        if (item.permission === 'settings:read' && user?.metadata?.can_manage_settings === false) {
            return false;
        }
        if (item.permission === 'analytics:read' && user?.metadata?.can_view_analytics === false) {
            return false;
        }

        return hasPermission(item.permission);
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-sm text-gray-600">Loading admin panel...</p>
            </div>
        );
    }

    // Don't show auth error for the main /admin route (which has its own login form)
    if (!user && pathname !== '/admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Admin Access Required</h2>
                    <p className="text-gray-600 mb-4">You need admin privileges to access this panel.</p>
                    {process.env.NODE_ENV === 'development' && (
                        <div className="space-y-2">
                            <a
                                href="/admin"
                                className="inline-block bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                            >
                                Go to Admin Login
                            </a>
                            <p className="text-xs text-gray-500">Development mode only</p>
                        </div>
                    )}
                    <a
                        href="/auth/signin"
                        className="inline-block mt-4 text-primary hover:underline"
                    >
                        Go to User Sign In
                    </a>
                </div>
            </div>
        );
    }

    // For the main /admin route (login page), don't render the layout - just the page content
    if (pathname === '/admin' && !user) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-primary">Prashayan</h1>
                                <p className="text-xs text-gray-500">Admin Panel</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 py-4 space-y-1">
                        {filteredNavItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors group",
                                        isActive
                                            ? "bg-primary text-white"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                    )}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <Icon className={cn(
                                        "w-5 h-5 mr-3",
                                        isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"
                                    )} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Info & Logout */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {user?.name || 'User'}
                                </p>
                                <div className="flex items-center space-x-2">
                                    <p className="text-xs text-gray-500 capitalize">
                                        {user?.role?.replace('_', ' ') || 'User'}
                                    </p>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                        user?.role === 'super_admin'
                                            ? 'bg-purple-100 text-purple-800'
                                            : 'bg-blue-100 text-blue-800'
                                    }`}>
                                        {user?.metadata?.access_level || 'Standard'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                // Clear admin-specific data only
                                localStorage.removeItem('admin_token');
                                localStorage.removeItem('admin_user');
                                localStorage.removeItem('admin_logged_in');
                                localStorage.removeItem('admin_bypass');
                                localStorage.removeItem('dev_admin_user');
                                router.push('/admin');
                            }}
                            className="flex items-center w-full px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="flex items-center justify-between px-6 py-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <div className="flex items-center space-x-4">
                            <div className="hidden lg:block">
                                <h1 className="text-xl font-semibold text-gray-900">
                                    {adminNavItems.find(item => item.href === pathname)?.name || "Admin Panel"}
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="hidden md:block text-right">
                                <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                                <p className="text-xs text-gray-500 capitalize">
                                    {user?.role?.replace('_', ' ') || 'User'} (Level {user?.metadata?.access_level || '1'})
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}