import SettingsPage from "@/pages/settings/page.md";

// In a real app, replace this with data from your loader / query layer.
const billing = {
  nextInvoiceDate: "March 15",
};

export default function App() {
  return (
    <main className="container mx-auto max-w-2xl px-4 py-12">
      <SettingsPage billing={billing} />
    </main>
  );
}
