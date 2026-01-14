"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquare, User, TrendingUp } from "lucide-react";
import Cookies from "js-cookie";

interface RatingDto {
    encounterId: string;
    rating: number;
    comment: string | null;
    ratedAt: string;
    patientName: string;
}

export default function DoctorRatingsCard() {
    const [ratings, setRatings] = useState<RatingDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRatings = async () => {
            const token = Cookies.get("token");
            if (!token) return;

            try {
                const response = await fetch("/api/doctors/me/ratings", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setRatings(data);
                }
            } catch (error) {
                console.error("Failed to fetch ratings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRatings();
    }, []);

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatTime = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${
                            star <= rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                        }`}
                    />
                ))}
            </div>
        );
    };

    const averageRating =
        ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
            : 0;

    const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: ratings.filter((r) => r.rating === star).length,
        percentage:
            ratings.length > 0
                ? (ratings.filter((r) => r.rating === star).length /
                      ratings.length) *
                  100
                : 0,
    }));

    if (loading) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Patient Ratings
                </h3>
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                    Patient Ratings
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <TrendingUp className="w-4 h-4" />
                    {ratings.length} {ratings.length === 1 ? "review" : "reviews"}
                </div>
            </div>

            {ratings.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No ratings yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                        Ratings from completed encounters will appear here
                    </p>
                </div>
            ) : (
                <>
                    {/* summary */}
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-purple-700">
                                    {averageRating.toFixed(1)}
                                </div>
                                <div className="flex justify-center mt-1">
                                    {renderStars(Math.round(averageRating))}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Average Rating
                                </p>
                            </div>

                            <div className="flex-1 space-y-1">
                                {ratingDistribution.map(({ star, count, percentage }) => (
                                    <div key={star} className="flex items-center gap-2">
                                        <span className="text-xs text-gray-600 w-3">
                                            {star}
                                        </span>
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-yellow-400 h-2 rounded-full transition-all"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500 w-6">
                                            {count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* individual reviews */}
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {ratings.map((rating) => (
                            <div
                                key={rating.encounterId}
                                className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                            <User className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm">
                                                {rating.patientName}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatDate(rating.ratedAt)} at{" "}
                                                {formatTime(rating.ratedAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {renderStars(rating.rating)}
                                        <span className="text-sm font-semibold text-purple-600">
                                            {rating.rating}/5
                                        </span>
                                    </div>
                                </div>

                                {rating.comment && (
                                    <div className="flex items-start gap-2 mt-3 pl-10">
                                        <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-gray-600 italic">
                                            &quot;{rating.comment}&quot;
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
