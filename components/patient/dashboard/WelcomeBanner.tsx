interface Props {
  userName?: string;
}

export default function WelcomeBanner({ userName }: Props) {
  return (
    <div className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl p-4 lg:p-6 text-white mb-6 shadow-lg">
      <h1 className="mb-1 text-xl lg:text-2xl font-semibold">
        Welcome back, {userName || "Patient"}!
      </h1>
      <p className="text-purple-50 text-sm lg:text-base">
        Here is your health dashboard. Stay on top of your appointments and
        medical records.
      </p>
    </div>
  );
}
