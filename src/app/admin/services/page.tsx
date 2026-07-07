"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminServicesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);
  const [editPrice, setEditPrice] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const user = session?.user as any;

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (status === "authenticated" && user?.role !== "ADMIN") router.push("/");
  }, [status, user, router]);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetch("/api/admin/services")
        .then((r) => r.json())
        .then(setServices)
        .catch(() => {});
    }
  }, [user]);

  const handleUpdatePrice = async (id: string) => {
    const newPrice = parseInt(editPrice[id]);
    if (!newPrice || isNaN(newPrice)) return;

    try {
      const res = await fetch("/api/admin/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, price: newPrice }),
      });
      if (res.ok) {
        setMessage("قیمت با موفقیت به‌روزرسانی شد (فقط برای رزروهای جدید)");
        setServices(services.map((s) => s.id === id ? { ...s, price: newPrice } : s));
      }
    } catch {}
  };

  if (status === "loading") return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-cream/50">در حال بارگذاری...</p></div>;
  if (user?.role !== "ADMIN") return null;

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-cream mb-6">مدیریت خدمات و قیمت‌ها</h1>
        {message && <p className="text-sm text-success mb-4 animate-fade-in">{message}</p>}

        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.id} className="glass-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-cream">{service.name}</h3>
                  <p className="text-xs text-cream/50 mt-1">{service.description}</p>
                </div>
                <div className="text-left">
                  <div className="text-sm text-cream/50">قیمت فعلی</div>
                  <div className="text-gold font-bold">{service.price.toLocaleString("fa-IR")} تومان</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-3">
                <input
                  type="number"
                  value={editPrice[service.id] || ""}
                  onChange={(e) => setEditPrice({ ...editPrice, [service.id]: e.target.value })}
                  placeholder="قیمت جدید..."
                  className="input-field flex-1"
                  dir="ltr"
                />
                <button
                  onClick={() => handleUpdatePrice(service.id)}
                  className="btn-primary text-sm py-2"
                >
                  بروزرسانی قیمت
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
