"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const user = session?.user as any;

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (status === "authenticated" && user?.role !== "ADMIN") router.push("/");
  }, [status, user, router]);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetch("/api/admin/users")
        .then((r) => r.json())
        .then(setUsers)
        .catch(() => {});
    }
  }, [user]);

  if (status === "loading") return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-cream/50">در حال بارگذاری...</p></div>;
  if (user?.role !== "ADMIN") return null;

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-cream mb-6">کاربران ثبت‌نام شده</h1>

        <div className="glass-card p-4 md:p-0 md:overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-cream/50 text-right">
                  <th className="p-4 font-medium">نام</th>
                  <th className="p-4 font-medium">نام خانوادگی</th>
                  <th className="p-4 font-medium">شماره تماس</th>
                  <th className="p-4 font-medium">نقش</th>
                  <th className="p-4 font-medium">تاریخ ثبت‌نام</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-cream">{u.firstName}</td>
                    <td className="p-4 text-cream">{u.lastName}</td>
                    <td className="p-4 text-cream/70" dir="ltr">{u.phone}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${u.role === "ADMIN" ? "bg-gold/10 text-gold" : "bg-cream/10 text-cream/50"}`}>
                        {u.role === "ADMIN" ? "مدیر" : "مشتری"}
                      </span>
                    </td>
                    <td className="p-4 text-cream/50">{new Date(u.createdAt).toLocaleDateString("fa-IR")}</td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-cream/50">هیچ کاربری یافت نشد</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {users.length === 0 && (
              <p className="p-4 text-center text-cream/50">هیچ کاربری یافت نشد</p>
            )}
            {users.map((u) => (
              <div key={u.id} className="glass-card-dark p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="font-medium text-cream">{u.firstName} {u.lastName}</div>
                  <span className={`text-xs px-2 py-1 rounded-full ${u.role === "ADMIN" ? "bg-gold/10 text-gold" : "bg-cream/10 text-cream/50"}`}>
                    {u.role === "ADMIN" ? "مدیر" : "مشتری"}
                  </span>
                </div>
                <div className="text-xs text-cream/50" dir="ltr">{u.phone}</div>
                <div className="text-xs text-cream/30">{new Date(u.createdAt).toLocaleDateString("fa-IR")}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
