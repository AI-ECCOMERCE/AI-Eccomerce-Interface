export const AUTH_FEEDBACK_KEY = "admin-auth-feedback";

export type AuthFeedbackType = "success" | "error" | "info" | "warning";

export interface AuthFeedback {
  type: AuthFeedbackType;
  title: string;
  message: string;
}

export function setAuthFeedback(feedback: AuthFeedback) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(AUTH_FEEDBACK_KEY, JSON.stringify(feedback));
}

export function consumeAuthFeedback(): AuthFeedback | null {
  if (typeof window === "undefined") return null;

  const value = window.sessionStorage.getItem(AUTH_FEEDBACK_KEY);
  if (!value) return null;

  window.sessionStorage.removeItem(AUTH_FEEDBACK_KEY);

  try {
    return JSON.parse(value) as AuthFeedback;
  } catch {
    return null;
  }
}
