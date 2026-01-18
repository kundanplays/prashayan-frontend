"use client";

import { useState, useEffect } from "react";
import { Package, Search, Plus, Edit, Trash2, Eye, Upload, X } from "lucide-react";
import { admin, Product } from "@/lib/api";

export default function ProductsManagement() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, [currentPage, searchTerm]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await admin.products.list(currentPage, 10);
            setProducts(response.data.products);
            setTotalPages(response.data.pages);
        } catch (error) {
            console.error("Error fetching products:", error);
            alert(error instanceof Error ? error.message : "Failed to load products. Please check your permissions.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (productId: number) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            await admin.products.delete(productId);
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
            alert(error instanceof Error ? error.message : "Failed to delete product. Check your permissions.");
        }
    };

    const filteredProducts = products.filter(product =>
        (product.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
                    <p className="text-gray-600 mt-1">Manage all products and inventory</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Product
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products by name or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        No products found
                    </div>
                ) : (
                    filteredProducts.map((product) => (
                        <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                            {/* Product Image */}
                            <div className="aspect-square bg-gray-100 relative">
                                {product.image_url ? (
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package className="w-12 h-12 text-gray-400" />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex space-x-1">
                                    <button
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            setShowViewModal(true);
                                        }}
                                        className="p-1 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-colors"
                                        title="View Details"
                                    >
                                        <Eye className="w-4 h-4 text-gray-600" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            setShowEditModal(true);
                                        }}
                                        className="p-1 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-colors"
                                        title="Edit Product"
                                    >
                                        <Edit className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
                                    {product.name}
                                </h3>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                    {product.description}
                                </p>

                                {/* Pricing */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-lg font-bold text-primary">
                                            ₹{product.selling_price}
                                        </span>
                                        {product.mrp > product.selling_price && (
                                            <span className="text-sm text-gray-500 line-through">
                                                ₹{product.mrp}
                                            </span>
                                        )}
                                    </div>
                                    {product.mrp > product.selling_price && (
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                            {Math.round(((product.mrp - product.selling_price) / product.mrp) * 100)}% off
                                        </span>
                                    )}
                                </div>

                                {/* Stock Status */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm text-gray-600">
                                        Stock: {product.stock_quantity}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                        product.stock_quantity > 10
                                            ? "bg-green-100 text-green-800"
                                            : product.stock_quantity > 0
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-red-100 text-red-800"
                                    }`}>
                                        {product.stock_quantity > 10
                                            ? "In Stock"
                                            : product.stock_quantity > 0
                                            ? "Low Stock"
                                            : "Out of Stock"}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            setShowEditModal(true);
                                        }}
                                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProduct(product.id)}
                                        className="bg-red-100 text-red-700 py-2 px-3 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Create/Edit Product Modal */}
            {(showCreateModal || showEditModal) && (
                <ProductModal
                    product={showEditModal ? selectedProduct : null}
                    onClose={() => {
                        setShowCreateModal(false);
                        setShowEditModal(false);
                        setSelectedProduct(null);
                    }}
                    onSave={() => {
                        fetchProducts();
                        setShowCreateModal(false);
                        setShowEditModal(false);
                        setSelectedProduct(null);
                    }}
                />
            )}

            {/* View Product Modal */}
            {showViewModal && selectedProduct && (
                <ViewProductModal
                    product={selectedProduct}
                    onClose={() => {
                        setShowViewModal(false);
                        setSelectedProduct(null);
                    }}
                />
            )}
        </div>
    );
}

// Product Modal Component
function ProductModal({ product, onClose, onSave }: { product?: Product | null; onClose: () => void; onSave: () => void }) {
    const [formData, setFormData] = useState({
        name: product?.name || "",
        description: product?.description || "",
        introductory_description: product?.introductory_description || "",
        how_to_use: product?.how_to_use || "",
        ingredients: product?.ingredients || "",
        benefits: product?.benefits || "",
        mrp: product?.mrp || 0,
        selling_price: product?.selling_price || 0,
        stock_quantity: product?.stock_quantity || 0,
    });
    const [images, setImages] = useState<File[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>(product?.full_image_urls || []);
    const [saving, setSaving] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setImages(prev => [...prev, ...files]);
        files.forEach(file => {
            const url = URL.createObjectURL(file);
            setImageUrls(prev => [...prev, url]);
        });
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImageUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const submitData = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                submitData.append(key, value.toString());
            });

            // Send new uploaded images
            images.forEach((image, index) => {
                submitData.append(`images`, image);
            });

            // For updates, send existing image URLs as JSON string
            if (product) {
                // Filter out blob URLs (newly uploaded images) and keep only existing URLs
                const existingUrls = imageUrls.filter(url => !url.startsWith('blob:'));
                submitData.append('image_urls', JSON.stringify(existingUrls));
            }

            if (product) {
                await admin.products.update(product.id, submitData);
            } else {
                await admin.products.create(submitData);
            }

            onSave();
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Failed to save product");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {product ? "Edit Product" : "Add New Product"}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.stock_quantity}
                                onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: Number(e.target.value) }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">MRP (₹) *</label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={formData.mrp}
                                onChange={(e) => setFormData(prev => ({ ...prev, mrp: Number(e.target.value) }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price (₹) *</label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={formData.selling_price}
                                onChange={(e) => setFormData(prev => ({ ...prev, selling_price: Number(e.target.value) }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                        <textarea
                            required
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    {/* Introductory Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Introductory Description</label>
                        <textarea
                            rows={3}
                            placeholder="Appears before benefits in italic styling (e.g., 'Experience the holistic power of Ayurveda. Regular usage supports physical vitality, mental clarity, and emotional well-being.')"
                            value={formData.introductory_description}
                            onChange={(e) => setFormData(prev => ({ ...prev, introductory_description: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">Optional introductory text that appears before the benefits list</p>
                    </div>

                    {/* Additional Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">How to Use</label>
                            <textarea
                                rows={3}
                                placeholder="Separate each instruction with commas (e.g., 'Take 1-2 capsules daily with water, Consume preferably before bedtime, Follow for 8-12 weeks for best results')"
                                value={formData.how_to_use}
                                onChange={(e) => setFormData(prev => ({ ...prev, how_to_use: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">Separate multiple instructions with commas. Each instruction will be displayed as a bullet point.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients</label>
                            <textarea
                                rows={3}
                                placeholder="Separate each ingredient with commas (e.g., 'Organic Ashwagandha Root Extract, Withania somnifera, Natural Herbs')"
                                value={formData.ingredients}
                                onChange={(e) => setFormData(prev => ({ ...prev, ingredients: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">Separate multiple ingredients with commas. Each ingredient will be displayed as a bullet point.</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
                        <textarea
                            rows={3}
                            placeholder="Separate each benefit with commas (e.g., 'Reduces stress and anxiety, improves sleep quality, increases muscle strength, balances hormones')"
                            value={formData.benefits}
                            onChange={(e) => setFormData(prev => ({ ...prev, benefits: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">Separate multiple benefits with commas. Each benefit will be displayed as a bullet point.</p>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                            <div className="text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="mt-4">
                                    <label htmlFor="image-upload" className="cursor-pointer">
                                        <span className="mt-2 block text-sm font-medium text-primary hover:text-primary-dark">
                                            Upload images
                                        </span>
                                    </label>
                                    <input
                                        id="image-upload"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB each</p>
                            </div>
                        </div>

                        {/* Image Preview */}
                        {imageUrls.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                {imageUrls.map((url, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={url}
                                            alt={`Product ${index + 1}`}
                                            className="w-full h-24 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-6 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? "Saving..." : (product ? "Update Product" : "Create Product")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// View Product Modal Component
function ViewProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Images */}
                    <div>
                        <h4 className="font-medium text-gray-900 mb-3">Images</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {product.full_image_urls?.map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt={`${product.name} ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg"
                                />
                            )) || (
                                <div className="col-span-2 flex items-center justify-center h-24 bg-gray-100 rounded-lg">
                                    <Package className="w-8 h-8 text-gray-400" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-gray-900">Basic Information</h4>
                            <div className="mt-2 space-y-2">
                                <p><span className="font-medium">Name:</span> {product.name}</p>
                                <p><span className="font-medium">Stock:</span> {product.stock_quantity}</p>
                                <p><span className="font-medium">MRP:</span> ₹{product.mrp}</p>
                                <p><span className="font-medium">Selling Price:</span> ₹{product.selling_price}</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium text-gray-900">Description</h4>
                            <p className="mt-2 text-gray-600">{product.description}</p>
                        </div>

                        {product.how_to_use && (
                            <div>
                                <h4 className="font-medium text-gray-900">How to Use</h4>
                                <p className="mt-2 text-gray-600">{product.how_to_use}</p>
                            </div>
                        )}

                        {product.ingredients && (
                            <div>
                                <h4 className="font-medium text-gray-900">Ingredients</h4>
                                <p className="mt-2 text-gray-600">{product.ingredients}</p>
                            </div>
                        )}

                        {product.benefits && (
                            <div>
                                <h4 className="font-medium text-gray-900">Benefits</h4>
                                <p className="mt-2 text-gray-600">{product.benefits}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}