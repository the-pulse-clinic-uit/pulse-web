"use client";

interface StarRatingProps {
    rating: number;
}

export function StarRating({ rating }: StarRatingProps) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill={star <= rating ? "#FBBF24" : "#E5E7EB"}
                >
                    <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
                </svg>
            ))}
        </div>
    );
}

interface RatingRow {
    patientName: string;
    service: string;
    doctor: string;
    date: string;
    rating: number;
    comment: string;
}

interface RatingsTableProps {
    data: RatingRow[];
}

export default function RatingsTable({ data }: RatingsTableProps) {
    return (
        <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
            <table className="table w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="font-semibold text-gray-700">
                            Patient&apos;s Name
                        </th>
                        <th className="font-semibold text-gray-700">Service</th>
                        <th className="font-semibold text-gray-700">Doctor</th>
                        <th className="font-semibold text-gray-700">Date</th>
                        <th className="font-semibold text-gray-700">Rate</th>
                        <th className="font-semibold text-gray-700">Comment</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr
                            key={index}
                            className="border-b border-gray-100 hover:bg-gray-50"
                        >
                            <td className="font-medium">{row.patientName}</td>
                            <td>{row.service}</td>
                            <td className="text-blue-600">{row.doctor}</td>
                            <td>{row.date}</td>
                            <td>
                                <StarRating rating={row.rating} />
                            </td>
                            <td className="text-sm text-gray-600">
                                {row.comment}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
