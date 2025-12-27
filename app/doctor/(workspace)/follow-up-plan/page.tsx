import FollowUpHeader from "@/components/doctor/follow-up-plan/FollowUpHeader";
import FollowUpList from "@/components/doctor/follow-up-plan/FollowUpList";

export default function FollowUpPlanPage() {
  return (
    <div className="space-y-6">
      <FollowUpHeader />
      <FollowUpList />
    </div>
  );
}
