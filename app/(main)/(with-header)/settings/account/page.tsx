import DeactivateAccount from "@/src/features/settings/account/components/DeactivateAccount";
import ProfileCard from "@/src/features/settings/account/components/ProfileCard";
import SecuritySection from "@/src/features/settings/account/components/SecuritySection";

export default function AccountSettingsPage() {
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* <ProfileCard /> */}
        <ProfileCard />
        {/* <SecuritySection /> */}
        <SecuritySection />
        {/* <DeactivateAccount /> */}
        <DeactivateAccount />
      </div>
    </div>
  );
}
