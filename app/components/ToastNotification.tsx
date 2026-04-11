"use client";


interface ToastNotificationProps {
  message: string;
  visible: boolean;
}

export default function ToastNotification({
  message,
  visible,
}: ToastNotificationProps) {
  return (
    <div
      id="toast"
      className={`fixed top-24 right-6 z-50 transform transition-transform duration-300 ${
        visible ? "translate-x-0" : "translate-x-[120%]"
      }`}
    >
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-4 flex items-center gap-3 min-w-[280px]">
        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
          <i className="ph-duotone ph-check-circle text-xl text-green-600"></i>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Ditambahkan!</p>
          <p id="toast-message" className="text-xs text-slate-500">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
