'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Heart } from "lucide-react";
import WeddingImageUploader from "@/components/WeddingImageUploader";

interface CardDesign {
  _id?: string;
  name: string;
  description: string;
  category: string;
  templateImage: string;
  price: number;
  isActive: boolean;
}

export default function AdminWeddingCards() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [cards, setCards] = useState<CardDesign[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<CardDesign | null>(null);

  const [form, setForm] = useState<CardDesign>({
    name: "",
    description: "",
    category: "traditional",
    templateImage: "",
    price: 0,
    isActive: true,
  });

  const fetchCards = async () => {
    const res = await fetch("/api/cards?all=true");
    const data = await res.json();
    setCards(data);
  };

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") router.push("/auth/signin");
    fetchCards();
  }, [session, status]);

  const saveCard = async (e: any) => {
    e.preventDefault();
    const url = editing ? `/api/cards/${editing._id}` : "/api/cards";
    const method = editing ? "PUT" : "POST";

    const body = editing ? form : { ...form, createdBy: session?.user?.id };

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    fetchCards();
    closeModal();
  };

  const deleteCard = async (id: string) => {
    if (!confirm("Delete this wedding card?")) return;
    await fetch(`/api/cards/${id}`, { method: "DELETE" });
    fetchCards();
  };

  const openEdit = (card: CardDesign) => {
    setEditing(card);
    setForm(card);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setForm({
      name: "",
      description: "",
      category: "traditional",
      templateImage: "",
      price: 0,
      isActive: true,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-100 to-yellow-50">

      {/* HEADER */}
      <header className="bg-white shadow-xl p-4 flex justify-between items-center border-b-4 border-pink-200">
        <h1 className="text-2xl font-bold text-pink-700 flex items-center gap-2">
          <Heart className="text-red-500 animate-pulse" />
          Wedding Card Admin Panel
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-pink-600 text-white px-5 py-2 rounded-full shadow hover:bg-pink-700"
        >
          + Add Wedding Card
        </button>
      </header>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {cards.map(card => (
          <motion.div key={card._id} whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl shadow-2xl border border-pink-200 overflow-hidden">

            <img src={card.templateImage} className="h-44 w-full object-cover" />

            <div className="p-4">
              <h3 className="font-bold text-lg text-pink-700">{card.name}</h3>
              <p className="text-sm text-gray-500">{card.description}</p>

              <div className="flex justify-between mt-2">
                <span className="font-bold text-pink-600">₹{card.price}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  card.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  {card.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex gap-2 mt-3">
                <button onClick={() => openEdit(card)} className="bg-blue-600 text-white px-3 py-1 rounded flex-1">Edit</button>
                <button onClick={() => deleteCard(card._id!)} className="bg-red-600 text-white px-3 py-1 rounded flex-1">Delete</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}
            className="bg-white p-6 rounded-2xl shadow-2xl w-[550px] border-4 border-pink-300">

            <h2 className="text-xl font-bold text-pink-700 mb-3">
              💍 {editing ? "Edit Wedding Card" : "Add New Wedding Card"}
            </h2>

            <form onSubmit={saveCard} className="space-y-3">

              <input
                placeholder="Card Name (Bride & Groom Invite)"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-pink-500"
                required
              />

              <textarea
                placeholder="Royal Hindu Wedding Invitation"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-pink-500"
                required
              />

              {/* IMAGE UPLOAD */}
              <WeddingImageUploader onUpload={(url) => setForm({ ...form, templateImage: url })} />

              {form.templateImage && (
                <img src={form.templateImage} className="h-28 rounded border mt-2 shadow" />
              )}

              <input
                type="number"
                placeholder="Price ₹"
                value={form.price}
                onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-pink-500"
                required
              />

              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full border p-2 rounded"
              >
                <option value="traditional">Traditional Hindu</option>
                <option value="royal">Royal Gold Theme</option>
                <option value="modern">Modern Wedding</option>
                <option value="muslim">Muslim Wedding</option>
                <option value="christian">Christian Wedding</option>
              </select>

              <label className="flex items-center gap-2 text-pink-700 font-semibold">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
                Active Card
              </label>

              <div className="flex gap-2">
                <button className="bg-pink-600 text-white px-4 py-2 rounded flex-1">
                  {editing ? "Update" : "Add"} Card
                </button>
                <button type="button" onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded flex-1">
                  Cancel
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
