import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export default async function DashBoard() {
  const cookieStore = cookies();
  const cookieHeader = (await cookieStore)
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
  console.log(cookieStore);
  console.log(cookieHeader);

  if (!cookieHeader.includes("jwt")) {
    redirect("/login");
  }

  console.log(cookieHeader);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
    headers: {
      Cookie: cookieHeader,
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-0">
      <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
      <p className="text-lg">Welcome to your dashboard!</p>
    </div>
  );
}
