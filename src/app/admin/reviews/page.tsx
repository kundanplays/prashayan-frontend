"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Search, Eye, CheckCircle, XCircle, Star, User, Package } from "lucide-react";
import { admin, Review } from "@/lib/api";

export default function ReviewsManagement() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [showViewModal, setShowViewModal] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, [currentPage, searchTerm]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await admin.reviews.list(currentPage, 10);
            setReviews(response.data.reviews);
            setTotalPages(response.data.pages);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            alert(error.message || "Failed to load reviews. Please check your permissions.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReview = async (reviewId: number) => {
        if (!confirm("Are you sure you want to delete this review?")) return;

        try {
            await admin.reviews.delete(reviewId);
            fetchReviews();
        } catch (error) {
            console.error("Error deleting review:", error);
            alert(error.message || "Failed to delete review. Check your permissions.");
        }
    };

    const handleApproveReview = async (reviewId: number) => {
        try {
            await admin.reviews.approve(reviewId);
            fetchReviews();
        } catch (error) {
            console.error("Error approving review:", error);
            alert(error.message || "Failed to approve review. Check your permissions.");
        }
    };

    const renderStars = (rating: number) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${
                    i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
            />
        ));
    };

    const filteredReviews = reviews.filter(review =>
        (review.comment || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (review.user?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (review.product?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Reviews Management</h1>
                    <p className="text-gray-600 mt-1">Manage customer reviews and ratings</p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search reviews by comment, customer name, or product..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : filteredReviews.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        No reviews found
                    </div>
                ) : (
                    filteredReviews.map((review) => (
                        <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">{review.user?.name}</h4>
                                        <div className="flex items-center space-x-1 mt-1">
                                            {renderStars(review.rating)}
                                            <span className="text-sm text-gray-600 ml-2">({review.rating}/5)</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        review.is_verified
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800"
                                    }`}>
                                        {review.is_verified ? "Verified" : "Pending"}
                                    </span>
                                </div>
                            </div>

                            {/* Product */}
                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <Package className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm font-medium text-gray-900">{review.product?.name}</span>
                                </div>
                            </div>

                            {/* Review Content */}
                            <div className="mb-4">
                                <p className="text-gray-700 text-sm line-clamp-4">{review.comment}</p>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                <span>{new Date(review.created_at).toLocaleDateString()}</span>
                                <span>Review ID: {review.id}</span>
                            </div>

                            {/* Actions */}
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => {
                                        setSelectedReview(review);
                                        setShowViewModal(true);
                                    }}
                                    className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                                >
                                    <Eye className="w-4 h-4" />
                                    View
                                </button>
                                {!review.is_verified && (
                                    <button
                                        onClick={() => handleApproveReview(review.id)}
                                        className="flex-1 bg-green-100 text-green-700 py-2 px-3 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Approve
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDeleteReview(review.id)}
                                    className="bg-red-100 text-red-700 py-2 px-3 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                                >
                                    <XCircle className="w-4 h-4" />
                                    Delete
                                </button>
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

            {/* View Review Modal */}
            {showViewModal && selectedReview && (
                <ViewReviewModal
                    review={selectedReview}
                    onClose={() => {
                        setShowViewModal(false);
                        setSelectedReview(null);
                    }}
                    onApprove={() => {
                        handleApproveReview(selectedReview.id);
                        setShowViewModal(false);
                        setSelectedReview(null);
                    }}
                    onDelete={() => {
                        handleDeleteReview(selectedReview.id);
                        setShowViewModal(false);
                        setSelectedReview(null);
                    }}
                />
            )}
        </div>
    );
}

// View Review Modal Component
function ViewReviewModal({
    review,
    onClose,
    onApprove,
    onDelete
}: {
    review: Review;
    onClose: () => void;
    onApprove: () => void;
    onDelete: () => void;
}) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Review Details</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XCircle className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Review Header */}
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900">{review.user?.name}</h4>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    review.is_verified
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                }`}>
                                    {review.is_verified ? "Verified" : "Pending"}
                                </span>
                            </div>
                            <div className="flex items-center space-x-1 mt-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${
                                            i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                        }`}
                                    />
                                ))}
                                <span className="text-sm text-gray-600 ml-2">({review.rating}/5)</span>
                            </div>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <Package className="w-5 h-5 text-gray-400" />
                            <div>
                                <h5 className="font-medium text-gray-900">{review.product?.name}</h5>
                                <p className="text-sm text-gray-600">Product Review</p>
                            </div>
                        </div>
                    </div>

                    {/* Review Content */}
                    <div>
                        <h5 className="font-medium text-gray-900 mb-2">Review</h5>
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>

                    {/* Review Metadata */}
                    <div className="text-sm text-gray-500 space-y-1">
                        <p>Review ID: {review.id}</p>
                        <p>Submitted on: {new Date(review.created_at).toLocaleDateString()} at {new Date(review.created_at).toLocaleTimeString()}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-6 border-t">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Close
                        </button>
                        {!review.is_verified && (
                            <button
                                onClick={onApprove}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Approve Review
                            </button>
                        )}
                        <button
                            onClick={onDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                            <XCircle className="w-4 h-4" />
                            Delete Review
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}