"use client";

import { useAdminNavigation } from "./AdminNavigationProvider";

export default function AdminTopProgressBar() {
  const { isNavigating, progress } = useAdminNavigation();

  return (
    <div
      aria-hidden="true"
      className={`admin-top-progress ${isNavigating ? "admin-top-progress--visible" : ""}`}
    >
      <span
        className="admin-top-progress__bar"
        style={{ transform: `scaleX(${Math.max(progress, 0) / 100})` }}
      />
    </div>
  );
}
