import PatientHeader from "@/components/patient/PatientHeader";

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <PatientHeader />
            <main>{children}</main>
        </>
    );
}
