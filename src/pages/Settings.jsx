import React, { useState } from "react";

export default function Settings() {

  // 👉 Dynamic Data (replace with API later)
  const initialSettings = {
    appName: "",
    appVersion: "",
    supportEmail: "",
    phone: "",
    maintenanceMode: false,
    language: "",
    serviceRadius: 0
  };

  const languageOptions = [];
  const sidebarOptions = [
    "General",
    "Security",
    "Notifications",
    "Payment",
    "Location",
    "Backup",
    "Integrations"
  ];

  // State
  const [appName, setAppName] = useState(initialSettings.appName);
  const [appVersion, setAppVersion] = useState(initialSettings.appVersion);
  const [supportEmail, setSupportEmail] = useState(initialSettings.supportEmail);
  const [phone, setPhone] = useState(initialSettings.phone);
  const [maintenanceMode, setMaintenanceMode] = useState(initialSettings.maintenanceMode);
  const [language, setLanguage] = useState(initialSettings.language);
  const [serviceRadius, setServiceRadius] = useState(initialSettings.serviceRadius);

  const radiusLabel = `${serviceRadius} km`;

  return (
    <div className="p-6 bg-gradient-to-br from-green-50 via-green-50 to-green-100 min-h-screen">
      
      {/* Header */}
      <h2 className="text-2xl font-bold mb-1 text-gray-900">System Settings</h2>
      <p className="text-gray-600 mb-6">
        Manage app configuration, security, and preferences
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Sidebar Menu */}
        <nav className="bg-white rounded-2xl shadow-md p-4 sticky top-6 md:self-start transition hover:shadow-lg">
          <ul className="space-y-3 text-gray-700">
            {sidebarOptions.map((item, index) => (
              <li
                key={index}
                className={`cursor-pointer transition ${
                  index === 0
                    ? "font-semibold text-green-600 cursor-default select-none"
                    : "hover:text-green-600"
                }`}
              >
                {item}
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content */}
        <section className="md:col-span-3 bg-white rounded-2xl shadow-md p-6 transition hover:shadow-lg hover:scale-[1.01]">
          
          <h3 className="text-lg font-semibold mb-6 text-gray-900">
            General Settings
          </h3>

          {/* Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            
            <input
              type="text"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              placeholder="App Name"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
            />

            <input
              type="text"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              placeholder="App Version"
              value={appVersion}
              onChange={(e) => setAppVersion(e.target.value)}
            />

            <input
              type="email"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              placeholder="Support Email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
            />

            <input
              type="tel"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Maintenance Mode Toggle */}
          <div className="mb-6 flex items-center gap-3">
            <input
              id="maintenanceMode"
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="maintenanceMode" className="select-none cursor-pointer text-gray-700">
              Enable maintenance mode
            </label>
          </div>

          {/* Language and Service Radius */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            
            {/* Language */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-700">
                Language
              </label>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              >
                {languageOptions.map((lang, index) => (
                  <option key={index} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Service Radius */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-700">
                Service Radius (km):{" "}
                <span className="font-semibold">{radiusLabel}</span>
              </label>

              <input
                type="range"
                min={0}
                max={100}
                value={serviceRadius}
                onChange={(e) => setServiceRadius(Number(e.target.value))}
                className="w-full accent-green-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow transition">
              Save Changes
            </button>
          </div>

        </section>
      </div>
    </div>
  );
}