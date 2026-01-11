import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SubmissionStep() {
    const navigate = useNavigate();
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020726] to-[#0a1039] text-white font-[Montserrat]">

      {/* HEADER */}
      <div className="flex justify-between items-center px-10 py-6">
        <h1 className="text-xl font-medium">Release Application Form</h1>
        <p className="text-sm">
          Home <span className="text-gray-400">/</span>{" "}
          <span className="text-sky-400">Dashboard</span>
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="max-w-6xl mx-auto mt-6 bg-[#060b2e] rounded-[28px] px-12 py-10 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">

        {/* TITLE */}
        <h2 className="text-center text-4xl font-medium text-sky-400">
          Create Release
        </h2>
        <p className="text-center text-gray-300 mt-2">
          Complete all steps to publish your release
        </p>

        {/* PROGRESS BAR */}
        <div className="relative mt-12">
          <div className="h-[3px] bg-white/10 rounded-full" />
          <div className="absolute top-0 h-[3px] w-full bg-sky-400 rounded-full" />

          <div className="absolute top-[-7px] left-0 w-full flex justify-between">
            {["Release", "Tracks", "Stores", "Submission"].map((step, i) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-4 h-4 rounded-full ${
                    i < 3
                      ? "bg-yellow-400"
                      : "bg-sky-400 shadow-[0_0_0_6px_rgba(56,189,248,0.15)]"
                  }`}
                />
                <span
                  className={`mt-4 text-sm ${
                    i === 3 ? "text-sky-400" : "text-gray-400"
                  }`}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION PILL */}
        <div className="flex justify-center mt-12">
          <span className="px-8 py-2 rounded-full bg-sky-400 text-[#020726] font-medium shadow-md">
            Submission
          </span>
        </div>

        {/* STATUS CARDS */}
        <div className="grid md:grid-cols-3 gap-6 mt-14">
          <StatusCard text="Release incomplete" />
          <StatusCard text="Tracks incomplete" />
          <StatusCard text="No store selected" />
        </div>

        {/* CONFIRMATION */}
        <div className="flex items-center gap-3 mt-8">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="w-5 h-5 accent-sky-400"
          />
          <span className="text-sm">
            I confirm the information is accurate
          </span>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-between mt-12">
          <button
          onClick={() => navigate("/stores")}
          className="px-6 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition">
            Back
          </button>

          <button
          onClick={() => navigate("/releases/myRelease")}
            disabled={!confirmed}
            className={`px-8 py-2 rounded-lg font-medium transition
              ${
                confirmed
                  ? "bg-emerald-500 hover:bg-emerald-400 text-[#020726]"
                  : "bg-emerald-500/40 cursor-not-allowed"
              }
            `}
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- SUB COMPONENT ---------------- */

function StatusCard({ text }) {
  return (
    <div className="
      rounded-full
      px-6 py-3
      border border-yellow-400/70
      bg-white/5
      text-center
      text-sm
      text-yellow-300
    ">
      {text}
    </div>
  );
}
