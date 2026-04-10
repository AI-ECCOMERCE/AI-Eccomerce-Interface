const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface AdminProbeResult {
  isAdmin: boolean;
  reason?: string;
}

function getBearerToken(accessToken?: string | null) {
  if (!accessToken) {
    return null;
  }

  return `Bearer ${accessToken}`;
}

export async function verifyAdminAccess(accessToken?: string | null): Promise<AdminProbeResult> {
  const authorization = getBearerToken(accessToken);

  if (!authorization) {
    return { isAdmin: false, reason: "Sesi admin tidak ditemukan. Silakan login kembali." };
  }

  try {
    const response = await fetch(`${API_URL}/api/dashboard`, {
      headers: {
        Authorization: authorization,
      },
      cache: "no-store",
    });

    if (response.ok) {
      return { isAdmin: true };
    }

    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
      ? await response.json()
      : null;

    if (response.status === 403) {
      return {
        isAdmin: false,
        reason: payload?.error || "Akun ini tidak memiliki akses admin.",
      };
    }

    if (response.status === 401) {
      return {
        isAdmin: false,
        reason: payload?.error || "Sesi admin berakhir. Silakan login kembali.",
      };
    }

    return {
      isAdmin: false,
      reason: payload?.error || "Gagal memverifikasi akses admin.",
    };
  } catch {
    return {
      isAdmin: false,
      reason: "Gagal memverifikasi akses admin.",
    };
  }
}
