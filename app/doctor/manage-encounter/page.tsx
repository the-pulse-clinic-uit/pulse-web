import EncounterHeader from "@/components/doctor/manage-encounter/EncounterHeader";
import EncounterList from "@/components/doctor/manage-encounter/EncounterList";
import NewEncounterButton from "@/components/doctor/manage-encounter/NewEncounterButton";

export default function ManageEncounterPage() {
  return (
    <div className="space-y-6">
      <EncounterHeader />
      <NewEncounterButton />
      <EncounterList />
    </div>
  );
}