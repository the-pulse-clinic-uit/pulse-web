export default function ProfessionalInfoCard() {
  return (
    <section className="bg-white rounded-2xl p-6 shadow">
      <div className="flex justify-between mb-6">
        <h2 className="font-semibold text-lg">Professional Information</h2>
        <button className="text-purple-600">Edit</button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-500">Specialty</p>
          <p className="font-medium">Internal Medicine</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Practicing Certificate</p>
          <p className="font-medium">—</p>
        </div>
      </div>
    </section>
  );
}
