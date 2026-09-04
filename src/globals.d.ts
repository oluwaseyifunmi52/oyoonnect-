/// <reference types="@types/google.maps" />

interface Window {
  initMapCallback: () => void
  google: typeof google
}

// CSS Modules type declarations
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.module.css' {
  const content: { [className: string]: string };
  export default content;
}