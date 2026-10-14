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
  var p = function() {
    i(r), r.removeEventListener("load", p, !1), c && r.removeEventListener("error", c, !1);
  };
  r.addEventListener("load", p, !1);
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
  [Je, r].forEach(function(p) {
    for (var y in p)
      Object.prototype.hasOwnProperty.call(p, y) && (i[y] = p[y]);
  });
  var s = i.version, c = i.url || de(s);
  return new le.Promise(function(p, y) {
    var h = pe();
    if (h) {
      var B = h.getAttribute("src");
      B !== c ? y(new Error("The ArcGIS API for JavaScript is already loaded (".concat(B, ")."))) : Q() ? p(h) : ie(h, p, y);
    } else if (Q())
      y(new Error("The ArcGIS API for JavaScript is already loaded."));
    else {
      var A = i.css;
      if (A) {
        var E = A === !0;
        Re(E ? s : A, i.insertCssBefore);
      }
      h = je(c), ie(h, function() {
        h.setAttribute("data-esri-loader", "loaded"), p(h);
      }, y), document.body.appendChild(h);
    }
  });
}
function re(r) {
  return new le.Promise(function(i, s) {
    var c = window.require.on("error", s);
    window.require(r, function() {
      for (var p = [], y = 0; y < arguments.length; y++)
        p[y] = arguments[y];
      c.remove(), i(p);
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
  for (const p in i)
    p === "class" ? c.className = i[p] : p.startsWith("on") && typeof i[p] == "function" ? c.addEventListener(p.slice(2), i[p]) : i[p] != null && c.setAttribute(p, i[p]);
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
], R = "#0d9488", nt = `
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
`, at = function(r = {}) {
  const { mapView: i, src: s } = r, c = s.replace("/rest/services/", "/rest/admin/services/");
  let p, y, h, B, A, E, G, P, O;
  const w = /* @__PURE__ */ new Map();
  let L = [], S = null, v = !1, N = !1, m = null, C = [], J = null, j = "", _ = "text";
  Ye("geocam-user-layers", nt);
  const ue = (e, t = {}) => fetch(`${e}?${new URLSearchParams({ f: "json", ...t })}`, { credentials: "same-origin" }).then((a) => a.json()), I = (e, t) => fetch(e, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ f: "json", ...t })
  }).then((a) => a.json()), T = () => L.find((e) => e.id === S) || null, U = (e) => We[e.geometryType] || "point";
  async function D() {
    var t;
    const e = await ue(s);
    v = /Editing|Create/.test(e.capabilities || ""), L = (e.layers || []).filter(Qe).map((a) => ({ visible: !0, ...a })), (S == null || !T()) && (S = ((t = L[0]) == null ? void 0 : t.id) ?? null), fe(), $(), z(), await q();
  }
  async function q() {
    C = [];
    const e = T(), t = e && w.get(e.id);
    if (t) {
      const a = e.labelField || "name";
      try {
        const { features: o } = await t.queryFeatures({ where: "1=1", outFields: ["id", a], returnGeometry: !1, orderByFields: ["id"] });
        C = o.map((l) => ({ oid: l.attributes.id ?? l.attributes[t.objectIdField], label: l.attributes[a] }));
      } catch {
        C = [];
      }
    }
    $();
  }
  async function ge(e, t) {
    H();
    const a = w.get(e);
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
    for (const [t, a] of [...w])
      e.has(t) || (i.map.remove(a), w.delete(t));
    for (const t of L) {
      let a = w.get(t.id);
      a || (a = new p({ url: `${s}/${t.id}`, outFields: ["*"] }), w.set(t.id, a), i.map.add(a)), a.visible = t.visible !== !1, ye(a, t);
    }
  }
  function me(e) {
    const t = w.get(e);
    t && (i.map.remove(t), w.delete(e));
  }
  function ye(e, t) {
    t.labelField ? (e.labelingInfo = [{
      labelExpressionInfo: { expression: `$feature.${t.labelField}` },
      symbol: { type: "text", color: "#222", haloColor: "#fff", haloSize: 1, font: { size: 10, weight: "bold" } }
    }], e.labelsVisible = !0) : (e.labelingInfo = null, e.labelsVisible = !1);
  }
  const M = (e) => {
    const t = w.get(e);
    t && t.refresh();
  };
  async function Z(e) {
    var o, l;
    const t = e ? { name: e.name, geometryType: e.geometryType, color: e.color, fields: e.fields } : { name: `Layer ${L.length + 1}`, geometryType: "esriGeometryPoint", color: K[L.length % K.length], fields: [{ name: "name", type: "text", domain: null }] }, a = await I(`${c}/addToDefinition`, { addToDefinition: JSON.stringify({ layers: [t] }) });
    S = ((l = (o = a == null ? void 0 : a.layers) == null ? void 0 : o[0]) == null ? void 0 : l.id) ?? S, m = null, await D();
  }
  async function be(e) {
    await I(`${c}/deleteFromDefinition`, { deleteFromDefinition: JSON.stringify({ layers: [{ id: e }] }) }), S === e && (S = null), m = null, await D();
  }
  async function F(e) {
    const t = T();
    t && (Object.assign(t, e), await I(`${c}/updateDefinition`, { updateDefinition: JSON.stringify({ layers: [{ id: t.id, ...e }] }) }), me(t.id), await D());
  }
  async function he(e) {
    var l, d;
    const t = T();
    if (!t || U(t) === e || t.count && !confirm("Changing geometry clears this layer's features. Continue?"))
      return;
    const a = oe.find((g) => g.v === e).esri;
    await I(`${c}/deleteFromDefinition`, { deleteFromDefinition: JSON.stringify({ layers: [{ id: t.id }] }) });
    const o = await I(`${c}/addToDefinition`, { addToDefinition: JSON.stringify({ layers: [{ name: t.name, geometryType: a, color: t.color, labelField: t.labelField, fields: t.fields }] }) });
    S = ((d = (l = o == null ? void 0 : o.layers) == null ? void 0 : l[0]) == null ? void 0 : d.id) ?? null, m = null, await D();
  }
  function we(e) {
    S = e, m = null, H(), $(), z(), q();
  }
  async function xe(e) {
    const t = L.find((o) => o.id === e);
    if (!t)
      return;
    t.visible = t.visible === !1;
    const a = w.get(e);
    a && (a.visible = t.visible), $();
  }
  const k = (e) => ((e == null ? void 0 : e.fields) || []).map((t) => ({ name: t.name, type: t.type || "text", domain: t.domain || null }));
  function ee() {
    const e = T(), t = j.trim().replace(/\s+/g, "_");
    !e || !t || k(e).some((a) => a.name === t) || (j = "", F({ fields: [...k(e), { name: t, type: _, domain: null }] }));
  }
  function ve(e) {
    const t = T();
    F({ fields: k(t).filter((a, o) => o !== e) });
  }
  function Te(e) {
    const t = T();
    F({ fields: k(t).map((a, o) => o === e ? { ...a, domain: a.domain ? null : [] } : a) });
  }
  function Ee(e, t) {
    const a = T();
    F({ fields: k(a).map((o, l) => l === e ? { ...o, domain: t.split(",").map((d) => d.trim()).filter(Boolean) } : o) });
  }
  async function Le(e) {
    const t = T();
    if (!t || !e.trim())
      return;
    let a;
    try {
      a = JSON.parse(e);
    } catch {
      alert("Invalid GeoJSON");
      return;
    }
    const l = (a.type === "FeatureCollection" ? a.features : a.type === "Feature" ? [a] : []).filter((d) => d && d.geometry).map((d) => ({
      geometry: Se(d.geometry),
      attributes: d.properties || {}
    })).filter((d) => d.geometry);
    l.length && (await I(`${s}/applyEdits`, { edits: JSON.stringify([{ id: t.id, adds: l }]) }), M(t.id), await D());
  }
  function Se(e) {
    const t = { wkid: 4326 };
    return e.type === "Point" ? { x: e.coordinates[0], y: e.coordinates[1], spatialReference: t } : e.type === "MultiPoint" ? { points: e.coordinates, spatialReference: t } : e.type === "LineString" ? { paths: [e.coordinates], spatialReference: t } : e.type === "MultiLineString" ? { paths: e.coordinates, spatialReference: t } : e.type === "Polygon" ? { rings: e.coordinates, spatialReference: t } : e.type === "MultiPolygon" ? { rings: e.coordinates.flat(), spatialReference: t } : null;
  }
  function z() {
    if (!O)
      return;
    try {
      O.cancel();
    } catch {
    }
    const e = T();
    N && v && e && O.create(Ze[U(e)]);
  }
  function Ie() {
    N = !N, N && (m = null), $(), z();
  }
  async function Ne(e) {
    var d, g, u;
    if (e.state !== "complete")
      return;
    const t = T();
    if (P.removeAll(), !t)
      return;
    const a = te(e.graphic.geometry), o = await I(`${s}/applyEdits`, { edits: JSON.stringify([{ id: t.id, adds: [{ geometry: a, attributes: {} }] }]) }), l = (u = (g = (d = o == null ? void 0 : o[0]) == null ? void 0 : d.addResults) == null ? void 0 : g[0]) == null ? void 0 : u.objectId;
    M(t.id), l != null ? (N = !1, await Y(t.id, l)) : z();
  }
  function te(e) {
    return (e.spatialReference && e.spatialReference.isWebMercator ? A.webMercatorToGeographic(e) : e).toJSON();
  }
  async function Y(e, t) {
    var l;
    const a = w.get(e);
    if (!a)
      return;
    S = e;
    const { features: o } = await a.queryFeatures({ objectIds: [t], outFields: ["*"], returnGeometry: !1 });
    m = { layerId: e, oid: t, attributes: ((l = o[0]) == null ? void 0 : l.attributes) || { id: t } }, ge(e, t), $();
  }
  async function ke(e, t) {
    m && (m.attributes[e] = t, await I(`${s}/applyEdits`, { edits: JSON.stringify([{ id: m.layerId, updates: [{ attributes: { id: m.oid, [e]: t } }] }]) }), M(m.layerId), q());
  }
  async function ne(e, t) {
    await I(`${s}/applyEdits`, { edits: JSON.stringify([{ id: e, deletes: [t] }]) }), m && m.oid === t && (m = null), H(), M(e), await D();
  }
  async function Pe(e) {
    const t = T();
    if (t)
      if (U(t) === "point") {
        const a = te(e.mapPoint);
        await I(`${s}/applyEdits`, { edits: JSON.stringify([{ id: t.id, adds: [{ geometry: a, attributes: {} }] }]) }), M(t.id), await q();
      } else
        N = !0, $(), z();
  }
  async function Oe(e) {
    var g, u, b;
    const t = e.native || {};
    if ((t.ctrlKey || t.metaKey) && v && T())
      return e.stopPropagation(), Pe(e);
    if (N || !v)
      return;
    const o = (await i.hitTest(e)).results.map((f) => f.graphic).find((f) => f && f.layer && [...w.values()].includes(f.layer));
    if (!o)
      return;
    const l = (g = [...w.entries()].find(([, f]) => f === o.layer)) == null ? void 0 : g[0], d = ((u = o.attributes) == null ? void 0 : u[o.layer.objectIdField]) ?? ((b = o.attributes) == null ? void 0 : b.id);
    l != null && d != null && (e.stopPropagation(), await Y(l, d));
  }
  function $() {
    if (!E)
      return;
    E.innerHTML = "", E.appendChild(Ce());
    const e = T();
    e && (E.appendChild(De(e)), v && E.appendChild(Fe(e)), v && E.appendChild($e()), E.appendChild(Ae(e)));
  }
  function Ce() {
    const e = n("DIV", { class: "gul-card" }), t = n("DIV", { class: "gul-between" });
    t.append(n("DIV", { class: "gul-h" }, "▦ Layers")), v && t.append(n("BUTTON", { class: "gul-btn gul-btn-teal", onclick: () => Z() }, "+ Add layer")), e.append(t);
    const a = n("UL", { class: "gul-list" });
    if (L.length || a.append(n("LI", { class: "gul-empty" }, "No layers yet")), L.forEach((o) => {
      const l = n("LI", { class: `gul-li${o.id === S ? " active" : ""}` });
      l.append(n("BUTTON", { class: "gul-ico", title: "Toggle visibility", onclick: () => xe(o.id) }, o.visible !== !1 ? "&#128065;" : "&#8856;")), l.append(n("SPAN", { class: "gul-dot", style: `background:${o.color}` })), l.append(n("BUTTON", { class: "gul-name", onclick: () => we(o.id) }, V(o.name))), l.append(n("SPAN", { class: "gul-count" }, String(o.count ?? 0))), v && L.length > 1 && l.append(n("BUTTON", { class: "gul-ico del", title: "Delete layer", onclick: () => be(o.id) }, "&#10005;")), a.append(l);
    }), e.append(a), v) {
      const o = n("DIV", { class: "gul-row", style: "flex-wrap:wrap;gap:6px;margin-top:8px;border-top:1px solid rgba(15,16,6,.1);padding-top:8px" });
      o.append(n("SPAN", { class: "gul-count" }, "From template:")), tt.forEach((l) => o.append(n("BUTTON", { class: "gul-chip", onclick: () => Z(l) }, l.name))), e.append(o);
    }
    return e;
  }
  function De(e) {
    const t = n("DIV", { class: "gul-card" });
    if (t.append(n("P", { class: "gul-eyebrow" }, `Layer: ${V(e.name)}`)), v) {
      const a = n("LABEL", { class: "gul-label" }, "<span>Name</span>"), o = n("INPUT", { class: "gul-input", value: e.name });
      o.addEventListener("change", () => F({ name: o.value })), a.append(o), t.append(a);
      const l = n("DIV", { class: "gul-label" }, "<span>Geometry</span>"), d = n("DIV", { class: "gul-seg" });
      oe.forEach((x) => d.append(n("BUTTON", { class: U(e) === x.v ? "on" : "", onclick: () => he(x.v) }, x.label))), l.append(d), t.append(l);
      const g = n("DIV", { class: "gul-label" }, "<span>&#127912; Symbol colour</span>"), u = n("DIV", { class: "gul-swatches" });
      K.forEach((x) => u.append(n("BUTTON", { class: `gul-sw${e.color === x ? " on" : ""}`, style: `background:${x}`, "aria-label": "colour", onclick: () => F({ color: x }) }))), g.append(u), t.append(g);
      const b = n("DIV", { class: "gul-label" }, "<span>&#127991; Label field</span>"), f = n("SELECT", { class: "gul-select" });
      f.append(n("OPTION", { value: "" }, "— no labels —")), k(e).forEach((x) => {
        const ae = n("OPTION", { value: x.name }, x.name);
        e.labelField === x.name && (ae.selected = !0), f.append(ae);
      }), f.addEventListener("change", () => F({ labelField: f.value || null })), b.append(f), b.append(n("SPAN", { class: "gul-hint" }, "Shows this field's value as a label on each feature.")), t.append(b);
    }
    if (v) {
      const a = n(
        "BUTTON",
        { class: `gul-btn ${N ? "gul-btn-teal" : "gul-btn-ghost"}`, style: "margin-top:10px", onclick: () => Ie() },
        N ? `Drawing ${U(e)} — click map (Esc/here to stop)` : `+ Draw ${U(e)}`
      );
      t.append(a), t.append(n("SPAN", { class: "gul-hint" }, "Tip: Ctrl/⌘-click the map to quick-add to this layer."));
    }
    return t;
  }
  function Fe(e) {
    const t = n("DIV", { class: "gul-card" });
    t.append(n("P", { class: "gul-h" }, "&#9776; Fields"));
    const a = n("UL", { class: "gul-list" });
    k(e).forEach((g, u) => {
      const b = n("LI", { class: "gul-field" }), f = n("DIV", { class: "gul-row" });
      if (f.append(n("SPAN", { class: "gul-name mono" }, V(g.name))), f.append(n("SPAN", { class: "gul-tag" }, g.type)), f.append(n("BUTTON", { class: `gul-listbtn${g.domain ? " on" : ""}`, title: "Coded-value list", onclick: () => Te(u) }, "list")), f.append(n("BUTTON", { class: "gul-ico del", onclick: () => ve(u) }, "&#10005;")), b.append(f), g.domain) {
        const x = n("INPUT", { class: "gul-input", style: "margin-top:6px", value: (g.domain || []).join(", "), placeholder: "Coded values, comma-separated" });
        x.addEventListener("change", () => Ee(u, x.value)), b.append(x);
      }
      a.append(b);
    }), t.append(a);
    const o = n("DIV", { class: "gul-add" }), l = n("INPUT", { class: "gul-input", placeholder: "field_name", value: j });
    l.addEventListener("input", () => {
      j = l.value;
    }), l.addEventListener("keydown", (g) => {
      g.key === "Enter" && ee();
    });
    const d = n("SELECT", { class: "gul-select", style: "width:auto;margin-top:0" });
    return et.forEach((g) => {
      const u = n("OPTION", { value: g.v }, g.label);
      g.v === _ && (u.selected = !0), d.append(u);
    }), d.addEventListener("change", () => {
      _ = d.value;
    }), o.append(l, d, n("BUTTON", { class: "gul-btn gul-btn-teal", onclick: () => ee() }, "+")), t.append(o), t;
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
      const l = n("UL", { class: "gul-list", style: "max-height:160px;overflow-y:auto" });
      C.forEach((d, g) => {
        const u = n("LI", { class: `gul-li${m && m.oid === d.oid ? " active" : ""}` });
        u.append(n("SPAN", { class: "gul-dot", style: `background:${e.color}` })), u.append(n("BUTTON", { class: "gul-name", onclick: () => Y(e.id, d.oid) }, V(d.label || `Feature ${g + 1}`))), v && u.append(n("BUTTON", { class: "gul-ico del", title: "Delete feature", onclick: () => ne(e.id, d.oid) }, "&#10005;")), l.append(u);
      }), t.append(l);
    } else
      t.append(n("P", { class: "gul-hint" }, v ? "Ctrl/⌘-click the map to add a feature, or use Draw above." : "No features."));
    if (!m)
      return t;
    const a = n("DIV", { style: "margin-top:10px;border-top:1px solid rgba(15,16,6,.1);padding-top:10px" }), o = n("DIV", { class: "gul-between" });
    return o.append(n("DIV", { class: "gul-eyebrow" }, `Editing feature #${m.oid}`)), v && o.append(n("BUTTON", { class: "gul-ico del", title: "Delete feature", onclick: () => ne(m.layerId, m.oid) }, "&#10005; Delete")), a.append(o), t.append(a), k(e).forEach((l) => {
      const d = n("LABEL", { class: "gul-label" }, `<span class="mono" style="font-size:11px">${V(l.name)} · ${l.type}</span>`), g = m.attributes[l.name] ?? "";
      let u;
      if (l.domain)
        u = n("SELECT", { class: "gul-select" }), u.append(n("OPTION", { value: "" }, "—")), l.domain.forEach((b) => {
          const f = n("OPTION", { value: b }, b);
          String(g) === b && (f.selected = !0), u.append(f);
        });
      else {
        const b = l.type === "integer" || l.type === "decimal" ? "number" : l.type === "date" ? "date" : "text";
        u = n("INPUT", { class: "gul-input", type: b, value: g });
      }
      u.addEventListener("change", () => ke(l.name, u.value)), d.append(u), t.append(d);
    }), t;
  }
  const V = (e) => String(e ?? "").replace(/[&<>"]/g, (t) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[t]);
  let W;
  this.init = async function() {
    [p, y, h, B, A] = await He([
      "esri/layers/FeatureLayer",
      "esri/layers/GraphicsLayer",
      "esri/widgets/Sketch/SketchViewModel",
      "esri/widgets/Expand",
      "esri/geometry/support/webMercatorUtils"
    ]), P = new y({ listMode: "hide" }), i.map.add(P), O = new h({ view: i, layer: P }), O.on("create", Ne), E = n("DIV", { class: "gul" }), G = new B({
      view: i,
      content: E,
      expanded: !1,
      autoCollapse: !1,
      expandIconClass: "esri-icon-layer-list",
      expandTooltip: "User layers"
    }), i.ui.add(G, "top-left"), W = i.on("click", Oe), await D();
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
    for (const e of w.values())
      i.map.remove(e);
    w.clear(), E = null;
  };
};
class it extends HTMLElement {
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
      const p = i.viewer, y = i.querySelector(
        "geocam-viewer-arcgis-map, geocam-viewer-arcgis-scene"
      ), h = y && y.mapView;
      if (p && typeof p.plugin == "function" && h) {
        if (this.plugin)
          return;
        this.viewer = p, this.plugin = new at({ mapView: h, src: s }), this.viewer.plugin(this.plugin);
      } else
        setTimeout(c, 100);
    };
    c();
  }
  disconnectedCallback() {
    this.plugin && typeof this.plugin.destroy == "function" && this.plugin.destroy(), this.plugin = null, this.viewer = null;
  }
}
window.customElements.define("geocam-viewer-user-layers", it);
export {
  it as GeocamViewerUserLayers
};
