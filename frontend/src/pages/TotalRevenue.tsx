import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Save, RefreshCcw } from "lucide-react";
import { useAppSelector } from "../store/hook";
import toast from "react-hot-toast";

/* ============================
   TYPES
============================ */
interface Platform {
  icon?: string;
  name?: string;
  category?: string;
  streams?: number;
  revenue?: number;
  avgPerStream?: number;
  growth?: number;
  marketShare?: number;
}

interface Distribution {
  streaming?: number;
  downloads?: number;
  royalties?: number;
}

interface RevenueAnalytics {
  _id?: string;
  userId?: string;

  totalRevenue?: number;
  totalChange?: string;
  growthAmount?: number;

  streamingRevenue?: number;
  streamingChange?: string;
  streamingPercent?: number;
  streamingGrowth?: number;

  downloadsRevenue?: number;
  downloadsChange?: string;

  royaltiesRevenue?: number;
  royaltiesChange?: string;

  yearToDate?: number;
  currentMonth?: number;
  growthRate?: string;
  revenueSources?: number;

  distribution?: Distribution;
  platforms?: Platform[];
}

/* EMPTY DEFAULT */
const EMPTY: RevenueAnalytics = {
  totalRevenue: 0,
  totalChange: "",
  growthAmount: 0,
  streamingRevenue: 0,
  streamingChange: "",
  streamingPercent: 0,
  streamingGrowth: 0,
  downloadsRevenue: 0,
  downloadsChange: "",
  royaltiesRevenue: 0,
  royaltiesChange: "",
  yearToDate: 0,
  currentMonth: 0,
  growthRate: "",
  revenueSources: 0,
  distribution: {
    streaming: 0,
    downloads: 0,
    royalties: 0,
  },
  platforms: [],
};

/* ============================
    MAIN COMPONENT
============================ */
export default function AdminTotalRevenueAnalytics() {
  const { token } = useAppSelector((s) => s.auth);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [form, setForm] = useState<RevenueAnalytics>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  /* FETCH ANALYTICS */
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/revenue-analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const doc = res.data?.data?.[0] || EMPTY;
      setForm(doc);
    } catch {
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAnalytics();
  }, [token]);

  /* SAVE ANALYTICS */
  const saveAnalytics = async () => {
    try {
      setSaving(true);

      if (form._id) {
        await axios.put(`${baseUrl}/revenue-analytics/${form._id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${baseUrl}/revenue-analytics`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      toast.success("Analytics saved");
      fetchAnalytics();
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  /* DELETE */
  const deleteAnalytics = async () => {
    if (!form._id) return;
    if (!confirm("Delete analytics?")) return;

    try {
      await axios.delete(`${baseUrl}/revenue-analytics/${form._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Deleted");
      setForm(EMPTY);
    } catch {
      toast.error("Delete failed");
    }
  };

  /* PLATFORM HANDLERS */
  const addPlatform = () =>
    setForm({
      ...form,
      platforms: [...(form.platforms || []), {}],
    });

  const updatePlatform = (i: number, key: keyof Platform, value: any) => {
    const arr = [...(form.platforms || [])];
    arr[i] = { ...arr[i], [key]: value };
    setForm({ ...form, platforms: arr });
  };

  const removePlatform = (i: number) =>
    setForm({
      ...form,
      platforms: form.platforms?.filter((_, idx) => idx !== i),
    });

  /* ============================
      UI
  ============================ */
  return (
    <div className="p-6 min-h-screen space-y-10
      bg-white dark:bg-[#020726]
      text-[#020726] dark:text-white transition-colors">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Total Revenue Analytics</h1>

        <div className="flex gap-3">

          {/* Refresh */}
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 rounded-lg flex items-center gap-2
            bg-white dark:bg-[#0B1029]
            border border-gray-300 dark:border-[#1A2347]
            hover:bg-gray-100 dark:hover:bg-[#111A3A]"
          >
            <RefreshCcw size={16} />
          </button>

          {/* Save */}
          <button
            onClick={saveAnalytics}
            disabled={saving}
            className="px-4 py-2 bg-[#0288D1] hover:bg-[#0275B5]
            text-white rounded-lg flex items-center gap-2"
          >
            <Save size={16} />
            Save
          </button>

          {/* Delete */}
          {form._id && (
            <button
              onClick={deleteAnalytics}
              className="px-4 py-2 bg-red-600 hover:bg-red-700
              text-white rounded-lg"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* SUMMARY GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-xl 
        bg-white dark:bg-[#0B1029]
        border border-gray-300 dark:border-[#1A2347]"
      >
        {[
          ["totalRevenue", "Total Revenue"],
          ["streamingRevenue", "Streaming"],
          ["downloadsRevenue", "Downloads"],
          ["royaltiesRevenue", "Royalties"],
        ].map(([key, label]) => (
          <div key={key}>
            <label className="text-sm">{label}</label>
            <input
              type="number"
              value={(form as any)[key] || 0}
              onChange={(e) =>
                setForm({ ...form, [key]: Number(e.target.value) })
              }
              className="w-full border border-gray-300 dark:border-[#1A2347]
                p-2 rounded bg-white dark:bg-[#111A3A]
                text-[#020726] dark:text-white"
            />
          </div>
        ))}
      </div>

      {/* DISTRIBUTION */}
      <div className="p-6 rounded-xl 
        bg-white dark:bg-[#0B1029]
        border border-gray-300 dark:border-[#1A2347]">
        
        <h2 className="font-semibold mb-4">Distribution</h2>

        <div className="flex flex-wrap gap-3">
          {["streaming", "downloads", "royalties"].map((k) => (
            <input
              key={k}
              type="number"
              placeholder={k}
              value={(form.distribution as any)?.[k] || 0}
              onChange={(e) =>
                setForm({
                  ...form,
                  distribution: {
                    ...form.distribution,
                    [k]: Number(e.target.value),
                  },
                })
              }
              className="border border-gray-300 dark:border-[#1A2347]
                p-2 rounded bg-white dark:bg-[#111A3A]
                text-[#020726] dark:text-white"
            />
          ))}
        </div>
      </div>

      {/* PLATFORMS */}
      <div className="p-6 rounded-xl 
        bg-white dark:bg-[#0B1029]
        border border-gray-300 dark:border-[#1A2347]">
        
        <div className="flex justify-between mb-4">
          <h2 className="font-semibold">Platforms</h2>

          <button
            onClick={addPlatform}
            className="text-[#0288D1] hover:underline flex items-center gap-1"
          >
            <Plus size={16} /> Add Platform
          </button>
        </div>

        {form.platforms?.map((p, i) => (
          <div
            key={i}
            className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-2"
          >
            {[
              "name",
              "category",
              "streams",
              "revenue",
              "growth",
              "marketShare",
            ].map((k) => (
              <input
                key={k}
                placeholder={k}
                value={(p as any)[k] || ""}
                onChange={(e) =>
                  updatePlatform(i, k as any, e.target.value)
                }
                className="border border-gray-300 dark:border-[#1A2347]
                p-2 rounded bg-white dark:bg-[#111A3A]
                text-[#020726] dark:text-white"
              />
            ))}

            <button
              onClick={() => removePlatform(i)}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              <Trash2 />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
