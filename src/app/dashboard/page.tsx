import { Dashboard } from "@/components/dashboard/dashboard";
import { Suspense } from "react";

function DashboardContent() {
  return <Dashboard />;
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
