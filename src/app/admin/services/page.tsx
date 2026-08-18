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

    const priceVal = editPrice[id] ? (parseInt(editPrice[id]) || 0) : undefined;
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

  async function compressImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const maxDim = 1000;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.75));
        };
        img.onerror = () => resolve(reader.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Error reading image"));
      reader.readAsDataURL(file);
    });
  }

  const handleFileUpload = async (id: string, file: File) => {
    try {
      const base64Data = await compressImage(file);
      if (id === "new") {
        setNewImage(base64Data);
        setMessage(`عکس خدمت جدید انتخاب شد: ${file.name}`);
      } else {
        setEditImage((prev) => ({ ...prev, [id]: base64Data }));
        setMessage(`عکس جدید انتخاب شد: ${file.name}`);
      }
    } catch {
      setMessage("خطا در پردازش تصویر");
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrice) {
      setMessage("نام و قیمت خدمت الزامی است");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          description: newDesc,
          price: parseInt(newPrice) || 0,
          image: newImage,
        }),
      });
      if (res.ok) {
        setMessage("خدمت جدید با موفقیت اضافه شد ✨");
        setNewName("");
        setNewDesc("");
        setNewPrice("");
        setNewImage("");
        loadServices();
      }
    } catch {
      setMessage("خطا در ایجاد خدمت");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id: string, name: string) => {
    if (!confirm(`آیا از حذف خدمت "${name}" اطمینان دارید؟`)) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/services", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setMessage(`خدمت "${name}" حذف شد`);
        loadServices();
      }
    } catch {
      setMessage("خطا در حذف خدمت");
    } finally {
      setLoading(false);
    }
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

        {/* Create New Service Form */}
        <div className="glass-card p-6 mb-8 border border-[var(--color-accent)]/30 bg-gradient-to-br from-[var(--color-accent)]/5 to-transparent">
          <h2 className="text-lg font-bold text-[var(--color-fg)] mb-4 flex items-center gap-2">
            <span>➕</span> افزودن خدمت / محصول جدید
          </h2>
          <form onSubmit={handleCreateService} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[var(--color-muted)] mb-1">نام خدمت جدید</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="مثال: اکستنشن مژه هیبرید"
                  className="input-field text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--color-muted)] mb-1">قیمت (تومان)</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="مثال: 1500000"
                  className="input-field text-sm"
                  dir="ltr"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-[var(--color-muted)] mb-1">توضیحات خدمت</label>
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="توضیحات کوتاه درباره خدمت..."
                className="input-field text-sm"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                placeholder="آدرس عکس یا آپلود از سیستم..."
                className="input-field text-xs sm:flex-1 font-mono"
                dir="ltr"
              />
              <label className="btn-ghost text-xs py-2.5 px-4 cursor-pointer whitespace-nowrap">
                📷 آپلود عکس خدمت جدید
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileUpload("new", f);
                  }}
                />
              </label>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full text-sm py-2.5 cursor-pointer">
              ✨ ثبت و انتشار خدمت جدید
            </button>
          </form>
        </div>

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

                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => handleUpdateService(service.id)}
                    disabled={loading}
                    className="btn-primary flex-1 text-sm py-2.5 cursor-pointer"
                  >
                    ذخیره تغییرات و آپدیت خدمت
                  </button>
                  <button
                    onClick={() => handleDeleteService(service.id, service.name)}
                    disabled={loading}
                    className="btn-ghost text-danger border-danger/30 hover:bg-danger/10 text-sm py-2.5 px-6 cursor-pointer"
                  >
                    🗑️ حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
