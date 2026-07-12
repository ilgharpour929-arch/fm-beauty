"use client";

export function FloatingOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(212,163,115,0.12) 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "orbFloat 25s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-1/3 -left-32 w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(107,54,112,0.1) 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "orbFloat 20s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[350px] h-[350px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(212,163,115,0.08) 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "orbFloat 30s ease-in-out infinite",
          animationDelay: "-5s",
        }}
      />
    </div>
  );
}
