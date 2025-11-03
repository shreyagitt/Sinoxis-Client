import React from "react";

const NotificationFilter = ({ filter, setFilter }) => {
  const tabs = ["All", "Automatic", "Manual"];

  return (
    <div className="flex gap-3 border-b border-gray-200 pb-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setFilter(tab)}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            filter === tab
              ? "bg-green-100 text-green-700"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default NotificationFilter;
