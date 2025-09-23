"use client";

import { authStore } from "@/lib/store/authStore";
import React, { useEffect } from "react";

type ClientWrapperProps = {
  children: React.ReactNode;
};

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const setLoggedIn = authStore((state) => state.setLoggedIn);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            cache: "no-store",
          }
        );

        setLoggedIn(res.ok);
      } catch {
        setLoggedIn(false);
      }
    };

    checkLogin();
  }, [setLoggedIn]);

  return <>{children}</>;
}
