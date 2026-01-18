"use client";

import { useState, useEffect } from "react";
import { FileText, Search, Plus, Edit, Trash2, Eye, Upload, X, EyeOff, Eye as EyeIcon } from "lucide-react";
import { admin, Blog } from "@/lib/api";

export default function BlogsManagement() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        fetchBlogs();
    }, [currentPage, searchTerm]);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await admin.blogs.list(currentPage, 10);
            setBlogs(response.data.blogs);
            setTotalPages(response.data.pages);
        } catch (error) {
            console.error("Error fetching blogs:", error);
            alert(error instanceof Error ? error.message : "Failed to load blogs. Please check your permissions.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBlog = async (blogId: number) => {
        if (!confirm("Are you sure you want to delete this blog post?")) return;

        try {
            await admin.blogs.delete(blogId);
            fetchBlogs();
        } catch (error) {
            console.error("Error deleting blog:", error);
            alert(error instanceof Error ? error.message : "Failed to delete blog post. Check your permissions.");
        }
    };

    const handleTogglePublish = async (blogId: number, currentlyPublished: boolean) => {
        try {
            if (currentlyPublished) {
                await admin.blogs.unpublish(blogId);
            } else {
                await admin.blogs.publish(blogId);
            }
            fetchBlogs();
        } catch (error) {
            console.error("Error toggling blog publish status:", error);
            alert(error instanceof Error ? error.message : "Failed to update blog status. Check your permissions.");
        }
    };

    const filteredBlogs = blogs.filter(blog =>
        (blog.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (blog.content || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (blog.author || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Blogs Management</h1>
                    <p className="text-gray-600 mt-1">Create and manage blog posts</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Blog Post
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search blogs by title, content, or author..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>
            </div>

            {/* Blogs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : filteredBlogs.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        No blog posts found
                    </div>
                ) : (
                    filteredBlogs.map((blog) => (
                        <div key={blog.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                            {/* Blog Image */}
                            <div className="aspect-video bg-gray-100 relative">
                                {blog.image_url ? (
                                    <img
                                        src={blog.image_url}
                                        alt={blog.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <FileText className="w-12 h-12 text-gray-400" />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex space-x-1">
                                    <button
                                        onClick={() => {
                                            setSelectedBlog(blog);
                                            setShowViewModal(true);
                                        }}
                                        className="p-1 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-colors"
                                        title="View Details"
                                    >
                                        <Eye className="w-4 h-4 text-gray-600" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedBlog(blog);
                                            setShowEditModal(true);
                                        }}
                                        className="p-1 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-colors"
                                        title="Edit Blog"
                                    >
                                        <Edit className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>
                                {/* Status Badge */}
                                <div className="absolute top-2 left-2">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        blog.is_published
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800"
                                    }`}>
                                        {blog.is_published ? "Published" : "Draft"}
                                    </span>
                                </div>
                            </div>

                            {/* Blog Info */}
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
                                    {blog.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                    {blog.excerpt}
                                </p>

                                {/* Author & Date */}
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                    <span>By {blog.author}</span>
                                    <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                                </div>

                                {/* Tags */}
                                {blog.tags && blog.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {blog.tags.slice(0, 3).map((tag, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                        {blog.tags.length > 3 && (
                                            <span className="text-xs text-gray-500">+{blog.tags.length - 3} more</span>
                                        )}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => {
                                            setSelectedBlog(blog);
                                            setShowEditModal(true);
                                        }}
                                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleTogglePublish(blog.id, blog.is_published)}
                                        className={`flex-1 py-2 px-3 rounded-lg transition-colors text-sm font-medium ${
                                            blog.is_published
                                                ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                                                : "bg-green-100 text-green-700 hover:bg-green-200"
                                        }`}
                                    >
                                        {blog.is_published ? "Unpublish" : "Publish"}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteBlog(blog.id)}
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

            {/* Create/Edit Blog Modal */}
            {(showCreateModal || showEditModal) && (
                <BlogModal
                    blog={showEditModal ? selectedBlog : null}
                    onClose={() => {
                        setShowCreateModal(false);
                        setShowEditModal(false);
                        setSelectedBlog(null);
                    }}
                    onSave={() => {
                        fetchBlogs();
                        setShowCreateModal(false);
                        setShowEditModal(false);
                        setSelectedBlog(null);
                    }}
                />
            )}

            {/* View Blog Modal */}
            {showViewModal && selectedBlog && (
                <ViewBlogModal
                    blog={selectedBlog}
                    onClose={() => {
                        setShowViewModal(false);
                        setSelectedBlog(null);
                    }}
                />
            )}
        </div>
    );
}

// Blog Modal Component
function BlogModal({ blog, onClose, onSave }: { blog?: Blog | null; onClose: () => void; onSave: () => void }) {
    const [formData, setFormData] = useState({
        title: blog?.title || "",
        content: blog?.content || "",
        excerpt: blog?.excerpt || "",
        author: blog?.author || "",
        tags: blog?.tags?.join(", ") || "",
        is_published: blog?.is_published || false,
    });
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>(blog?.image_url || "");
    const [saving, setSaving] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const url = URL.createObjectURL(file);
            setImagePreview(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const submitData = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key === "tags" && typeof value === "string") {
                    submitData.append(key, value.split(",").map(tag => tag.trim()).join(","));
                } else {
                    submitData.append(key, value.toString());
                }
            });
            if (image) {
                submitData.append("image", image);
            }

            if (blog) {
                await admin.blogs.update(blog.id, submitData);
            } else {
                await admin.blogs.create(submitData);
            }

            onSave();
        } catch (error) {
            console.error("Error saving blog:", error);
            alert("Failed to save blog post");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {blog ? "Edit Blog Post" : "Create New Blog Post"}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Author *</label>
                            <input
                                type="text"
                                required
                                value={formData.author}
                                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt *</label>
                        <textarea
                            required
                            rows={3}
                            value={formData.excerpt}
                            onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Brief summary of the blog post..."
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                        <textarea
                            required
                            rows={10}
                            value={formData.content}
                            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Full blog post content..."
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Enter tags separated by commas..."
                        />
                    </div>

                    {/* Publish Status */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={formData.is_published}
                            onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                            Publish immediately
                        </label>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                            <div className="text-center">
                                {imagePreview ? (
                                    <div className="mb-4">
                                        <img
                                            src={imagePreview}
                                            alt="Blog preview"
                                            className="max-w-full h-48 object-cover rounded-lg mx-auto"
                                        />
                                    </div>
                                ) : (
                                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                )}
                                <div className="flex justify-center">
                                    <label htmlFor="blog-image-upload" className="cursor-pointer">
                                        <span className="mt-2 block text-sm font-medium text-primary hover:text-primary-dark">
                                            {imagePreview ? "Change image" : "Upload image"}
                                        </span>
                                    </label>
                                    <input
                                        id="blog-image-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
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
                            {saving ? "Saving..." : (blog ? "Update Blog Post" : "Create Blog Post")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// View Blog Modal Component
function ViewBlogModal({ blog, onClose }: { blog: Blog; onClose: () => void }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Blog Post Details</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Image */}
                    {blog.image_url && (
                        <div>
                            <img
                                src={blog.image_url}
                                alt={blog.title}
                                className="w-full h-64 object-cover rounded-lg"
                            />
                        </div>
                    )}

                    {/* Title and Status */}
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{blog.title}</h2>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>By {blog.author}</span>
                                <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    blog.is_published
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                }`}>
                                    {blog.is_published ? "Published" : "Draft"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div>
                        <h4 className="font-medium text-gray-900 mb-2">Excerpt</h4>
                        <p className="text-gray-700">{blog.excerpt}</p>
                    </div>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                            <div className="flex flex-wrap gap-2">
                                {blog.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <div>
                        <h4 className="font-medium text-gray-900 mb-2">Content</h4>
                        <div className="prose max-w-none">
                            <div className="text-gray-700 whitespace-pre-wrap">{blog.content}</div>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="text-sm text-gray-500 space-y-1 pt-4 border-t">
                        <p>Blog ID: {blog.id}</p>
                        <p>Slug: {blog.slug}</p>
                        <p>Last updated: {new Date(blog.updated_at).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}