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
} from "lucide-react";
import { useAppSelector } from "../store/hook";
import toast from "react-hot-toast";

/* ============================
   TYPES
============================ */
interface PlatformPerformance {
  platform: string;
  streams: number;
  revenue: number;
  growth: number;
  marketShare: number;
}

interface ArtistRevenue {
  name: string;
  genre: string;
  totalRevenue: number;
  streaming: number;
  downloads: number;
  royalties: number;
  growth: number;
}

interface TopTrack {
  title: string;
  artist: string;
  revenue: number;
  rank: number;
}

interface RevenueSummary {
  totalRevenue: number;
  streamingRevenue: number;
  downloadsRevenue: number;
  royalties: number;
}

interface RevenueReport {
  _id?: string;
  summary: RevenueSummary;
  platformPerformance: PlatformPerformance[];
  artistRevenues: ArtistRevenue[];
  topTracks: TopTrack[];
  lastUpdated?: string;
}

/* ============================
   EMPTY STRUCT SO UI ALWAYS LOADS
============================ */
const EMPTY_REPORT: RevenueReport = {
  summary: {
    totalRevenue: 0,
    streamingRevenue: 0,
    downloadsRevenue: 0,
    royalties: 0,
  },
  platformPerformance: [],
  artistRevenues: [],
  topTracks: [],
};

/* ============================
   MAIN ADMIN COMPONENT
============================ */
const AdminRevenueReport: React.FC = () => {
  const { token } = useAppSelector((s) => s.auth);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [report, setReport] = useState<RevenueReport>(EMPTY_REPORT);
  const [form, setForm] = useState<RevenueReport>(EMPTY_REPORT);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  /* ============================
     FETCH REPORT (NEVER BLOCK UI)
  ============================ */
  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/revenue-report`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data?.data;
      const doc = Array.isArray(data) ? data[0] : data;

      const finalReport = doc || EMPTY_REPORT;

      setReport(finalReport);
      setForm(JSON.parse(JSON.stringify(finalReport))); // deep clone
    } catch (err) {
      console.error(err);
      toast.error("Failed to load revenue report");

      // Still show empty UI
      setReport(EMPTY_REPORT);
      setForm(EMPTY_REPORT);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchReport();
  }, [token]);

  /* ============================
     SAVE REPORT
  ============================ */
  const saveReport = async () => {
    setSaving(true);
    try {
      await axios.post(`${baseUrl}/revenue-report`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Revenue report saved");
      fetchReport();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  /* ============================
     DELETE ALL
  ============================ */
  const deleteAllReports = async () => {
    if (!confirm("Delete ALL revenue reports?")) return;

    try {
      await axios.delete(`${baseUrl}/revenue-report`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("All reports deleted");
      fetchReport();
    } catch {
      toast.error("Delete failed");
    }
  };

  const { summary } = form;

  /* ============================
     RENDER UI
  ============================ */
  return (
    <div className="p-8 bg-[#f7f9fc] min-h-screen space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Admin • Revenue Reports
          </h1>
          {report?.lastUpdated && (
            <p className="text-xs text-gray-500 mt-1">
              Last updated: {new Date(report.lastUpdated).toLocaleString()}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={fetchReport}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
          >
            <RefreshCcw size={16} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>

          <button
            onClick={saveReport}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save"}
          </button>

          <button
            onClick={deleteAllReports}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
          >
            <Trash2 size={16} /> Delete All
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <SummaryCard
          label="Total Revenue"
          icon={<DollarSign className="w-7 h-7 text-green-600" />}
          value={summary.totalRevenue}
          onChange={(v) =>
            setForm({ ...form, summary: { ...summary, totalRevenue: v } })
          }
        />

        <SummaryCard
          label="Streaming Revenue"
          icon={<Music className="w-7 h-7 text-green-600" />}
          value={summary.streamingRevenue}
          onChange={(v) =>
            setForm({
              ...form,
              summary: { ...summary, streamingRevenue: v },
            })
          }
        />

        <SummaryCard
          label="Downloads Revenue"
          icon={<Download className="w-7 h-7 text-green-600" />}
          value={summary.downloadsRevenue}
          onChange={(v) =>
            setForm({
              ...form,
              summary: { ...summary, downloadsRevenue: v },
            })
          }
        />

        <SummaryCard
          label="Royalties"
          icon={<Award className="w-7 h-7 text-green-600" />}
          value={summary.royalties}
          onChange={(v) =>
            setForm({
              ...form,
              summary: { ...summary, royalties: v },
            })
          }
        />
      </div>

      {/* PLATFORM PERFORMANCE TABLE */}
      <EditableTable
        title="Platform Performance"
        rows={form.platformPerformance}
        fields={[
          { key: "platform", label: "Platform" },
          { key: "streams", label: "Streams" },
          { key: "revenue", label: "Revenue" },
          { key: "growth", label: "Growth (%)" },
          { key: "marketShare", label: "Market Share (%)" },
        ]}
        addRow={() =>
          setForm({
            ...form,
            platformPerformance: [
              ...form.platformPerformance,
              {
                platform: "",
                streams: 0,
                revenue: 0,
                growth: 0,
                marketShare: 0,
              },
            ],
          })
        }
        removeRow={(i) =>
          setForm({
            ...form,
            platformPerformance: form.platformPerformance.filter(
              (_, idx) => idx !== i
            ),
          })
        }
        updateField={(i, key, val) => {
          const a = [...form.platformPerformance];
          a[i][key] = key === "platform" ? val : Number(val);
          setForm({ ...form, platformPerformance: a });
        }}
      />

      {/* ARTIST REVENUES */}
      <EditableTable
        title="Revenue by Artist"
        rows={form.artistRevenues}
        fields={[
          { key: "name", label: "Artist" },
          { key: "genre", label: "Genre" },
          { key: "totalRevenue", label: "Total Revenue" },
          { key: "streaming", label: "Streaming" },
          { key: "downloads", label: "Downloads" },
          { key: "royalties", label: "Royalties" },
          { key: "growth", label: "Growth (%)" },
        ]}
        addRow={() =>
          setForm({
            ...form,
            artistRevenues: [
              ...form.artistRevenues,
              {
                name: "",
                genre: "",
                totalRevenue: 0,
                streaming: 0,
                downloads: 0,
                royalties: 0,
                growth: 0,
              },
            ],
          })
        }
        removeRow={(i) =>
          setForm({
            ...form,
            artistRevenues: form.artistRevenues.filter(
              (_, idx) => idx !== i
            ),
          })
        }
        updateField={(i, key, val) => {
          const a = [...form.artistRevenues];
          a[i][key] = key === "name" || key === "genre" ? val : Number(val);
          setForm({ ...form, artistRevenues: a });
        }}
      />

      {/* TOP TRACKS */}
      <EditableTable
        title="Top Performing Tracks"
        rows={form.topTracks}
        fields={[
          { key: "rank", label: "Rank" },
          { key: "title", label: "Title" },
          { key: "artist", label: "Artist" },
          { key: "revenue", label: "Revenue" },
        ]}
        addRow={() =>
          setForm({
            ...form,
            topTracks: [
              ...form.topTracks,
              {
                title: "",
                artist: "",
                revenue: 0,
                rank: form.topTracks.length + 1,
              },
            ],
          })
        }
        removeRow={(i) =>
          setForm({
            ...form,
            topTracks: form.topTracks.filter((_, idx) => idx !== i),
          })
        }
        updateField={(i, key, val) => {
          const a = [...form.topTracks];
          a[i][key] =
            key === "title" || key === "artist" ? val : Number(val);
          setForm({ ...form, topTracks: a });
        }}
      />
    </div>
  );
};

export default AdminRevenueReport;

/* ============================
   SUMMARY CARD
============================ */
const SummaryCard = ({
  label,
  icon,
  value,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  value: number;
  onChange: (v: number) => void;
}) => (
  <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 relative">
    <div className="absolute top-5 right-5 text-2xl opacity-80">{icon}</div>

    <p className="text-gray-600 text-sm">{label}</p>

    <div className="flex items-baseline gap-2 mt-2">
      <span className="text-gray-400 text-sm">$</span>
      <input
        type="number"
        className="w-32 text-2xl font-semibold text-gray-800 bg-transparent border-b border-gray-200 focus:border-green-600 focus:outline-none"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  </div>
);

/* ============================
   EDITABLE TABLE
============================ */
const EditableTable = ({
  title,
  rows,
  fields,
  addRow,
  removeRow,
  updateField,
}: {
  title: string;
  rows: any[];
  fields: { key: string; label: string }[];
  addRow: () => void;
  removeRow: (i: number) => void;
  updateField: (i: number, key: string, value: any) => void;
}) => (
  <div className="bg-white shadow-md rounded-xl border border-gray-100 overflow-hidden">
    <div className="p-5 flex justify-between items-center">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>

      <button
        type="button"
        onClick={addRow}
        className="inline-flex items-center gap-2 text-sm border px-3 py-1.5 rounded-lg hover:bg-gray-50"
      >
        <Plus size={16} /> Add Row
      </button>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            {fields.map((f) => (
              <th key={f.key} className="p-3 text-left">
                {f.label}
              </th>
            ))}
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {fields.map((f) => (
                <td key={f.key} className="p-3">
                  <input
                    className="w-full border rounded-md px-2 py-1 text-sm"
                    value={row[f.key]}
                    type={typeof row[f.key] === "number" ? "number" : "text"}
                    onChange={(e) =>
                      updateField(i, f.key, e.target.value)
                    }
                  />
                </td>
              ))}

              <td className="p-3 text-center">
                <button
                  onClick={() => removeRow(i)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={17} />
                </button>
              </td>
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td
                colSpan={fields.length + 1}
                className="py-4 text-center text-gray-500 italic"
              >
                No data available. Click "Add Row" to start.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);
