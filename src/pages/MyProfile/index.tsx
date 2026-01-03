import React, { useState } from "react";
import PersonalInfoForm from "../../components/MyProfile/MyInfo";
import ChangePasswordForm from "../../components/MyProfile/ChangePasswordForm";

export default function Page() {
  const [activeTab, setActiveTab] = useState<"info" | "changePassword">("info");

  return (
    <div className="flex flex-1 flex-col p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Thông tin của tôi</h1>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Tabs Header */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("info")}
              className={`flex-1 py-4 px-6 text-center font-medium text-sm transition-all duration-200 focus:outline-none ${activeTab === "info"
                  ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
            >
              Thông tin cá nhân
            </button>
            <button
              onClick={() => setActiveTab("changePassword")}
              className={`flex-1 py-4 px-6 text-center font-medium text-sm transition-all duration-200 focus:outline-none ${activeTab === "changePassword"
                  ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
            >
              Đổi mật khẩu
            </button>
          </div>

          {/* Tab Content Wrapper */}
          <div className="p-6 sm:p-8">
            {activeTab === "info" ? <PersonalInfoForm /> : <ChangePasswordForm />}
          </div>
        </div>
      </div>
    </div>
  );
}