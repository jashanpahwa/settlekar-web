/**
 * googleMapsLoader.ts
 * Dynamically loads the Google Maps JavaScript API with Places library.
 * Prevents multiple script injections.
 */

let isScriptLoading = false;
let callbacks: (() => void)[] = [];

export function loadGoogleMaps(apiKey: string, callback: () => void): () => void {
  // If already loaded, trigger callback immediately
  if (typeof window !== 'undefined' && (window as any).google && (window as any).google.maps) {
    callback();
    return () => {};
  }

  callbacks.push(callback);

  if (isScriptLoading) {
    return () => {
      callbacks = callbacks.filter((cb) => cb !== callback);
    };
  }

  isScriptLoading = true;

  const scriptId = 'google-maps-api-script';
  let script = document.getElementById(scriptId) as HTMLScriptElement;

  if (!script) {
    script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      callbacks.forEach((cb) => cb());
      callbacks = [];
      isScriptLoading = false;
    };

    script.onerror = () => {
      console.error('Failed to load Google Maps script.');
      isScriptLoading = false;
    };

    document.head.appendChild(script);
  }

  return () => {
    callbacks = callbacks.filter((cb) => cb !== callback);
  };
}
