import { useState } from "react";
import ConfirmModal from "@/components/ConfirmModal";

export default function DeleteUserButton({ userId, onDeleted }: { userId: string; onDeleted?: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleDelete() {
    setLoading(true);
    setMessage(null);
    const res = await fetch("/api/admin/users/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    setLoading(false);
    setOpen(false);
    if (res.ok) {
      setMessage("User deleted successfully.");
      if (onDeleted) onDeleted();
    } else {
      setMessage(data.error || "Failed to delete user.");
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-red-600 underline" disabled={loading}>
        {loading ? "Deleting..." : "Delete"}
      </button>
      {open && (
        <ConfirmModal
          title="Confirm Deletion"
          message="Are you sure you want to delete this user? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setOpen(false)}
        />
      )}
      {message && (
        <p className={message === "User deleted successfully." ? "text-green-600" : "text-red-600"}>{message}</p>
      )}
    </>
  );
}
