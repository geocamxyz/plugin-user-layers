# plugin-user-layers

A [geocam-viewer](https://github.com/geocamxyz/geocam-viewer) plugin for drawing
and editing **user planning layers** (point / line / polygon) against the
user-features ArcGIS FeatureServer.

> Developed inside the `geocam/manager` repo (under `components/`) for context
> and manual testing; intended to live in its own `geocamxyz/plugin-user-layers`
> repo, published to CDN like the other plugins.

## What it does

Under a single top-left Expand it renders a layer-design + feature-editing panel
(modelled on the manager-lite GeoJSON editor):

- **Layers** — add a blank layer or one from a template (Signs / Curb & gutter /
  Parcels), toggle visibility, see feature counts, select, delete.
- **Layer** — rename, switch geometry (point/line/polygon), pick a symbol colour,
  choose a label field.
- **Fields** — define typed attributes (text/integer/decimal/date) with optional
  coded-value lists.
- **Import GeoJSON** into the active layer.
- **Features** — list/select/delete features and edit the selected feature's
  field values.
- **Drawing** — panel-driven Esri `SketchViewModel` by the active geometry, plus
  **Ctrl/⌘-click on the map to quick-add** to the active layer.

It reads the FeatureServer metadata at `src`, adds a `FeatureLayer` per user
layer (colour renderer + labels applied live), and persists everything through
the service: layer definition via `addToDefinition` / `updateDefinition` /
`deleteFromDefinition`, features via `applyEdits`. Read-only users (no edit
capability) see the layers and lists but no editing controls.

Auth is by same-origin session cookie (the viewer is served from the same app);
the service also accepts `?token=` for cross-origin/embedded use.

**Pending:** geometry **vertex editing** (currently delete + redraw).

## Usage

It's a child of `<geocam-viewer>`, alongside the arcgis map/scene connector
(whose `.mapView` it reads). `src` is the FeatureServer root for a cell.

```html
<geocam-viewer>
  <geocam-viewer-arcgis-map src="/arcgis/rest/services/<service>/FeatureServer"></geocam-viewer-arcgis-map>
  <geocam-viewer-user-layers
    src="/arcgis/rest/services/cell_features/<cell-public-id>/FeatureServer"></geocam-viewer-user-layers>
</geocam-viewer>
```

Import map (CDN, like the other plugins):

```json
{ "user-layers": "https://cdn.jsdelivr.net/gh/geocamxyz/plugin-user-layers@<version>/dist/user-layers.js" }
```

## Develop / build

```bash
npm install
npm run build      # outputs dist/user-layers.js
npm run dev        # rebuild on change
```

### Manual testing against the local manager app

The viewer templates (`app/views/viewer/{map,scene}.html.erb`) pin
`user-layers` from CDN by default. To test this local build, temporarily point
that importmap entry at a local copy of `dist/user-layers.js` — e.g. copy it to
`public/` and set the import to `/user-layers.js`, then open a cell's viewer
(`/viewer/map/cell+<slug>`). Revert the importmap before committing.

## Contract notes (geocam-viewer plugin API)

- Registers `<geocam-viewer-user-layers>`; on connect, finds `closest('geocam-viewer')`,
  waits for `host.viewer` and the sibling connector's `.mapView`, then
  `viewer.plugin(instance)`.
- The plugin instance exposes `init(viewer)` and `destroy()` (same shape as
  `plugin-compass-needle` / `connector-arcgis-map`).

## TODO / future

- Geometry **vertex editing** for the selected feature (panel "Edit shape").
- Continuous draw mode for lines/polygons (currently one shape per arm).
- Optional `?token=` wiring for embedded/cross-origin hosts.
