"use client";

import { useState, useEffect } from "react";
import { Settings, Save, Key, Globe, Bell, Shield, Database } from "lucide-react";
import { admin } from "@/lib/api";

export default function AdminSettings() {
    const [settings, setSettings] = useState({
        siteName: "",
        siteDescription: "",
        contactEmail: "",
        contactPhone: "",
        currency: "INR",
        timezone: "Asia/Kolkata",
        maintenanceMode: false,
        emailNotifications: true,
        smsNotifications: false,
        razorpayKeyId: "",
        razorpayKeySecret: "",
        smtpHost: "",
        smtpPort: "587",
        smtpUser: "",
        smtpPassword: ""
    });

    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await admin.settings.get();
                setSettings(response.data);
            } catch (error) {
                console.error("Error fetching settings:", error);
                alert(error instanceof Error ? error.message : "Failed to load settings. Please check your permissions.");
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await admin.settings.update(settings);
            alert("Settings saved successfully!");
        } catch (error) {
            console.error("Error saving settings:", error);
            alert(error instanceof Error ? error.message : "Failed to save settings. Check your permissions.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const sections = [
        {
            id: "general",
            title: "General Settings",
            icon: Settings,
            fields: [
                { name: "siteName", label: "Site Name", type: "text", value: settings.siteName },
                { name: "siteDescription", label: "Site Description", type: "text", value: settings.siteDescription },
                { name: "contactEmail", label: "Contact Email", type: "email", value: settings.contactEmail },
                { name: "contactPhone", label: "Contact Phone", type: "tel", value: settings.contactPhone },
                { name: "currency", label: "Currency", type: "select", value: settings.currency, options: ["INR", "USD", "EUR"] },
                { name: "timezone", label: "Timezone", type: "select", value: settings.timezone, options: ["Asia/Kolkata", "UTC", "America/New_York"] },
                { name: "maintenanceMode", label: "Maintenance Mode", type: "checkbox", value: settings.maintenanceMode }
            ]
        },
        {
            id: "payment",
            title: "Payment Settings",
            icon: Key,
            fields: [
                { name: "razorpayKeyId", label: "Razorpay Key ID", type: "password", value: settings.razorpayKeyId },
                { name: "razorpayKeySecret", label: "Razorpay Key Secret", type: "password", value: settings.razorpayKeySecret }
            ]
        },
        {
            id: "notifications",
            title: "Notifications",
            icon: Bell,
            fields: [
                { name: "emailNotifications", label: "Email Notifications", type: "checkbox", value: settings.emailNotifications },
                { name: "smsNotifications", label: "SMS Notifications", type: "checkbox", value: settings.smsNotifications }
            ]
        },
        {
            id: "email",
            title: "Email Configuration",
            icon: Globe,
            fields: [
                { name: "smtpHost", label: "SMTP Host", type: "text", value: settings.smtpHost },
                { name: "smtpPort", label: "SMTP Port", type: "text", value: settings.smtpPort },
                { name: "smtpUser", label: "SMTP Username", type: "text", value: settings.smtpUser },
                { name: "smtpPassword", label: "SMTP Password", type: "password", value: settings.smtpPassword }
            ]
        }
    ];

    const handleInputChange = (name: string, value: any) => {
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-1">Configure your store settings and preferences</p>
            </div>

            {/* Settings Sections */}
            <div className="space-y-8">
                {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                        <div key={section.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center space-x-3">
                                    <Icon className="w-6 h-6 text-primary" />
                                    <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {section.fields.map((field) => (
                                        <div key={field.name} className={field.type === "checkbox" ? "md:col-span-2" : ""}>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {field.label}
                                            </label>

                                            {field.type === "text" && (
                                                <input
                                                    type="text"
                                                    value={String(field.value)}
                                                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                                                />
                                            )}

                                            {field.type === "email" && (
                                                <input
                                                    type="email"
                                                    value={String(field.value)}
                                                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                                                />
                                            )}

                                            {field.type === "tel" && (
                                                <input
                                                    type="tel"
                                                    value={String(field.value)}
                                                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                                                />
                                            )}

                                            {field.type === "password" && (
                                                <input
                                                    type="password"
                                                    value={String(field.value)}
                                                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                                                />
                                            )}

                                            {field.type === "select" && (
                                                <select
                                                    value={String(field.value)}
                                                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                                                >
                                                    {field.options?.map((option) => (
                                                        <option key={option} value={option}>{option}</option>
                                                    ))}
                                                </select>
                                            )}

                                            {field.type === "checkbox" && (
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={Boolean(field.value)}
                                                        onChange={(e) => handleInputChange(field.name, e.target.checked)}
                                                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                                    />
                                                    <label className="ml-2 block text-sm text-gray-900">
                                                        Enable {field.label.toLowerCase()}
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <Save className="w-4 h-4" />
                    {saving ? "Saving..." : "Save Settings"}
                </button>
            </div>

            {/* System Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <Database className="w-6 h-6 text-primary" />
                        <h2 className="text-lg font-semibold text-gray-900">System Information</h2>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Version</label>
                            <p className="text-sm text-gray-900">Prashayan Admin v1.0.0</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                            <p className="text-sm text-gray-900">{new Date().toLocaleDateString()}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Environment</label>
                            <p className="text-sm text-gray-900">Production</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Database Status</label>
                            <p className="text-sm text-green-600">Connected</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                    <Shield className="w-6 h-6 text-red-600" />
                    <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white border border-red-200 rounded-lg">
                        <div>
                            <h3 className="font-medium text-gray-900">Clear All Data</h3>
                            <p className="text-sm text-gray-600">Permanently delete all data from the database</p>
                        </div>
                        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                            Clear Data
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white border border-red-200 rounded-lg">
                        <div>
                            <h3 className="font-medium text-gray-900">Reset Settings</h3>
                            <p className="text-sm text-gray-600">Reset all settings to default values</p>
                        </div>
                        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                            Reset Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}