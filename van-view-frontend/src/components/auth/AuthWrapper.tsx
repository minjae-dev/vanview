import React from "react";

type AuthWrapperProps = {
  children: React.ReactNode;
};

export default function AuthWrapper({ children }: AuthWrapperProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        {children}
      </div>
    </div>
  );
}
