"use client";
import { logout } from "@/lib/api";
import { authStore } from "@/lib/store/authStore";
import Cookies from "js-cookie";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Navbar() {  
  const isLogin = authStore((state) => state.isLogin);
  const setLoggedIn = authStore((state) => state.setLoggedIn);
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false)
  
  useEffect(() => {
    const token = Cookies.get("jwt");
      setLoggedIn(!!token);
  }, []);    

  const handleLogout = async () => {
    Cookies.remove("jwt");
    setLoggedIn(false);
    await logout()
    router.push('/login');
  }

  const AuthLinks = () => {
    return <>
      <Link href="/dashboard" className="hover:text-blue-500 transition">Dashboard</Link>
      <Link href="/profile" className="hover:text-blue-500 transition">Profile</Link>
      <button onClick={handleLogout} className="hover:text-blue-500 transition">Logout</button>
    </>
  }
  
  const GuestLinks = () => {
    return <>
      <Link href="/register" className="hover:text-blue-500 transition">Register</Link>
      <Link href="/login" className="hover:text-blue-500 transition">Login</Link>
    </>
  }

  
  return <nav className="bg-white shadow-md px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-800">
          VanView
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link href="/" className="text-gray-700 hover:text-gray-600">
            Home
          </Link>
          {isLogin ? <AuthLinks /> : <GuestLinks />}
      </div>
      {/* mobile Menu */}
      <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-800 focus:outline-none">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>

    {isOpen && (
        <div className="md:hidden mt-2 space-y-2 pb-4">
          <Link href="/" className="block text-gray-700 hover:text-gray-600">
            Home
          </Link>
          {isLogin ? (
            <>
              <Link
                href="/dash board"
                className="block text-gray-700 hover:text-gray-600"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="block text-gray-700 hover:text-gray-600"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block text-gray-700 hover:text-gray-600 focus:outline-none"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block text-gray-700 hover:text-gray-600"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block text-gray-700 hover:text-gray-600"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
  </nav>
}       
