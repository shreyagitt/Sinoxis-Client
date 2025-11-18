// AdminTotalRevenueAnalytics.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  DollarSign,
  Music,
  Download,
  Award,
  RefreshCcw,
  Save,
  Plus,
  Trash2,
  BarChart2,
} from "lucide-react";
import { useAppSelector } from "../store/hook";
import toast from "react-hot-toast";

/* -------------------------
   Types (matches your schema)
------------------------- */
interface PlatformRevenue {
  name: string;
  category: string;
  streams: number;
  revenue: number;
  avgPerStream: number;
  growth: number;
  marketShare: number;
}

interface TrendPoint {
  month: string;
  revenue: number;
}

interface RevenueAnalytics {
  _id?: string;
  totalRevenue: number;
  streamingRevenue: number;
  downloadsRevenue: number;
  royaltiesRevenue: number;
  trends: TrendPoint[];
  platforms: PlatformRevenue[];
  lastUpdated?: string;
}

/* -------------------------
   EMPTY DEFAULT (UI never blocks)
------------------------- */
const EMPTY_ANALYTICS: RevenueAnalytics = {
  totalRevenue: 0,
  streamingRevenue: 0,
  downloadsRevenue: 0,
  royaltiesRevenue: 0,
  trends: [
    { month: "Jan", revenue: 0 },
    { month: "Feb", revenue: 0 },
    { month: "Mar", revenue: 0 },
    { month: "Apr", revenue: 0 },
  ],
  platforms: [],
};

/* -------------------------
   Main Component
------------------------- */
const AdminTotalRevenueAnalytics: React.FC = () => {
  const { token } = useAppSelector((s) => s.auth);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [analytics, setAnalytics] = useState<RevenueAnalytics>(EMPTY_ANALYTICS);
  const [form, setForm] = useState<RevenueAnalytics>(EMPTY_ANALYTICS);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  /* -------------------------
     Fetch (GET /revenue-analytics)
  ------------------------- */
  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/revenue-analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data?.data;
      const doc = Array.isArray(data) ? data[0] : data;
      const final = doc || EMPTY_ANALYTICS;

      // normalize dates
      if (final.lastUpdated) final.lastUpdated = new Date(final.lastUpdated).toString();

      setAnalytics(final);
      setForm(JSON.parse(JSON.stringify(final)));
    } catch (err) {
      console.error("fetchAnalytics:", err);
      toast.error("Failed to load analytics (showing defaults)");
      setAnalytics(EMPTY_ANALYTICS);
      setForm(JSON.parse(JSON.stringify(EMPTY_ANALYTICS)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAnalytics();
  }, [token]);

  /* -------------------------
     Save (POST /revenue-analytics)
  ------------------------- */
  const saveAnalytics = async () => {
    setSaving(true);
    try {
      await axios.post(`${baseUrl}/revenue-analytics`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Analytics saved");
      fetchAnalytics();
    } catch (err) {
      console.error("saveAnalytics:", err);
      toast.error("Failed to save analytics");
    } finally {
      setSaving(false);
    }
  };

  /* -------------------------
     Delete All (DELETE /revenue-analytics)
  ------------------------- */
  const deleteAll = async () => {
    if (!confirm("Delete ALL analytics data?")) return;
    try {
      await axios.delete(`${baseUrl}/revenue-analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("All analytics deleted");
      fetchAnalytics();
    } catch (err) {
      console.error("deleteAll:", err);
      toast.error("Delete failed");
    }
  };

  /* -------------------------
     Handlers for form editing
  ------------------------- */
  const updateSummary = (field: keyof RevenueAnalytics, value: number) => {
    setForm({ ...form, [field]: value } as RevenueAnalytics);
  };

  const addTrend = () => {
    setForm({ ...form, trends: [...form.trends, { month: "New", revenue: 0 }] });
  };
  const updateTrend = (idx: number, key: keyof TrendPoint, val: string | number) => {
    const t = [...form.trends];
    t[idx] = { ...t[idx], [key]: key === "revenue" ? Number(val) : String(val) } as TrendPoint;
    setForm({ ...form, trends: t });
  };
  const removeTrend = (idx: number) => {
    setForm({ ...form, trends: form.trends.filter((_, i) => i !== idx) });
  };

  const addPlatform = () => {
    setForm({
      ...form,
      platforms: [
        ...form.platforms,
        { name: "", category: "", streams: 0, revenue: 0, avgPerStream: 0, growth: 0, marketShare: 0 },
      ],
    });
  };

  const updatePlatform = (idx: number, key: keyof PlatformRevenue, val: string | number) => {
    const p = [...form.platforms];
    p[idx] = { ...p[idx], [key]: ["name", "category"].includes(key) ? String(val) : Number(val) } as PlatformRevenue;
    setForm({ ...form, platforms: p });
  };

  const removePlatform = (idx: number) => {
    setForm({ ...form, platforms: form.platforms.filter((_, i) => i !== idx) });
  };

  /* -------------------------
     UI (always renders, never blocks)
  ------------------------- */
  return (
    <div className="p-6 md:p-8 bg-[#f7f9fc] min-h-screen space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Admin • Total Revenue Analytics</h1>
          {analytics.lastUpdated && (
            <p className="text-xs text-gray-500 mt-1">Last updated: {analytics.lastUpdated}</p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
          >
            <RefreshCcw size={16} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>

          <button
            onClick={saveAnalytics}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save"}
          </button>

          <button
            onClick={deleteAll}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
          >
            <Trash2 size={16} /> Delete All
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <CardEditable
          label="Total Revenue"
          icon={<DollarSign className="w-7 h-7 text-green-600" />}
          value={form.totalRevenue}
          onChange={(v) => updateSummary("totalRevenue" as any, v)}
        />
        <CardEditable
          label="Streaming Revenue"
          icon={<Music className="w-7 h-7 text-green-600" />}
          value={form.streamingRevenue}
          onChange={(v) => updateSummary("streamingRevenue" as any, v)}
        />
        <CardEditable
          label="Downloads Revenue"
          icon={<Download className="w-7 h-7 text-green-600" />}
          value={form.downloadsRevenue}
          onChange={(v) => updateSummary("downloadsRevenue" as any, v)}
        />
        <CardEditable
          label="Royalties"
          icon={<Award className="w-7 h-7 text-green-600" />}
          value={form.royaltiesRevenue}
          onChange={(v) => updateSummary("royaltiesRevenue" as any, v)}
        />
      </div>

      {/* Trends + Distribution */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Trends */}
        <div className="xl:col-span-8 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-5 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Revenue Trends</h3>
            <div className="flex items-center gap-2">
              <button onClick={addTrend} className="inline-flex items-center gap-2 px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50">
                <Plus size={14} /> Add Month
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="rounded-xl border border-dashed border-gray-200 text-center p-6">
              <BarChart2 size={36} className="mx-auto mb-3 text-emerald-600" />
              <h5 className="font-semibold text-gray-800">Trends (editable)</h5>
              <p className="text-sm text-gray-500">Edit month / revenue values below — used for charts in client UI.</p>

              <div className="mt-6 space-y-3">
                {form.trends.map((t, i) => (
                  <div key={i} className="flex items-center gap-2 justify-center">
                    <input
                      value={t.month}
                      onChange={(e) => updateTrend(i, "month", e.target.value)}
                      className="w-32 border rounded px-2 py-1 text-sm"
                    />
                    <input
                      value={t.revenue}
                      type="number"
                      onChange={(e) => updateTrend(i, "revenue", Number(e.target.value))}
                      className="w-36 border rounded px-2 py-1 text-sm"
                    />
                    <button onClick={() => removeTrend(i)} className="text-red-600 px-2">
                      Remove
                    </button>
                  </div>
                ))}
                {form.trends.length === 0 && <p className="text-sm text-gray-500 italic">No trend points. Add one.</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Distribution */}
        <div className="xl:col-span-4 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Distribution</h3>

          <div className="flex justify-center mb-4">
            <div className="w-36 h-36 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
              {form.totalRevenue ? Math.round((form.streamingRevenue / (form.totalRevenue || 1)) * 100) : 0}%
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-500" />
                <span>Streaming</span>
              </div>
              <div className="text-right">
                <div className="font-semibold">${form.streamingRevenue.toLocaleString()}</div>
                <small className="text-gray-500">{((form.streamingRevenue / (form.totalRevenue || 1)) * 100).toFixed(1)}%</small>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-blue-500" />
                <span>Downloads</span>
              </div>
              <div className="text-right">
                <div className="font-semibold">${form.downloadsRevenue.toLocaleString()}</div>
                <small className="text-gray-500">{((form.downloadsRevenue / (form.totalRevenue || 1)) * 100).toFixed(1)}%</small>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-amber-500" />
                <span>Royalties</span>
              </div>
              <div className="text-right">
                <div className="font-semibold">${form.royaltiesRevenue.toLocaleString()}</div>
                <small className="text-gray-500">{((form.royaltiesRevenue / (form.totalRevenue || 1)) * 100).toFixed(1)}%</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platforms Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-5 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Platform Performance</h3>
          <div className="flex items-center gap-2">
            <button onClick={addPlatform} className="inline-flex items-center gap-2 px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50">
              <Plus size={14} /> Add Platform
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 text-left">Platform</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-right">Streams</th>
                <th className="p-3 text-right">Revenue</th>
                <th className="p-3 text-right">Avg / Stream</th>
                <th className="p-3 text-center">Growth</th>
                <th className="p-3 text-right">Market Share</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {form.platforms.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-3">
                    <input value={p.name} onChange={(e) => updatePlatform(i, "name", e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
                  </td>
                  <td className="p-3">
                    <input value={p.category} onChange={(e) => updatePlatform(i, "category", e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
                  </td>
                  <td className="p-3 text-right">
                    <input type="number" value={p.streams} onChange={(e) => updatePlatform(i, "streams", Number(e.target.value))} className="w-28 border rounded px-2 py-1 text-sm text-right" />
                  </td>
                  <td className="p-3 text-right">
                    <input type="number" value={p.revenue} onChange={(e) => updatePlatform(i, "revenue", Number(e.target.value))} className="w-32 border rounded px-2 py-1 text-sm text-right" />
                  </td>
                  <td className="p-3 text-right">
                    <input type="number" value={p.avgPerStream} onChange={(e) => updatePlatform(i, "avgPerStream", Number(e.target.value))} className="w-28 border rounded px-2 py-1 text-sm text-right" />
                  </td>
                  <td className="p-3 text-center">
                    <input type="number" value={p.growth} onChange={(e) => updatePlatform(i, "growth", Number(e.target.value))} className="w-20 border rounded px-2 py-1 text-sm text-center" />
                  </td>
                  <td className="p-3 text-right">
                    <input type="number" value={p.marketShare} onChange={(e) => updatePlatform(i, "marketShare", Number(e.target.value))} className="w-28 border rounded px-2 py-1 text-sm text-right" />
                  </td>
                  <td className="p-3 text-center">
                    <button onClick={() => removePlatform(i)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {form.platforms.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-4 text-center text-gray-500 italic">
                    No platform data. Click "Add Platform" to start.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTotalRevenueAnalytics;

/* -------------------------
   Small reusable components
------------------------- */

const CardEditable = ({
  label,
  icon,
  value,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  value: number;
  onChange: (n: number) => void;
}) => (
  <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 relative">
    <div className="absolute top-5 right-5 text-2xl opacity-80">{icon}</div>
    <p className="text-sm text-gray-600">{label}</p>

    <div className="flex items-baseline gap-2 mt-2">
      <span className="text-gray-400 text-sm">$</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value || 0))}
        className="w-36 text-2xl font-semibold text-gray-800 bg-transparent border-b border-gray-200 focus:outline-none focus:border-green-600"
      />
    </div>
    <p className="text-xs text-gray-400 mt-2">Editable metric</p>
  </div>
);
