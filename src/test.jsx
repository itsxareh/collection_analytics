import { useState, useMemo, useRef } from "react";
import * as XLSX from "xlsx";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";

const DISP = {
  "CALL - POS_UNATTENDED": { tp: "CALL", sg: "NEG" },"CALL - POS_KOR": { tp: "CALL", sg: "NEG" },"CALL - POS_DROPPED": { tp: "CALL", sg: "NEG" },"CALL - POS_BUSY": { tp: "CALL", sg: "NEG" },"CALL - POS_LEAVE MSG TO 3RD PARTY": { tp: "CALL", sg: "POS" },"CALL - UNDERNEGO": { tp: "CALL", sg: "RPC" },"CALL - CLAIMING PAID": { tp: "CALL", sg: "RPC" },"CALL - INSURANCE CLAIM": { tp: "CALL", sg: "RPC" },"CALL - UNIT_IMPOUNDED": { tp: "CALL", sg: "RPC" },"CALL - UNIT UNDER HPG": { tp: "CALL", sg: "RPC" },"CALL - UNIT_ASSUMED": { tp: "CALL", sg: "RPC" },"CALL - UNIT DAMAGE OR WRECK": { tp: "CALL", sg: "RPC" },"CALL - UNIT_CARNAPPED": { tp: "CALL", sg: "RPC" },"CALL - NO INTENTION TO PAY": { tp: "CALL", sg: "NEG" },"CALL - PTP REPO": { tp: "CALL", sg: "PTP" },"CALL - PTP PAYOFF": { tp: "CALL", sg: "PTP" },"CALL - PTP FULL UPDATE": { tp: "CALL", sg: "PTP" },"CALL - PTP PUSH BACK": { tp: "CALL", sg: "PTP" },"CALL - PTP PARTIAL": { tp: "CALL", sg: "PTP" },"CALL - FOLLOW UP KOR": { tp: "CALL", sg: "NEG" },"CALL - FOLLOW UP UNCONTACTABLE": { tp: "CALL", sg: "NEG" },"CALL - FOLLOW UP LMTRC": { tp: "CALL", sg: "NEG" },"CALL - FOLLOW UP COMPLIANT": { tp: "CALL", sg: "NEG" },"CALL - POS_CBR": { tp: "CALL", sg: "NEG" },"CALL - NEG_UNATTENDED": { tp: "CALL", sg: "NEG" },"CALL - NEG_KOR": { tp: "CALL", sg: "NEG" },"CALL - NEG_DROPPED": { tp: "CALL", sg: "NEG" },"CALL - NEG_WRONG NUMBER": { tp: "CALL", sg: "NEG" },"CALL - NEG_LEAVE MSG TO 3RD PARTY": { tp: "CALL", sg: "NEG" },"CALL - NEG_EMPLOYER NLC": { tp: "CALL", sg: "NEG" },"CALL - NEG_BUSY": { tp: "CALL", sg: "NEG" },"CALL - NEG_NOT IN SERVICE": { tp: "CALL", sg: "NEG" },"CALL - DECEASED": { tp: "CALL", sg: "NEG" },"CALL - NEG_CBR": { tp: "CALL", sg: "NEG" },"CALL - KEPT_REPO CLIENT": { tp: "CALL", sg: "KEPT" },"CALL - KEPT_REPO 3RD PARTY": { tp: "CALL", sg: "KEPT" },"CALL -  KEPT PAYOFF": { tp: "CALL", sg: "KEPT" },"CALL - KEPT_FULL UPDATE": { tp: "CALL", sg: "KEPT" },"CALL - KEPT_PUSH BACK": { tp: "CALL", sg: "KEPT" },"CALL - KEPT_PARTIAL": { tp: "CALL", sg: "KEPT" },"BUSY": { tp: "CALL", sg: "NEG" },"DROPPED": { tp: "CALL", sg: "NEG" },"RNA": { tp: "CALL", sg: "NEG" },"PM": { tp: "CALL", sg: "NEG" },"PU": { tp: "CALL", sg: "NEG" },
  "CARAVAN - UNLOCATED": { tp: "FIELD", sg: "NEG" },"CARAVAN - CLIENT UNKNOWN": { tp: "FIELD", sg: "NEG" },"CARAVAN - CLIENT OUT OF AREA": { tp: "FIELD", sg: "NEG" },"CARAVAN - NOT ALLOWED TO ENTER": { tp: "FIELD", sg: "NEG" },"CARAVAN - DECEASED": { tp: "FIELD", sg: "NEG" },"CARAVAN - LOT ONLY": { tp: "FIELD", sg: "NEG" },"CARAVAN - LEAVE MESSAGE TO 3RD PARTY": { tp: "FIELD", sg: "POS" },"CARAVAN - HOUSED CLOSED UNVERIFIED": { tp: "FIELD", sg: "NEG" },"CARAVAN - HOUSED CLOSED VERIFIED": { tp: "FIELD", sg: "NEG" },"CARAVAN - MOVED OUT": { tp: "FIELD", sg: "NEG" },"CARAVAN - RESULT": { tp: "FIELD", sg: "NEG" },"CARAVAN - PTP REPO": { tp: "FIELD", sg: "PTP" },"CARAVAN - PTP FULL UPDATE": { tp: "FIELD", sg: "PTP" },"CARAVAN - PTP PAYOFF": { tp: "FIELD", sg: "PTP" },"CARAVAN - PTP PUSHBACK": { tp: "FIELD", sg: "PTP" },"CARAVAN - PTP PARTIAL": { tp: "FIELD", sg: "PTP" },"CARAVAN - FOLLOW UP COMPLIANT": { tp: "FIELD", sg: "NEG" },"CARAVAN - CLAIMING PAID": { tp: "FIELD", sg: "RPC" },"CARAVAN - INSURANCE CLAIM": { tp: "FIELD", sg: "RPC" },"CARAVAN - UNIT CARNAPPED": { tp: "FIELD", sg: "RPC" },"CARAVAN - UNIT UNDER HPG": { tp: "FIELD", sg: "RPC" },"CARAVAN - UNIT IMPOUNDED": { tp: "FIELD", sg: "RPC" },"CARAVAN - UNIT ASSUMED": { tp: "FIELD", sg: "RPC" },"CARAVAN - UNIT DAMAGE OR WRECK": { tp: "FIELD", sg: "RPC" },"CARAVAN - NO INTENTION TO PAY": { tp: "FIELD", sg: "RPC" },"CARAVAN - KEPT_REPO CLIENT": { tp: "FIELD", sg: "KEPT" },"CARAVAN - KEPT_REPO 3RD PARTY": { tp: "FIELD", sg: "KEPT" },"CARAVAN - KEPT PAYOFF": { tp: "FIELD", sg: "KEPT" },"CARAVAN - KEPT_FULL UPDATE": { tp: "FIELD", sg: "KEPT" },"CARAVAN - KEPT_PUSH BACK": { tp: "FIELD", sg: "KEPT" },"CARAVAN - KEPT_PARTIAL": { tp: "FIELD", sg: "KEPT" },
  "SKIP - NEGATIVE": { tp: "INTERNET", sg: "NEG" },"SKIP - SMEDIA ACCOUNT": { tp: "INTERNET", sg: "NEG" },"SKIP - NEW ADDRESS": { tp: "INTERNET", sg: "NEG" },"SKIP - CONTACT NUMBER": { tp: "INTERNET", sg: "NEG" },"SKIP - POSSIBLE LEADS": { tp: "INTERNET", sg: "NEG" },"SKIP - UNIT CARNAPPED": { tp: "INTERNET", sg: "RPC" },"SKIP - UNIT UNDER HPG": { tp: "INTERNET", sg: "RPC" },"SKIP - UNIT IMPOUNDED": { tp: "INTERNET", sg: "RPC" },"SKIP - UNIT ASSUMED": { tp: "INTERNET", sg: "RPC" },"SKIP - UNIT DAMAGE OR WRECK": { tp: "INTERNET", sg: "RPC" },"SKIP - KEPT_REPO CLIENT": { tp: "INTERNET", sg: "KEPT" },"SKIP - KEPT_REPO 3RD PARTY": { tp: "INTERNET", sg: "KEPT" },"SKIP - KEPT PAYOFF": { tp: "INTERNET", sg: "KEPT" },"SKIP - KEPT_FULL UPDATE": { tp: "INTERNET", sg: "KEPT" },"SKIP - KEPT_PUSH BACK": { tp: "INTERNET", sg: "KEPT" },"SKIP - KEPT_PARTIAL": { tp: "INTERNET", sg: "KEPT" },"SMEDIA - NEG_SENT A MESSAGE": { tp: "INTERNET", sg: "NEG" },"SMEDIA - POS_SENT A MESSAGE": { tp: "INTERNET", sg: "POS" },"SMEDIA - RESPONSIVE": { tp: "INTERNET", sg: "RPC" },"SMEDIA - PTP REPO": { tp: "INTERNET", sg: "PTP" },"SMEDIA - PTP PAYOFF": { tp: "INTERNET", sg: "PTP" },"SMEDIA - PTP FULL UPDATE": { tp: "INTERNET", sg: "PTP" },"SMEDIA - PTP PUSH BACK": { tp: "INTERNET", sg: "PTP" },"SMEDIA - PTP PARTIAL": { tp: "INTERNET", sg: "PTP" },"SMEDIA - FOLLOW UP MESSAGE": { tp: "INTERNET", sg: "NEG" },"SMEDIA - FOLLOW UP COMPLIANT": { tp: "INTERNET", sg: "NEG" },"SMEDIA - CLAIMING PAID": { tp: "INTERNET", sg: "RPC" },"SMEDIA - INSURANCE CLAIM": { tp: "INTERNET", sg: "RPC" },"SMEDIA - UNIT CARNAPPED": { tp: "INTERNET", sg: "RPC" },"SMEDIA - UNIT UNDER HPG": { tp: "INTERNET", sg: "RPC" },"SMEDIA - UNIT IMPOUNDED": { tp: "INTERNET", sg: "RPC" },"SMEDIA - UNIT ASSUMED": { tp: "INTERNET", sg: "RPC" },"SMEDIA - UNIT DAMAGE OR WRECK": { tp: "INTERNET", sg: "RPC" },"SMEDIA - NO INTENTION TO PAY": { tp: "INTERNET", sg: "RPC" },"SMEDIA - KEPT_REPO CLIENT": { tp: "INTERNET", sg: "KEPT" },"SMEDIA - KEPT_REPO 3RD PARTY": { tp: "INTERNET", sg: "KEPT" },"SMEDIA - KEPT PAYOFF": { tp: "INTERNET", sg: "KEPT" },"SMEDIA - KEPT_FULL UPDATE": { tp: "INTERNET", sg: "KEPT" },"SMEDIA - KEPT_PUSH BACK": { tp: "INTERNET", sg: "KEPT" },"SMEDIA - KEPT_PARTIAL": { tp: "INTERNET", sg: "KEPT" },
  "FIELD - UNLOCATED": { tp: "FIELD", sg: "NEG" },"FIELD - CLIENT_UNKNOWN": { tp: "FIELD", sg: "NEG" },"FIELD - CLIENT_OUT OF AREA": { tp: "FIELD", sg: "NEG" },"FIELD - NOT_ALLOWED TO ENTER": { tp: "FIELD", sg: "NEG" },"FIELD - DECEASED": { tp: "FIELD", sg: "NEG" },"FIELD - LOT_ONLY": { tp: "FIELD", sg: "NEG" },"FIELD - LEAVE_MESSAGE TO 3RD PARTY": { tp: "FIELD", sg: "POS" },"FIELD - HOUSED_CLOSED UNVERIFIED": { tp: "FIELD", sg: "NEG" },"FIELD - HOUSED CLOSED VERIFIED": { tp: "FIELD", sg: "NEG" },"FIELD - MOVED_OUT": { tp: "FIELD", sg: "NEG" },"FIELD - RESULT": { tp: "FIELD", sg: "NEG" },"FIELD - PTP REPO": { tp: "FIELD", sg: "PTP" },"FIELD - PTP_FULL UPDATE": { tp: "FIELD", sg: "PTP" },"FIELD - PTP_PAYOFF": { tp: "FIELD", sg: "PTP" },"FIELD - PTP_PUSHBACK": { tp: "FIELD", sg: "PTP" },"FIELD - PTP_PARTIAL": { tp: "FIELD", sg: "PTP" },"FIELD - FOLLOW UP COMPLIANT": { tp: "FIELD", sg: "NEG" },"FIELD - CLAIMING PAID": { tp: "FIELD", sg: "RPC" },"FIELD - INSURANCE CLAIM": { tp: "FIELD", sg: "RPC" },"FIELD - UNIT CARNAPPED": { tp: "FIELD", sg: "RPC" },"FIELD - UNIT UNDER HPG": { tp: "FIELD", sg: "RPC" },"FIELD - UNIT IMPOUNDED": { tp: "FIELD", sg: "RPC" },"FIELD - UNIT ASSUMED": { tp: "FIELD", sg: "RPC" },"FIELD - UNIT DAMAGE OR WRECK": { tp: "FIELD", sg: "RPC" },"FIELD - NO INTENTION TO PAY": { tp: "FIELD", sg: "RPC" },"FIELD - KEPT_REPO CLIENT": { tp: "FIELD", sg: "KEPT" },"FIELD - KEPT_REPO 3RD PARTY": { tp: "FIELD", sg: "KEPT" },"FIELD - KEPT PAYOFF": { tp: "FIELD", sg: "KEPT" },"FIELD - KEPT_FULL UPDATE": { tp: "FIELD", sg: "KEPT" },"FIELD - KEPT_PUSH BACK": { tp: "FIELD", sg: "KEPT" },"FIELD - KEPT_PARTIAL": { tp: "FIELD", sg: "KEPT" },
  "EMAIL - NO EMAIL": { tp: "EMAIL", sg: "NEG" },"EMAIL - NEG_SENT MESSAGE": { tp: "EMAIL", sg: "NEG" },"EMAIL - DECEASED": { tp: "EMAIL", sg: "NEG" },"EMAIL - POS_SENT MESSAGE": { tp: "EMAIL", sg: "POS" },"EMAIL - RESPONSIVE": { tp: "EMAIL", sg: "RPC" },"EMAIL - GOT NEW CONTACT": { tp: "EMAIL", sg: "NEG" },"EMAIL - PTP REPO": { tp: "EMAIL", sg: "PTP" },"EMAIL - PTP PAYOFF": { tp: "EMAIL", sg: "PTP" },"EMAIL - PTP FULL UPDATE": { tp: "EMAIL", sg: "PTP" },"EMAIL - PTP PUSH BACK": { tp: "EMAIL", sg: "PTP" },"EMAIL - PTP_PARTIAL": { tp: "EMAIL", sg: "PTP" },"EMAIL - CLAIMING PAID": { tp: "EMAIL", sg: "RPC" },"EMAIL - INSURANCE CLAIM": { tp: "EMAIL", sg: "RPC" },"EMAIL - UNIT CARNAPPED": { tp: "EMAIL", sg: "RPC" },"EMAIL - UNIT UNDER HPG": { tp: "EMAIL", sg: "RPC" },"EMAIL - NO INTENTION TO PAY": { tp: "EMAIL", sg: "NEG" },"EMAIL - UNIT_IMPOUNDED": { tp: "EMAIL", sg: "RPC" },"EMAIL - UNIT ASSUMED": { tp: "EMAIL", sg: "RPC" },"EMAIL - UNIT DAMAGE OR WRECK": { tp: "EMAIL", sg: "RPC" },"EMAIL - FOLLOW UP MESSAGE": { tp: "EMAIL", sg: "NEG" },"EMAIL - FOLLOW UP COMPLIANT": { tp: "EMAIL", sg: "NEG" },"EMAIL - CEASE COLLECTION": { tp: "EMAIL", sg: "NEG" },"EMAIL - KEPT_ REPO CLIENT": { tp: "EMAIL", sg: "KEPT" },"EMAIL - KEPT_REPO 3RD PARTY": { tp: "EMAIL", sg: "KEPT" },"EMAIL - KEPT PAYOFF": { tp: "EMAIL", sg: "KEPT" },"EMAIL - KEPT_FULL UPDATE": { tp: "EMAIL", sg: "KEPT" },"EMAIL - KEPT_PUSH BACK": { tp: "EMAIL", sg: "KEPT" },"EMAIL - KEPT_PARTIAL": { tp: "EMAIL", sg: "KEPT" },
  "SMS - NEG_SENT MESSAGE": { tp: "SMS", sg: "NEG" },"SMS - DECEASED": { tp: "SMS", sg: "NEG" },"SMS - WRONG NUMBER": { tp: "SMS", sg: "NEG" },"SMS - POS_SENT MESSAGE": { tp: "SMS", sg: "POS" },"SMS - RESPONSIVE": { tp: "SMS", sg: "RPC" },"SMS - GOT NEW CONTACT NUM": { tp: "SMS", sg: "NEG" },"SMS - PTP REPO": { tp: "SMS", sg: "PTP" },"SMS - PTP PAYOFF": { tp: "SMS", sg: "PTP" },"SMS - PTP FULL UPDATE": { tp: "SMS", sg: "PTP" },"SMS - PTP PUSH BACK": { tp: "SMS", sg: "PTP" },"SMS - PTP_PARTIAL": { tp: "SMS", sg: "PTP" },"SMS - CLAIMING PAID": { tp: "SMS", sg: "RPC" },"SMS - INSURANCE CLAIM": { tp: "SMS", sg: "RPC" },"SMS - UNIT IMPOUNDED": { tp: "SMS", sg: "RPC" },"SMS - UNDER HPG": { tp: "SMS", sg: "RPC" },"SMS - UNIT ASSUMED": { tp: "SMS", sg: "RPC" },"SMS - UNIT DAMAGE OR WRECK": { tp: "SMS", sg: "RPC" },"SMS - UNIT CARNAPPED": { tp: "SMS", sg: "RPC" },"SMS - NO INTENTION TO PAY": { tp: "SMS", sg: "NEG" },"SMS - FOLLOW UP MESSAGE": { tp: "SMS", sg: "NEG" },"SMS - FOLLOW UP COMPLIANT": { tp: "SMS", sg: "NEG" },"SMS - KEPT_REPO CLIENT": { tp: "SMS", sg: "KEPT" },"SMS - KEPT_REPO 3RD PARTY": { tp: "SMS", sg: "KEPT" },"SMS - KEPT PAYOFF": { tp: "SMS", sg: "KEPT" },"SMS - KEPT_FULL UPDATE": { tp: "SMS", sg: "KEPT" },"SMS - KEPT_PUSH BACK": { tp: "SMS", sg: "KEPT" },"SMS - KEPT_PARTIAL": { tp: "SMS", sg: "KEPT" },"SMS SENT": { tp: "SMS", sg: "NEG" },"BULK SMS SENT": { tp: "SMS", sg: "NEG" },
  "VIBER - NO VIBER": { tp: "VIBER", sg: "NEG" },"VIBER - DELIVERED": { tp: "VIBER", sg: "NEG" },"VIBER - READ": { tp: "VIBER", sg: "NEG" },"VIBER - PENDING": { tp: "VIBER", sg: "NEG" },"VIBER - BOUNCED": { tp: "VIBER", sg: "NEG" },"VIBER - POS_SENT A MESSAGE": { tp: "VIBER", sg: "POS" },"VIBER - NEG_SENT A MESSAGE": { tp: "VIBER", sg: "NEG" },"VIBER - RESPONSIVE": { tp: "VIBER", sg: "RPC" },"VIBER - PTP REPO": { tp: "VIBER", sg: "PTP" },"VIBER - PTP PAYOFF": { tp: "VIBER", sg: "PTP" },"VIBER - PTP FULL UPDATE": { tp: "VIBER", sg: "PTP" },"VIBER - PTP PUSH BACK": { tp: "VIBER", sg: "PTP" },"VIBER - PARTIAL": { tp: "VIBER", sg: "PTP" },"VIBER - FOLLOW UP MESSAGE": { tp: "VIBER", sg: "NEG" },"VIBER - FOLLOW UP COMPLIANT": { tp: "VIBER", sg: "NEG" },"VIBER - CLAIMING PAID": { tp: "VIBER", sg: "RPC" },"VIBER - INSURANCE CLAIM": { tp: "VIBER", sg: "RPC" },"VIBER - UNIT CARNAPPED": { tp: "VIBER", sg: "RPC" },"VIBER - UNIT UNDER HPG": { tp: "VIBER", sg: "RPC" },"VIBER - UNIT IMPOUNDED": { tp: "VIBER", sg: "RPC" },"VIBER - UNIT ASSUMED": { tp: "VIBER", sg: "RPC" },"VIBER - UNIT DAMAGE OR WRECK": { tp: "VIBER", sg: "RPC" },"VIBER - NO INTENTION TO PAY": { tp: "VIBER", sg: "RPC" },"VIBER - KEPT_REPO CLIENT": { tp: "VIBER", sg: "KEPT" },"VIBER - KEPT_REPO 3RD PARTY": { tp: "VIBER", sg: "KEPT" },"VIBER -  KEPT PAYOFF": { tp: "VIBER", sg: "KEPT" },"VIBER - KEPT_FULL UPDATE": { tp: "VIBER", sg: "KEPT" },"VIBER - KEPT_PUSH BACK": { tp: "VIBER", sg: "KEPT" },"VIBER - KEPT_PARTIAL": { tp: "VIBER", sg: "KEPT" },
  "CEASE - POSSIBLE COMPLAINT": { tp: "CEASE COLLECTION", sg: "NEG" },"CEASE - PENDING COMPLAINT": { tp: "CEASE COLLECTION", sg: "NEG" },"CEASE - VALID COMPLAINT": { tp: "CEASE COLLECTION", sg: "NEG" },"CEASE - REQUESTED BY BANK": { tp: "CEASE COLLECTION", sg: "NEG" },"CEASE - CLAIMING PAID": { tp: "CEASE COLLECTION", sg: "RPC" },"CEASE - INSURANCE CLAIM": { tp: "CEASE COLLECTION", sg: "RPC" },"CEASE - REPOSSESSED BY OTHER ECA": { tp: "CEASE COLLECTION", sg: "NEG" },
  "FIELD REQUEST - OTS SURE REPO": { tp: "FIELD REQUEST", sg: "NEG" },"FIELD REQUEST - FOR REVISIT": { tp: "FIELD REQUEST", sg: "NEG" },"FIELD REQUEST - BP_NC": { tp: "FIELD REQUEST", sg: "NEG" },"FIELD REQUEST - NEW_ADDRESS": { tp: "FIELD REQUEST", sg: "NEG" },
  "REPO AI - PTP REPO": { tp: "REPO AI", sg: "PTP" },"REPO AI - PTP FULL UPDATE": { tp: "REPO AI", sg: "PTP" },"REPO AI - PTP PAY OFF": { tp: "REPO AI", sg: "PTP" },"REPO AI - PTP PUSHBACK": { tp: "REPO AI", sg: "PTP" },"REPO AI - PTP PARTIAL": { tp: "REPO AI", sg: "PTP" },"REPO AI - KEPT_REPO CLIENT": { tp: "REPO AI", sg: "KEPT" },"REPO AI - KEPT_REPO 3RD PARTY": { tp: "REPO AI", sg: "KEPT" },"REPO AI - KEPT PAYOFF": { tp: "REPO AI", sg: "KEPT" },"REPO AI - KEPT_FULL UPDATE": { tp: "REPO AI", sg: "KEPT" },"REPO AI - KEPT_PUSH BACK": { tp: "REPO AI", sg: "KEPT" },"REPO AI - KEPT_PARTIAL": { tp: "REPO AI", sg: "KEPT" }
};

const BUCKET_MAP = {
  "01BDORA":"Bucket 1","01BDA":"Bucket 1","02BDA":"Bucket 2","05BDA":"Bucket 5","06BDA":"Bucket 6",
  "01OASSA":"Sub Standard 1","02OASSA":"Sub Standard 2","03OASSA":"Substandard 3","04OAFWA":"Write Off",
  "01OAFSA":"Bucket 1","02OAFSA":"Bucket 2","03OAFSA":"Bucket 3","04OAFSA":"Bucket 4","05OAFSA":"Bucket 5","06OAFSA":"Bucket 6",
  "01BMIM":"Regular","02BMIM":"NPA","03BMIM":"Write Off"
};
const BUCKET_ORDER = ["Bucket 1","Bucket 2","Bucket 3","Bucket 4","Bucket 5","Bucket 6","Sub Standard 1","Sub Standard 2","Substandard 3","Regular","NPA","Write Off"];
const BUCKET_COLORS = {"Bucket 1":"#3b82f6","Bucket 2":"#06b6d4","Bucket 3":"#a78bfa","Bucket 4":"#f59e0b","Bucket 5":"#f97316","Bucket 6":"#ef4444","Sub Standard 1":"#84cc16","Sub Standard 2":"#22c55e","Substandard 3":"#14b8a6","Regular":"#60a5fa","NPA":"#fb923c","Write Off":"#dc2626"};

const resolveBucket = (rawVal) => {
  if (!rawVal) return null;
  const s = String(rawVal).trim().toUpperCase();
  const direct = BUCKET_MAP[String(rawVal).trim()];
  if (direct) return direct;
  for (const [k, v] of Object.entries(BUCKET_MAP)) { if (k.toUpperCase() === s) return v; }
  for (const [k, v] of Object.entries(BUCKET_MAP)) { if (s.includes(k.toUpperCase())) return v; }
  return null;
};

const EXCLUDED_REMARKS = ["New Assignment","System Auto Update Remarks For PD","Updates when case reassign to another collector","Sub Special Status Change","New files imported"];
const GC = {"NEG":"#ef4444","RPC":"#3b82f6","KEPT":"#22c55e","PTP":"#f59e0b","POS":"#06b6d4"};
const PC = ["#3b82f6","#22c55e","#f59e0b","#ef4444","#a78bfa","#06b6d4","#f97316","#84cc16","#ec4899","#14b8a6","#8b5cf6","#fb7185"];
const TP_COLORS = {"CALL":"#3b82f6","FIELD":"#22c55e","SMS":"#f59e0b","VIBER":"#a78bfa","EMAIL":"#06b6d4","INTERNET":"#f97316","CEASE COLLECTION":"#ef4444","FIELD REQUEST":"#84cc16","REPO AI":"#ec4899"};
const SG_GROUPS = ["NEG","RPC","PTP","KEPT","POS"];
const ALL_TP = ["CALL","SMS","VIBER","EMAIL","FIELD","INTERNET","CEASE COLLECTION","FIELD REQUEST","REPO AI"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const DU = {};
Object.keys(DISP).forEach(k => { DU[k.toUpperCase()] = { ...DISP[k], orig: k }; });

const fN = n => n == null ? "-" : typeof n === "number" ? n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : String(n);
const parseAmt = v => { if (v == null || v === "") return NaN; if (typeof v === "number") return v; return parseFloat(String(v).replace(/[₱$,\s]/g, "").trim()); };
const fD = v => {
  if (!v) return null;
  if (v instanceof Date) { if (isNaN(v.getTime())) return null; return `${String(v.getMonth()+1).padStart(2,"0")}/${String(v.getDate()).padStart(2,"0")}/${v.getFullYear()}`; }
  const s = String(v).trim();
  const m = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (m) return `${String(m[2]).padStart(2,"0")}/${String(m[1]).padStart(2,"0")}/${m[3]}`;
  const d = new Date(s);
  if (!isNaN(d.getTime())) return `${String(d.getMonth()+1).padStart(2,"0")}/${String(d.getDate()).padStart(2,"0")}/${d.getFullYear()}`;
  return s;
};

const getMonthYear = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.split("/");
  if (parts.length === 3) return `${MONTHS[parseInt(parts[0])-1]} ${parts[2]}`;
  return null;
};

const parseTimeHour = (v) => {
  if (!v) return null;
  if (v instanceof Date && !isNaN(v.getTime())) return v.getHours();
  const s = String(v).trim();
  const m = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if (m) { let h = parseInt(m[1]); const ap = m[4]; if (ap) { if (ap.toLowerCase()==="pm"&&h!==12) h+=12; if (ap.toLowerCase()==="am"&&h===12) h=0; } if (h>=0&&h<=23) return h; }
  const d = new Date(s);
  if (!isNaN(d.getTime())) return d.getHours();
  return null;
};

const isExcludedRemark = (v) => { if (!v) return false; const s = String(v).toLowerCase(); return EXCLUDED_REMARKS.some(p => s.includes(p.toLowerCase())); };

const Pb = ({ pct, c }) => (
  <div style={{ height: 5, background: "#0f172a", borderRadius: 3, overflow: "hidden" }}>
    <div style={{ height: "100%", borderRadius: 3, width: Math.min(pct||0, 100) + "%", background: c }} />
  </div>
);

const SearchBar = ({ value, onChange, placeholder = "Search..." }) => (
  <div style={{ position: "relative", marginBottom: 10 }}>
    <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#475569", fontSize: 13 }}>🔍</span>
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0", fontSize: 13, padding: "7px 10px 7px 32px", fontFamily: "inherit", outline: "none" }} />
    {value && <button onClick={() => onChange("")} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 14 }}>×</button>}
  </div>
);

// ─── CLIENT FILTER BAR ───────────────────────────────────────────────────────
const ClientFilterBar = ({ clients, selected, onChange }) => (
  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginBottom: 16, padding: "10px 16px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b" }}>
    <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600, marginRight: 4 }}>🏢 CLIENT:</span>
    <button onClick={() => onChange("ALL")}
      style={{ padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", background: selected === "ALL" ? "#3b82f6" : "#1e293b", color: selected === "ALL" ? "#fff" : "#64748b", transition: "all .15s" }}>
      All Clients
    </button>
    {clients.map(c => (
      <button key={c} onClick={() => onChange(c)}
        style={{ padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", background: selected === c ? "#a78bfa" : "#1e293b", color: selected === c ? "#fff" : "#94a3b8", transition: "all .15s" }}>
        {c}
      </button>
    ))}
  </div>
);

const TS = { background: "#1e293b", border: "1px solid #334155", borderRadius: 8, fontSize: 12 };

export default function App() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("overview");
  const [selectedClient, setSelectedClient] = useState("ALL");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCollector, setSelectedCollector] = useState(null);
  const [selectedBucket, setSelectedBucket] = useState(null);
  const [monthCompareMetric, setMonthCompareMetric] = useState("total");
  const [fieldBucketDrilldown, setFieldBucketDrilldown] = useState(null);
  const [statusSearch, setStatusSearch] = useState("");
  const [collectorSearch, setCollectorSearch] = useState("");
  const [dateSearch, setDateSearch] = useState("");
  const fRef = useRef();

  const hf = file => {
    if (!file) return;
    if (!file.name.match(/\.(xlsx|xls)$/i)) { setErr("File must be .xlsx or .xls"); return; }
    setLoading(true); setErr(""); setData(null);
    const r = new FileReader();
    r.onload = e => {
      try {
        const wb = XLSX.read(e.target.result, { type: "array", cellDates: true });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const raw = XLSX.utils.sheet_to_json(ws, { defval: null, raw: false });
        if (!raw.length) { setErr("File is empty."); setLoading(false); return; }
        const keys = Object.keys(raw[0]);
        const sk = keys.find(k => k.trim().toLowerCase() === "status");
        if (!sk) { setErr("No 'Status' column found."); setLoading(false); return; }
        const ak = keys.find(k => k.toLowerCase().includes("account no") || k.toLowerCase().includes("acct no"));
        const rk = keys.find(k => k.toLowerCase().includes("remark by"));
        const rmk = keys.find(k => { const l=k.toLowerCase(); return (l.includes("remark")&&!l.includes("remark by"))||l==="remarks"||l==="notes"; });
        const pak = keys.find(k => k.toLowerCase().includes("ptp amount"));
        const pdk = keys.find(k => k.toLowerCase().includes("ptp date")&&!k.toLowerCase().includes("claim"));
        const cak = keys.find(k => k.toLowerCase().includes("claim paid amount"));
        const cdk = keys.find(k => k.toLowerCase().includes("claim paid date"));
        const datек = keys.find(k => { const l=k.trim().toLowerCase(); return l==="date"||l==="remark date"||l==="activity date"||l==="log date"; });
        const timek = keys.find(k => { const l=k.trim().toLowerCase(); return l==="time"||l==="remark time"||l==="activity time"||l==="log time"; });
        const dtk = (!datек&&!timek) ? keys.find(k => { const l=k.toLowerCase(); return l==="date and time"||l==="datetime"||l==="date/time"; }) : null;
        const clk = keys.find(k => { const l=k.trim().toLowerCase(); return l==="client"||l==="client type"||l==="client name"||l==="clienttype"; });
        const oick = keys.find(k => { const l=k.trim().toLowerCase(); return l==="old ic"||l==="oldic"||l==="old_ic"||l==="placement"||l==="bucket"; });

        const allRows = raw.map(r => ({ ...r, _su: r[sk] ? String(r[sk]).trim().toUpperCase() : null }));
        const totalRaw = allRows.length;
        const remarkExcludedCount = allRows.filter(r => isExcludedRemark(rmk?r[rmk]:null)||isExcludedRemark(rk?r[rk]:null)).length;
        const afterFilter = allRows.filter(r => !isExcludedRemark(rmk?r[rmk]:null)&&!isExcludedRemark(rk?r[rk]:null));
        const rows = afterFilter.filter(r => r._su && DU[r._su]).map(r => ({
          ...r,
          _status: DU[r._su].orig,
          _d: DU[r._su],
          _bucket: oick ? resolveBucket(r[oick]) : null,
          _dateStr: (() => { const key = datек||dtk; return key ? fD(r[key]) : null; })(),
          _monthYear: (() => { const key = datек||dtk; return key ? getMonthYear(fD(r[key])) : null; })(),
          _client: clk ? (r[clk] ? String(r[clk]).trim() : null) : null,
        }));

        if (!rows.length) { setErr("No valid recognized statuses found."); setLoading(false); return; }

        // Extract unique clients
        const clients = clk ? [...new Set(rows.map(r=>r._client).filter(Boolean))].sort() : [];

        setData({ rows, sk, ak, rk, rmk, pak, pdk, cak, cdk, datек, timek, dtk, clk, oick, totalRaw, remarkExcludedCount, clients });
        setSelectedClient("ALL");
      } catch (ex) { setErr("Error: " + ex.message); }
      setLoading(false);
    };
    r.readAsArrayBuffer(file);
  };

  // ── Filtered rows based on selected client ────────────────────────────────
  const filteredRows = useMemo(() => {
    if (!data) return [];
    if (selectedClient === "ALL") return data.rows;
    return data.rows.filter(r => r._client === selectedClient);
  }, [data, selectedClient]);

  // ── Main analytics ────────────────────────────────────────────────────────
  const an = useMemo(() => {
    if (!data || !filteredRows.length) return null;
    const rows = filteredRows;
    const { ak, rk, pak, pdk, cak, cdk, timek, dtk } = data;
    const T = rows.length;

    // Status / group / tp counts
    const sc = {}, gc = {}, tc = {};
    rows.forEach(r => { sc[r._status]=(sc[r._status]||0)+1; gc[r._d.sg]=(gc[r._d.sg]||0)+1; tc[r._d.tp]=(tc[r._d.tp]||0)+1; });
    const sd = Object.entries(sc).sort((a,b)=>b[1]-a[1]).map(([s,c])=>({ status:s, count:c, pct:((c/T)*100).toFixed(1), grp:rows.find(r=>r._status===s)?._d.sg||"", tp:rows.find(r=>r._status===s)?._d.tp||"" }));
    const gd = Object.entries(gc).sort((a,b)=>b[1]-a[1]).map(([g,c])=>({ name:g, value:c, pct:((c/T)*100).toFixed(1) }));
    const td = Object.entries(tc).sort((a,b)=>b[1]-a[1]).map(([t,c])=>({ name:t, count:c, pct:((c/T)*100).toFixed(1) }));
    const ua = ak ? new Set(rows.map(r=>r[ak]).filter(Boolean)).size : null;

    // Collectors
    const collectorMap = {};
    if (rk) rows.forEach(r => { const n=r[rk]?String(r[rk]).trim():null; if(!n) return; if(!collectorMap[n]) collectorMap[n]={total:0,byTP:{},bySG:{}}; collectorMap[n].total++; collectorMap[n].byTP[r._d.tp]=(collectorMap[n].byTP[r._d.tp]||0)+1; collectorMap[n].bySG[r._d.sg]=(collectorMap[n].bySG[r._d.sg]||0)+1; });
    const cd = Object.entries(collectorMap).sort((a,b)=>b[1].total-a[1].total).map(([name,v])=>({ name,...v }));

    // PTP/Claims
    let pt=0,pc=0,ct=0,cc=0;
    if (pak) rows.forEach(r=>{ const v=parseAmt(r[pak]); if(!isNaN(v)&&v>0){pt+=v;pc++;} });
    if (cak) rows.forEach(r=>{ const v=parseAmt(r[cak]); if(!isNaN(v)&&v>0){ct+=v;cc++;} });

    // Date analytics
    let dateAnalytics = null;
    if (data.datек || data.dtk) {
      const dateMap = {};
      rows.forEach(r => { const d=r._dateStr; if(d){ if(!dateMap[d]) dateMap[d]={total:0,NEG:0,RPC:0,PTP:0,KEPT:0,POS:0}; dateMap[d].total++; if(dateMap[d][r._d.sg]!==undefined) dateMap[d][r._d.sg]++; } });
      const dateSorted = Object.entries(dateMap).sort((a,b)=>{const da=new Date(a[0]),db=new Date(b[0]);return isNaN(da)||isNaN(db)?a[0].localeCompare(b[0]):da-db;}).map(([date,v])=>({date,...v}));
      const hourMap = {};
      rows.forEach(r => { const tRaw = timek?r[timek]:(dtk?r[dtk]:null); if(!tRaw) return; const h=parseTimeHour(tRaw); if(h!==null) hourMap[h]=(hourMap[h]||0)+1; });
      const hourData = Array.from({length:24},(_,h)=>({hour:`${String(h).padStart(2,"0")}:00`,count:hourMap[h]||0}));
      dateAnalytics = { dateSorted, hourData, hasHours: Object.keys(hourMap).length>0 };
    }

    // ── Monthly analytics ─────────────────────────────────────────────────
    let monthlyAnalytics = null;
    const hasDate = !!(data.datек || data.dtk);
    if (hasDate) {
      const monthMap = {};
      rows.forEach(r => {
        const my = r._monthYear;
        if (!my) return;
        if (!monthMap[my]) monthMap[my] = { total:0, NEG:0, RPC:0, PTP:0, KEPT:0, POS:0, ptpAmt:0, claimAmt:0, byTP:{}, byClient:{} };
        monthMap[my].total++;
        if (monthMap[my][r._d.sg]!==undefined) monthMap[my][r._d.sg]++;
        monthMap[my].byTP[r._d.tp]=(monthMap[my].byTP[r._d.tp]||0)+1;
        if (r._client) monthMap[my].byClient[r._client]=(monthMap[my].byClient[r._client]||0)+1;
        if (pak) { const v=parseAmt(r[pak]); if(!isNaN(v)&&v>0) monthMap[my].ptpAmt+=v; }
        if (cak) { const v=parseAmt(r[cak]); if(!isNaN(v)&&v>0) monthMap[my].claimAmt+=v; }
      });

      // Sort months chronologically
      const sortMonthYear = (a) => {
        const [mon, yr] = a.split(" ");
        return parseInt(yr)*100 + MONTHS.indexOf(mon);
      };
      const monthList = Object.keys(monthMap).sort((a,b)=>sortMonthYear(a)-sortMonthYear(b));
      const monthlySorted = monthList.map(m => ({ month: m, ...monthMap[m] }));

      // Client × Month matrix
      const clientMonthMap = {};
      if (data.clk) {
        rows.forEach(r => {
          const cl = r._client; const my = r._monthYear;
          if (!cl||!my) return;
          if (!clientMonthMap[cl]) clientMonthMap[cl]={};
          clientMonthMap[cl][my]=(clientMonthMap[cl][my]||0)+1;
        });
      }

      monthlyAnalytics = { monthlySorted, monthList, clientMonthMap };
    }

    // ── Client analytics ──────────────────────────────────────────────────
    let clientAnalytics = null;
    if (data.clk) {
      const clientMap = {};
      data.rows.forEach(r => { // always use ALL rows for client comparison
        const v=r._client; if(!v) return;
        if(!clientMap[v]) clientMap[v]={total:0,byTP:{},bySG:{},ptpAmt:0,claimAmt:0};
        clientMap[v].total++;
        clientMap[v].byTP[r._d.tp]=(clientMap[v].byTP[r._d.tp]||0)+1;
        clientMap[v].bySG[r._d.sg]=(clientMap[v].bySG[r._d.sg]||0)+1;
        if (pak) { const v2=parseAmt(r[pak]); if(!isNaN(v2)&&v2>0) clientMap[v].ptpAmt+=v2; }
        if (cak) { const v2=parseAmt(r[cak]); if(!isNaN(v2)&&v2>0) clientMap[v].claimAmt+=v2; }
      });
      clientAnalytics = { clientList: Object.entries(clientMap).sort((a,b)=>b[1].total-a[1].total).map(([name,v])=>({name,...v})) };
    }

    // ── Field analytics ───────────────────────────────────────────────────
    let fieldAnalytics = null;
    const fieldRows = rows.filter(r => r._d.tp === "FIELD");
    if (fieldRows.length > 0) {
      const totalFieldVisits = fieldRows.length;
      const uniqueFieldAccounts = ak ? new Set(fieldRows.map(r=>r[ak]).filter(Boolean)).size : null;

      // Visits per bucket
      const bucketVisitMap = {};
      const bucketAccountMap = {};
      fieldRows.forEach(r => {
        const b = r._bucket || "Unassigned";
        bucketVisitMap[b]=(bucketVisitMap[b]||0)+1;
        if (ak && r[ak]) { if(!bucketAccountMap[b]) bucketAccountMap[b]=new Set(); bucketAccountMap[b].add(String(r[ak]).trim()); }
      });

      // Total accounts per bucket (from ALL rows, not just field)
      const totalAccountsByBucket = {};
      if (ak) {
        rows.forEach(r => {
          const b = r._bucket || "Unassigned";
          if (!totalAccountsByBucket[b]) totalAccountsByBucket[b] = new Set();
          if (r[ak]) totalAccountsByBucket[b].add(String(r[ak]).trim());
        });
      }

      const bucketVisitData = Object.entries(bucketVisitMap)
        .sort((a,b) => { const ai=BUCKET_ORDER.indexOf(a[0]),bi=BUCKET_ORDER.indexOf(b[0]); if(ai===-1&&bi===-1) return a[0].localeCompare(b[0]); if(ai===-1) return 1; if(bi===-1) return -1; return ai-bi; })
        .map(([name, visits]) => {
          const visitedAccts = ak ? (bucketAccountMap[name]?.size||0) : 0;
          const totalAccts = ak ? (totalAccountsByBucket[name]?.size||0) : 0;
          const pctOfTotal = totalFieldVisits > 0 ? ((visits/totalFieldVisits)*100).toFixed(1) : "0.0";
          const pctOfAccts = totalAccts > 0 ? ((visitedAccts/totalAccts)*100).toFixed(1) : "0.0";
          return { name, visits, visitedAccts, totalAccts, pctOfTotal, pctOfAccts };
        });

      // Field dates
      const fieldDateMap = {};
      const fieldMonthMap = {};
      fieldRows.forEach(r => {
        const d = r._dateStr;
        if (d) { fieldDateMap[d]=(fieldDateMap[d]||0)+1; const my=r._monthYear; if(my) fieldMonthMap[my]=(fieldMonthMap[my]||0)+1; }
      });
      const fieldDateSorted = Object.entries(fieldDateMap).sort((a,b)=>{const da=new Date(a[0]),db=new Date(b[0]);return isNaN(da)||isNaN(db)?a[0].localeCompare(b[0]):da-db;}).map(([date,count])=>({date,count}));
      const fieldMonthSorted = Object.entries(fieldMonthMap).sort((a,b)=>{const si=m=>parseInt(m.split(" ")[1])*100+MONTHS.indexOf(m.split(" ")[0]);return si(a[0])-si(b[0]);}).map(([month,count])=>({month,count}));

      // Field outcome groups
      const fieldSG = {};
      fieldRows.forEach(r => { fieldSG[r._d.sg]=(fieldSG[r._d.sg]||0)+1; });
      const fieldSGData = Object.entries(fieldSG).sort((a,b)=>b[1]-a[1]).map(([g,c])=>({name:g,value:c,pct:((c/totalFieldVisits)*100).toFixed(1)}));

      // Field status breakdown
      const fieldStatusMap = {};
      fieldRows.forEach(r => { fieldStatusMap[r._status]=(fieldStatusMap[r._status]||0)+1; });
      const fieldStatusData = Object.entries(fieldStatusMap).sort((a,b)=>b[1]-a[1]).map(([s,c])=>({status:s,count:c,pct:((c/totalFieldVisits)*100).toFixed(1),grp:DU[s.toUpperCase()]?.sg||""}));

      // Field by collector
      const fieldCollectorMap = {};
      if (rk) fieldRows.forEach(r => { const n=r[rk]?String(r[rk]).trim():null; if(!n) return; fieldCollectorMap[n]=(fieldCollectorMap[n]||0)+1; });
      const fieldCollectorData = Object.entries(fieldCollectorMap).sort((a,b)=>b[1]-a[1]).slice(0,20).map(([name,count])=>({name,count,pct:((count/totalFieldVisits)*100).toFixed(1)}));

      // Field subtype (FIELD vs CARAVAN)
      const subtypeMap = {};
      fieldRows.forEach(r => {
        const s = r._status;
        const sub = s.startsWith("CARAVAN") ? "CARAVAN" : s.startsWith("FIELD") ? "FIELD" : "OTHER";
        subtypeMap[sub]=(subtypeMap[sub]||0)+1;
      });

      // Active field days
      const activeDays = Object.keys(fieldDateMap).length;
      const avgVisitsPerDay = activeDays > 0 ? (totalFieldVisits/activeDays).toFixed(1) : 0;
      const peakFieldDay = fieldDateSorted.length ? fieldDateSorted.reduce((a,b)=>b.count>a.count?b:a,fieldDateSorted[0]) : null;

      // Field PTP amount
      let fieldPtpAmt = 0, fieldPtpCount = 0;
      if (pak) fieldRows.forEach(r => { const v=parseAmt(r[pak]); if(!isNaN(v)&&v>0){fieldPtpAmt+=v;fieldPtpCount++;} });

      // Monthly field visits
      fieldAnalytics = { totalFieldVisits, uniqueFieldAccounts, bucketVisitData, fieldDateSorted, fieldMonthSorted, fieldSGData, fieldStatusData, fieldCollectorData, subtypeMap, activeDays, avgVisitsPerDay, peakFieldDay, fieldPtpAmt, fieldPtpCount, hasDate: fieldDateSorted.length > 0, hasAccounts: !!ak };
    }

    return { sd, gd, td, ua, cd, pt, pc, ct, cc, T, dateAnalytics, monthlyAnalytics, clientAnalytics, fieldAnalytics };
  }, [filteredRows, data]);

  const selectedCollectorData = useMemo(() => an?.cd.find(c=>c.name===selectedCollector)||null, [selectedCollector, an]);
  const selectedDateRows = useMemo(() => {
    if (!selectedDate||!data||(!(data.datек||data.dtk))) return null;
    const sc={};
    filteredRows.forEach(r => { if(r._dateStr===selectedDate) sc[r._status]=(sc[r._status]||0)+1; });
    return Object.entries(sc).sort((a,b)=>b[1]-a[1]).map(([s,c])=>({ status:s, count:c, grp:DU[s.toUpperCase()]?.sg||"", tp:DU[s.toUpperCase()]?.tp||"" }));
  }, [selectedDate, data, filteredRows]);

  const tabs = [
    ["overview","📊 Overview"],
    ["status","🏷️ Status Detail"],
    ["collectors","👥 Collectors"],
    ["ptp","💰 PTP & Claims"],
    ["touch","📱 Touch Points"],
    ...(an?.dateAnalytics ? [["datetime","📅 Date & Time"]] : []),
    ...(an?.monthlyAnalytics ? [["monthly","📆 Monthly"]] : []),
    ...(an?.clientAnalytics ? [["clients","🏢 Client Compare"]] : []),
    ...(an?.fieldAnalytics ? [["field","🚗 Field Analytics"]] : []),
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0b0f1a", color: "#e2e8f0", fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-track{background:#1e293b}::-webkit-scrollbar-thumb{background:#475569;border-radius:3px}
        .card{background:#111827;border-radius:12px;padding:18px;border:1px solid #1f2937}
        .sc{background:linear-gradient(135deg,#111827,#0b0f1a);border-radius:12px;padding:16px;border:1px solid #1f2937}
        .bdg{display:inline-block;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600}
        table{width:100%;border-collapse:collapse;font-size:13px}
        th{background:#0b0f1a;color:#6b7280;font-weight:600;text-align:left;padding:9px 12px;border-bottom:1px solid #1f2937;font-size:11px;text-transform:uppercase;letter-spacing:.05em}
        td{padding:8px 12px;border-bottom:1px solid #111827;color:#cbd5e1}
        tr:hover td{background:#ffffff05}
        .dz{border:2px dashed #1f2937;border-radius:16px;padding:48px 24px;text-align:center;cursor:pointer;transition:all .2s}
        .dz:hover{border-color:#3b82f6;background:#111827}
        input[type=file]{display:none}
        .tb{background:none;border:none;cursor:pointer;padding:7px 16px;border-radius:8px;font-family:inherit;font-size:12px;font-weight:600;transition:all .2s;color:#6b7280;white-space:nowrap}
        .tb.ac{background:#1d4ed8;color:#fff}
        .tb:hover:not(.ac){background:#1f2937;color:#e2e8f0}
        .dr{cursor:pointer}.dr:hover td{background:#1a2035!important}.dr.sel td{background:#172554!important}
        .mode-btn{background:none;border:1px solid #1f2937;cursor:pointer;padding:4px 12px;border-radius:6px;font-family:inherit;font-size:12px;font-weight:500;color:#6b7280;transition:all .15s}
        .mode-btn.active{background:#1d4ed8;border-color:#3b82f6;color:#fff}
        .field-card{background:linear-gradient(135deg,#0a1f0a,#0b0f1a);border:1px solid #14532d;border-radius:12px;padding:18px}
      `}</style>

      {/* Header */}
      <div style={{ background: "#070b14", borderBottom: "1px solid #1f2937", padding: "14px 32px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ width: 38, height: 38, background: "linear-gradient(135deg,#1d4ed8,#7c3aed)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📊</div>
        <div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, color: "#f9fafb", letterSpacing: "-.02em" }}>Collections Analytics</div>
          <div style={{ fontSize: 11, color: "#4b5563" }}>Status Disposition Intelligence · 255 Dispositions · Client-Filtered</div>
        </div>
        {data && an && (
          <>
            <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#22c55e", background: "#052e16", padding: "4px 12px", borderRadius: 20, border: "1px solid #166534" }}>✓ {an.T.toLocaleString()} records</span>
              {selectedClient !== "ALL" && <span style={{ fontSize: 12, color: "#a78bfa", background: "#1e1b4b", padding: "4px 12px", borderRadius: 20, border: "1px solid #4c1d95" }}>🏢 {selectedClient}</span>}
              <button onClick={() => { setData(null); setErr(""); setSelectedClient("ALL"); setTab("overview"); }}
                style={{ background: "#1f2937", border: "1px solid #374151", color: "#9ca3af", borderRadius: 8, padding: "5px 12px", cursor: "pointer", fontSize: 12 }}>↩ New File</button>
            </div>
          </>
        )}
      </div>

      <div style={{ maxWidth: 1440, margin: "0 auto", padding: 24 }}>
        {!data && (
          <div style={{ maxWidth: 520, margin: "80px auto" }}>
            <div className="card">
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 24, marginBottom: 8, color: "#f9fafb" }}>Upload Collections File</div>
              <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 24 }}>Upload an Excel (.xlsx/.xls) with a <code style={{ color: "#60a5fa", background: "#0b0f1a", padding: "1px 5px", borderRadius: 4 }}>Status</code> column.</div>
              <div className="dz" onClick={() => fRef.current.click()}
                onDragOver={e=>{e.preventDefault();e.currentTarget.style.borderColor="#3b82f6";}}
                onDragLeave={e=>{e.currentTarget.style.borderColor="#1f2937";}}
                onDrop={e=>{e.preventDefault();e.currentTarget.style.borderColor="#1f2937";hf(e.dataTransfer.files[0]);}}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>📂</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#e2e8f0" }}>Drop Excel file here</div>
                <div style={{ fontSize: 13, color: "#6b7280", marginTop: 6 }}>or click to browse · .xlsx / .xls</div>
              </div>
              <input ref={fRef} type="file" accept=".xlsx,.xls" onChange={e=>hf(e.target.files[0])} />
              {loading && <div style={{ marginTop: 16, textAlign: "center", color: "#60a5fa", fontSize: 14 }}>⏳ Processing...</div>}
              {err && <div style={{ marginTop: 16, background: "#450a0a", border: "1px solid #7f1d1d", borderRadius: 8, padding: 12, color: "#fca5a5", fontSize: 13 }}>{err}</div>}
            </div>
          </div>
        )}

        {data && an && <>
          {/* Client Filter Bar */}
          {data.clients.length > 0 && <ClientFilterBar clients={data.clients} selected={selectedClient} onChange={c => { setSelectedClient(c); setSelectedDate(null); setSelectedCollector(null); setSelectedBucket(null); }} />}

          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(148px,1fr))", gap: 10, marginBottom: 18 }}>
            {[
              { l: "Valid Records", v: an.T.toLocaleString(), i: "✅", c: "#22c55e" },
              { l: "Unique Accounts", v: an.ua?.toLocaleString() ?? "N/A", i: "👤", c: "#f59e0b" },
              { l: "Collectors", v: an.cd.length, i: "👥", c: "#06b6d4" },
              { l: "PTP Amount", v: "₱" + fN(an.pt), i: "💰", c: "#22c55e" },
              { l: "Claim Paid", v: "₱" + fN(an.ct), i: "💳", c: "#f97316" },
              ...(an.fieldAnalytics ? [{ l: "Field Visits", v: an.fieldAnalytics.totalFieldVisits.toLocaleString(), i: "🚗", c: "#22c55e" }] : []),
            ].map(k => (
              <div key={k.l} className="sc">
                <div style={{ fontSize: 18, marginBottom: 4 }}>{k.i}</div>
                <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600 }}>{k.l}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: k.c, fontFamily: "'Syne',sans-serif", marginTop: 2 }}>{k.v}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 3, marginBottom: 16, background: "#070b14", padding: 4, borderRadius: 12, width: "fit-content", flexWrap: "wrap", border: "1px solid #1f2937" }}>
            {tabs.map(([t, l]) => (
              <button key={t} className={`tb${tab === t ? " ac" : ""}`} onClick={() => setTab(t)}>{l}</button>
            ))}
          </div>

          {/* ── OVERVIEW ── */}
          {tab === "overview" && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="card">
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, color: "#f9fafb" }}>Status Group Distribution</div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={an.gd} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({name,pct})=>`${name} ${pct}%`} labelLine={false}>
                    {an.gd.map((e,i)=><Cell key={i} fill={GC[e.name]||PC[i%PC.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v,n,p)=>[`${v.toLocaleString()} (${p.payload.pct}%)`,n]} contentStyle={TS} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, color: "#f9fafb" }}>Top 15 Statuses</div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={an.sd.slice(0,15)} layout="vertical" margin={{ left:0, right:16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis type="number" tick={{ fill:"#6b7280",fontSize:11 }} />
                  <YAxis type="category" dataKey="status" tick={{ fill:"#9ca3af",fontSize:9 }} width={175} />
                  <Tooltip contentStyle={TS} />
                  <Bar dataKey="count" radius={[0,4,4,0]}>
                    {an.sd.slice(0,15).map((e,i)=><Cell key={i} fill={GC[e.grp]||PC[i%PC.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card" style={{ gridColumn:"1/-1" }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, color: "#f9fafb" }}>Group Summary</div>
              <table>
                <thead><tr><th>Group</th><th>Count</th><th>%</th><th style={{ width: 200 }}>Distribution</th></tr></thead>
                <tbody>{an.gd.map(g=>(
                  <tr key={g.name}>
                    <td><span className="bdg" style={{ background:(GC[g.name]||"#3b82f6")+"33", color:GC[g.name]||"#94a3b8" }}>{g.name}</span></td>
                    <td style={{ fontWeight:600 }}>{g.value.toLocaleString()}</td>
                    <td>{g.pct}%</td>
                    <td><Pb pct={parseFloat(g.pct)} c={GC[g.name]||"#3b82f6"} /></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>}

          {/* ── STATUS DETAIL ── */}
          {tab === "status" && (() => {
            const filtered = an.sd.filter(s => !statusSearch || s.status.toLowerCase().includes(statusSearch.toLowerCase()) || s.grp.toLowerCase().includes(statusSearch.toLowerCase()));
            return (
              <div className="card">
                <div style={{ fontWeight:700, fontSize:14, marginBottom:4, color:"#f9fafb" }}>Status Detail — {an.sd.length} Statuses</div>
                <SearchBar value={statusSearch} onChange={setStatusSearch} placeholder="Filter by status or group..." />
                <div style={{ overflowX:"auto" }}>
                  <table>
                    <thead><tr><th>#</th><th>Status</th><th>Group</th><th>TP</th><th>Count</th><th>%</th><th style={{ width:100 }}>Bar</th></tr></thead>
                    <tbody>{filtered.map((s,i)=>(
                      <tr key={s.status}>
                        <td style={{ color:"#4b5563" }}>{i+1}</td>
                        <td style={{ fontWeight:500, color:"#e2e8f0" }}>{s.status}</td>
                        <td><span className="bdg" style={{ background:(GC[s.grp]||"#3b82f6")+"33", color:GC[s.grp]||"#94a3b8" }}>{s.grp}</span></td>
                        <td style={{ color:"#9ca3af" }}>{s.tp}</td>
                        <td style={{ fontWeight:600, color:"#f9fafb" }}>{s.count.toLocaleString()}</td>
                        <td style={{ color:"#60a5fa" }}>{s.pct}%</td>
                        <td><Pb pct={parseFloat(s.pct)} c={GC[s.grp]||"#3b82f6"} /></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {/* ── COLLECTORS ── */}
          {tab === "collectors" && <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <div className="card" style={{ gridColumn:"1/-1" }}>
              <div style={{ fontWeight:700, fontSize:14, marginBottom:4, color:"#f9fafb" }}>Top 20 Collectors</div>
              {an.cd.length===0 ? <div style={{ color:"#6b7280", fontSize:13, marginTop:8 }}>No "Remark By" column detected.</div> : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={an.cd.slice(0,20)} margin={{ bottom:90 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="name" tick={{ fill:"#6b7280",fontSize:10 }} angle={-40} textAnchor="end" interval={0} />
                    <YAxis tick={{ fill:"#6b7280",fontSize:11 }} />
                    <Tooltip contentStyle={TS} />
                    <Bar dataKey="total" fill="#3b82f6" radius={[4,4,0,0]} name="Efforts" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            {an.cd.length>0 && <>
              <div className="card" style={{ gridColumn:"1/-1" }}>
                <div style={{ fontWeight:700, fontSize:14, marginBottom:4, color:"#f9fafb" }}>Collector Table</div>
                <div style={{ fontSize:12, color:"#6b7280", marginBottom:8 }}>Click a row to drill down. {selectedCollector && <button onClick={()=>setSelectedCollector(null)} style={{ marginLeft:10, background:"#374151",border:"none",color:"#9ca3af",borderRadius:6,padding:"2px 8px",cursor:"pointer",fontSize:11 }}>✕ Clear</button>}</div>
                <SearchBar value={collectorSearch} onChange={setCollectorSearch} placeholder="Filter by collector name..." />
                <div style={{ overflowX:"auto", maxHeight:380, overflowY:"auto" }}>
                  <table>
                    <thead><tr><th>#</th><th>Collector</th><th>Total</th><th>% Share</th>{ALL_TP.filter(tp=>an.cd.some(c=>c.byTP[tp])).map(tp=><th key={tp} style={{ color:TP_COLORS[tp]||"#9ca3af" }}>{tp}</th>)}</tr></thead>
                    <tbody>{an.cd.filter(c=>!collectorSearch||c.name.toLowerCase().includes(collectorSearch.toLowerCase())).map((c,i)=>(
                      <tr key={c.name} className={`dr${selectedCollector===c.name?" sel":""}`} onClick={()=>setSelectedCollector(selectedCollector===c.name?null:c.name)}>
                        <td style={{ color:"#4b5563" }}>{i+1}</td>
                        <td style={{ fontWeight:600,color:"#e2e8f0" }}>{c.name}</td>
                        <td style={{ fontWeight:700,color:"#22c55e" }}>{c.total.toLocaleString()}</td>
                        <td style={{ color:"#60a5fa" }}>{((c.total/an.T)*100).toFixed(1)}%</td>
                        {ALL_TP.filter(tp=>an.cd.some(x=>x.byTP[tp])).map(tp=><td key={tp} style={{ color:TP_COLORS[tp]||"#9ca3af" }}>{(c.byTP[tp]||0).toLocaleString()}</td>)}
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
              {selectedCollector && selectedCollectorData && (
                <div className="card" style={{ gridColumn:"1/-1", border:"1px solid #1d4ed8" }}>
                  <div style={{ fontWeight:700, fontSize:14, color:"#f9fafb", marginBottom:16 }}>👤 {selectedCollector}</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                    <div>
                      <div style={{ fontWeight:600, fontSize:12, color:"#9ca3af", marginBottom:8 }}>By Touch Point</div>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie data={Object.entries(selectedCollectorData.byTP).map(([k,v])=>({name:k,value:v}))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                            {Object.entries(selectedCollectorData.byTP).map(([tp],i)=><Cell key={i} fill={TP_COLORS[tp]||PC[i%PC.length]} />)}
                          </Pie>
                          <Tooltip contentStyle={TS} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div>
                      <div style={{ fontWeight:600, fontSize:12, color:"#9ca3af", marginBottom:8 }}>By Outcome</div>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie data={Object.entries(selectedCollectorData.bySG).map(([k,v])=>({name:k,value:v}))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                            {Object.entries(selectedCollectorData.bySG).map(([sg],i)=><Cell key={i} fill={GC[sg]||PC[i%PC.length]} />)}
                          </Pie>
                          <Tooltip contentStyle={TS} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
            </>}
          </div>}

          {/* ── PTP & CLAIMS ── */}
          {tab === "ptp" && <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            {[{ l:"PTP Records",v:an.pc.toLocaleString(),c:"#3b82f6" },{ l:"Total PTP Amount",v:"₱"+fN(an.pt),c:"#22c55e" },{ l:"Claim Records",v:an.cc.toLocaleString(),c:"#f59e0b" },{ l:"Total Claim Amount",v:"₱"+fN(an.ct),c:"#f97316" }].map(k=>(
              <div key={k.l} className="sc">
                <div style={{ fontSize:12,color:"#6b7280",textTransform:"uppercase",letterSpacing:".05em",fontWeight:600 }}>{k.l}</div>
                <div style={{ fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:700,color:k.c,marginTop:4 }}>{k.v}</div>
              </div>
            ))}
          </div>}

          {/* ── TOUCH POINTS ── */}
          {tab === "touch" && <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <div className="card">
              <div style={{ fontWeight:700, fontSize:14, marginBottom:14, color:"#f9fafb" }}>Touch Point Distribution</div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={an.td} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({name,pct})=>`${name} ${pct}%`} labelLine={false}>
                    {an.td.map((e,i)=><Cell key={i} fill={TP_COLORS[e.name]||PC[i%PC.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={TS} />
                  <Legend wrapperStyle={{ fontSize:12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div style={{ fontWeight:700, fontSize:14, marginBottom:14, color:"#f9fafb" }}>Efforts by Touch Point</div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={an.td} layout="vertical" margin={{ left:0, right:20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis type="number" tick={{ fill:"#6b7280",fontSize:11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fill:"#9ca3af",fontSize:11 }} width={130} />
                  <Tooltip contentStyle={TS} />
                  <Bar dataKey="count" radius={[0,4,4,0]}>
                    {an.td.map((e,i)=><Cell key={i} fill={TP_COLORS[e.name]||PC[i%PC.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>}

          {/* ── DATE & TIME ── */}
          {tab === "datetime" && an.dateAnalytics && (() => {
            const { dateSorted, hourData, hasHours } = an.dateAnalytics;
            return (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <div className="card" style={{ gridColumn:"1/-1" }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:4, color:"#f9fafb" }}>Daily Efforts Trend</div>
                  <div style={{ fontSize:12, color:"#6b7280", marginBottom:8 }}>
                    Click a bar to drill into that date.
                    {selectedDate && <button onClick={()=>setSelectedDate(null)} style={{ marginLeft:10, background:"#374151",border:"none",color:"#9ca3af",borderRadius:6,padding:"2px 8px",cursor:"pointer",fontSize:11 }}>✕ Clear</button>}
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={dateSorted} margin={{ left:0, right:16, bottom:dateSorted.length>20?70:20 }} onClick={e=>e?.activeLabel&&setSelectedDate(e.activeLabel)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                      <XAxis dataKey="date" tick={{ fill:"#6b7280",fontSize:10 }} angle={dateSorted.length>15?-35:0} textAnchor={dateSorted.length>15?"end":"middle"} interval={dateSorted.length>30?Math.floor(dateSorted.length/20):0} />
                      <YAxis tick={{ fill:"#6b7280",fontSize:11 }} />
                      <Tooltip contentStyle={TS} />
                      <Bar dataKey="total" fill="#3b82f6" radius={[3,3,0,0]} name="Total" style={{ cursor:"pointer" }} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {selectedDate && selectedDateRows && (
                  <div className="card" style={{ gridColumn:"1/-1", border:"1px solid #1d4ed8" }}>
                    <div style={{ fontWeight:700, fontSize:14, color:"#f9fafb", marginBottom:12 }}>📅 {selectedDate}</div>
                    <table>
                      <thead><tr><th>#</th><th>Status</th><th>Group</th><th>TP</th><th>Count</th><th>%</th></tr></thead>
                      <tbody>{selectedDateRows.map((s,i)=>{
                        const total=selectedDateRows.reduce((a,b)=>a+b.count,0);
                        return <tr key={s.status}><td style={{ color:"#4b5563" }}>{i+1}</td><td style={{ color:"#e2e8f0",fontWeight:500 }}>{s.status}</td><td><span className="bdg" style={{ background:(GC[s.grp]||"#3b82f6")+"33",color:GC[s.grp]||"#94a3b8" }}>{s.grp}</span></td><td style={{ color:"#6b7280" }}>{s.tp}</td><td style={{ fontWeight:700 }}>{s.count.toLocaleString()}</td><td style={{ color:"#60a5fa" }}>{((s.count/total)*100).toFixed(1)}%</td></tr>;
                      })}</tbody>
                    </table>
                  </div>
                )}
                <div className="card" style={{ gridColumn:"1/-1" }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:4, color:"#f9fafb" }}>Daily Group Breakdown (Stacked)</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={dateSorted} margin={{ left:0, right:16, bottom:dateSorted.length>20?70:20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                      <XAxis dataKey="date" tick={{ fill:"#6b7280",fontSize:10 }} angle={dateSorted.length>15?-35:0} textAnchor={dateSorted.length>15?"end":"middle"} interval={dateSorted.length>30?Math.floor(dateSorted.length/20):0} />
                      <YAxis tick={{ fill:"#6b7280",fontSize:11 }} />
                      <Tooltip contentStyle={TS} />
                      <Legend wrapperStyle={{ fontSize:11 }} />
                      {SG_GROUPS.map(sg=><Bar key={sg} dataKey={sg} stackId="a" fill={GC[sg]||"#6b7280"} name={sg} />)}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {hasHours && (
                  <div className="card" style={{ gridColumn:"1/-1" }}>
                    <div style={{ fontWeight:700, fontSize:14, marginBottom:4, color:"#f9fafb" }}>Activity by Hour</div>
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={hourData} margin={{ left:0, right:16 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                        <XAxis dataKey="hour" tick={{ fill:"#6b7280",fontSize:10 }} interval={1} />
                        <YAxis tick={{ fill:"#6b7280",fontSize:11 }} />
                        <Tooltip contentStyle={TS} />
                        <Bar dataKey="count" fill="#a78bfa" radius={[3,3,0,0]} name="Records" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ═══════════════════════════════════════════════════════════════
              ── 📆 MONTHLY TAB ──
          ═══════════════════════════════════════════════════════════════ */}
          {tab === "monthly" && an.monthlyAnalytics && (() => {
            const { monthlySorted, monthList, clientMonthMap } = an.monthlyAnalytics;
            const activeTPs_m = ALL_TP.filter(tp => monthlySorted.some(m => m.byTP[tp]));
            const allClients_m = data.clients;
            const bestMonth = monthlySorted.length ? monthlySorted.reduce((a,b)=>b.total>a.total?b:a, monthlySorted[0]) : null;
            const bestPTPMonth = monthlySorted.length ? monthlySorted.reduce((a,b)=>b.ptpAmt>a.ptpAmt?b:a, monthlySorted[0]) : null;

            return (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:12 }}>
                {[
                  { l:"Active Months", v:monthList.length, i:"📆", c:"#a78bfa" },
                  { l:"Best Month", v:bestMonth?.month||"–", i:"🏆", c:"#f59e0b", sub:bestMonth?.total.toLocaleString()+" records" },
                  { l:"Best PTP Month", v:bestPTPMonth?.month||"–", i:"💰", c:"#22c55e", sub:"₱"+fN(bestPTPMonth?.ptpAmt||0) },
                  { l:"Avg / Month", v:monthList.length>0?(an.T/monthList.length).toFixed(0):"–", i:"📊", c:"#06b6d4" },
                ].map(k=>(
                  <div key={k.l} className="sc">
                    <div style={{ fontSize:18, marginBottom:4 }}>{k.i}</div>
                    <div style={{ fontSize:10, color:"#6b7280", textTransform:"uppercase", letterSpacing:".06em", fontWeight:600 }}>{k.l}</div>
                    <div style={{ fontSize:16, fontWeight:700, color:k.c, fontFamily:"'Syne',sans-serif", marginTop:2 }}>{k.v}</div>
                    {k.sub && <div style={{ fontSize:11, color:"#4b5563", marginTop:2 }}>{k.sub}</div>}
                  </div>
                ))}

                {/* Monthly total trend */}
                <div className="card" style={{ gridColumn:"1/-1" }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:4, color:"#f9fafb" }}>Monthly Total Efforts Trend</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={monthlySorted} margin={{ left:0, right:16, bottom:monthlySorted.length>8?40:10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                      <XAxis dataKey="month" tick={{ fill:"#6b7280",fontSize:11 }} angle={monthlySorted.length>8?-25:0} textAnchor={monthlySorted.length>8?"end":"middle"} interval={0} />
                      <YAxis tick={{ fill:"#6b7280",fontSize:11 }} />
                      <Tooltip contentStyle={TS} />
                      <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2.5} dot={{ r:4,fill:"#3b82f6" }} name="Total Efforts" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Monthly Group Comparison */}
                <div className="card" style={{ gridColumn:"1/-1" }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:4, color:"#f9fafb" }}>Monthly Outcome Group Breakdown</div>
                  <div style={{ display:"flex", gap:6, marginBottom:12, flexWrap:"wrap" }}>
                    <span style={{ fontSize:12, color:"#6b7280" }}>Show:</span>
                    {["total",...SG_GROUPS].map(m=>(
                      <button key={m} className={`mode-btn${monthCompareMetric===m?" active":""}`} onClick={()=>setMonthCompareMetric(m)}>{m==="total"?"All":m}</button>
                    ))}
                  </div>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={monthlySorted} margin={{ left:0, right:16, bottom:monthlySorted.length>8?40:10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                      <XAxis dataKey="month" tick={{ fill:"#6b7280",fontSize:11 }} angle={monthlySorted.length>8?-25:0} textAnchor={monthlySorted.length>8?"end":"middle"} interval={0} />
                      <YAxis tick={{ fill:"#6b7280",fontSize:11 }} />
                      <Tooltip contentStyle={TS} />
                      <Legend wrapperStyle={{ fontSize:11 }} />
                      {monthCompareMetric === "total"
                        ? SG_GROUPS.map(sg=><Bar key={sg} dataKey={sg} stackId="a" fill={GC[sg]||"#6b7280"} name={sg} />)
                        : <Bar dataKey={monthCompareMetric} fill={GC[monthCompareMetric]||"#3b82f6"} radius={[3,3,0,0]} name={monthCompareMetric} />
                      }
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Monthly PTP Amount trend */}
                {monthlySorted.some(m=>m.ptpAmt>0) && (
                  <div className="card" style={{ gridColumn:"1/3" }}>
                    <div style={{ fontWeight:700, fontSize:14, marginBottom:4, color:"#f9fafb" }}>Monthly PTP Amount</div>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={monthlySorted} margin={{ left:0, right:16, bottom:monthlySorted.length>8?40:10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                        <XAxis dataKey="month" tick={{ fill:"#6b7280",fontSize:10 }} angle={-25} textAnchor="end" interval={0} />
                        <YAxis tick={{ fill:"#6b7280",fontSize:10 }} tickFormatter={v=>v>=1e6?(v/1e6).toFixed(1)+"M":v>=1e3?(v/1e3).toFixed(0)+"K":v} />
                        <Tooltip contentStyle={TS} formatter={v=>["₱"+fN(v),"PTP Amount"]} />
                        <Bar dataKey="ptpAmt" fill="#22c55e" radius={[3,3,0,0]} name="PTP Amount" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Monthly Claim Amount trend */}
                {monthlySorted.some(m=>m.claimAmt>0) && (
                  <div className="card" style={{ gridColumn:"3/5" }}>
                    <div style={{ fontWeight:700, fontSize:14, marginBottom:4, color:"#f9fafb" }}>Monthly Claim Paid Amount</div>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={monthlySorted} margin={{ left:0, right:16, bottom:monthlySorted.length>8?40:10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                        <XAxis dataKey="month" tick={{ fill:"#6b7280",fontSize:10 }} angle={-25} textAnchor="end" interval={0} />
                        <YAxis tick={{ fill:"#6b7280",fontSize:10 }} tickFormatter={v=>v>=1e6?(v/1e6).toFixed(1)+"M":v>=1e3?(v/1e3).toFixed(0)+"K":v} />
                        <Tooltip contentStyle={TS} formatter={v=>["₱"+fN(v),"Claim Amount"]} />
                        <Bar dataKey="claimAmt" fill="#f97316" radius={[3,3,0,0]} name="Claim Amount" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Monthly Touch Point Mix */}
                <div className="card" style={{ gridColumn:"1/-1" }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:4, color:"#f9fafb" }}>Monthly Touch Point Mix</div>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={monthlySorted.map(m=>({ month:m.month,...m.byTP }))} margin={{ left:0, right:16, bottom:monthlySorted.length>8?40:10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                      <XAxis dataKey="month" tick={{ fill:"#6b7280",fontSize:11 }} angle={monthlySorted.length>8?-25:0} textAnchor={monthlySorted.length>8?"end":"middle"} interval={0} />
                      <YAxis tick={{ fill:"#6b7280",fontSize:11 }} />
                      <Tooltip contentStyle={TS} />
                      <Legend wrapperStyle={{ fontSize:11 }} />
                      {activeTPs_m.map(tp=><Bar key={tp} dataKey={tp} stackId="tp" fill={TP_COLORS[tp]||"#6b7280"} name={tp} />)}
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Monthly Data Table */}
                <div className="card" style={{ gridColumn:"1/-1" }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:8, color:"#f9fafb" }}>Monthly Summary Table</div>
                  <div style={{ overflowX:"auto" }}>
                    <table>
                      <thead><tr>
                        <th>Month</th><th>Total</th>
                        {SG_GROUPS.map(sg=><th key={sg} style={{ color:GC[sg] }}>{sg}</th>)}
                        <th style={{ color:"#22c55e" }}>PTP Amt</th>
                        <th style={{ color:"#f97316" }}>Claim Amt</th>
                        <th>RPC%</th><th>PTP%</th><th>KEPT%</th>
                      </tr></thead>
                      <tbody>{monthlySorted.map(m=>(
                        <tr key={m.month}>
                          <td style={{ fontWeight:700, color:"#e2e8f0" }}>{m.month}</td>
                          <td style={{ fontWeight:700, color:"#60a5fa" }}>{m.total.toLocaleString()}</td>
                          {SG_GROUPS.map(sg=><td key={sg} style={{ color:GC[sg]||"#9ca3af" }}>{(m[sg]||0).toLocaleString()}</td>)}
                          <td style={{ color:"#22c55e", fontSize:12 }}>₱{fN(m.ptpAmt)}</td>
                          <td style={{ color:"#f97316", fontSize:12 }}>₱{fN(m.claimAmt)}</td>
                          <td style={{ color:"#3b82f6" }}>{m.total>0?((m.RPC/m.total)*100).toFixed(1):0}%</td>
                          <td style={{ color:"#f59e0b" }}>{m.total>0?((m.PTP/m.total)*100).toFixed(1):0}%</td>
                          <td style={{ color:"#22c55e" }}>{m.total>0?((m.KEPT/m.total)*100).toFixed(1):0}%</td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                </div>

                {/* Client × Month heatmap */}
                {allClients_m.length > 0 && Object.keys(clientMonthMap).length > 0 && (
                  <div className="card" style={{ gridColumn:"1/-1" }}>
                    <div style={{ fontWeight:700, fontSize:14, marginBottom:4, color:"#f9fafb" }}>Client × Month Volume Heatmap</div>
                    <div style={{ fontSize:12, color:"#6b7280", marginBottom:12 }}>How many efforts were made per client per month.</div>
                    <div style={{ overflowX:"auto" }}>
                      <table style={{ fontSize:11 }}>
                        <thead>
                          <tr>
                            <th style={{ position:"sticky",left:0,background:"#0b0f1a",zIndex:2,minWidth:150 }}>Client</th>
                            {monthList.map(m=><th key={m} style={{ textAlign:"center",minWidth:70,color:"#6b7280" }}>{m}</th>)}
                            <th style={{ color:"#22c55e" }}>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allClients_m.map(cl => {
                            const mData = clientMonthMap[cl]||{};
                            const total = Object.values(mData).reduce((s,v)=>s+v,0);
                            const maxVal = Math.max(...monthList.map(m=>mData[m]||0));
                            return (
                              <tr key={cl}>
                                <td style={{ position:"sticky",left:0,background:"#111827",fontWeight:600,color:"#e2e8f0",zIndex:1 }}>{cl}</td>
                                {monthList.map(m=>{
                                  const val = mData[m]||0;
                                  const intensity = maxVal>0?val/maxVal:0;
                                  const bg = val===0?"#0b0f1a":`rgba(167,139,250,${0.08+intensity*0.82})`;
                                  return (
                                    <td key={m} style={{ textAlign:"center", padding:"4px 6px" }}>
                                      <div style={{ background:bg,color:intensity>0.5?"#fff":"#6b7280",borderRadius:4,padding:"3px 4px",fontWeight:600,minWidth:54,border:"1px solid #1f2937" }}>
                                        {val>0?val.toLocaleString():"–"}
                                      </div>
                                    </td>
                                  );
                                })}
                                <td style={{ fontWeight:700,color:"#a78bfa" }}>{total.toLocaleString()}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ═══════════════════════════════════════════════════════════════
              ── 🏢 CLIENT COMPARE TAB ──
          ═══════════════════════════════════════════════════════════════ */}
          {tab === "clients" && an.clientAnalytics && (() => {
            const { clientList } = an.clientAnalytics;
            const allRows_T = data.rows.length;
            return (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <div className="card">
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:14, color:"#f9fafb" }}>Volume by Client</div>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={clientList} layout="vertical" margin={{ left:0, right:20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                      <XAxis type="number" tick={{ fill:"#6b7280",fontSize:11 }} />
                      <YAxis type="category" dataKey="name" tick={{ fill:"#9ca3af",fontSize:11 }} width={140} />
                      <Tooltip contentStyle={TS} />
                      <Bar dataKey="total" radius={[0,4,4,0]}>
                        {clientList.map((_,i)=><Cell key={i} fill={PC[i%PC.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="card">
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:14, color:"#f9fafb" }}>Client Outcome Mix</div>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={clientList.map(c=>({ name:c.name,...c.bySG }))} layout="vertical" margin={{ left:0, right:20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                      <XAxis type="number" tick={{ fill:"#6b7280",fontSize:11 }} />
                      <YAxis type="category" dataKey="name" tick={{ fill:"#9ca3af",fontSize:11 }} width={140} />
                      <Tooltip contentStyle={TS} />
                      <Legend wrapperStyle={{ fontSize:11 }} />
                      {SG_GROUPS.map(sg=><Bar key={sg} dataKey={sg} stackId="a" fill={GC[sg]||"#6b7280"} name={sg} />)}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="card" style={{ gridColumn:"1/-1" }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:8, color:"#f9fafb" }}>Client Comparison Table (All Clients)</div>
                  <div style={{ overflowX:"auto" }}>
                    <table>
                      <thead><tr>
                        <th>#</th><th>Client</th><th>Total</th><th>% Share</th>
                        {SG_GROUPS.map(sg=><th key={sg} style={{ color:GC[sg] }}>{sg}</th>)}
                        <th style={{ color:"#22c55e" }}>PTP Amt</th>
                        <th style={{ color:"#f97316" }}>Claim Amt</th>
                        <th>RPC%</th><th>PTP%</th><th>KEPT%</th>
                        <th style={{ width:120 }}>Bar</th>
                      </tr></thead>
                      <tbody>{clientList.map((c,i)=>(
                        <tr key={c.name}>
                          <td style={{ color:"#4b5563" }}>{i+1}</td>
                          <td style={{ fontWeight:700, color:PC[i%PC.length] }}>{c.name}</td>
                          <td style={{ fontWeight:700 }}>{c.total.toLocaleString()}</td>
                          <td style={{ color:"#60a5fa" }}>{((c.total/allRows_T)*100).toFixed(1)}%</td>
                          {SG_GROUPS.map(sg=><td key={sg} style={{ color:GC[sg]||"#9ca3af" }}>{(c.bySG[sg]||0).toLocaleString()}</td>)}
                          <td style={{ color:"#22c55e", fontSize:12 }}>₱{fN(c.ptpAmt)}</td>
                          <td style={{ color:"#f97316", fontSize:12 }}>₱{fN(c.claimAmt)}</td>
                          <td style={{ color:"#3b82f6" }}>{c.total>0?(((c.bySG.RPC||0)/c.total)*100).toFixed(1):0}%</td>
                          <td style={{ color:"#f59e0b" }}>{c.total>0?(((c.bySG.PTP||0)/c.total)*100).toFixed(1):0}%</td>
                          <td style={{ color:"#22c55e" }}>{c.total>0?(((c.bySG.KEPT||0)/c.total)*100).toFixed(1):0}%</td>
                          <td><Pb pct={(c.total/clientList[0].total)*100} c={PC[i%PC.length]} /></td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                </div>
                {/* Client Radar */}
                {clientList.length >= 2 && (
                  <div className="card" style={{ gridColumn:"1/-1" }}>
                    <div style={{ fontWeight:700, fontSize:14, marginBottom:4, color:"#f9fafb" }}>Client Outcome Rate Radar (%)</div>
                    <div style={{ fontSize:12, color:"#6b7280", marginBottom:12 }}>Rate = group count ÷ client total × 100</div>
                    <ResponsiveContainer width="100%" height={320}>
                      <RadarChart data={SG_GROUPS.map(sg=>({ sg, ...Object.fromEntries(clientList.map(c=>[c.name, c.total>0?parseFloat((((c.bySG[sg]||0)/c.total)*100).toFixed(1)):0])) }))} cx="50%" cy="50%" outerRadius={110}>
                        <PolarGrid stroke="#1f2937" />
                        <PolarAngleAxis dataKey="sg" tick={{ fill:"#9ca3af",fontSize:12 }} />
                        {clientList.slice(0,8).map((c,i)=>(
                          <Radar key={c.name} name={c.name} dataKey={c.name} stroke={PC[i%PC.length]} fill={PC[i%PC.length]} fillOpacity={0.1} />
                        ))}
                        <Legend wrapperStyle={{ fontSize:11 }} />
                        <Tooltip contentStyle={TS} formatter={v=>[v.toFixed(1)+"%"]} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ═══════════════════════════════════════════════════════════════
              ── 🚗 FIELD ANALYTICS TAB ──
          ═══════════════════════════════════════════════════════════════ */}
          {tab === "field" && an.fieldAnalytics && (() => {
            const fa = an.fieldAnalytics;
            const subtypeArr = Object.entries(fa.subtypeMap).map(([k,v])=>({name:k,value:v,pct:((v/fa.totalFieldVisits)*100).toFixed(1)}));
            const fieldPTPRate = fa.totalFieldVisits>0?((fa.fieldPtpCount/fa.totalFieldVisits)*100).toFixed(1):0;

            return (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:12 }}>
                {/* KPIs */}
                {[
                  { l:"Total Field Visits", v:fa.totalFieldVisits.toLocaleString(), i:"🚗", c:"#22c55e" },
                  { l:"Unique Accts Visited", v:fa.uniqueFieldAccounts!=null?fa.uniqueFieldAccounts.toLocaleString():"N/A", i:"👤", c:"#3b82f6" },
                  { l:"Active Field Days", v:fa.activeDays, i:"📅", c:"#a78bfa" },
                  { l:"Avg Visits/Day", v:fa.avgVisitsPerDay, i:"📊", c:"#f59e0b" },
                  { l:"Peak Field Day", v:fa.peakFieldDay?.date||"–", i:"🔝", c:"#f97316", sub:fa.peakFieldDay?.count.toLocaleString()+" visits" },
                  { l:"Field PTP Count", v:fa.fieldPtpCount.toLocaleString(), i:"💰", c:"#22c55e", sub:"Rate: "+fieldPTPRate+"%" },
                  { l:"Field PTP Amount", v:"₱"+fN(fa.fieldPtpAmt), i:"💳", c:"#06b6d4" },
                  { l:"Buckets Visited", v:fa.bucketVisitData.length, i:"📍", c:"#ec4899" },
                ].map(k=>(
                  <div key={k.l} className="field-card">
                    <div style={{ fontSize:18, marginBottom:4 }}>{k.i}</div>
                    <div style={{ fontSize:10, color:"#4ade80", textTransform:"uppercase", letterSpacing:".06em", fontWeight:600, opacity:.7 }}>{k.l}</div>
                    <div style={{ fontSize:16, fontWeight:700, color:k.c, fontFamily:"'Syne',sans-serif", marginTop:2 }}>{k.v}</div>
                    {k.sub && <div style={{ fontSize:11, color:"#4b5563", marginTop:2 }}>{k.sub}</div>}
                  </div>
                ))}

                {/* Visits per Bucket */}
                <div className="card" style={{ gridColumn:"1/3" }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:4, color:"#f9fafb" }}>Field Visits per Bucket</div>
                  <div style={{ fontSize:12, color:"#6b7280", marginBottom:14 }}>Total field visit count by delinquency bucket.</div>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={fa.bucketVisitData} layout="vertical" margin={{ left:0, right:20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                      <XAxis type="number" tick={{ fill:"#6b7280",fontSize:11 }} />
                      <YAxis type="category" dataKey="name" tick={{ fill:"#9ca3af",fontSize:11 }} width={110} />
                      <Tooltip contentStyle={TS} formatter={(v,n)=>[v.toLocaleString(),n]} />
                      <Bar dataKey="visits" radius={[0,4,4,0]} name="Visits">
                        {fa.bucketVisitData.map(b=><Cell key={b.name} fill={BUCKET_COLORS[b.name]||"#6b7280"} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* % Visits from Total per Bucket */}
                <div className="card" style={{ gridColumn:"3/5" }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:4, color:"#f9fafb" }}>% Visits from Total (Bucket Share)</div>
                  <div style={{ fontSize:12, color:"#6b7280", marginBottom:14 }}>Each bucket's share of all field visits.</div>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={fa.bucketVisitData.map(b=>({name:b.name,value:b.visits}))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                        {fa.bucketVisitData.map(b=><Cell key={b.name} fill={BUCKET_COLORS[b.name]||"#6b7280"} />)}
                      </Pie>
                      <Tooltip contentStyle={TS} formatter={v=>[v.toLocaleString()+" visits"]} />
                      <Legend wrapperStyle={{ fontSize:11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* % of Accounts Visited per Bucket (penetration) */}
                {fa.hasAccounts && (
                  <div className="card" style={{ gridColumn:"1/-1" }}>
                    <div style={{ fontWeight:700, fontSize:14, marginBottom:4, color:"#f9fafb" }}>Field Penetration: % of Accounts Visited per Bucket</div>
                    <div style={{ fontSize:12, color:"#6b7280", marginBottom:14 }}>
                      What % of unique accounts in each bucket received at least one field visit.
                      {" "}<span style={{ color:"#f59e0b" }}>Higher = more thorough field coverage.</span>
                    </div>
                    <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginBottom:16 }}>
                      {fa.bucketVisitData.filter(b=>b.totalAccts>0).map(b=>(
                        <div key={b.name} style={{ background:"#0b0f1a", border:`1px solid ${BUCKET_COLORS[b.name]||"#1f2937"}44`, borderRadius:8, padding:"10px 14px", minWidth:130 }}>
                          <div style={{ fontSize:11, color:BUCKET_COLORS[b.name]||"#9ca3af", fontWeight:700 }}>{b.name}</div>
                          <div style={{ fontSize:22, fontWeight:800, color:"#f9fafb", fontFamily:"'Syne',sans-serif" }}>{b.pctOfAccts}%</div>
                          <div style={{ fontSize:11, color:"#4b5563" }}>{b.visitedAccts.toLocaleString()} / {b.totalAccts.toLocaleString()} accts</div>
                          <Pb pct={parseFloat(b.pctOfAccts)} c={BUCKET_COLORS[b.name]||"#3b82f6"} />
                        </div>
                      ))}
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={fa.bucketVisitData.filter(b=>b.totalAccts>0)} margin={{ bottom:30 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                        <XAxis dataKey="name" tick={{ fill:"#6b7280",fontSize:11 }} angle={fa.bucketVisitData.length>5?-20:0} textAnchor={fa.bucketVisitData.length>5?"end":"middle"} interval={0} />
                        <YAxis tick={{ fill:"#6b7280",fontSize:11 }} unit="%" domain={[0,100]} />
                        <Tooltip contentStyle={TS} formatter={v=>[v+"%","Penetration"]} />
                        <Bar dataKey="pctOfAccts" radius={[4,4,0,0]} name="% Accounts Visited">
                          {fa.bucketVisitData.filter(b=>b.totalAccts>0).map(b=><Cell key={b.name} fill={BUCKET_COLORS[b.name]||"#6b7280"} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Bucket visit details table */}
                <div className="card" style={{ gridColumn:"1/-1" }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:4, color:"#f9fafb" }}>
                    Bucket Visit Details
                    {fieldBucketDrilldown && <button onClick={()=>setFieldBucketDrilldown(null)} style={{ marginLeft:10, background:"#374151",border:"none",color:"#9ca3af",borderRadius:6,padding:"2px 8px",cursor:"pointer",fontSize:11 }}>✕ Clear</button>}
                  </div>
                  <div style={{ overflowX:"auto" }}>
                    <table>
                      <thead><tr>
                        <th>#</th><th>Bucket</th><th>Visits</th><th>% of Total Visits</th>
                        {fa.hasAccounts && <><th>Visited Accts</th><th>Total Accts</th><th>Penetration %</th></>}
                        <th style={{ width:120 }}>Bar</th>
                      </tr></thead>
                      <tbody>{fa.bucketVisitData.map((b,i)=>(
                        <tr key={b.name} className="dr" style={{ cursor:"default" }}>
                          <td style={{ color:"#4b5563" }}>{i+1}</td>
                          <td><span className="bdg" style={{ background:(BUCKET_COLORS[b.name]||"#6b7280")+"33", color:BUCKET_COLORS[b.name]||"#9ca3af" }}>{b.name}</span></td>
                          <td style={{ fontWeight:700, color:BUCKET_COLORS[b.name]||"#22c55e" }}>{b.visits.toLocaleString()}</td>
                          <td style={{ color:"#60a5fa" }}>{b.pctOfTotal}%</td>
                          {fa.hasAccounts && <>
                            <td style={{ color:"#a78bfa" }}>{b.visitedAccts.toLocaleString()}</td>
                            <td style={{ color:"#9ca3af" }}>{b.totalAccts.toLocaleString()}</td>
                            <td style={{ fontWeight:700, color: parseFloat(b.pctOfAccts)>50?"#22c55e":parseFloat(b.pctOfAccts)>25?"#f59e0b":"#ef4444" }}>{b.pctOfAccts}%</td>
                          </>}
                          <td><Pb pct={(b.visits/fa.bucketVisitData[0].visits)*100} c={BUCKET_COLORS[b.name]||"#3b82f6"} /></td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                </div>

                {/* Field Outcome Groups */}
                <div className="card" style={{ gridColumn:"1/3" }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:14, color:"#f9fafb" }}>Field Visit Outcomes</div>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={fa.fieldSGData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({name,pct})=>`${name} ${pct}%`} labelLine={false}>
                        {fa.fieldSGData.map((e,i)=><Cell key={i} fill={GC[e.name]||PC[i%PC.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v,n,p)=>[`${v.toLocaleString()} (${p.payload.pct}%)`,n]} contentStyle={TS} />
                      <Legend wrapperStyle={{ fontSize:12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Field visit sub-type */}
                <div className="card" style={{ gridColumn:"3/5" }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:14, color:"#f9fafb" }}>Field Type (FIELD vs CARAVAN)</div>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={subtypeArr} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({name,pct})=>`${name} ${pct}%`} labelLine={false}>
                        {subtypeArr.map((_,i)=><Cell key={i} fill={["#22c55e","#06b6d4","#a78bfa"][i%3]} />)}
                      </Pie>
                      <Tooltip contentStyle={TS} />
                      <Legend wrapperStyle={{ fontSize:12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Field dates trend */}
                {fa.hasDate && fa.fieldDateSorted.length > 0 && (
                  <div className="card" style={{ gridColumn:"1/-1" }}>
                    <div style={{ fontWeight:700, fontSize:14, marginBottom:4, color:"#f9fafb" }}>Field Visits by Date</div>
                    <div style={{ fontSize:12, color:"#6b7280", marginBottom:14 }}>Daily field activity — {fa.fieldDateSorted.length} active field dates</div>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={fa.fieldDateSorted} margin={{ left:0, right:16, bottom:fa.fieldDateSorted.length>20?70:20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                        <XAxis dataKey="date" tick={{ fill:"#6b7280",fontSize:10 }} angle={fa.fieldDateSorted.length>15?-35:0} textAnchor={fa.fieldDateSorted.length>15?"end":"middle"} interval={fa.fieldDateSorted.length>30?Math.floor(fa.fieldDateSorted.length/20):0} />
                        <YAxis tick={{ fill:"#6b7280",fontSize:11 }} />
                        <Tooltip contentStyle={TS} formatter={v=>[v.toLocaleString()+" visits"]} />
                        <Bar dataKey="count" fill="#22c55e" radius={[3,3,0,0]} name="Field Visits" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Monthly field visits */}
                {fa.fieldMonthSorted.length > 0 && (
                  <div className="card" style={{ gridColumn:"1/3" }}>
                    <div style={{ fontWeight:700, fontSize:14, marginBottom:4, color:"#f9fafb" }}>Monthly Field Visit Trend</div>
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={fa.fieldMonthSorted} margin={{ left:0, right:16, bottom:fa.fieldMonthSorted.length>6?40:10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                        <XAxis dataKey="month" tick={{ fill:"#6b7280",fontSize:11 }} angle={-20} textAnchor="end" interval={0} />
                        <YAxis tick={{ fill:"#6b7280",fontSize:11 }} />
                        <Tooltip contentStyle={TS} formatter={v=>[v.toLocaleString()+" visits"]} />
                        <Line type="monotone" dataKey="count" stroke="#22c55e" strokeWidth={2.5} dot={{ r:4,fill:"#22c55e" }} name="Field Visits" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Top Field Collectors */}
                {fa.fieldCollectorData.length > 0 && (
                  <div className="card" style={{ gridColumn:"3/5" }}>
                    <div style={{ fontWeight:700, fontSize:14, marginBottom:4, color:"#f9fafb" }}>Top Field Collectors</div>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={fa.fieldCollectorData.slice(0,10)} layout="vertical" margin={{ left:0, right:20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                        <XAxis type="number" tick={{ fill:"#6b7280",fontSize:11 }} />
                        <YAxis type="category" dataKey="name" tick={{ fill:"#9ca3af",fontSize:10 }} width={120} />
                        <Tooltip contentStyle={TS} />
                        <Bar dataKey="count" radius={[0,4,4,0]} fill="#22c55e" name="Visits">
                          {fa.fieldCollectorData.slice(0,10).map((_,i)=><Cell key={i} fill={PC[i%PC.length]} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Top Field Statuses */}
                <div className="card" style={{ gridColumn:"1/-1" }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:4, color:"#f9fafb" }}>Top Field Status Results</div>
                  <div style={{ fontSize:12, color:"#6b7280", marginBottom:8 }}>Breakdown of specific field dispositions recorded.</div>
                  <div style={{ overflowX:"auto", maxHeight:360, overflowY:"auto" }}>
                    <table>
                      <thead><tr><th>#</th><th>Status</th><th>Group</th><th>Count</th><th>%</th><th style={{ width:120 }}>Bar</th></tr></thead>
                      <tbody>{fa.fieldStatusData.map((s,i)=>(
                        <tr key={s.status}>
                          <td style={{ color:"#4b5563" }}>{i+1}</td>
                          <td style={{ fontWeight:500, color:"#e2e8f0" }}>{s.status}</td>
                          <td><span className="bdg" style={{ background:(GC[s.grp]||"#22c55e")+"33", color:GC[s.grp]||"#22c55e" }}>{s.grp}</span></td>
                          <td style={{ fontWeight:700, color:"#22c55e" }}>{s.count.toLocaleString()}</td>
                          <td style={{ color:"#60a5fa" }}>{s.pct}%</td>
                          <td><Pb pct={parseFloat(s.pct)} c={GC[s.grp]||"#22c55e"} /></td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}
        </>}
      </div>
    </div>
  );
}