// ============================================================
// Eurostat Indexation Tool
// ============================================================

const EUROSTAT_BASE =
  "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data";

// ---------- EU countries / aggregates ----------
const COUNTRIES = [
  { code: "EA",         label: "Euro area (changing composition)" },
  { code: "EA20",       label: "Euro area – 20 countries" },
  { code: "EA19",       label: "Euro area – 19 countries" },
  { code: "EU27_2020",  label: "European Union – 27 countries" },
  { code: "AT",         label: "Austria" },
  { code: "BE",         label: "Belgium" },
  { code: "BG",         label: "Bulgaria" },
  { code: "HR",         label: "Croatia" },
  { code: "CY",         label: "Cyprus" },
  { code: "CZ",         label: "Czechia" },
  { code: "DK",         label: "Denmark" },
  { code: "EE",         label: "Estonia" },
  { code: "FI",         label: "Finland" },
  { code: "FR",         label: "France" },
  { code: "DE",         label: "Germany" },
  { code: "EL",         label: "Greece" },
  { code: "HU",         label: "Hungary" },
  { code: "IE",         label: "Ireland" },
  { code: "IT",         label: "Italy" },
  { code: "LV",         label: "Latvia" },
  { code: "LT",         label: "Lithuania" },
  { code: "LU",         label: "Luxembourg" },
  { code: "MT",         label: "Malta" },
  { code: "NL",         label: "Netherlands" },
  { code: "PL",         label: "Poland" },
  { code: "PT",         label: "Portugal" },
  { code: "RO",         label: "Romania" },
  { code: "SK",         label: "Slovakia" },
  { code: "SI",         label: "Slovenia" },
  { code: "ES",         label: "Spain" },
  { code: "SE",         label: "Sweden" },
];

// ---------- Default datasets (HICP, PPI, Energy) ----------
const DEFAULT_DATASETS = [
  {
    id: "hicp",
    label: "HICP – Harmonised Index of Consumer Prices",
    code: "prc_hicp_midx",
    params: { unit: "I15", coicop: "CP00", geo: "EA" },
    period: "M",
  },
  {
    id: "ppi",
    label: "PPI – Producer Price Index (Industry, NSA)",
    code: "sts_inppd_m",
    params: { s_adj: "NSA", unit: "I21", nace_r2: "B-E36", geo: "EA20" },
    period: "M",
  },
  {
    id: "energy_hh_elec",
    label: "Energy – Household electricity prices (S2)",
    code: "nrg_pc_204",
    params: {
      nrg_prod: "6000",
      nrg_cons: "KWH2500-4999",
      unit: "KWH",
      currency: "EUR",
      tax: "I_TAX",
      geo: "EU27_2020",
    },
    period: "S",
  },
];

// ---------- Railway-sector preset (finance & procurement) ----------
const RAILWAY_PRESETS = [
  {
    id: "hicp_rail_pax",
    label: "HICP – Passenger transport by railway",
    code: "prc_hicp_midx",
    params: { unit: "I15", coicop: "CP0731", geo: "EA" },
    period: "M",
  },
  {
    id: "hicp_transport_fuels",
    label: "HICP – Fuels & lubricants for personal transport",
    code: "prc_hicp_midx",
    params: { unit: "I15", coicop: "CP0722", geo: "EA" },
    period: "M",
  },
  {
    id: "hicp_electricity",
    label: "HICP – Electricity (consumer)",
    code: "prc_hicp_midx",
    params: { unit: "I15", coicop: "CP0451", geo: "EA" },
    period: "M",
  },
  {
    id: "ppi_basic_metals",
    label: "PPI – Basic metals (rails, steel)",
    code: "sts_inppd_m",
    params: { s_adj: "NSA", unit: "I21", nace_r2: "C24", geo: "EA20" },
    period: "M",
  },
  {
    id: "ppi_electrical_eq",
    label: "PPI – Electrical equipment (traction, signalling)",
    code: "sts_inppd_m",
    params: { s_adj: "NSA", unit: "I21", nace_r2: "C27", geo: "EA20" },
    period: "M",
  },
  {
    id: "ppi_machinery",
    label: "PPI – Machinery & equipment (rolling stock components)",
    code: "sts_inppd_m",
    params: { s_adj: "NSA", unit: "I21", nace_r2: "C28", geo: "EA20" },
    period: "M",
  },
  {
    id: "ppi_other_transport_eq",
    label: "PPI – Other transport equipment (locomotives, wagons – C30)",
    code: "sts_inppd_m",
    params: { s_adj: "NSA", unit: "I21", nace_r2: "C30", geo: "EA20" },
    period: "M",
  },
  {
    id: "ppi_energy",
    label: "PPI – Electricity, gas, steam supply (industrial energy)",
    code: "sts_inppd_m",
    params: { s_adj: "NSA", unit: "I21", nace_r2: "D35", geo: "EA20" },
    period: "M",
  },
  {
    id: "construction_cost",
    label: "Construction – Producer prices, civil engineering",
    code: "sts_copi_q",
    params: { s_adj: "NSA", unit: "I15", indic_bt: "PRC_PRR", cc: "CC2", geo: "EA20" },
    period: "Q",
  },
  {
    id: "labour_cost_industry",
    label: "Labour cost index – Industry & services (B-S)",
    code: "lc_lci_r2_q",
    params: { s_adj: "NSA", unit: "I20", lcstruct: "D1_D4_MD5", nace_r2: "B-S", geo: "EA20" },
    period: "Q",
  },
  {
    id: "service_ppi_land_transport",
    label: "Service producer prices – Land transport (H49)",
    code: "sts_sepp_q",
    params: { s_adj: "NSA", unit: "I15", nace_r2: "H49", geo: "EA20" },
    period: "Q",
  },
  {
    id: "energy_nonhh_elec",
    label: "Energy – Non-household electricity prices",
    code: "nrg_pc_205",
    params: {
      nrg_prod: "6000",
      nrg_cons: "MWH500-1999",
      unit: "KWH",
      currency: "EUR",
      tax: "X_TAX",
      geo: "EU27_2020",
    },
    period: "S",
  },
];

// ---------- State ----------
const SCHEMA_VERSION = 3;
function migrateDatasets() {
  const savedVersion = load("schemaVersion", 1);
  if (savedVersion < SCHEMA_VERSION) {
    save("datasets", DEFAULT_DATASETS);
    save("schemaVersion", SCHEMA_VERSION);
  }
}
migrateDatasets();

const state = {
  datasets: load("datasets", DEFAULT_DATASETS),
  country: load("country", ""), // "" = use each dataset's own geo
  series: {}, // id -> [{period, value}]
  lastRefresh: null,
  autoRefresh: load("autoRefresh", false),
  autoRefreshTimer: null,
  calcRows: load("calcRows", [
    {
      desc: "Sample contract",
      basePrice: 1000,
      baseDate: "",
      indexId: "hicp",
      targetDate: "",
    },
  ]),
  supplierRows: load("supplierRows", []),
  supplierConfig: load("supplierConfig", {
    indexId: "hicp",
    baseDate: "",
    targetDate: "",
    threshold: 2,
  }),
};

function load(key, fallback) {
  try {
    const raw = localStorage.getItem("eit_" + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function save(key, value) {
  try {
    localStorage.setItem("eit_" + key, JSON.stringify(value));
  } catch {}
}

// ============================================================
// Eurostat fetch + JSON-stat parsing
// ============================================================

async function fetchDataset(dataset) {
  const params = { ...dataset.params };
  if (state.country && "geo" in params) params.geo = state.country;
  const qs = new URLSearchParams({ format: "JSON", lang: "EN", ...params });
  const url = `${EUROSTAT_BASE}/${dataset.code}?${qs.toString()}`;
  const resp = await fetch(url);
  if (!resp.ok) {
    let detail = "";
    try {
      const body = await resp.text();
      const j = JSON.parse(body);
      detail = j?.error?.label || j?.error?.[0]?.label || body.slice(0, 160);
    } catch {}
    throw new Error(`HTTP ${resp.status} ${dataset.code}${detail ? " – " + detail : ""}`);
  }
  const data = await resp.json();
  return parseJsonStat(data);
}

function parseJsonStat(data) {
  if (!data?.dimension?.time) throw new Error("Missing time dimension");
  const timeCat = data.dimension.time.category;
  const indexMap = timeCat.index || {};
  const values = data.value || {};

  const ids = data.id || [];
  const sizes = data.size || [];
  const timePos = ids.indexOf("time");

  // strides for flat index calculation
  const strides = new Array(ids.length).fill(1);
  for (let i = ids.length - 2; i >= 0; i--) strides[i] = strides[i + 1] * sizes[i + 1];

  // Other dims locked to first index (single-value filters expected)
  const fixed = new Array(ids.length).fill(0);

  const series = [];
  for (const [period, idx] of Object.entries(indexMap)) {
    fixed[timePos] = idx;
    let v = null;
    // Try the single-cell flat index first
    let flat = 0;
    for (let d = 0; d < ids.length; d++) flat += fixed[d] * strides[d];
    v = values[flat] ?? values[String(flat)];
    // If not found and there are multiple cells per period, find first non-null
    // whose flat index has the matching time component.
    if (v == null && timePos >= 0) {
      const timeStride = strides[timePos];
      const timeBlock = sizes[timePos] ? Math.floor(flat / (sizes[timePos] * timeStride)) * (sizes[timePos] * timeStride) + idx * timeStride : flat;
      for (let off = 0; off < timeStride; off++) {
        const k = timeBlock + off;
        if (values[k] != null) { v = values[k]; break; }
        if (values[String(k)] != null) { v = values[String(k)]; break; }
      }
    }
    if (v != null && !Number.isNaN(Number(v))) {
      series.push({ period, value: Number(v) });
    }
  }
  series.sort((a, b) => comparePeriod(a.period, b.period));
  return series;
}

// Compare Eurostat period strings: 2024M03, 2024S1, 2024Q2, 2024
function comparePeriod(a, b) {
  return periodKey(a) - periodKey(b);
}
function periodKey(p) {
  const m = p.match(/^(\d{4})(?:([MQS])(\d{1,2}))?$/);
  if (!m) return 0;
  const y = Number(m[1]);
  const t = m[2];
  const n = Number(m[3] || 0);
  if (t === "M") return y * 100 + n;
  if (t === "Q") return y * 100 + n * 3;
  if (t === "S") return y * 100 + n * 6;
  return y * 100;
}

// ============================================================
// Index lookup helpers
// ============================================================

function findIndexValue(series, period) {
  // exact match first
  let exact = series.find((s) => s.period === period);
  if (exact) return exact;
  // best-effort: parse user input "2024-03" → "2024M03"
  const norm = normalizeUserPeriod(period);
  if (norm) {
    exact = series.find((s) => s.period === norm);
    if (exact) return exact;
  }
  return null;
}

function normalizeUserPeriod(input) {
  if (!input) return null;
  const s = String(input).trim();
  // 2024-03 → 2024M03
  let m = s.match(/^(\d{4})-(\d{1,2})$/);
  if (m) return `${m[1]}M${m[2].padStart(2, "0")}`;
  // 2024S1 / 2024Q2 / 2024M03 already
  if (/^\d{4}[MQS]\d{1,2}$/.test(s)) return s;
  // 2024
  if (/^\d{4}$/.test(s)) return s;
  return s;
}

function changePct(curr, prev) {
  if (prev == null || prev === 0) return null;
  return ((curr - prev) / prev) * 100;
}

function momYoy(series, periodType) {
  if (series.length === 0) return { last: null, prev: null, yearAgo: null, mom: null, yoy: null };
  const last = series[series.length - 1];
  const prev = series[series.length - 2] || null;
  const lookback = periodType === "M" ? 12 : periodType === "Q" ? 4 : periodType === "S" ? 2 : 1;
  const yearAgo = series[series.length - 1 - lookback] || null;
  return {
    last,
    prev,
    yearAgo,
    mom: prev ? changePct(last.value, prev.value) : null,
    yoy: yearAgo ? changePct(last.value, yearAgo.value) : null,
  };
}

// ============================================================
// Rendering: Dashboard
// ============================================================

function renderDashboard() {
  const container = document.getElementById("indexCards");
  container.innerHTML = "";
  for (const ds of state.datasets) {
    const series = state.series[ds.id] || [];
    const { last, mom, yoy } = momYoy(series, ds.period);
    const card = document.createElement("div");
    card.className = "idx-card";
    card.innerHTML = `
      <div class="label">${escapeHtml(ds.label)}</div>
      <div class="code">${escapeHtml(ds.code)}</div>
      <div class="value">${last ? formatNumber(last.value) : "—"}</div>
      <div class="period">${last ? `Period: ${last.period}` : "No data loaded"}</div>
      <div class="changes">
        ${renderChangeTag("MoM", mom)}
        ${renderChangeTag("YoY", yoy)}
      </div>
    `;
    container.appendChild(card);
  }

  const sel = document.getElementById("historySelect");
  const prev = sel.value;
  sel.innerHTML = state.datasets
    .map((d) => `<option value="${d.id}">${escapeHtml(d.label)}</option>`)
    .join("");
  if (prev && state.datasets.some((d) => d.id === prev)) sel.value = prev;
  renderHistory(sel.value);
}

function renderHistory(id) {
  const ds = state.datasets.find((d) => d.id === id);
  const series = state.series[id] || [];
  const tbody = document.querySelector("#historyTable tbody");
  tbody.innerHTML = "";
  const lookback = ds && ds.period === "M" ? 12 : ds && ds.period === "Q" ? 4 : ds && ds.period === "S" ? 2 : 1;
  const recent = series.slice(-24).reverse();
  for (let i = 0; i < recent.length; i++) {
    const row = recent[i];
    const realIdx = series.length - 1 - i;
    const prev = series[realIdx - 1];
    const yearAgo = series[realIdx - lookback];
    const mom = prev ? changePct(row.value, prev.value) : null;
    const yoy = yearAgo ? changePct(row.value, yearAgo.value) : null;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.period}</td>
      <td>${formatNumber(row.value)}</td>
      <td>${renderChangeTag("", mom)}</td>
      <td>${renderChangeTag("", yoy)}</td>
    `;
    tbody.appendChild(tr);
  }
}

function renderChangeTag(label, pct) {
  if (pct == null) return `<span class="change-tag neu">${label ? `<span class="lbl">${label}</span>` : ""}—</span>`;
  const cls = pct > 0 ? "pos" : pct < 0 ? "neg" : "neu";
  const sign = pct > 0 ? "+" : "";
  return `<span class="change-tag ${cls}">${label ? `<span class="lbl">${label}</span>` : ""}${sign}${pct.toFixed(2)}%</span>`;
}

// ============================================================
// Rendering: Calculator
// ============================================================

function renderCalculator() {
  const tbody = document.querySelector("#calcTable tbody");
  tbody.innerHTML = "";
  state.calcRows.forEach((row, i) => {
    const tr = document.createElement("tr");
    const dsOptions = state.datasets
      .map((d) => `<option value="${d.id}" ${d.id === row.indexId ? "selected" : ""}>${escapeHtml(d.label)}</option>`)
      .join("");

    const calc = computeCalcRow(row);
    tr.innerHTML = `
      <td><input data-i="${i}" data-k="desc" value="${escapeAttr(row.desc || "")}" /></td>
      <td><input data-i="${i}" data-k="basePrice" type="number" step="0.01" value="${row.basePrice ?? ""}" /></td>
      <td><input data-i="${i}" data-k="baseDate" placeholder="2023-01" value="${escapeAttr(row.baseDate || "")}" /></td>
      <td><select data-i="${i}" data-k="indexId">${dsOptions}</select></td>
      <td><input data-i="${i}" data-k="targetDate" placeholder="2024-01" value="${escapeAttr(row.targetDate || "")}" /></td>
      <td class="num">${calc.baseIdx != null ? formatNumber(calc.baseIdx) : "—"}</td>
      <td class="num">${calc.targetIdx != null ? formatNumber(calc.targetIdx) : "—"}</td>
      <td class="num"><strong>${calc.newPrice != null ? formatNumber(calc.newPrice) : "—"}</strong></td>
      <td class="num">${calc.absChange != null ? formatNumber(calc.absChange) : "—"}</td>
      <td class="num">${renderChangeTag("", calc.pctChange)}</td>
      <td><button class="btn btn-danger" data-del="${i}">✕</button></td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll("input, select").forEach((el) => {
    el.addEventListener("input", updateCalcModel);
    el.addEventListener("change", () => { updateCalcModel({ target: el }); renderCalculator(); });
  });
  tbody.querySelectorAll("button[data-del]").forEach((b) => {
    b.addEventListener("click", () => {
      state.calcRows.splice(Number(b.dataset.del), 1);
      save("calcRows", state.calcRows);
      renderCalculator();
    });
  });
}

function updateCalcModel(e) {
  const i = Number(e.target.dataset.i);
  const k = e.target.dataset.k;
  const v = e.target.type === "number" ? (e.target.value === "" ? null : Number(e.target.value)) : e.target.value;
  state.calcRows[i][k] = v;
  save("calcRows", state.calcRows);
}

function computeCalcRow(row) {
  const ds = state.datasets.find((d) => d.id === row.indexId);
  if (!ds) return { baseIdx: null, targetIdx: null, newPrice: null, absChange: null, pctChange: null };
  const series = state.series[ds.id] || [];
  const base = findIndexValue(series, row.baseDate);
  const target = findIndexValue(series, row.targetDate);
  const baseIdx = base?.value ?? null;
  const targetIdx = target?.value ?? null;
  let newPrice = null,
    absChange = null,
    pctChange = null;
  if (row.basePrice != null && baseIdx != null && targetIdx != null && baseIdx !== 0) {
    newPrice = row.basePrice * (targetIdx / baseIdx);
    absChange = newPrice - row.basePrice;
    pctChange = (absChange / row.basePrice) * 100;
  }
  return { baseIdx, targetIdx, newPrice, absChange, pctChange };
}

// ============================================================
// Rendering: Supplier verification
// ============================================================

function renderSupplier() {
  // populate config
  const sel = document.getElementById("supIndex");
  sel.innerHTML = state.datasets
    .map((d) => `<option value="${d.id}" ${d.id === state.supplierConfig.indexId ? "selected" : ""}>${escapeHtml(d.label)}</option>`)
    .join("");
  document.getElementById("supBaseDate").value = state.supplierConfig.baseDate || "";
  document.getElementById("supTargetDate").value = state.supplierConfig.targetDate || "";
  document.getElementById("supThreshold").value = state.supplierConfig.threshold;

  const tbody = document.querySelector("#supplierTable tbody");
  tbody.innerHTML = "";
  const cfg = state.supplierConfig;
  const ds = state.datasets.find((d) => d.id === cfg.indexId);
  const series = ds ? state.series[ds.id] || [] : [];
  const base = findIndexValue(series, cfg.baseDate);
  const target = findIndexValue(series, cfg.targetDate);
  const indexPct =
    base && target && base.value !== 0 ? ((target.value - base.value) / base.value) * 100 : null;

  state.supplierRows.forEach((row, i) => {
    const supplierPct =
      row.base_price && Number(row.base_price) !== 0
        ? ((Number(row.new_price) - Number(row.base_price)) / Number(row.base_price)) * 100
        : null;
    const deviation =
      supplierPct != null && indexPct != null ? supplierPct - indexPct : null;
    const status = evaluateStatus(deviation, cfg.threshold);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input data-i="${i}" data-k="supplier" value="${escapeAttr(row.supplier || "")}" /></td>
      <td><input data-i="${i}" data-k="product" value="${escapeAttr(row.product || "")}" /></td>
      <td><input data-i="${i}" data-k="base_price" type="number" step="0.01" value="${row.base_price ?? ""}" /></td>
      <td><input data-i="${i}" data-k="new_price" type="number" step="0.01" value="${row.new_price ?? ""}" /></td>
      <td class="num">${supplierPct != null ? supplierPct.toFixed(2) + "%" : "—"}</td>
      <td class="num">${indexPct != null ? indexPct.toFixed(2) + "%" : "—"}</td>
      <td class="num">${deviation != null ? (deviation > 0 ? "+" : "") + deviation.toFixed(2) + " pp" : "—"}</td>
      <td><span class="status-tag ${status.cls}">${status.label}</span></td>
      <td><button class="btn btn-danger" data-del="${i}">✕</button></td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll("input").forEach((el) => {
    el.addEventListener("input", (e) => {
      const i = Number(e.target.dataset.i);
      const k = e.target.dataset.k;
      const v = e.target.type === "number" ? (e.target.value === "" ? null : Number(e.target.value)) : e.target.value;
      state.supplierRows[i][k] = v;
      save("supplierRows", state.supplierRows);
    });
  });
  tbody.querySelectorAll("button[data-del]").forEach((b) => {
    b.addEventListener("click", () => {
      state.supplierRows.splice(Number(b.dataset.del), 1);
      save("supplierRows", state.supplierRows);
      renderSupplier();
    });
  });
}

function evaluateStatus(deviation, threshold) {
  if (deviation == null) return { cls: "yellow", label: "INCOMPLETE" };
  const abs = Math.abs(deviation);
  if (abs <= threshold) return { cls: "green", label: "OK" };
  if (abs <= threshold * 2) return { cls: "yellow", label: "REVIEW" };
  return { cls: "red", label: "ALERT" };
}

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
  if (lines.length === 0) return [];
  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const idxSup = header.indexOf("supplier");
  const idxProd = header.indexOf("product");
  const idxBase = header.indexOf("base_price");
  const idxNew = header.indexOf("new_price");
  return lines.slice(1).map((l) => {
    const cells = splitCsvLine(l);
    return {
      supplier: idxSup >= 0 ? cells[idxSup] : "",
      product: idxProd >= 0 ? cells[idxProd] : "",
      base_price: idxBase >= 0 ? Number(cells[idxBase]) : null,
      new_price: idxNew >= 0 ? Number(cells[idxNew]) : null,
    };
  });
}

function splitCsvLine(line) {
  const out = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') inQ = false;
      else cur += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === ",") { out.push(cur.trim()); cur = ""; }
      else cur += c;
    }
  }
  out.push(cur.trim());
  return out;
}

// ============================================================
// Rendering: Settings (datasets)
// ============================================================

function renderDatasets() {
  const tbody = document.querySelector("#datasetTable tbody");
  tbody.innerHTML = "";
  state.datasets.forEach((ds, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input data-i="${i}" data-k="label" value="${escapeAttr(ds.label)}" /></td>
      <td><input data-i="${i}" data-k="code" value="${escapeAttr(ds.code)}" /></td>
      <td><input data-i="${i}" data-k="params" value="${escapeAttr(paramsToString(ds.params))}" placeholder="key=value&amp;key2=value2" /></td>
      <td>
        <select data-i="${i}" data-k="period">
          ${["M", "Q", "S", "A"].map((p) => `<option value="${p}" ${p === ds.period ? "selected" : ""}>${p}</option>`).join("")}
        </select>
      </td>
      <td><button class="btn btn-danger" data-del="${i}">✕</button></td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll("input, select").forEach((el) => {
    el.addEventListener("input", (e) => {
      const i = Number(e.target.dataset.i);
      const k = e.target.dataset.k;
      if (k === "params") {
        state.datasets[i].params = stringToParams(e.target.value);
      } else {
        state.datasets[i][k] = e.target.value;
      }
    });
  });
  tbody.querySelectorAll("button[data-del]").forEach((b) => {
    b.addEventListener("click", () => {
      state.datasets.splice(Number(b.dataset.del), 1);
      renderDatasets();
    });
  });
}

function paramsToString(params) {
  return Object.entries(params || {})
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
}
function stringToParams(s) {
  const out = {};
  s.split("&").forEach((kv) => {
    const [k, v] = kv.split("=");
    if (k && v != null) out[k.trim()] = v.trim();
  });
  return out;
}

// ============================================================
// Refresh / fetching
// ============================================================

async function refreshAll() {
  setStatus("loading", "Loading…");
  const errors = [];
  await Promise.all(
    state.datasets.map(async (ds) => {
      try {
        const series = await fetchDataset(ds);
        state.series[ds.id] = series;
      } catch (e) {
        errors.push(`${ds.label}: ${e.message}`);
        state.series[ds.id] = state.series[ds.id] || [];
      }
    })
  );
  state.lastRefresh = new Date();
  document.getElementById("lastRefresh").textContent = state.lastRefresh.toLocaleString();
  renderDashboard();
  renderCalculator();
  renderSupplier();
  if (errors.length === 0) {
    setStatus("ok", "Connected");
    toast(`Refreshed ${state.datasets.length} dataset(s)`, "ok");
  } else {
    setStatus("err", `${errors.length} error(s)`);
    toast(errors.join("\n"), "err");
  }
}

function setStatus(kind, label) {
  const el = document.getElementById("connStatus");
  el.className = "status-pill " + kind;
  el.textContent = label;
}

function toast(msg, kind = "") {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = "toast show " + kind;
  setTimeout(() => (t.className = "toast " + kind), 3200);
}

// ============================================================
// Export
// ============================================================

function exportXlsx() {
  if (typeof XLSX === "undefined") {
    toast("SheetJS not loaded", "err");
    return;
  }
  const wb = XLSX.utils.book_new();

  // Sheet 1 — Raw index data
  const rawRows = [["Dataset ID", "Label", "Code", "Period", "Value"]];
  for (const ds of state.datasets) {
    const series = state.series[ds.id] || [];
    for (const s of series) rawRows.push([ds.id, ds.label, ds.code, s.period, s.value]);
  }
  const ws1 = XLSX.utils.aoa_to_sheet(rawRows);
  XLSX.utils.book_append_sheet(wb, ws1, "Index data");

  // Sheet 2 — Indexation calculations
  const calcRows = [[
    "Description", "Base price", "Base date", "Index", "Target date",
    "Index base", "Index target", "Indexed price", "Δ abs", "Δ %",
  ]];
  for (const row of state.calcRows) {
    const c = computeCalcRow(row);
    const ds = state.datasets.find((d) => d.id === row.indexId);
    calcRows.push([
      row.desc,
      row.basePrice,
      row.baseDate,
      ds ? ds.label : row.indexId,
      row.targetDate,
      c.baseIdx,
      c.targetIdx,
      c.newPrice,
      c.absChange,
      c.pctChange,
    ]);
  }
  const ws2 = XLSX.utils.aoa_to_sheet(calcRows);
  XLSX.utils.book_append_sheet(wb, ws2, "Calculations");

  // Sheet 3 — Supplier verification
  const cfg = state.supplierConfig;
  const ds = state.datasets.find((d) => d.id === cfg.indexId);
  const series = ds ? state.series[ds.id] || [] : [];
  const base = findIndexValue(series, cfg.baseDate);
  const target = findIndexValue(series, cfg.targetDate);
  const indexPct =
    base && target && base.value !== 0
      ? ((target.value - base.value) / base.value) * 100
      : null;

  const supRows = [[
    "Supplier", "Product", "Base price", "New price",
    "Supplier Δ%", "Index Δ%", "Deviation pp", "Status",
  ]];
  for (const r of state.supplierRows) {
    const supplierPct =
      r.base_price && Number(r.base_price) !== 0
        ? ((Number(r.new_price) - Number(r.base_price)) / Number(r.base_price)) * 100
        : null;
    const deviation = supplierPct != null && indexPct != null ? supplierPct - indexPct : null;
    const status = evaluateStatus(deviation, cfg.threshold);
    supRows.push([
      r.supplier, r.product, r.base_price, r.new_price,
      supplierPct, indexPct, deviation, status.label,
    ]);
  }
  const ws3 = XLSX.utils.aoa_to_sheet(supRows);
  XLSX.utils.book_append_sheet(wb, ws3, "Supplier verification");

  const filename = `indexation-${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, filename);
  toast("Excel exported", "ok");
}

function exportPdf() {
  // Browser print → save as PDF
  window.print();
}

// ============================================================
// Helpers
// ============================================================

function formatNumber(n) {
  if (n == null || Number.isNaN(n)) return "—";
  return Number(n).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}
function escapeAttr(s) { return escapeHtml(s); }

// ============================================================
// Wire-up
// ============================================================

function setupTabs() {
  document.querySelectorAll(".tab").forEach((t) => {
    t.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((x) => x.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((x) => x.classList.remove("active"));
      t.classList.add("active");
      document.getElementById("tab-" + t.dataset.tab).classList.add("active");
    });
  });
}

function setupAutoRefresh() {
  const cb = document.getElementById("autoRefresh");
  cb.checked = !!state.autoRefresh;
  applyAutoRefresh();
  cb.addEventListener("change", () => {
    state.autoRefresh = cb.checked;
    save("autoRefresh", state.autoRefresh);
    applyAutoRefresh();
  });
}
function applyAutoRefresh() {
  if (state.autoRefreshTimer) {
    clearInterval(state.autoRefreshTimer);
    state.autoRefreshTimer = null;
  }
  if (state.autoRefresh) {
    state.autoRefreshTimer = setInterval(refreshAll, 24 * 60 * 60 * 1000);
  }
}

function setupCountry() {
  const sel = document.getElementById("countrySelect");
  sel.innerHTML =
    `<option value="">Dataset default</option>` +
    COUNTRIES.map(
      (c) => `<option value="${c.code}" ${c.code === state.country ? "selected" : ""}>${escapeHtml(c.label)} (${c.code})</option>`
    ).join("");
  sel.addEventListener("change", () => {
    state.country = sel.value;
    save("country", state.country);
    refreshAll();
  });
}

function init() {
  setupTabs();
  setupCountry();
  setupAutoRefresh();

  document.getElementById("refreshBtn").addEventListener("click", refreshAll);
  document.getElementById("historySelect").addEventListener("change", (e) => renderHistory(e.target.value));

  document.getElementById("addCalcRow").addEventListener("click", () => {
    state.calcRows.push({
      desc: "",
      basePrice: null,
      baseDate: "",
      indexId: state.datasets[0]?.id || "",
      targetDate: "",
    });
    save("calcRows", state.calcRows);
    renderCalculator();
  });
  document.getElementById("recalcBtn").addEventListener("click", renderCalculator);

  document.getElementById("addSupplierRow").addEventListener("click", () => {
    state.supplierRows.push({ supplier: "", product: "", base_price: null, new_price: null });
    save("supplierRows", state.supplierRows);
    renderSupplier();
  });
  document.getElementById("evalSuppliers").addEventListener("click", () => {
    state.supplierConfig = {
      indexId: document.getElementById("supIndex").value,
      baseDate: document.getElementById("supBaseDate").value,
      targetDate: document.getElementById("supTargetDate").value,
      threshold: Number(document.getElementById("supThreshold").value) || 0,
    };
    save("supplierConfig", state.supplierConfig);
    renderSupplier();
  });
  document.getElementById("csvInput").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    const rows = parseCsv(text);
    state.supplierRows = state.supplierRows.concat(rows);
    save("supplierRows", state.supplierRows);
    renderSupplier();
    toast(`Imported ${rows.length} row(s)`, "ok");
    e.target.value = "";
  });

  document.getElementById("addDataset").addEventListener("click", () => {
    state.datasets.push({
      id: "ds_" + Math.random().toString(36).slice(2, 7),
      label: "New dataset",
      code: "",
      params: {},
      period: "M",
    });
    renderDatasets();
  });
  document.getElementById("addRailwayPreset").addEventListener("click", () => {
    const existingIds = new Set(state.datasets.map((d) => d.id));
    let added = 0;
    for (const p of RAILWAY_PRESETS) {
      if (!existingIds.has(p.id)) {
        state.datasets.push(JSON.parse(JSON.stringify(p)));
        added++;
      }
    }
    renderDatasets();
    toast(`Added ${added} railway preset(s) (click Save & refresh)`, "ok");
  });
  document.getElementById("resetDatasets").addEventListener("click", () => {
    state.datasets = JSON.parse(JSON.stringify(DEFAULT_DATASETS));
    renderDatasets();
    toast("Datasets reset to defaults", "ok");
  });
  document.getElementById("saveDatasets").addEventListener("click", async () => {
    save("datasets", state.datasets);
    toast("Datasets saved", "ok");
    await refreshAll();
  });

  document.getElementById("exportXlsx").addEventListener("click", exportXlsx);
  document.getElementById("exportPdf").addEventListener("click", exportPdf);

  renderDashboard();
  renderCalculator();
  renderSupplier();
  renderDatasets();

  refreshAll();
}

document.addEventListener("DOMContentLoaded", init);
