declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export const trackMetaEvent = (
  event: string,
  params: Record<string, any> = {}
) => {
   if (typeof window.fbq !== "function") {
        console.log("Pixel not ready:", event);
        return;
    }
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", event, params);
  }
};