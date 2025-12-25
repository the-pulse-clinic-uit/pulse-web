export default function ProfileHeader() {
  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="text-gray-500">Hi, Nguyen Van A!</p>
        <h1 className="text-2xl font-semibold text-purple-900">
          Profile
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-purple-200" />
        <span className="font-medium">Nguyen Van A</span>
      </div>
    </div>
  );
}
