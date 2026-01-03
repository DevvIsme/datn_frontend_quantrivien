import React from "react";
import Header from "../components/Header";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased">
      <Header />
      <div className="flex flex-1 justify-center items-center">
        <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
