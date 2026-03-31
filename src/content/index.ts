import type { MessageType } from "../shared/messaging";

const CONTAINER_ID = "__qwm_overlay__";

let overlayRoot: HTMLDivElement | null = null;
let shadowRoot: ShadowRoot | null = null;

chrome.runtime.onMessage.addListener(
  (message: MessageType, _sender, sendResponse) => {
    if (message.action === "inject-fake-ui") {
      injectFakeUI();
      sendResponse({ success: true });
      return false;
    }

    if (message.action === "dismiss-fake-ui") {
      dismissFakeUI();
      sendResponse({ success: true });
      return false;
    }

    return false;
  },
);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && overlayRoot) {
    dismissFakeUI();
  }
});

function injectFakeUI(): void {
  if (document.getElementById(CONTAINER_ID)) return;

  overlayRoot = document.createElement("div");
  overlayRoot.id = CONTAINER_ID;
  overlayRoot.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    z-index: 2147483647 !important;
    background: #fff !important;
  `;

  shadowRoot = overlayRoot.attachShadow({ mode: "closed" });

  const style = document.createElement("style");
  style.textContent = getFakeUIStyles();
  shadowRoot.appendChild(style);

  const app = document.createElement("div");
  app.innerHTML = buildFakeDashboardHTML();
  shadowRoot.appendChild(app);

  document.body.appendChild(overlayRoot);
  enableCellInteraction(shadowRoot);
}

function dismissFakeUI(): void {
  const el = document.getElementById(CONTAINER_ID);
  if (el) {
    el.remove();
    overlayRoot = null;
    shadowRoot = null;
  }
}

function enableCellInteraction(root: ShadowRoot): void {
  root.querySelectorAll(".cell").forEach((cell) => {
    cell.addEventListener("click", () => {
      root.querySelectorAll(".cell.selected").forEach((c) =>
        c.classList.remove("selected"),
      );
      cell.classList.add("selected");
    });
  });
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatCurrency(n: number): string {
  return "$" + n.toLocaleString("en-US");
}

function buildFakeDashboardHTML(): string {
  const departments = [
    "Engineering",
    "Marketing",
    "Sales",
    "Operations",
    "Finance",
    "Human Resources",
    "Product",
    "Customer Success",
    "Legal",
    "IT Infrastructure",
    "Research & Development",
    "Business Development",
    "Quality Assurance",
    "Data Analytics",
    "Supply Chain",
  ];

  const months = [
    "2025-10-01",
    "2025-10-08",
    "2025-10-15",
    "2025-10-22",
    "2025-11-01",
    "2025-11-08",
    "2025-11-15",
    "2025-11-22",
    "2025-12-01",
    "2025-12-08",
    "2025-12-15",
    "2025-12-22",
    "2026-01-05",
    "2026-01-12",
    "2026-01-19",
  ];

  let rows = "";
  for (let i = 0; i < departments.length; i++) {
    const revenue = randomBetween(120000, 980000);
    const expenses = randomBetween(80000, revenue - 10000);
    const net = revenue - expenses;
    const margin = ((net / revenue) * 100).toFixed(1);
    const rowClass = i % 2 === 0 ? "row-even" : "row-odd";

    rows += `
      <tr class="${rowClass}">
        <td class="cell row-num">${i + 1}</td>
        <td class="cell">${months[i]}</td>
        <td class="cell">${departments[i]}</td>
        <td class="cell num">${formatCurrency(revenue)}</td>
        <td class="cell num">${formatCurrency(expenses)}</td>
        <td class="cell num ${net > 0 ? "positive" : "negative"}">${formatCurrency(net)}</td>
        <td class="cell num">${margin}%</td>
        <td class="cell status">${net / revenue > 0.2 ? "On Track" : net / revenue > 0.1 ? "Review" : "At Risk"}</td>
      </tr>`;
  }

  const totalRevenue = randomBetween(5000000, 12000000);
  const totalExpenses = randomBetween(3000000, totalRevenue - 500000);
  const totalNet = totalRevenue - totalExpenses;
  const totalMargin = ((totalNet / totalRevenue) * 100).toFixed(1);

  return `
    <div class="excel-app">
      <div class="title-bar">
        <div class="title-left">
          <span class="app-icon">📊</span>
          <span class="file-name">Q4_Financial_Summary_2025_CONFIDENTIAL.xlsx - Excel</span>
        </div>
        <div class="title-right">
          <span class="title-btn">—</span>
          <span class="title-btn">☐</span>
          <span class="title-btn close">✕</span>
        </div>
      </div>

      <div class="ribbon">
        <div class="ribbon-tabs">
          <span class="rtab">File</span>
          <span class="rtab active">Home</span>
          <span class="rtab">Insert</span>
          <span class="rtab">Page Layout</span>
          <span class="rtab">Formulas</span>
          <span class="rtab">Data</span>
          <span class="rtab">Review</span>
          <span class="rtab">View</span>
        </div>
        <div class="ribbon-toolbar">
          <div class="tool-group">
            <div class="tool-group-label">Clipboard</div>
            <div class="tool-buttons">
              <button class="tbtn">📋 Paste</button>
              <button class="tbtn small">✂ Cut</button>
              <button class="tbtn small">📄 Copy</button>
            </div>
          </div>
          <div class="separator"></div>
          <div class="tool-group">
            <div class="tool-group-label">Font</div>
            <div class="tool-buttons">
              <select class="font-select"><option>Calibri</option></select>
              <select class="size-select"><option>11</option></select>
              <button class="tbtn icon"><b>B</b></button>
              <button class="tbtn icon"><i>I</i></button>
              <button class="tbtn icon"><u>U</u></button>
            </div>
          </div>
          <div class="separator"></div>
          <div class="tool-group">
            <div class="tool-group-label">Alignment</div>
            <div class="tool-buttons">
              <button class="tbtn icon">☰</button>
              <button class="tbtn icon">≡</button>
              <button class="tbtn icon">☰</button>
            </div>
          </div>
          <div class="separator"></div>
          <div class="tool-group">
            <div class="tool-group-label">Number</div>
            <div class="tool-buttons">
              <select class="num-format"><option>Currency</option></select>
              <button class="tbtn icon">%</button>
              <button class="tbtn icon">,</button>
            </div>
          </div>
        </div>
      </div>

      <div class="formula-bar">
        <div class="cell-ref">A1</div>
        <div class="formula-sep">fx</div>
        <div class="formula-input">Q4 Financial Summary - Confidential</div>
      </div>

      <div class="sheet-area">
        <table class="sheet">
          <colgroup>
            <col style="width:40px">
            <col style="width:110px">
            <col style="width:180px">
            <col style="width:130px">
            <col style="width:130px">
            <col style="width:130px">
            <col style="width:90px">
            <col style="width:100px">
          </colgroup>
          <thead>
            <tr class="col-header">
              <th class="corner"></th>
              <th>A</th><th>B</th><th>C</th><th>D</th><th>E</th><th>F</th><th>G</th>
            </tr>
            <tr class="data-header">
              <th class="row-num"></th>
              <th>Date</th>
              <th>Department</th>
              <th>Revenue</th>
              <th>Expenses</th>
              <th>Net Income</th>
              <th>Margin %</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
            <tr class="total-row">
              <td class="cell row-num"></td>
              <td class="cell"><b>TOTAL</b></td>
              <td class="cell"></td>
              <td class="cell num"><b>${formatCurrency(totalRevenue)}</b></td>
              <td class="cell num"><b>${formatCurrency(totalExpenses)}</b></td>
              <td class="cell num positive"><b>${formatCurrency(totalNet)}</b></td>
              <td class="cell num"><b>${totalMargin}%</b></td>
              <td class="cell"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="sheet-tabs">
        <div class="stab active">Summary</div>
        <div class="stab">Q4 Detail</div>
        <div class="stab">Projections</div>
        <div class="stab">YoY Comparison</div>
        <div class="stab add">+</div>
      </div>

      <div class="status-bar">
        <span>Ready</span>
        <span class="status-right">
          <span>Average: ${formatCurrency(Math.round(totalNet / departments.length))}</span>
          <span class="status-sep">|</span>
          <span>Count: ${departments.length}</span>
          <span class="status-sep">|</span>
          <span>Sum: ${formatCurrency(totalRevenue)}</span>
        </span>
      </div>
    </div>
  `;
}

function getFakeUIStyles(): string {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }

    .excel-app {
      width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 12px;
      color: #1a1a1a;
      background: #fff;
      user-select: none;
    }

    .title-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 32px;
      background: #217346;
      color: #fff;
      padding: 0 8px;
      font-size: 12px;
    }
    .title-left { display: flex; align-items: center; gap: 8px; }
    .app-icon { font-size: 14px; }
    .file-name { opacity: 0.95; }
    .title-right { display: flex; gap: 0; }
    .title-btn {
      width: 46px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 12px;
    }
    .title-btn:hover { background: rgba(255,255,255,0.1); }
    .title-btn.close:hover { background: #c42b1c; }

    .ribbon {
      border-bottom: 1px solid #d6d6d6;
      background: #f3f3f3;
    }
    .ribbon-tabs {
      display: flex;
      gap: 0;
      padding: 4px 8px 0;
      border-bottom: 1px solid #d6d6d6;
    }
    .rtab {
      padding: 6px 14px;
      cursor: pointer;
      font-size: 12px;
      color: #444;
      border-bottom: 2px solid transparent;
    }
    .rtab.active {
      background: #fff;
      border-bottom: 2px solid #217346;
      color: #217346;
      font-weight: 600;
    }
    .rtab:hover:not(.active) { background: #e8e8e8; }

    .ribbon-toolbar {
      display: flex;
      align-items: flex-end;
      padding: 6px 12px 8px;
      gap: 8px;
      background: #fff;
    }
    .tool-group { display: flex; flex-direction: column; gap: 3px; }
    .tool-group-label { font-size: 10px; color: #888; text-align: center; }
    .tool-buttons { display: flex; gap: 3px; align-items: center; }
    .tbtn {
      padding: 3px 8px;
      border: 1px solid transparent;
      background: none;
      cursor: pointer;
      font-size: 11px;
      border-radius: 2px;
      color: #333;
    }
    .tbtn:hover { background: #e5e5e5; border-color: #ccc; }
    .tbtn.small { font-size: 10px; padding: 2px 5px; }
    .tbtn.icon { font-size: 13px; padding: 3px 6px; min-width: 26px; text-align: center; }
    .separator { width: 1px; height: 40px; background: #d6d6d6; margin: 0 4px; align-self: center; }
    .font-select, .size-select, .num-format {
      padding: 2px 4px;
      border: 1px solid #ccc;
      font-size: 11px;
      border-radius: 2px;
      background: #fff;
    }
    .font-select { width: 100px; }
    .size-select { width: 45px; }
    .num-format { width: 90px; }

    .formula-bar {
      display: flex;
      align-items: center;
      height: 26px;
      border-bottom: 1px solid #d6d6d6;
      font-size: 12px;
    }
    .cell-ref {
      width: 80px;
      text-align: center;
      border-right: 1px solid #d6d6d6;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8f8f8;
    }
    .formula-sep {
      padding: 0 8px;
      color: #888;
      border-right: 1px solid #d6d6d6;
      height: 100%;
      display: flex;
      align-items: center;
    }
    .formula-input {
      padding: 0 8px;
      flex: 1;
    }

    .sheet-area {
      flex: 1;
      overflow: auto;
      background: #fff;
    }

    .sheet {
      border-collapse: collapse;
      width: 100%;
      min-width: 900px;
    }

    .col-header th {
      background: #f0f0f0;
      border: 1px solid #d4d4d4;
      padding: 2px 6px;
      font-weight: 500;
      color: #555;
      font-size: 11px;
      text-align: center;
      position: sticky;
      top: 0;
      z-index: 2;
    }
    .corner {
      width: 40px;
      background: #e8e8e8 !important;
    }

    .data-header th {
      background: #4472c4;
      color: #fff;
      padding: 8px 10px;
      font-weight: 600;
      font-size: 12px;
      border: 1px solid #3563b5;
      text-align: left;
      position: sticky;
      top: 24px;
      z-index: 2;
    }

    .cell {
      border: 1px solid #e0e0e0;
      padding: 5px 8px;
      font-size: 12px;
      cursor: cell;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .cell.selected {
      outline: 2px solid #217346;
      outline-offset: -1px;
      background: #e8f5e9 !important;
    }
    .cell.num { text-align: right; font-variant-numeric: tabular-nums; }
    .cell.row-num {
      background: #f0f0f0;
      color: #555;
      text-align: center;
      font-size: 11px;
      width: 40px;
    }
    .cell.positive { color: #217346; }
    .cell.negative { color: #c42b1c; }
    .cell.status {
      text-align: center;
      font-weight: 500;
      font-size: 11px;
    }

    .row-even td { background: #fff; }
    .row-odd td { background: #f8fafc; }
    .row-even:hover td, .row-odd:hover td { background: #eef2ff; }

    .total-row td {
      background: #e8eef7 !important;
      border-top: 2px solid #4472c4;
      font-weight: 600;
    }

    .sheet-tabs {
      display: flex;
      align-items: center;
      height: 28px;
      border-top: 1px solid #d6d6d6;
      background: #f0f0f0;
      padding: 0 8px;
      gap: 2px;
    }
    .stab {
      padding: 4px 16px;
      font-size: 11px;
      cursor: pointer;
      border: 1px solid transparent;
      border-bottom: none;
      border-radius: 0;
      color: #555;
    }
    .stab.active {
      background: #fff;
      border-color: #d6d6d6;
      color: #217346;
      font-weight: 600;
    }
    .stab:hover:not(.active) { background: #e4e4e4; }
    .stab.add { color: #888; font-size: 14px; padding: 4px 10px; }

    .status-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 24px;
      padding: 0 12px;
      background: #217346;
      color: #fff;
      font-size: 11px;
    }
    .status-right { display: flex; gap: 4px; }
    .status-sep { opacity: 0.5; }
  `;
}
