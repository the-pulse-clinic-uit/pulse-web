export default function NotificationList() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="font-semibold text-gray-900 mb-4">
        Recent Notifications
      </h3>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <p className="font-medium text-gray-900">Lab Results Ready</p>
            <p className="text-sm text-gray-500">
              CBC results available for Sarah Smith
            </p>
            <p className="text-xs text-gray-400">10 mins ago</p>
          </div>
        ))}
      </div>

      <button className="mt-4 text-sm text-purple-600 hover:underline">
        View All Notifications →
      </button>
    </div>
  );
}
