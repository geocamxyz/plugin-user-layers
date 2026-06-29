import { userLayers } from "./lib/user-layers.js";

// <geocam-viewer-user-layers src=".../cell_features/<cell public_id>/FeatureServer">
//
// A geocam-viewer plugin that draws and (where permitted) edits user planning
// layers against the user-features ArcGIS FeatureServer. Mirrors the established
// plugin contract: it lives inside <geocam-viewer>, waits for the host viewer
// and the Esri view (exposed as `.mapView` on the sibling arcgis map/scene
// connector once linked), then registers itself via viewer.plugin().
export class GeocamViewerUserLayers extends HTMLElement {
  constructor() {
    super();
    this.plugin = null;
    this.viewer = null;
  }

  connectedCallback() {
    const host = this.closest("geocam-viewer");
    if (!host) {
      console.error("GeocamViewerUserLayers must be a child of GeocamViewer");
      return;
    }

    const src = this.getAttribute("src");
    if (!src) {
      console.warn("No src attribute on geocam-viewer-user-layers");
      return;
    }

    // The arcgis map/scene connector publishes the Esri view as `.mapView` once
    // the base view has linked. Poll for both that and the host viewer.
    const attach = () => {
      const viewer = host.viewer;
      const connector = host.querySelector(
        "geocam-viewer-arcgis-map, geocam-viewer-arcgis-scene"
      );
      const mapView = connector && connector.mapView;

      if (viewer && typeof viewer.plugin === "function" && mapView) {
        if (this.plugin) return;
        this.viewer = viewer;
        this.plugin = new userLayers({ mapView, src });
        this.viewer.plugin(this.plugin);
      } else {
        setTimeout(attach, 100);
      }
    };

    attach();
  }

  disconnectedCallback() {
    if (this.plugin && typeof this.plugin.destroy === "function") {
      this.plugin.destroy();
    }
    this.plugin = null;
    this.viewer = null;
  }
}

window.customElements.define("geocam-viewer-user-layers", GeocamViewerUserLayers);
