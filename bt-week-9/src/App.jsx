import { useEffect, useState } from "react";
import api from "./api";
import UserForm from "./components/UserForm";
import UserTable from "./components/UserTable";
import Pagination from "./components/Pagination";
import EditModal from "./components/EditModal";
import "./index.css";

export default function App() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const res = await api.get("/");
      setUsers(res.data);
    } catch {
      alert("Failed to load users");
    }
  }

  // Create
  async function handleCreate(user) {
    try {
      const res = await api.post("/", user);
      setUsers((prev) => [...prev, { ...user, id: res.data.id }]);
    } catch {
      alert("Create failed");
    }
  }

  // Save edit
  async function handleSaveEdit(updated) {
    try {
      await api.put(`/${editingUser.id}`, updated);
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...u, ...updated } : u))
      );
      setEditingUser(null);
    } catch {
      alert("Update failed");
    }
  }

  // Delete
  async function handleDelete(id) {
    if (!confirm("Delete this user?")) return;
    try {
      await api.delete(`/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert("Delete failed");
    }
  }

  // Search + pagination
  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const start = (currentPage - 1) * perPage;
  const pageUsers = filtered.slice(start, start + perPage);

  return (
    <div className="container">
      <h1>CRUD </h1>

      <input
        className="search"
        placeholder="Search..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />

      <UserForm onSubmit={handleCreate} />

      <UserTable
        users={pageUsers}
        onEdit={(u) => setEditingUser(u)}
        onDelete={handleDelete}
      />

      <Pagination
        total={totalPages}
        currentPage={currentPage}
        onChange={(p) => setCurrentPage(p)}
      />

      <EditModal
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
