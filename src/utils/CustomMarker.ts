/**
 * CustomMarker.ts
 * Implements custom Google Maps markers using HTML overlays.
 * Supports User Location, Selected Location, and Property Price Badge markers.
 */

let CustomOverlayClass: any = null;

/**
 * Returns a dynamically constructed Google Maps OverlayView class.
 * This prevents referencing `google.maps` before the API script is fully loaded.
 */
function getCustomOverlayClass() {
  if (CustomOverlayClass) return CustomOverlayClass;

  if (typeof google === 'undefined' || !google.maps) {
    throw new Error('Google Maps API is not loaded yet.');
  }

  CustomOverlayClass = class extends google.maps.OverlayView {
    private position: google.maps.LatLng;
    private content: HTMLElement;

    constructor(position: google.maps.LatLng, content: HTMLElement, map: google.maps.Map) {
      super();
      this.position = position;
      this.content = content;
      (this as any).setMap(map);
    }

    onAdd() {
      const panes = (this as any).getPanes();
      if (panes) {
        panes.overlayMouseTarget.appendChild(this.content);
      }
    }

    draw() {
      const projection = (this as any).getProjection();
      if (!projection) return;
      const point = projection.fromLatLngToDivPixel(this.position);
      if (point) {
        this.content.style.position = 'absolute';
        this.content.style.left = `${point.x}px`;
        this.content.style.top = `${point.y}px`;
      }
    }

    onRemove() {
      if (this.content.parentNode) {
        this.content.parentNode.removeChild(this.content);
      }
      (this as any).setMap(null);
    }

    // Custom helper to update position dynamically if needed
    updatePosition(newPosition: google.maps.LatLng) {
      this.position = newPosition;
      (this as any).draw();
    }
  };

  return CustomOverlayClass;
}

export interface CustomMarkerOptions {
  map: google.maps.Map;
  position: { lat: number; lng: number };
  type: 'user' | 'selected' | 'property';
  price?: number | string;
  isSelected?: boolean;
  onClick?: () => void;
  title?: string;
}

/**
 * Creates and returns a custom HTML marker overlay on the Google Map
 */
export function createCustomMarker(options: CustomMarkerOptions) {
  const { map, position, type, price, isSelected, onClick } = options;

  const latLng = new google.maps.LatLng(position.lat, position.lng);
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.zIndex = isSelected ? '100' : '10';

  // Inside container, we render standard Tailwind styled HTML
  if (type === 'user') {
    container.innerHTML = `
      <div class="relative flex items-center justify-center w-8 h-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer">
        <span class="absolute inline-flex w-full h-full rounded-full bg-[#0A2540] opacity-75 animate-ping"></span>
        <div class="relative w-4 h-4 bg-[#0A2540] border-2 border-white rounded-full shadow-md"></div>
      </div>
    `;
  } else if (type === 'selected') {
    container.innerHTML = `
      <div class="flex items-center justify-center bg-[#0A2540] text-white rounded-full p-2.5 border-2 border-white shadow-lg w-10 h-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-200 hover:scale-110">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin">
          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
    `;
  } else {
    // Property Price Badge
    let parsedPrice = 0;
    if (typeof price === 'number') {
      parsedPrice = price;
    } else if (typeof price === 'string') {
      parsedPrice = parseInt(price.replace(/[^\d]/g, ''), 10) || 0;
    }

    const priceLabel = parsedPrice > 0 
      ? `₹${(parsedPrice / 1000).toFixed(0)}K`
      : '₹0';

    const themeClass = isSelected
      ? 'bg-primary border-2 border-white scale-110 z-50 shadow-primary/50 shadow-xl font-extrabold ring-4 ring-primary/10 text-white'
      : 'bg-[#0A2540] border border-slate-200 hover:bg-slate-50 hover:scale-105 shadow-md font-semibold text-white';

    container.innerHTML = `
      <div class="px-3 py-1.5 rounded-full whitespace-nowrap text-xs text-center -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${themeClass}">
        ${priceLabel}
      </div>
    `;
  }

  if (onClick) {
    container.addEventListener('click', (e) => {
      e.stopPropagation();
      onClick();
    });
  }

  const OverlayClass = getCustomOverlayClass();
  return new OverlayClass(latLng, container, map);
}
