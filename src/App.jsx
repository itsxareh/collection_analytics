import { useState, useMemo, useRef } from "react";
import * as XLSX from "xlsx";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";

const DISP = {
  "CALL - POS_UNATTENDED": { tp: "CALL", sg: "NEG" },
  "CALL - POS_KOR": { tp: "CALL", sg: "NEG" },
  "CALL - POS_DROPPED": { tp: "CALL", sg: "NEG" },
  "CALL - POS_BUSY": { tp: "CALL", sg: "NEG" },
  "CALL - POS_LEAVE MSG TO 3RD PARTY": { tp: "CALL", sg: "POS" },
  "CALL - UNDERNEGO": { tp: "CALL", sg: "RPC" },
  "CALL - CLAIMING PAID": { tp: "CALL", sg: "RPC" },
  "CALL - INSURANCE CLAIM": { tp: "CALL", sg: "RPC" },
  "CALL - UNIT_IMPOUNDED": { tp: "CALL", sg: "RPC" },
  "CALL - UNIT UNDER HPG": { tp: "CALL", sg: "RPC" },
  "CALL - UNIT_ASSUMED": { tp: "CALL", sg: "RPC" },
  "CALL - UNIT DAMAGE OR WRECK": { tp: "CALL", sg: "RPC" },
  "CALL - UNIT_CARNAPPED": { tp: "CALL", sg: "RPC" },
  "CALL - NO INTENTION TO PAY": { tp: "CALL", sg: "NEG" },
  "CALL - PTP REPO": { tp: "CALL", sg: "PTP" },
  "CALL - PTP PAYOFF": { tp: "CALL", sg: "PTP" },
  "CALL - PTP FULL UPDATE": { tp: "CALL", sg: "PTP" },
  "CALL - PTP PUSH BACK": { tp: "CALL", sg: "PTP" },
  "CALL - PTP PARTIAL": { tp: "CALL", sg: "PTP" },
  "CALL - FOLLOW UP KOR": { tp: "CALL", sg: "NEG" },
  "CALL - FOLLOW UP UNCONTACTABLE": { tp: "CALL", sg: "NEG" },
  "CALL - FOLLOW UP LMTRC": { tp: "CALL", sg: "NEG" },
  "CALL - FOLLOW UP COMPLIANT": { tp: "CALL", sg: "NEG" },
  "CALL - POS_CBR": { tp: "CALL", sg: "NEG" },
  "CALL - NEG_UNATTENDED": { tp: "CALL", sg: "NEG" },
  "CALL - NEG_KOR": { tp: "CALL", sg: "NEG" },
  "CALL - NEG_DROPPED": { tp: "CALL", sg: "NEG" },
  "CALL - NEG_WRONG NUMBER": { tp: "CALL", sg: "NEG" },
  "CALL - NEG_LEAVE MSG TO 3RD PARTY": { tp: "CALL", sg: "NEG" },
  "CALL - NEG_EMPLOYER NLC": { tp: "CALL", sg: "NEG" },
  "CALL - NEG_BUSY": { tp: "CALL", sg: "NEG" },
  "CALL - NEG_NOT IN SERVICE": { tp: "CALL", sg: "NEG" },
  "CALL - DECEASED": { tp: "CALL", sg: "NEG" },
  "CALL - NEG_CBR": { tp: "CALL", sg: "NEG" },
  "CALL - KEPT_REPO CLIENT": { tp: "CALL", sg: "KEPT" },
  "CALL - KEPT_REPO 3RD PARTY": { tp: "CALL", sg: "KEPT" },
  "CALL -  KEPT PAYOFF": { tp: "CALL", sg: "KEPT" },
  "CALL - KEPT_FULL UPDATE": { tp: "CALL", sg: "KEPT" },
  "CALL - KEPT_PUSH BACK": { tp: "CALL", sg: "KEPT" },
  "CALL - KEPT_PARTIAL": { tp: "CALL", sg: "KEPT" },
  "BUSY": { tp: "CALL", sg: "NEG" },
  "DROPPED": { tp: "CALL", sg: "NEG" },
  "RNA": { tp: "CALL", sg: "NEG" },
  "PM": { tp: "CALL", sg: "NEG" },
  "PU": { tp: "CALL", sg: "NEG" },
  "CARAVAN - UNLOCATED": { tp: "FIELD", sg: "NEG" },
  "CARAVAN - CLIENT UNKNOWN": { tp: "FIELD", sg: "NEG" },
  "CARAVAN - CLIENT OUT OF AREA": { tp: "FIELD", sg: "NEG" },
  "CARAVAN - NOT ALLOWED TO ENTER": { tp: "FIELD", sg: "NEG" },
  "CARAVAN - DECEASED": { tp: "FIELD", sg: "NEG" },
  "CARAVAN - LOT ONLY": { tp: "FIELD", sg: "NEG" },
  "CARAVAN - LEAVE MESSAGE TO 3RD PARTY": { tp: "FIELD", sg: "POS" },
  "CARAVAN - HOUSED CLOSED UNVERIFIED": { tp: "FIELD", sg: "NEG" },
  "CARAVAN - HOUSED CLOSED VERIFIED": { tp: "FIELD", sg: "NEG" },
  "CARAVAN - MOVED OUT": { tp: "FIELD", sg: "NEG" },
  "CARAVAN - RESULT": { tp: "FIELD", sg: "NEG" },
  "CARAVAN - PTP REPO": { tp: "FIELD", sg: "PTP" },
  "CARAVAN - PTP FULL UPDATE": { tp: "FIELD", sg: "PTP" },
  "CARAVAN - PTP PAYOFF": { tp: "FIELD", sg: "PTP" },
  "CARAVAN - PTP PUSHBACK": { tp: "FIELD", sg: "PTP" },
  "CARAVAN - PTP PARTIAL": { tp: "FIELD", sg: "PTP" },
  "CARAVAN - FOLLOW UP COMPLIANT": { tp: "FIELD", sg: "NEG" },
  "CARAVAN - CLAIMING PAID": { tp: "FIELD", sg: "RPC" },
  "CARAVAN - INSURANCE CLAIM": { tp: "FIELD", sg: "RPC" },
  "CARAVAN - UNIT CARNAPPED": { tp: "FIELD", sg: "RPC" },
  "CARAVAN - UNIT UNDER HPG": { tp: "FIELD", sg: "RPC" },
  "CARAVAN - UNIT IMPOUNDED": { tp: "FIELD", sg: "RPC" },
  "CARAVAN - UNIT ASSUMED": { tp: "FIELD", sg: "RPC" },
  "CARAVAN - UNIT DAMAGE OR WRECK": { tp: "FIELD", sg: "RPC" },
  "CARAVAN - NO INTENTION TO PAY": { tp: "FIELD", sg: "RPC" },
  "CARAVAN - KEPT_REPO CLIENT": { tp: "FIELD", sg: "KEPT" },
  "CARAVAN - KEPT_REPO 3RD PARTY": { tp: "FIELD", sg: "KEPT" },
  "CARAVAN - KEPT PAYOFF": { tp: "FIELD", sg: "KEPT" },
  "CARAVAN - KEPT_FULL UPDATE": { tp: "FIELD", sg: "KEPT" },
  "CARAVAN - KEPT_PUSH BACK": { tp: "FIELD", sg: "KEPT" },
  "CARAVAN - KEPT_PARTIAL": { tp: "FIELD", sg: "KEPT" },
  "SKIP - NEGATIVE": { tp: "INTERNET", sg: "NEG" },
  "SKIP - SMEDIA ACCOUNT": { tp: "INTERNET", sg: "NEG" },
  "SKIP - NEW ADDRESS": { tp: "INTERNET", sg: "NEG" },
  "SKIP - CONTACT NUMBER": { tp: "INTERNET", sg: "NEG" },
  "SKIP - POSSIBLE LEADS": { tp: "INTERNET", sg: "NEG" },
  "SKIP - UNIT CARNAPPED": { tp: "INTERNET", sg: "RPC" },
  "SKIP - UNIT UNDER HPG": { tp: "INTERNET", sg: "RPC" },
  "SKIP - UNIT IMPOUNDED": { tp: "INTERNET", sg: "RPC" },
  "SKIP - UNIT ASSUMED": { tp: "INTERNET", sg: "RPC" },
  "SKIP - UNIT DAMAGE OR WRECK": { tp: "INTERNET", sg: "RPC" },
  "SKIP - KEPT_REPO CLIENT": { tp: "INTERNET", sg: "KEPT" },
  "SKIP - KEPT_REPO 3RD PARTY": { tp: "INTERNET", sg: "KEPT" },
  "SKIP - KEPT PAYOFF": { tp: "INTERNET", sg: "KEPT" },
  "SKIP - KEPT_FULL UPDATE": { tp: "INTERNET", sg: "KEPT" },
  "SKIP - KEPT_PUSH BACK": { tp: "INTERNET", sg: "KEPT" },
  "SKIP - KEPT_PARTIAL": { tp: "INTERNET", sg: "KEPT" },
  "SMEDIA - NEG_SENT A MESSAGE": { tp: "INTERNET", sg: "NEG" },
  "SMEDIA - POS_SENT A MESSAGE": { tp: "INTERNET", sg: "POS" },
  "SMEDIA - RESPONSIVE": { tp: "INTERNET", sg: "RPC" },
  "SMEDIA - PTP REPO": { tp: "INTERNET", sg: "PTP" },
  "SMEDIA - PTP PAYOFF": { tp: "INTERNET", sg: "PTP" },
  "SMEDIA - PTP FULL UPDATE": { tp: "INTERNET", sg: "PTP" },
  "SMEDIA - PTP PUSH BACK": { tp: "INTERNET", sg: "PTP" },
  "SMEDIA - PTP PARTIAL": { tp: "INTERNET", sg: "PTP" },
  "SMEDIA - FOLLOW UP MESSAGE": { tp: "INTERNET", sg: "NEG" },
  "SMEDIA - FOLLOW UP COMPLIANT": { tp: "INTERNET", sg: "NEG" },
  "SMEDIA - CLAIMING PAID": { tp: "INTERNET", sg: "RPC" },
  "SMEDIA - INSURANCE CLAIM": { tp: "INTERNET", sg: "RPC" },
  "SMEDIA - UNIT CARNAPPED": { tp: "INTERNET", sg: "RPC" },
  "SMEDIA - UNIT UNDER HPG": { tp: "INTERNET", sg: "RPC" },
  "SMEDIA - UNIT IMPOUNDED": { tp: "INTERNET", sg: "RPC" },
  "SMEDIA - UNIT ASSUMED": { tp: "INTERNET", sg: "RPC" },
  "SMEDIA - UNIT DAMAGE OR WRECK": { tp: "INTERNET", sg: "RPC" },
  "SMEDIA - NO INTENTION TO PAY": { tp: "INTERNET", sg: "RPC" },
  "SMEDIA - KEPT_REPO CLIENT": { tp: "INTERNET", sg: "KEPT" },
  "SMEDIA - KEPT_REPO 3RD PARTY": { tp: "INTERNET", sg: "KEPT" },
  "SMEDIA - KEPT PAYOFF": { tp: "INTERNET", sg: "KEPT" },
  "SMEDIA - KEPT_FULL UPDATE": { tp: "INTERNET", sg: "KEPT" },
  "SMEDIA - KEPT_PUSH BACK": { tp: "INTERNET", sg: "KEPT" },
  "SMEDIA - KEPT_PARTIAL": { tp: "INTERNET", sg: "KEPT" },
  "FIELD - UNLOCATED": { tp: "FIELD", sg: "NEG" },
  "FIELD - CLIENT_UNKNOWN": { tp: "FIELD", sg: "NEG" },
  "FIELD - CLIENT_OUT OF AREA": { tp: "FIELD", sg: "NEG" },
  "FIELD - NOT_ALLOWED TO ENTER": { tp: "FIELD", sg: "NEG" },
  "FIELD - DECEASED": { tp: "FIELD", sg: "NEG" },
  "FIELD - LOT_ONLY": { tp: "FIELD", sg: "NEG" },
  "FIELD - LEAVE_MESSAGE TO 3RD PARTY": { tp: "FIELD", sg: "POS" },
  "FIELD - HOUSED_CLOSED UNVERIFIED": { tp: "FIELD", sg: "NEG" },
  "FIELD - HOUSED CLOSED VERIFIED": { tp: "FIELD", sg: "NEG" },
  "FIELD - MOVED_OUT": { tp: "FIELD", sg: "NEG" },
  "FIELD - RESULT": { tp: "FIELD", sg: "NEG" },
  "FIELD - PTP REPO": { tp: "FIELD", sg: "PTP" },
  "FIELD - PTP_FULL UPDATE": { tp: "FIELD", sg: "PTP" },
  "FIELD - PTP_PAYOFF": { tp: "FIELD", sg: "PTP" },
  "FIELD - PTP_PUSHBACK": { tp: "FIELD", sg: "PTP" },
  "FIELD - PTP_PARTIAL": { tp: "FIELD", sg: "PTP" },
  "FIELD - FOLLOW UP COMPLIANT": { tp: "FIELD", sg: "NEG" },
  "FIELD - CLAIMING PAID": { tp: "FIELD", sg: "RPC" },
  "FIELD - INSURANCE CLAIM": { tp: "FIELD", sg: "RPC" },
  "FIELD - UNIT CARNAPPED": { tp: "FIELD", sg: "RPC" },
  "FIELD - UNIT UNDER HPG": { tp: "FIELD", sg: "RPC" },
  "FIELD - UNIT IMPOUNDED": { tp: "FIELD", sg: "RPC" },
  "FIELD - UNIT ASSUMED": { tp: "FIELD", sg: "RPC" },
  "FIELD - UNIT DAMAGE OR WRECK": { tp: "FIELD", sg: "RPC" },
  "FIELD - NO INTENTION TO PAY": { tp: "FIELD", sg: "RPC" },
  "FIELD - KEPT_REPO CLIENT": { tp: "FIELD", sg: "KEPT" },
  "FIELD - KEPT_REPO 3RD PARTY": { tp: "FIELD", sg: "KEPT" },
  "FIELD - KEPT PAYOFF": { tp: "FIELD", sg: "KEPT" },
  "FIELD - KEPT_FULL UPDATE": { tp: "FIELD", sg: "KEPT" },
  "FIELD - KEPT_PUSH BACK": { tp: "FIELD", sg: "KEPT" },
  "FIELD - KEPT_PARTIAL": { tp: "FIELD", sg: "KEPT" },
  "EMAIL - NO EMAIL": { tp: "EMAIL", sg: "NEG" },
  "EMAIL - NEG_SENT MESSAGE": { tp: "EMAIL", sg: "NEG" },
  "EMAIL - DECEASED": { tp: "EMAIL", sg: "NEG" },
  "EMAIL - POS_SENT MESSAGE": { tp: "EMAIL", sg: "POS" },
  "EMAIL - RESPONSIVE": { tp: "EMAIL", sg: "RPC" },
  "EMAIL - GOT NEW CONTACT": { tp: "EMAIL", sg: "NEG" },
  "EMAIL - PTP REPO": { tp: "EMAIL", sg: "PTP" },
  "EMAIL - PTP PAYOFF": { tp: "EMAIL", sg: "PTP" },
  "EMAIL - PTP FULL UPDATE": { tp: "EMAIL", sg: "PTP" },
  "EMAIL - PTP PUSH BACK": { tp: "EMAIL", sg: "PTP" },
  "EMAIL - PTP_PARTIAL": { tp: "EMAIL", sg: "PTP" },
  "EMAIL - CLAIMING PAID": { tp: "EMAIL", sg: "RPC" },
  "EMAIL - INSURANCE CLAIM": { tp: "EMAIL", sg: "RPC" },
  "EMAIL - UNIT CARNAPPED": { tp: "EMAIL", sg: "RPC" },
  "EMAIL - UNIT UNDER HPG": { tp: "EMAIL", sg: "RPC" },
  "EMAIL - NO INTENTION TO PAY": { tp: "EMAIL", sg: "NEG" },
  "EMAIL - UNIT_IMPOUNDED": { tp: "EMAIL", sg: "RPC" },
  "EMAIL - UNIT ASSUMED": { tp: "EMAIL", sg: "RPC" },
  "EMAIL - UNIT DAMAGE OR WRECK": { tp: "EMAIL", sg: "RPC" },
  "EMAIL - FOLLOW UP MESSAGE": { tp: "EMAIL", sg: "NEG" },
  "EMAIL - FOLLOW UP COMPLIANT": { tp: "EMAIL", sg: "NEG" },
  "EMAIL - CEASE COLLECTION": { tp: "EMAIL", sg: "NEG" },
  "EMAIL - KEPT_ REPO CLIENT": { tp: "EMAIL", sg: "KEPT" },
  "EMAIL - KEPT_REPO 3RD PARTY": { tp: "EMAIL", sg: "KEPT" },
  "EMAIL - KEPT PAYOFF": { tp: "EMAIL", sg: "KEPT" },
  "EMAIL - KEPT_FULL UPDATE": { tp: "EMAIL", sg: "KEPT" },
  "EMAIL - KEPT_PUSH BACK": { tp: "EMAIL", sg: "KEPT" },
  "EMAIL - KEPT_PARTIAL": { tp: "EMAIL", sg: "KEPT" },
  "SMS - NEG_SENT MESSAGE": { tp: "SMS", sg: "NEG" },
  "SMS - DECEASED": { tp: "SMS", sg: "NEG" },
  "SMS - WRONG NUMBER": { tp: "SMS", sg: "NEG" },
  "SMS - POS_SENT MESSAGE": { tp: "SMS", sg: "POS" },
  "SMS - RESPONSIVE": { tp: "SMS", sg: "RPC" },
  "SMS - GOT NEW CONTACT NUM": { tp: "SMS", sg: "NEG" },
  "SMS - PTP REPO": { tp: "SMS", sg: "PTP" },
  "SMS - PTP PAYOFF": { tp: "SMS", sg: "PTP" },
  "SMS - PTP FULL UPDATE": { tp: "SMS", sg: "PTP" },
  "SMS - PTP PUSH BACK": { tp: "SMS", sg: "PTP" },
  "SMS - PTP_PARTIAL": { tp: "SMS", sg: "PTP" },
  "SMS - CLAIMING PAID": { tp: "SMS", sg: "RPC" },
  "SMS - INSURANCE CLAIM": { tp: "SMS", sg: "RPC" },
  "SMS - UNIT IMPOUNDED": { tp: "SMS", sg: "RPC" },
  "SMS - UNDER HPG": { tp: "SMS", sg: "RPC" },
  "SMS - UNIT ASSUMED": { tp: "SMS", sg: "RPC" },
  "SMS - UNIT DAMAGE OR WRECK": { tp: "SMS", sg: "RPC" },
  "SMS - UNIT CARNAPPED": { tp: "SMS", sg: "RPC" },
  "SMS - NO INTENTION TO PAY": { tp: "SMS", sg: "NEG" },
  "SMS - FOLLOW UP MESSAGE": { tp: "SMS", sg: "NEG" },
  "SMS - FOLLOW UP COMPLIANT": { tp: "SMS", sg: "NEG" },
  "SMS - KEPT_REPO CLIENT": { tp: "SMS", sg: "KEPT" },
  "SMS - KEPT_REPO 3RD PARTY": { tp: "SMS", sg: "KEPT" },
  "SMS - KEPT PAYOFF": { tp: "SMS", sg: "KEPT" },
  "SMS - KEPT_FULL UPDATE": { tp: "SMS", sg: "KEPT" },
  "SMS - KEPT_PUSH BACK": { tp: "SMS", sg: "KEPT" },
  "SMS - KEPT_PARTIAL": { tp: "SMS", sg: "KEPT" },
  "SMS SENT": { tp: "SMS", sg: "NEG" },
  "BULK SMS SENT": { tp: "SMS", sg: "NEG" },
  "VIBER - NO VIBER": { tp: "VIBER", sg: "NEG" },
  "VIBER - DELIVERED": { tp: "VIBER", sg: "NEG" },
  "VIBER - READ": { tp: "VIBER", sg: "NEG" },
  "VIBER - PENDING": { tp: "VIBER", sg: "NEG" },
  "VIBER - BOUNCED": { tp: "VIBER", sg: "NEG" },
  "VIBER - POS_SENT A MESSAGE": { tp: "VIBER", sg: "POS" },
  "VIBER - NEG_SENT A MESSAGE": { tp: "VIBER", sg: "NEG" },
  "VIBER - RESPONSIVE": { tp: "VIBER", sg: "RPC" },
  "VIBER - PTP REPO": { tp: "VIBER", sg: "PTP" },
  "VIBER - PTP PAYOFF": { tp: "VIBER", sg: "PTP" },
  "VIBER - PTP FULL UPDATE": { tp: "VIBER", sg: "PTP" },
  "VIBER - PTP PUSH BACK": { tp: "VIBER", sg: "PTP" },
  "VIBER - PARTIAL": { tp: "VIBER", sg: "PTP" },
  "VIBER - FOLLOW UP MESSAGE": { tp: "VIBER", sg: "NEG" },
  "VIBER - FOLLOW UP COMPLIANT": { tp: "VIBER", sg: "NEG" },
  "VIBER - CLAIMING PAID": { tp: "VIBER", sg: "RPC" },
  "VIBER - INSURANCE CLAIM": { tp: "VIBER", sg: "RPC" },
  "VIBER - UNIT CARNAPPED": { tp: "VIBER", sg: "RPC" },
  "VIBER - UNIT UNDER HPG": { tp: "VIBER", sg: "RPC" },
  "VIBER - UNIT IMPOUNDED": { tp: "VIBER", sg: "RPC" },
  "VIBER - UNIT ASSUMED": { tp: "VIBER", sg: "RPC" },
  "VIBER - UNIT DAMAGE OR WRECK": { tp: "VIBER", sg: "RPC" },
  "VIBER - NO INTENTION TO PAY": { tp: "VIBER", sg: "RPC" },
  "VIBER - KEPT_REPO CLIENT": { tp: "VIBER", sg: "KEPT" },
  "VIBER - KEPT_REPO 3RD PARTY": { tp: "VIBER", sg: "KEPT" },
  "VIBER -  KEPT PAYOFF": { tp: "VIBER", sg: "KEPT" },
  "VIBER - KEPT_FULL UPDATE": { tp: "VIBER", sg: "KEPT" },
  "VIBER - KEPT_PUSH BACK": { tp: "VIBER", sg: "KEPT" },
  "VIBER - KEPT_PARTIAL": { tp: "VIBER", sg: "KEPT" },
  "CEASE - POSSIBLE COMPLAINT": { tp: "CEASE COLLECTION", sg: "NEG" },
  "CEASE - PENDING COMPLAINT": { tp: "CEASE COLLECTION", sg: "NEG" },
  "CEASE - VALID COMPLAINT": { tp: "CEASE COLLECTION", sg: "NEG" },
  "CEASE - REQUESTED BY BANK": { tp: "CEASE COLLECTION", sg: "NEG" },
  "CEASE - CLAIMING PAID": { tp: "CEASE COLLECTION", sg: "RPC" },
  "CEASE - INSURANCE CLAIM": { tp: "CEASE COLLECTION", sg: "RPC" },
  "CEASE - REPOSSESSED BY OTHER ECA": { tp: "CEASE COLLECTION", sg: "NEG" },
  "FIELD REQUEST - OTS SURE REPO": { tp: "FIELD REQUEST", sg: "NEG" },
  "FIELD REQUEST - FOR REVISIT": { tp: "FIELD REQUEST", sg: "NEG" },
  "FIELD REQUEST - BP_NC": { tp: "FIELD REQUEST", sg: "NEG" },
  "FIELD REQUEST - NEW_ADDRESS": { tp: "FIELD REQUEST", sg: "NEG" },
  "REPO AI - PTP REPO": { tp: "REPO AI", sg: "PTP" },
  "REPO AI - PTP FULL UPDATE": { tp: "REPO AI", sg: "PTP" },
  "REPO AI - PTP PAY OFF": { tp: "REPO AI", sg: "PTP" },
  "REPO AI - PTP PUSHBACK": { tp: "REPO AI", sg: "PTP" },
  "REPO AI - PTP PARTIAL": { tp: "REPO AI", sg: "PTP" },
  "REPO AI - KEPT_REPO CLIENT": { tp: "REPO AI", sg: "KEPT" },
  "REPO AI - KEPT_REPO 3RD PARTY": { tp: "REPO AI", sg: "KEPT" },
  "REPO AI - KEPT PAYOFF": { tp: "REPO AI", sg: "KEPT" },
  "REPO AI - KEPT_FULL UPDATE": { tp: "REPO AI", sg: "KEPT" },
  "REPO AI - KEPT_PUSH BACK": { tp: "REPO AI", sg: "KEPT" },
  "REPO AI - KEPT_PARTIAL": { tp: "REPO AI", sg: "KEPT" }
};

// ── Bucket/Placement mapping ────────────────────────────────────────────────
const BUCKET_MAP = {
  "01BDORA": "Bucket 1",
  "01BDA":   "Bucket 1",
  "02BDA":   "Bucket 2",
  "05BDA":   "Bucket 5",
  "06BDA":   "Bucket 6",
  "01OASSA": "Sub Standard 1",
  "02OASSA": "Sub Standard 2",
  "03OASSA": "Substandard 3",
  "04OAFWA": "Write Off",
  "01OAFSA": "Bucket 1",
  "02OAFSA": "Bucket 2",
  "03OAFSA": "Bucket 3",
  "04OAFSA": "Bucket 4",
  "05OAFSA": "Bucket 5",
  "06OAFSA": "Bucket 6",
  "01BMIM":  "Regular",
  "02BMIM":  "NPA",
  "03BMIM":  "Write Off",
};

// Canonical bucket order for sorting
const BUCKET_ORDER = [
  "Bucket 1","Bucket 2","Bucket 3","Bucket 4","Bucket 5","Bucket 6",
  "Sub Standard 1","Sub Standard 2","Substandard 3",
  "Regular","NPA","Write Off"
];

const BUCKET_COLORS = {
  "Bucket 1":       "#3b82f6",
  "Bucket 2":       "#06b6d4",
  "Bucket 3":       "#a78bfa",
  "Bucket 4":       "#f59e0b",
  "Bucket 5":       "#f97316",
  "Bucket 6":       "#ef4444",
  "Sub Standard 1": "#84cc16",
  "Sub Standard 2": "#22c55e",
  "Substandard 3":  "#14b8a6",
  "Regular":        "#60a5fa",
  "NPA":            "#fb923c",
  "Write Off":      "#dc2626",
};

const resolveBucket = (rawVal) => {
  if (!rawVal) return null;
  const s = String(rawVal).trim().toUpperCase();
  // Direct match
  const direct = BUCKET_MAP[String(rawVal).trim()];
  if (direct) return direct;
  // Try uppercase key match
  for (const [k, v] of Object.entries(BUCKET_MAP)) {
    if (k.toUpperCase() === s) return v;
  }
  // Partial match: if the raw value contains one of the keys
  for (const [k, v] of Object.entries(BUCKET_MAP)) {
    if (s.includes(k.toUpperCase())) return v;
  }
  return null;
};

const EXCLUDED_REMARKS = [
  "New Assignment",
  "System Auto Update Remarks For PD",
  "Updates when case reassign to another collector",
  "Sub Special Status Change",
  "New files imported"
];

const GC = { "NEG": "#c94537", "RPC": "#3b82f6", "KEPT": "#22c55e", "PTP": "#f58c0b", "FOLLOW UP": "#a78bfa", "POS": "#06b6d4" };
const PC = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#a78bfa", "#06b6d4", "#f97316", "#84cc16", "#ec4899", "#14b8a6", "#8b5cf6", "#fb7185"];
const TP_COLORS = {
  "CALL": "#3b82f6", "FIELD": "#22c55e", "SMS": "#f59e0b", "VIBER": "#a78bfa",
  "EMAIL": "#06b6d4", "INTERNET": "#f97316", "CEASE COLLECTION": "#ef4444",
  "FIELD REQUEST": "#84cc16", "REPO AI": "#ec4899"
};
const DU = {};
Object.keys(DISP).forEach(k => { DU[k.toUpperCase()] = { ...DISP[k], orig: k }; });

const fN = n => n == null ? "-" : typeof n === "number" ? n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : String(n);
const parseAmt = v => {
  if (v == null || v === "") return NaN;
  if (typeof v === "number") return v;
  const cleaned = String(v).replace(/[₱$,\s]/g, "").trim();
  return parseFloat(cleaned);
};
const fD = v => {
  if (!v) return null;
  if (v instanceof Date) {
    if (isNaN(v.getTime())) return null;
    const mo = String(v.getMonth() + 1).padStart(2, "0");
    const dy = String(v.getDate()).padStart(2, "0");
    const yr = v.getFullYear();
    return `${mo}/${dy}/${yr}`;
  }
  const s = String(v).trim();
  const dmyMatch = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmyMatch) {
    const [, a, b, yr] = dmyMatch;
    const day = parseInt(a), mon = parseInt(b);
    if (day > 12 || (day <= 12 && mon <= 12)) {
      return `${String(mon).padStart(2, "0")}/${String(day).padStart(2, "0")}/${yr}`;
    }
  }
  const d = new Date(s);
  if (!isNaN(d.getTime())) {
    const mo = String(d.getMonth() + 1).padStart(2, "0");
    const dy = String(d.getDate()).padStart(2, "0");
    const yr = d.getFullYear();
    return `${mo}/${dy}/${yr}`;
  }
  return s;
};

const parseTimeHour = (v) => {
  if (!v) return null;
  if (v instanceof Date && !isNaN(v.getTime())) return v.getHours();
  const s = String(v).trim();
  const m = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if (m) {
    let h = parseInt(m[1]);
    const ampm = m[4];
    if (ampm) {
      if (ampm.toLowerCase() === "pm" && h !== 12) h += 12;
      if (ampm.toLowerCase() === "am" && h === 12) h = 0;
    }
    if (h >= 0 && h <= 23) return h;
  }
  const d = new Date(s);
  if (!isNaN(d.getTime())) return d.getHours();
  return null;
};

const isExcludedRemark = (remarkVal) => {
  if (!remarkVal) return false;
  const s = String(remarkVal).toLowerCase();
  return EXCLUDED_REMARKS.some(phrase => s.includes(phrase.toLowerCase()));
};

const Pb = ({ pct, c }) => (
  <div style={{ height: 6, background: "#0f172a", borderRadius: 3, overflow: "hidden" }}>
    <div style={{ height: "100%", borderRadius: 3, width: Math.min(pct, 100) + "%", background: c }} />
  </div>
);

const SG_GROUPS = ["NEG", "RPC", "PTP", "KEPT", "POS"];
const ALL_TP = ["CALL", "SMS", "VIBER", "EMAIL", "FIELD", "INTERNET", "CEASE COLLECTION", "FIELD REQUEST", "REPO AI"];

const SearchBar = ({ value, onChange, placeholder = "Search..." }) => (
  <div style={{ position: "relative", marginBottom: 10 }}>
    <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#475569", fontSize: 13 }}>🔍</span>
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: 8,
        color: "#e2e8f0", fontSize: 13, padding: "7px 10px 7px 32px", fontFamily: "inherit", outline: "none"
      }}
    />
    {value && <button onClick={() => onChange("")} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 14 }}>x</button>}
  </div>
);

export default function App() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("overview");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCollector, setSelectedCollector] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedBucket, setSelectedBucket] = useState(null);
  const fRef = useRef();

  const [statusSort, setStatusSort] = useState({ key: "count", dir: "desc" });
  const [statusSearch, setStatusSearch] = useState("");
  const [collectorSort, setCollectorSort] = useState({ key: "total", dir: "desc" });
  const [collectorSearch, setCollectorSearch] = useState("");
  const [dateSort, setDateSort] = useState({ key: "total", dir: "desc" });
  const [dateSearch, setDateSearch] = useState("");
  const [clientSort, setClientSort] = useState({ key: "total", dir: "desc" });
  const [clientSearch, setClientSearch] = useState("");
  const [touchSort, setTouchSort] = useState({ key: "count", dir: "desc" });
  const [touchSearch, setTouchSearch] = useState("");
  const [bucketSort, setBucketSort] = useState({ key: "total", dir: "desc" });
  const [bucketSearch, setBucketSearch] = useState("");

  const mkSort = (ss, setSS) => (key) => setSS(prev => ({ key, dir: prev.key === key && prev.dir === "desc" ? "asc" : "desc" }));
  const mkIcon = (ss) => ({ col }) => col !== ss.key
    ? <span style={{ color: "#334155", marginLeft: 4, cursor: "pointer" }}>⇅</span>
    : <span style={{ color: "#60a5fa", marginLeft: 4, cursor: "pointer" }}>{ss.dir === "asc" ? "↑" : "↓"}</span>;

  const sortFilter = (arr, ss, search, fields) => {
    let rows = arr || [];
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(r => fields.some(f => r[f] != null && String(r[f]).toLowerCase().includes(q)));
    }
    if (ss.key) {
      rows = [...rows].sort((a, b) => {
        const av = a[ss.key], bv = b[ss.key];
        const na = parseFloat(av), nb = parseFloat(bv);
        const cmp = !isNaN(na) && !isNaN(nb) ? na - nb : String(av ?? "").localeCompare(String(bv ?? ""));
        return ss.dir === "asc" ? cmp : -cmp;
      });
    }
    return rows;
  };

  const hf = file => {
    if (!file) return;
    if (!file.name.match(/\.(xlsx|xls)$/i)) { setErr("Error: File must be .xlsx or .xls"); return; }
    setLoading(true); setErr(""); setData(null);
    const r = new FileReader();
    r.onload = e => {
      try {
        const wb = XLSX.read(e.target.result, { type: "array", cellDates: true });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const raw = XLSX.utils.sheet_to_json(ws, { defval: null, raw: false });
        if (!raw.length) { setErr("Error: The uploaded file is empty."); setLoading(false); return; }
        const keys = Object.keys(raw[0]);
        const sk = keys.find(k => k.trim().toLowerCase() === "status");
        if (!sk) { setErr("Error: The uploaded file does not contain a 'Status' column."); setLoading(false); return; }
        const ak = keys.find(k => k.toLowerCase().includes("account no") || k.toLowerCase().includes("acct no"));
        const rk = keys.find(k => k.toLowerCase().includes("remark by"));
        const rmk = keys.find(k => {
          const l = k.toLowerCase();
          return (l.includes("remark") && !l.includes("remark by")) || l === "remarks" || l === "notes" || l.includes("note");
        });
        const pak = keys.find(k => k.toLowerCase().includes("ptp amount"));
        const pdk = keys.find(k => k.toLowerCase().includes("ptp date") && !k.toLowerCase().includes("claim"));
        const cak = keys.find(k => k.toLowerCase().includes("claim paid amount"));
        const cdk = keys.find(k => k.toLowerCase().includes("claim paid date"));
        const datек = keys.find(k => {
          const l = k.trim().toLowerCase();
          return l === "date" || l === "remark date" || l === "activity date" || l === "log date";
        });
        const timek = keys.find(k => {
          const l = k.trim().toLowerCase();
          return l === "time" || l === "remark time" || l === "activity time" || l === "log time";
        });
        const dtk = (!datек && !timek) ? keys.find(k => {
          const l = k.toLowerCase();
          return l === "date and time" || l === "datetime" || l === "date/time";
        }) : null;
        const clk = keys.find(k => {
          const l = k.trim().toLowerCase();
          return l === "client" || l === "client type" || l === "client name" || l === "clienttype";
        });
        // Old IC / Bucket column
        const oick = keys.find(k => {
          const l = k.trim().toLowerCase();
          return l === "old ic" || l === "oldic" || l === "old_ic" || l === "placement" || l === "bucket";
        });

        const allRows = raw.map(r => ({ ...r, _su: r[sk] ? String(r[sk]).trim().toUpperCase() : null }));
        const totalRaw = allRows.length;

        const remarkExcludedCount = allRows.filter(r => {
          const remarkCol = rmk ? r[rmk] : null;
          const remarkByCol = rk ? r[rk] : null;
          return isExcludedRemark(remarkCol) || isExcludedRemark(remarkByCol);
        }).length;

        const afterRemarkFilter = allRows.filter(r => {
          const remarkCol = rmk ? r[rmk] : null;
          const remarkByCol = rk ? r[rk] : null;
          return !isExcludedRemark(remarkCol) && !isExcludedRemark(remarkByCol);
        });

        const rows = afterRemarkFilter
          .filter(r => r._su && DU[r._su])
          .map(r => ({
            ...r,
            _status: DU[r._su].orig,
            _d: DU[r._su],
            _bucket: oick ? resolveBucket(r[oick]) : null,
          }));

        if (!rows.length) { setErr("Error: No valid recognized statuses found in the file."); setLoading(false); return; }
        setData({ rows, sk, ak, rk, rmk, pak, pdk, cak, cdk, datек, timek, dtk, clk, oick, totalRaw, remarkExcludedCount });
      } catch (ex) { setErr("Error parsing file: " + ex.message); }
      setLoading(false);
    };
    r.readAsArrayBuffer(file);
  };

  const an = useMemo(() => {
    if (!data) return null;
    const { rows, ak, rk, pak, pdk, cak, cdk, datек, timek, dtk, clk, oick } = data;
    const sc = {}, gc = {}, tc = {};
    rows.forEach(r => {
      sc[r._status] = (sc[r._status] || 0) + 1;
      gc[r._d.sg] = (gc[r._d.sg] || 0) + 1;
      tc[r._d.tp] = (tc[r._d.tp] || 0) + 1;
    });
    const T = rows.length;
    const rowGrp = s => rows.find(r => r._status === s)?._d || {};
    const sd = Object.entries(sc).sort((a, b) => b[1] - a[1]).map(([s, c]) => ({
      status: s, count: c, pct: ((c / T) * 100).toFixed(1),
      grp: rowGrp(s).sg || "", tp: rowGrp(s).tp || ""
    }));
    const gd = Object.entries(gc).sort((a, b) => b[1] - a[1]).map(([g, c]) => ({ name: g, value: c, pct: ((c / T) * 100).toFixed(1) }));
    const td = Object.entries(tc).sort((a, b) => b[1] - a[1]).map(([t, c]) => ({ name: t, count: c, pct: ((c / T) * 100).toFixed(1) }));
    const ua = ak ? new Set(rows.map(r => r[ak]).filter(Boolean)).size : null;

    const collectorMap = {};
    if (rk) {
      rows.forEach(r => {
        const v = r[rk]; if (!v) return;
        const name = String(v).trim();
        if (!collectorMap[name]) collectorMap[name] = { total: 0, byTP: {}, bySG: {} };
        collectorMap[name].total++;
        collectorMap[name].byTP[r._d.tp] = (collectorMap[name].byTP[r._d.tp] || 0) + 1;
        collectorMap[name].bySG[r._d.sg] = (collectorMap[name].bySG[r._d.sg] || 0) + 1;
      });
    }
    const cd = Object.entries(collectorMap).sort((a, b) => b[1].total - a[1].total).map(([name, v]) => ({ name, ...v }));

    let pt = 0, pc = 0;
    if (pak) rows.forEach(r => { const v = parseAmt(r[pak]); if (!isNaN(v) && v > 0) { pt += v; pc++; } });
    let ct = 0, cc = 0;
    if (cak) rows.forEach(r => { const v = parseAmt(r[cak]); if (!isNaN(v) && v > 0) { ct += v; cc++; } });
    const pdc = {};
    if (pdk) rows.forEach(r => { const d = r[pdk]; if (d) { const k = fD(d); if (k) pdc[k] = (pdc[k] || 0) + 1; } });
    const pdd = Object.entries(pdc).sort((a, b) => new Date(a[0]) - new Date(b[0])).slice(-15).map(([d, c]) => ({ date: d, count: c }));
    const cdc = {};
    if (cdk) rows.forEach(r => { const d = r[cdk]; if (d) { const k = fD(d); if (k) cdc[k] = (cdc[k] || 0) + 1; } });
    const cdd = Object.entries(cdc).sort((a, b) => new Date(a[0]) - new Date(b[0])).slice(-15).map(([d, c]) => ({ date: d, count: c }));

    let dateAnalytics = null;
    const activeDateKey = datек || dtk;
    if (activeDateKey || timek) {
      const dateMap = {};
      rows.forEach(r => {
        const dRaw = activeDateKey ? r[activeDateKey] : null;
        const d = dRaw ? fD(dRaw) : null;
        if (d) {
          if (!dateMap[d]) dateMap[d] = { total: 0, NEG: 0, RPC: 0, PTP: 0, KEPT: 0, POS: 0 };
          dateMap[d].total++;
          const sg = r._d.sg;
          if (dateMap[d][sg] !== undefined) dateMap[d][sg]++;
        }
      });
      const dateSorted = Object.entries(dateMap)
        .sort((a, b) => { const da = new Date(a[0]), db = new Date(b[0]); return isNaN(da) || isNaN(db) ? a[0].localeCompare(b[0]) : da - db; })
        .map(([date, v]) => ({ date, ...v }));
      const hourMap = {};
      rows.forEach(r => {
        const tRaw = timek ? r[timek] : (dtk ? r[dtk] : null);
        if (!tRaw) return;
        const hr = parseTimeHour(tRaw);
        if (hr !== null) hourMap[hr] = (hourMap[hr] || 0) + 1;
      });
      const hasHours = Object.keys(hourMap).length > 0;
      const hourData = hasHours ? Array.from({ length: 24 }, (_, h) => ({ hour: `${String(h).padStart(2, "0")}:00`, count: hourMap[h] || 0 })) : [];
      dateAnalytics = { dateSorted, hourData, hasHours, dateMap };
    }

    let clientAnalytics = null;
    if (clk) {
      const clientMap = {};
      rows.forEach(r => {
        const v = r[clk]; if (!v) return;
        const name = String(v).trim();
        if (!clientMap[name]) clientMap[name] = { total: 0, byTP: {}, bySG: {} };
        clientMap[name].total++;
        clientMap[name].byTP[r._d.tp] = (clientMap[name].byTP[r._d.tp] || 0) + 1;
        clientMap[name].bySG[r._d.sg] = (clientMap[name].bySG[r._d.sg] || 0) + 1;
      });
      const clientList = Object.entries(clientMap).sort((a, b) => b[1].total - a[1].total).map(([name, v]) => ({ name, ...v }));
      const clientSGData = clientList.map(c => ({ name: c.name, total: c.total, NEG: c.bySG.NEG||0, RPC: c.bySG.RPC||0, PTP: c.bySG.PTP||0, KEPT: c.bySG.KEPT||0, POS: c.bySG.POS||0 }));
      clientAnalytics = { clientList, clientSGData };
    }

    // ── Bucket Analytics ────────────────────────────────────────────────────
    let bucketAnalytics = null;
    if (oick) {
      const bucketMap = {};
      rows.forEach(r => {
        const b = r._bucket;
        if (!b) return;
        if (!bucketMap[b]) bucketMap[b] = {
          total: 0, byTP: {}, bySG: {},
          ptpAmt: 0, ptpCount: 0, claimAmt: 0, claimCount: 0,
          ptpByDate: {}, claimByDate: {},
          rawCodes: {},
        };
        bucketMap[b].total++;
        bucketMap[b].byTP[r._d.tp] = (bucketMap[b].byTP[r._d.tp] || 0) + 1;
        bucketMap[b].bySG[r._d.sg] = (bucketMap[b].bySG[r._d.sg] || 0) + 1;

        // PTP
        if (pak) {
          const v = parseAmt(r[pak]);
          if (!isNaN(v) && v > 0) { bucketMap[b].ptpAmt += v; bucketMap[b].ptpCount++; }
        }
        if (pdk) {
          const d = fD(r[pdk]);
          if (d) bucketMap[b].ptpByDate[d] = (bucketMap[b].ptpByDate[d] || 0) + 1;
        }
        // Claim
        if (cak) {
          const v = parseAmt(r[cak]);
          if (!isNaN(v) && v > 0) { bucketMap[b].claimAmt += v; bucketMap[b].claimCount++; }
        }
        if (cdk) {
          const d = fD(r[cdk]);
          if (d) bucketMap[b].claimByDate[d] = (bucketMap[b].claimByDate[d] || 0) + 1;
        }
        // Raw code tracking
        if (oick) {
          const raw = String(r[oick] || "").trim();
          bucketMap[b].rawCodes[raw] = (bucketMap[b].rawCodes[raw] || 0) + 1;
        }
      });

      // Sort by canonical order then alphabetically
      const bucketList = Object.entries(bucketMap)
        .sort((a, b) => {
          const ai = BUCKET_ORDER.indexOf(a[0]), bi = BUCKET_ORDER.indexOf(b[0]);
          if (ai === -1 && bi === -1) return a[0].localeCompare(b[0]);
          if (ai === -1) return 1;
          if (bi === -1) return -1;
          return ai - bi;
        })
        .map(([name, v]) => ({
          name,
          ...v,
          ptpByDateArr: Object.entries(v.ptpByDate).sort((a, b) => new Date(a[0]) - new Date(b[0])).slice(-15).map(([d, c]) => ({ date: d, count: c })),
          claimByDateArr: Object.entries(v.claimByDate).sort((a, b) => new Date(a[0]) - new Date(b[0])).slice(-15).map(([d, c]) => ({ date: d, count: c })),
          pctShare: ((v.total / T) * 100).toFixed(1),
          rpcRate: v.total > 0 ? (((v.bySG.RPC || 0) / v.total) * 100).toFixed(1) : "0.0",
          ptpRate: v.total > 0 ? (((v.bySG.PTP || 0) / v.total) * 100).toFixed(1) : "0.0",
          keptRate: v.total > 0 ? (((v.bySG.KEPT || 0) / v.total) * 100).toFixed(1) : "0.0",
        }));

      // Cross-bucket PTP & Claim trend by date
      const allDates = new Set();
      bucketList.forEach(b => b.ptpByDateArr.forEach(x => allDates.add(x.date)));
      const ptpTrendByBucket = Array.from(allDates).sort((a, b) => new Date(a) - new Date(b)).map(date => {
        const row = { date };
        bucketList.forEach(b => { row[b.name] = b.ptpByDate[date] || 0; });
        return row;
      });

      const allClaimDates = new Set();
      bucketList.forEach(b => b.claimByDateArr.forEach(x => allClaimDates.add(x.date)));
      const claimTrendByBucket = Array.from(allClaimDates).sort((a, b) => new Date(a) - new Date(b)).map(date => {
        const row = { date };
        bucketList.forEach(b => { row[b.name] = b.claimByDate[date] || 0; });
        return row;
      });

      // Radar data: each bucket's SG distribution normalized %
      const radarData = SG_GROUPS.map(sg => {
        const row = { sg };
        bucketList.forEach(b => {
          row[b.name] = b.total > 0 ? parseFloat(((b.bySG[sg] || 0) / b.total * 100).toFixed(1)) : 0;
        });
        return row;
      });

      // Unmapped rows count
      const unmappedCount = rows.filter(r => !r._bucket).length;

      bucketAnalytics = { bucketList, ptpTrendByBucket, claimTrendByBucket, radarData, unmappedCount };
    }

    return { sd, gd, td, ua, cd, pt, pc, ct, cc, pdd, cdd, T, dateAnalytics, clientAnalytics, bucketAnalytics };
  }, [data]);

  const TS = { background: "#1e293b", border: "1px solid #334155", borderRadius: 8, fontSize: 12 };

  const selectedDateRows = useMemo(() => {
    if (!selectedDate || !data || !an?.dateAnalytics) return null;
    const { datек, dtk } = data;
    const activeKey = datек || dtk;
    if (!activeKey) return null;
    const sc = {};
    data.rows.forEach(r => {
      const d = fD(r[activeKey]);
      if (d === selectedDate) { sc[r._status] = (sc[r._status] || 0) + 1; }
    });
    return Object.entries(sc).sort((a, b) => b[1] - a[1]).map(([s, c]) => {
      const d = DU[s.toUpperCase()];
      return { status: s, count: c, grp: d?.sg || "", tp: d?.tp || "" };
    });
  }, [selectedDate, data, an]);

  const selectedCollectorData = useMemo(() => {
    if (!selectedCollector || !an) return null;
    return an.cd.find(c => c.name === selectedCollector) || null;
  }, [selectedCollector, an]);

  const selectedClientData = useMemo(() => {
    if (!selectedClient || !an?.clientAnalytics) return null;
    return an.clientAnalytics.clientList.find(c => c.name === selectedClient) || null;
  }, [selectedClient, an]);

  const selectedBucketData = useMemo(() => {
    if (!selectedBucket || !an?.bucketAnalytics) return null;
    return an.bucketAnalytics.bucketList.find(b => b.name === selectedBucket) || null;
  }, [selectedBucket, an]);

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#e2e8f0", fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:#1e293b}::-webkit-scrollbar-thumb{background:#475569;border-radius:3px}
        .card{background:#1e293b;border-radius:12px;padding:20px;border:1px solid #334155}
        .sc{background:linear-gradient(135deg,#1e293b,#0f172a);border-radius:12px;padding:18px;border:1px solid #334155}
        .bdg{display:inline-block;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600}
        table{width:100%;border-collapse:collapse;font-size:13px}
        th{background:#0f172a;color:#94a3b8;font-weight:600;text-align:left;padding:10px 12px;border-bottom:1px solid #334155;font-size:11px;text-transform:uppercase;letter-spacing:.05em}
        td{padding:9px 12px;border-bottom:1px solid #1e293b;color:#cbd5e1}
        tr:hover td{background:#ffffff06}
        .dz{border:2px dashed #334155;border-radius:16px;padding:48px 24px;text-align:center;cursor:pointer;transition:all .2s}
        .dz:hover{border-color:#3b82f6;background:#1e293b44}
        input[type=file]{display:none}
        .tb{background:none;border:none;cursor:pointer;padding:8px 18px;border-radius:8px;font-family:inherit;font-size:13px;font-weight:500;transition:all .2s;color:#94a3b8;white-space:nowrap}
        .tb.ac{background:#1e40af;color:#fff}
        .tb:hover:not(.ac){background:#1e293b;color:#e2e8f0}
        .dr{cursor:pointer;transition:background .15s}
        .dr:hover td{background:#1e3a5f !important}
        .dr.sel td{background:#172554 !important}
        .dr2:hover td{background:#1a2e1a !important}
        .dr2.sel td{background:#0f2a0f !important}
        .dr3:hover td{background:#2e1a0f !important}
        .dr3.sel td{background:#2a1500 !important}
        .dr4:hover td{background:#1a1a2e !important}
        .dr4.sel td{background:#0d0d1f !important}
      `}</style>

      {/* Header */}
      <div style={{ background: "#0f172a", borderBottom: "1px solid #1e293b", padding: "16px 32px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📊</div>
        <div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 18, color: "#f1f5f9" }}>Collections Analytics</div>
          <div style={{ fontSize: 12, color: "#64748b" }}>Status Disposition Intelligence System · 255 Recognized Dispositions</div>
        </div>
        {data && an && <div style={{ marginLeft: "auto", fontSize: 12, color: "#22c55e", background: "#052e16", padding: "4px 12px", borderRadius: 20, border: "1px solid #166534" }}>✓ {an.T.toLocaleString()} valid records loaded</div>}
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: 24 }}>
        {!data && (
          <div style={{ maxWidth: 540, margin: "80px auto" }}>
            <div className="card">
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 22, marginBottom: 8, color: "#f1f5f9" }}>Upload Collections File</div>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>
                Upload an Excel file (.xlsx/.xls) with a <code style={{ color: "#60a5fa", background: "#0f172a", padding: "1px 5px", borderRadius: 4 }}>Status</code> column.
                Rows containing system remarks are automatically excluded.
              </div>
              <div className="dz"
                onClick={() => fRef.current.click()}
                onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = "#3b82f6"; }}
                onDragLeave={e => { e.currentTarget.style.borderColor = "#334155"; }}
                onDrop={e => { e.preventDefault(); e.currentTarget.style.borderColor = "#334155"; hf(e.dataTransfer.files[0]); }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📂</div>
                <div style={{ fontWeight: 600, fontSize: 15, color: "#e2e8f0" }}>Drop your Excel file here</div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 6 }}>or click to browse · .xlsx / .xls accepted</div>
              </div>
              <input ref={fRef} type="file" accept=".xlsx,.xls" onChange={e => hf(e.target.files[0])} />
              {loading && <div style={{ marginTop: 16, textAlign: "center", color: "#60a5fa", fontSize: 14 }}>⏳ Processing file...</div>}
              {err && <div style={{ marginTop: 16, background: "#450a0a", border: "1px solid #7f1d1d", borderRadius: 8, padding: 12, color: "#fca5a5", fontSize: 13 }}>{err}</div>}
              <div style={{ marginTop: 20, padding: "12px 16px", background: "#0f172a", borderRadius: 8, fontSize: 12, color: "#475569" }}>
                <div style={{ fontWeight: 600, color: "#64748b", marginBottom: 6 }}>Expected columns (auto-detected):</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {["Status", "Account No.", "Remark By", "Remarks", "PTP Amount", "PTP Date", "Claim Paid Amount", "Claim Paid Date", "Date", "Time", "Client", "Old IC"].map(c => (
                    <span key={c} style={{ background: "#1e293b", padding: "2px 8px", borderRadius: 4, color: "#94a3b8" }}>{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {data && an && <>
          {/* KPI Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(155px,1fr))", gap: 12, marginBottom: 20 }}>
            {[
              { l: "Total Records", v: data.totalRaw.toLocaleString(), i: "📋", c: "#3b82f6" },
              { l: "System Excluded", v: data.remarkExcludedCount.toLocaleString(), i: "🚫", c: "#94a3b8", sub: "auto-filtered" },
              { l: "Valid Records", v: an.T.toLocaleString(), i: "✅", c: "#22c55e" },
              { l: "Unique Accounts", v: an.ua?.toLocaleString() ?? "N/A", i: "👤", c: "#f59e0b" },
              { l: "Collectors", v: an.cd.length, i: "👥", c: "#06b6d4" },
              { l: "Clients", v: an.clientAnalytics ? an.clientAnalytics.clientList.length : "N/A", i: "🏢", c: "#a78bfa" },
              { l: "Buckets", v: an.bucketAnalytics ? an.bucketAnalytics.bucketList.length : "N/A", i: "📍", c: "#f97316" },
              { l: "PTP Amount", v: "₱" + fN(an.pt), i: "💰", c: "#22c55e" },
              { l: "Claim Paid", v: "₱" + fN(an.ct), i: "💳", c: "#f97316" },
            ].map(k => (
              <div key={k.l} className="sc">
                <div style={{ fontSize: 20, marginBottom: 6 }}>{k.i}</div>
                <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600 }}>{k.l}</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: k.c, fontFamily: "'Space Grotesk',sans-serif", marginTop: 2, wordBreak: "auto-phrase" }}>{k.v}</div>
                {k.sub && <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>{k.sub}</div>}
              </div>
            ))}
          </div>

          {/* Detected columns notice */}
          <div style={{ background: "#0f2a3f", border: "1px solid #1e4060", borderRadius: 8, padding: "8px 16px", marginBottom: 12, fontSize: 12, color: "#7dd3fc", display: "flex", flexWrap: "wrap", gap: 12 }}>
            <span>🔍 Detected columns:</span>
            {data.datек && <span style={{ background: "#1e3a5f", padding: "1px 8px", borderRadius: 4 }}>📅 Date: <strong>{data.datек}</strong></span>}
            {data.timek && <span style={{ background: "#1e3a5f", padding: "1px 8px", borderRadius: 4 }}>⏰ Time: <strong>{data.timek}</strong></span>}
            {data.dtk && <span style={{ background: "#1e3a5f", padding: "1px 8px", borderRadius: 4 }}>📅⏰ DateTime: <strong>{data.dtk}</strong></span>}
            {data.clk && <span style={{ background: "#1e3a5f", padding: "1px 8px", borderRadius: 4 }}>🏢 Client: <strong>{data.clk}</strong></span>}
            {data.oick && <span style={{ background: "#1e3a5f", padding: "1px 8px", borderRadius: 4 }}>📍 Bucket/IC: <strong>{data.oick}</strong></span>}
            {!data.datек && !data.timek && !data.dtk && <span style={{ color: "#64748b" }}>No date/time columns detected</span>}
            {!data.clk && <span style={{ color: "#64748b" }}>No client column detected</span>}
            {!data.oick && <span style={{ color: "#64748b" }}>No Old IC/Bucket column detected</span>}
          </div>

          {data.remarkExcludedCount > 0 && (
            <div style={{ background: "#1c1917", border: "1px solid #44403c", borderRadius: 8, padding: "10px 16px", marginBottom: 16, fontSize: 12, color: "#a8a29e", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>🚫</span>
              <span><strong style={{ color: "#d6d3d1" }}>{data.remarkExcludedCount.toLocaleString()} rows</strong> excluded — system-generated remarks</span>
            </div>
          )}

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 8, background: "#0f172a", padding: 4, borderRadius: 12, width: "fit-content", flexWrap: "wrap" }}>
            {[
              ["overview", "📊 Overview"],
              ["status", "🏷️ Status Detail"],
              ["collectors", "👥 Collectors"],
              ["ptp", "💰 PTP & Claims"],
              ["touch", "📱 Touch Points"],
              ...(an.dateAnalytics ? [["datetime", "📅 Date & Time"]] : []),
              ...(an.clientAnalytics ? [["clients", "🏢 Clients"]] : []),
              ...(an.bucketAnalytics ? [["buckets", "📍 Buckets"]] : []),
            ].map(([t, l]) => (
              <button key={t} className={`tb${tab === t ? " ac" : ""}`} onClick={() => setTab(t)}>{l}</button>
            ))}
          </div>
          <div style={{ textAlign: "right", marginBottom: 16 }}>
            <button onClick={() => { setData(null); setErr(""); setSelectedDate(null); setSelectedCollector(null); setSelectedClient(null); setSelectedBucket(null); }} style={{ background: "#1e293b", border: "1px solid #334155", color: "#94a3b8", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 12 }}>↩ Upload New File</button>
          </div>

          {/* ── Overview Tab ── */}
          {tab === "overview" && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="card">
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: "#f1f5f9" }}>Status Group Distribution</div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={an.gd} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, pct }) => `${name} ${pct}%`} labelLine={false}>
                    {an.gd.map((e, i) => <Cell key={i} fill={GC[e.name] || PC[i % PC.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v, n, p) => [`${v.toLocaleString()} (${p.payload.pct}%)`, n]} contentStyle={TS} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: "#f1f5f9" }}>Top 15 Statuses by Count</div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={an.sd.slice(0, 15)} layout="vertical" margin={{ left: 0, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <YAxis type="category" dataKey="status" tick={{ fill: "#94a3b8", fontSize: 10 }} width={180} />
                  <Tooltip contentStyle={TS} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} fill="#f1f5F9">
                    {an.sd.slice(0, 15).map((e, i) => <Cell key={i} fill={GC[e.grp] || PC[i % PC.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card" style={{ gridColumn: "1/-1" }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: "#f1f5f9" }}>Group Summary</div>
              <table>
                <thead><tr><th>Group</th><th>Count</th><th>%</th><th style={{ width: 220 }}>Distribution</th></tr></thead>
                <tbody>{an.gd.map(g => <tr key={g.name}>
                  <td><span className="bdg" style={{ background: (GC[g.name] || "#3b82f6") + "33", color: GC[g.name] || "#94a3b8" }}>{g.name}</span></td>
                  <td style={{ fontWeight: 600 }}>{g.value.toLocaleString()}</td>
                  <td>{g.pct}%</td>
                  <td><Pb pct={parseFloat(g.pct)} c={GC[g.name] || "#3b82f6"} /></td>
                </tr>)}</tbody>
              </table>
            </div>
          </div>}

          {/* ── Status Detail Tab ── */}
          {tab === "status" && (() => {
            const SI = mkIcon(statusSort);
            const ssd = sortFilter(an.sd, statusSort, statusSearch, ["status", "grp", "tp"]);
            return (
              <div className="card">
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: "#f1f5f9" }}>Status Detail — {an.sd.length} Valid Statuses Found</div>
                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>Only statuses present in your file are shown. Click column headers to sort.</div>
                <SearchBar value={statusSearch} onChange={setStatusSearch} placeholder="Filter by status, group, or touch point..." />
                <div style={{ fontSize: 12, color: "#475569", marginBottom: 8 }}>{ssd.length} of {an.sd.length} statuses shown</div>
                <div style={{ overflowX: "auto" }}>
                  <table>
                    <thead><tr>
                      <th>#</th>
                      <th onClick={() => mkSort(statusSort, setStatusSort)("status")} style={{ cursor: "pointer", userSelect: "none" }}>Status <SI col="status" /></th>
                      <th onClick={() => mkSort(statusSort, setStatusSort)("grp")} style={{ cursor: "pointer", userSelect: "none" }}>Group <SI col="grp" /></th>
                      <th onClick={() => mkSort(statusSort, setStatusSort)("tp")} style={{ cursor: "pointer", userSelect: "none" }}>Touch Point <SI col="tp" /></th>
                      <th onClick={() => mkSort(statusSort, setStatusSort)("count")} style={{ cursor: "pointer", userSelect: "none" }}>Count <SI col="count" /></th>
                      <th onClick={() => mkSort(statusSort, setStatusSort)("pct")} style={{ cursor: "pointer", userSelect: "none" }}>% <SI col="pct" /></th>
                      <th style={{ width: 100 }}>Bar</th>
                    </tr></thead>
                    <tbody>{ssd.map((s, i) => <tr key={s.status}>
                      <td style={{ color: "#475569" }}>{i + 1}</td>
                      <td style={{ fontWeight: 500, color: "#e2e8f0" }}>{s.status}</td>
                      <td><span className="bdg" style={{ background: (GC[s.grp] || "#3b82f6") + "33", color: GC[s.grp] || "#94a3b8" }}>{s.grp}</span></td>
                      <td style={{ color: "#94a3b8" }}>{s.tp}</td>
                      <td style={{ fontWeight: 600, color: "#f1f5f9" }}>{s.count.toLocaleString()}</td>
                      <td style={{ color: "#60a5fa" }}>{s.pct}%</td>
                      <td><Pb pct={parseFloat(s.pct)} c={GC[s.grp] || "#3b82f6"} /></td>
                    </tr>)}</tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {/* ── Collectors Tab ── */}
          {tab === "collectors" && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="card" style={{ gridColumn: "1/-1" }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: "#f1f5f9" }}>Top 20 Collectors by Total Efforts</div>
              {an.cd.length === 0
                ? <div style={{ color: "#64748b", fontSize: 13, marginTop: 8 }}>No "Remark By" column detected.</div>
                : <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={an.cd.slice(0, 20)} margin={{ bottom: 90 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 10 }} angle={-40} textAnchor="end" interval={0} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                    <Tooltip contentStyle={TS} />
                    <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Efforts" />
                  </BarChart>
                </ResponsiveContainer>}
            </div>
            {an.cd.length > 0 && <>
              <div className="card" style={{ gridColumn: "1/-1" }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: "#f1f5f9" }}>Collector Efforts with Touch Point Breakdown</div>
                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
                  Click a row to drill down · Click column headers to sort.
                  {selectedCollector && <button onClick={() => setSelectedCollector(null)} style={{ marginLeft: 12, background: "#334155", border: "none", color: "#94a3b8", borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 11 }}>x Clear</button>}
                </div>
                <SearchBar value={collectorSearch} onChange={setCollectorSearch} placeholder="Filter by collector name..." />
                {(() => {
                  const CI = mkIcon(collectorSort);
                  const activeTPs = ALL_TP.filter(tp => an.cd.some(col => col.byTP[tp]));
                  const filteredCD = sortFilter(an.cd.map(c => ({ ...c, pctShare: ((c.total / an.T) * 100).toFixed(1) })), collectorSort, collectorSearch, ["name"]);
                  return (
                    <div style={{ overflowX: "auto", maxHeight: 420, overflowY: "auto" }}>
                      <div style={{ fontSize: 12, color: "#475569", marginBottom: 6 }}>{filteredCD.length} of {an.cd.length} collectors shown</div>
                      <table>
                        <thead><tr>
                          <th>#</th>
                          <th onClick={() => mkSort(collectorSort, setCollectorSort)("name")} style={{ cursor: "pointer", userSelect: "none" }}>Collector <CI col="name" /></th>
                          <th onClick={() => mkSort(collectorSort, setCollectorSort)("total")} style={{ cursor: "pointer", userSelect: "none" }}>Total <CI col="total" /></th>
                          <th onClick={() => mkSort(collectorSort, setCollectorSort)("pctShare")} style={{ cursor: "pointer", userSelect: "none" }}>% Share <CI col="pctShare" /></th>
                          {activeTPs.map(tp => <th key={tp} style={{ color: TP_COLORS[tp] || "#94a3b8" }}>{tp}</th>)}
                          <th style={{ width: 100 }}>Bar</th>
                        </tr></thead>
                        <tbody>{filteredCD.map((c, i) => (
                          <tr key={c.name} className={`dr${selectedCollector === c.name ? " sel" : ""}`} onClick={() => setSelectedCollector(selectedCollector === c.name ? null : c.name)}>
                            <td style={{ color: "#475569" }}>{i + 1}</td>
                            <td style={{ fontWeight: 600, color: "#e2e8f0" }}>{c.name}</td>
                            <td style={{ fontWeight: 700, color: "#22c55e" }}>{c.total.toLocaleString()}</td>
                            <td style={{ color: "#60a5fa" }}>{c.pctShare}%</td>
                            {activeTPs.map(tp => <td key={tp} style={{ color: TP_COLORS[tp] || "#94a3b8" }}>{(c.byTP[tp] || 0).toLocaleString()}</td>)}
                            <td><Pb pct={(c.total / an.cd[0].total) * 100} c="#3b82f6" /></td>
                          </tr>
                        ))}</tbody>
                      </table>
                    </div>
                  );
                })()}
              </div>
              {selectedCollector && selectedCollectorData && (
                <div className="card" style={{ gridColumn: "1/-1", border: "1px solid #1e40af" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#f1f5f9" }}>👤 {selectedCollector} — Detailed Breakdown</div>
                    <span style={{ background: "#172554", color: "#60a5fa", borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 600 }}>{selectedCollectorData.total.toLocaleString()} total efforts</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "#94a3b8", marginBottom: 8 }}>By Touch Point</div>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie data={Object.entries(selectedCollectorData.byTP).map(([k, v]) => ({ name: k, value: v }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                            {Object.entries(selectedCollectorData.byTP).map(([tp], i) => <Cell key={i} fill={TP_COLORS[tp] || PC[i % PC.length]} />)}
                          </Pie>
                          <Tooltip contentStyle={TS} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "#94a3b8", marginBottom: 8 }}>By Outcome Group</div>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie data={Object.entries(selectedCollectorData.bySG).map(([k, v]) => ({ name: k, value: v }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                            {Object.entries(selectedCollectorData.bySG).map(([sg], i) => <Cell key={i} fill={GC[sg] || PC[i % PC.length]} />)}
                          </Pie>
                          <Tooltip contentStyle={TS} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "#94a3b8", marginBottom: 8 }}>Touch Point Details</div>
                      <table>
                        <thead><tr><th>Touch Point</th><th>Count</th><th>%</th></tr></thead>
                        <tbody>{Object.entries(selectedCollectorData.byTP).sort((a, b) => b[1] - a[1]).map(([tp, cnt]) => (
                          <tr key={tp}><td style={{ color: TP_COLORS[tp] || "#94a3b8", fontWeight: 500 }}>{tp}</td><td style={{ fontWeight: 700 }}>{cnt.toLocaleString()}</td><td style={{ color: "#60a5fa" }}>{((cnt / selectedCollectorData.total) * 100).toFixed(1)}%</td></tr>
                        ))}</tbody>
                      </table>
                      <div style={{ marginTop: 12 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: "#94a3b8", marginBottom: 8 }}>Outcome Details</div>
                        <table>
                          <thead><tr><th>Group</th><th>Count</th><th>%</th></tr></thead>
                          <tbody>{Object.entries(selectedCollectorData.bySG).sort((a, b) => b[1] - a[1]).map(([sg, cnt]) => (
                            <tr key={sg}><td><span className="bdg" style={{ background: (GC[sg] || "#3b82f6") + "33", color: GC[sg] || "#94a3b8" }}>{sg}</span></td><td style={{ fontWeight: 700 }}>{cnt.toLocaleString()}</td><td style={{ color: "#60a5fa" }}>{((cnt / selectedCollectorData.total) * 100).toFixed(1)}%</td></tr>
                          ))}</tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="card" style={{ gridColumn: "1/-1" }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: "#f1f5f9" }}>Top 15 Collectors — Touch Point Mix</div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={an.cd.slice(0, 15).map(c => ({ name: c.name, ...c.byTP }))} margin={{ bottom: 90 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 10 }} angle={-40} textAnchor="end" interval={0} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                    <Tooltip contentStyle={TS} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    {ALL_TP.filter(tp => an.cd.some(c => c.byTP[tp])).map(tp => <Bar key={tp} dataKey={tp} stackId="a" fill={TP_COLORS[tp] || "#64748b"} name={tp} />)}
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="card" style={{ gridColumn: "1/-1" }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: "#f1f5f9" }}>Top 15 Collectors — Outcome Group Mix</div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={an.cd.slice(0, 15).map(c => ({ name: c.name, ...c.bySG }))} margin={{ bottom: 90 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 10 }} angle={-40} textAnchor="end" interval={0} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                    <Tooltip contentStyle={TS} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    {SG_GROUPS.map(sg => <Bar key={sg} dataKey={sg} stackId="b" fill={GC[sg] || "#64748b"} name={sg} />)}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>}
          </div>}

          {/* ── PTP & Claims Tab ── */}
          {tab === "ptp" && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { l: "PTP Records", v: an.pc.toLocaleString(), c: "#3b82f6", s: "rows with PTP amount > 0" },
              { l: "Total PTP Amount", v: "₱" + fN(an.pt), c: "#22c55e" },
              { l: "Claim Paid Records", v: an.cc.toLocaleString(), c: "#f59e0b", s: "rows with claim paid amount > 0" },
              { l: "Total Claim Paid Amount", v: "₱" + fN(an.ct), c: "#f97316" },
            ].map(k => <div key={k.l} className="sc">
              <div style={{ fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: ".05em", fontWeight: 600 }}>{k.l}</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 26, fontWeight: 700, color: k.c, marginTop: 4 }}>{k.v}</div>
              {k.s && <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>{k.s}</div>}
            </div>)}
            {an.pdd.length > 0 && <div className="card" style={{ gridColumn: "1/-1" }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: "#f1f5f9" }}>PTP Date Trend (Last 15 Dates)</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={an.pdd} margin={{ bottom: 70 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                  <Tooltip contentStyle={TS} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="PTP Records" />
                </BarChart>
              </ResponsiveContainer>
            </div>}
            {an.cdd.length > 0 && <div className="card" style={{ gridColumn: "1/-1" }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: "#f1f5f9" }}>Claim Paid Date Trend (Last 15 Dates)</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={an.cdd} margin={{ bottom: 70 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                  <Tooltip contentStyle={TS} />
                  <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} name="Claim Records" />
                </BarChart>
              </ResponsiveContainer>
            </div>}
            {an.pdd.length === 0 && an.cdd.length === 0 && <div style={{ gridColumn: "1/-1", color: "#64748b", fontSize: 13 }}>No PTP Date or Claim Paid Date columns detected.</div>}
          </div>}

          {/* ── Touch Points Tab ── */}
          {tab === "touch" && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="card">
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: "#f1f5f9" }}>Touch Point Distribution</div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={an.td} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, pct }) => `${name} ${pct}%`} labelLine={false}>
                    {an.td.map((e, i) => <Cell key={i} fill={TP_COLORS[e.name] || PC[i % PC.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v, n, p) => [`${v.toLocaleString()} (${p.payload.pct}%)`, n]} contentStyle={TS} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: "#f1f5f9" }}>Efforts by Touch Point</div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={an.td} layout="vertical" margin={{ left: 0, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} width={130} />
                  <Tooltip contentStyle={TS} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {an.td.map((e, i) => <Cell key={i} fill={TP_COLORS[e.name] || PC[i % PC.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card" style={{ gridColumn: "1/-1" }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, color: "#f1f5f9" }}>Touch Point Summary</div>
              <SearchBar value={touchSearch} onChange={setTouchSearch} placeholder="Filter by touch point..." />
              {(() => {
                const TI = mkIcon(touchSort);
                const filteredTP = sortFilter(an.td, touchSort, touchSearch, ["name"]);
                return (
                  <table>
                    <thead><tr>
                      <th onClick={() => mkSort(touchSort, setTouchSort)("name")} style={{ cursor: "pointer", userSelect: "none" }}>Touch Point <TI col="name" /></th>
                      <th onClick={() => mkSort(touchSort, setTouchSort)("count")} style={{ cursor: "pointer", userSelect: "none" }}>Efforts <TI col="count" /></th>
                      <th onClick={() => mkSort(touchSort, setTouchSort)("pct")} style={{ cursor: "pointer", userSelect: "none" }}>% <TI col="pct" /></th>
                      <th style={{ width: 200 }}>Bar</th>
                    </tr></thead>
                    <tbody>{filteredTP.map((t, i) => <tr key={t.name}>
                      <td style={{ fontWeight: 500, color: "#e2e8f0" }}>{t.name}</td>
                      <td style={{ fontWeight: 700, color: TP_COLORS[t.name] || PC[i % PC.length] }}>{t.count.toLocaleString()}</td>
                      <td>{t.pct}%</td>
                      <td><Pb pct={parseFloat(t.pct)} c={TP_COLORS[t.name] || PC[i % PC.length]} /></td>
                    </tr>)}</tbody>
                  </table>
                );
              })()}
            </div>
          </div>}

          {/* ── Date & Time Tab ── */}
          {tab === "datetime" && an.dateAnalytics && (() => {
            const { dateSorted, hourData, hasHours } = an.dateAnalytics;
            const totalDays = dateSorted.length;
            const avgPerDay = totalDays > 0 ? (an.T / totalDays).toFixed(1) : 0;
            const peakDay = dateSorted.length > 0 ? dateSorted.reduce((a, b) => b.total > a.total ? b : a, dateSorted[0]) : {};
            const peakHour = hasHours ? hourData.reduce((a, b) => b.count > a.count ? b : a, hourData[0]) : null;
            return (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
                {[
                  { l: "Active Days", v: totalDays, i: "📅", c: "#3b82f6" },
                  { l: "Avg / Day", v: avgPerDay, i: "📈", c: "#a78bfa" },
                  { l: "Peak Day", v: peakDay?.date || "–", i: "🔝", c: "#f59e0b", sub: peakDay?.total ? peakDay.total.toLocaleString() + " records" : "" },
                  { l: "Peak Hour", v: peakHour ? peakHour.hour : "N/A", i: "⏰", c: "#06b6d4", sub: peakHour ? peakHour.count.toLocaleString() + " records" : "" },
                ].map(k => (
                  <div key={k.l} className="sc">
                    <div style={{ fontSize: 20, marginBottom: 6 }}>{k.i}</div>
                    <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600 }}>{k.l}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: k.c, fontFamily: "'Space Grotesk',sans-serif", marginTop: 2 }}>{k.v}</div>
                    {k.sub && <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{k.sub}</div>}
                  </div>
                ))}
                <div className="card" style={{ gridColumn: "1/-1" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: "#f1f5f9" }}>Overall Daily Efforts Trend</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={dateSorted} margin={{ left: 0, right: 16, bottom: dateSorted.length > 20 ? 70 : 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} angle={dateSorted.length > 15 ? -35 : 0} textAnchor={dateSorted.length > 15 ? "end" : "middle"} interval={dateSorted.length > 30 ? Math.floor(dateSorted.length / 20) : 0} />
                      <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                      <Tooltip contentStyle={TS} />
                      <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} dot={dateSorted.length < 40} name="Total Records" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="card" style={{ gridColumn: "1/-1" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: "#f1f5f9" }}>Daily Group Breakdown</div>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={dateSorted} margin={{ left: 0, right: 16, bottom: dateSorted.length > 20 ? 70 : 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} angle={dateSorted.length > 15 ? -35 : 0} textAnchor={dateSorted.length > 15 ? "end" : "middle"} interval={dateSorted.length > 30 ? Math.floor(dateSorted.length / 20) : 0} />
                      <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                      <Tooltip contentStyle={TS} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      {SG_GROUPS.map(sg => <Bar key={sg} dataKey={sg} stackId="a" fill={GC[sg] || "#64748b"} name={sg} />)}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {hasHours && (
                  <div className="card" style={{ gridColumn: "1/-1" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: "#f1f5f9" }}>Activity by Hour of Day</div>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={hourData} margin={{ left: 0, right: 16 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="hour" tick={{ fill: "#64748b", fontSize: 10 }} interval={1} />
                        <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                        <Tooltip contentStyle={TS} />
                        <Bar dataKey="count" fill="#a78bfa" radius={[3, 3, 0, 0]} name="Records" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <div className="card" style={{ gridColumn: "1/-1" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: "#f1f5f9" }}>Per-Date Summary</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
                    Click any row to drill into that date.
                    {selectedDate && <button onClick={() => setSelectedDate(null)} style={{ marginLeft: 12, background: "#334155", border: "none", color: "#94a3b8", borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 11 }}>x Clear</button>}
                  </div>
                  <SearchBar value={dateSearch} onChange={setDateSearch} placeholder="Filter by date..." />
                  {(() => {
                    const DI = mkIcon(dateSort);
                    const filteredDates = sortFilter(dateSorted, dateSort, dateSearch, ["date"]);
                    return (
                      <div style={{ overflowX: "auto", maxHeight: 420, overflowY: "auto" }}>
                        <table>
                          <thead><tr>
                            <th>#</th>
                            <th onClick={() => mkSort(dateSort, setDateSort)("date")} style={{ cursor: "pointer", userSelect: "none" }}>Date <DI col="date" /></th>
                            <th onClick={() => mkSort(dateSort, setDateSort)("total")} style={{ cursor: "pointer", userSelect: "none" }}>Total <DI col="total" /></th>
                            {SG_GROUPS.map(sg => <th key={sg} onClick={() => mkSort(dateSort, setDateSort)(sg)} style={{ cursor: "pointer", userSelect: "none" }}><span style={{ color: GC[sg] || "#94a3b8" }}>{sg}</span> <DI col={sg} /></th>)}
                            <th style={{ width: 120 }}>Trend</th>
                          </tr></thead>
                          <tbody>{filteredDates.map((d, i) => (
                            <tr key={d.date} className={`dr${selectedDate === d.date ? " sel" : ""}`} onClick={() => setSelectedDate(selectedDate === d.date ? null : d.date)}>
                              <td style={{ color: "#475569" }}>{i + 1}</td>
                              <td style={{ fontWeight: 600, color: "#e2e8f0" }}>{d.date}</td>
                              <td style={{ fontWeight: 700, color: "#60a5fa" }}>{d.total.toLocaleString()}</td>
                              {SG_GROUPS.map(sg => <td key={sg} style={{ color: GC[sg] || "#94a3b8" }}>{(d[sg] || 0).toLocaleString()}</td>)}
                              <td><Pb pct={(d.total / (peakDay?.total || 1)) * 100} c="#3b82f6" /></td>
                            </tr>
                          ))}</tbody>
                        </table>
                      </div>
                    );
                  })()}
                </div>
                {selectedDate && selectedDateRows && (
                  <div className="card" style={{ gridColumn: "1/-1", border: "1px solid #1e40af" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#f1f5f9" }}>📅 Status Breakdown — {selectedDate}</div>
                      <span style={{ background: "#172554", color: "#60a5fa", borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 600 }}>{selectedDateRows.reduce((a, b) => a + b.count, 0).toLocaleString()} records</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div style={{ overflowX: "auto" }}>
                        <table>
                          <thead><tr><th>#</th><th>Status</th><th>Grp</th><th>TP</th><th>Count</th><th>%</th></tr></thead>
                          <tbody>{selectedDateRows.map((s, i) => {
                            const dayTotal = selectedDateRows.reduce((a, b) => a + b.count, 0);
                            return <tr key={s.status}><td style={{ color: "#475569" }}>{i + 1}</td><td style={{ color: "#e2e8f0", fontWeight: 500 }}>{s.status}</td><td><span className="bdg" style={{ background: (GC[s.grp] || "#3b82f6") + "33", color: GC[s.grp] || "#94a3b8" }}>{s.grp}</span></td><td style={{ color: "#64748b" }}>{s.tp}</td><td style={{ fontWeight: 700, color: "#f1f5f9" }}>{s.count.toLocaleString()}</td><td style={{ color: "#60a5fa" }}>{((s.count / dayTotal) * 100).toFixed(1)}%</td></tr>;
                          })}</tbody>
                        </table>
                      </div>
                      <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                          <Pie data={selectedDateRows.slice(0, 10)} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${(name.split(" - ")[1] || name).substring(0, 12)} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                            {selectedDateRows.slice(0, 10).map((e, i) => <Cell key={i} fill={GC[e.grp] || PC[i % PC.length]} />)}
                          </Pie>
                          <Tooltip contentStyle={TS} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ── Clients Tab ── */}
          {tab === "clients" && an.clientAnalytics && (() => {
            const { clientList, clientSGData } = an.clientAnalytics;
            const topClient = clientList[0];
            const bestPTPClient = [...clientList].sort((a, b) => (b.bySG.PTP || 0) - (a.bySG.PTP || 0))[0];
            const bestKEPTClient = [...clientList].sort((a, b) => (b.bySG.KEPT || 0) - (a.bySG.KEPT || 0))[0];
            return (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
                {[
                  { l: "Total Clients", v: clientList.length, i: "🏢", c: "#a78bfa" },
                  { l: "Highest Volume", v: topClient?.name || "–", i: "🔝", c: "#3b82f6", sub: topClient?.total.toLocaleString() + " records" },
                  { l: "Most PTP", v: bestPTPClient?.name || "–", i: "💰", c: "#f59e0b", sub: (bestPTPClient?.bySG?.PTP || 0).toLocaleString() + " PTPs" },
                  { l: "Most KEPT", v: bestKEPTClient?.name || "–", i: "✅", c: "#22c55e", sub: (bestKEPTClient?.bySG?.KEPT || 0).toLocaleString() + " kept" },
                ].map(k => (
                  <div key={k.l} className="sc">
                    <div style={{ fontSize: 20, marginBottom: 6 }}>{k.i}</div>
                    <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600 }}>{k.l}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: k.c, fontFamily: "'Space Grotesk',sans-serif", marginTop: 2 }}>{k.v}</div>
                    {k.sub && <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{k.sub}</div>}
                  </div>
                ))}
                <div className="card" style={{ gridColumn: "1/3" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: "#f1f5f9" }}>Client Distribution by Volume</div>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={clientList.slice(0, 10).map(c => ({ name: c.name, value: c.total }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                        {clientList.slice(0, 10).map((_, i) => <Cell key={i} fill={PC[i % PC.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={TS} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="card" style={{ gridColumn: "3/5" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: "#f1f5f9" }}>Efforts per Client</div>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={clientList} layout="vertical" margin={{ left: 0, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} />
                      <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} width={120} />
                      <Tooltip contentStyle={TS} />
                      <Bar dataKey="total" radius={[0, 4, 4, 0]}>{clientList.map((_, i) => <Cell key={i} fill={PC[i % PC.length]} />)}</Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="card" style={{ gridColumn: "1/-1" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: "#f1f5f9" }}>Client Summary Table</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
                    Click a row to drill down.
                    {selectedClient && <button onClick={() => setSelectedClient(null)} style={{ marginLeft: 12, background: "#334155", border: "none", color: "#94a3b8", borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 11 }}>x Clear</button>}
                  </div>
                  <SearchBar value={clientSearch} onChange={setClientSearch} placeholder="Filter by client name..." />
                  {(() => {
                    const CLI = mkIcon(clientSort);
                    const filteredClients = sortFilter(clientList.map(c => ({ ...c, pctShare: ((c.total / an.T) * 100).toFixed(1), NEG: c.bySG.NEG||0, RPC: c.bySG.RPC||0, PTP: c.bySG.PTP||0, KEPT: c.bySG.KEPT||0, POS: c.bySG.POS||0 })), clientSort, clientSearch, ["name"]);
                    return (
                      <div style={{ overflowX: "auto" }}>
                        <table>
                          <thead><tr>
                            <th>#</th>
                            <th onClick={() => mkSort(clientSort, setClientSort)("name")} style={{ cursor: "pointer", userSelect: "none" }}>Client <CLI col="name" /></th>
                            <th onClick={() => mkSort(clientSort, setClientSort)("total")} style={{ cursor: "pointer", userSelect: "none" }}>Total <CLI col="total" /></th>
                            <th onClick={() => mkSort(clientSort, setClientSort)("pctShare")} style={{ cursor: "pointer", userSelect: "none" }}>% <CLI col="pctShare" /></th>
                            {SG_GROUPS.map(sg => <th key={sg} onClick={() => mkSort(clientSort, setClientSort)(sg)} style={{ color: GC[sg], cursor: "pointer", userSelect: "none" }}>{sg} <CLI col={sg} /></th>)}
                            <th style={{ width: 120 }}>Bar</th>
                          </tr></thead>
                          <tbody>{filteredClients.map((c, i) => (
                            <tr key={c.name} className={`dr3${selectedClient === c.name ? " sel" : ""}`} onClick={() => setSelectedClient(selectedClient === c.name ? null : c.name)}>
                              <td style={{ color: "#475569" }}>{i + 1}</td>
                              <td style={{ fontWeight: 600, color: "#e2e8f0" }}>{c.name}</td>
                              <td style={{ fontWeight: 700, color: PC[i % PC.length] }}>{c.total.toLocaleString()}</td>
                              <td style={{ color: "#60a5fa" }}>{c.pctShare}%</td>
                              {SG_GROUPS.map(sg => <td key={sg} style={{ color: GC[sg] || "#94a3b8" }}>{(c.bySG[sg] || 0).toLocaleString()}</td>)}
                              <td><Pb pct={(c.total / clientList[0].total) * 100} c={PC[i % PC.length]} /></td>
                            </tr>
                          ))}</tbody>
                        </table>
                      </div>
                    );
                  })()}
                </div>
                {selectedClient && selectedClientData && (
                  <div className="card" style={{ gridColumn: "1/-1", border: "1px solid #78350f" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#f1f5f9" }}>🏢 {selectedClient} — Detailed Breakdown</div>
                      <span style={{ background: "#1c0a00", color: "#f59e0b", borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 600 }}>{selectedClientData.total.toLocaleString()} total records</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: "#94a3b8", marginBottom: 8 }}>By Touch Point</div>
                        <ResponsiveContainer width="100%" height={220}>
                          <PieChart>
                            <Pie data={Object.entries(selectedClientData.byTP).map(([k, v]) => ({ name: k, value: v }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                              {Object.entries(selectedClientData.byTP).map(([tp], i) => <Cell key={i} fill={TP_COLORS[tp] || PC[i % PC.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={TS} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: "#94a3b8", marginBottom: 8 }}>By Outcome Group</div>
                        <ResponsiveContainer width="100%" height={220}>
                          <PieChart>
                            <Pie data={Object.entries(selectedClientData.bySG).map(([k, v]) => ({ name: k, value: v }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                              {Object.entries(selectedClientData.bySG).map(([sg], i) => <Cell key={i} fill={GC[sg] || PC[i % PC.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={TS} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: "#94a3b8", marginBottom: 8 }}>Outcome Details</div>
                        <table>
                          <thead><tr><th>Group</th><th>Count</th><th>%</th></tr></thead>
                          <tbody>{Object.entries(selectedClientData.bySG).sort((a, b) => b[1] - a[1]).map(([sg, cnt]) => (
                            <tr key={sg}><td><span className="bdg" style={{ background: (GC[sg] || "#3b82f6") + "33", color: GC[sg] || "#94a3b8" }}>{sg}</span></td><td style={{ fontWeight: 700 }}>{cnt.toLocaleString()}</td><td style={{ color: "#60a5fa" }}>{((cnt / selectedClientData.total) * 100).toFixed(1)}%</td></tr>
                          ))}</tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ── BUCKETS TAB ── */}
          {tab === "buckets" && an.bucketAnalytics && (() => {
            const { bucketList, ptpTrendByBucket, claimTrendByBucket, radarData, unmappedCount } = an.bucketAnalytics;
            const topBucket = bucketList[0];
            const bestPTP = [...bucketList].sort((a, b) => b.ptpAmt - a.ptpAmt)[0];
            const bestKept = [...bucketList].sort((a, b) => (b.bySG.KEPT || 0) - (a.bySG.KEPT || 0))[0];
            const bestRPC = [...bucketList].sort((a, b) => parseFloat(b.rpcRate) - parseFloat(a.rpcRate))[0];
            const activeTPs = ALL_TP.filter(tp => bucketList.some(b => b.byTP[tp]));

            return (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>

                {/* KPI cards */}
                {[
                  { l: "Total Buckets", v: bucketList.length, i: "📍", c: "#f97316" },
                  { l: "Highest Volume", v: topBucket?.name || "–", i: "🔝", c: "#3b82f6", sub: topBucket?.total.toLocaleString() + " records" },
                  { l: "Best PTP Amount", v: bestPTP?.name || "–", i: "💰", c: "#f59e0b", sub: "₱" + fN(bestPTP?.ptpAmt || 0) },
                  { l: "Best KEPT Rate", v: bestKept?.name || "–", i: "✅", c: "#22c55e", sub: (bestKept?.bySG?.KEPT || 0).toLocaleString() + " kept" },
                  { l: "Best RPC Rate", v: bestRPC?.name || "–", i: "📞", c: "#06b6d4", sub: bestRPC?.rpcRate + "% RPC" },
                  { l: "Unmapped Rows", v: unmappedCount.toLocaleString(), i: "⚠️", c: "#64748b", sub: "no matching IC code" },
                ].map(k => (
                  <div key={k.l} className="sc" style={{ gridColumn: k.l === "Unmapped Rows" ? "" : "" }}>
                    <div style={{ fontSize: 20, marginBottom: 6 }}>{k.i}</div>
                    <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600 }}>{k.l}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: k.c, fontFamily: "'Space Grotesk',sans-serif", marginTop: 2 }}>{k.v}</div>
                    {k.sub && <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{k.sub}</div>}
                  </div>
                ))}

                {/* Bucket volume distribution — Pie */}
                <div className="card" style={{ gridColumn: "1/3" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: "#f1f5f9" }}>Bucket Volume Distribution</div>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={bucketList.map(b => ({ name: b.name, value: b.total }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                        {bucketList.map(b => <Cell key={b.name} fill={BUCKET_COLORS[b.name] || "#64748b"} />)}
                      </Pie>
                      <Tooltip formatter={(v, n) => [v.toLocaleString(), n]} contentStyle={TS} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Bucket efforts bar */}
                <div className="card" style={{ gridColumn: "3/5" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: "#f1f5f9" }}>Efforts by Bucket</div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={bucketList} layout="vertical" margin={{ left: 0, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} />
                      <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} width={110} />
                      <Tooltip contentStyle={TS} />
                      <Bar dataKey="total" radius={[0, 4, 4, 0]} name="Total Efforts" fill="#f1f5f9">
                        {bucketList.map(b => <Cell key={b.name} fill={BUCKET_COLORS[b.name] || "#64748b"} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Outcome group per bucket — stacked bar */}
                <div className="card" style={{ gridColumn: "1/-1" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: "#f1f5f9" }}>Outcome Group Mix per Bucket</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>NEG / RPC / PTP / KEPT / POS breakdown — which buckets convert best?</div>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={bucketList.map(b => ({ name: b.name, NEG: b.bySG.NEG||0, RPC: b.bySG.RPC||0, PTP: b.bySG.PTP||0, KEPT: b.bySG.KEPT||0, POS: b.bySG.POS||0 }))} margin={{ bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} angle={bucketList.length > 5 ? -25 : 0} textAnchor={bucketList.length > 5 ? "end" : "middle"} interval={0} />
                      <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                      <Tooltip contentStyle={TS} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      {SG_GROUPS.map(sg => <Bar key={sg} dataKey={sg} stackId="a" fill={GC[sg] || "#64748b"} name={sg} />)}
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* RPC / PTP / KEPT rates comparison */}
                <div className="card" style={{ gridColumn: "1/-1" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: "#f1f5f9" }}>Conversion Rates by Bucket (%)</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>RPC rate, PTP rate, and KEPT rate as % of total efforts per bucket</div>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={bucketList.map(b => ({ name: b.name, "RPC %": parseFloat(b.rpcRate), "PTP %": parseFloat(b.ptpRate), "KEPT %": parseFloat(b.keptRate) }))} margin={{ bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} angle={bucketList.length > 5 ? -25 : 0} textAnchor={bucketList.length > 5 ? "end" : "middle"} interval={0} />
                      <YAxis tick={{ fill: "#64748b", fontSize: 11 }} unit="%" />
                      <Tooltip contentStyle={TS} formatter={(v) => [v.toFixed(1) + "%"]} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="RPC %" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="PTP %" fill="#f58c0b" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="KEPT %" fill="#22c55e" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Touch Point per Bucket */}
                <div className="card" style={{ gridColumn: "1/-1" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: "#f1f5f9" }}>Touch Point Mix per Bucket</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>Which channels are used per placement bucket?</div>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={bucketList.map(b => ({ name: b.name, ...b.byTP }))} margin={{ bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} angle={bucketList.length > 5 ? -25 : 0} textAnchor={bucketList.length > 5 ? "end" : "middle"} interval={0} />
                      <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                      <Tooltip contentStyle={TS} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      {activeTPs.map(tp => <Bar key={tp} dataKey={tp} stackId="b" fill={TP_COLORS[tp] || "#64748b"} name={tp} />)}
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* PTP Amount per Bucket */}
                <div className="card" style={{ gridColumn: "1/3" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: "#f1f5f9" }}>PTP Amount by Bucket</div>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={bucketList} layout="vertical" margin={{ left: 0, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10 }} tickFormatter={v => v >= 1e6 ? (v / 1e6).toFixed(1) + "M" : v >= 1e3 ? (v / 1e3).toFixed(0) + "K" : v} />
                      <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} width={110} />
                      <Tooltip contentStyle={TS} formatter={v => ["₱" + fN(v), "PTP Amount"]} />
                      <Bar dataKey="ptpAmt" radius={[0, 4, 4, 0]} name="PTP Amount">
                        {bucketList.map(b => <Cell key={b.name} fill={BUCKET_COLORS[b.name] || "#64748b"} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Claim Paid Amount per Bucket */}
                <div className="card" style={{ gridColumn: "3/5" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: "#f1f5f9" }}>Claim Paid Amount by Bucket</div>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={bucketList} layout="vertical" margin={{ left: 0, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10 }} tickFormatter={v => v >= 1e6 ? (v / 1e6).toFixed(1) + "M" : v >= 1e3 ? (v / 1e3).toFixed(0) + "K" : v} />
                      <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} width={110} />
                      <Tooltip contentStyle={TS} formatter={v => ["₱" + fN(v), "Claim Amount"]} />
                      <Bar dataKey="claimAmt" radius={[0, 4, 4, 0]} name="Claim Paid">
                        {bucketList.map(b => <Cell key={b.name} fill={BUCKET_COLORS[b.name] || "#f97316"} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* PTP Trend across buckets over time */}
                {ptpTrendByBucket.length > 1 && (
                  <div className="card" style={{ gridColumn: "1/-1" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: "#f1f5f9" }}>PTP Trend by Bucket Over Time</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>Daily PTP record counts per bucket — showing last 15 dates</div>
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart data={ptpTrendByBucket.slice(-15)} margin={{ left: 0, right: 16, bottom: 50 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
                        <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                        <Tooltip contentStyle={TS} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        {bucketList.map(b => (
                          <Line key={b.name} type="monotone" dataKey={b.name} stroke={BUCKET_COLORS[b.name] || "#64748b"} strokeWidth={2} dot={false} name={b.name} />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Claim Paid Trend across buckets over time */}
                {claimTrendByBucket.length > 1 && (
                  <div className="card" style={{ gridColumn: "1/-1" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: "#f1f5f9" }}>Claim Paid Trend by Bucket Over Time</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>Daily claim paid record counts per bucket — showing last 15 dates</div>
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart data={claimTrendByBucket.slice(-15)} margin={{ left: 0, right: 16, bottom: 50 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
                        <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                        <Tooltip contentStyle={TS} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        {bucketList.map(b => (
                          <Line key={b.name} type="monotone" dataKey={b.name} stroke={BUCKET_COLORS[b.name] || "#64748b"} strokeWidth={2} dot={false} name={b.name} />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Radar chart — outcome profile per bucket */}
                {bucketList.length >= 2 && (
                  <div className="card" style={{ gridColumn: "1/3" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: "#f1f5f9" }}>Bucket Outcome Profile (Radar)</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>% of each outcome group per bucket — normalized view</div>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={100}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="sg" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                        {bucketList.slice(0, 6).map(b => (
                          <Radar key={b.name} name={b.name} dataKey={b.name} stroke={BUCKET_COLORS[b.name] || "#64748b"} fill={BUCKET_COLORS[b.name] || "#64748b"} fillOpacity={0.12} />
                        ))}
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Tooltip contentStyle={TS} formatter={(v) => [v.toFixed(1) + "%"]} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Bucket Summary Table */}
                <div className="card" style={{ gridColumn: bucketList.length >= 2 ? "3/5" : "1/-1" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: "#f1f5f9" }}>Bucket PTP & Claim Summary</div>
                  <table>
                    <thead><tr>
                      <th>Bucket</th>
                      <th>Total</th>
                      <th>PTP #</th>
                      <th>PTP Amt</th>
                      <th>Claim #</th>
                      <th>Claim Amt</th>
                      <th>RPC%</th>
                      <th>PTP%</th>
                      <th>KEPT%</th>
                    </tr></thead>
                    <tbody>{bucketList.map(b => (
                      <tr key={b.name}>
                        <td>
                          <span className="bdg" style={{ background: (BUCKET_COLORS[b.name] || "#64748b") + "33", color: BUCKET_COLORS[b.name] || "#94a3b8" }}>{b.name}</span>
                        </td>
                        <td style={{ fontWeight: 700 }}>{b.total.toLocaleString()}</td>
                        <td style={{ color: "#f58c0b" }}>{b.ptpCount.toLocaleString()}</td>
                        <td style={{ color: "#22c55e", fontSize: 12 }}>₱{fN(b.ptpAmt)}</td>
                        <td style={{ color: "#f97316" }}>{b.claimCount.toLocaleString()}</td>
                        <td style={{ color: "#06b6d4", fontSize: 12 }}>₱{fN(b.claimAmt)}</td>
                        <td style={{ color: "#3b82f6" }}>{b.rpcRate}%</td>
                        <td style={{ color: "#f58c0b" }}>{b.ptpRate}%</td>
                        <td style={{ color: "#22c55e" }}>{b.keptRate}%</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>

                {/* Detailed bucket table with drill-down */}
                <div className="card" style={{ gridColumn: "1/-1" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: "#f1f5f9" }}>Detailed Bucket Table</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
                    Click a row to see touch point and outcome breakdown.
                    {selectedBucket && <button onClick={() => setSelectedBucket(null)} style={{ marginLeft: 12, background: "#334155", border: "none", color: "#94a3b8", borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 11 }}>x Clear</button>}
                  </div>
                  <SearchBar value={bucketSearch} onChange={setBucketSearch} placeholder="Filter by bucket name..." />
                  {(() => {
                    const BI = mkIcon(bucketSort);
                    const filteredBuckets = sortFilter(bucketList, bucketSort, bucketSearch, ["name"]);
                    return (
                      <div style={{ overflowX: "auto" }}>
                        <table>
                          <thead><tr>
                            <th>#</th>
                            <th onClick={() => mkSort(bucketSort, setBucketSort)("name")} style={{ cursor: "pointer", userSelect: "none" }}>Bucket <BI col="name" /></th>
                            <th onClick={() => mkSort(bucketSort, setBucketSort)("total")} style={{ cursor: "pointer", userSelect: "none" }}>Total <BI col="total" /></th>
                            <th onClick={() => mkSort(bucketSort, setBucketSort)("pctShare")} style={{ cursor: "pointer", userSelect: "none" }}>% <BI col="pctShare" /></th>
                            {SG_GROUPS.map(sg => <th key={sg} style={{ color: GC[sg] }}>{sg}</th>)}
                            <th style={{ color: "#3b82f6" }}>RPC%</th>
                            <th style={{ color: "#f58c0b" }}>PTP%</th>
                            <th style={{ color: "#22c55e" }}>KEPT%</th>
                            <th style={{ width: 100 }}>Bar</th>
                          </tr></thead>
                          <tbody>{filteredBuckets.map((b, i) => (
                            <tr key={b.name} className={`dr4${selectedBucket === b.name ? " sel" : ""}`} onClick={() => setSelectedBucket(selectedBucket === b.name ? null : b.name)}>
                              <td style={{ color: "#475569" }}>{i + 1}</td>
                              <td><span className="bdg" style={{ background: (BUCKET_COLORS[b.name] || "#64748b") + "33", color: BUCKET_COLORS[b.name] || "#94a3b8" }}>{b.name}</span></td>
                              <td style={{ fontWeight: 700, color: BUCKET_COLORS[b.name] || "#f97316" }}>{b.total.toLocaleString()}</td>
                              <td style={{ color: "#60a5fa" }}>{b.pctShare}%</td>
                              {SG_GROUPS.map(sg => <td key={sg} style={{ color: GC[sg] || "#94a3b8" }}>{(b.bySG[sg] || 0).toLocaleString()}</td>)}
                              <td style={{ color: "#3b82f6" }}>{b.rpcRate}%</td>
                              <td style={{ color: "#f58c0b" }}>{b.ptpRate}%</td>
                              <td style={{ color: "#22c55e" }}>{b.keptRate}%</td>
                              <td><Pb pct={(b.total / bucketList[0].total) * 100} c={BUCKET_COLORS[b.name] || "#f97316"} /></td>
                            </tr>
                          ))}</tbody>
                        </table>
                      </div>
                    );
                  })()}
                </div>

                {/* Bucket drill-down */}
                {selectedBucket && selectedBucketData && (
                  <div className="card" style={{ gridColumn: "1/-1", border: `1px solid ${BUCKET_COLORS[selectedBucket] || "#334155"}44` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "#f1f5f9" }}>📍 {selectedBucket} — Deep Dive</div>
                      <span style={{ background: (BUCKET_COLORS[selectedBucket] || "#64748b") + "22", color: BUCKET_COLORS[selectedBucket] || "#f97316", borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 600, border: `1px solid ${BUCKET_COLORS[selectedBucket] || "#64748b"}44` }}>
                        {selectedBucketData.total.toLocaleString()} total records
                      </span>
                      <span style={{ background: "#172010", color: "#22c55e", borderRadius: 20, padding: "2px 10px", fontSize: 12 }}>₱{fN(selectedBucketData.ptpAmt)} PTP</span>
                      <span style={{ background: "#1a1008", color: "#f97316", borderRadius: 20, padding: "2px 10px", fontSize: 12 }}>₱{fN(selectedBucketData.claimAmt)} Claimed</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                      {/* TP pie */}
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: "#94a3b8", marginBottom: 8 }}>Touch Point Breakdown</div>
                        <ResponsiveContainer width="100%" height={220}>
                          <PieChart>
                            <Pie data={Object.entries(selectedBucketData.byTP).map(([k, v]) => ({ name: k, value: v }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                              {Object.entries(selectedBucketData.byTP).map(([tp], i) => <Cell key={i} fill={TP_COLORS[tp] || PC[i % PC.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={TS} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      {/* SG pie */}
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: "#94a3b8", marginBottom: 8 }}>Outcome Group Breakdown</div>
                        <ResponsiveContainer width="100%" height={220}>
                          <PieChart>
                            <Pie data={Object.entries(selectedBucketData.bySG).map(([k, v]) => ({ name: k, value: v }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                              {Object.entries(selectedBucketData.bySG).map(([sg], i) => <Cell key={i} fill={GC[sg] || PC[i % PC.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={TS} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      {/* Details table */}
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: "#94a3b8", marginBottom: 8 }}>Touch Point Details</div>
                        <table>
                          <thead><tr><th>Touch Point</th><th>Count</th><th>%</th></tr></thead>
                          <tbody>{Object.entries(selectedBucketData.byTP).sort((a, b) => b[1] - a[1]).map(([tp, cnt]) => (
                            <tr key={tp}><td style={{ color: TP_COLORS[tp] || "#94a3b8", fontWeight: 500 }}>{tp}</td><td style={{ fontWeight: 700 }}>{cnt.toLocaleString()}</td><td style={{ color: "#60a5fa" }}>{((cnt / selectedBucketData.total) * 100).toFixed(1)}%</td></tr>
                          ))}</tbody>
                        </table>
                        <div style={{ marginTop: 12 }}>
                          <div style={{ fontWeight: 600, fontSize: 13, color: "#94a3b8", marginBottom: 8 }}>Outcome Details</div>
                          <table>
                            <thead><tr><th>Group</th><th>Count</th><th>%</th></tr></thead>
                            <tbody>{Object.entries(selectedBucketData.bySG).sort((a, b) => b[1] - a[1]).map(([sg, cnt]) => (
                              <tr key={sg}><td><span className="bdg" style={{ background: (GC[sg] || "#3b82f6") + "33", color: GC[sg] || "#94a3b8" }}>{sg}</span></td><td style={{ fontWeight: 700 }}>{cnt.toLocaleString()}</td><td style={{ color: "#60a5fa" }}>{((cnt / selectedBucketData.total) * 100).toFixed(1)}%</td></tr>
                            ))}</tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* PTP trend for this bucket */}
                    {selectedBucketData.ptpByDateArr.length > 0 && (
                      <div style={{ marginTop: 20 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: "#94a3b8", marginBottom: 8 }}>PTP Trend — {selectedBucket}</div>
                        <ResponsiveContainer width="100%" height={180}>
                          <BarChart data={selectedBucketData.ptpByDateArr} margin={{ bottom: 50 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
                            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                            <Tooltip contentStyle={TS} />
                            <Bar dataKey="count" fill={BUCKET_COLORS[selectedBucket] || "#f58c0b"} radius={[3, 3, 0, 0]} name="PTP Records" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {/* Claim trend for this bucket */}
                    {selectedBucketData.claimByDateArr.length > 0 && (
                      <div style={{ marginTop: 20 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: "#94a3b8", marginBottom: 8 }}>Claim Paid Trend — {selectedBucket}</div>
                        <ResponsiveContainer width="100%" height={180}>
                          <BarChart data={selectedBucketData.claimByDateArr} margin={{ bottom: 50 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
                            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                            <Tooltip contentStyle={TS} />
                            <Bar dataKey="count" fill="#f97316" radius={[3, 3, 0, 0]} name="Claim Records" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}
        </>}
      </div>
    </div>
  );
}