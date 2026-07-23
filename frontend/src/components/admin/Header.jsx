"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Home, Users, Building, Contact, Paperclip } from "lucide-react";
import { useState } from "react";
import { customFetch } from "@/utils/customFetch";

const Header = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await customFetch.get("/auth/logout");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 text-white py-4 min-h-[100vh] border-r-1 border-gray-700">
      <div className="container mx-auto ">
        <div className="flex flex-col justify-between gap-12">
          <div className="text-xl font-bold">Admin Dashboard</div>
          <nav>
            <ul className="flex flex-col space-y-8">
              <li>
                <Link
                  href="/"
                  className="flex items-center gap-1 hover:text-slate-300 transition-colors"
                >
                  <Home size={18} />
                  <span>Client Home</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="flex items-center gap-1 hover:text-slate-300 transition-colors"
                >
                  <Home size={18} />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/skills"
                  className="flex items-center gap-1 hover:text-slate-300 transition-colors"
                >
                  <Users size={18} />
                  <span>Skills</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/techstack"
                  className="flex items-center gap-1 hover:text-slate-300 transition-colors"
                >
                  <Users size={18} />
                  <span>Tech Stack</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/experience"
                  className="flex items-center gap-1 hover:text-slate-300 transition-colors"
                >
                  <Building size={18} />
                  <span>Experience</span>
                </Link>
              </li>

              <li>
                <Link
                  href="/admin/projects"
                  className="flex items-center gap-1 hover:text-slate-300 transition-colors"
                >
                  <Building size={18} />
                  <span>Projects</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/blogs"
                  className="flex items-center gap-1 hover:text-slate-300 transition-colors"
                >
                  <Paperclip size={18} />
                  <span>Blogs</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/enquiry"
                  className="flex items-center gap-1 hover:text-slate-300 transition-colors"
                >
                  <Contact size={18} />
                  <span>Enquiry</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-1 hover:text-slate-300 transition-colors"
                >
                  <LogOut size={18} />
                  <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
