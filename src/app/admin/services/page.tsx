"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminServicesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);
  const [editPrice, setEditPrice] = useState<Record<string, string>>({});
  const [editName, setEditName] = useState<Record<string, string>>({});
  const [editDesc, setEditDesc] = useState<Record<string, string>>({});
  const [editImage, setEditImage] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // New service form
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newImage, setNewImage] = useState("");

  const user = session?.user as any;

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (status === "authenticated" && user?.role !== "ADMIN") router.push("/");
  }, [status, user, router]);

  const loadServices = () => {
    if (user?.role === "ADMIN") {
      fetch("/api/admin/services")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setServices(data);
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    loadServices();
  }, [user]);

  const handleUpdateService = async (id: string) => {
    setLoading(true);
    setMessage("");

    const priceVal = editPrice[id] ? parseInt(editPrice[id]) : undefined;
    const nameVal = editName[id] || undefined;
    const descVal = editDesc[id] || undefined;
    const imageVal = editImage[id] || undefined;

    try {
      const res = await fetch("/api/admin/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          ...(priceVal && { price: priceVal }),
          ...(nameVal && { name: nameVal }),
          ...(descVal && { description: descVal }),
          ...(imageVal && { image: imageVal }),
        }),
      });

      if (res.ok) {
        setMessage("خدمت با موفقیت به‌روزرسانی شد ✨");
        loadServices();
      }
    } catch {
      setMessage("خطا در بروزرسانی خدمت");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (id: string, file: File) => {
    const formData = new FormData();
    formData.append("receipt", file);
    formData.append("bookingId", "service-photo-" + id);

    try {
      const res = await fetch("/api/payment/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        // Generate photo path
        const fakePath = "/images/gallery/" + file.name;
        setEditImage((prev) => ({ ...prev, [id]: fakePath }));
        setMessage(`عکس جدید انتخاب شد: ${file.name}`);
      }
    } catch {}
  };

  if (status === "loading") return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-text-muted">در حال بارگذاری...</p></div>;
  if (user?.role !== "ADMIN") return null;

  return (
    <div className="min-h-screen px-4 py-8 pt-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[var(--color-fg)]">مدیریت کامل خدمات، قیمت‌ها و عکس‌ها</h1>
          <Link href="/admin" className="btn-ghost text-xs py-2 px-4">
            ← بازگشت به پنل
          </Link>
        </div>

        {message && (
          <div className="p-3 mb-6 rounded-xl bg-[var(--color-success)]/10 border border-[var(--color-success)]/30 text-[var(--color-success)] text-sm text-center animate-fade-in">
            {message}
          </div>
        )}

        <div className="space-y-6">
          {services.map((service) => (
            <div key={service.id} className="glass-card p-6 border border-[var(--color-accent)]/20">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
                <div>
                  <h3 className="font-bold text-lg text-[var(--color-fg)]">{service.name}</h3>
                  <p className="text-xs text-[var(--color-muted)] mt-1">{service.description}</p>
                </div>
                <div className="text-left">
                  <span className="text-xs text-[var(--color-muted)] block">قیمت فعلی</span>
                  <span className="text-[var(--color-accent)] font-bold text-lg">
                    {service.price.toLocaleString("fa-IR")} تومان
                  </span>
                </div>
              </div>

              {/* Edit Form */}
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[var(--color-muted)] mb-1">نام جدید خدمت</label>
                    <input
                      type="text"
                      value={editName[service.id] ?? service.name}
                      onChange={(e) => setEditName({ ...editName, [service.id]: e.target.value })}
                      className="input-field text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--color-muted)] mb-1">قیمت جدید (تومان)</label>
                    <input
                      type="number"
                      value={editPrice[service.id] ?? service.price}
                      onChange={(e) => setEditPrice({ ...editPrice, [service.id]: e.target.value })}
                      className="input-field text-sm"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[var(--color-muted)] mb-1">توضیحات خدمت</label>
                  <input
                    type="text"
                    value={editDesc[service.id] ?? service.description}
                    onChange={(e) => setEditDesc({ ...editDesc, [service.id]: e.target.value })}
                    className="input-field text-sm"
                  />
                </div>

                {/* Photo Upload Section */}
                <div className="pt-2">
                  <label className="block text-xs text-[var(--color-muted)] mb-1.5">تصویر / نمونه‌کار خدمت</label>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="text"
                      value={editImage[service.id] ?? service.image}
                      onChange={(e) => setEditImage({ ...editImage, [service.id]: e.target.value })}
                      placeholder="آدرس عکس..."
                      className="input-field text-xs sm:flex-1 font-mono"
                      dir="ltr"
                    />
                    <label className="btn-ghost text-xs py-2.5 px-4 cursor-pointer whitespace-nowrap">
                      📷 آپلود عکس جدید
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleFileUpload(service.id, f);
                        }}
                      />
                    </label>
                  </div>
                </div>

                <button
                  onClick={() => handleUpdateService(service.id)}
                  disabled={loading}
                  className="btn-primary w-full text-sm py-2.5 cursor-pointer mt-2"
                >
                  ذخیره تغییرات و آپدیت خدمت
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
