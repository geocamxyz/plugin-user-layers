var Ue = typeof window < "u";
const le = {
  Promise: Ue ? window.Promise : void 0
};
var se = "4.25", X = "next";
function ce(r) {
  if (r.toLowerCase() === X)
    return X;
  var i = r && r.match(/^(\d)\.(\d+)/);
  return i && {
    major: parseInt(i[1], 10),
    minor: parseInt(i[2], 10)
  };
}
function de(r) {
  return r === void 0 && (r = se), "https://js.arcgis.com/".concat(r, "/");
}
function Ve(r) {
  r === void 0 && (r = se);
  var i = de(r), s = ce(r);
  if (s !== X && s.major === 3) {
    var c = s.minor <= 10 ? "js/" : "";
    return "".concat(i).concat(c, "esri/css/esri.css");
  } else
    return "".concat(i, "esri/themes/light/main.css");
}
function Be(r) {
  var i = document.createElement("link");
  return i.rel = "stylesheet", i.href = r, i;
}
function Ge(r, i) {
  if (i) {
    var s = document.querySelector(i);
    s.parentNode.insertBefore(r, s);
  } else
    document.head.appendChild(r);
}
function Me(r) {
  return document.querySelector('link[href*="'.concat(r, '"]'));
}
function ze(r) {
  return !r || ce(r) ? Ve(r) : r;
}
function Re(r, i) {
  var s = ze(r), c = Me(s);
  return c || (c = Be(s), Ge(c, i)), c;
}
var Je = {};
function je(r) {
  var i = document.createElement("script");
  return i.type = "text/javascript", i.src = r, i.setAttribute("data-esri-loader", "loading"), i;
}
function ie(r, i, s) {
  var c;
  s && (c = qe(r, s));
  var d = function() {
    i(r), r.removeEventListener("load", d, !1), c && r.removeEventListener("error", c, !1);
  };
  r.addEventListener("load", d, !1);
}
function qe(r, i) {
  var s = function(c) {
    i(c.error || new Error("There was an error attempting to load ".concat(r.src))), r.removeEventListener("error", s, !1);
  };
  return r.addEventListener("error", s, !1), s;
}
function pe() {
  return document.querySelector("script[data-esri-loader]");
}
function Q() {
  var r = window.require;
  return r && r.on;
}
function _e(r) {
  r === void 0 && (r = {});
  var i = {};
  [Je, r].forEach(function(d) {
    for (var m in d)
      Object.prototype.hasOwnProperty.call(d, m) && (i[m] = d[m]);
  });
  var s = i.version, c = i.url || de(s);
  return new le.Promise(function(d, m) {
    var y = pe();
    if (y) {
      var B = y.getAttribute("src");
      B !== c ? m(new Error("The ArcGIS API for JavaScript is already loaded (".concat(B, ")."))) : Q() ? d(y) : ie(y, d, m);
    } else if (Q())
      m(new Error("The ArcGIS API for JavaScript is already loaded."));
    else {
      var U = i.css;
      if (U) {
        var E = U === !0;
        Re(E ? s : U, i.insertCssBefore);
      }
      y = je(c), ie(y, function() {
        y.setAttribute("data-esri-loader", "loaded"), d(y);
      }, m), document.body.appendChild(y);
    }
  });
}
function re(r) {
  return new le.Promise(function(i, s) {
    var c = window.require.on("error", s);
    window.require(r, function() {
      for (var d = [], m = 0; m < arguments.length; m++)
        d[m] = arguments[m];
      c.remove(), i(d);
    });
  });
}
function He(r, i) {
  if (i === void 0 && (i = {}), Q())
    return re(r);
  var s = pe(), c = s && s.getAttribute("src");
  return !i.url && c && (i.url = c), _e(i).then(function() {
    return re(r);
  });
}
const n = (r, i = {}, s) => {
  const c = document.createElement(r);
  for (const d in i)
    d === "class" ? c.className = i[d] : d.startsWith("on") && typeof i[d] == "function" ? c.addEventListener(d.slice(2), i[d]) : i[d] != null && c.setAttribute(d, i[d]);
  return s != null && (c.innerHTML = s), c;
}, Ye = (r, i) => {
  document.getElementById(r) || document.getElementsByTagName("head")[0].prepend(n("STYLE", { id: r, type: "text/css" }, i));
}, oe = [
  { v: "point", label: "Point", esri: "esriGeometryPoint" },
  { v: "polyline", label: "Line", esri: "esriGeometryPolyline" },
  { v: "polygon", label: "Polygon", esri: "esriGeometryPolygon" }
], We = { esriGeometryPoint: "point", esriGeometryPolyline: "polyline", esriGeometryPolygon: "polygon" }, Ke = 100, Xe = 1e4, Qe = (r) => r.id >= Ke && r.id < Xe, Ze = { point: "point", polyline: "polyline", polygon: "polygon" }, K = ["#dc2626", "#d97706", "#059669", "#0284c7", "#7c3aed", "#0e0f06"], et = [
  { v: "text", label: "Text" },
  { v: "integer", label: "Integer" },
  { v: "decimal", label: "Decimal" },
  { v: "date", label: "Date" }
], tt = [
  { name: "Signs", geometryType: "esriGeometryPoint", color: "#dc2626", fields: [
    { name: "name", type: "text", domain: null },
    { name: "sign_type", type: "text", domain: ["Stop", "Yield", "Speed limit", "No parking"] },
    { name: "condition", type: "text", domain: ["Good", "Fair", "Poor"] }
  ] },
  { name: "Curb & gutter", geometryType: "esriGeometryPolyline", color: "#0284c7", fields: [
    { name: "name", type: "text", domain: null },
    { name: "material", type: "text", domain: ["Concrete", "Asphalt"] },
    { name: "length_m", type: "decimal", domain: null }
  ] },
  { name: "Parcels", geometryType: "esriGeometryPolygon", color: "#059669", fields: [
    { name: "name", type: "text", domain: null },
    { name: "parcel_id", type: "text", domain: null },
    { name: "zoning", type: "text", domain: ["Residential", "Commercial", "Industrial"] }
  ] }
], R = "#0d9488", nt = (r) => {
  const i = String(r || "").replace("#", "");
  return /^[0-9a-fA-F]{6}$/.test(i) ? [0, 2, 4].map((s) => parseInt(i.slice(s, s + 2), 16)) : [217, 119, 6];
}, at = `
  .gul { width: 320px; max-height: 78vh; overflow-y: auto; font: 13px/1.4 system-ui, sans-serif; color: #1f2328; }
  .gul-card { background: #fff; border: 1px solid rgba(15,16,6,.1); border-radius: 14px; box-shadow: 0 1px 2px rgba(0,0,0,.06); padding: 12px; margin-bottom: 10px; }
  .gul-row { display: flex; align-items: center; gap: 8px; }
  .gul-between { display: flex; align-items: center; justify-content: space-between; }
  .gul-h { font-size: 12px; font-weight: 600; color: rgba(31,35,40,.6); display: flex; align-items: center; gap: 6px; }
  .gul-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: rgba(31,35,40,.4); }
  .gul-btn { display: inline-flex; align-items: center; gap: 4px; border-radius: 8px; padding: 5px 9px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1px solid transparent; }
  .gul-btn-teal { background: ${R}; color: #fff; }
  .gul-btn-ghost { background: #fff; border-color: rgba(15,16,6,.15); color: #1f2328; }
  .gul-btn-ghost:hover { background: rgba(15,16,6,.04); }
  .gul-chip { border: 1px solid rgba(15,16,6,.15); border-radius: 6px; padding: 2px 7px; font-size: 11px; cursor: pointer; color: #1f2328; background: #fff; }
  .gul-chip:hover { background: rgba(15,16,6,.05); }
  .gul-list { list-style: none; margin: 8px 0 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
  .gul-li { display: flex; align-items: center; gap: 8px; border: 1px solid rgba(15,16,6,.1); border-radius: 8px; padding: 6px 8px; }
  .gul-li.active { border-color: ${R}; background: rgba(13,148,136,.06); }
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
  .gul-seg button.on { background: ${R}; color: #fff; border-color: ${R}; }
  .gul-swatches { display: flex; gap: 6px; margin-top: 4px; }
  .gul-sw { width: 26px; height: 26px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; }
  .gul-sw.on { border-color: rgba(31,35,40,.4); box-shadow: 0 0 0 2px #fff inset; }
  .gul-hint { display: block; margin-top: 4px; font-size: 11px; color: rgba(31,35,40,.45); }
  .gul-field { border: 1px solid rgba(15,16,6,.1); border-radius: 8px; padding: 8px; }
  .gul-field .mono { font-family: ui-monospace, monospace; font-size: 12px; }
  .gul-tag { background: rgba(15,16,6,.05); border-radius: 5px; padding: 1px 6px; font-size: 11px; color: rgba(31,35,40,.6); }
  .gul-listbtn { border: none; background: none; border-radius: 5px; padding: 1px 6px; font-size: 11px; font-weight: 600; cursor: pointer; color: rgba(31,35,40,.4); }
  .gul-listbtn.on { background: rgba(13,148,136,.15); color: ${R}; }
  .gul-add { display: flex; gap: 6px; margin-top: 8px; }
  .gul-add .gul-input { margin-top: 0; }
  .gul-ta { width: 100%; box-sizing: border-box; margin-top: 6px; border: 1px solid rgba(15,16,6,.15); border-radius: 8px; padding: 7px; font-family: ui-monospace, monospace; font-size: 11px; }
  .gul-msg { font-size: 12px; color: rgba(31,35,40,.55); margin: 0 0 8px; }
  .gul-empty { color: rgba(31,35,40,.45); font-style: italic; font-size: 12px; }
`, it = function(r = {}) {
  const { mapView: i, src: s } = r, c = s.replace("/rest/services/", "/rest/admin/services/");
  let d, m, y, B, U, E, G, P, O;
  const v = /* @__PURE__ */ new Map();
  let L = [], S = null, h = !1, k = !1, f = null, C = [], J = null, j = "", _ = "text";
  Ye("geocam-user-layers", at);
  const ue = (e, t = {}) => fetch(`${e}?${new URLSearchParams({ f: "json", ...t })}`, { credentials: "same-origin" }).then((a) => a.json()), I = (e, t) => fetch(e, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ f: "json", ...t })
  }).then((a) => a.json()), w = () => L.find((e) => e.id === S) || null, D = (e) => We[e.geometryType] || "point";
  async function F() {
    const e = await ue(s);
    h = /Editing|Create/.test(e.capabilities || ""), L = (e.layers || []).filter(Qe).map((t) => ({ visible: !0, ...t })), (S == null || !w()) && (S = L[0]?.id ?? null), fe(), A(), z(), await q();
  }
  async function q() {
    C = [];
    const e = w(), t = e && v.get(e.id);
    if (t) {
      const a = e.labelField || "name";
      try {
        const { features: l } = await t.queryFeatures({ where: "1=1", outFields: ["id", a], returnGeometry: !1, orderByFields: ["id"] });
        C = l.map((o) => ({ oid: o.attributes.id ?? o.attributes[t.objectIdField], label: o.attributes[a] }));
      } catch {
        C = [];
      }
    }
    A();
  }
  async function ge(e, t) {
    H();
    const a = v.get(e);
    if (a)
      try {
        J = (await i.whenLayerView(a)).highlight(t);
      } catch {
      }
  }
  function H() {
    try {
      J && J.remove();
    } catch {
    }
    J = null;
  }
  function fe() {
    const e = new Set(L.map((t) => t.id));
    for (const [t, a] of [...v])
      e.has(t) || (i.map.remove(a), v.delete(t));
    for (const t of L) {
      let a = v.get(t.id);
      a || (a = new d({ url: `${s}/${t.id}`, outFields: ["*"] }), v.set(t.id, a), i.map.add(a)), a.visible = t.visible !== !1, a.renderer = me(D(t), t.color), ye(a, t);
    }
  }
  function me(e, t) {
    const a = nt(t);
    return e === "point" ? { type: "simple", symbol: { type: "simple-marker", style: "circle", color: a, size: 8, outline: { color: [255, 255, 255], width: 1 } } } : e === "polyline" ? { type: "simple", symbol: { type: "simple-line", color: a, width: 2 } } : { type: "simple", symbol: { type: "simple-fill", color: a.concat(0.3), outline: { color: a, width: 2 } } };
  }
  function ye(e, t) {
    t.labelField ? (e.labelingInfo = [{
      labelExpressionInfo: { expression: `$feature.${t.labelField}` },
      symbol: { type: "text", color: "#222", haloColor: "#fff", haloSize: 1, font: { size: 10, weight: "bold" } }
    }], e.labelsVisible = !0) : (e.labelingInfo = null, e.labelsVisible = !1);
  }
  const M = (e) => {
    const t = v.get(e);
    t && t.refresh();
  };
  async function Z(e) {
    const t = e ? { name: e.name, geometryType: e.geometryType, color: e.color, fields: e.fields } : { name: `Layer ${L.length + 1}`, geometryType: "esriGeometryPoint", color: K[L.length % K.length], fields: [{ name: "name", type: "text", domain: null }] };
    S = (await I(`${c}/addToDefinition`, { addToDefinition: JSON.stringify({ layers: [t] }) }))?.layers?.[0]?.id ?? S, f = null, await F();
  }
  async function be(e) {
    await I(`${c}/deleteFromDefinition`, { deleteFromDefinition: JSON.stringify({ layers: [{ id: e }] }) }), S === e && (S = null), f = null, await F();
  }
  async function $(e) {
    const t = w();
    t && (Object.assign(t, e), await I(`${c}/updateDefinition`, { updateDefinition: JSON.stringify({ layers: [{ id: t.id, ...e }] }) }), await F());
  }
  async function he(e) {
    const t = w();
    if (!t || D(t) === e || t.count && !confirm("Changing geometry clears this layer's features. Continue?")) return;
    const a = oe.find((o) => o.v === e).esri;
    await I(`${c}/deleteFromDefinition`, { deleteFromDefinition: JSON.stringify({ layers: [{ id: t.id }] }) }), S = (await I(`${c}/addToDefinition`, { addToDefinition: JSON.stringify({ layers: [{ name: t.name, geometryType: a, color: t.color, labelField: t.labelField, fields: t.fields }] }) }))?.layers?.[0]?.id ?? null, f = null, await F();
  }
  function we(e) {
    S = e, f = null, H(), A(), z(), q();
  }
  async function xe(e) {
    const t = L.find((l) => l.id === e);
    if (!t) return;
    t.visible = t.visible === !1;
    const a = v.get(e);
    a && (a.visible = t.visible), A();
  }
  const N = (e) => (e?.fields || []).map((t) => ({ name: t.name, type: t.type || "text", domain: t.domain || null }));
  function ee() {
    const e = w(), t = j.trim().replace(/\s+/g, "_");
    !e || !t || N(e).some((a) => a.name === t) || (j = "", $({ fields: [...N(e), { name: t, type: _, domain: null }] }));
  }
  function ve(e) {
    const t = w();
    $({ fields: N(t).filter((a, l) => l !== e) });
  }
  function Te(e) {
    const t = w();
    $({ fields: N(t).map((a, l) => l === e ? { ...a, domain: a.domain ? null : [] } : a) });
  }
  function Ee(e, t) {
    const a = w();
    $({ fields: N(a).map((l, o) => o === e ? { ...l, domain: t.split(",").map((p) => p.trim()).filter(Boolean) } : l) });
  }
  async function Le(e) {
    const t = w();
    if (!t || !e.trim()) return;
    let a;
    try {
      a = JSON.parse(e);
    } catch {
      alert("Invalid GeoJSON");
      return;
    }
    const o = (a.type === "FeatureCollection" ? a.features : a.type === "Feature" ? [a] : []).filter((p) => p && p.geometry).map((p) => ({
      geometry: Se(p.geometry),
      attributes: p.properties || {}
    })).filter((p) => p.geometry);
    o.length && (await I(`${s}/applyEdits`, { edits: JSON.stringify([{ id: t.id, adds: o }]) }), M(t.id), await F());
  }
  function Se(e) {
    const t = { wkid: 4326 };
    return e.type === "Point" ? { x: e.coordinates[0], y: e.coordinates[1], spatialReference: t } : e.type === "MultiPoint" ? { points: e.coordinates, spatialReference: t } : e.type === "LineString" ? { paths: [e.coordinates], spatialReference: t } : e.type === "MultiLineString" ? { paths: e.coordinates, spatialReference: t } : e.type === "Polygon" ? { rings: e.coordinates, spatialReference: t } : e.type === "MultiPolygon" ? { rings: e.coordinates.flat(), spatialReference: t } : null;
  }
  function z() {
    if (!O) return;
    try {
      O.cancel();
    } catch {
    }
    const e = w();
    k && h && e && O.create(Ze[D(e)]);
  }
  function Ie() {
    k = !k, k && (f = null), A(), z();
  }
  async function ke(e) {
    if (e.state !== "complete") return;
    const t = w();
    if (P.removeAll(), !t) return;
    const a = te(e.graphic.geometry), o = (await I(`${s}/applyEdits`, { edits: JSON.stringify([{ id: t.id, adds: [{ geometry: a, attributes: {} }] }]) }))?.[0]?.addResults?.[0]?.objectId;
    M(t.id), o != null ? (k = !1, await Y(t.id, o)) : z();
  }
  function te(e) {
    return (e.spatialReference && e.spatialReference.isWebMercator ? U.webMercatorToGeographic(e) : e).toJSON();
  }
  async function Y(e, t) {
    const a = v.get(e);
    if (!a) return;
    S = e;
    const { features: l } = await a.queryFeatures({ objectIds: [t], outFields: ["*"], returnGeometry: !1 });
    f = { layerId: e, oid: t, attributes: l[0]?.attributes || { id: t } }, ge(e, t), A();
  }
  async function Ne(e, t) {
    f && (f.attributes[e] = t, await I(`${s}/applyEdits`, { edits: JSON.stringify([{ id: f.layerId, updates: [{ attributes: { id: f.oid, [e]: t } }] }]) }), M(f.layerId), q());
  }
  async function ne(e, t) {
    await I(`${s}/applyEdits`, { edits: JSON.stringify([{ id: e, deletes: [t] }]) }), f && f.oid === t && (f = null), H(), M(e), await F();
  }
  async function Pe(e) {
    const t = w();
    if (t)
      if (D(t) === "point") {
        const a = te(e.mapPoint);
        await I(`${s}/applyEdits`, { edits: JSON.stringify([{ id: t.id, adds: [{ geometry: a, attributes: {} }] }]) }), M(t.id), await q();
      } else
        k = !0, A(), z();
  }
  async function Oe(e) {
    const t = e.native || {};
    if ((t.ctrlKey || t.metaKey) && h && w())
      return e.stopPropagation(), Pe(e);
    if (k || !h) return;
    const l = (await i.hitTest(e)).results.map((u) => u.graphic).find((u) => u && u.layer && [...v.values()].includes(u.layer));
    if (!l) return;
    const o = [...v.entries()].find(([, u]) => u === l.layer)?.[0], p = l.attributes?.[l.layer.objectIdField] ?? l.attributes?.id;
    o != null && p != null && (e.stopPropagation(), await Y(o, p));
  }
  function A() {
    if (!E) return;
    E.innerHTML = "", E.appendChild(Ce());
    const e = w();
    e && (E.appendChild(De(e)), h && E.appendChild(Fe(e)), h && E.appendChild($e()), E.appendChild(Ae(e)));
  }
  function Ce() {
    const e = n("DIV", { class: "gul-card" }), t = n("DIV", { class: "gul-between" });
    t.append(n("DIV", { class: "gul-h" }, "▦ Layers")), h && t.append(n("BUTTON", { class: "gul-btn gul-btn-teal", onclick: () => Z() }, "+ Add layer")), e.append(t);
    const a = n("UL", { class: "gul-list" });
    if (L.length || a.append(n("LI", { class: "gul-empty" }, "No layers yet")), L.forEach((l) => {
      const o = n("LI", { class: `gul-li${l.id === S ? " active" : ""}` });
      o.append(n("BUTTON", { class: "gul-ico", title: "Toggle visibility", onclick: () => xe(l.id) }, l.visible !== !1 ? "&#128065;" : "&#8856;")), o.append(n("SPAN", { class: "gul-dot", style: `background:${l.color}` })), o.append(n("BUTTON", { class: "gul-name", onclick: () => we(l.id) }, V(l.name))), o.append(n("SPAN", { class: "gul-count" }, String(l.count ?? 0))), h && L.length > 1 && o.append(n("BUTTON", { class: "gul-ico del", title: "Delete layer", onclick: () => be(l.id) }, "&#10005;")), a.append(o);
    }), e.append(a), h) {
      const l = n("DIV", { class: "gul-row", style: "flex-wrap:wrap;gap:6px;margin-top:8px;border-top:1px solid rgba(15,16,6,.1);padding-top:8px" });
      l.append(n("SPAN", { class: "gul-count" }, "From template:")), tt.forEach((o) => l.append(n("BUTTON", { class: "gul-chip", onclick: () => Z(o) }, o.name))), e.append(l);
    }
    return e;
  }
  function De(e) {
    const t = n("DIV", { class: "gul-card" });
    if (t.append(n("P", { class: "gul-eyebrow" }, `Layer: ${V(e.name)}`)), h) {
      const a = n("LABEL", { class: "gul-label" }, "<span>Name</span>"), l = n("INPUT", { class: "gul-input", value: e.name });
      l.addEventListener("change", () => $({ name: l.value })), a.append(l), t.append(a);
      const o = n("DIV", { class: "gul-label" }, "<span>Geometry</span>"), p = n("DIV", { class: "gul-seg" });
      oe.forEach((b) => p.append(n("BUTTON", { class: D(e) === b.v ? "on" : "", onclick: () => he(b.v) }, b.label))), o.append(p), t.append(o);
      const u = n("DIV", { class: "gul-label" }, "<span>&#127912; Symbol colour</span>"), g = n("DIV", { class: "gul-swatches" });
      K.forEach((b) => g.append(n("BUTTON", { class: `gul-sw${e.color === b ? " on" : ""}`, style: `background:${b}`, "aria-label": "colour", onclick: () => $({ color: b }) }))), u.append(g), t.append(u);
      const T = n("DIV", { class: "gul-label" }, "<span>&#127991; Label field</span>"), x = n("SELECT", { class: "gul-select" });
      x.append(n("OPTION", { value: "" }, "— no labels —")), N(e).forEach((b) => {
        const ae = n("OPTION", { value: b.name }, b.name);
        e.labelField === b.name && (ae.selected = !0), x.append(ae);
      }), x.addEventListener("change", () => $({ labelField: x.value || null })), T.append(x), T.append(n("SPAN", { class: "gul-hint" }, "Shows this field's value as a label on each feature.")), t.append(T);
    }
    if (h) {
      const a = n(
        "BUTTON",
        { class: `gul-btn ${k ? "gul-btn-teal" : "gul-btn-ghost"}`, style: "margin-top:10px", onclick: () => Ie() },
        k ? `Drawing ${D(e)} — click map (Esc/here to stop)` : `+ Draw ${D(e)}`
      );
      t.append(a), t.append(n("SPAN", { class: "gul-hint" }, "Tip: Ctrl/⌘-click the map to quick-add to this layer."));
    }
    return t;
  }
  function Fe(e) {
    const t = n("DIV", { class: "gul-card" });
    t.append(n("P", { class: "gul-h" }, "&#9776; Fields"));
    const a = n("UL", { class: "gul-list" });
    N(e).forEach((u, g) => {
      const T = n("LI", { class: "gul-field" }), x = n("DIV", { class: "gul-row" });
      if (x.append(n("SPAN", { class: "gul-name mono" }, V(u.name))), x.append(n("SPAN", { class: "gul-tag" }, u.type)), x.append(n("BUTTON", { class: `gul-listbtn${u.domain ? " on" : ""}`, title: "Coded-value list", onclick: () => Te(g) }, "list")), x.append(n("BUTTON", { class: "gul-ico del", onclick: () => ve(g) }, "&#10005;")), T.append(x), u.domain) {
        const b = n("INPUT", { class: "gul-input", style: "margin-top:6px", value: (u.domain || []).join(", "), placeholder: "Coded values, comma-separated" });
        b.addEventListener("change", () => Ee(g, b.value)), T.append(b);
      }
      a.append(T);
    }), t.append(a);
    const l = n("DIV", { class: "gul-add" }), o = n("INPUT", { class: "gul-input", placeholder: "field_name", value: j });
    o.addEventListener("input", () => {
      j = o.value;
    }), o.addEventListener("keydown", (u) => {
      u.key === "Enter" && ee();
    });
    const p = n("SELECT", { class: "gul-select", style: "width:auto;margin-top:0" });
    return et.forEach((u) => {
      const g = n("OPTION", { value: u.v }, u.label);
      u.v === _ && (g.selected = !0), p.append(g);
    }), p.addEventListener("change", () => {
      _ = p.value;
    }), l.append(o, p, n("BUTTON", { class: "gul-btn gul-btn-teal", onclick: () => ee() }, "+")), t.append(l), t;
  }
  function $e() {
    const e = n("DIV", { class: "gul-card" });
    e.append(n("P", { class: "gul-h" }, "Import GeoJSON (into active layer)"));
    const t = n("TEXTAREA", { class: "gul-ta", rows: "2", placeholder: '{"type":"FeatureCollection",...}' });
    return e.append(t), e.append(n("BUTTON", { class: "gul-btn gul-btn-ghost", style: "margin-top:6px", onclick: () => Le(t.value) }, "&#8593; Add to layer")), e;
  }
  function Ae(e) {
    const t = n("DIV", { class: "gul-card" });
    if (t.append(n("DIV", { class: "gul-h" }, `&#9678; ${V(e.name)} &middot; ${C.length} feature${C.length === 1 ? "" : "s"}`)), C.length) {
      const o = n("UL", { class: "gul-list", style: "max-height:160px;overflow-y:auto" });
      C.forEach((p, u) => {
        const g = n("LI", { class: `gul-li${f && f.oid === p.oid ? " active" : ""}` });
        g.append(n("SPAN", { class: "gul-dot", style: `background:${e.color}` })), g.append(n("BUTTON", { class: "gul-name", onclick: () => Y(e.id, p.oid) }, V(p.label || `Feature ${u + 1}`))), h && g.append(n("BUTTON", { class: "gul-ico del", title: "Delete feature", onclick: () => ne(e.id, p.oid) }, "&#10005;")), o.append(g);
      }), t.append(o);
    } else
      t.append(n("P", { class: "gul-hint" }, h ? "Ctrl/⌘-click the map to add a feature, or use Draw above." : "No features."));
    if (!f) return t;
    const a = n("DIV", { style: "margin-top:10px;border-top:1px solid rgba(15,16,6,.1);padding-top:10px" }), l = n("DIV", { class: "gul-between" });
    return l.append(n("DIV", { class: "gul-eyebrow" }, `Editing feature #${f.oid}`)), h && l.append(n("BUTTON", { class: "gul-ico del", title: "Delete feature", onclick: () => ne(f.layerId, f.oid) }, "&#10005; Delete")), a.append(l), t.append(a), N(e).forEach((o) => {
      const p = n("LABEL", { class: "gul-label" }, `<span class="mono" style="font-size:11px">${V(o.name)} · ${o.type}</span>`), u = f.attributes[o.name] ?? "";
      let g;
      if (o.domain)
        g = n("SELECT", { class: "gul-select" }), g.append(n("OPTION", { value: "" }, "—")), o.domain.forEach((T) => {
          const x = n("OPTION", { value: T }, T);
          String(u) === T && (x.selected = !0), g.append(x);
        });
      else {
        const T = o.type === "integer" || o.type === "decimal" ? "number" : o.type === "date" ? "date" : "text";
        g = n("INPUT", { class: "gul-input", type: T, value: u });
      }
      g.addEventListener("change", () => Ne(o.name, g.value)), p.append(g), t.append(p);
    }), t;
  }
  const V = (e) => String(e ?? "").replace(/[&<>"]/g, (t) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[t]);
  let W;
  this.init = async function() {
    [d, m, y, B, U] = await He([
      "esri/layers/FeatureLayer",
      "esri/layers/GraphicsLayer",
      "esri/widgets/Sketch/SketchViewModel",
      "esri/widgets/Expand",
      "esri/geometry/support/webMercatorUtils"
    ]), P = new m({ listMode: "hide" }), i.map.add(P), O = new y({ view: i, layer: P }), O.on("create", ke), E = n("DIV", { class: "gul" }), G = new B({
      view: i,
      content: E,
      expanded: !1,
      autoCollapse: !1,
      expandIconClass: "esri-icon-layer-list",
      expandTooltip: "User layers"
    }), i.ui.add(G, "top-left"), W = i.on("click", Oe), await F();
  }, this.destroy = function() {
    try {
      W && W.remove();
    } catch {
    }
    try {
      O && O.destroy();
    } catch {
    }
    G && (i.ui.remove(G), G = null), P && (i.map.remove(P), P = null);
    for (const e of v.values()) i.map.remove(e);
    v.clear(), E = null;
  };
};
class rt extends HTMLElement {
  constructor() {
    super(), this.plugin = null, this.viewer = null;
  }
  connectedCallback() {
    const i = this.closest("geocam-viewer");
    if (!i) {
      console.error("GeocamViewerUserLayers must be a child of GeocamViewer");
      return;
    }
    const s = this.getAttribute("src");
    if (!s) {
      console.warn("No src attribute on geocam-viewer-user-layers");
      return;
    }
    const c = () => {
      const d = i.viewer, m = i.querySelector(
        "geocam-viewer-arcgis-map, geocam-viewer-arcgis-scene"
      ), y = m && m.mapView;
      if (d && typeof d.plugin == "function" && y) {
        if (this.plugin) return;
        this.viewer = d, this.plugin = new it({ mapView: y, src: s }), this.viewer.plugin(this.plugin);
      } else
        setTimeout(c, 100);
    };
    c();
  }
  disconnectedCallback() {
    this.plugin && typeof this.plugin.destroy == "function" && this.plugin.destroy(), this.plugin = null, this.viewer = null;
  }
}
window.customElements.define("geocam-viewer-user-layers", rt);
export {
  rt as GeocamViewerUserLayers
};
