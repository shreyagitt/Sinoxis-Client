import React, { useState } from "react";

const GeneralSettingsPage = () => {
  const [formData, setFormData] = useState({
    siteTitle: "Sinoxis Music Group",
    tagline: "Release Your Music Worldwide.",
    siteAddress: "https://sinoxis.org",
    adminEmail: "sinoxisnetwork@gmail.com",
    membership: true,
    role: "Artist",
    language: "English (United States)",
    timezone: "UTC+5:30",
    dateFormat: "F j, Y",
    timeFormat: "g:i a",
    weekStartsOn: "Monday",
    logo: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileURL = URL.createObjectURL(e.target.files[0]);
      setFormData((prev) => ({ ...prev, logo: fileURL }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Changes Saved Successfully!");
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="bg-white border rounded-md shadow-sm max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-800">
            General Settings
          </h1>
          <button
            type="submit"
            form="settingsForm"
            className="bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium px-5 py-2 rounded-md shadow-sm"
          >
            Save Changes
          </button>
        </div>

        <form
          id="settingsForm"
          onSubmit={handleSubmit}
          className="divide-y divide-gray-200"
        >
          {/* Site Title */}
          <SettingRow
            label="Site Title"
            input={
              <input
                type="text"
                name="siteTitle"
                value={formData.siteTitle}
                onChange={handleChange}
                className="w-full border border-black rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            }
          />

          {/* Tagline */}
          <SettingRow
            label="Tagline"
            input={
              <>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  className="w-full border border-black rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
                <p className="text-sm text-gray-500 mt-1">
                  In a few words, explain what this site is about.
                </p>
              </>
            }
          />

          {/* Site Address */}
          <SettingRow
            label="Site Address (URL)"
            input={
              <>
                <input
                  type="text"
                  name="siteAddress"
                  value={formData.siteAddress}
                  onChange={handleChange}
                  className="w-full border border-black rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter the same address unless you want your site home page to
                  be different from your WordPress installation directory.
                </p>
              </>
            }
          />

          {/* Admin Email */}
          <SettingRow
            label="Administration Email Address"
            input={
              <>
                <input
                  type="email"
                  name="adminEmail"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  className="w-full border border-black rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
                <p className="text-sm text-gray-500 mt-1">
                  This address is used for admin purposes. If you change this,
                  an email will be sent to confirm.
                </p>
              </>
            }
          />

          {/* Membership */}
          <SettingRow
            label="Membership"
            input={
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  name="membership"
                  checked={formData.membership}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 border-black rounded"
                />
                <span>Anyone can register</span>
              </label>
            }
          />

          {/* Role */}
          <SettingRow
            label="New User Default Role"
            input={
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border border-black rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option>Artist</option>
                <option>Admin</option>
                <option>Manager</option>
              </select>
            }
          />

          {/* Language */}
          <SettingRow
            label="Site Language"
            input={
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full border border-black rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option>English (United States)</option>
                <option>English (UK)</option>
                <option>Hindi (India)</option>
              </select>
            }
          />

          {/* Timezone */}
          <SettingRow
            label="Timezone"
            input={
              <select
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                className="w-full border border-black rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option>UTC+5:30</option>
                <option>UTC</option>
                <option>UTC+1</option>
                <option>UTC-5</option>
              </select>
            }
          />

          {/* Date Format */}
          <SettingRow
            label="Date Format"
            input={
              <div className="space-y-2">
                {[
                  { label: "10/31/2025", format: "m/d/Y" },
                  { label: "31/10/2025", format: "d/m/Y" },
                  { label: "31.10.2025", format: "d.m.Y" },
                  { label: "October 31, 2025", format: "F j, Y" },
                ].map((option) => (
                  <label
                    key={option.format}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="radio"
                      name="dateFormat"
                      value={option.format}
                      checked={formData.dateFormat === option.format}
                      onChange={handleChange}
                    />
                    {option.label}
                    <code className="border border-black px-2 py-0.5 text-xs bg-gray-100 rounded">
                      {option.format}
                    </code>
                  </label>
                ))}
              </div>
            }
          />

          {/* Time Format */}
          <SettingRow
            label="Time Format"
            input={
              <div className="space-y-2">
                {[
                  { label: "5:19 pm", format: "g:i a" },
                  { label: "5:19 PM", format: "g:i A" },
                  { label: "17:19", format: "H:i" },
                ].map((option) => (
                  <label
                    key={option.format}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="radio"
                      name="timeFormat"
                      value={option.format}
                      checked={formData.timeFormat === option.format}
                      onChange={handleChange}
                    />
                    {option.label}
                    <code className="border border-black px-2 py-0.5 text-xs bg-gray-100 rounded">
                      {option.format}
                    </code>
                  </label>
                ))}
                <p className="text-sm text-gray-500 mt-1">
                  Preview: 5:19 pm
                </p>
                <a href="#" className="text-blue-600 text-sm underline">
                  Documentation on date and time formatting
                </a>
              </div>
            }
          />

          {/* Week Starts On */}
          <SettingRow
            label="Week Starts On"
            input={
              <select
                name="weekStartsOn"
                value={formData.weekStartsOn}
                onChange={handleChange}
                className="w-full border border-black rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option>Sunday</option>
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
                <option>Saturday</option>
              </select>
            }
          />

          {/* Site Logo */}
          <SettingRow
            label="Site Logo"
            input={
              <div>
                {formData.logo && (
                  <img
                    src={formData.logo}
                    alt="Site Logo"
                    className="w-40 border border-black mb-2"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="block text-sm border border-black p-1 rounded"
                />
              </div>
            }
          />
        </form>
      </div>
    </div>
  );
};

const SettingRow = ({
  label,
  input,
}: {
  label: string;
  input: React.ReactNode;
}) => (
  <div className="flex items-start px-6 py-4 border-t border-gray-200">
    <label className="w-64 font-medium text-gray-700 pt-1">{label}</label>
    <div className="flex-1">{input}</div>
  </div>
);

export default GeneralSettingsPage;

