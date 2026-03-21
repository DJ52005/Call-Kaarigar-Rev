import React from "react";
import { MdSend, MdRemoveRedEye, MdEventNote, MdError } from "react-icons/md";

export default function Notifications() {

  // 👉 Dynamic Data (replace with API later)
  const stats = {
    totalSent: "",
    openRate: "",
    scheduled: "",
    failed: "",
    totalSentChange: "",
    openRateChange: "",
    scheduledInfo: "",
    failedRate: ""
  };

  const recentNotifications = [
    {
      icon: "⚡",
      text: "",
      time: ""
    },
    {
      icon: "📣",
      text: "",
      time: ""
    }
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-green-50 via-green-50 to-green-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-1 text-gray-900">Push Notifications</h2>
      <p className="text-gray-600 mb-6">
        Create and manage notifications for users and service providers
      </p>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 text-center shadow-md transition hover:scale-105 hover:shadow-lg">
          <MdSend className="text-green-600 text-3xl mx-auto mb-2" />
          <h4 className="text-gray-500 font-medium">Total Sent</h4>
          <p className="text-2xl font-bold text-gray-900">{stats.totalSent}</p>
          <span className="text-xs text-green-600">{stats.totalSentChange}</span>
        </div>

        <div className="bg-white rounded-2xl p-6 text-center shadow-md transition hover:scale-105 hover:shadow-lg">
          <MdRemoveRedEye className="text-green-600 text-3xl mx-auto mb-2" />
          <h4 className="text-gray-500 font-medium">Open Rate</h4>
          <p className="text-2xl font-bold text-gray-900">{stats.openRate}</p>
          <span className="text-xs text-green-600">{stats.openRateChange}</span>
        </div>

        <div className="bg-white rounded-2xl p-6 text-center shadow-md transition hover:scale-105 hover:shadow-lg">
          <MdEventNote className="text-green-600 text-3xl mx-auto mb-2" />
          <h4 className="text-gray-500 font-medium">Scheduled</h4>
          <p className="text-2xl font-bold text-gray-900">{stats.scheduled}</p>
          <span className="text-xs text-orange-600">{stats.scheduledInfo}</span>
        </div>

        <div className="bg-white rounded-2xl p-6 text-center shadow-md transition hover:scale-105 hover:shadow-lg">
          <MdError className="text-green-600 text-3xl mx-auto mb-2" />
          <h4 className="text-gray-500 font-medium">Failed</h4>
          <p className="text-2xl font-bold text-gray-900">{stats.failed}</p>
          <span className="text-xs text-red-600">{stats.failedRate}</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Compose Notification */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-md transition hover:scale-[1.01] hover:shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Compose Notification
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <select className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-200">
              <option value="">All Users</option>
              <option value="">Service Providers</option>
            </select>

            <select className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-200">
              <option value="">All Cities</option>
            </select>
          </div>

          <input
            className="w-full border rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-green-200"
            placeholder="Enter notification title..."
          />

          <textarea
            className="w-full border rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-green-200"
            placeholder="Enter your notification message..."
            rows={4}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <select className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-200">
              <option value="">Default Icon</option>
            </select>

            <select className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-200">
              <option value="">Normal</option>
            </select>
          </div>

          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-lg transition w-full md:w-auto mt-2 shadow">
            + New Notification
          </button>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white rounded-2xl p-6 shadow-md transition hover:scale-[1.01] hover:shadow-lg h-full min-h-[320px]">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Recent Notifications
          </h3>

          <ul className="text-sm text-gray-800 space-y-3">
            {recentNotifications.map((item, index) => (
              <li key={index} className="flex items-center gap-2 hover:bg-green-50 p-2 rounded-lg transition hover:shadow-sm">
                <span className="text-xl">{item.icon}</span>
                <span>{item.text}</span>
                <span className="text-xs text-gray-500 ml-auto">{item.time}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}