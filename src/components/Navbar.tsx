import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { signOut, User } from "firebase/auth";
import { Menu, X, LogOut, Cuboid } from "lucide-react";
import Image from "next/image";
import { auth } from "@/lib/firebase";
import GoogleAuth from "./googleAuth";

export default function Navbar({ user }: { user: User | null }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSignOut = () => signOut(auth);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-2 bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 rounded-xl shadow-lg group-hover:shadow-purple-500/20"
            >
              <Cuboid className="w-6 h-6 text-white" />
            </motion.div>
            <div className="flex flex-col">
              <motion.h1 className="text-xl font-bold text-gray-800">
                3D Viewer
              </motion.h1>
              <span className="text-xs text-gray-500">360° Panorama</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/gallery"
              className="text-gray-600 hover:text-purple-500 transition-colors font-medium"
            >
              Gallery
            </Link>
            {user ? (
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200"
                >
                  <Image
                    src={user.photoURL || ""}
                    alt="Profile"
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span className="text-sm text-gray-700">
                    {user.displayName}
                  </span>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Sign Out</span>
                </motion.button>
              </div>
            ) : (
              <GoogleAuth />
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4"
            >
              <div className="flex flex-col gap-4 py-4 px-2">
                <Link
                  href="/gallery"
                  className="text-gray-600 hover:text-purple-500 transition-colors font-medium"
                >
                  Gallery
                </Link>
                {user ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                      <Image
                        src={user.photoURL || ""}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <span className="text-gray-700 font-medium">
                        {user.displayName}
                      </span>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <GoogleAuth />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
