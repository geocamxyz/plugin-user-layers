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
function ze(r) {
  return document.querySelector('link[href*="'.concat(r, '"]'));
}
function Me(r) {
  return !r || ce(r) ? Ve(r) : r;
}
function Je(r, i) {
  var s = Me(r), c = ze(s);
  return c || (c = Be(s), Ge(c, i)), c;
}
var Re = {};
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
function He(r) {
  r === void 0 && (r = {});
  var i = {};
  [Re, r].forEach(function(p) {
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
      var U = i.css;
      if (U) {
        var E = U === !0;
        Je(E ? s : U, i.insertCssBefore);
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
function _e(r, i) {
  if (i === void 0 && (i = {}), Q())
    return re(r);
  var s = pe(), c = s && s.getAttribute("src");
  return !i.url && c && (i.url = c), He(i).then(function() {
    return re(r);
  });
}
const a = (r, i = {}, s) => {
  const c = document.createElement(r);
  for (const p in i)
    p === "class" ? c.className = i[p] : p.startsWith("on") && typeof i[p] == "function" ? c.addEventListener(p.slice(2), i[p]) : i[p] != null && c.setAttribute(p, i[p]);
  return s != null && (c.innerHTML = s), c;
}, We = (r, i) => {
  document.getElementById(r) || document.getElementsByTagName("head")[0].prepend(a("STYLE", { id: r, type: "text/css" }, i));
}, oe = [
  { v: "point", label: "Point", esri: "esriGeometryPoint" },
  { v: "polyline", label: "Line", esri: "esriGeometryPolyline" },
  { v: "polygon", label: "Polygon", esri: "esriGeometryPolygon" }
], Ye = { esriGeometryPoint: "point", esriGeometryPolyline: "polyline", esriGeometryPolygon: "polygon" }, Ke = { point: "point", polyline: "polyline", polygon: "polygon" }, K = ["#dc2626", "#d97706", "#059669", "#0284c7", "#7c3aed", "#0e0f06"], Xe = [
  { v: "text", label: "Text" },
  { v: "integer", label: "Integer" },
  { v: "decimal", label: "Decimal" },
  { v: "date", label: "Date" }
], Qe = [
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
], J = "#0d9488", Ze = (r) => {
  const i = String(r || "").replace("#", "");
  return /^[0-9a-fA-F]{6}$/.test(i) ? [0, 2, 4].map((s) => parseInt(i.slice(s, s + 2), 16)) : [217, 119, 6];
}, et = `
  .gul { width: 320px; max-height: 78vh; overflow-y: auto; font: 13px/1.4 system-ui, sans-serif; color: #1f2328; }
  .gul-card { background: #fff; border: 1px solid rgba(15,16,6,.1); border-radius: 14px; box-shadow: 0 1px 2px rgba(0,0,0,.06); padding: 12px; margin-bottom: 10px; }
  .gul-row { display: flex; align-items: center; gap: 8px; }
  .gul-between { display: flex; align-items: center; justify-content: space-between; }
  .gul-h { font-size: 12px; font-weight: 600; color: rgba(31,35,40,.6); display: flex; align-items: center; gap: 6px; }
  .gul-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: rgba(31,35,40,.4); }
  .gul-btn { display: inline-flex; align-items: center; gap: 4px; border-radius: 8px; padding: 5px 9px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1px solid transparent; }
  .gul-btn-teal { background: ${J}; color: #fff; }
  .gul-btn-ghost { background: #fff; border-color: rgba(15,16,6,.15); color: #1f2328; }
  .gul-btn-ghost:hover { background: rgba(15,16,6,.04); }
  .gul-chip { border: 1px solid rgba(15,16,6,.15); border-radius: 6px; padding: 2px 7px; font-size: 11px; cursor: pointer; color: #1f2328; background: #fff; }
  .gul-chip:hover { background: rgba(15,16,6,.05); }
  .gul-list { list-style: none; margin: 8px 0 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
  .gul-li { display: flex; align-items: center; gap: 8px; border: 1px solid rgba(15,16,6,.1); border-radius: 8px; padding: 6px 8px; }
  .gul-li.active { border-color: ${J}; background: rgba(13,148,136,.06); }
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
  .gul-seg button.on { background: ${J}; color: #fff; border-color: ${J}; }
  .gul-swatches { display: flex; gap: 6px; margin-top: 4px; }
  .gul-sw { width: 26px; height: 26px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; }
  .gul-sw.on { border-color: rgba(31,35,40,.4); box-shadow: 0 0 0 2px #fff inset; }
  .gul-hint { display: block; margin-top: 4px; font-size: 11px; color: rgba(31,35,40,.45); }
  .gul-field { border: 1px solid rgba(15,16,6,.1); border-radius: 8px; padding: 8px; }
  .gul-field .mono { font-family: ui-monospace, monospace; font-size: 12px; }
  .gul-tag { background: rgba(15,16,6,.05); border-radius: 5px; padding: 1px 6px; font-size: 11px; color: rgba(31,35,40,.6); }
  .gul-listbtn { border: none; background: none; border-radius: 5px; padding: 1px 6px; font-size: 11px; font-weight: 600; cursor: pointer; color: rgba(31,35,40,.4); }
  .gul-listbtn.on { background: rgba(13,148,136,.15); color: ${J}; }
  .gul-add { display: flex; gap: 6px; margin-top: 8px; }
  .gul-add .gul-input { margin-top: 0; }
  .gul-ta { width: 100%; box-sizing: border-box; margin-top: 6px; border: 1px solid rgba(15,16,6,.15); border-radius: 8px; padding: 7px; font-family: ui-monospace, monospace; font-size: 11px; }
  .gul-msg { font-size: 12px; color: rgba(31,35,40,.55); margin: 0 0 8px; }
  .gul-empty { color: rgba(31,35,40,.45); font-style: italic; font-size: 12px; }
`, tt = function(r = {}) {
  const { mapView: i, src: s } = r, c = s.replace("/rest/services/", "/rest/admin/services/");
  let p, y, h, B, U, E, G, P, O;
  const T = /* @__PURE__ */ new Map();
  let L = [], S = null, x = !1, I = !1, m = null, C = [], R = null, j = "", H = "text";
  We("geocam-user-layers", et);
  const ue = (e, t = {}) => fetch(`${e}?${new URLSearchParams({ f: "json", ...t })}`, { credentials: "same-origin" }).then((n) => n.json()), k = (e, t) => fetch(e, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ f: "json", ...t })
  }).then((n) => n.json()), v = () => L.find((e) => e.id === S) || null, D = (e) => Ye[e.geometryType] || "point";
  async function F() {
    var t;
    const e = await ue(s);
    x = /Editing|Create/.test(e.capabilities || ""), L = (e.layers || []).map((n) => ({ visible: !0, ...n })), (S == null || !v()) && (S = ((t = L[0]) == null ? void 0 : t.id) ?? null), fe(), A(), M(), await q();
  }
  async function q() {
    C = [];
    const e = v(), t = e && T.get(e.id);
    if (t) {
      const n = e.labelField || "name";
      try {
        const { features: o } = await t.queryFeatures({ where: "1=1", outFields: ["id", n], returnGeometry: !1, orderByFields: ["id"] });
        C = o.map((l) => ({ oid: l.attributes.id ?? l.attributes[t.objectIdField], label: l.attributes[n] }));
      } catch {
        C = [];
      }
    }
    A();
  }
  async function ge(e, t) {
    _();
    const n = T.get(e);
    if (n)
      try {
        R = (await i.whenLayerView(n)).highlight(t);
      } catch {
      }
  }
  function _() {
    try {
      R && R.remove();
    } catch {
    }
    R = null;
  }
  function fe() {
    const e = new Set(L.map((t) => t.id));
    for (const [t, n] of [...T])
      e.has(t) || (i.map.remove(n), T.delete(t));
    for (const t of L) {
      let n = T.get(t.id);
      n || (n = new p({ url: `${s}/${t.id}`, outFields: ["*"] }), T.set(t.id, n), i.map.add(n)), n.visible = t.visible !== !1, n.renderer = me(D(t), t.color), ye(n, t);
    }
  }
  function me(e, t) {
    const n = Ze(t);
    return e === "point" ? { type: "simple", symbol: { type: "simple-marker", style: "circle", color: n, size: 8, outline: { color: [255, 255, 255], width: 1 } } } : e === "polyline" ? { type: "simple", symbol: { type: "simple-line", color: n, width: 2 } } : { type: "simple", symbol: { type: "simple-fill", color: n.concat(0.3), outline: { color: n, width: 2 } } };
  }
  function ye(e, t) {
    t.labelField ? (e.labelingInfo = [{
      labelExpressionInfo: { expression: `$feature.${t.labelField}` },
      symbol: { type: "text", color: "#222", haloColor: "#fff", haloSize: 1, font: { size: 10, weight: "bold" } }
    }], e.labelsVisible = !0) : (e.labelingInfo = null, e.labelsVisible = !1);
  }
  const z = (e) => {
    const t = T.get(e);
    t && t.refresh();
  };
  async function Z(e) {
    var o, l;
    const t = e ? { name: e.name, geometryType: e.geometryType, color: e.color, fields: e.fields } : { name: `Layer ${L.length + 1}`, geometryType: "esriGeometryPoint", color: K[L.length % K.length], fields: [{ name: "name", type: "text", domain: null }] }, n = await k(`${c}/addToDefinition`, { addToDefinition: JSON.stringify({ layers: [t] }) });
    S = ((l = (o = n == null ? void 0 : n.layers) == null ? void 0 : o[0]) == null ? void 0 : l.id) ?? S, m = null, await F();
  }
  async function be(e) {
    await k(`${c}/deleteFromDefinition`, { deleteFromDefinition: JSON.stringify({ layers: [{ id: e }] }) }), S === e && (S = null), m = null, await F();
  }
  async function $(e) {
    const t = v();
    t && (Object.assign(t, e), await k(`${c}/updateDefinition`, { updateDefinition: JSON.stringify({ layers: [{ id: t.id, ...e }] }) }), await F());
  }
  async function he(e) {
    var l, d;
    const t = v();
    if (!t || D(t) === e || t.count && !confirm("Changing geometry clears this layer's features. Continue?"))
      return;
    const n = oe.find((g) => g.v === e).esri;
    await k(`${c}/deleteFromDefinition`, { deleteFromDefinition: JSON.stringify({ layers: [{ id: t.id }] }) });
    const o = await k(`${c}/addToDefinition`, { addToDefinition: JSON.stringify({ layers: [{ name: t.name, geometryType: n, color: t.color, labelField: t.labelField, fields: t.fields }] }) });
    S = ((d = (l = o == null ? void 0 : o.layers) == null ? void 0 : l[0]) == null ? void 0 : d.id) ?? null, m = null, await F();
  }
  function we(e) {
    S = e, m = null, _(), A(), M(), q();
  }
  async function xe(e) {
    const t = L.find((o) => o.id === e);
    if (!t)
      return;
    t.visible = t.visible === !1;
    const n = T.get(e);
    n && (n.visible = t.visible), A();
  }
  const N = (e) => ((e == null ? void 0 : e.fields) || []).map((t) => ({ name: t.name, type: t.type || "text", domain: t.domain || null }));
  function ee() {
    const e = v(), t = j.trim().replace(/\s+/g, "_");
    !e || !t || N(e).some((n) => n.name === t) || (j = "", $({ fields: [...N(e), { name: t, type: H, domain: null }] }));
  }
  function ve(e) {
    const t = v();
    $({ fields: N(t).filter((n, o) => o !== e) });
  }
  function Te(e) {
    const t = v();
    $({ fields: N(t).map((n, o) => o === e ? { ...n, domain: n.domain ? null : [] } : n) });
  }
  function Ee(e, t) {
    const n = v();
    $({ fields: N(n).map((o, l) => l === e ? { ...o, domain: t.split(",").map((d) => d.trim()).filter(Boolean) } : o) });
  }
  async function Le(e) {
    const t = v();
    if (!t || !e.trim())
      return;
    let n;
    try {
      n = JSON.parse(e);
    } catch {
      alert("Invalid GeoJSON");
      return;
    }
    const l = (n.type === "FeatureCollection" ? n.features : n.type === "Feature" ? [n] : []).filter((d) => d && d.geometry).map((d) => ({
      geometry: Se(d.geometry),
      attributes: d.properties || {}
    })).filter((d) => d.geometry);
    l.length && (await k(`${s}/applyEdits`, { edits: JSON.stringify([{ id: t.id, adds: l }]) }), z(t.id), await F());
  }
  function Se(e) {
    const t = { wkid: 4326 };
    return e.type === "Point" ? { x: e.coordinates[0], y: e.coordinates[1], spatialReference: t } : e.type === "MultiPoint" ? { points: e.coordinates, spatialReference: t } : e.type === "LineString" ? { paths: [e.coordinates], spatialReference: t } : e.type === "MultiLineString" ? { paths: e.coordinates, spatialReference: t } : e.type === "Polygon" ? { rings: e.coordinates, spatialReference: t } : e.type === "MultiPolygon" ? { rings: e.coordinates.flat(), spatialReference: t } : null;
  }
  function M() {
    if (!O)
      return;
    try {
      O.cancel();
    } catch {
    }
    const e = v();
    I && x && e && O.create(Ke[D(e)]);
  }
  function ke() {
    I = !I, I && (m = null), A(), M();
  }
  async function Ie(e) {
    var d, g, u;
    if (e.state !== "complete")
      return;
    const t = v();
    if (P.removeAll(), !t)
      return;
    const n = te(e.graphic.geometry), o = await k(`${s}/applyEdits`, { edits: JSON.stringify([{ id: t.id, adds: [{ geometry: n, attributes: {} }] }]) }), l = (u = (g = (d = o == null ? void 0 : o[0]) == null ? void 0 : d.addResults) == null ? void 0 : g[0]) == null ? void 0 : u.objectId;
    z(t.id), l != null ? (I = !1, await W(t.id, l)) : M();
  }
  function te(e) {
    return (e.spatialReference && e.spatialReference.isWebMercator ? U.webMercatorToGeographic(e) : e).toJSON();
  }
  async function W(e, t) {
    var l;
    const n = T.get(e);
    if (!n)
      return;
    S = e;
    const { features: o } = await n.queryFeatures({ objectIds: [t], outFields: ["*"], returnGeometry: !1 });
    m = { layerId: e, oid: t, attributes: ((l = o[0]) == null ? void 0 : l.attributes) || { id: t } }, ge(e, t), A();
  }
  async function Ne(e, t) {
    m && (m.attributes[e] = t, await k(`${s}/applyEdits`, { edits: JSON.stringify([{ id: m.layerId, updates: [{ attributes: { id: m.oid, [e]: t } }] }]) }), z(m.layerId), q());
  }
  async function ne(e, t) {
    await k(`${s}/applyEdits`, { edits: JSON.stringify([{ id: e, deletes: [t] }]) }), m && m.oid === t && (m = null), _(), z(e), await F();
  }
  async function Pe(e) {
    const t = v();
    if (t)
      if (D(t) === "point") {
        const n = te(e.mapPoint);
        await k(`${s}/applyEdits`, { edits: JSON.stringify([{ id: t.id, adds: [{ geometry: n, attributes: {} }] }]) }), z(t.id), await q();
      } else
        I = !0, A(), M();
  }
  async function Oe(e) {
    var g, u, b;
    const t = e.native || {};
    if ((t.ctrlKey || t.metaKey) && x && v())
      return e.stopPropagation(), Pe(e);
    if (I || !x)
      return;
    const o = (await i.hitTest(e)).results.map((f) => f.graphic).find((f) => f && f.layer && [...T.values()].includes(f.layer));
    if (!o)
      return;
    const l = (g = [...T.entries()].find(([, f]) => f === o.layer)) == null ? void 0 : g[0], d = ((u = o.attributes) == null ? void 0 : u[o.layer.objectIdField]) ?? ((b = o.attributes) == null ? void 0 : b.id);
    l != null && d != null && (e.stopPropagation(), await W(l, d));
  }
  function A() {
    if (!E)
      return;
    E.innerHTML = "", E.appendChild(Ce());
    const e = v();
    e && (E.appendChild(De(e)), x && E.appendChild(Fe(e)), x && E.appendChild($e()), E.appendChild(Ae(e)));
  }
  function Ce() {
    const e = a("DIV", { class: "gul-card" }), t = a("DIV", { class: "gul-between" });
    t.append(a("DIV", { class: "gul-h" }, "▦ Layers")), x && t.append(a("BUTTON", { class: "gul-btn gul-btn-teal", onclick: () => Z() }, "+ Add layer")), e.append(t);
    const n = a("UL", { class: "gul-list" });
    if (L.length || n.append(a("LI", { class: "gul-empty" }, "No layers yet")), L.forEach((o) => {
      const l = a("LI", { class: `gul-li${o.id === S ? " active" : ""}` });
      l.append(a("BUTTON", { class: "gul-ico", title: "Toggle visibility", onclick: () => xe(o.id) }, o.visible !== !1 ? "&#128065;" : "&#8856;")), l.append(a("SPAN", { class: "gul-dot", style: `background:${o.color}` })), l.append(a("BUTTON", { class: "gul-name", onclick: () => we(o.id) }, V(o.name))), l.append(a("SPAN", { class: "gul-count" }, String(o.count ?? 0))), x && L.length > 1 && l.append(a("BUTTON", { class: "gul-ico del", title: "Delete layer", onclick: () => be(o.id) }, "&#10005;")), n.append(l);
    }), e.append(n), x) {
      const o = a("DIV", { class: "gul-row", style: "flex-wrap:wrap;gap:6px;margin-top:8px;border-top:1px solid rgba(15,16,6,.1);padding-top:8px" });
      o.append(a("SPAN", { class: "gul-count" }, "From template:")), Qe.forEach((l) => o.append(a("BUTTON", { class: "gul-chip", onclick: () => Z(l) }, l.name))), e.append(o);
    }
    return e;
  }
  function De(e) {
    const t = a("DIV", { class: "gul-card" });
    if (t.append(a("P", { class: "gul-eyebrow" }, `Layer: ${V(e.name)}`)), x) {
      const n = a("LABEL", { class: "gul-label" }, "<span>Name</span>"), o = a("INPUT", { class: "gul-input", value: e.name });
      o.addEventListener("change", () => $({ name: o.value })), n.append(o), t.append(n);
      const l = a("DIV", { class: "gul-label" }, "<span>Geometry</span>"), d = a("DIV", { class: "gul-seg" });
      oe.forEach((w) => d.append(a("BUTTON", { class: D(e) === w.v ? "on" : "", onclick: () => he(w.v) }, w.label))), l.append(d), t.append(l);
      const g = a("DIV", { class: "gul-label" }, "<span>&#127912; Symbol colour</span>"), u = a("DIV", { class: "gul-swatches" });
      K.forEach((w) => u.append(a("BUTTON", { class: `gul-sw${e.color === w ? " on" : ""}`, style: `background:${w}`, "aria-label": "colour", onclick: () => $({ color: w }) }))), g.append(u), t.append(g);
      const b = a("DIV", { class: "gul-label" }, "<span>&#127991; Label field</span>"), f = a("SELECT", { class: "gul-select" });
      f.append(a("OPTION", { value: "" }, "— no labels —")), N(e).forEach((w) => {
        const ae = a("OPTION", { value: w.name }, w.name);
        e.labelField === w.name && (ae.selected = !0), f.append(ae);
      }), f.addEventListener("change", () => $({ labelField: f.value || null })), b.append(f), b.append(a("SPAN", { class: "gul-hint" }, "Shows this field's value as a label on each feature.")), t.append(b);
    }
    if (x) {
      const n = a(
        "BUTTON",
        { class: `gul-btn ${I ? "gul-btn-teal" : "gul-btn-ghost"}`, style: "margin-top:10px", onclick: () => ke() },
        I ? `Drawing ${D(e)} — click map (Esc/here to stop)` : `+ Draw ${D(e)}`
      );
      t.append(n), t.append(a("SPAN", { class: "gul-hint" }, "Tip: Ctrl/⌘-click the map to quick-add to this layer."));
    }
    return t;
  }
  function Fe(e) {
    const t = a("DIV", { class: "gul-card" });
    t.append(a("P", { class: "gul-h" }, "&#9776; Fields"));
    const n = a("UL", { class: "gul-list" });
    N(e).forEach((g, u) => {
      const b = a("LI", { class: "gul-field" }), f = a("DIV", { class: "gul-row" });
      if (f.append(a("SPAN", { class: "gul-name mono" }, V(g.name))), f.append(a("SPAN", { class: "gul-tag" }, g.type)), f.append(a("BUTTON", { class: `gul-listbtn${g.domain ? " on" : ""}`, title: "Coded-value list", onclick: () => Te(u) }, "list")), f.append(a("BUTTON", { class: "gul-ico del", onclick: () => ve(u) }, "&#10005;")), b.append(f), g.domain) {
        const w = a("INPUT", { class: "gul-input", style: "margin-top:6px", value: (g.domain || []).join(", "), placeholder: "Coded values, comma-separated" });
        w.addEventListener("change", () => Ee(u, w.value)), b.append(w);
      }
      n.append(b);
    }), t.append(n);
    const o = a("DIV", { class: "gul-add" }), l = a("INPUT", { class: "gul-input", placeholder: "field_name", value: j });
    l.addEventListener("input", () => {
      j = l.value;
    }), l.addEventListener("keydown", (g) => {
      g.key === "Enter" && ee();
    });
    const d = a("SELECT", { class: "gul-select", style: "width:auto;margin-top:0" });
    return Xe.forEach((g) => {
      const u = a("OPTION", { value: g.v }, g.label);
      g.v === H && (u.selected = !0), d.append(u);
    }), d.addEventListener("change", () => {
      H = d.value;
    }), o.append(l, d, a("BUTTON", { class: "gul-btn gul-btn-teal", onclick: () => ee() }, "+")), t.append(o), t;
  }
  function $e() {
    const e = a("DIV", { class: "gul-card" });
    e.append(a("P", { class: "gul-h" }, "Import GeoJSON (into active layer)"));
    const t = a("TEXTAREA", { class: "gul-ta", rows: "2", placeholder: '{"type":"FeatureCollection",...}' });
    return e.append(t), e.append(a("BUTTON", { class: "gul-btn gul-btn-ghost", style: "margin-top:6px", onclick: () => Le(t.value) }, "&#8593; Add to layer")), e;
  }
  function Ae(e) {
    const t = a("DIV", { class: "gul-card" });
    if (t.append(a("DIV", { class: "gul-h" }, `&#9678; ${V(e.name)} &middot; ${C.length} feature${C.length === 1 ? "" : "s"}`)), C.length) {
      const l = a("UL", { class: "gul-list", style: "max-height:160px;overflow-y:auto" });
      C.forEach((d, g) => {
        const u = a("LI", { class: `gul-li${m && m.oid === d.oid ? " active" : ""}` });
        u.append(a("SPAN", { class: "gul-dot", style: `background:${e.color}` })), u.append(a("BUTTON", { class: "gul-name", onclick: () => W(e.id, d.oid) }, V(d.label || `Feature ${g + 1}`))), x && u.append(a("BUTTON", { class: "gul-ico del", title: "Delete feature", onclick: () => ne(e.id, d.oid) }, "&#10005;")), l.append(u);
      }), t.append(l);
    } else
      t.append(a("P", { class: "gul-hint" }, x ? "Ctrl/⌘-click the map to add a feature, or use Draw above." : "No features."));
    if (!m)
      return t;
    const n = a("DIV", { style: "margin-top:10px;border-top:1px solid rgba(15,16,6,.1);padding-top:10px" }), o = a("DIV", { class: "gul-between" });
    return o.append(a("DIV", { class: "gul-eyebrow" }, `Editing feature #${m.oid}`)), x && o.append(a("BUTTON", { class: "gul-ico del", title: "Delete feature", onclick: () => ne(m.layerId, m.oid) }, "&#10005; Delete")), n.append(o), t.append(n), N(e).forEach((l) => {
      const d = a("LABEL", { class: "gul-label" }, `<span class="mono" style="font-size:11px">${V(l.name)} · ${l.type}</span>`), g = m.attributes[l.name] ?? "";
      let u;
      if (l.domain)
        u = a("SELECT", { class: "gul-select" }), u.append(a("OPTION", { value: "" }, "—")), l.domain.forEach((b) => {
          const f = a("OPTION", { value: b }, b);
          String(g) === b && (f.selected = !0), u.append(f);
        });
      else {
        const b = l.type === "integer" || l.type === "decimal" ? "number" : l.type === "date" ? "date" : "text";
        u = a("INPUT", { class: "gul-input", type: b, value: g });
      }
      u.addEventListener("change", () => Ne(l.name, u.value)), d.append(u), t.append(d);
    }), t;
  }
  const V = (e) => String(e ?? "").replace(/[&<>"]/g, (t) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[t]);
  let Y;
  this.init = async function() {
    [p, y, h, B, U] = await _e([
      "esri/layers/FeatureLayer",
      "esri/layers/GraphicsLayer",
      "esri/widgets/Sketch/SketchViewModel",
      "esri/widgets/Expand",
      "esri/geometry/support/webMercatorUtils"
    ]), P = new y({ listMode: "hide" }), i.map.add(P), O = new h({ view: i, layer: P }), O.on("create", Ie), E = a("DIV", { class: "gul" }), G = new B({
      view: i,
      content: E,
      expanded: !1,
      autoCollapse: !1,
      expandIconClass: "esri-icon-layer-list",
      expandTooltip: "User layers"
    }), i.ui.add(G, "top-left"), Y = i.on("click", Oe), await F();
  }, this.destroy = function() {
    try {
      Y && Y.remove();
    } catch {
    }
    try {
      O && O.destroy();
    } catch {
    }
    G && (i.ui.remove(G), G = null), P && (i.map.remove(P), P = null);
    for (const e of T.values())
      i.map.remove(e);
    T.clear(), E = null;
  };
};
class nt extends HTMLElement {
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
        this.viewer = p, this.plugin = new tt({ mapView: h, src: s }), this.viewer.plugin(this.plugin);
      } else
        setTimeout(c, 100);
    };
    c();
  }
  disconnectedCallback() {
    this.plugin && typeof this.plugin.destroy == "function" && this.plugin.destroy(), this.plugin = null, this.viewer = null;
  }
}
window.customElements.define("geocam-viewer-user-layers", nt);
export {
  nt as GeocamViewerUserLayers
};
