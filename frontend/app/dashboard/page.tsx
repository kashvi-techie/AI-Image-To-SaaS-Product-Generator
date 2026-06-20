"use client";

import { useAuth } from "@/components/AuthProvider";
import { motion } from "framer-motion";
import { Loader2, LogOut, Sparkles, Image, Folder } from "lucide-react";
import { luxeSerif } from "@/lib/fonts/luxe-serif";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-amber-50 dark:from-[#0a0a0a] dark:via-[#1a1a1a] dark:to-[#0a0a0a]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 dark:from-[#0a0a0a] dark:via-[#1a1a1a] dark:to-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-amber-200/50 dark:border-amber-900/30 bg-white/50 dark:bg-[#1a1a1a]/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className={`${luxeSerif.className} text-2xl font-bold text-amber-950 dark:text-amber-100`}>
              LuxeGen
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {user.email}
              </p>
            </div>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-white dark:bg-[#2a2a2a] border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-[#3a3a3a] transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className={`${luxeSerif.className} text-4xl font-bold text-amber-950 dark:text-amber-100 mb-2`}>
            Welcome back!
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Ready to create something beautiful?
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-xl rounded-2xl p-6 border border-amber-200/50 dark:border-amber-900/30"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Generations</p>
                <p className="text-3xl font-bold text-amber-950 dark:text-amber-100">0</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-xl rounded-2xl p-6 border border-amber-200/50 dark:border-amber-900/30"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                <Folder className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Projects Created</p>
                <p className="text-3xl font-bold text-amber-950 dark:text-amber-100">0</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-xl rounded-2xl p-6 border border-amber-200/50 dark:border-amber-900/30"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                <Image className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Images Processed</p>
                <p className="text-3xl font-bold text-amber-950 dark:text-amber-100">0</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-xl rounded-2xl p-8 border border-amber-200/50 dark:border-amber-900/30"
        >
          <h3 className={`${luxeSerif.className} text-2xl font-bold text-amber-950 dark:text-amber-100 mb-6`}>
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/"
              className="group p-6 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl border-2 border-amber-200/50 dark:border-amber-800/50 hover:border-amber-300 dark:hover:border-amber-700 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-200 dark:bg-amber-800/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-amber-700 dark:text-amber-300" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-amber-950 dark:text-amber-100">
                    Generate from Prompt
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Create UI from text description
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/?mode=image"
              className="group p-6 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl border-2 border-amber-200/50 dark:border-amber-800/50 hover:border-amber-300 dark:hover:border-amber-700 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-200 dark:bg-amber-800/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Image className="w-6 h-6 text-amber-700 dark:text-amber-300" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-amber-950 dark:text-amber-100">
                    Generate from Image
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Convert image to React component
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
