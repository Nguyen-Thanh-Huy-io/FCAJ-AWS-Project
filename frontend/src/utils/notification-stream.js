export function openNotificationStream() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
  const base = apiBaseUrl.replace(/\/$/, "");

  return new EventSource(`${base}/notifications/stream`, {
    withCredentials: true
  });
}
