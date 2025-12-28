"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, RefreshCw, ArrowLeft, HelpCircle } from "lucide-react";
import { toast } from "react-hot-toast";

function FailureContent() {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get("invoiceId");
  const status = searchParams.get("status");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a brief loading state for better UX
    const timer = setTimeout(() => {
      setLoading(false);
      toast.error("Payment failed. Please try again.");
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const getStatusMessage = (statusCode: string | null) => {
    switch (statusCode) {
      case "01":
        return "Transaction canceled by user";
      case "02":
        return "Insufficient balance";
      case "03":
        return "Invalid card information";
      case "04":
        return "Transaction timeout";
      case "05":
        return "Payment gateway error";
      default:
        return "Payment processing failed";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Failed
          </h1>
          <p className="text-gray-600 mb-6">
            {getStatusMessage(status)}
          </p>

          {/* Error Details */}
          <div className="bg-red-50 rounded-lg p-4 mb-6 space-y-3">
            {invoiceId && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Invoice ID:</span>
                <span className="font-mono text-gray-900">
                  {invoiceId.substring(0, 8)}
                </span>
              </div>
            )}
            {status && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Error Code:</span>
                <span className="font-mono text-red-600">{status}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Attempted at:</span>
              <span className="text-gray-900">
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          {/* Common Issues */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
            <div className="flex items-start gap-2 mb-2">
              <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2">
                  Common Issues:
                </h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Insufficient funds in your account</li>
                  <li>• Incorrect card details or expired card</li>
                  <li>• Network connectivity issues</li>
                  <li>• Transaction limits exceeded</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {invoiceId && (
              <Link
                href={`/invoices/${invoiceId}`}
                className="btn btn-primary w-full gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Link>
            )}
            <Link
              href="/invoices"
              className="btn btn-outline w-full gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Invoices
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">
              Need help? Contact our support team
            </p>
            <a
              href="mailto:support@pulse.com"
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              support@pulse.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    }>
      <FailureContent />
    </Suspense>
  );
}
