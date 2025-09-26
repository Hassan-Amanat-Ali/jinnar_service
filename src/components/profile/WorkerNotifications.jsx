import React from "react";

const WorkerNotifications = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Worker Notifications
      </h2>
      <p className="text-gray-600">
        This is the worker-specific notifications component. It will manage
        worker-related notification preferences.
      </p>
      {/* Add worker-specific notification settings here */}
    </div>
  );
};

export default WorkerNotifications;
