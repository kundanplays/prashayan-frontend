import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/v1";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    how_to_use: string;
    ingredients: string;
    benefits: string;
    mrp: number;
    selling_price: number;
    stock_quantity: number;
    image_url: string;
    thumbnail_url: string;
    image_urls: string[];
    full_image_urls: string[];
}

export interface User {
    id: number;
    email: string;
    name: string;
    phone: string;
    is_active: boolean;
    role: string;
    permissions: string[];
    created_at: string;
    updated_at: string;
}

export interface Order {
    id: number;
    user_id: number;
    total_amount: number;
    status: string;
    payment_status: string;
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    shipping_address: string;
    created_at: string;
    updated_at: string;
    user?: User;
    items?: OrderItem[];
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: number;
    product?: Product;
}

export interface Review {
    id: number;
    user_id: number;
    product_id: number;
    rating: number;
    comment: string;
    is_verified: boolean;
    created_at: string;
    user?: User;
    product?: Product;
}

export interface Blog {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    author: string;
    image_url: string;
    tags: string[];
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

export interface Payment {
    id: number;
    order_id: number;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    amount: number;
    currency: string;
    status: string;
    created_at: string;
}

export const auth = {
    login: async (username: string, password: string) => {
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);
        return api.post("/auth/token", params, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
    },
    register: async (email: string, password: string, name: string = "", phone: string = "") => {
        return api.post("/auth/register", {
            email,
            password,
            name,
            phone
        });
    },
    otp: {
        generate: async (email: string) => {
            return api.post("/auth/otp/generate", { email });
        },
        verify: async (email: string, code: string) => {
            return api.post("/auth/otp/verify", { email, code });
        },
    },
    passwordReset: {
        request: async (email: string) => {
            return api.post("/auth/password-reset/request", { email });
        },
        confirm: async (token: string, newPassword: string) => {
            return api.post("/auth/password-reset/confirm", { token, new_password: newPassword });
        },
    }
};

export const users = {
    me: async () => {
        const token = localStorage.getItem("token");
        return api.get<User>("/users/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
}

export const orders = {
    list: async () => {
        const token = localStorage.getItem("token");
        return api.get("/orders/", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
}

export const products = {
    list: async () => api.get<Product[]>("/products/"),
    get: async (slug: string) => api.get<Product>(`/products/${slug}`),
};

// Admin API functions with RBAC
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        Authorization: `Bearer ${token}`
    };
};

const checkPermission = async (permission: string) => {
    try {
        const response = await api.get('/admin/permissions/check', {
            headers: getAuthHeaders(),
            params: { permission }
        });
        return response.data.hasPermission;
    } catch (error) {
        console.error('Permission check failed:', error);
        return false;
    }
};

export const admin = {
    // Users CRUD with RBAC
    users: {
        list: async (page = 1, limit = 10, filters?: { role?: string; status?: string }) => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...(filters?.role && { role: filters.role }),
                ...(filters?.status && { status: filters.status })
            });
            return api.get<{ users: User[]; total: number; page: number; pages: number }>(
                `/admin/users?${params}`,
                { headers: getAuthHeaders() }
            );
        },
        get: async (id: number) => {
            const hasPermission = await checkPermission('users:read');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.get<User>(`/admin/users/${id}`, { headers: getAuthHeaders() });
        },
        create: async (data: Partial<User>) => {
            const hasPermission = await checkPermission('users:create');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.post<User>('/admin/users', data, { headers: getAuthHeaders() });
        },
        update: async (id: number, data: Partial<User>) => {
            const hasPermission = await checkPermission('users:update');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.put<User>(`/admin/users/${id}`, data, { headers: getAuthHeaders() });
        },
        delete: async (id: number) => {
            const hasPermission = await checkPermission('users:delete');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.delete(`/admin/users/${id}`, { headers: getAuthHeaders() });
        },
        updateRole: async (id: number, role: string, permissions: string[]) => {
            const hasPermission = await checkPermission('users:update_role');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.put<User>(`/admin/users/${id}/role`, { role, permissions }, { headers: getAuthHeaders() });
        },
    },

    // Products CRUD with RBAC
    products: {
        list: async (page = 1, limit = 10, filters?: { category?: string; status?: string }) => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...(filters?.category && { category: filters.category }),
                ...(filters?.status && { status: filters.status })
            });
            const hasPermission = await checkPermission('products:read');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.get<{ products: Product[]; total: number; page: number; pages: number }>(
                `/admin/products?${params}`,
                { headers: getAuthHeaders() }
            );
        },
        get: async (id: number) => {
            const hasPermission = await checkPermission('products:read');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.get<Product>(`/admin/products/${id}`, { headers: getAuthHeaders() });
        },
        create: async (data: FormData) => {
            const hasPermission = await checkPermission('products:create');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.post<Product>("/admin/products", data, {
                headers: {
                    ...getAuthHeaders(),
                    "Content-Type": "multipart/form-data",
                },
            });
        },
        update: async (id: number, data: FormData | Partial<Product>) => {
            const hasPermission = await checkPermission('products:update');
            if (!hasPermission) throw new Error('Insufficient permissions');
            const isFormData = data instanceof FormData;
            return api.put<Product>(`/admin/products/${id}`, data, {
                headers: {
                    ...getAuthHeaders(),
                    ...(isFormData ? { "Content-Type": "multipart/form-data" } : {}),
                },
            });
        },
        delete: async (id: number) => {
            const hasPermission = await checkPermission('products:delete');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.delete(`/admin/products/${id}`, { headers: getAuthHeaders() });
        },
        updateStock: async (id: number, stockQuantity: number) => {
            const hasPermission = await checkPermission('products:update');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.put<Product>(`/admin/products/${id}/stock`, { stock_quantity: stockQuantity }, { headers: getAuthHeaders() });
        },
    },

    // Orders CRUD with RBAC
    orders: {
        list: async (page = 1, limit = 10, filters?: { status?: string; payment_status?: string; date_from?: string; date_to?: string }) => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...(filters?.status && { status: filters.status }),
                ...(filters?.payment_status && { payment_status: filters.payment_status }),
                ...(filters?.date_from && { date_from: filters.date_from }),
                ...(filters?.date_to && { date_to: filters.date_to })
            });
            const hasPermission = await checkPermission('orders:read');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.get<{ orders: Order[]; total: number; page: number; pages: number }>(
                `/admin/orders?${params}`,
                { headers: getAuthHeaders() }
            );
        },
        get: async (id: number) => {
            const hasPermission = await checkPermission('orders:read');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.get<Order>(`/admin/orders/${id}`, { headers: getAuthHeaders() });
        },
        update: async (id: number, data: Partial<Order>) => {
            const hasPermission = await checkPermission('orders:update');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.put<Order>(`/admin/orders/${id}`, data, { headers: getAuthHeaders() });
        },
        updateStatus: async (id: number, status: string) => {
            const hasPermission = await checkPermission('orders:update');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.put<Order>(`/admin/orders/${id}/status`, { status }, { headers: getAuthHeaders() });
        },
        verifyPayment: async (orderId: string, razorpayPaymentId: string) => {
            const hasPermission = await checkPermission('payments:update');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.post(`/admin/orders/${orderId}/verify-payment`, {
                razorpay_payment_id: razorpayPaymentId
            }, { headers: getAuthHeaders() });
        },
        cancel: async (id: number, reason: string) => {
            const hasPermission = await checkPermission('orders:update');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.put<Order>(`/admin/orders/${id}/cancel`, { reason }, { headers: getAuthHeaders() });
        },
    },

    // Reviews CRUD with RBAC
    reviews: {
        list: async (page = 1, limit = 10, filters?: { status?: string; rating?: number; product_id?: number }) => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...(filters?.status && { status: filters.status }),
                ...(filters?.rating && { rating: filters.rating.toString() }),
                ...(filters?.product_id && { product_id: filters.product_id.toString() })
            });
            const hasPermission = await checkPermission('reviews:read');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.get<{ reviews: Review[]; total: number; page: number; pages: number }>(
                `/admin/reviews?${params}`,
                { headers: getAuthHeaders() }
            );
        },
        get: async (id: number) => {
            const hasPermission = await checkPermission('reviews:read');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.get<Review>(`/admin/reviews/${id}`, { headers: getAuthHeaders() });
        },
        update: async (id: number, data: Partial<Review>) => {
            const hasPermission = await checkPermission('reviews:update');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.put<Review>(`/admin/reviews/${id}`, data, { headers: getAuthHeaders() });
        },
        delete: async (id: number) => {
            const hasPermission = await checkPermission('reviews:delete');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.delete(`/admin/reviews/${id}`, { headers: getAuthHeaders() });
        },
        approve: async (id: number) => {
            const hasPermission = await checkPermission('reviews:update');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.put<Review>(`/admin/reviews/${id}/approve`, {}, { headers: getAuthHeaders() });
        },
        reject: async (id: number, reason: string) => {
            const hasPermission = await checkPermission('reviews:update');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.put<Review>(`/admin/reviews/${id}/reject`, { reason }, { headers: getAuthHeaders() });
        },
    },

    // Blogs CRUD with RBAC
    blogs: {
        list: async (page = 1, limit = 10, filters?: { status?: string; author?: string; tag?: string }) => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...(filters?.status && { status: filters.status }),
                ...(filters?.author && { author: filters.author }),
                ...(filters?.tag && { tag: filters.tag })
            });
            const hasPermission = await checkPermission('blogs:read');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.get<{ blogs: Blog[]; total: number; page: number; pages: number }>(
                `/admin/blogs?${params}`,
                { headers: getAuthHeaders() }
            );
        },
        get: async (id: number) => {
            const hasPermission = await checkPermission('blogs:read');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.get<Blog>(`/admin/blogs/${id}`, { headers: getAuthHeaders() });
        },
        create: async (data: FormData) => {
            const hasPermission = await checkPermission('blogs:create');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.post<Blog>("/admin/blogs", data, {
                headers: {
                    ...getAuthHeaders(),
                    "Content-Type": "multipart/form-data",
                },
            });
        },
        update: async (id: number, data: FormData | Partial<Blog>) => {
            const hasPermission = await checkPermission('blogs:update');
            if (!hasPermission) throw new Error('Insufficient permissions');
            const isFormData = data instanceof FormData;
            return api.put<Blog>(`/admin/blogs/${id}`, data, {
                headers: {
                    ...getAuthHeaders(),
                    ...(isFormData ? { "Content-Type": "multipart/form-data" } : {}),
                },
            });
        },
        delete: async (id: number) => {
            const hasPermission = await checkPermission('blogs:delete');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.delete(`/admin/blogs/${id}`, { headers: getAuthHeaders() });
        },
        publish: async (id: number) => {
            const hasPermission = await checkPermission('blogs:update');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.put<Blog>(`/admin/blogs/${id}/publish`, {}, { headers: getAuthHeaders() });
        },
        unpublish: async (id: number) => {
            const hasPermission = await checkPermission('blogs:update');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.put<Blog>(`/admin/blogs/${id}/unpublish`, {}, { headers: getAuthHeaders() });
        },
        updateTags: async (id: number, tags: string[]) => {
            const hasPermission = await checkPermission('blogs:update');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.put<Blog>(`/admin/blogs/${id}/tags`, { tags }, { headers: getAuthHeaders() });
        },
    },

    // Payments with RBAC
    payments: {
        list: async (page = 1, limit = 10, filters?: { status?: string; date_from?: string; date_to?: string }) => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...(filters?.status && { status: filters.status }),
                ...(filters?.date_from && { date_from: filters.date_from }),
                ...(filters?.date_to && { date_to: filters.date_to })
            });
            const hasPermission = await checkPermission('payments:read');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.get<{ payments: Payment[]; total: number; page: number; pages: number }>(
                `/admin/payments?${params}`,
                { headers: getAuthHeaders() }
            );
        },
        get: async (id: number) => {
            const hasPermission = await checkPermission('payments:read');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.get<Payment>(`/admin/payments/${id}`, { headers: getAuthHeaders() });
        },
        verify: async (orderId: string, razorpayPaymentId: string) => {
            const hasPermission = await checkPermission('payments:update');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.post(`/admin/payments/verify`, {
                order_id: orderId,
                razorpay_payment_id: razorpayPaymentId
            }, { headers: getAuthHeaders() });
        },
        refund: async (paymentId: number, amount: number, reason: string) => {
            const hasPermission = await checkPermission('payments:refund');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.post(`/admin/payments/${paymentId}/refund`, { amount, reason }, { headers: getAuthHeaders() });
        },
    },

    // Dashboard stats with RBAC
    dashboard: {
        stats: async () => {
            const hasPermission = await checkPermission('dashboard:read');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.get<{
                totalUsers: number;
                totalProducts: number;
                totalOrders: number;
                totalReviews: number;
                totalBlogs: number;
                pendingPayments: number;
                monthlyRevenue: number;
                monthlyGrowth: number;
                recentOrders: Order[];
                recentReviews: Review[];
                topProducts: Array<{ name: string; sales: number; revenue: number }>;
            }>("/admin/dashboard/stats", { headers: getAuthHeaders() });
        },
    },

    // Analytics with RBAC
    analytics: {
        overview: async (dateRange?: { from: string; to: string }) => {
            const hasPermission = await checkPermission('analytics:read');
            if (!hasPermission) throw new Error('Insufficient permissions');
            const params = dateRange ? {
                date_from: dateRange.from,
                date_to: dateRange.to
            } : {};
            return api.get("/admin/analytics/overview", {
                headers: getAuthHeaders(),
                params
            });
        },
        revenue: async (period: 'daily' | 'weekly' | 'monthly' = 'monthly') => {
            const hasPermission = await checkPermission('analytics:read');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.get(`/admin/analytics/revenue/${period}`, { headers: getAuthHeaders() });
        },
        users: async (period: 'daily' | 'weekly' | 'monthly' = 'monthly') => {
            const hasPermission = await checkPermission('analytics:read');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.get(`/admin/analytics/users/${period}`, { headers: getAuthHeaders() });
        },
        products: async () => {
            const hasPermission = await checkPermission('analytics:read');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.get("/admin/analytics/products", { headers: getAuthHeaders() });
        },
    },

    // Settings with RBAC
    settings: {
        get: async () => {
            const hasPermission = await checkPermission('settings:read');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.get("/admin/settings", { headers: getAuthHeaders() });
        },
        update: async (settings: Record<string, any>) => {
            const hasPermission = await checkPermission('settings:update');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.put("/admin/settings", settings, { headers: getAuthHeaders() });
        },
        reset: async () => {
            const hasPermission = await checkPermission('settings:update');
            if (!hasPermission) throw new Error('Insufficient permissions');
            return api.post("/admin/settings/reset", {}, { headers: getAuthHeaders() });
        },
    },
};

export default api;
