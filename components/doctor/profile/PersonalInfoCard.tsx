export default function PersonalInfoCard() {
  return (
    <section className="bg-white rounded-2xl p-6 shadow">
      <div className="flex justify-between mb-6">
        <h2 className="font-semibold text-lg">Personal Information</h2>
        <button className="text-purple-600">Edit</button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Info label="Name" value="Nguyen Van A" />
        <Info label="Date Of Birth" value="07/01/1997" />
        <Info label="Age" value="26" />
        <Info label="Phone Number" value="0756348223" />
        <Info label="Email Address" value="nguyenvana@gmail.com" />
        <Info label="Address" value="Thu Duc, HCM City" />
        <Info label="Gender" value="Male" />
        <Info label="Ethnicity" value="Kinh" />
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
