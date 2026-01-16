"use client";

import { useState, useEffect } from "react";
import { CreditCard, Search, CheckCircle, XCircle, AlertCircle, Eye } from "lucide-react";
import { admin, Payment } from "@/lib/api";

export default function PaymentsManagement() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [showViewModal, setShowViewModal] = useState(false);

    useEffect(() => {
        fetchPayments();
    }, [currentPage, searchTerm]);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const response = await admin.payments.list(currentPage, 10);
            setPayments(response.data.payments);
            setTotalPages(response.data.pages);
        } catch (error) {
            console.error("Error fetching payments:", error);
            alert(error.message || "Failed to load payments. Please check your permissions.");
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentVerification = async (orderId: string, razorpayPaymentId: string) => {
        try {
            await admin.payments.verify(orderId, razorpayPaymentId);
            fetchPayments();
            alert("Payment verified successfully!");
        } catch (error) {
            console.error("Error verifying payment:", error);
            alert(error.message || "Failed to verify payment. Check your permissions.");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "paid":
                return "bg-green-100 text-green-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "failed":
                return "bg-red-100 text-red-800";
            case "cancelled":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case "paid":
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case "pending":
                return <AlertCircle className="w-4 h-4 text-yellow-500" />;
            case "failed":
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return <CreditCard className="w-4 h-4 text-gray-500" />;
        }
    };

    const filteredPayments = payments.filter(payment =>
        payment.id.toString().includes(searchTerm) ||
        payment.order_id.toString().includes(searchTerm) ||
        payment.razorpay_order_id.includes(searchTerm) ||
        payment.razorpay_payment_id.includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Payments Management</h1>
                    <p className="text-gray-600 mt-1">Monitor and verify payment transactions</p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search payments by ID, order ID, or Razorpay IDs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Payment ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Razorpay IDs
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredPayments.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                        No payments found
                                    </td>
                                </tr>
                            ) : (
                                filteredPayments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {getStatusIcon(payment.status)}
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        #{payment.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                #{payment.order_id}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ₹{payment.amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-xs text-gray-500 space-y-1">
                                                <div>Order: {payment.razorpay_order_id.slice(-8)}</div>
                                                <div>Payment: {payment.razorpay_payment_id.slice(-8)}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(payment.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedPayment(payment);
                                                        setShowViewModal(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900 p-1"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {payment.status === "pending" && (
                                                    <button
                                                        onClick={() => handlePaymentVerification(payment.order_id.toString(), payment.razorpay_payment_id)}
                                                        className="text-green-600 hover:text-green-900 p-1"
                                                        title="Verify Payment"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
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

            {/* View Payment Modal */}
            {showViewModal && selectedPayment && (
                <ViewPaymentModal
                    payment={selectedPayment}
                    onClose={() => {
                        setShowViewModal(false);
                        setSelectedPayment(null);
                    }}
                    onVerify={() => {
                        handlePaymentVerification(selectedPayment.order_id.toString(), selectedPayment.razorpay_payment_id);
                        setShowViewModal(false);
                        setSelectedPayment(null);
                    }}
                />
            )}
        </div>
    );
}

// View Payment Modal Component
function ViewPaymentModal({
    payment,
    onClose,
    onVerify
}: {
    payment: Payment;
    onClose: () => void;
    onVerify: () => void;
}) {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "paid":
                return "text-green-600 bg-green-50";
            case "pending":
                return "text-yellow-600 bg-yellow-50";
            case "failed":
                return "text-red-600 bg-red-50";
            case "cancelled":
                return "text-gray-600 bg-gray-50";
            default:
                return "text-gray-600 bg-gray-50";
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XCircle className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Status Badge */}
                    <div className="flex items-center justify-center">
                        <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                            {payment.status.toUpperCase()}
                        </span>
                    </div>

                    {/* Payment Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Payment ID</label>
                                <p className="text-sm text-gray-900 font-mono">#{payment.id}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Order ID</label>
                                <p className="text-sm text-gray-900 font-mono">#{payment.order_id}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Amount</label>
                                <p className="text-lg font-bold text-gray-900">₹{payment.amount.toLocaleString()}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Currency</label>
                                <p className="text-sm text-gray-900">{payment.currency.toUpperCase()}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Razorpay Order ID</label>
                                <p className="text-xs text-gray-900 font-mono break-all">{payment.razorpay_order_id}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Razorpay Payment ID</label>
                                <p className="text-xs text-gray-900 font-mono break-all">{payment.razorpay_payment_id}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Transaction Date</label>
                                <p className="text-sm text-gray-900">
                                    {new Date(payment.created_at).toLocaleDateString()} at {new Date(payment.created_at).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Verification */}
                    {payment.status === "pending" && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-center">
                                <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium text-yellow-800">Payment Verification Required</h4>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        This payment is pending verification. Click below to verify with Razorpay.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={onVerify}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    Verify Payment
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Success/Failure Messages */}
                    {payment.status === "paid" && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                                <div>
                                    <h4 className="text-sm font-medium text-green-800">Payment Successful</h4>
                                    <p className="text-sm text-green-700 mt-1">
                                        This payment has been successfully verified and processed.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {payment.status === "failed" && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center">
                                <XCircle className="w-5 h-5 text-red-600 mr-3" />
                                <div>
                                    <h4 className="text-sm font-medium text-red-800">Payment Failed</h4>
                                    <p className="text-sm text-red-700 mt-1">
                                        This payment transaction failed. Please check with the customer for details.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}