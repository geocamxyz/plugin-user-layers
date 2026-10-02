import { loadModules } from "esri-loader";

// ---------------------------------------------------------------------------
// Small DOM helpers
// ---------------------------------------------------------------------------
const node = (name, attrs = {}, html) => {
  const el = document.createElement(name);
  for (const k in attrs) {
    if (k === "class") el.className = attrs[k];
    else if (k.startsWith("on") && typeof attrs[k] === "function") el.addEventListener(k.slice(2), attrs[k]);
    else if (attrs[k] != null) el.setAttribute(k, attrs[k]);
  }
  if (html != null) el.innerHTML = html;
  return el;
};

const injectStyle = (id, rules) => {
  if (!document.getElementById(id)) {
    document.getElementsByTagName("head")[0].prepend(node("STYLE", { id, type: "text/css" }, rules));
  }
};

const GEOMS = [
  { v: "point", label: "Point", esri: "esriGeometryPoint" },
  { v: "polyline", label: "Line", esri: "esriGeometryPolyline" },
  { v: "polygon", label: "Polygon", esri: "esriGeometryPolygon" },
];
const ESRI_TO_CANON = { esriGeometryPoint: "point", esriGeometryPolyline: "polyline", esriGeometryPolygon: "polygon" };

// This plugin only draws the cell's user-defined layers, which the consolidated
// FeatureServer allocates in the 100–999 band (UserLayer#layer_index + 100). The
// fixed skeleton layers (0 shots, 1 features, 2 cell geometry, 10 original
// positions) are already drawn by the sibling arcgis-map connector, so adding
// them here duplicates every feature on the map (see geocam-pm #245). Workflow-
// revision layers (>= 10000) aren't served, but the upper bound guards anyway.
const USER_LAYER_MIN = 100;
const USER_LAYER_MAX = 10000; // exclusive
const isUserLayer = (l) => l.id >= USER_LAYER_MIN && l.id < USER_LAYER_MAX;
const SKETCH_TOOL = { point: "point", polyline: "polyline", polygon: "polygon" };
const COLORS = ["#dc2626", "#d97706", "#059669", "#0284c7", "#7c3aed", "#0e0f06"];
const FIELD_TYPES = [
  { v: "text", label: "Text" }, { v: "integer", label: "Integer" },
  { v: "decimal", label: "Decimal" }, { v: "date", label: "Date" },
];
const TEMPLATES = [
  { name: "Signs", geometryType: "esriGeometryPoint", color: "#dc2626", fields: [
    { name: "name", type: "text", domain: null },
    { name: "sign_type", type: "text", domain: ["Stop", "Yield", "Speed limit", "No parking"] },
    { name: "condition", type: "text", domain: ["Good", "Fair", "Poor"] },
  ] },
  { name: "Curb & gutter", geometryType: "esriGeometryPolyline", color: "#0284c7", fields: [
    { name: "name", type: "text", domain: null },
    { name: "material", type: "text", domain: ["Concrete", "Asphalt"] },
    { name: "length_m", type: "decimal", domain: null },
  ] },
  { name: "Parcels", geometryType: "esriGeometryPolygon", color: "#059669", fields: [
    { name: "name", type: "text", domain: null },
    { name: "parcel_id", type: "text", domain: null },
    { name: "zoning", type: "text", domain: ["Residential", "Commercial", "Industrial"] },
  ] },
];

const TEAL = "#0d9488";
const hexToRgb = (hex) => {
  const h = String(hex || "").replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return [217, 119, 6];
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};

const STYLES = `
  .gul { width: 320px; max-height: 78vh; overflow-y: auto; font: 13px/1.4 system-ui, sans-serif; color: #1f2328; }
  .gul-card { background: #fff; border: 1px solid rgba(15,16,6,.1); border-radius: 14px; box-shadow: 0 1px 2px rgba(0,0,0,.06); padding: 12px; margin-bottom: 10px; }
  .gul-row { display: flex; align-items: center; gap: 8px; }
  .gul-between { display: flex; align-items: center; justify-content: space-between; }
  .gul-h { font-size: 12px; font-weight: 600; color: rgba(31,35,40,.6); display: flex; align-items: center; gap: 6px; }
  .gul-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: rgba(31,35,40,.4); }
  .gul-btn { display: inline-flex; align-items: center; gap: 4px; border-radius: 8px; padding: 5px 9px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1px solid transparent; }
  .gul-btn-teal { background: ${TEAL}; color: #fff; }
  .gul-btn-ghost { background: #fff; border-color: rgba(15,16,6,.15); color: #1f2328; }
  .gul-btn-ghost:hover { background: rgba(15,16,6,.04); }
  .gul-chip { border: 1px solid rgba(15,16,6,.15); border-radius: 6px; padding: 2px 7px; font-size: 11px; cursor: pointer; color: #1f2328; background: #fff; }
  .gul-chip:hover { background: rgba(15,16,6,.05); }
  .gul-list { list-style: none; margin: 8px 0 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
  .gul-li { display: flex; align-items: center; gap: 8px; border: 1px solid rgba(15,16,6,.1); border-radius: 8px; padding: 6px 8px; }
  .gul-li.active { border-color: ${TEAL}; background: rgba(13,148,136,.06); }
  .gul-dot { width: 12px; height: 12px; border-radius: 50%; flex: 0 0 auto; }
  .gul-name { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: left; background: none; border: none; font: inherit; font-weight: 500; cursor: pointer; color: #1f2328; }
  .gul-count { font-size: 11px; color: rgba(31,35,40,.4); }
  .gul-ico { background: none; border: none; cursor: pointer; color: rgba(31,35,40,.5); padding: 0 2px; font-size: 13px; }
  .gul-ico:hover { color: #1f2328; }
  .gul-ico.del:hover { color: #e11d48; }
  .gul-label { display: block; margin-top: 10px; }
  .gul-label > span { font-size: 13px; font-weight: 500; color: rgba(31,35,40,.8); display: flex; align-items: center; gap: 6px; }
  .gul-input, .gul-select { width: 100%; box-sizing: border-box; margin-top: 4px; border: 1px solid rgba(15,16,6,.15); border-radius: 8px; padding: 7px 9px; font: inherit; }
  .gul-seg { display: flex; gap: 6px; margin-top: 4px; }
  .gul-seg button { flex: 1; border-radius: 8px; padding: 7px; font-size: 13px; font-weight: 600; cursor: pointer; border: 1px solid rgba(15,16,6,.15); background: #fff; color: rgba(31,35,40,.7); }
  .gul-seg button.on { background: ${TEAL}; color: #fff; border-color: ${TEAL}; }
  .gul-swatches { display: flex; gap: 6px; margin-top: 4px; }
  .gul-sw { width: 26px; height: 26px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; }
  .gul-sw.on { border-color: rgba(31,35,40,.4); box-shadow: 0 0 0 2px #fff inset; }
  .gul-hint { display: block; margin-top: 4px; font-size: 11px; color: rgba(31,35,40,.45); }
  .gul-field { border: 1px solid rgba(15,16,6,.1); border-radius: 8px; padding: 8px; }
  .gul-field .mono { font-family: ui-monospace, monospace; font-size: 12px; }
  .gul-tag { background: rgba(15,16,6,.05); border-radius: 5px; padding: 1px 6px; font-size: 11px; color: rgba(31,35,40,.6); }
  .gul-listbtn { border: none; background: none; border-radius: 5px; padding: 1px 6px; font-size: 11px; font-weight: 600; cursor: pointer; color: rgba(31,35,40,.4); }
  .gul-listbtn.on { background: rgba(13,148,136,.15); color: ${TEAL}; }
  .gul-add { display: flex; gap: 6px; margin-top: 8px; }
  .gul-add .gul-input { margin-top: 0; }
  .gul-ta { width: 100%; box-sizing: border-box; margin-top: 6px; border: 1px solid rgba(15,16,6,.15); border-radius: 8px; padding: 7px; font-family: ui-monospace, monospace; font-size: 11px; }
  .gul-msg { font-size: 12px; color: rgba(31,35,40,.55); margin: 0 0 8px; }
  .gul-empty { color: rgba(31,35,40,.45); font-style: italic; font-size: 12px; }
`;

// ---------------------------------------------------------------------------
// The plugin. config = { mapView, src }.
// ---------------------------------------------------------------------------
export const userLayers = function (config = {}) {
  const { mapView, src } = config;
  const adminBase = src.replace("/rest/services/", "/rest/admin/services/");

  let FeatureLayer, GraphicsLayer, SketchViewModel, Expand, webMercatorUtils;
  let panel, expand, sketchLayer, sketchVM;
  const featureLayers = new Map(); // layer_index -> FeatureLayer

  // UI state
  let layersMeta = []; // [{ id, name, geometryType, color, labelField, fields, count }]
  let activeId = null;
  let canEdit = false;
  let drawing = false;
  let selected = null; // { layerId, oid, attributes }
  let featureList = []; // [{ oid, label }] for the active layer
  let highlightHandle = null;
  let newFieldName = "";
  let newFieldType = "text";

  injectStyle("geocam-user-layers", STYLES);

  // --- service I/O (same-origin session cookie) ---
  const fetchJson = (url, params = {}) =>
    fetch(`${url}?${new URLSearchParams({ f: "json", ...params })}`, { credentials: "same-origin" }).then((r) => r.json());
  const postForm = (url, body) =>
    fetch(url, { method: "POST", credentials: "same-origin",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ f: "json", ...body }) }).then((r) => r.json());

  const active = () => layersMeta.find((l) => l.id === activeId) || null;
  const canon = (meta) => ESRI_TO_CANON[meta.geometryType] || "point";

  // ----- load + sync -----
  async function reload() {
    const info = await fetchJson(src);
    canEdit = /Editing|Create/.test(info.capabilities || "");
    layersMeta = (info.layers || []).filter(isUserLayer).map((l) => ({ visible: true, ...l }));
    if (activeId == null || !active()) activeId = layersMeta[0]?.id ?? null;
    syncFeatureLayers();
    render();
    restartDraw();
    await loadFeatureList();
  }

  // Pull the active layer's features (id + label) for the panel list.
  async function loadFeatureList() {
    featureList = [];
    const a = active();
    const fl = a && featureLayers.get(a.id);
    if (fl) {
      const labelF = a.labelField || "name";
      try {
        const { features } = await fl.queryFeatures({ where: "1=1", outFields: ["id", labelF], returnGeometry: false, orderByFields: ["id"] });
        featureList = features.map((f) => ({ oid: f.attributes.id ?? f.attributes[fl.objectIdField], label: f.attributes[labelF] }));
      } catch { featureList = []; }
    }
    render();
  }

  async function highlightFeature(layerId, oid) {
    clearHighlight();
    const fl = featureLayers.get(layerId);
    if (!fl) return;
    try { const lv = await mapView.whenLayerView(fl); highlightHandle = lv.highlight(oid); } catch { /* noop */ }
  }
  function clearHighlight() { try { highlightHandle && highlightHandle.remove(); } catch { /* noop */ } highlightHandle = null; }

  function syncFeatureLayers() {
    const present = new Set(layersMeta.map((l) => l.id));
    for (const [idx, fl] of [...featureLayers]) {
      if (!present.has(idx)) { mapView.map.remove(fl); featureLayers.delete(idx); }
    }
    for (const meta of layersMeta) {
      let fl = featureLayers.get(meta.id);
      if (!fl) {
        fl = new FeatureLayer({ url: `${src}/${meta.id}`, outFields: ["*"] });
        featureLayers.set(meta.id, fl);
        mapView.map.add(fl);
      }
      fl.visible = meta.visible !== false;
      fl.renderer = rendererFor(canon(meta), meta.color);
      applyLabels(fl, meta);
    }
  }

  // NB: Esri Color arrays use 0-1 for the alpha (4th) element — so a translucent
  // fill is rgb.concat(0.3), not 80. Points/lines stay opaque (rgb only).
  function rendererFor(geom, color) {
    const rgb = hexToRgb(color);
    if (geom === "point") return { type: "simple", symbol: { type: "simple-marker", style: "circle", color: rgb, size: 8, outline: { color: [255, 255, 255], width: 1 } } };
    if (geom === "polyline") return { type: "simple", symbol: { type: "simple-line", color: rgb, width: 2 } };
    return { type: "simple", symbol: { type: "simple-fill", color: rgb.concat(0.3), outline: { color: rgb, width: 2 } } };
  }

  function applyLabels(fl, meta) {
    if (meta.labelField) {
      fl.labelingInfo = [{ labelExpressionInfo: { expression: `$feature.${meta.labelField}` },
        symbol: { type: "text", color: "#222", haloColor: "#fff", haloSize: 1, font: { size: 10, weight: "bold" } } }];
      fl.labelsVisible = true;
    } else {
      fl.labelingInfo = null;
      fl.labelsVisible = false;
    }
  }

  const refreshFL = (id) => { const fl = featureLayers.get(id); if (fl) fl.refresh(); };

  // ----- layer management (admin definition endpoints) -----
  async function addLayer(template) {
    const spec = template
      ? { name: template.name, geometryType: template.geometryType, color: template.color, fields: template.fields }
      : { name: `Layer ${layersMeta.length + 1}`, geometryType: "esriGeometryPoint", color: COLORS[layersMeta.length % COLORS.length], fields: [{ name: "name", type: "text", domain: null }] };
    const res = await postForm(`${adminBase}/addToDefinition`, { addToDefinition: JSON.stringify({ layers: [spec] }) });
    activeId = res?.layers?.[0]?.id ?? activeId;
    selected = null;
    await reload();
  }
  async function removeLayer(id) {
    await postForm(`${adminBase}/deleteFromDefinition`, { deleteFromDefinition: JSON.stringify({ layers: [{ id }] }) });
    if (activeId === id) activeId = null;
    selected = null;
    await reload();
  }
  // Patch the active layer's definition (name/color/labelField/fields).
  async function patchActive(patch) {
    const a = active();
    if (!a) return;
    Object.assign(a, patch); // optimistic for snappy UI
    await postForm(`${adminBase}/updateDefinition`, { updateDefinition: JSON.stringify({ layers: [{ id: a.id, ...patch }] }) });
    await reload();
  }
  // Geometry change recreates the layer (features are cleared either way).
  async function setGeometry(canonGeom) {
    const a = active();
    if (!a || canon(a) === canonGeom) return;
    if (a.count && !confirm("Changing geometry clears this layer's features. Continue?")) return;
    const esri = GEOMS.find((g) => g.v === canonGeom).esri;
    await postForm(`${adminBase}/deleteFromDefinition`, { deleteFromDefinition: JSON.stringify({ layers: [{ id: a.id }] }) });
    const res = await postForm(`${adminBase}/addToDefinition`, { addToDefinition: JSON.stringify({ layers: [{ name: a.name, geometryType: esri, color: a.color, labelField: a.labelField, fields: a.fields }] }) });
    activeId = res?.layers?.[0]?.id ?? null;
    selected = null;
    await reload();
  }
  function selectLayer(id) { activeId = id; selected = null; clearHighlight(); render(); restartDraw(); loadFeatureList(); }
  async function toggleVisible(id) {
    const meta = layersMeta.find((l) => l.id === id);
    if (!meta) return;
    meta.visible = !(meta.visible !== false);
    const fl = featureLayers.get(id);
    if (fl) fl.visible = meta.visible;
    render();
  }

  // ----- field schema edits -----
  const fieldsOf = (a) => (a?.fields || []).map((f) => ({ name: f.name, type: f.type || "text", domain: f.domain || null }));
  function addField() {
    const a = active();
    const name = newFieldName.trim().replace(/\s+/g, "_");
    if (!a || !name || fieldsOf(a).some((f) => f.name === name)) return;
    newFieldName = "";
    patchActive({ fields: [...fieldsOf(a), { name, type: newFieldType, domain: null }] });
  }
  function removeField(i) { const a = active(); patchActive({ fields: fieldsOf(a).filter((_, idx) => idx !== i) }); }
  function toggleDomain(i) { const a = active(); patchActive({ fields: fieldsOf(a).map((f, idx) => idx === i ? { ...f, domain: f.domain ? null : [] } : f) }); }
  function setDomain(i, csv) { const a = active(); patchActive({ fields: fieldsOf(a).map((f, idx) => idx === i ? { ...f, domain: csv.split(",").map((s) => s.trim()).filter(Boolean) } : f) }); }

  // ----- import GeoJSON into the active layer -----
  async function importGeoJSON(text) {
    const a = active();
    if (!a || !text.trim()) return;
    let fc;
    try { fc = JSON.parse(text); } catch { alert("Invalid GeoJSON"); return; }
    const feats = fc.type === "FeatureCollection" ? fc.features : fc.type === "Feature" ? [fc] : [];
    const adds = feats.filter((f) => f && f.geometry).map((f) => ({
      geometry: geojsonToArcgis(f.geometry),
      attributes: f.properties || {},
    })).filter((a2) => a2.geometry);
    if (!adds.length) return;
    await postForm(`${src}/applyEdits`, { edits: JSON.stringify([{ id: a.id, adds }]) });
    refreshFL(a.id);
    await reload();
  }

  // Minimal GeoJSON->Esri for import (point/line/polygon, server already
  // normalizes rings; the server's Esri::Geometry handles winding).
  function geojsonToArcgis(g) {
    const sr = { wkid: 4326 };
    if (g.type === "Point") return { x: g.coordinates[0], y: g.coordinates[1], spatialReference: sr };
    if (g.type === "MultiPoint") return { points: g.coordinates, spatialReference: sr };
    if (g.type === "LineString") return { paths: [g.coordinates], spatialReference: sr };
    if (g.type === "MultiLineString") return { paths: g.coordinates, spatialReference: sr };
    if (g.type === "Polygon") return { rings: g.coordinates, spatialReference: sr };
    if (g.type === "MultiPolygon") return { rings: g.coordinates.flat(), spatialReference: sr };
    return null;
  }

  // ----- drawing (panel-driven Sketch) -----
  function restartDraw() {
    if (!sketchVM) return;
    try { sketchVM.cancel(); } catch { /* noop */ }
    const a = active();
    if (drawing && canEdit && a) sketchVM.create(SKETCH_TOOL[canon(a)]);
  }
  function toggleDraw() { drawing = !drawing; if (drawing) selected = null; render(); restartDraw(); }

  async function onSketchCreate(evt) {
    if (evt.state !== "complete") return;
    const a = active();
    sketchLayer.removeAll();
    if (!a) return;
    const geom = webMercatorToGeographic(evt.graphic.geometry);
    const res = await postForm(`${src}/applyEdits`, { edits: JSON.stringify([{ id: a.id, adds: [{ geometry: geom, attributes: {} }] }]) });
    const oid = res?.[0]?.addResults?.[0]?.objectId;
    refreshFL(a.id);
    if (oid != null) { drawing = false; await selectFeature(a.id, oid); } // open the attribute form
    else restartDraw();
  }

  // Convert a sketch geometry (typically Web Mercator) to 4326 Esri JSON, so the
  // service stores lng/lat directly (PostGIS doesn't know Esri's 102100 code).
  function webMercatorToGeographic(geometry) {
    const geo = geometry.spatialReference && geometry.spatialReference.isWebMercator
      ? webMercatorUtils.webMercatorToGeographic(geometry)
      : geometry;
    return geo.toJSON();
  }

  // ----- selection + attribute editing -----
  async function selectFeature(layerId, oid) {
    const fl = featureLayers.get(layerId);
    if (!fl) return;
    activeId = layerId;
    const { features } = await fl.queryFeatures({ objectIds: [oid], outFields: ["*"], returnGeometry: false });
    selected = { layerId, oid, attributes: features[0]?.attributes || { id: oid } };
    highlightFeature(layerId, oid);
    render();
  }
  async function saveAttribute(field, value) {
    if (!selected) return;
    selected.attributes[field] = value;
    await postForm(`${src}/applyEdits`, { edits: JSON.stringify([{ id: selected.layerId, updates: [{ attributes: { id: selected.oid, [field]: value } }] }]) });
    refreshFL(selected.layerId);
    loadFeatureList(); // label may have changed
  }
  async function deleteFeatureById(layerId, oid) {
    await postForm(`${src}/applyEdits`, { edits: JSON.stringify([{ id: layerId, deletes: [oid] }]) });
    if (selected && selected.oid === oid) selected = null;
    clearHighlight();
    refreshFL(layerId);
    await reload(); // refreshes counts + feature list
  }

  // Ctrl/Cmd+click is a quick-add for the active layer: drop a point at the
  // click immediately, or arm a sketch for line/polygon. No Draw toggle needed.
  async function quickAdd(evt) {
    const a = active();
    if (!a) return;
    if (canon(a) === "point") {
      const geom = webMercatorToGeographic(evt.mapPoint);
      await postForm(`${src}/applyEdits`, { edits: JSON.stringify([{ id: a.id, adds: [{ geometry: geom, attributes: {} }] }]) });
      refreshFL(a.id);
      await loadFeatureList();
    } else {
      drawing = true;
      render();
      restartDraw();
    }
  }

  // Click handler: Ctrl/Cmd+click = quick-add; plain click selects (when idle).
  async function onViewClick(evt) {
    const native = evt.native || {};
    if ((native.ctrlKey || native.metaKey) && canEdit && active()) {
      evt.stopPropagation();
      return quickAdd(evt);
    }
    if (drawing || !canEdit) return;
    const hit = await mapView.hitTest(evt);
    const g = hit.results.map((r) => r.graphic).find((gr) => gr && gr.layer && [...featureLayers.values()].includes(gr.layer));
    if (!g) return;
    const layerId = [...featureLayers.entries()].find(([, fl]) => fl === g.layer)?.[0];
    const oid = g.attributes?.[g.layer.objectIdField] ?? g.attributes?.id;
    if (layerId != null && oid != null) { evt.stopPropagation(); await selectFeature(layerId, oid); }
  }

  // ===========================================================================
  // Render the panel
  // ===========================================================================
  function render() {
    if (!panel) return;
    panel.innerHTML = "";
    panel.appendChild(layersCard());
    const a = active();
    if (a) {
      panel.appendChild(layerCard(a));
      if (canEdit) panel.appendChild(fieldsCard(a));
      if (canEdit) panel.appendChild(importCard());
      panel.appendChild(featuresCard(a));
    }
  }

  function layersCard() {
    const card = node("DIV", { class: "gul-card" });
    const head = node("DIV", { class: "gul-between" });
    head.append(node("DIV", { class: "gul-h" }, "▦ Layers"));
    if (canEdit) head.append(node("BUTTON", { class: "gul-btn gul-btn-teal", onclick: () => addLayer() }, "+ Add layer"));
    card.append(head);

    const ul = node("UL", { class: "gul-list" });
    if (!layersMeta.length) ul.append(node("LI", { class: "gul-empty" }, "No layers yet"));
    layersMeta.forEach((l) => {
      const li = node("LI", { class: `gul-li${l.id === activeId ? " active" : ""}` });
      li.append(node("BUTTON", { class: "gul-ico", title: "Toggle visibility", onclick: () => toggleVisible(l.id) }, l.visible !== false ? "&#128065;" : "&#8856;"));
      li.append(node("SPAN", { class: "gul-dot", style: `background:${l.color}` }));
      li.append(node("BUTTON", { class: "gul-name", onclick: () => selectLayer(l.id) }, escapeHtml(l.name)));
      li.append(node("SPAN", { class: "gul-count" }, String(l.count ?? 0)));
      if (canEdit && layersMeta.length > 1) li.append(node("BUTTON", { class: "gul-ico del", title: "Delete layer", onclick: () => removeLayer(l.id) }, "&#10005;"));
      ul.append(li);
    });
    card.append(ul);

    if (canEdit) {
      const tpl = node("DIV", { class: "gul-row", style: "flex-wrap:wrap;gap:6px;margin-top:8px;border-top:1px solid rgba(15,16,6,.1);padding-top:8px" });
      tpl.append(node("SPAN", { class: "gul-count" }, "From template:"));
      TEMPLATES.forEach((t) => tpl.append(node("BUTTON", { class: "gul-chip", onclick: () => addLayer(t) }, t.name)));
      card.append(tpl);
    }
    return card;
  }

  function layerCard(a) {
    const card = node("DIV", { class: "gul-card" });
    card.append(node("P", { class: "gul-eyebrow" }, `Layer: ${escapeHtml(a.name)}`));

    if (canEdit) {
      const nameLabel = node("LABEL", { class: "gul-label" }, "<span>Name</span>");
      const nameInput = node("INPUT", { class: "gul-input", value: a.name });
      nameInput.addEventListener("change", () => patchActive({ name: nameInput.value }));
      nameLabel.append(nameInput);
      card.append(nameLabel);

      const geomWrap = node("DIV", { class: "gul-label" }, "<span>Geometry</span>");
      const seg = node("DIV", { class: "gul-seg" });
      GEOMS.forEach((g) => seg.append(node("BUTTON", { class: canon(a) === g.v ? "on" : "", onclick: () => setGeometry(g.v) }, g.label)));
      geomWrap.append(seg);
      card.append(geomWrap);

      const colWrap = node("DIV", { class: "gul-label" }, "<span>&#127912; Symbol colour</span>");
      const sw = node("DIV", { class: "gul-swatches" });
      COLORS.forEach((c) => sw.append(node("BUTTON", { class: `gul-sw${a.color === c ? " on" : ""}`, style: `background:${c}`, "aria-label": "colour", onclick: () => patchActive({ color: c }) })));
      colWrap.append(sw);
      card.append(colWrap);

      const labWrap = node("DIV", { class: "gul-label" }, "<span>&#127991; Label field</span>");
      const sel = node("SELECT", { class: "gul-select" });
      sel.append(node("OPTION", { value: "" }, "— no labels —"));
      fieldsOf(a).forEach((f) => { const o = node("OPTION", { value: f.name }, f.name); if (a.labelField === f.name) o.selected = true; sel.append(o); });
      sel.addEventListener("change", () => patchActive({ labelField: sel.value || null }));
      labWrap.append(sel);
      labWrap.append(node("SPAN", { class: "gul-hint" }, "Shows this field's value as a label on each feature."));
      card.append(labWrap);
    }

    // Draw toggle
    if (canEdit) {
      const drawBtn = node("BUTTON", { class: `gul-btn ${drawing ? "gul-btn-teal" : "gul-btn-ghost"}`, style: "margin-top:10px", onclick: () => toggleDraw() },
        drawing ? `Drawing ${canon(a)} — click map (Esc/here to stop)` : `+ Draw ${canon(a)}`);
      card.append(drawBtn);
      card.append(node("SPAN", { class: "gul-hint" }, "Tip: Ctrl/⌘-click the map to quick-add to this layer."));
    }
    return card;
  }

  function fieldsCard(a) {
    const card = node("DIV", { class: "gul-card" });
    card.append(node("P", { class: "gul-h" }, "&#9776; Fields"));
    const ul = node("UL", { class: "gul-list" });
    fieldsOf(a).forEach((f, i) => {
      const li = node("LI", { class: "gul-field" });
      const row = node("DIV", { class: "gul-row" });
      row.append(node("SPAN", { class: "gul-name mono" }, escapeHtml(f.name)));
      row.append(node("SPAN", { class: "gul-tag" }, f.type));
      row.append(node("BUTTON", { class: `gul-listbtn${f.domain ? " on" : ""}`, title: "Coded-value list", onclick: () => toggleDomain(i) }, "list"));
      row.append(node("BUTTON", { class: "gul-ico del", onclick: () => removeField(i) }, "&#10005;"));
      li.append(row);
      if (f.domain) {
        const di = node("INPUT", { class: "gul-input", style: "margin-top:6px", value: (f.domain || []).join(", "), placeholder: "Coded values, comma-separated" });
        di.addEventListener("change", () => setDomain(i, di.value));
        li.append(di);
      }
      ul.append(li);
    });
    card.append(ul);

    const add = node("DIV", { class: "gul-add" });
    const nameI = node("INPUT", { class: "gul-input", placeholder: "field_name", value: newFieldName });
    nameI.addEventListener("input", () => { newFieldName = nameI.value; });
    nameI.addEventListener("keydown", (e) => { if (e.key === "Enter") addField(); });
    const typeS = node("SELECT", { class: "gul-select", style: "width:auto;margin-top:0" });
    FIELD_TYPES.forEach((t) => { const o = node("OPTION", { value: t.v }, t.label); if (t.v === newFieldType) o.selected = true; typeS.append(o); });
    typeS.addEventListener("change", () => { newFieldType = typeS.value; });
    add.append(nameI, typeS, node("BUTTON", { class: "gul-btn gul-btn-teal", onclick: () => addField() }, "+"));
    card.append(add);
    return card;
  }

  function importCard() {
    const card = node("DIV", { class: "gul-card" });
    card.append(node("P", { class: "gul-h" }, "Import GeoJSON (into active layer)"));
    const ta = node("TEXTAREA", { class: "gul-ta", rows: "2", placeholder: '{"type":"FeatureCollection",...}' });
    card.append(ta);
    card.append(node("BUTTON", { class: "gul-btn gul-btn-ghost", style: "margin-top:6px", onclick: () => importGeoJSON(ta.value) }, "&#8593; Add to layer"));
    return card;
  }

  function featuresCard(a) {
    const card = node("DIV", { class: "gul-card" });
    card.append(node("DIV", { class: "gul-h" }, `&#9678; ${escapeHtml(a.name)} &middot; ${featureList.length} feature${featureList.length === 1 ? "" : "s"}`));

    if (featureList.length) {
      const ul = node("UL", { class: "gul-list", style: "max-height:160px;overflow-y:auto" });
      featureList.forEach((f, i) => {
        const li = node("LI", { class: `gul-li${selected && selected.oid === f.oid ? " active" : ""}` });
        li.append(node("SPAN", { class: "gul-dot", style: `background:${a.color}` }));
        li.append(node("BUTTON", { class: "gul-name", onclick: () => selectFeature(a.id, f.oid) }, escapeHtml(f.label || `Feature ${i + 1}`)));
        if (canEdit) li.append(node("BUTTON", { class: "gul-ico del", title: "Delete feature", onclick: () => deleteFeatureById(a.id, f.oid) }, "&#10005;"));
        ul.append(li);
      });
      card.append(ul);
    } else {
      card.append(node("P", { class: "gul-hint" }, canEdit ? "Ctrl/⌘-click the map to add a feature, or use Draw above." : "No features."));
    }

    if (!selected) return card;

    // Selected-feature attribute form
    const form = node("DIV", { style: "margin-top:10px;border-top:1px solid rgba(15,16,6,.1);padding-top:10px" });
    const head = node("DIV", { class: "gul-between" });
    head.append(node("DIV", { class: "gul-eyebrow" }, `Editing feature #${selected.oid}`));
    if (canEdit) head.append(node("BUTTON", { class: "gul-ico del", title: "Delete feature", onclick: () => deleteFeatureById(selected.layerId, selected.oid) }, "&#10005; Delete"));
    form.append(head);
    card.append(form);
    fieldsOf(a).forEach((f) => {
      const label = node("LABEL", { class: "gul-label" }, `<span class="mono" style="font-size:11px">${escapeHtml(f.name)} · ${f.type}</span>`);
      const val = selected.attributes[f.name] ?? "";
      let input;
      if (f.domain) {
        input = node("SELECT", { class: "gul-select" });
        input.append(node("OPTION", { value: "" }, "—"));
        f.domain.forEach((d) => { const o = node("OPTION", { value: d }, d); if (String(val) === d) o.selected = true; input.append(o); });
      } else {
        const t = f.type === "integer" || f.type === "decimal" ? "number" : f.type === "date" ? "date" : "text";
        input = node("INPUT", { class: "gul-input", type: t, value: val });
      }
      input.addEventListener("change", () => saveAttribute(f.name, input.value));
      label.append(input);
      card.append(label);
    });
    return card;
  }

  const escapeHtml = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // ===========================================================================
  // Lifecycle
  // ===========================================================================
  let clickHandle;
  this.init = async function () {
    [FeatureLayer, GraphicsLayer, SketchViewModel, Expand, webMercatorUtils] = await loadModules([
      "esri/layers/FeatureLayer",
      "esri/layers/GraphicsLayer",
      "esri/widgets/Sketch/SketchViewModel",
      "esri/widgets/Expand",
      "esri/geometry/support/webMercatorUtils",
    ]);

    sketchLayer = new GraphicsLayer({ listMode: "hide" });
    mapView.map.add(sketchLayer);
    sketchVM = new SketchViewModel({ view: mapView, layer: sketchLayer });
    sketchVM.on("create", onSketchCreate);

    panel = node("DIV", { class: "gul" });
    expand = new Expand({ view: mapView, content: panel, expanded: false, autoCollapse: false,
      expandIconClass: "esri-icon-layer-list", expandTooltip: "User layers" });
    mapView.ui.add(expand, "top-left");

    clickHandle = mapView.on("click", onViewClick);
    await reload();
  };

  this.destroy = function () {
    try { clickHandle && clickHandle.remove(); } catch { /* noop */ }
    try { sketchVM && sketchVM.destroy(); } catch { /* noop */ }
    if (expand) { mapView.ui.remove(expand); expand = null; }
    if (sketchLayer) { mapView.map.remove(sketchLayer); sketchLayer = null; }
    for (const fl of featureLayers.values()) mapView.map.remove(fl);
    featureLayers.clear();
    panel = null;
  };
};
