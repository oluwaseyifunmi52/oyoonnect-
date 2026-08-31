/// <reference types="@types/google.maps" />

interface Window {
  initMapCallback: () => void
  google: typeof google
}