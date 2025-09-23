"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Map = dynamic(() => import("@/components/map/Map"), {
  loading: () => <p>A map is loading</p>,
  ssr: false,
});

export default function DashBoard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        if (!res.ok) {
          router.push("/login");
          return;
        }

        const profileData = await res.json();
        setProfile(profileData);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-0">
      <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
      <p className="text-lg">Welcome to Van-view!</p>
      <Map position={[49.2827, -123.1207]} zoom={13} />{" "}
    </div>
  );
}
