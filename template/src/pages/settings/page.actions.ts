// Bindings type for page.md. Edit this to match the data the page references.
export type Bindings = {
  billing: {
    nextInvoiceDate: string;
  };
};

// Action handlers wired up via `action="..."` and `@form submit="..."` in page.md.
// These are demo implementations — replace with your real API calls.

export async function saveProfile(formData: FormData) {
  const data = Object.fromEntries(formData);
  // biome-ignore lint/suspicious/noConsole: demo
  console.log("saveProfile:", data);
  alert(`Profile saved:\n${JSON.stringify(data, null, 2)}`);
}

export async function openBillingPortal() {
  alert("Opening billing portal… (demo)");
}

export async function saveNotifications(formData: FormData) {
  const data = Object.fromEntries(formData);
  // biome-ignore lint/suspicious/noConsole: demo
  console.log("saveNotifications:", data);
  alert(`Notifications saved:\n${JSON.stringify(data, null, 2)}`);
}

export async function deleteWorkspace() {
  if (confirm("Really delete this workspace? (demo)")) {
    alert("Workspace deleted (demo)");
  }
}
