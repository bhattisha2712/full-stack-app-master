import { useState } from "react";

interface User {
  _id: string;
  role: string;
}

export default function RoleControl({ user, onRoleChanged }: { user: User, onRoleChanged?: () => void }) {
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    setUpdating(true);
    setMessage(null);
    const res = await fetch("/api/admin/users/role", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user._id, newRole }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("Role updated successfully.");
      if (onRoleChanged) onRoleChanged();
    } else {
      setMessage(data.error || "Failed to update role.");
    }
    setUpdating(false);
  };

  return (
    <div>
      <div className="relative">
        <select
          value={user.role}
          onChange={handleChange}
          disabled={updating}
          className="border px-2 py-1 pr-8"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {updating && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 animate-pulse">Updating...</span>
        )}
      </div>
      {message && (
        <p className={message === "Role updated successfully." ? "text-green-600" : "text-red-600"}>{message}</p>
      )}
    </div>
  );
}
