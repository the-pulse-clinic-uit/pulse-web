import React from "react";

export default function PatientIndexPage() {
  return (
    <div className="min-h-screen">
      {/* The layout will render the header, hero, etc. This page shows nested content for /patient */}
      <div className="container mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold">Patient Portal</h2>
        <p className="text-muted-foreground mt-2">This page uses the patient layout and components.</p>
      </div>
    </div>
  );
}
