import { useState, useMemo, useRef } from "react";
import * as XLSX from "xlsx";
import { useTheme }    from "./useTheme";
import { ThemeToggle } from "./ThemeToggle";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, ScatterChart, Scatter, ZAxis } from "recharts";

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
  "CALL - FOLLOW UP KOR": { tp: "CALL", sg: "RPC" },
  "CALL - FOLLOW UP UNCONTACTABLE": { tp: "CALL", sg: "RPC" },
  "CALL - FOLLOW UP LMTRC": { tp: "CALL", sg: "RPC" },
  "CALL - FOLLOW UP COMPLIANT": { tp: "CALL", sg: "RPC" },
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
  "CARAVAN - FOLLOW UP COMPLIANT": { tp: "FIELD", sg: "RPC" },
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
  "SMEDIA - FOLLOW UP MESSAGE": { tp: "INTERNET", sg: "RPC" },
  "SMEDIA - FOLLOW UP COMPLIANT": { tp: "INTERNET", sg: "RPC" },
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
  "FIELD - FOLLOW UP COMPLIANT": { tp: "FIELD", sg: "RPC" },
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
  "EMAIL - FOLLOW UP MESSAGE": { tp: "EMAIL", sg: "RPC" },
  "EMAIL - FOLLOW UP COMPLIANT": { tp: "EMAIL", sg: "RPC" },
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
  "SMS - FOLLOW UP MESSAGE": { tp: "SMS", sg: "RPC" },
  "SMS - FOLLOW UP COMPLIANT": { tp: "SMS", sg: "RPC" },
  "SMS - KEPT_REPO CLIENT": { tp: "SMS", sg: "KEPT" },
  "SMS - KEPT_REPO 3RD PARTY": { tp: "SMS", sg: "KEPT" },
  "SMS - KEPT PAYOFF": { tp: "SMS", sg: "KEPT" },
  "SMS - KEPT_FULL UPDATE": { tp: "SMS", sg: "KEPT" },
  "SMS - KEPT_PUSH BACK": { tp: "SMS", sg: "KEPT" },
  "SMS - KEPT_PARTIAL": { tp: "SMS", sg: "KEPT" },
  "SMS SENT": { tp: "SMS", sg: "NEG" },
  "SMS REPLY": { tp: "SMS", sg: "RPC" },
  "SMS Replied": { tp: "SMS", sg: "RPC" },
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
  "VIBER - FOLLOW UP MESSAGE": { tp: "VIBER", sg: "RPC" },
  "VIBER - FOLLOW UP COMPLIANT": { tp: "VIBER", sg: "RPC" },
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

const BUCKET_MAP = {
  "01BDORA": "Bucket 1", "01BDA": "Bucket 1", "02BDA": "Bucket 2",
  "05BDA": "Bucket 5", "06BDA": "Bucket 6",
  "01OASSA": "Sub Standard 1", "02OASSA": "Sub Standard 2", "03OASSA": "Substandard 3",
  "04OAFWA": "Write Off",
  "01OAFSA": "Bucket 1", "02OAFSA": "Bucket 2", "03OAFSA": "Bucket 3",
  "04OAFSA": "Bucket 4", "05OAFSA": "Bucket 5", "06OAFSA": "Bucket 6",
  "01BMIM": "Regular", "02BMIM": "NPA", "03BMIM": "Write Off",
  "04CBSCAA" : "CURING", "02CBSRRA" : "RECOV", "03CBSWOA": "Write Off",
  "01RCBA" : "FFA/NPL", "04RCBA" : "Pre-Write Off", "02RCSA": "Saturation",
  "02SBCALA" : "CURING", "06SBRALA": "Saturation", "06SBRAL": "Bucket 6",
  "07SBRAL": "Bucket 7", "08SBRAL": "Bucket 8"
};

const BUCKET_ORDER = [
  "Bucket 1","Bucket 2","Bucket 3","Bucket 4","Bucket 5","Bucket 6",
  "Sub Standard 1","Sub Standard 2","Substandard 3",
  "Regular","NPA","Write Off","Pre-Write Off","CURING","RECOV","FFA/NPL","Saturation"
];

const BUCKET_COLORS = {
  "Bucket 1": "#3b82f6", "Bucket 2": "#06b6d4", "Bucket 3": "#a78bfa",
  "Bucket 4": "#f59e0b", "Bucket 5": "#f97316", "Bucket 6": "#ef4444",
  "Sub Standard 1": "#84cc16", "Sub Standard 2": "#22c55e", "Substandard 3": "#14b8a6",
  "Regular": "#60a5fa", "NPA": "#fb923c", "Write Off": "#dc2626", "Saturation": "#9ca3af", "Pre-Write Off": "#6b7280", "CURING": "#10b981", "RECOV": "#3b82f6", "FFA/NPL": "#eb6868"
};

const resolveBucket = (rawVal) => {
  if (!rawVal) return null;
  const s = String(rawVal).trim().toUpperCase();
  const direct = BUCKET_MAP[String(rawVal).trim()];
  if (direct) return direct;
  for (const [k, v] of Object.entries(BUCKET_MAP)) {
    if (k.toUpperCase() === s) return v;
  }
  for (const [k, v] of Object.entries(BUCKET_MAP)) {
    if (s.includes(k.toUpperCase())) return v;
  }
  return null;
};

const EXCLUDED_REMARKS = [
  "New Assignment", "System Auto Update Remarks For PD",
  "Updates when case reassign to another collector",
  "Sub Special Status Change", "New files imported"
];

const GC = { "NEG": "#c94537", "RPC": "#3b82f6", "KEPT": "#22c55e", "PTP": "#f58c0b", "FOLLOW UP": "#a78bfa", "POS": "#06b6d4" };
const PC = ["#3b82f6","#22c55e","#f59e0b","#ef4444","#a78bfa","#06b6d4","#f97316","#84cc16","#ec4899","#14b8a6","#8b5cf6","#fb7185"];
const TP_COLORS = {
  "CALL": "#3b82f6", "FIELD": "#22c55e", "SMS": "#f59e0b", "VIBER": "#a78bfa",
  "EMAIL": "#06b6d4", "INTERNET": "#f97316", "CEASE COLLECTION": "#ef4444",
  "FIELD REQUEST": "#84cc16", "REPO AI": "#ec4899"
};
const SG_GROUPS = ["KEPT","PTP","RPC","POS","NEG"];
const ALL_TP = ["CALL","SMS","VIBER","EMAIL","FIELD","INTERNET","CEASE COLLECTION","FIELD REQUEST","REPO AI"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const DU = {};
Object.keys(DISP).forEach(k => { DU[k.toUpperCase()] = { ...DISP[k], orig: k }; });

const fN = n => n == null ? "-" : typeof n === "number" ? n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : String(n);

const exportXlsx = (rows, filename = "export.xlsx") => {
  if (!rows || !rows.length) return;
  const ws = XLSX.utils.json_to_sheet(rows);
  const cols = Object.keys(rows[0]);
  ws["!cols"] = cols.map(c => ({ wch: Math.max(c.length, ...rows.slice(0,200).map(r => String(r[c]??'').length), 8) }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data");
  XLSX.writeFile(wb, filename);
};

const ExportBtn = ({ onClick, label = "Export Excel", style = {} }) => (
  <button onClick={onClick} style={{ background:"#052e16", border:"1px solid #166534", color:"#22c55e", borderRadius:7, padding:"5px 13px", cursor:"pointer", fontSize:12, fontWeight:600, display:"inline-flex", alignItems:"center", gap:5, transition:"all .15s", ...style }}
    onMouseOver={e=>e.currentTarget.style.background="#14532d"} onMouseOut={e=>e.currentTarget.style.background="#052e16"}>
    📥 {label}
  </button>
);

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
  const monthNames = { Jan:1, Feb:2, Mar:3, Apr:4, May:5, Jun:6, Jul:7, Aug:8, Sep:9, Oct:10, Nov:11, Dec:12 };
  const mmmMatch = s.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/);
  if (mmmMatch) {
    const [, day, monStr, yr] = mmmMatch;
    const mon = monthNames[monStr];
    if (mon) {
      return `${String(mon).padStart(2, "0")}/${String(parseInt(day)).padStart(2, "0")}/${yr}`;
    }
  }
  const fullMonthMatch = s.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (fullMonthMatch) {
    const [, day, monStr, yr] = fullMonthMatch;
    const mon = monthNames[monStr.substring(0,3)];
    if (mon) {
      return `${String(mon).padStart(2, "0")}/${String(parseInt(day)).padStart(2, "0")}/${yr}`;
    }
  }
  const dmyMatch = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmyMatch) {
    const [, a, b, yr] = dmyMatch;
    const day = parseInt(a), mon = parseInt(b);
    if (day > 12 || (day <= 12 && mon <= 12)) {
      return `${String(day).padStart(2, "0")}/${String(mon).padStart(2, "0")}/${yr}`;
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

const Pb = ({ pct, c, tk }) => (
  <div style={{ height: 6, background: tk.bgSurface, borderRadius: 3, overflow: "hidden" }}>
    <div style={{ height: "100%", borderRadius: 3, width: Math.min(pct, 100) + "%", background: c }} />
  </div>
);

// Penetration heatmap cell
const HeatCell = ({ pct, max, tk }) => {
  const intensity = max > 0 ? pct / max : 0;
  const bg = intensity === 0
    ? tk.heatEmpty
    : `rgba(59,130,246,${0.1 + intensity * 0.85})`;
  const textColor = intensity > 0.5 ? "#fff" : tk.textSub;
  return (
    <div style={{
      background: bg, color: textColor, borderRadius: 4,
      padding: "4px 6px", textAlign: "center", fontSize: 11, fontWeight: 600,
      border: `1px solid ${tk.border}`, minWidth: 54, transition: "background 0.2s"
    }}>
      {pct > 0 ? pct.toFixed(1) + "%" : "–"}
    </div>
  );
};

const SearchBar = ({ value, onChange, placeholder = "Search...", tk }) => (
  <div style={{ position: "relative", marginBottom: 10 }}>
    <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: tk.textFaint, fontSize: 13 }}>🔍</span>
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%", background: tk.bgSurface, border: `1px solid ${tk.borderMed}`, borderRadius: 8,
        color: tk.textPrimary, fontSize: 13, padding: "7px 10px 7px 32px", fontFamily: "inherit", outline: "none"
      }}
    />
    {value && <button onClick={() => onChange("")} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: tk.textMuted, cursor: "pointer", fontSize: 14 }}>x</button>}
  </div>
);

export default function App() {
  const { theme, isDark } = useTheme();

  // ── Theme tokens ─────────────────────────────────────────────────────────
  // All colours in this component are derived from these tokens so that
  // switching theme re-renders every inline style automatically.
  const tk = isDark ? {
    // backgrounds
    bgPage:      "#0f172a",
    bgHeader:    "#0f172a",
    bgCard:      "#1e293b",
    bgCardGrad:  "linear-gradient(135deg,#1e293b,#0f172a)",
    bgSurface:   "#0f172a",
    bgInput:     "#0f172a",
    bgTag:       "#1e293b",
    bgHover:     "#ffffff06",
    bgTableHead: "#0f172a",
    bgCode:      "#0f172a",
    bgTooltip:   "#1e293b",
    bgDZ:        "#1e293b44",
    bgFieldCard: "linear-gradient(135deg,#0a1f0a,#0b0f1a)",
    // borders
    border:      "#1e293b",
    borderMed:   "#334155",
    borderField: "#14532d",
    // text
    textPrimary: "#e2e8f0",
    textBright:  "#f1f5f9",
    textSub:     "#94a3b8",
    textMuted:   "#64748b",
    textFaint:   "#475569",
    textBody:    "#cbd5e1",
    // row hover highlight tints
    rowHoverBlue:  "#1e3a5f",
    rowSelBlue:    "#172554",
    rowHoverGreen: "#1a2e1a",
    rowSelGreen:   "#0f2a0f",
    rowHoverAmber: "#2e1a0f",
    rowSelAmber:   "#2a1500",
    rowHoverPurp:  "#1a1a2e",
    rowSelPurp:    "#0d0d1f",
    // heatmap empty cell
    heatEmpty:   "#0f172a",
    // misc
    scrollTrack: "#1e293b",
    scrollThumb: "#475569",
  } : {
    // backgrounds
    bgPage:      "#f1f5f9",
    bgHeader:    "#ffffff",
    bgCard:      "#ffffff",
    bgCardGrad:  "linear-gradient(135deg,#ffffff,#f8fafc)",
    bgSurface:   "#f8fafc",
    bgInput:     "#ffffff",
    bgTag:       "#e2e8f0",
    bgHover:     "#00000008",
    bgTableHead: "#f1f5f9",
    bgCode:      "#e2e8f0",
    bgTooltip:   "#ffffff",
    bgDZ:        "#e2e8f044",
    bgFieldCard: "linear-gradient(135deg,#f0fdf4,#f8fafc)",
    // borders
    border:      "#e2e8f0",
    borderMed:   "#cbd5e1",
    borderField: "#86efac",
    // text
    textPrimary: "#1e293b",
    textBright:  "#0f172a",
    textSub:     "#475569",
    textMuted:   "#64748b",
    textFaint:   "#94a3b8",
    textBody:    "#334155",
    // row hover highlight tints
    rowHoverBlue:  "#dbeafe",
    rowSelBlue:    "#bfdbfe",
    rowHoverGreen: "#dcfce7",
    rowSelGreen:   "#bbf7d0",
    rowHoverAmber: "#fef3c7",
    rowSelAmber:   "#fde68a",
    rowHoverPurp:  "#ede9fe",
    rowSelPurp:    "#ddd6fe",
    // heatmap empty cell
    heatEmpty:   "#f1f5f9",
    // misc
    scrollTrack: "#e2e8f0",
    scrollThumb: "#94a3b8",
  };
  
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("overview");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCollector, setSelectedCollector] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedBucket, setSelectedBucket] = useState(null);
  const [penetrationMode, setPenetrationMode] = useState("pct"); // "pct" | "efforts" | "accounts"
  const [hourlyCollectorView, setHourlyCollectorView] = useState("heatmap"); // "heatmap" | "bar" | "top"
  const [globalDateFrom, setGlobalDateFrom] = useState(""); // YYYY-MM-DD
  const [globalDateTo, setGlobalDateTo] = useState(""); // YYYY-MM-DD
  const fRef = useRef();

  const [monthCompareMetric, setMonthCompareMetric] = useState("total");
  const [fieldBucketDrilldown, setFieldBucketDrilldown] = useState(null);

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
  const [bpSearch, setBpSearch] = useState("");

    // Account Activity Timeline
  const [timelineSearch, setTimelineSearch] = useState("");
  const [timelineAccount, setTimelineAccount] = useState(null);

  // Active client filter – "All" shows combined data; a client name shows only that client's rows
  const [activeClientFilter, setActiveClientFilter] = useState("All");

  const mkSort = (ss, setSS) => (key) => setSS(prev => ({ key, dir: prev.key === key && prev.dir === "desc" ? "asc" : "desc" }));
  const mkIcon = (ss) => ({ col }) => col !== ss.key
    ? <span style={{ color: tk.borderMed, marginLeft: 4, cursor: "pointer" }}>⇅</span>
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
        const dik = keys.find(k => k.toLowerCase().includes("debtor id") || k.toLowerCase().includes("debtor no"));
        const dnk = keys.find(k => { const l = k.trim().toLowerCase(); return l === "debtor" || l === "debtor name" || l === "name" || l === "client name" || l.includes("debtor name"); });
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
          return l === "date" || l === "remark date" || l === "activity date" || l === "log date" ||
                 l.includes("date") && !l.includes("time") && !l.includes("amount") && !l.includes("paid");
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
          _dateStr: (() => { const key = datек||dtk; return key ? fD(r[key]) : null; })(),
          _dateISO: (() => {
            const key = datек||dtk;
            if (!key) return null;
            const raw = r[key];
            if (!raw) return null;
            // Convert to YYYY-MM-DD for comparison with <input type="date"> values
            if (raw instanceof Date && !isNaN(raw.getTime())) {
              return `${raw.getFullYear()}-${String(raw.getMonth()+1).padStart(2,"0")}-${String(raw.getDate()).padStart(2,"0")}`;
            }
            const s = String(raw).trim();
            // Try DD-MMM-YYYY (e.g., 15-Mar-2023)
            const monthNames = { Jan:1, Feb:2, Mar:3, Apr:4, May:5, Jun:6, Jul:7, Aug:8, Sep:9, Oct:10, Nov:11, Dec:12 };
            const mmmMatch = s.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/);
            if (mmmMatch) {
              const [, day, monStr, yr] = mmmMatch;
              const mon = monthNames[monStr];
              if (mon) {
                return `${yr}-${String(mon).padStart(2,"0")}-${String(parseInt(day)).padStart(2,"0")}`;
              }
            }
            // Try DD Month YYYY (e.g., 15 March 2023)
            const fullMonthMatch = s.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
            if (fullMonthMatch) {
              const [, day, monStr, yr] = fullMonthMatch;
              const mon = monthNames[monStr.substring(0,3)]; // Take first 3 letters
              if (mon) {
                return `${yr}-${String(mon).padStart(2,"0")}-${String(parseInt(day)).padStart(2,"0")}`;
              }
            }
            // Try MM/DD/YYYY or DD/MM/YYYY
            const slashMatch = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
            if (slashMatch) {
              const [,a,b,yr] = slashMatch;
              const num1 = parseInt(a), num2 = parseInt(b);
              let mon, day;
              if (num1 > 12) {
                // num1 >12, must be day, so DD/MM/YYYY
                day = num1;
                mon = num2;
              } else if (num2 > 12) {
                // num2 >12, must be day, so MM/DD/YYYY
                mon = num1;
                day = num2;
              } else {
                // Both <=12, assume DD/MM/YYYY
                day = num1;
                mon = num2;
              }
              mon = String(mon).padStart(2,"0");
              day = String(day).padStart(2,"0");
              return `${yr}-${mon}-${day}`;
            }
            // Try YYYY-MM-DD already
            if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
            // Fallback: parse via Date
            const d = new Date(s);
            if (!isNaN(d.getTime())) return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
            return null;
          })(),
          _monthYear: (() => { const key = datек||dtk; return key ? getMonthYear(fD(r[key])) : null; })(),
          _client: clk ? (r[clk] ? String(r[clk]).trim() : null) : null,
          }));

        if (!rows.length) { setErr("Error: No valid recognized statuses found in the file."); setLoading(false); return; }
        const clients = clk ? [...new Set(rows.map(r=>r._client).filter(Boolean))].sort() : [];
        
        setData({ rows, sk, ak, rk, rmk, pak, pdk, cak, cdk, datек, timek, dtk, clk, oick, dik, dnk, totalRaw, remarkExcludedCount, clients });
      } catch (ex) { setErr("Error parsing file: " + ex.message); }
      setLoading(false);
    };
    r.readAsArrayBuffer(file);
  };

  const an = useMemo(() => {
    if (!data) return null;
    const { rows: allRows, ak, rk, pak, pdk, cak, cdk, datек, timek, dtk, clk, oick, dik } = data;
    const activeDateKey = datек || dtk;

    // Filter by client AND by global date range
    const rows = allRows.filter(r => {
      if (activeClientFilter && activeClientFilter !== "All" && clk && r._client !== activeClientFilter) return false;
      if (globalDateFrom || globalDateTo) {
        const d = r._dateISO; // YYYY-MM-DD — safe for string comparison with input[type=date] values
        if (!d) return false;
        if (globalDateFrom && d < globalDateFrom) return false;
        if (globalDateTo   && d > globalDateTo)   return false;
      }
      return true;
    });
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
    const ua = (ak ? new Set(rows.map(r => r[ak]).filter(Boolean)).size : dik ? new Set(rows.map(r => r[dik]).filter(Boolean)).size : null);

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

    let fieldAnalytics = null;
    const fieldRows = rows.filter(r => r._d.tp === "FIELD");
    if (fieldRows.length > 0) {
      const totalFieldVisits = fieldRows.length;
      const uniqueFieldAccounts = ak ? new Set(fieldRows.map(r=>r[ak]).filter(Boolean)).size : null;
      const fieldRate = uniqueFieldAccounts > 0 ? (( uniqueFieldAccounts / ua  ) * 100).toFixed(1) : "0.0";

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
      fieldAnalytics = { totalFieldVisits, fieldRate, uniqueFieldAccounts, bucketVisitData, fieldDateSorted, fieldMonthSorted, fieldSGData, fieldStatusData, fieldCollectorData, subtypeMap, activeDays, avgVisitsPerDay, peakFieldDay, fieldPtpAmt, fieldPtpCount, hasDate: fieldDateSorted.length > 0, hasAccounts: !!ak };
    }

    // ── Bucket Analytics ─────────────────────────────────────────────────────
    let bucketAnalytics = null;
    if (oick) {
      const bucketMap = {};
      const UNMAPPED_LABEL = "Unknown / Unmapped";
      rows.forEach(r => {
        // Use resolved bucket or fall back to "Unknown / Unmapped" so no data is lost
        const b = r._bucket || UNMAPPED_LABEL;
        if (!b) return;
        if (!bucketMap[b]) bucketMap[b] = {
          total: 0, byTP: {}, bySG: {},
          ptpAmt: 0, ptpCount: 0, claimAmt: 0, claimCount: 0,
          ptpByDate: {}, claimByDate: {}, rawCodes: {},
          // NEW: unique accounts overall and per-TP
          accounts: new Set(),
          accountsByTP: {},
        };
        bucketMap[b].total++;
        bucketMap[b].byTP[r._d.tp] = (bucketMap[b].byTP[r._d.tp] || 0) + 1;
        bucketMap[b].bySG[r._d.sg] = (bucketMap[b].bySG[r._d.sg] || 0) + 1;
        // Unique accounts
        if (ak && r[ak]) {
          const acct = String(r[ak]).trim();
          bucketMap[b].accounts.add(acct);
          if (!bucketMap[b].accountsByTP[r._d.tp]) bucketMap[b].accountsByTP[r._d.tp] = new Set();
          bucketMap[b].accountsByTP[r._d.tp].add(acct);
        }
        if (pak) { const v = parseAmt(r[pak]); if (!isNaN(v) && v > 0) { bucketMap[b].ptpAmt += v; bucketMap[b].ptpCount++; } }
        if (pdk) { const d = fD(r[pdk]); if (d) bucketMap[b].ptpByDate[d] = (bucketMap[b].ptpByDate[d] || 0) + 1; }
        if (cak) { const v = parseAmt(r[cak]); if (!isNaN(v) && v > 0) { bucketMap[b].claimAmt += v; bucketMap[b].claimCount++; } }
        if (cdk) { const d = fD(r[cdk]); if (d) bucketMap[b].claimByDate[d] = (bucketMap[b].claimByDate[d] || 0) + 1; }
        if (oick) { const raw = String(r[oick] || "").trim(); bucketMap[b].rawCodes[raw] = (bucketMap[b].rawCodes[raw] || 0) + 1; }
      });

      const bucketList = Object.entries(bucketMap)
        .sort((a, b) => {
          const ai = BUCKET_ORDER.indexOf(a[0]), bi = BUCKET_ORDER.indexOf(b[0]);
          if (ai === -1 && bi === -1) return a[0].localeCompare(b[0]);
          if (ai === -1) return 1; if (bi === -1) return -1;
          return ai - bi;
        })
        .map(([name, v]) => ({
          name, ...v,
          uniqueAccounts: v.accounts.size,
          // Per-TP unique accounts count
          uniqueAccountsByTP: Object.fromEntries(
            Object.entries(v.accountsByTP).map(([tp, s]) => [tp, s.size])
          ),
          ptpByDateArr: Object.entries(v.ptpByDate).sort((a, b) => new Date(a[0]) - new Date(b[0])).slice(-15).map(([d, c]) => ({ date: d, count: c })),
          claimByDateArr: Object.entries(v.claimByDate).sort((a, b) => new Date(a[0]) - new Date(b[0])).slice(-15).map(([d, c]) => ({ date: d, count: c })),
          pctShare: ((v.total / T) * 100).toFixed(1),
          rpcRate: v.total > 0 ? (((v.bySG.RPC || 0) / v.total) * 100).toFixed(1) : "0.0",
          ptpRate: v.total > 0 ? (((v.bySG.PTP || 0) / v.total) * 100).toFixed(1) : "0.0",
          keptRate: v.total > 0 ? (((v.bySG.KEPT || 0) / v.total) * 100).toFixed(1) : "0.0",
        }));

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

      const radarData = SG_GROUPS.map(sg => {
        const row = { sg };
        bucketList.forEach(b => { row[b.name] = b.total > 0 ? parseFloat(((b.bySG[sg] || 0) / b.total * 100).toFixed(1)) : 0; });
        return row;
      });

      const unmappedCount = rows.filter(r => !r._bucket).length;
      // Collect sample of raw unmapped values so user can diagnose
      const unmappedSamples = [...new Set(
        rows.filter(r => !r._bucket && r[oick]).map(r => String(r[oick]).trim()).filter(Boolean)
      )].slice(0, 8);
      const allUnmapped = bucketList.length === 1 && bucketList[0]?.name === "Unknown / Unmapped";

      // ── Penetration matrix: bucket × touchpoint ──────────────────────────
      // penetration% = unique accounts touched by TP in bucket / total unique accounts in bucket
      const activeTPs = ALL_TP.filter(tp => bucketList.some(b => (b.byTP[tp] || 0) > 0));
      const penetrationMatrix = bucketList.map(b => {
        const row = { bucket: b.name, uniqueAccounts: b.uniqueAccounts, total: b.total };
        activeTPs.forEach(tp => {
          const effortCount = b.byTP[tp] || 0;
          const uniqueWorked = b.uniqueAccountsByTP[tp] || 0;
          const pct = b.uniqueAccounts > 0 ? (uniqueWorked / b.uniqueAccounts) * 100 : 0;
          row[`${tp}_efforts`] = effortCount;
          row[`${tp}_accounts`] = uniqueWorked;
          row[`${tp}_pct`] = parseFloat(pct.toFixed(1));
        });
        // overall penetration: unique accounts with ANY effort / total unique accounts
        row["overall_pct"] = b.uniqueAccounts > 0
          ? parseFloat(((b.uniqueAccounts / b.uniqueAccounts) * 100).toFixed(1))
          : 0;
        return row;
      });

      // Max pct per TP column (for heatmap coloring)
      const tpMaxPct = {};
      activeTPs.forEach(tp => {
        tpMaxPct[tp] = Math.max(...penetrationMatrix.map(r => r[`${tp}_pct`] || 0));
      });

      // ── Penetration chart data (stacked bar by TP across buckets) ─────────
      const penetrationBarData = activeTPs.map(tp => {
        const row = { tp };
        bucketList.forEach(b => {
          row[b.name] = parseFloat((b.uniqueAccounts > 0
            ? ((b.uniqueAccountsByTP[tp] || 0) / b.uniqueAccounts * 100)
            : 0).toFixed(1));
        });
        return row;
      });

      bucketAnalytics = {
        bucketList, ptpTrendByBucket, claimTrendByBucket, radarData, unmappedCount,
        penetrationMatrix, tpMaxPct, penetrationBarData, activeTPs,
        hasAccountData: !!ak, allUnmapped, unmappedSamples,
      };
    }

    // ── Hourly Collector Analytics ───────────────────────────────────────────
    let hourlyCollectorAnalytics = null;
    const activeTimeKey = timek || dtk;
    if (activeTimeKey && rk) {
      // collector × hour matrix
      const collectorHourMap = {}; // { collectorName: { h0..h23: count } }
      const hourCollectorMap = {}; // { hour: { collectorName: count } }
      rows.forEach(r => {
        const collector = r[rk] ? String(r[rk]).trim() : null;
        const tRaw = r[activeTimeKey];
        if (!collector || !tRaw) return;
        const hr = parseTimeHour(tRaw);
        if (hr === null) return;
        if (!collectorHourMap[collector]) collectorHourMap[collector] = {};
        collectorHourMap[collector][hr] = (collectorHourMap[collector][hr] || 0) + 1;
        if (!hourCollectorMap[hr]) hourCollectorMap[hr] = {};
        hourCollectorMap[hr][collector] = (hourCollectorMap[hr][collector] || 0) + 1;
      });

      const allCollectors = Object.keys(collectorHourMap).sort((a, b) => {
        const ta = Object.values(collectorHourMap[a]).reduce((s, v) => s + v, 0);
        const tb = Object.values(collectorHourMap[b]).reduce((s, v) => s + v, 0);
        return tb - ta;
      });

      // Heatmap data: array of { collector, h0..h23, total, peakHour }
      const heatmapRows = allCollectors.slice(0, 30).map(col => {
        const hours = collectorHourMap[col];
        const total = Object.values(hours).reduce((s, v) => s + v, 0);
        const peakHour = Object.entries(hours).sort((a, b) => b[1] - a[1])[0]?.[0];
        const row = { collector: col, total, peakHour: peakHour != null ? `${String(peakHour).padStart(2, "0")}:00` : "–" };
        for (let h = 0; h < 24; h++) row[`h${h}`] = hours[h] || 0;
        return row;
      });

      // Per-hour top collectors bar data
      const hourTopData = Array.from({ length: 24 }, (_, h) => {
        const hMap = hourCollectorMap[h] || {};
        const total = Object.values(hMap).reduce((s, v) => s + v, 0);
        const topCol = Object.entries(hMap).sort((a, b) => b[1] - a[1])[0];
        return {
          hour: `${String(h).padStart(2, "0")}:00`,
          total,
          topCollector: topCol?.[0] || "–",
          topCount: topCol?.[1] || 0,
        };
      });

      // Collector peak hour distribution (for pie)
      const peakHourDist = {};
      heatmapRows.forEach(r => {
        const ph = r.peakHour;
        peakHourDist[ph] = (peakHourDist[ph] || 0) + 1;
      });

      // Max value for heatmap normalization
      let heatmapMax = 0;
      heatmapRows.forEach(r => {
        for (let h = 0; h < 24; h++) { if (r[`h${h}`] > heatmapMax) heatmapMax = r[`h${h}`]; }
      });

      // Summary by shift: early (6-9), morning (9-12), afternoon (12-17), evening (17-21), night (21-24, 0-6)
      const shiftMap = { "Early (6–9)": [6,7,8], "Morning (9–12)": [9,10,11], "Afternoon (12–17)": [12,13,14,15,16], "Evening (17–21)": [17,18,19,20], "Night (21–6)": [21,22,23,0,1,2,3,4,5] };
      const shiftData = Object.entries(shiftMap).map(([label, hours]) => ({
        name: label,
        count: hours.reduce((s, h) => s + (Object.values(hourCollectorMap[h] || {}).reduce((a, b) => a + b, 0)), 0),
      }));

      // Hourly TP breakdown
      const hourTPMap = {};
      rows.forEach(r => {
        const tRaw = r[activeTimeKey];
        if (!tRaw) return;
        const hr = parseTimeHour(tRaw);
        if (hr === null) return;
        if (!hourTPMap[hr]) hourTPMap[hr] = {};
        hourTPMap[hr][r._d.tp] = (hourTPMap[hr][r._d.tp] || 0) + 1;
      });
      const hourTPData = Array.from({ length: 24 }, (_, h) => ({
        hour: `${String(h).padStart(2, "0")}:00`,
        ...hourTPMap[h] || {},
      }));

      hourlyCollectorAnalytics = {
        heatmapRows, heatmapMax, hourTopData, peakHourDist, shiftData, hourTPData,
        allCollectors, collectorHourMap, rawRows: rows,
      };
    } else if (activeTimeKey && !rk) {
      // Only time available, no collector column – still compute hourly TP
      const hourTPMap = {};
      rows.forEach(r => {
        const tRaw = r[activeTimeKey];
        if (!tRaw) return;
        const hr = parseTimeHour(tRaw);
        if (hr === null) return;
        if (!hourTPMap[hr]) hourTPMap[hr] = {};
        hourTPMap[hr][r._d.tp] = (hourTPMap[hr][r._d.tp] || 0) + 1;
      });
      const hourTPData = Array.from({ length: 24 }, (_, h) => ({
        hour: `${String(h).padStart(2, "0")}:00`,
        ...hourTPMap[h] || {},
      }));
      const hourTopData = Array.from({ length: 24 }, (_, h) => ({
        hour: `${String(h).padStart(2, "0")}:00`,
        total: Object.values(hourTPMap[h] || {}).reduce((s, v) => s + v, 0),
      }));
      hourlyCollectorAnalytics = { heatmapRows: [], heatmapMax: 0, hourTopData, shiftData: [], hourTPData, allCollectors: [], collectorHourMap: {}, noCollector: true };
    }

    // ── TP × SG frequency matrix ─────────────────────────────────────────────
    // tpBySG[sg][tp] = count
    const tpBySGMap = {};
    SG_GROUPS.forEach(sg => { tpBySGMap[sg] = {}; });
    rows.forEach(r => {
      const sg = r._d.sg, tp = r._d.tp;
      if (!tpBySGMap[sg]) tpBySGMap[sg] = {};
      tpBySGMap[sg][tp] = (tpBySGMap[sg][tp] || 0) + 1;
    });
    // Convert to sorted arrays for each SG
    const tpBySG = {};
    SG_GROUPS.forEach(sg => {
      tpBySG[sg] = Object.entries(tpBySGMap[sg])
        .sort((a, b) => b[1] - a[1])
        .map(([tp, count]) => {
          const sgTotal = gc[sg] || 1;
          return { tp, count, pct: ((count / sgTotal) * 100).toFixed(1) };
        });
    });

    // ── PTP & Claim Trend by Bucket ───────────────────────────────────────────
    // Only if both oick (bucket) and pdk/cdk available
    let ptpClaimByBucket = null;
    if (oick) {
      const ptpBucketMap = {}; // bucket -> { count, amt, byDate: {} }
      const claimBucketMap = {};
      rows.forEach(r => {
        const b = r._bucket; if (!b) return;
        if (!ptpBucketMap[b]) ptpBucketMap[b] = { count: 0, amt: 0, byDate: {} };
        if (!claimBucketMap[b]) claimBucketMap[b] = { count: 0, amt: 0, byDate: {} };
        if (pak) { const v = parseAmt(r[pak]); if (!isNaN(v) && v > 0) { ptpBucketMap[b].count++; ptpBucketMap[b].amt += v; } }
        if (cak) { const v = parseAmt(r[cak]); if (!isNaN(v) && v > 0) { claimBucketMap[b].count++; claimBucketMap[b].amt += v; } }
        if (pdk) { const d = fD(r[pdk]); if (d) ptpBucketMap[b].byDate[d] = (ptpBucketMap[b].byDate[d] || 0) + 1; }
        if (cdk) { const d = fD(r[cdk]); if (d) claimBucketMap[b].byDate[d] = (claimBucketMap[b].byDate[d] || 0) + 1; }
      });

      // Summary table: one row per bucket
      const ptpClaimSummary = BUCKET_ORDER.filter(b => ptpBucketMap[b] || claimBucketMap[b]).map(b => ({
        bucket: b,
        ptpCount: ptpBucketMap[b]?.count || 0,
        ptpAmt: ptpBucketMap[b]?.amt || 0,
        claimCount: claimBucketMap[b]?.count || 0,
        claimAmt: claimBucketMap[b]?.amt || 0,
      }));

      // Trend: all PTP dates × buckets
      const allPtpDates = new Set();
      Object.values(ptpBucketMap).forEach(v => Object.keys(v.byDate).forEach(d => allPtpDates.add(d)));
      const ptpTrend = Array.from(allPtpDates).sort((a,b) => new Date(a)-new Date(b)).map(date => {
        const row = { date };
        Object.keys(ptpBucketMap).forEach(b => { row[b] = ptpBucketMap[b].byDate[date] || 0; });
        return row;
      });

      const allClaimDates = new Set();
      Object.values(claimBucketMap).forEach(v => Object.keys(v.byDate).forEach(d => allClaimDates.add(d)));
      const claimTrend = Array.from(allClaimDates).sort((a,b) => new Date(a)-new Date(b)).map(date => {
        const row = { date };
        Object.keys(claimBucketMap).forEach(b => { row[b] = claimBucketMap[b].byDate[date] || 0; });
        return row;
      });

      const ptpBucketNames = Object.keys(ptpBucketMap);
      const claimBucketNames = Object.keys(claimBucketMap);

      ptpClaimByBucket = { ptpClaimSummary, ptpTrend, claimTrend, ptpBucketNames, claimBucketNames };
    }

    // ── Overall Penetration ───────────────────────────────────────────────────
    // overall = unique accounts that had ANY touchpoint effort / total unique accounts
    let overallPenetrationData = null;
    if (ak) {
      const totalUniqueAccounts = new Set(rows.map(r => r[ak]).filter(Boolean));
      const totalUA = totalUniqueAccounts.size;

      // Per-TP unique accounts touched overall (not per-bucket)
      const tpAccountMap = {};
      rows.forEach(r => {
        const acct = r[ak]; if (!acct) return;
        const tp = r._d.tp;
        if (!tpAccountMap[tp]) tpAccountMap[tp] = new Set();
        tpAccountMap[tp].add(String(acct).trim());
      });

      const tpPenetrationOverall = Object.entries(tpAccountMap)
        .map(([tp, accts]) => ({
          tp,
          uniqueAccountsTouched: accts.size,
          pct: totalUA > 0 ? parseFloat(((accts.size / totalUA) * 100).toFixed(1)) : 0
        }))
        .sort((a, b) => b.pct - a.pct);

      // Per-SG penetration: unique accounts per outcome group
      const sgAccountMap = {};
      rows.forEach(r => {
        const acct = r[ak]; if (!acct) return;
        const sg = r._d.sg;
        if (!sgAccountMap[sg]) sgAccountMap[sg] = new Set();
        sgAccountMap[sg].add(String(acct).trim());
      });
      const sgPenetrationOverall = SG_GROUPS
        .filter(sg => sgAccountMap[sg])
        .map(sg => ({
          sg,
          uniqueAccounts: sgAccountMap[sg].size,
          pct: totalUA > 0 ? parseFloat(((sgAccountMap[sg].size / totalUA) * 100).toFixed(1)) : 0
        }));

      // Accounts with ANY effort
      const accountsWithEffort = totalUniqueAccounts.size;
      // overallPct = sum of each TP's penetration% / number of TPs
      const avgTpPct = tpPenetrationOverall.length > 0
        ? parseFloat((tpPenetrationOverall.reduce((s, r) => s + r.pct, 0) / tpPenetrationOverall.length).toFixed(1))
        : 0;
      overallPenetrationData = { totalUA, accountsWithEffort, overallPct: avgTpPct, tpPenetrationOverall, sgPenetrationOverall };
    }

    // ── Broken Promise (BP) Analytics ────────────────────────────────────────
    // BP = account has a PTP date but NO Claim Paid recorded
    let bpAnalytics = null;
    if (ak && pak && pdk) {
      const acctMap = {};
      rows.forEach(r => {
        const acct = r[ak] ? String(r[ak]).trim() : null;
        if (!acct) return;
        const ptpDateRaw = r[pdk];
        const ptpAmt = parseAmt(r[pak]);
        const claimDateRaw = cdk ? r[cdk] : null;
        const claimAmt = cak ? parseAmt(r[cak]) : NaN;
        const ptpDate = ptpDateRaw ? fD(ptpDateRaw) : null;
        const claimDate = claimDateRaw ? fD(claimDateRaw) : null;
        const collector = rk && r[rk] ? String(r[rk]).trim() : null;
        const bucket = r._bucket || null;
        const client = r._client || null;
        const debtor = data.dnk && r[data.dnk] ? String(r[data.dnk]).trim() : null;

        if (!acctMap[acct]) acctMap[acct] = { ptpDates: [], claimDates: [], ptpAmt: 0, claimAmt: 0, ptpCollector: null, collector, bucket, client, debtor, statuses: [] };

        if (ptpDate && !isNaN(ptpAmt) && ptpAmt > 0) {
          acctMap[acct].ptpDates.push(ptpDate);
          if (ptpAmt > acctMap[acct].ptpAmt) {
            acctMap[acct].ptpAmt = ptpAmt;
            acctMap[acct].ptpCollector = collector; // collector who set the highest PTP
          }
        }
        if (claimDate && !isNaN(claimAmt) && claimAmt > 0) {
          acctMap[acct].claimDates.push(claimDate);
          acctMap[acct].claimAmt = Math.max(acctMap[acct].claimAmt, claimAmt);
        }
        if (collector && !acctMap[acct].collector) acctMap[acct].collector = collector;
        if (bucket && !acctMap[acct].bucket) acctMap[acct].bucket = bucket;
        acctMap[acct].statuses.push(r._status);
      });

      // Determine BP: account has at least one PTP date, and the latest claim paid date is BEFORE the latest PTP date (or no claim at all)
      const bpAccounts = [];
      const keptAccounts = [];
      let totalPTPAccounts = 0;

      Object.entries(acctMap).forEach(([acct, v]) => {
        if (v.ptpDates.length === 0) return;
        totalPTPAccounts++;
        const latestPTP = v.ptpDates.sort((a, b) => new Date(b) - new Date(a))[0];
        const latestClaim = v.claimDates.length > 0 ? v.claimDates.sort((a, b) => new Date(b) - new Date(a))[0] : null;
        // BP: no claim paid at all
        // NOT BP: has any claim paid (even if before PTP date — claim was made so not broken)
        const isBP = !latestClaim;
        if (isBP) {
          bpAccounts.push({ acct, ptpDate: latestPTP, claimDate: "–", ptpAmt: v.ptpAmt, debtor: v.debtor || "–", collector: v.ptpCollector || v.collector || "–", bucket: v.bucket || "–", client: v.client || "–", statuses: [...new Set(v.statuses)] });
        } else {
          keptAccounts.push({ acct, ptpDate: latestPTP, claimDate: latestClaim, ptpAmt: v.ptpAmt, claimAmt: v.claimAmt, collector: v.ptpCollector || v.collector || "–", bucket: v.bucket || "–" });
        }
      });

      // Sort BPs by PTP date descending (most recent first)
      bpAccounts.sort((a, b) => new Date(b.ptpDate) - new Date(a.ptpDate));

      // Aggregate BPs by date
      const bpByDate = {};
      bpAccounts.forEach(b => { bpByDate[b.ptpDate] = (bpByDate[b.ptpDate] || 0) + 1; });
      const bpDateTrend = Object.entries(bpByDate).sort((a, b) => new Date(a[0]) - new Date(b[0])).map(([date, count]) => ({ date, count }));

      // BPs by collector
      const bpByCollector = {};
      bpAccounts.forEach(b => { if (b.collector !== "–") bpByCollector[b.collector] = (bpByCollector[b.collector] || 0) + 1; });
      const bpCollectorData = Object.entries(bpByCollector).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count, pct: ((count / bpAccounts.length) * 100).toFixed(1) }));

      // BPs by bucket
      const bpByBucket = {};
      bpAccounts.forEach(b => { if (b.bucket !== "–") bpByBucket[b.bucket] = (bpByBucket[b.bucket] || 0) + 1; });
      const bpBucketData = Object.entries(bpByBucket).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count, pct: ((count / bpAccounts.length) * 100).toFixed(1) }));

      // Total PTP amount at risk (BP accounts)
      const bpTotalAmt = bpAccounts.reduce((s, b) => s + b.ptpAmt, 0);
      const bpRate = totalPTPAccounts > 0 ? ((bpAccounts.length / totalPTPAccounts) * 100).toFixed(1) : "0.0";

      bpAnalytics = { bpAccounts, keptAccounts, totalPTPAccounts, bpRate, bpTotalAmt, bpDateTrend, bpCollectorData, bpBucketData };
    }

    // ── Collector × Bucket Cross-Analysis ────────────────────────────────────
    let collectorBucketAnalytics = null;
    if (rk && oick) {
      const cbMap = {}; // { collector: { bucket: { total, bySG: {}, ptpAmt, claimAmt } } }
      const allBucketsSet = new Set();
      rows.forEach(r => {
        const col = r[rk] ? String(r[rk]).trim() : null;
        const bkt = r._bucket || "Unknown";
        if (!col) return;
        allBucketsSet.add(bkt);
        if (!cbMap[col]) cbMap[col] = {};
        if (!cbMap[col][bkt]) cbMap[col][bkt] = { total: 0, bySG: {}, ptpAmt: 0, claimAmt: 0 };
        cbMap[col][bkt].total++;
        cbMap[col][bkt].bySG[r._d.sg] = (cbMap[col][bkt].bySG[r._d.sg] || 0) + 1;
        if (pak) { const v = parseAmt(r[pak]); if (!isNaN(v) && v > 0) cbMap[col][bkt].ptpAmt += v; }
        if (cak) { const v = parseAmt(r[cak]); if (!isNaN(v) && v > 0) cbMap[col][bkt].claimAmt += v; }
      });

      const allBuckets = [...allBucketsSet].sort((a, b) => {
        const ai = BUCKET_ORDER.indexOf(a), bi = BUCKET_ORDER.indexOf(b);
        if (ai === -1 && bi === -1) return a.localeCompare(b);
        if (ai === -1) return 1; if (bi === -1) return -1;
        return ai - bi;
      });

      // Build collector rows: total + per-bucket breakdown
      const collectorBucketRows = Object.entries(cbMap)
        .map(([name, buckets]) => {
          const total = Object.values(buckets).reduce((s, v) => s + v.total, 0);
          const ptpAmt = Object.values(buckets).reduce((s, v) => s + v.ptpAmt, 0);
          const claimAmt = Object.values(buckets).reduce((s, v) => s + v.claimAmt, 0);
          const primaryBucket = Object.entries(buckets).sort((a, b) => b[1].total - a[1].total)[0]?.[0] || "–";
          const bySG = {};
          Object.values(buckets).forEach(b => { Object.entries(b.bySG).forEach(([sg, c]) => { bySG[sg] = (bySG[sg] || 0) + c; }); });
          return { name, total, ptpAmt, claimAmt, primaryBucket, bySG, buckets };
        })
        .sort((a, b) => b.total - a.total);

      // Heatmap: collector × bucket (total efforts)
      const cbHeatmap = collectorBucketRows.slice(0, 25).map(c => {
        const row = { collector: c.name, total: c.total, primaryBucket: c.primaryBucket };
        allBuckets.forEach(b => { row[b] = c.buckets[b]?.total || 0; });
        return row;
      });

      // Max value for heatmap
      let cbHeatmapMax = 0;
      cbHeatmap.forEach(r => { allBuckets.forEach(b => { if (r[b] > cbHeatmapMax) cbHeatmapMax = r[b]; }); });

      // Per-bucket summary
      const bucketSummaryForCollectors = allBuckets.map(b => {
        const totalEfforts = collectorBucketRows.reduce((s, c) => s + (c.buckets[b]?.total || 0), 0);
        const uniqueCollectors = collectorBucketRows.filter(c => (c.buckets[b]?.total || 0) > 0).length;
        return { bucket: b, totalEfforts, uniqueCollectors };
      }).filter(b => b.totalEfforts > 0);

      collectorBucketAnalytics = { collectorBucketRows, cbHeatmap, cbHeatmapMax, allBuckets, bucketSummaryForCollectors };
    }

    // ── PTP Conversion Funnel ─────────────────────────────────────────────────
    // Uses only local vars (rows, gc, T, ak, rk, oick) — not `an`
    let funnelAnalytics = null;
    {
      const rpcEfforts = (gc["RPC"]||0) + (gc["PTP"]||0) + (gc["KEPT"]||0) + (gc["POS"]||0);
      const ptpEfforts = gc["PTP"] || 0;
      const keptEfforts = gc["KEPT"] || 0;

      if (ak) {
        const totalAccts = new Set(rows.map(r => r[ak]).filter(Boolean));
        const totalUA = totalAccts.size;
        const rpcAccts = new Set(), ptpAccts = new Set(), keptAccts = new Set();
        rows.forEach(r => {
          const acct = r[ak] ? String(r[ak]).trim() : null; if (!acct) return;
          const sg = r._d.sg;
          if (sg==="RPC"||sg==="PTP"||sg==="KEPT"||sg==="POS") rpcAccts.add(acct);
          if (sg==="PTP") ptpAccts.add(acct);
          if (sg==="KEPT") keptAccts.add(acct);
        });
        const rpcUA = rpcAccts.size, ptpUA = ptpAccts.size, keptUA = keptAccts.size;
        const bpUA = Math.max(0, ptpUA - keptUA);

        const stages = [
          { label:"Total Accounts",     value:totalUA, color:"#3b82f6", pct:"100.0",                                              sub:"All unique accounts" },
          { label:"Right Party Contact",value:rpcUA,   color:"#a78bfa", pct:totalUA>0?((rpcUA/totalUA)*100).toFixed(1):"0.0",    sub:"RPC / PTP / KEPT outcome" },
          { label:"PTP Set",            value:ptpUA,   color:"#f59e0b", pct:totalUA>0?((ptpUA/totalUA)*100).toFixed(1):"0.0",    sub:"Accounts with promise to pay" },
          { label:"PTP Kept",        value:keptUA,  color:"#22c55e", pct:totalUA>0?((keptUA/totalUA)*100).toFixed(1):"0.0",   sub:"Accounts that honored PTP" },
          { label:"Broken Promise (BP)",  value:bpUA,    color:"#ef4444", pct:totalUA>0?((bpUA/totalUA)*100).toFixed(1):"0.0",     sub:"PTP set but not honored" },
        ];
        const stepConv = [
          { from:"All Accounts", to:"RPC",      rate:totalUA>0?((rpcUA/totalUA)*100).toFixed(1):"0.0" },
          { from:"RPC",          to:"PTP Set",  rate:rpcUA>0?((ptpUA/rpcUA)*100).toFixed(1):"0.0" },
          { from:"PTP Set",      to:"PTP Kept", rate:ptpUA>0?((keptUA/ptpUA)*100).toFixed(1):"0.0" },
        ];

        // By-bucket funnel
        let bucketFunnel = null;
        if (oick) {
          const bMap = {};
          rows.forEach(r => {
            const b = r._bucket||"Unknown", acct = r[ak]?String(r[ak]).trim():null;
            if (!bMap[b]) bMap[b]={ total:new Set(), rpc:new Set(), ptp:new Set(), kept:new Set() };
            if (acct) {
              bMap[b].total.add(acct);
              const sg=r._d.sg;
              if(sg==="RPC"||sg==="PTP"||sg==="KEPT"||sg==="POS") bMap[b].rpc.add(acct);
              if(sg==="PTP") bMap[b].ptp.add(acct);
              if(sg==="KEPT") bMap[b].kept.add(acct);
            }
          });
          bucketFunnel = Object.entries(bMap).sort((a,b)=>b[1].total.size-a[1].total.size).map(([name,v])=>({
            name, total:v.total.size, rpc:v.rpc.size, ptp:v.ptp.size, kept:v.kept.size,
            rpcRate: v.total.size>0?((v.rpc.size/v.total.size)*100).toFixed(1):"0.0",
            ptpRate: v.total.size>0?((v.ptp.size/v.total.size)*100).toFixed(1):"0.0",
            keptRate:v.total.size>0?((v.kept.size/v.total.size)*100).toFixed(1):"0.0",
            convRate:v.ptp.size>0?((v.kept.size/v.ptp.size)*100).toFixed(1):"0.0",
          }));
        }

        // By-collector funnel
        let collectorFunnel = null;
        if (rk) {
          const cMap = {};
          rows.forEach(r => {
            const col=r[rk]?String(r[rk]).trim():null, acct=r[ak]?String(r[ak]).trim():null;
            if (!col) return;
            if (!cMap[col]) cMap[col]={ total:new Set(), rpc:new Set(), ptp:new Set(), kept:new Set() };
            if (acct) {
              cMap[col].total.add(acct);
              const sg=r._d.sg;
              if(sg==="RPC"||sg==="PTP"||sg==="KEPT"||sg==="POS") cMap[col].rpc.add(acct);
              if(sg==="PTP") cMap[col].ptp.add(acct);
              if(sg==="KEPT") cMap[col].kept.add(acct);
            }
          });
          collectorFunnel = Object.entries(cMap).sort((a,b)=>b[1].total.size-a[1].total.size).slice(0,30).map(([name,v])=>({
            name, total:v.total.size, rpc:v.rpc.size, ptp:v.ptp.size, kept:v.kept.size,
            rpcRate: v.total.size>0?((v.rpc.size/v.total.size)*100).toFixed(1):"0.0",
            ptpRate: v.total.size>0?((v.ptp.size/v.total.size)*100).toFixed(1):"0.0",
            keptRate:v.total.size>0?((v.kept.size/v.total.size)*100).toFixed(1):"0.0",
            convRate:v.ptp.size>0?((v.kept.size/v.ptp.size)*100).toFixed(1):"0.0",
          }));
        }

        funnelAnalytics = { stages, stepConv, totalUA, bucketFunnel, collectorFunnel, hasAccount:true };
      } else {
        // Effort-based fallback
        const stages = [
          { label:"Total Efforts",       value:T,           color:"#3b82f6", pct:"100.0",                                              sub:"all valid records" },
          { label:"Right Party Contact", value:rpcEfforts,  color:"#a78bfa", pct:T>0?((rpcEfforts/T)*100).toFixed(1):"0.0",           sub:"RPC + PTP + KEPT outcomes" },
          { label:"PTP Set",             value:ptpEfforts,  color:"#f59e0b", pct:T>0?((ptpEfforts/T)*100).toFixed(1):"0.0",           sub:"promise-to-pay records" },
          { label:"PTP Kept",            value:keptEfforts, color:"#22c55e", pct:T>0?((keptEfforts/T)*100).toFixed(1):"0.0",          sub:"kept / honored records" },
        ];
        const stepConv = [
          { from:"Total",   to:"RPC",      rate:T>0?((rpcEfforts/T)*100).toFixed(1):"0.0" },
          { from:"RPC",     to:"PTP Set",  rate:rpcEfforts>0?((ptpEfforts/rpcEfforts)*100).toFixed(1):"0.0" },
          { from:"PTP Set", to:"PTP Kept", rate:ptpEfforts>0?((keptEfforts/ptpEfforts)*100).toFixed(1):"0.0" },
        ];
        funnelAnalytics = { stages, stepConv, hasAccount:false };
      }
    }
    
    return { sd, gd, td, ua, cd, pt, pc, ct, cc, pdd, cdd, T, dateAnalytics, monthlyAnalytics, clientAnalytics, bucketAnalytics, hourlyCollectorAnalytics, fieldAnalytics, tpBySG, ptpClaimByBucket, overallPenetrationData, bpAnalytics, collectorBucketAnalytics, funnelAnalytics };
  }, [data, activeClientFilter, globalDateFrom, globalDateTo]);

  const TS = { background: tk.bgTooltip, border: `1px solid ${tk.borderMed}`, borderRadius: 8, fontSize: 12, color: tk.textPrimary };

  // ── Analytic insight description strip ──────────────────────────────────
  const Insight = ({ text, color = "#60a5fa", icon = "💡" }) => (
    <div style={{ fontSize: 12, color: tk.textSub, background: isDark ? `${color}11` : `${color}18`, border: `1px solid ${color}33`, borderRadius: 7, padding: "7px 12px", marginBottom: 10, lineHeight: 1.55, display: "flex", gap: 8 }}>
      <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
      <span dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  );

  const selectedDateRows = useMemo(() => {
    if (!selectedDate || !data || !an?.dateAnalytics) return null;
    const { datек, dtk, clk } = data;
    const activeKey = datек || dtk;
    if (!activeKey) return null;
    const sc = {};
    const rows = (activeClientFilter && activeClientFilter !== "All" && clk)
      ? data.rows.filter(r => r._client === activeClientFilter)
      : data.rows;
    rows.forEach(r => {
      const d = fD(r[activeKey]);
      if (d === selectedDate) { sc[r._status] = (sc[r._status] || 0) + 1; }
    });
    return Object.entries(sc).sort((a, b) => b[1] - a[1]).map(([s, c]) => {
      const d = DU[s.toUpperCase()];
      return { status: s, count: c, grp: d?.sg || "", tp: d?.tp || "" };
    });
  }, [selectedDate, data, an, activeClientFilter]);

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

  // Heatmap color for hourly collector
  const hourlyColor = (val, max) => {
    if (!val || max === 0) return tk.heatEmpty;
    const i = val / max;
    if (i < 0.25) return `rgba(59,130,246,${0.2 + i * 1.2})`;
    if (i < 0.5) return `rgba(16,185,129,${0.3 + i})`;
    if (i < 0.75) return `rgba(245,158,11,${0.4 + i * 0.8})`;
    return `rgba(239,68,68,${0.5 + i * 0.5})`;
  };

  return (
    <div style={{ minHeight: "100vh", background: tk.bgPage, color: tk.textPrimary, fontFamily: "'DM Sans',sans-serif", transition: "background 0.3s, color 0.3s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:${tk.scrollTrack}}::-webkit-scrollbar-thumb{background:${tk.scrollThumb};border-radius:3px}
        .card{background:${tk.bgCard};border-radius:12px;padding:20px;border:1px solid ${tk.borderMed};transition:background 0.3s,border-color 0.3s}
        .sc{background:${tk.bgCardGrad};border-radius:12px;padding:18px;border:1px solid ${tk.borderMed};transition:background 0.3s,border-color 0.3s}
        .bdg{display:inline-block;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600}
        table{width:100%;border-collapse:collapse;font-size:13px}
        th{background:${tk.bgTableHead};color:${tk.textSub};font-weight:600;text-align:left;padding:10px 12px;border-bottom:1px solid ${tk.borderMed};font-size:11px;text-transform:uppercase;letter-spacing:.05em;transition:background 0.3s}
        td{padding:9px 12px;border-bottom:1px solid ${tk.border};color:${tk.textBody};transition:background 0.3s,color 0.3s}
        tr:hover td{background:${tk.bgHover}}
        .dz{border:2px dashed ${tk.borderMed};border-radius:16px;padding:48px 24px;text-align:center;cursor:pointer;transition:all .2s}
        .dz:hover{border-color:#3b82f6;background:${tk.bgDZ}}
        input[type=file]{display:none}
        .tb{background:none;border:none;cursor:pointer;padding:8px 18px;border-radius:8px;font-family:inherit;font-size:13px;font-weight:500;transition:all .2s;color:${tk.textSub};white-space:nowrap}
        .tb.ac{background:#1e40af;color:#fff}
        .tb:hover:not(.ac){background:${tk.bgCard};color:${tk.textPrimary}}
        .dr{cursor:pointer;transition:background .15s}
        .dr:hover td{background:${tk.rowHoverBlue} !important}
        .dr.sel td{background:${tk.rowSelBlue} !important}
        .dr2:hover td{background:${tk.rowHoverGreen} !important}
        .dr2.sel td{background:${tk.rowSelGreen} !important}
        .dr3:hover td{background:${tk.rowHoverAmber} !important}
        .dr3.sel td{background:${tk.rowSelAmber} !important}
        .dr4:hover td{background:${tk.rowHoverPurp} !important}
        .dr4.sel td{background:${tk.rowSelPurp} !important}
        .mode-btn{background:none;border:1px solid ${tk.borderMed};cursor:pointer;padding:5px 12px;border-radius:6px;font-family:inherit;font-size:12px;font-weight:500;color:${tk.textMuted};transition:all .15s}
        .mode-btn.active{background:#1e40af;border-color:#3b82f6;color:#fff}
        .hm-cell{border-radius:3px;font-size:10px;font-weight:600;text-align:center;padding:3px 0;min-width:26px;transition:all .15s;cursor:default}
        .field-card{background:${tk.bgFieldCard};border:1px solid ${tk.borderField};border-radius:12px;padding:18px;transition:background 0.3s}
      `}</style>

      {/* Header */}
      <div style={{ background: tk.bgHeader, borderBottom: `1px solid ${tk.border}`, padding: "16px 32px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", transition: "background 0.3s" }}>
        <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📊</div>
        <div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 18, color: tk.textBright }}>SPM – Collections Analytics</div>
          <div style={{ fontSize: 12, color: tk.textMuted }}>Status Disposition Intelligence System · 255 Recognized Dispositions</div>
        </div>
        {data && an && <div style={{ marginLeft: "auto", fontSize: 12, color: "#22c55e", background: "#052e16", padding: "4px 12px", borderRadius: 20, border: "1px solid #166534" }}>✓ {an.T.toLocaleString()} valid records loaded</div>}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
        <ThemeToggle size="md" />
      </div>
        {data && an && <div style={{ textAlign: "right"}}>
          <button onClick={() => { setData(null); setErr(""); setSelectedDate(null); setSelectedCollector(null); setSelectedClient(null); setSelectedBucket(null); }} style={{ background: tk.bgCard, border: `1px solid ${tk.borderMed}`, color: tk.textSub, borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 12, transition: "background 0.3s" }}>↩ Upload New File</button>
        </div> }
      
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: 24 }}>
        {!data && (
          <div style={{ maxWidth: 540, margin: "80px auto" }}>
            <div className="card">
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 22, marginBottom: 8, color: tk.textBright }}>Upload Collections File</div>
              <div style={{ fontSize: 13, color: tk.textMuted, marginBottom: 24 }}>
                Upload an Excel file (.xlsx/.xls) with a <code style={{ color: "#60a5fa", background: tk.bgCode, padding: "1px 5px", borderRadius: 4 }}>Status</code> column.
                Rows containing system remarks are automatically excluded.
              </div>
              <div className="dz"
                onClick={() => fRef.current.click()}
                onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = "#3b82f6"; }}
                onDragLeave={e => { e.currentTarget.style.borderColor = tk.borderMed; }}
                onDrop={e => { e.preventDefault(); e.currentTarget.style.borderColor = tk.borderMed; hf(e.dataTransfer.files[0]); }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📂</div>
                <div style={{ fontWeight: 600, fontSize: 15, color: tk.textPrimary }}>Drop your Excel file here</div>
                <div style={{ fontSize: 13, color: tk.textMuted, marginTop: 6 }}>or click to browse · .xlsx / .xls accepted</div>
              </div>
              <input ref={fRef} type="file" accept=".xlsx,.xls" onChange={e => hf(e.target.files[0])} />
              {loading && <div style={{ marginTop: 16, textAlign: "center", color: "#60a5fa", fontSize: 14 }}>⏳ Processing file...</div>}
              {err && <div style={{ marginTop: 16, background: isDark ? "#450a0a" : "#fef2f2", border: `1px solid ${isDark ? "#7f1d1d" : "#fecaca"}`, borderRadius: 8, padding: 12, color: isDark ? "#fca5a5" : "#dc2626", fontSize: 13 }}>{err}</div>}
              <div style={{ marginTop: 20, padding: "12px 16px", background: tk.bgSurface, borderRadius: 8, fontSize: 12, color: tk.textFaint }}>
                <div style={{ fontWeight: 600, color: tk.textMuted, marginBottom: 6 }}>Expected columns (auto-detected):</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {["Status","Account No.","Remark By","Remarks","PTP Amount","PTP Date","Claim Paid Amount","Claim Paid Date","Date","Time","Client","Old IC"].map(c => (
                    <span key={c} style={{ background: tk.bgCard, padding: "2px 8px", borderRadius: 4, color: tk.textSub }}>{c}</span>
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
              { l: "System Excluded", v: data.remarkExcludedCount.toLocaleString(), i: "🚫", c: tk.textSub, sub: "auto-filtered" },
              { l: "Valid Records", v: an.T.toLocaleString(), i: "✅", c: "#22c55e" },
              { l: "Clients", v: an.clientAnalytics ? an.clientAnalytics.clientList.length : "N/A", i: "🏢", c: "#a78bfa" },
              { l: "Unique Accounts", v: an.ua?.toLocaleString() ?? "N/A", i: "👤", c: "#f59e0b" },
              ...(an.fieldAnalytics ? [{ l: "Field Visits", v: an.fieldAnalytics.totalFieldVisits.toLocaleString(), i: "🚗", c: "#22c55e" }] : []),
              { l: "Collectors", v: an.cd.length, i: "👥", c: "#06b6d4" },
              { l: "Buckets", v: an.bucketAnalytics ? an.bucketAnalytics.bucketList.length : "N/A", i: "📍", c: "#f97316" },
              { l: "PTP Amount", v: "₱" + fN(an.pt), i: "💰", c: "#22c55e" },
              { l: "Claim Paid", v: "₱" + fN(an.ct), i: "💳", c: "#f97316" },
              { l: "Converstion Rate", v: an.pt > 0 ? ((an.ct / an.pt) * 100).toFixed(1) + "%" : "N/A", i: "📈", c: "#a21caf" },
              { l: "Field Rate", v: an.fieldAnalytics?.fieldRate != null ? an.fieldAnalytics.fieldRate + "%" : "N/A", i: "💹", c: "#06b6d4" }
            ].map(k => (
              <div key={k.l} className="sc">
                <div style={{ fontSize: 20, marginBottom: 6 }}>{k.i}</div>
                <div style={{ fontSize: 11, color: tk.textMuted, textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600 }}>{k.l}</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: k.c, fontFamily: "'Space Grotesk',sans-serif", marginTop: 2, wordBreak: "auto-phrase" }}>{k.v}</div>
                {k.sub && <div style={{ fontSize: 10, color: tk.textFaint, marginTop: 2 }}>{k.sub}</div>}
              </div>
            ))}
          </div>

          {/* Detected columns notice 
          <div style={{ background: isDark ? "#0f2a3f" : "#e0f2fe", border: `1px solid ${isDark ? "#1e4060" : "#bae6fd"}`, borderRadius: 8, padding: "8px 16px", marginBottom: 12, fontSize: 12, color: isDark ? "#7dd3fc" : "#0369a1", display: "flex", flexWrap: "wrap", gap: 12 }}>
            <span>🔍 Detected columns:</span>
            {data.datек && <span style={{ background: isDark ? "#1e3a5f" : "#dbeafe", padding: "1px 8px", borderRadius: 4 }}>📅 Date: <strong>{data.datек}</strong></span>}
            {data.timek && <span style={{ background: isDark ? "#1e3a5f" : "#dbeafe", padding: "1px 8px", borderRadius: 4 }}>⏰ Time: <strong>{data.timek}</strong></span>}
            {data.dtk && <span style={{ background: isDark ? "#1e3a5f" : "#dbeafe", padding: "1px 8px", borderRadius: 4 }}>📅⏰ DateTime: <strong>{data.dtk}</strong></span>}
            {data.clk && <span style={{ background: isDark ? "#1e3a5f" : "#dbeafe", padding: "1px 8px", borderRadius: 4 }}>🏢 Client: <strong>{data.clk}</strong></span>}
            {data.oick && <span style={{ background: isDark ? "#1e3a5f" : "#dbeafe", padding: "1px 8px", borderRadius: 4 }}>📍 Bucket/IC: <strong>{data.oick}</strong></span>}
            {!data.datек && !data.timek && !data.dtk && <span style={{ color: tk.textMuted }}>No date/time columns detected</span>}
            {!data.clk && <span style={{ color: tk.textMuted }}>No client column detected</span>}
            {!data.oick && <span style={{ color: tk.textMuted }}>No Old IC/Bucket column detected</span>}
          </div>
          

          {data.remarkExcludedCount > 0 && (
            <div style={{ background: tk.bgSurface, border: `1px solid ${tk.border}`, borderRadius: 8, padding: "10px 16px", marginBottom: 16, fontSize: 12, color: tk.textSub, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>🚫</span>
              <span><strong style={{ color: tk.textPrimary }}>{data.remarkExcludedCount.toLocaleString()} rows</strong> excluded — system-generated remarks</span>
            </div>
          )}
          */}
          {/* ── Client Filter Strip (shown when multiple clients exist) ── */}
          {data?.clients?.length > 1 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: tk.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>
                🏢 Viewing data for:
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["All", ...data.clients].map(cl => (
                  <button
                    key={cl}
                    onClick={() => { setActiveClientFilter(cl); setSelectedDate(null); setSelectedCollector(null); setSelectedBucket(null); }}
                    style={{
                      padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer",
                      border: activeClientFilter === cl ? "1px solid #3b82f6" : `1px solid ${tk.borderMed}`,
                      background: activeClientFilter === cl ? "#1e40af" : tk.border,
                      color: activeClientFilter === cl ? "#fff" : tk.textSub,
                      transition: "all .15s",
                    }}
                  >
                    {cl === "All" ? `🌐 All Clients (${data.clients.length})` : `🏢 ${cl}`}
                  </button>
                ))}
              </div>
              {activeClientFilter !== "All" && (
                <div style={{ marginTop: 6, fontSize: 11, color: "#f59e0b", background: isDark ? "#1c1400" : "#fffbeb", border: `1px solid ${isDark ? "#92400e" : "#fcd34d"}`, borderRadius: 6, padding: "4px 10px", display: "inline-block" }}>
                  ⚠️ All charts and tables below show data for <strong>{activeClientFilter}</strong> only.
                </div>
              )}
            </div>
          )}

          {/* ── Global Date Range Filter ── */}
          {(data?.datек || data?.dtk) && (() => {
            // Use _dateISO (YYYY-MM-DD) so it works correctly with input[type="date"]
            const allDatesISO = [...new Set(data.rows.map(r => r._dateISO).filter(Boolean))].sort();
            if (allDatesISO.length === 0) return null;
            const minISO = allDatesISO[0];
            const maxISO = allDatesISO[allDatesISO.length - 1];
            const hasFilter = !!(globalDateFrom || globalDateTo);
            return (
              <div style={{ marginBottom: 10, background: tk.bgCard, border: `1px solid ${hasFilter ? "#3b82f6" : tk.borderMed}`, borderRadius: 10, padding: "10px 16px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", transition: "border-color 0.2s" }}>
                <span style={{ fontSize: 12, color: tk.textSub, fontWeight: 600, flexShrink: 0 }}>📅 Date Range:</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <label style={{ fontSize: 12, color: tk.textMuted }}>From</label>
                  <input type="date" value={globalDateFrom} min={minISO} max={maxISO}
                    onChange={e => setGlobalDateFrom(e.target.value)}
                    style={{ background: tk.bgSurface, border: `1px solid ${tk.borderMed}`, borderRadius: 6, color: tk.textPrimary, fontSize: 12, padding: "4px 8px", fontFamily: "inherit", outline: "none", cursor: "pointer" }} />
                  <label style={{ fontSize: 12, color: tk.textMuted }}>To</label>
                  <input type="date" value={globalDateTo} min={minISO} max={maxISO}
                    onChange={e => setGlobalDateTo(e.target.value)}
                    style={{ background: tk.bgSurface, border: `1px solid ${tk.borderMed}`, borderRadius: 6, color: tk.textPrimary, fontSize: 12, padding: "4px 8px", fontFamily: "inherit", outline: "none", cursor: "pointer" }} />
                </div>
                {hasFilter && (
                  <button onClick={() => { setGlobalDateFrom(""); setGlobalDateTo(""); }}
                    style={{ fontSize: 11, padding: "3px 12px", borderRadius: 6, background: isDark ? "#172554" : "#dbeafe", border: "1px solid #3b82f6", color: "#60a5fa", cursor: "pointer", fontWeight: 600 }}>
                    ✕ Clear Filter
                  </button>
                )}
                <span style={{ fontSize: 11, color: hasFilter ? "#60a5fa" : tk.textFaint, marginLeft: 4 }}>
                  {hasFilter
                    ? `Showing ${an?.T?.toLocaleString() ?? 0} of ${data.rows.length.toLocaleString()} records · ${minISO} → ${maxISO}`
                    : `${allDatesISO.length} active dates · ${minISO} → ${maxISO}`}
                </span>
              </div>
            );
          })()}

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 8, background: tk.bgSurface, padding: 4, borderRadius: 12, width: "fit-content", flexWrap: "wrap" }}>
            {[
              ["overview", "📊 Overview"],
              ["status", "🏷️ Status Detail"],
              ["ptp", "💰 PTP & Claims"],
              ["funnel", "🔽 PTP Funnel"],
              ["touch", "📱 Touch Points"],
              ...(an.bucketAnalytics?.hasAccountData ? [["penetration", "🎯 Penetration"]] : []),
              ...(an?.fieldAnalytics ? [["field","🚗 Field Analytics"]] : []),
              ["collectors", "👥 Collectors"],
              ...(data?.ak ?? data?.dik ? [["timeline", "🕐 Account Timeline"]] : []),
              ...(an.dateAnalytics ? [["datetime", "📅 Date & Time"]] : []),
              ...(an?.monthlyAnalytics ? [["monthly","📆 Monthly"]] : []),
              // Only show combined Clients tab when viewing All
              ...(an.clientAnalytics && activeClientFilter === "All" ? [["clients", "🏢 Clients"]] : []),
              ...(an.bucketAnalytics ? [["buckets", "📍 Buckets"]] : []),
              ...(an.collectorBucketAnalytics ? [["colbucket", "👥📍 Collector × Bucket"]] : []),
              ...(an.bpAnalytics ? [["bp", "💔 Broken Promises"]] : []),
              ...(an.hourlyCollectorAnalytics ? [["hourly", "⏱️ Hourly Efforts"]] : []),
              ["predictive", "🔮 Predictive"],
            ].map(([t, l]) => (
              <button key={t} className={`tb${tab === t ? " ac" : ""}`} onClick={() => setTab(t)}>{l}</button>
            ))}
          </div>
          

          {/* ── Overview Tab ── */}
          {tab === "overview" && (() => {
            const ovTopCollectors = an.cd.slice(0, 5);
            const ovMonthly = an.monthlyAnalytics?.monthlySorted || [];
            const ovDateTrend = an.dateAnalytics?.dateSorted || [];
            const ovBuckets = an.bucketAnalytics?.bucketList || [];
            const ovClients = an.clientAnalytics?.clientList || [];
            const ovFieldVisits = an.fieldAnalytics?.bucketVisitData || [];
            const hasPTP = an.pt > 0 || an.pc > 0;
            const hasClaim = an.ct > 0 || an.cc > 0;
            const hasDate = ovDateTrend.length > 0;
            const hasMonthly = ovMonthly.length > 0;
            const hasField = ovFieldVisits.length > 0;
            const hasBuckets = ovBuckets.length > 0;
            const hasClients = ovClients.length > 1;
            const hasCollectors = ovTopCollectors.length > 0;

            const safeRate = (grp) => {
              const entry = an.gd.find(g => g.name === grp);
              return entry ? entry.pct + "%" : "N/A";
            };

            const rpcGroup = ["KEPT", "PTP", "RPC"];
            const rpcRate = rpcGroup.reduce((sum, grp) => {
              const entry = an.gd.find(g => g.name === grp);
              return sum + (entry ? Number(entry.pct) : 0);
            }, 0);

            const convRate = an.pt > 0 ? ((an.ct / an.pt) * 100).toFixed(1) + "%" : "N/A";

            const NoData = ({ label, icon = "📭", hint }) => (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:6, padding:"28px 16px", background:tk.bgSurface, borderRadius:8, border:`1px dashed ${tk.borderMed}`, textAlign:"center" }}>
                <span style={{ fontSize:24 }}>{icon}</span>
                <span style={{ fontSize:12, fontWeight:600, color:tk.textFaint }}>{label}</span>
                {hint && <span style={{ fontSize:11, color:tk.borderMed }}>{hint}</span>}
              </div>
            );

            return (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14 }}>

                {/* ── KPI strip ── */}
                {[
                  { l:"Conv. Rate",       v: convRate,                          c: an.pt > 0 ? "#a78bfa" : tk.textFaint, i:"📈", sub:"Claim / PTP" },
                  { l:"PTP Rate",         v:safeRate("PTP"),  c:"#f59e0b", i:"🤝", sub:"Promise to Pay" },
                  { l:"RPC Rate",         v:rpcRate > 0 ? rpcRate.toFixed(1) + "%" : "N/A",  c:"#3b82f6", i:"📞", sub:"Right Party Contact" },
                  { l:"NEG Rate",         v:safeRate("NEG"),  c:"#ef4444", i:"❌", sub:"Negative Outcome" },
                  { l:"PTP Amount",       v: hasPTP   ? "₱"+fN(an.pt) : "N/A", c: hasPTP   ? "#22c55e" : tk.textFaint, i:"💰", sub: hasPTP   ? an.pc+" records" : "No PTP column" },
                  { l:"Claim Paid",       v: hasClaim ? "₱"+fN(an.ct) : "N/A", c: hasClaim ? "#f97316" : tk.textFaint, i:"💳", sub: hasClaim ? an.cc+" records" : "No Claim column" },
                  ...(an.ua != null ? [{ l:"Unique Accounts", v:an.ua.toLocaleString(), c:"#06b6d4", i:"👤", sub:an.cd.length+" Collectors" }] : []),
                  ...(an.bpAnalytics ? [{ l:"Broken PTPs", v:an.bpAnalytics.bpAccounts.length.toLocaleString(), c:"#ef4444", i:"BP", sub:an.bpAnalytics.bpRate+"% BP rate" }] : []),
                ].map(k => (
                  <div key={k.l} className="sc">
                    <div style={{ fontSize:18, marginBottom:4 }}>{k.i}</div>
                    <div style={{ fontSize:10, color:tk.textMuted, textTransform:"uppercase", letterSpacing:".06em", fontWeight:600 }}>{k.l}</div>
                    <div style={{ fontSize:16, fontWeight:700, color:k.c, fontFamily:"'Space Grotesk',sans-serif", marginTop:2 }}>{k.v}</div>
                    <div style={{ fontSize:10, color:tk.textFaint, marginTop:2 }}>{k.sub}</div>
                  </div>
                ))}

                {/* ── Outcome Group pie ── */}
                <div className="card" style={{ gridColumn:"1/3" }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:6, color:tk.textBright }}>Outcome Group Distribution</div>
                  {an.gd.length > 0 ? (
                    <>
                      {(() => {
                        const neg = an.gd.find(g=>g.name==="NEG");
                        const rpc = an.gd.find(g=>g.name==="RPC");
                        const kept = an.gd.find(g=>g.name==="KEPT");
                        const negPct = parseFloat(neg?.pct||0);
                        return <Insight icon="🥧" color={negPct>60?"#ef4444":"#22c55e"} text={`${negPct>60?`⚠️ <strong>NEG (${neg?.pct}%)</strong> is dominant — most efforts are uncontactable. Consider updating contact info.`:`✅ <strong>RPC rate is ${rpc?.pct||0}%</strong> of total efforts.`} ${kept?`<strong>KEPT (${kept.pct}%)</strong> reflects honored promises — aim to grow this group.`:""}`} />;
                      })()}
                      <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                        <ResponsiveContainer width="55%" height={220}>
                          <PieChart>
                            <Pie data={an.gd} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({name,pct})=>`${name} ${pct}%`} labelLine={false}>
                              {an.gd.map((e,i)=><Cell key={i} fill={GC[e.name]||PC[i%PC.length]} />)}
                            </Pie>
                            <Tooltip formatter={(v,n,p)=>[`${v.toLocaleString()} (${p.payload.pct}%)`,n]} contentStyle={TS} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div style={{ flex:1 }}>
                          {an.gd.map(g=>(
                            <div key={g.name} style={{ marginBottom:8 }}>
                              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                                <span className="bdg" style={{ background:(GC[g.name]||"#3b82f6")+"33", color:GC[g.name]||tk.textSub }}>{g.name}</span>
                                <span style={{ fontSize:12, fontWeight:700, color:GC[g.name]||tk.textSub }}>{g.pct}%</span>
                              </div>
                              <Pb tk={tk} pct={parseFloat(g.pct)} c={GC[g.name]||"#3b82f6"} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : <NoData label="No outcome data" icon="🥧" hint="No recognised statuses for this filter" />}
                </div>

                {/* ── Touch Point Mix ── */}
                <div className="card" style={{ gridColumn:"3/5" }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:10, color:tk.textBright }}>Touch Point Mix</div>
                  {an.td.length > 0 ? (
                    <>
                      <Insight icon="📱" color="#3b82f6" text={`<strong>${an.td[0]?.name}</strong> is the most-used channel with <strong>${an.td[0]?.count?.toLocaleString()}</strong> efforts (${an.td[0]?.pct}% of total). ${an.td.length > 1 ? `Combined top-2 channels cover ${(parseFloat(an.td[0]?.pct||0)+parseFloat(an.td[1]?.pct||0)).toFixed(1)}% of all activity.` : ""}`} />
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={an.td} layout="vertical" margin={{ left:0, right:50 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                          <XAxis type="number" tick={{ fill:tk.textMuted, fontSize:10 }} />
                          <YAxis type="category" dataKey="name" tick={{ fill:tk.textSub, fontSize:10 }} width={120} />
                          <Tooltip contentStyle={TS} formatter={(v,n,p)=>[`${v.toLocaleString()} (${p.payload.pct}%)`,n]} />
                          <Bar dataKey="count" radius={[0,4,4,0]} label={{ position:"right", fill:tk.textMuted, fontSize:10, formatter:v=>v.toLocaleString() }}>
                            {an.td.map((e,i)=><Cell key={i} fill={TP_COLORS[e.name]||PC[i%PC.length]} />)}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </>
                  ) : <NoData label="No touch point data" icon="📱" hint="No effort records for this filter" />}
                </div>

                {/* ── Daily Efforts Trend ── */}
                <div className="card" style={{ gridColumn:"1/-1" }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:4, color:tk.textBright }}>Daily Efforts Trend</div>
                  {hasDate ? (
                    <>
                      {ovDateTrend.length > 0 && (() => {
                        const peak = ovDateTrend.reduce((a,b)=>b.total>a.total?b:a, ovDateTrend[0]);
                        const avg = (ovDateTrend.reduce((s,d)=>s+d.total,0)/ovDateTrend.length).toFixed(0);
                        return <Insight icon="📈" color="#3b82f6" text={`Peak day: <strong>${peak?.date}</strong> with <strong>${peak?.total?.toLocaleString()}</strong> efforts. Daily average: <strong>${parseInt(avg).toLocaleString()}</strong> efforts. Days far below average may indicate low activity periods worth investigating.`} />;
                      })()}
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={ovDateTrend} margin={{ left:0, right:16, bottom: ovDateTrend.length>20?60:16 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                          <XAxis dataKey="date" tick={{ fill:tk.textMuted, fontSize:10 }} angle={ovDateTrend.length>15?-35:0} textAnchor={ovDateTrend.length>15?"end":"middle"} interval={ovDateTrend.length>30?Math.floor(ovDateTrend.length/20):0} />
                          <YAxis tick={{ fill:tk.textMuted, fontSize:11 }} />
                          <Tooltip contentStyle={TS} />
                          <Legend wrapperStyle={{ fontSize:11 }} />
                          {SG_GROUPS.map(sg=><Bar key={sg} dataKey={sg} stackId="a" fill={GC[sg]||tk.textMuted} name={sg} />)}
                        </BarChart>
                      </ResponsiveContainer>
                    </>
                  ) : <NoData label="No date data available" icon="📅" hint="Upload a file with a Date column to see this chart" />}
                </div>

                {/* ── Monthly Trend ── */}
                <div className="card" style={{ gridColumn:"1/-1" }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:4, color:tk.textBright }}>Monthly Efforts Trend</div>
                  {hasMonthly ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={ovMonthly} margin={{ left:0, right:16, bottom: ovMonthly.length>6?40:10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                        <XAxis dataKey="month" tick={{ fill:tk.textMuted, fontSize:10 }} angle={-20} textAnchor="end" interval={0} />
                        <YAxis tick={{ fill:tk.textMuted, fontSize:11 }} />
                        <Tooltip contentStyle={TS} />
                        <Legend wrapperStyle={{ fontSize:11 }} />
                        {SG_GROUPS.map(sg=><Bar key={sg} dataKey={sg} stackId="a" fill={GC[sg]||tk.textMuted} name={sg} />)}
                      </BarChart>
                    </ResponsiveContainer>
                  ) : <NoData label="No monthly data" icon="📆" hint="Requires a Date column with multiple months" />}
                </div>

                {/* ── Field Visits by Bucket ── */}
                <div className="card" style={{ gridColumn:"1/3" }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:10, color:"#f9fafb" }}>Field Visits by Bucket</div>
                  {hasField ? (
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={ovFieldVisits} margin={{ left:0, right:16, bottom: ovFieldVisits.length>4?40:10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                        <XAxis dataKey="name" tick={{ fill:"#6b7280",fontSize:11 }} angle={-20} textAnchor="end" interval={0} />
                        <YAxis tick={{ fill:"#6b7280",fontSize:11 }} />
                        <Tooltip contentStyle={TS} formatter={v=>[v.toLocaleString()+" visits"]} />
                        <Line type="monotone" dataKey="visits" stroke="#22c55e" strokeWidth={2.5} dot={{ r:4,fill:"#22c55e" }} name="Field Visits" />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : <NoData label="No field visit data" icon="🚗" hint="No FIELD touch point records for this filter" />}
                </div>

                {/* ── Top 10 Statuses ── */}
                <div className="card" style={{ gridColumn:"3/5" }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:8, color:tk.textBright }}>Top 10 Statuses</div>
                  {an.sd.length > 0 ? (
                    <>
                      <Insight icon="🏷️" color="#a78bfa" text={`<strong>${an.sd[0]?.status}</strong> leads with <strong>${an.sd[0]?.count?.toLocaleString()}</strong> records (${an.sd[0]?.pct}%). ${an.sd[0]?.grp ? `Classified as <strong>${an.sd[0]?.grp}</strong>.` : ""} Top 10 cover ${(an.sd.slice(0,10).reduce((s,x)=>s+parseFloat(x.pct||0),0)).toFixed(1)}% of all activity.`} />
                      <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={an.sd.slice(0,10)} layout="vertical" margin={{ left:0, right:50 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                          <XAxis type="number" tick={{ fill:tk.textMuted, fontSize:10 }} />
                          <YAxis type="category" dataKey="status" tick={{ fill:tk.textSub, fontSize:9 }} width={170} />
                          <Tooltip contentStyle={TS} />
                          <Bar dataKey="count" radius={[0,4,4,0]} label={{ position:"right", fill:tk.textMuted, fontSize:10, formatter:v=>v.toLocaleString() }}>
                            {an.sd.slice(0,10).map((e,i)=><Cell key={i} fill={GC[e.grp]||PC[i%PC.length]} />)}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </>
                  ) : <NoData label="No status data" icon="🏷️" hint="No recognised statuses for this filter" />}
                </div>

                {/* ── Top 5 Collectors ── */}
                <div className="card" style={{ gridColumn:"1/3" }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:4, color:tk.textBright }}>Top 5 Collectors</div>
                  {hasCollectors ? (
                    <>
                      <Insight icon="👥" color="#06b6d4" text={`<strong>${ovTopCollectors[0]?.name}</strong> is the top performer with <strong>${ovTopCollectors[0]?.total?.toLocaleString()}</strong> efforts. ${ovTopCollectors.length > 1 ? `The top 2 collectors together contribute ${((ovTopCollectors[0].total+ovTopCollectors[1].total)/an.T*100).toFixed(1)}% of all records.` : ""}`} />
                      {ovTopCollectors.map((c,i)=>(
                        <div key={c.name} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                          <div style={{ width:22, height:22, borderRadius:"50%", background:PC[i%PC.length]+"33", color:PC[i%PC.length], fontSize:11, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{i+1}</div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:12, fontWeight:600, color:tk.textPrimary, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{c.name}</div>
                            <div style={{ height:4, background:tk.bgSurface, borderRadius:2, marginTop:3, overflow:"hidden" }}>
                              <div style={{ height:"100%", borderRadius:2, width:`${Math.min((c.total/ovTopCollectors[0].total)*100,100)}%`, background:PC[i%PC.length] }} />
                            </div>
                          </div>
                          <div style={{ fontSize:12, fontWeight:700, color:PC[i%PC.length], flexShrink:0 }}>{c.total.toLocaleString()}</div>
                        </div>
                      ))}
                    </>
                  ) : <NoData label="No collector data" icon="👥" hint="No Remark By column detected" />}
                </div>

                {/* ── Efforts by Bucket ── */}
                <div className="card" style={{ gridColumn:"3/5" }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:8, color:tk.textBright }}>Efforts by Bucket</div>
                  {hasBuckets ? (
                    <>
                      {hasBuckets && ovBuckets.length > 0 && <Insight icon="📍" color="#f97316" text={`<strong>${ovBuckets[0]?.name}</strong> has the highest workload with <strong>${ovBuckets[0]?.total?.toLocaleString()}</strong> efforts. ${ovBuckets.length > 1 ? 'The top bucket alone represents ' + ((ovBuckets[0].total / an.T)*100).toFixed(1) + '% of all records.' : ''} Review lower-volume buckets — they may need more collection attention.`} />}
                      <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={ovBuckets} layout="vertical" margin={{ left:0, right:50 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                          <XAxis type="number" tick={{ fill:tk.textMuted, fontSize:10 }} />
                          <YAxis type="category" dataKey="name" tick={{ fill:tk.textSub, fontSize:10 }} width={110} />
                          <Tooltip contentStyle={TS} formatter={(v,n,p)=>[v.toLocaleString(),p.payload.name]} />
                          <Bar dataKey="total" radius={[0,4,4,0]} label={{ position:"right", fill:tk.textMuted, fontSize:10, formatter:v=>v.toLocaleString() }}>
                            {ovBuckets.map(b=><Cell key={b.name} fill={BUCKET_COLORS[b.name]||tk.textMuted} />)}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </>
                  ) : <NoData label="No bucket data" icon="📍" hint="No Old IC / Placement column detected" />}
                </div>

                {/* ── Client Volume Mix (only when truly multi-client) ── */}
                {hasClients && (
                  <div className="card" style={{ gridColumn:"1/-1" }}>
                    <div style={{ fontWeight:700, fontSize:14, marginBottom:10, color:tk.textBright }}>Client Volume with Outcome Mix</div>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={ovClients.slice(0,10).map(c=>({ name:c.name, ...c.bySG }))} margin={{ bottom: ovClients.length>6?60:20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                        <XAxis dataKey="name" tick={{ fill:tk.textMuted, fontSize:10 }} angle={ovClients.length>5?-25:0} textAnchor={ovClients.length>5?"end":"middle"} interval={0} />
                        <YAxis tick={{ fill:tk.textMuted, fontSize:11 }} />
                        <Tooltip contentStyle={TS} />
                        <Legend wrapperStyle={{ fontSize:11 }} />
                        {SG_GROUPS.map(sg=><Bar key={sg} dataKey={sg} stackId="a" fill={GC[sg]||tk.textMuted} name={sg} />)}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* ── PTP + Claim summary row ── */}
                <div className="card" style={{ gridColumn:"1/-1", display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:12 }}>
                  <div>
                    <div style={{ fontSize:11, color:tk.textMuted, fontWeight:600, textTransform:"uppercase" }}>PTP Records</div>
                    {hasPTP
                      ? <div style={{ fontSize:24, fontWeight:700, color:"#f59e0b", fontFamily:"'Space Grotesk',sans-serif" }}>{an.pc.toLocaleString()}</div>
                      : <div style={{ fontSize:16, fontWeight:600, color:tk.textFaint }}>N/A</div>}
                    {!hasPTP && <div style={{ fontSize:11, color:tk.borderMed, marginTop:2 }}>No PTP Amount column</div>}
                  </div>
                  <div>
                    <div style={{ fontSize:11, color:tk.textMuted, fontWeight:600, textTransform:"uppercase" }}>Total PTP Amount</div>
                    {hasPTP
                      ? <div style={{ fontSize:22, fontWeight:700, color:"#22c55e", fontFamily:"'Space Grotesk',sans-serif" }}>₱{fN(an.pt)}</div>
                      : <div style={{ fontSize:16, fontWeight:600, color:tk.textFaint }}>N/A</div>}
                  </div>
                  <div>
                    <div style={{ fontSize:11, color:tk.textMuted, fontWeight:600, textTransform:"uppercase" }}>Claim Paid Records</div>
                    {hasClaim
                      ? <div style={{ fontSize:24, fontWeight:700, color:"#f97316", fontFamily:"'Space Grotesk',sans-serif" }}>{an.cc.toLocaleString()}</div>
                      : <div style={{ fontSize:16, fontWeight:600, color:tk.textFaint }}>N/A</div>}
                    {!hasClaim && <div style={{ fontSize:11, color:tk.borderMed, marginTop:2 }}>No Claim Paid column</div>}
                  </div>
                  <div>
                    <div style={{ fontSize:11, color:tk.textMuted, fontWeight:600, textTransform:"uppercase" }}>Total Claim Amount</div>
                    {hasClaim
                      ? <div style={{ fontSize:22, fontWeight:700, color:"#06b6d4", fontFamily:"'Space Grotesk',sans-serif" }}>₱{fN(an.ct)}</div>
                      : <div style={{ fontSize:16, fontWeight:600, color:tk.textFaint }}>N/A</div>}
                  </div>
                </div>

              </div>
            );
          })()}

          {/* ── Status Detail Tab ── */}
          {tab === "status" && (() => {
            const SI = mkIcon(statusSort);
            const ssd = sortFilter(an.sd, statusSort, statusSearch, ["status", "grp", "tp"]);
            return (
              <div className="card">
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8, marginBottom:4 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: tk.textBright }}>Status Detail — {an.sd.length} Valid Statuses Found</div>
                  <ExportBtn onClick={() => exportXlsx(ssd.map(s=>({ Status:s.status, Group:s.grp, "Touch Point":s.tp, Count:s.count, "Pct%":s.pct })), "status_detail.xlsx")} />
                </div>
                <div style={{ fontSize: 12, color: tk.textMuted, marginBottom: 10 }}>Only statuses present in your file are shown.</div>
                <SearchBar tk={tk} value={statusSearch} onChange={setStatusSearch} placeholder="Filter by status, group, or touch point..." />
                <div style={{ fontSize: 12, color: tk.textFaint, marginBottom: 8 }}>{ssd.length} of {an.sd.length} statuses shown</div>
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
                      <td style={{ color: tk.textFaint }}>{i + 1}</td>
                      <td style={{ fontWeight: 500, color: tk.textPrimary }}>{s.status}</td>
                      <td><span className="bdg" style={{ background: (GC[s.grp] || "#3b82f6") + "33", color: GC[s.grp] || tk.textSub }}>{s.grp}</span></td>
                      <td style={{ color: tk.textSub }}>{s.tp}</td>
                      <td style={{ fontWeight: 600, color: tk.textBright }}>{s.count.toLocaleString()}</td>
                      <td style={{ color: "#60a5fa" }}>{s.pct}%</td>
                      <td><Pb tk={tk} pct={parseFloat(s.pct)} c={GC[s.grp] || "#3b82f6"} /></td>
                    </tr>)}</tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {/* ── Collectors Tab ── */}
          {tab === "collectors" && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="card" style={{ gridColumn: "1/-1" }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: tk.textBright }}>Top 20 Collectors by Total Efforts</div>
              {an.cd.length === 0
                ? <div style={{ color: tk.textMuted, fontSize: 13, marginTop: 8 }}>No "Remark By" column detected.</div>
                : <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={an.cd.slice(0, 20)} margin={{ bottom: 90 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                    <XAxis dataKey="name" tick={{ fill: tk.textMuted, fontSize: 10 }} angle={-40} textAnchor="end" interval={0} />
                    <YAxis tick={{ fill: tk.textMuted, fontSize: 11 }} />
                    <Tooltip contentStyle={TS} />
                    <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Efforts" />
                  </BarChart>
                </ResponsiveContainer>}
            </div>
            {an.cd.length > 0 && <>
              <div className="card" style={{ gridColumn: "1/-1" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8, marginBottom:4 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: tk.textBright }}>Collector Efforts with Touch Point Breakdown</div>
                  <ExportBtn onClick={() => {
                    const tps = ALL_TP.filter(tp => an.cd.some(c => c.byTP[tp]));
                    exportXlsx(an.cd.map(c => {
                      const row = { Collector:c.name, Total:c.total, "% Share":((c.total/an.T)*100).toFixed(1) };
                      tps.forEach(tp => { row[tp] = c.byTP[tp]||0; });
                      SG_GROUPS.forEach(sg => { row[`SG_${sg}`] = c.bySG[sg]||0; });
                      return row;
                    }), "collectors.xlsx");
                  }} />
                </div>
                <div style={{ fontSize: 12, color: tk.textMuted, marginBottom: 8 }}>
                  Click a row to drill down.
                  {selectedCollector && <button onClick={() => setSelectedCollector(null)} style={{ marginLeft: 12, background: tk.borderMed, border: "none", color: tk.textSub, borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 11 }}>x Clear</button>}
                </div>
                <SearchBar tk={tk} value={collectorSearch} onChange={setCollectorSearch} placeholder="Filter by collector name..." />
                {(() => {
                  const CI = mkIcon(collectorSort);
                  const activeTPs = ALL_TP.filter(tp => an.cd.some(col => col.byTP[tp]));
                  const filteredCD = sortFilter(an.cd.map(c => ({ ...c, pctShare: ((c.total / an.T) * 100).toFixed(1) })), collectorSort, collectorSearch, ["name"]);
                  return (
                    <div style={{ overflowX: "auto", maxHeight: 420, overflowY: "auto" }}>
                      <div style={{ fontSize: 12, color: tk.textFaint, marginBottom: 6 }}>{filteredCD.length} of {an.cd.length} collectors shown</div>
                      <table>
                        <thead><tr>
                          <th>#</th>
                          <th onClick={() => mkSort(collectorSort, setCollectorSort)("name")} style={{ cursor: "pointer", userSelect: "none" }}>Collector <CI col="name" /></th>
                          <th onClick={() => mkSort(collectorSort, setCollectorSort)("total")} style={{ cursor: "pointer", userSelect: "none" }}>Total <CI col="total" /></th>
                          <th onClick={() => mkSort(collectorSort, setCollectorSort)("pctShare")} style={{ cursor: "pointer", userSelect: "none" }}>% Share <CI col="pctShare" /></th>
                          {activeTPs.map(tp => <th key={tp} style={{ color: TP_COLORS[tp] || tk.textSub }}>{tp}</th>)}
                          <th style={{ width: 100 }}>Bar</th>
                        </tr></thead>
                        <tbody>{filteredCD.map((c, i) => (
                          <tr key={c.name} className={`dr${selectedCollector === c.name ? " sel" : ""}`} onClick={() => setSelectedCollector(selectedCollector === c.name ? null : c.name)}>
                            <td style={{ color: tk.textFaint }}>{i + 1}</td>
                            <td style={{ fontWeight: 600, color: tk.textPrimary }}>{c.name}</td>
                            <td style={{ fontWeight: 700, color: "#22c55e" }}>{c.total.toLocaleString()}</td>
                            <td style={{ color: "#60a5fa" }}>{c.pctShare}%</td>
                            {activeTPs.map(tp => <td key={tp} style={{ color: TP_COLORS[tp] || tk.textSub }}>{(c.byTP[tp] || 0).toLocaleString()}</td>)}
                            <td><Pb tk={tk} pct={(c.total / an.cd[0].total) * 100} c="#3b82f6" /></td>
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
                    <div style={{ fontWeight: 700, fontSize: 14, color: tk.textBright }}>👤 {selectedCollector} — Detailed Breakdown</div>
                    <span style={{ background: isDark ? "#172554" : "#dbeafe", color: isDark ? "#60a5fa" : "#2563eb", borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 600 }}>{selectedCollectorData.total.toLocaleString()} total efforts</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: tk.textSub, marginBottom: 8 }}>By Touch Point</div>
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
                      <div style={{ fontWeight: 600, fontSize: 13, color: tk.textSub, marginBottom: 8 }}>By Outcome Group</div>
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
                      <div style={{ fontWeight: 600, fontSize: 13, color: tk.textSub, marginBottom: 8 }}>Touch Point Details</div>
                      <table>
                        <thead><tr><th>Touch Point</th><th>Count</th><th>%</th></tr></thead>
                        <tbody>{Object.entries(selectedCollectorData.byTP).sort((a, b) => b[1] - a[1]).map(([tp, cnt]) => (
                          <tr key={tp}><td style={{ color: TP_COLORS[tp] || tk.textSub, fontWeight: 500 }}>{tp}</td><td style={{ fontWeight: 700 }}>{cnt.toLocaleString()}</td><td style={{ color: "#60a5fa" }}>{((cnt / selectedCollectorData.total) * 100).toFixed(1)}%</td></tr>
                        ))}</tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              <div className="card" style={{ gridColumn: "1/-1" }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: tk.textBright }}>Top 15 Collectors — Touch Point Mix</div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={an.cd.slice(0, 15).map(c => ({ name: c.name, ...c.byTP }))} margin={{ bottom: 90 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                    <XAxis dataKey="name" tick={{ fill: tk.textMuted, fontSize: 10 }} angle={-40} textAnchor="end" interval={0} />
                    <YAxis tick={{ fill: tk.textMuted, fontSize: 11 }} />
                    <Tooltip contentStyle={TS} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    {ALL_TP.filter(tp => an.cd.some(c => c.byTP[tp])).map(tp => <Bar key={tp} dataKey={tp} stackId="a" fill={TP_COLORS[tp] || tk.textMuted} name={tp} />)}
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="card" style={{ gridColumn: "1/-1" }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: tk.textBright }}>Top 15 Collectors — Outcome Group Mix</div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={an.cd.slice(0, 15).map(c => ({ name: c.name, ...c.bySG }))} margin={{ bottom: 90 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                    <XAxis dataKey="name" tick={{ fill: tk.textMuted, fontSize: 10 }} angle={-40} textAnchor="end" interval={0} />
                    <YAxis tick={{ fill: tk.textMuted, fontSize: 11 }} />
                    <Tooltip contentStyle={TS} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    {SG_GROUPS.map(sg => <Bar key={sg} dataKey={sg} stackId="b" fill={GC[sg] || tk.textMuted} name={sg} />)}
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
              <div style={{ fontSize: 12, color: tk.textMuted, textTransform: "uppercase", letterSpacing: ".05em", fontWeight: 600 }}>{k.l}</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 26, fontWeight: 700, color: k.c, marginTop: 4 }}>{k.v}</div>
              {k.s && <div style={{ fontSize: 12, color: tk.textFaint, marginTop: 4 }}>{k.s}</div>}
            </div>)}
            {an.pdd.length > 0 && <div className="card" style={{ gridColumn: "1/-1" }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: tk.textBright }}>PTP Date Trend (Last 15 Dates)</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={an.pdd} margin={{ bottom: 70 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                  <XAxis dataKey="date" tick={{ fill: tk.textMuted, fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
                  <YAxis tick={{ fill: tk.textMuted, fontSize: 11 }} />
                  <Tooltip contentStyle={TS} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="PTP Records" />
                </BarChart>
              </ResponsiveContainer>
            </div>}
            {an.cdd.length > 0 && <div className="card" style={{ gridColumn: "1/-1" }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: tk.textBright }}>Claim Paid Date Trend (Last 15 Dates)</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={an.cdd} margin={{ bottom: 70 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                  <XAxis dataKey="date" tick={{ fill: tk.textMuted, fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
                  <YAxis tick={{ fill: tk.textMuted, fontSize: 11 }} />
                  <Tooltip contentStyle={TS} />
                  <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} name="Claim Records" />
                </BarChart>
              </ResponsiveContainer>
            </div>}

            {/* ── PTP & Claim by Bucket ── */}
            {an.ptpClaimByBucket && (() => {
              const { ptpClaimSummary, ptpTrend, claimTrend, ptpBucketNames, claimBucketNames } = an.ptpClaimByBucket;
              return (<>
                {/* Summary table */}
                <div className="card" style={{ gridColumn: "1/-1" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: tk.textBright }}>📍 PTP &amp; Claim Summary by Bucket</div>
                  <div style={{ fontSize: 12, color: tk.textMuted, marginBottom: 14 }}>Number of PTPs and Claim Paid per bucket — count and amount.</div>
                  <div style={{ overflowX: "auto" }}>
                    <table>
                      <thead><tr>
                        <th>Bucket</th>
                        <th style={{ color: "#f59e0b" }}>PTP #</th>
                        <th style={{ color: "#22c55e" }}>PTP Amount</th>
                        <th style={{ color: "#f97316" }}>Claim Paid #</th>
                        <th style={{ color: "#06b6d4" }}>Claim Amount</th>
                        <th style={{ color: "#a78bfa" }}>Conv. Rate</th>
                        <th style={{ width: 120 }}>PTP Bar</th>
                      </tr></thead>
                      <tbody>{ptpClaimSummary.map((r, i) => {
                        const convRate = r.ptpCount > 0 ? ((r.claimCount / r.ptpCount) * 100).toFixed(1) : "0.0";
                        const maxPTP = Math.max(...ptpClaimSummary.map(x => x.ptpCount));
                        return (
                          <tr key={r.bucket}>
                            <td><span className="bdg" style={{ background: (BUCKET_COLORS[r.bucket] || tk.textMuted) + "33", color: BUCKET_COLORS[r.bucket] || tk.textSub }}>{r.bucket}</span></td>
                            <td style={{ fontWeight: 700, color: "#f59e0b" }}>{r.ptpCount.toLocaleString()}</td>
                            <td style={{ color: "#22c55e", fontSize: 12 }}>₱{fN(r.ptpAmt)}</td>
                            <td style={{ fontWeight: 700, color: "#f97316" }}>{r.claimCount.toLocaleString()}</td>
                            <td style={{ color: "#06b6d4", fontSize: 12 }}>₱{fN(r.claimAmt)}</td>
                            <td style={{ color: "#a78bfa", fontWeight: 600 }}>{convRate}%</td>
                            <td><Pb tk={tk} pct={maxPTP > 0 ? (r.ptpCount / maxPTP) * 100 : 0} c={BUCKET_COLORS[r.bucket] || "#f59e0b"} /></td>
                          </tr>
                        );
                      })}</tbody>
                    </table>
                  </div>
                </div>

                {/* PTP count grouped bar by bucket */}
                {ptpClaimSummary.some(r => r.ptpCount > 0) && (
                  <div className="card" style={{ gridColumn: "1/2" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: tk.textBright }}>PTP Count by Bucket</div>
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={ptpClaimSummary} layout="vertical" margin={{ left: 0, right: 50 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                        <XAxis type="number" tick={{ fill: tk.textMuted, fontSize: 11 }} />
                        <YAxis type="category" dataKey="bucket" tick={{ fill: tk.textSub, fontSize: 11 }} width={110} />
                        <Tooltip contentStyle={TS} formatter={v => [v.toLocaleString(), "PTP Count"]} />
                        <Bar dataKey="ptpCount" radius={[0, 4, 4, 0]} name="PTP Count" label={{ position:"right", fill:tk.textMuted, fontSize:10, formatter:v=>v>0?v.toLocaleString():"" }}>
                          {ptpClaimSummary.map(r => <Cell key={r.bucket} fill={BUCKET_COLORS[r.bucket] || "#f59e0b"} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Claim count by bucket */}
                {ptpClaimSummary.some(r => r.claimCount > 0) && (
                  <div className="card" style={{ gridColumn: "2/3" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: tk.textBright }}>Claim Paid Count by Bucket</div>
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={ptpClaimSummary} layout="vertical" margin={{ left: 0, right: 50 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                        <XAxis type="number" tick={{ fill: tk.textMuted, fontSize: 11 }} />
                        <YAxis type="category" dataKey="bucket" tick={{ fill: tk.textSub, fontSize: 11 }} width={110} />
                        <Tooltip contentStyle={TS} formatter={v => [v.toLocaleString(), "Claim Count"]} />
                        <Bar dataKey="claimCount" radius={[0, 4, 4, 0]} name="Claim Count" label={{ position:"right", fill:tk.textMuted, fontSize:10, formatter:v=>v>0?v.toLocaleString():"" }}>
                          {ptpClaimSummary.map(r => <Cell key={r.bucket} fill={BUCKET_COLORS[r.bucket] || "#f97316"} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* PTP trend by bucket (multi-line) */}
                {ptpTrend.length > 0 && (
                  <div className="card" style={{ gridColumn: "1/-1" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: tk.textBright }}>📈 PTP Count Trend by Bucket</div>
                    <div style={{ fontSize: 12, color: tk.textMuted, marginBottom: 12 }}>Daily PTP counts broken down by bucket.</div>
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart data={ptpTrend} margin={{ left: 0, right: 16, bottom: ptpTrend.length > 20 ? 70 : 30 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                        <XAxis dataKey="date" tick={{ fill: tk.textMuted, fontSize: 10 }} angle={ptpTrend.length > 15 ? -35 : 0} textAnchor={ptpTrend.length > 15 ? "end" : "middle"} interval={ptpTrend.length > 30 ? Math.floor(ptpTrend.length / 20) : 0} />
                        <YAxis tick={{ fill: tk.textMuted, fontSize: 11 }} />
                        <Tooltip contentStyle={TS} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        {ptpBucketNames.map(b => (
                          <Line key={b} type="monotone" dataKey={b} stroke={BUCKET_COLORS[b] || tk.textMuted} strokeWidth={2} dot={ptpTrend.length < 40} name={b} />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Claim trend by bucket */}
                {claimTrend.length > 0 && (
                  <div className="card" style={{ gridColumn: "1/-1" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: tk.textBright }}>📈 Claim Paid Count Trend by Bucket</div>
                    <div style={{ fontSize: 12, color: tk.textMuted, marginBottom: 12 }}>Daily Claim Paid counts broken down by bucket.</div>
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart data={claimTrend} margin={{ left: 0, right: 16, bottom: claimTrend.length > 20 ? 70 : 30 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                        <XAxis dataKey="date" tick={{ fill: tk.textMuted, fontSize: 10 }} angle={claimTrend.length > 15 ? -35 : 0} textAnchor={claimTrend.length > 15 ? "end" : "middle"} interval={claimTrend.length > 30 ? Math.floor(claimTrend.length / 20) : 0} />
                        <YAxis tick={{ fill: tk.textMuted, fontSize: 11 }} />
                        <Tooltip contentStyle={TS} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        {claimBucketNames.map(b => (
                          <Line key={b} type="monotone" dataKey={b} stroke={BUCKET_COLORS[b] || tk.textMuted} strokeWidth={2} dot={claimTrend.length < 40} name={b} />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </>);
            })()}
          </div>}

          {/* ── Touch Points Tab ── */}
          {tab === "touch" && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="card">
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: tk.textBright }}>Touch Point Distribution</div>
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
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: tk.textBright }}>Efforts by Touch Point</div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={an.td} layout="vertical" margin={{ left: 0, right: 55 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                  <XAxis type="number" tick={{ fill: tk.textMuted, fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fill: tk.textSub, fontSize: 11 }} width={130} />
                  <Tooltip contentStyle={TS} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} label={{ position:"right", fill:tk.textMuted, fontSize:10, formatter:v=>v.toLocaleString() }}>
                    {an.td.map((e, i) => <Cell key={i} fill={TP_COLORS[e.name] || PC[i % PC.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card" style={{ gridColumn: "1/-1" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8, marginBottom:8 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: tk.textBright }}>Touch Point Summary</div>
                <ExportBtn onClick={() => exportXlsx(an.td.map(t=>({ "Touch Point":t.name, Efforts:t.count, "Pct%":t.pct })), "touch_points.xlsx")} />
              </div>
              <SearchBar tk={tk} value={touchSearch} onChange={setTouchSearch} placeholder="Filter by touch point..." />
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
                      <td style={{ fontWeight: 500, color: tk.textPrimary }}>{t.name}</td>
                      <td style={{ fontWeight: 700, color: TP_COLORS[t.name] || PC[i % PC.length] }}>{t.count.toLocaleString()}</td>
                      <td>{t.pct}%</td>
                      <td><Pb tk={tk} pct={parseFloat(t.pct)} c={TP_COLORS[t.name] || PC[i % PC.length]} /></td>
                    </tr>)}</tbody>
                  </table>
                );
              })()}
            </div>

            {/* ── TP × Outcome Group Frequency ── */}
            {an.tpBySG && (
              <div className="card" style={{ gridColumn: "1/-1" }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: tk.textBright }}>📊 Most Frequent Touch Point per Outcome Group</div>
                <div style={{ fontSize: 12, color: tk.textMuted, marginBottom: 14 }}>
                  Which channel drives each outcome most — especially PTP &amp; KEPT conversions.
                </div>
                {/* Grouped horizontal bar — one panel per outcome group */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
                  {SG_GROUPS.map(sg => {
                    const rows = an.tpBySG[sg] || [];
                    if (!rows.length) return null;
                    const top = rows[0];
                    const sgTotal = rows.reduce((s, r) => s + r.count, 0);
                    return (
                      <div key={sg} style={{
                        background: (GC[sg] || tk.borderMed) + "11",
                        border: `1px solid ${(GC[sg] || tk.borderMed)}44`,
                        borderRadius: 10, padding: "14px 16px"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                          <span className="bdg" style={{ background: (GC[sg] || tk.borderMed) + "33", color: GC[sg] || tk.textSub, fontSize: 13 }}>{sg}</span>
                          <span style={{ fontSize: 11, color: tk.textMuted }}>{sgTotal.toLocaleString()} records</span>
                        </div>
                        {/* Top channel highlight */}
                        <div style={{ marginBottom: 10, padding: "8px 10px", background: (TP_COLORS[top.tp] || "#3b82f6") + "18", borderRadius: 7, border: `1px solid ${(TP_COLORS[top.tp] || "#3b82f6")}33` }}>
                          <div style={{ fontSize: 10, color: tk.textMuted, marginBottom: 2 }}>TOP CHANNEL</div>
                          <div style={{ fontWeight: 700, color: TP_COLORS[top.tp] || "#3b82f6", fontSize: 13 }}>{top.tp}</div>
                          <div style={{ fontSize: 11, color: tk.textSub, marginTop: 1 }}>{top.count.toLocaleString()} · {top.pct}%</div>
                        </div>
                        {/* Mini bar chart */}
                        {rows.slice(0, 5).map((r, i) => (
                          <div key={r.tp} style={{ marginBottom: 5 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                              <span style={{ fontSize: 11, color: TP_COLORS[r.tp] || tk.textSub, fontWeight: i === 0 ? 700 : 400 }}>{r.tp}</span>
                              <span style={{ fontSize: 11, color: tk.textMuted }}>{r.pct}%</span>
                            </div>
                            <div style={{ height: 5, background: tk.bgSurface, borderRadius: 3, overflow: "hidden" }}>
                              <div style={{ height: "100%", borderRadius: 3, width: `${Math.min(parseFloat(r.pct), 100)}%`, background: TP_COLORS[r.tp] || PC[i % PC.length], opacity: i === 0 ? 1 : 0.6 }} />
                            </div>
                          </div>
                        ))}
                        {rows.length > 5 && <div style={{ fontSize: 10, color: tk.textFaint, marginTop: 4 }}>+{rows.length - 5} more channels</div>}
                      </div>
                    );
                  })}
                </div>

                {/* Full grouped bar chart */}
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: tk.textSub, marginBottom: 12 }}>Touch Point Volume by Outcome Group</div>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart
                      data={ALL_TP.filter(tp => an.td.some(t => t.name === tp)).map(tp => {
                        const row = { tp };
                        SG_GROUPS.forEach(sg => {
                          row[sg] = (an.tpBySG[sg]?.find(r => r.tp === tp)?.count) || 0;
                        });
                        return row;
                      })}
                      margin={{ bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                      <XAxis dataKey="tp" tick={{ fill: tk.textMuted, fontSize: 10 }} angle={-30} textAnchor="end" interval={0} />
                      <YAxis tick={{ fill: tk.textMuted, fontSize: 11 }} />
                      <Tooltip contentStyle={TS} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      {SG_GROUPS.map(sg => <Bar key={sg} dataKey={sg} stackId="a" fill={GC[sg] || tk.textMuted} name={sg} />)}
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Detailed table: TP × SG */}
                <div style={{ overflowX: "auto" }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: tk.textSub, marginBottom: 8 }}>Full Breakdown Table</div>
                  <table>
                    <thead>
                      <tr>
                        <th>Touch Point</th>
                        {SG_GROUPS.map(sg => <th key={sg} style={{ color: GC[sg], textAlign: "center" }}>{sg}</th>)}
                        <th>Total</th>
                        <th style={{ color: "#f58c0b" }}>PTP Rank</th>
                        <th style={{ color: "#22c55e" }}>KEPT Rank</th>
                      </tr>
                    </thead>
                    <tbody>{(() => {
                      const tpRankPTP = [...(an.tpBySG["PTP"] || [])].map((r, i) => ({ tp: r.tp, rank: i + 1 }));
                      const tpRankKEPT = [...(an.tpBySG["KEPT"] || [])].map((r, i) => ({ tp: r.tp, rank: i + 1 }));
                      return ALL_TP.filter(tp => an.td.some(t => t.name === tp)).map((tp, idx) => {
                        const total = an.td.find(t => t.name === tp)?.count || 0;
                        const ptpRank = tpRankPTP.find(r => r.tp === tp)?.rank;
                        const keptRank = tpRankKEPT.find(r => r.tp === tp)?.rank;
                        return (
                          <tr key={tp}>
                            <td style={{ fontWeight: 600, color: TP_COLORS[tp] || tk.textPrimary }}>{tp}</td>
                            {SG_GROUPS.map(sg => {
                              const cnt = (an.tpBySG[sg]?.find(r => r.tp === tp)?.count) || 0;
                              const pct = (an.tpBySG[sg]?.find(r => r.tp === tp)?.pct) || "0.0";
                              return <td key={sg} style={{ textAlign: "center", color: GC[sg] || tk.textSub }}>
                                {cnt > 0 ? <><span style={{ fontWeight: 700 }}>{cnt.toLocaleString()}</span><span style={{ color: tk.textFaint, fontSize: 11 }}> ({pct}%)</span></> : <span style={{ color: tk.borderMed }}>–</span>}
                              </td>;
                            })}
                            <td style={{ fontWeight: 700, color: "#60a5fa" }}>{total.toLocaleString()}</td>
                            <td style={{ textAlign: "center" }}>
                              {ptpRank ? <span style={{ background: "#451a03", color: "#f59e0b", borderRadius: 12, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>#{ptpRank}</span> : <span style={{ color: tk.borderMed }}>–</span>}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {keptRank ? <span style={{ background: "#052e16", color: "#22c55e", borderRadius: 12, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>#{keptRank}</span> : <span style={{ color: tk.borderMed }}>–</span>}
                            </td>
                          </tr>
                        );
                      });
                    })()}</tbody>
                  </table>
                </div>
              </div>
            )}
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
                    <div style={{ fontSize: 11, color: tk.textMuted, textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600 }}>{k.l}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: k.c, fontFamily: "'Space Grotesk',sans-serif", marginTop: 2 }}>{k.v}</div>
                    {k.sub && <div style={{ fontSize: 11, color: tk.textFaint, marginTop: 2 }}>{k.sub}</div>}
                  </div>
                ))}
                <div className="card" style={{ gridColumn: "1/-1" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: tk.textBright }}>Overall Daily Efforts Trend</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={dateSorted} margin={{ left: 0, right: 16, bottom: dateSorted.length > 20 ? 70 : 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                      <XAxis dataKey="date" tick={{ fill: tk.textMuted, fontSize: 10 }} angle={dateSorted.length > 15 ? -35 : 0} textAnchor={dateSorted.length > 15 ? "end" : "middle"} interval={dateSorted.length > 30 ? Math.floor(dateSorted.length / 20) : 0} />
                      <YAxis tick={{ fill: tk.textMuted, fontSize: 11 }} />
                      <Tooltip contentStyle={TS} />
                      <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} dot={dateSorted.length < 40} name="Total Records" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="card" style={{ gridColumn: "1/-1" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: tk.textBright }}>Daily Group Breakdown</div>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={dateSorted} margin={{ left: 0, right: 16, bottom: dateSorted.length > 20 ? 70 : 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                      <XAxis dataKey="date" tick={{ fill: tk.textMuted, fontSize: 10 }} angle={dateSorted.length > 15 ? -35 : 0} textAnchor={dateSorted.length > 15 ? "end" : "middle"} interval={dateSorted.length > 30 ? Math.floor(dateSorted.length / 20) : 0} />
                      <YAxis tick={{ fill: tk.textMuted, fontSize: 11 }} />
                      <Tooltip contentStyle={TS} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      {SG_GROUPS.map(sg => <Bar key={sg} dataKey={sg} stackId="a" fill={GC[sg] || tk.textMuted} name={sg} />)}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {hasHours && (
                  <div className="card" style={{ gridColumn: "1/-1" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: tk.textBright }}>Activity by Hour of Day</div>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={hourData} margin={{ left: 0, right: 16 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                        <XAxis dataKey="hour" tick={{ fill: tk.textMuted, fontSize: 10 }} interval={1} />
                        <YAxis tick={{ fill: tk.textMuted, fontSize: 11 }} />
                        <Tooltip contentStyle={TS} />
                        <Bar dataKey="count" fill="#a78bfa" radius={[3, 3, 0, 0]} name="Records" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <div className="card" style={{ gridColumn: "1/-1" }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8, marginBottom:4 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: tk.textBright }}>Per-Date Summary</div>
                    <ExportBtn onClick={() => exportXlsx(dateSorted.map(d=>({ Date:d.date, Total:d.total, ...Object.fromEntries(SG_GROUPS.map(sg=>[sg,d[sg]||0])) })), "date_summary.xlsx")} />
                  </div>
                  <div style={{ fontSize: 12, color: tk.textMuted, marginBottom: 8 }}>
                    Click any row to drill into that date.
                    {selectedDate && <button onClick={() => setSelectedDate(null)} style={{ marginLeft: 12, background: tk.borderMed, border: "none", color: tk.textSub, borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 11 }}>x Clear</button>}
                  </div>
                  <SearchBar tk={tk} value={dateSearch} onChange={setDateSearch} placeholder="Filter by date..." />
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
                            {SG_GROUPS.map(sg => <th key={sg} onClick={() => mkSort(dateSort, setDateSort)(sg)} style={{ cursor: "pointer", userSelect: "none" }}><span style={{ color: GC[sg] || tk.textSub }}>{sg}</span> <DI col={sg} /></th>)}
                          </tr></thead>
                          <tbody>{filteredDates.map((d, i) => (
                            <tr key={d.date} className={`dr${selectedDate === d.date ? " sel" : ""}`} onClick={() => setSelectedDate(selectedDate === d.date ? null : d.date)}>
                              <td style={{ color: tk.textFaint }}>{i + 1}</td>
                              <td style={{ fontWeight: 600, color: tk.textPrimary }}>{d.date}</td>
                              <td style={{ fontWeight: 700, color: "#60a5fa" }}>{d.total.toLocaleString()}</td>
                              {SG_GROUPS.map(sg => <td key={sg} style={{ color: GC[sg] || tk.textSub }}>{(d[sg] || 0).toLocaleString()}</td>)}
                            </tr>
                          ))}</tbody>
                        </table>
                      </div>
                    );
                  })()}
                </div>
                {selectedDate && selectedDateRows && (
                  <div className="card" style={{ gridColumn: "1/-1", border: "1px solid #1e40af" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: tk.textBright, marginBottom: 12 }}>📅 Status Breakdown — {selectedDate}</div>
                    <div style={{ overflowX: "auto" }}>
                      <table>
                        <thead><tr><th>#</th><th>Status</th><th>Grp</th><th>TP</th><th>Count</th><th>%</th></tr></thead>
                        <tbody>{selectedDateRows.map((s, i) => {
                          const dayTotal = selectedDateRows.reduce((a, b) => a + b.count, 0);
                          return <tr key={s.status}><td style={{ color: tk.textFaint }}>{i + 1}</td><td style={{ color: tk.textPrimary, fontWeight: 500 }}>{s.status}</td><td><span className="bdg" style={{ background: (GC[s.grp] || "#3b82f6") + "33", color: GC[s.grp] || tk.textSub }}>{s.grp}</span></td><td style={{ color: tk.textMuted }}>{s.tp}</td><td style={{ fontWeight: 700, color: tk.textBright }}>{s.count.toLocaleString()}</td><td style={{ color: "#60a5fa" }}>{((s.count / dayTotal) * 100).toFixed(1)}%</td></tr>;
                        })}</tbody>
                      </table>
                    </div>
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
                      <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
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
                      <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
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
                        <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
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
                        <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
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
                      <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
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
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8, marginBottom:8 }}>
                    <div style={{ fontWeight:700, fontSize:14, color:"#f9fafb" }}>Monthly Summary Table</div>
                    <ExportBtn onClick={() => exportXlsx(monthlySorted.map(m=>({
                      Month:m.month, Total:m.total,
                      ...Object.fromEntries(SG_GROUPS.map(sg=>[sg,m[sg]||0])),
                      "PTP Amount":m.ptpAmt, "Claim Amount":m.claimAmt,
                      "RPC%":m.total>0?((m.RPC/m.total)*100).toFixed(1):0,
                      "PTP%":m.total>0?((m.PTP/m.total)*100).toFixed(1):0,
                      "KEPT%":m.total>0?((m.KEPT/m.total)*100).toFixed(1):0
                    })), "monthly_summary.xlsx")} />
                  </div>
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
                          <td style={{ fontWeight:700, color:tk.textPrimary }}>{m.month}</td>
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
                                <td style={{ position:"sticky",left:0,background:"#111827",fontWeight:600,color:tk.textPrimary,zIndex:1 }}>{cl}</td>
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

          {/* ── Clients Tab (All-clients comparison view) ── */}
          {tab === "clients" && an.clientAnalytics && (() => {
            const { clientList, clientSGData } = an.clientAnalytics;
            const topClient = clientList[0];
            const bestPTPClient = [...clientList].sort((a, b) => (b.bySG.PTP || 0) - (a.bySG.PTP || 0))[0];
            const bestKEPTClient = [...clientList].sort((a, b) => (b.bySG.KEPT || 0) - (a.bySG.KEPT || 0))[0];
            const totalAll = clientList.reduce((s, c) => s + c.total, 0);
            return (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
                {/* Header note */}
                <div style={{ gridColumn: "1/-1", background: isDark ? "#0f1f3d" : "#eff6ff", border: `1px solid ${isDark ? "#1e3a5f" : "#bfdbfe"}`, borderRadius: 10, padding: "12px 16px", fontSize: 12, color: tk.textMuted }}>
                  💡 This view compares all clients side-by-side. To see full analytics for a single client only, use the <strong style={{ color: "#60a5fa" }}>client filter strip</strong> above the tabs.
                </div>

                {[
                  { l: "Total Clients", v: clientList.length, i: "🏢", c: "#a78bfa" },
                  { l: "Highest Volume", v: topClient?.name || "–", i: "🔝", c: "#3b82f6", sub: topClient?.total.toLocaleString() + " records" },
                  { l: "Most PTP", v: bestPTPClient?.name || "–", i: "💰", c: "#f59e0b", sub: (bestPTPClient?.bySG?.PTP || 0).toLocaleString() + " PTPs" },
                  { l: "Most KEPT", v: bestKEPTClient?.name || "–", i: "✅", c: "#22c55e", sub: (bestKEPTClient?.bySG?.KEPT || 0).toLocaleString() + " kept" },
                ].map(k => (
                  <div key={k.l} className="sc">
                    <div style={{ fontSize: 20, marginBottom: 6 }}>{k.i}</div>
                    <div style={{ fontSize: 11, color: tk.textMuted, textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600 }}>{k.l}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: k.c, fontFamily: "'Space Grotesk',sans-serif", marginTop: 2 }}>{k.v}</div>
                    {k.sub && <div style={{ fontSize: 11, color: tk.textFaint, marginTop: 2 }}>{k.sub}</div>}
                  </div>
                ))}

                {/* Volume comparison bar chart */}
                <div className="card" style={{ gridColumn: "1/3" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10, color: tk.textBright }}>Volume by Client</div>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={clientList} layout="vertical" margin={{ left: 0, right: 55 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                      <XAxis type="number" tick={{ fill: tk.textMuted, fontSize: 11 }} />
                      <YAxis type="category" dataKey="name" tick={{ fill: tk.textSub, fontSize: 11 }} width={120} />
                      <Tooltip contentStyle={TS} />
                      <Bar dataKey="total" radius={[0, 4, 4, 0]} label={{ position:"right", fill:tk.textMuted, fontSize:10, formatter:v=>v.toLocaleString() }}>
                        {clientList.map((c, i) => <Cell key={i} fill={PC[i % PC.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Outcome group stacked comparison */}
                <div className="card" style={{ gridColumn: "3/5" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10, color: tk.textBright }}>Outcome Group Mix per Client</div>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={clientSGData} margin={{ bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                      <XAxis dataKey="name" tick={{ fill: tk.textMuted, fontSize: 10 }} angle={clientList.length > 4 ? -25 : 0} textAnchor={clientList.length > 4 ? "end" : "middle"} interval={0} />
                      <YAxis tick={{ fill: tk.textMuted, fontSize: 11 }} />
                      <Tooltip contentStyle={TS} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      {SG_GROUPS.map(sg => <Bar key={sg} dataKey={sg} stackId="a" fill={GC[sg] || tk.textMuted} name={sg} />)}
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Rate comparison */}
                <div className="card" style={{ gridColumn: "1/-1" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10, color: tk.textBright }}>RPC / PTP / KEPT Rate by Client (%)</div>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={clientList.map(c => ({
                      name: c.name,
                      "RPC%": c.total > 0 ? parseFloat(((c.bySG.RPC || 0) / c.total * 100).toFixed(1)) : 0,
                      "PTP%": c.total > 0 ? parseFloat(((c.bySG.PTP || 0) / c.total * 100).toFixed(1)) : 0,
                      "KEPT%": c.total > 0 ? parseFloat(((c.bySG.KEPT || 0) / c.total * 100).toFixed(1)) : 0,
                    }))} margin={{ bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                      <XAxis dataKey="name" tick={{ fill: tk.textMuted, fontSize: 10 }} angle={clientList.length > 4 ? -25 : 0} textAnchor={clientList.length > 4 ? "end" : "middle"} interval={0} />
                      <YAxis tick={{ fill: tk.textMuted, fontSize: 11 }} unit="%" />
                      <Tooltip contentStyle={TS} formatter={v => [v.toFixed(1) + "%"]} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="RPC%" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="PTP%" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="KEPT%" fill="#22c55e" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Summary table with switch-to-client button */}
                <div className="card" style={{ gridColumn: "1/-1" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: tk.textBright }}>Client Summary Table</div>
                  <div style={{ fontSize: 12, color: tk.textMuted, marginBottom: 8 }}>
                    Click <strong style={{ color: "#60a5fa" }}>View Only</strong> on any row to isolate that client's data across all tabs.
                    {selectedClient && <button onClick={() => setSelectedClient(null)} style={{ marginLeft: 12, background: tk.borderMed, border: "none", color: tk.textSub, borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 11 }}>x Clear drill-down</button>}
                  </div>
                  <SearchBar tk={tk} value={clientSearch} onChange={setClientSearch} placeholder="Filter by client name..." />
                  {(() => {
                    const CLI = mkIcon(clientSort);
                    const filteredClients = sortFilter(clientList.map(c => ({
                      ...c,
                      pctShare: ((c.total / totalAll) * 100).toFixed(1),
                      rpcRate: c.total > 0 ? ((c.bySG.RPC || 0) / c.total * 100).toFixed(1) : "0.0",
                      ptpRate: c.total > 0 ? ((c.bySG.PTP || 0) / c.total * 100).toFixed(1) : "0.0",
                      keptRate: c.total > 0 ? ((c.bySG.KEPT || 0) / c.total * 100).toFixed(1) : "0.0",
                    })), clientSort, clientSearch, ["name"]);
                    return (
                      <div style={{ overflowX: "auto" }}>
                        <table>
                          <thead><tr>
                            <th>#</th>
                            <th onClick={() => mkSort(clientSort, setClientSort)("name")} style={{ cursor: "pointer", userSelect: "none" }}>Client <CLI col="name" /></th>
                            <th onClick={() => mkSort(clientSort, setClientSort)("total")} style={{ cursor: "pointer", userSelect: "none" }}>Total <CLI col="total" /></th>
                            <th onClick={() => mkSort(clientSort, setClientSort)("pctShare")} style={{ cursor: "pointer", userSelect: "none" }}>Share% <CLI col="pctShare" /></th>
                            {SG_GROUPS.map(sg => <th key={sg} style={{ color: GC[sg] }}>{sg}</th>)}
                            <th style={{ color: "#3b82f6" }}>RPC%</th>
                            <th style={{ color: "#f59e0b" }}>PTP%</th>
                            <th style={{ color: "#22c55e" }}>KEPT%</th>
                            <th>Action</th>
                            <th style={{ width: 100 }}>Bar</th>
                          </tr></thead>
                          <tbody>{filteredClients.map((c, i) => (
                            <tr key={c.name} className={`dr3${selectedClient === c.name ? " sel" : ""}`} onClick={() => setSelectedClient(selectedClient === c.name ? null : c.name)}>
                              <td style={{ color: tk.textFaint }}>{i + 1}</td>
                              <td style={{ fontWeight: 600, color: tk.textPrimary }}>{c.name}</td>
                              <td style={{ fontWeight: 700, color: PC[i % PC.length] }}>{c.total.toLocaleString()}</td>
                              <td style={{ color: "#60a5fa" }}>{c.pctShare}%</td>
                              {SG_GROUPS.map(sg => <td key={sg} style={{ color: GC[sg] || tk.textSub }}>{(c.bySG[sg] || 0).toLocaleString()}</td>)}
                              <td style={{ color: "#3b82f6", fontWeight: 600 }}>{c.rpcRate}%</td>
                              <td style={{ color: "#f59e0b", fontWeight: 600 }}>{c.ptpRate}%</td>
                              <td style={{ color: "#22c55e", fontWeight: 600 }}>{c.keptRate}%</td>
                              <td>
                                <button
                                  onClick={e => { e.stopPropagation(); setActiveClientFilter(c.name); setTab("overview"); }}
                                  style={{ fontSize: 10, padding: "3px 8px", borderRadius: 5, background: isDark ? "#1e3a5f" : "#dbeafe", border: "1px solid #3b82f6", color: "#60a5fa", cursor: "pointer", fontWeight: 600 }}
                                >
                                  View Only ↗
                                </button>
                              </td>
                              <td><Pb tk={tk} pct={(c.total / clientList[0].total) * 100} c={PC[i % PC.length]} /></td>
                            </tr>
                          ))}</tbody>
                        </table>
                      </div>
                    );
                  })()}
                </div>

                {/* Drill-down detail */}
                {selectedClient && selectedClientData && (
                  <div className="card" style={{ gridColumn: "1/-1", border: "1px solid #78350f" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: tk.textBright }}>🏢 {selectedClient} — Detailed Breakdown</div>
                      <button
                        onClick={() => { setActiveClientFilter(selectedClient); setTab("overview"); }}
                        style={{ fontSize: 11, padding: "4px 12px", borderRadius: 6, background: isDark ? "#1e3a5f" : "#dbeafe", border: "1px solid #3b82f6", color: "#60a5fa", cursor: "pointer", fontWeight: 600 }}
                      >
                        Switch to {selectedClient} only ↗
                      </button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
                      {[
                        { l: "Total Efforts", v: selectedClientData.total.toLocaleString(), c: "#60a5fa" },
                        { l: "Share of All", v: ((selectedClientData.total / totalAll) * 100).toFixed(1) + "%", c: "#a78bfa" },
                        { l: "RPC Rate", v: selectedClientData.total > 0 ? ((selectedClientData.bySG.RPC || 0) / selectedClientData.total * 100).toFixed(1) + "%" : "–", c: "#3b82f6" },
                        { l: "KEPT Rate", v: selectedClientData.total > 0 ? ((selectedClientData.bySG.KEPT || 0) / selectedClientData.total * 100).toFixed(1) + "%" : "–", c: "#22c55e" },
                      ].map(k => (
                        <div key={k.l} style={{ background: tk.bgSurface, borderRadius: 8, padding: "12px 14px" }}>
                          <div style={{ fontSize: 10, color: tk.textMuted, textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>{k.l}</div>
                          <div style={{ fontSize: 18, fontWeight: 700, color: k.c }}>{k.v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: tk.textSub, marginBottom: 8 }}>By Touch Point</div>
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
                        <div style={{ fontWeight: 600, fontSize: 13, color: tk.textSub, marginBottom: 8 }}>By Outcome Group</div>
                        <ResponsiveContainer width="100%" height={220}>
                          <PieChart>
                            <Pie data={Object.entries(selectedClientData.bySG).map(([k, v]) => ({ name: k, value: v }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                              {Object.entries(selectedClientData.bySG).map(([sg], i) => <Cell key={i} fill={GC[sg] || PC[i % PC.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={TS} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ── Buckets Tab ── */}
          {tab === "buckets" && (
            !data?.oick
              ? (
                <div className="card" style={{ gridColumn: "1/-1", textAlign: "center", padding: "48px 24px" }}>
                  <div style={{ fontSize: 40, marginBottom: 16 }}>📍</div>
                  <div style={{ fontWeight: 700, fontSize: 18, color: tk.textBright, marginBottom: 8 }}>No Bucket / Placement Column Detected</div>
                  <div style={{ fontSize: 13, color: tk.textMuted, maxWidth: 480, margin: "0 auto", lineHeight: 1.6 }}>
                    The Buckets tab requires an <code style={{ color: "#60a5fa", background: tk.bgSurface, padding: "1px 6px", borderRadius: 4 }}>Old IC</code>, <code style={{ color: "#60a5fa", background: tk.bgSurface, padding: "1px 6px", borderRadius: 4 }}>Placement</code>, or <code style={{ color: "#60a5fa", background: tk.bgSurface, padding: "1px 6px", borderRadius: 4 }}>Bucket</code> column in your file.
                    Please upload a file that includes one of these columns to view bucket-level analytics.
                  </div>
                </div>
              )
              : (() => {
            // ── Unmapped warning banner (shown when no IC codes matched) ──
            const bucketWarn = an.bucketAnalytics?.allUnmapped;
            const unmappedSamples = an.bucketAnalytics?.unmappedSamples || [];
            const bucketList = an.bucketAnalytics?.bucketList || [];
            const { ptpTrendByBucket, claimTrendByBucket, radarData, unmappedCount } = an.bucketAnalytics || {};
            const topBucket = bucketList[0];
            const bestPTP = [...bucketList].sort((a, b) => b.ptpAmt - a.ptpAmt)[0];
            const bestKept = [...bucketList].sort((a, b) => (b.bySG.KEPT || 0) - (a.bySG.KEPT || 0))[0];
            const bestRPC = [...bucketList].sort((a, b) => parseFloat(b.rpcRate) - parseFloat(a.rpcRate))[0];
            const activeTPs = ALL_TP.filter(tp => bucketList.some(b => b.byTP[tp]));
            return (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>

                {/* ── Unmapped warning banner ── */}
                {bucketWarn && (
                  <div style={{ gridColumn: "1/-1", background: isDark ? "#1c1400" : "#fffbeb", border: `1px solid ${isDark ? "#92400e" : "#fcd34d"}`, borderRadius: 12, padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <span style={{ fontSize: 24 }}>⚠️</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "#f59e0b", marginBottom: 4 }}>
                          Bucket codes in your file did not match the known mapping
                        </div>
                        <div style={{ fontSize: 13, color: "#a16207", lineHeight: 1.6, marginBottom: unmappedSamples.length ? 8 : 0 }}>
                          The <strong style={{ color: "#fbbf24" }}>{data.oick}</strong> column was found but none of its values matched known patterns
                          like <code style={{ background: tk.bgCard, padding: "1px 5px", borderRadius: 3 }}>01OAFSA</code>,{" "}
                          <code style={{ background: tk.bgCard, padding: "1px 5px", borderRadius: 3 }}>01BDA</code>, etc.
                          All rows are grouped as <strong style={{ color: "#fbbf24" }}>Unknown / Unmapped</strong> below.
                          Touch point, outcome group, and collector analytics remain fully available.
                        </div>
                        {unmappedSamples.length > 0 && (
                          <div style={{ fontSize: 12, color: tk.textMuted }}>
                            Sample values found in column: {unmappedSamples.map(s => (
                              <code key={s} style={{ background: tk.bgCard, color: tk.textPrimary, padding: "1px 6px", borderRadius: 3, marginRight: 4 }}>{s}</code>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* KPI strip — only when we have real bucket data 
                
                { l: "Unmapped Rows", v: unmappedCount?.toLocaleString() || "0", i: "⚠️", c: tk.textMuted, sub: "no matching IC code" },
                 */}
                {!bucketWarn && [
                  { l: "Total Buckets", v: bucketList.length, i: "📍", c: "#f97316" },
                  { l: "Highest Volume", v: topBucket?.name || "–", i: "🔝", c: "#3b82f6", sub: topBucket?.total.toLocaleString() + " records" },
                  { l: "Best PTP Amount", v: bestPTP?.name || "–", i: "💰", c: "#f59e0b", sub: "₱" + fN(bestPTP?.ptpAmt || 0) },
                  { l: "Best KEPT Rate", v: bestKept?.name || "–", i: "✅", c: "#22c55e", sub: (bestKept?.bySG?.KEPT || 0).toLocaleString() + " kept" },
                  { l: "Best RPC Rate", v: bestRPC?.name || "–", i: "📞", c: "#06b6d4", sub: bestRPC?.rpcRate + "% RPC" },
                  
                ].map(k => (
                  <div key={k.l} className="sc">
                    <div style={{ fontSize: 20, marginBottom: 6 }}>{k.i}</div>
                    <div style={{ fontSize: 11, color: tk.textMuted, textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600 }}>{k.l}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: k.c, fontFamily: "'Space Grotesk',sans-serif", marginTop: 2 }}>{k.v}</div>
                    {k.sub && <div style={{ fontSize: 11, color: tk.textFaint, marginTop: 2 }}>{k.sub}</div>}
                  </div>
                ))}

                {/* ── When unmapped: show full touch point + SG analytics as fallback ── */}
                {bucketWarn && (<>
                  <div style={{ gridColumn: "1/-1", fontSize: 13, color: tk.textMuted, fontStyle: "italic", marginTop: -4 }}>
                    Showing touch point and outcome analytics for all {an.T.toLocaleString()} valid records below. Bucket-level breakdown requires matching IC codes.
                  </div>

                  {/* Touch Point Distribution */}
                  <div className="card" style={{ gridColumn: "1/3" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: tk.textBright }}>📱 Touch Point Distribution</div>
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie data={an.td} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={90}
                          label={({ name, pct }) => `${name} ${pct}%`} labelLine={false}>
                          {an.td.map((e, i) => <Cell key={i} fill={TP_COLORS[e.name] || PC[i % PC.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={TS} formatter={(v, n, p) => [`${v.toLocaleString()} (${p.payload.pct}%)`, n]} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Outcome Group Distribution */}
                  <div className="card" style={{ gridColumn: "3/5" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: tk.textBright }}>🏷️ Outcome Group Distribution</div>
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie data={an.gd} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90}
                          label={({ name, pct }) => `${name} ${pct}%`} labelLine={false}>
                          {an.gd.map((e, i) => <Cell key={i} fill={GC[e.name] || PC[i % PC.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={TS} formatter={(v, n, p) => [`${v.toLocaleString()} (${p.payload.pct}%)`, n]} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Touch Point efforts bar */}
                  <div className="card" style={{ gridColumn: "1/3" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: tk.textBright }}>Efforts by Touch Point</div>
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={an.td} layout="vertical" margin={{ left: 0, right: 55 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                        <XAxis type="number" tick={{ fill: tk.textMuted, fontSize: 11 }} />
                        <YAxis type="category" dataKey="name" tick={{ fill: tk.textSub, fontSize: 11 }} width={130} />
                        <Tooltip contentStyle={TS} />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]} label={{ position:"right", fill:tk.textMuted, fontSize:10, formatter:v=>v.toLocaleString() }}>
                          {an.td.map((e, i) => <Cell key={i} fill={TP_COLORS[e.name] || PC[i % PC.length]} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Top statuses */}
                  <div className="card" style={{ gridColumn: "3/5" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: tk.textBright }}>Top 15 Statuses</div>
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={an.sd.slice(0, 15)} layout="vertical" margin={{ left: 0, right: 55 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                        <XAxis type="number" tick={{ fill: tk.textMuted, fontSize: 11 }} />
                        <YAxis type="category" dataKey="status" tick={{ fill: tk.textSub, fontSize: 10 }} width={200} />
                        <Tooltip contentStyle={TS} />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]} label={{ position:"right", fill:tk.textMuted, fontSize:10, formatter:v=>v.toLocaleString() }}>
                          {an.sd.slice(0, 15).map((e, i) => <Cell key={i} fill={GC[e.grp] || PC[i % PC.length]} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Touch point summary table */}
                  <div className="card" style={{ gridColumn: "1/-1" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, color: tk.textBright }}>Touch Point Summary</div>
                    <table>
                      <thead><tr><th>Touch Point</th><th>Efforts</th><th>%</th><th>RPC</th><th>PTP</th><th>KEPT</th><th>NEG</th><th style={{ width: 160 }}>Bar</th></tr></thead>
                      <tbody>{an.td.map((t, i) => {
                        { /*const tpRows = (an.tpBySG && an.tpBySG) ? null : null;
                        const tpTotal = t.count; */}
                        const rpc = Object.entries(an.tpBySG?.RPC || {}).find(([tp]) => tp === t.name)?.[1] || 0;
                        const ptp = Object.entries(an.tpBySG?.PTP || {}).find(([tp]) => tp === t.name)?.[1] || 0;
                        const kept = Object.entries(an.tpBySG?.KEPT || {}).find(([tp]) => tp === t.name)?.[1] || 0;
                        const neg = Object.entries(an.tpBySG?.NEG || {}).find(([tp]) => tp === t.name)?.[1] || 0;
                        return (
                          <tr key={t.name}>
                            <td style={{ fontWeight: 500, color: TP_COLORS[t.name] || tk.textPrimary }}>{t.name}</td>
                            <td style={{ fontWeight: 700 }}>{t.count.toLocaleString()}</td>
                            <td style={{ color: "#60a5fa" }}>{t.pct}%</td>
                            <td style={{ color: "#3b82f6" }}>{rpc > 0 ? rpc.toLocaleString() : "–"}</td>
                            <td style={{ color: "#f59e0b" }}>{ptp > 0 ? ptp.toLocaleString() : "–"}</td>
                            <td style={{ color: "#22c55e" }}>{kept > 0 ? kept.toLocaleString() : "–"}</td>
                            <td style={{ color: "#ef4444" }}>{neg > 0 ? neg.toLocaleString() : "–"}</td>
                            <td><Pb tk={tk} pct={parseFloat(t.pct)} c={TP_COLORS[t.name] || PC[i % PC.length]} /></td>
                          </tr>
                        );
                      })}</tbody>
                    </table>
                  </div>

                  {/* PTP & Claim totals if available */}
                  {(an.pt > 0 || an.ct > 0) && (
                    <div className="card" style={{ gridColumn: "1/-1" }}>
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, color: tk.textBright }}>💰 PTP & Claim Summary (All Records)</div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                        {[
                          { l: "PTP Records", v: an.pc.toLocaleString(), c: "#3b82f6" },
                          { l: "Total PTP Amount", v: "₱" + fN(an.pt), c: "#22c55e" },
                          { l: "Claim Records", v: an.cc.toLocaleString(), c: "#f59e0b" },
                          { l: "Total Claim Amount", v: "₱" + fN(an.ct), c: "#f97316" },
                        ].map(k => (
                          <div key={k.l} className="sc">
                            <div style={{ fontSize: 11, color: tk.textMuted, textTransform: "uppercase", letterSpacing: ".05em", fontWeight: 600 }}>{k.l}</div>
                            <div style={{ fontSize: 22, fontWeight: 700, color: k.c, fontFamily: "'Space Grotesk',sans-serif", marginTop: 4 }}>{k.v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Collectors table if available */}
                  {an.cd.length > 0 && (
                    <div className="card" style={{ gridColumn: "1/-1" }}>
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: tk.textBright }}>👥 Top Collectors</div>
                      <div style={{ fontSize: 12, color: tk.textMuted, marginBottom: 12 }}>{an.cd.length} collectors · {an.T.toLocaleString()} total efforts</div>
                      <div style={{ maxHeight: 300, overflowY: "auto" }}>
                        <table>
                          <thead><tr><th>#</th><th>Collector</th><th>Efforts</th><th>% Share</th><th style={{ width: 140 }}>Bar</th></tr></thead>
                          <tbody>{an.cd.slice(0, 20).map((c, i) => (
                            <tr key={c.name}>
                              <td style={{ color: tk.textFaint }}>{i + 1}</td>
                              <td style={{ fontWeight: 500, color: tk.textPrimary }}>{c.name}</td>
                              <td style={{ fontWeight: 700, color: "#22c55e" }}>{c.total.toLocaleString()}</td>
                              <td style={{ color: "#60a5fa" }}>{((c.total / an.T) * 100).toFixed(1)}%</td>
                              <td><Pb tk={tk} pct={(c.total / an.cd[0].total) * 100} c="#3b82f6" /></td>
                            </tr>
                          ))}</tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>)}

                {/* ── Normal bucket analytics (when codes ARE mapped) ── */}
                {!bucketWarn && (<>
                <div className="card" style={{ gridColumn: "1/3" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: tk.textBright }}>Bucket Volume Distribution</div>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={bucketList.map(b => ({ name: b.name, value: b.total }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                        {bucketList.map(b => <Cell key={b.name} fill={BUCKET_COLORS[b.name] || tk.textMuted} />)}
                      </Pie>
                      <Tooltip contentStyle={TS} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="card" style={{ gridColumn: "3/5" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: tk.textBright }}>Efforts by Bucket</div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={bucketList} layout="vertical" margin={{ left: 0, right: 55 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                      <XAxis type="number" tick={{ fill: tk.textMuted, fontSize: 11 }} />
                      <YAxis type="category" dataKey="name" tick={{ fill: tk.textSub, fontSize: 11 }} width={110} />
                      <Tooltip contentStyle={TS} />
                      <Bar dataKey="total" radius={[0, 4, 4, 0]} label={{ position:"right", fill:tk.textMuted, fontSize:11, formatter:v=>v.toLocaleString() }}>
                        {bucketList.map(b => <Cell key={b.name} fill={BUCKET_COLORS[b.name] || tk.textMuted} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="card" style={{ gridColumn: "1/-1" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: tk.textBright }}>Outcome Group Mix per Bucket</div>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={bucketList.map(b => ({ name: b.name, NEG: b.bySG.NEG||0, RPC: b.bySG.RPC||0, PTP: b.bySG.PTP||0, KEPT: b.bySG.KEPT||0, POS: b.bySG.POS||0 }))} margin={{ bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                      <XAxis dataKey="name" tick={{ fill: tk.textMuted, fontSize: 11 }} angle={bucketList.length > 5 ? -25 : 0} textAnchor={bucketList.length > 5 ? "end" : "middle"} interval={0} />
                      <YAxis tick={{ fill: tk.textMuted, fontSize: 11 }} />
                      <Tooltip contentStyle={TS} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      {SG_GROUPS.map(sg => <Bar key={sg} dataKey={sg} stackId="a" fill={GC[sg] || tk.textMuted} name={sg} />)}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="card" style={{ gridColumn: "1/-1" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: tk.textBright }}>Conversion Rates by Bucket (%)</div>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={bucketList.map(b => ({ name: b.name, "RPC %": parseFloat(b.rpcRate), "PTP %": parseFloat(b.ptpRate), "KEPT %": parseFloat(b.keptRate) }))} margin={{ bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                      <XAxis dataKey="name" tick={{ fill: tk.textMuted, fontSize: 11 }} angle={bucketList.length > 5 ? -25 : 0} textAnchor={bucketList.length > 5 ? "end" : "middle"} interval={0} />
                      <YAxis tick={{ fill: tk.textMuted, fontSize: 11 }} unit="%" />
                      <Tooltip contentStyle={TS} formatter={v => [v.toFixed(1) + "%"]} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="RPC %" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="PTP %" fill="#f58c0b" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="KEPT %" fill="#22c55e" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="card" style={{ gridColumn: "1/-1" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: tk.textBright }}>Touch Point Mix per Bucket</div>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={bucketList.map(b => ({ name: b.name, ...b.byTP }))} margin={{ bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                      <XAxis dataKey="name" tick={{ fill: tk.textMuted, fontSize: 11 }} angle={bucketList.length > 5 ? -25 : 0} textAnchor={bucketList.length > 5 ? "end" : "middle"} interval={0} />
                      <YAxis tick={{ fill: tk.textMuted, fontSize: 11 }} />
                      <Tooltip contentStyle={TS} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      {activeTPs.map(tp => <Bar key={tp} dataKey={tp} stackId="b" fill={TP_COLORS[tp] || tk.textMuted} name={tp} />)}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="card" style={{ gridColumn: "1/3" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: tk.textBright }}>PTP Amount by Bucket</div>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={bucketList} layout="vertical" margin={{ left: 0, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                      <XAxis type="number" tick={{ fill: tk.textMuted, fontSize: 10 }} tickFormatter={v => v >= 1e6 ? (v/1e6).toFixed(1)+"M" : v >= 1e3 ? (v/1e3).toFixed(0)+"K" : v} />
                      <YAxis type="category" dataKey="name" tick={{ fill: tk.textSub, fontSize: 11 }} width={110} />
                      <Tooltip contentStyle={TS} formatter={v => ["₱" + fN(v), "PTP Amount"]} />
                      <Bar dataKey="ptpAmt" radius={[0, 4, 4, 0]}>
                        {bucketList.map(b => <Cell key={b.name} fill={BUCKET_COLORS[b.name] || tk.textMuted} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="card" style={{ gridColumn: "3/5" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: tk.textBright }}>Claim Paid Amount by Bucket</div>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={bucketList} layout="vertical" margin={{ left: 0, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                      <XAxis type="number" tick={{ fill: tk.textMuted, fontSize: 10 }} tickFormatter={v => v >= 1e6 ? (v/1e6).toFixed(1)+"M" : v >= 1e3 ? (v/1e3).toFixed(0)+"K" : v} />
                      <YAxis type="category" dataKey="name" tick={{ fill: tk.textSub, fontSize: 11 }} width={110} />
                      <Tooltip contentStyle={TS} formatter={v => ["₱" + fN(v), "Claim Amount"]} />
                      <Bar dataKey="claimAmt" radius={[0, 4, 4, 0]}>
                        {bucketList.map(b => <Cell key={b.name} fill={BUCKET_COLORS[b.name] || "#f97316"} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {bucketList.length >= 2 && (
                  <div className="card" style={{ gridColumn: "1/3" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: tk.textBright }}>Bucket Outcome Profile (Radar)</div>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={100}>
                        <PolarGrid stroke={tk.borderMed} />
                        <PolarAngleAxis dataKey="sg" tick={{ fill: tk.textSub, fontSize: 12 }} />
                        {bucketList.slice(0, 6).map(b => (
                          <Radar key={b.name} name={b.name} dataKey={b.name} stroke={BUCKET_COLORS[b.name] || tk.textMuted} fill={BUCKET_COLORS[b.name] || tk.textMuted} fillOpacity={0.12} />
                        ))}
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Tooltip contentStyle={TS} formatter={v => [v.toFixed(1) + "%"]} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <div className="card" style={{ gridColumn: bucketList.length >= 2 ? "3/5" : "1/-1" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, color: tk.textBright }}>Bucket PTP & Claim Summary</div>
                  <table>
                    <thead><tr><th>Bucket</th><th>Total</th><th>PTP#</th><th>PTP Amt</th><th>Claim#</th><th>Claim Amt</th><th>RPC%</th><th>PTP%</th><th>KEPT%</th></tr></thead>
                    <tbody>{bucketList.map(b => (
                      <tr key={b.name}>
                        <td><span className="bdg" style={{ background: (BUCKET_COLORS[b.name] || tk.textMuted) + "33", color: BUCKET_COLORS[b.name] || tk.textSub }}>{b.name}</span></td>
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
                {/* Drill-down table */}
                <div className="card" style={{ gridColumn: "1/-1" }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8, marginBottom:4 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: tk.textBright }}>Detailed Bucket Table</div>
                    <ExportBtn onClick={() => exportXlsx(bucketList.map(b=>({
                      Bucket:b.name, Total:b.total, "Unique Accounts":b.uniqueAccounts, "% Share":b.pctShare,
                      ...Object.fromEntries(SG_GROUPS.map(sg=>[sg,b.bySG[sg]||0])),
                      "RPC%":b.rpcRate, "PTP%":b.ptpRate, "KEPT%":b.keptRate,
                      "PTP Count":b.ptpCount, "PTP Amount":b.ptpAmt, "Claim Count":b.claimCount, "Claim Amount":b.claimAmt
                    })), "bucket_detail.xlsx")} />
                  </div>
                  <div style={{ fontSize: 12, color: tk.textMuted, marginBottom: 8 }}>
                    Click a row to see touch point and outcome breakdown.
                    {selectedBucket && <button onClick={() => setSelectedBucket(null)} style={{ marginLeft: 12, background: tk.borderMed, border: "none", color: tk.textSub, borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontSize: 11 }}>x Clear</button>}
                  </div>
                  <SearchBar tk={tk} value={bucketSearch} onChange={setBucketSearch} placeholder="Filter by bucket name..." />
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
                            <th onClick={() => mkSort(bucketSort, setBucketSort)("uniqueAccounts")} style={{ cursor: "pointer", userSelect: "none" }}>Unique Accts <BI col="uniqueAccounts" /></th>
                            <th onClick={() => mkSort(bucketSort, setBucketSort)("pctShare")} style={{ cursor: "pointer", userSelect: "none" }}>% <BI col="pctShare" /></th>
                            {SG_GROUPS.map(sg => <th key={sg} style={{ color: GC[sg] }}>{sg}</th>)}
                            <th style={{ color: "#3b82f6" }}>RPC%</th>
                            <th style={{ color: "#f58c0b" }}>PTP%</th>
                            <th style={{ color: "#22c55e" }}>KEPT%</th>
                          </tr></thead>
                          <tbody>{filteredBuckets.map((b, i) => (
                            <tr key={b.name} className={`dr4${selectedBucket === b.name ? " sel" : ""}`} onClick={() => setSelectedBucket(selectedBucket === b.name ? null : b.name)}>
                              <td style={{ color: tk.textFaint }}>{i + 1}</td>
                              <td><span className="bdg" style={{ background: (BUCKET_COLORS[b.name] || tk.textMuted) + "33", color: BUCKET_COLORS[b.name] || tk.textSub }}>{b.name}</span></td>
                              <td style={{ fontWeight: 700, color: BUCKET_COLORS[b.name] || "#f97316" }}>{b.total.toLocaleString()}</td>
                              <td style={{ color: "#60a5fa" }}>{b.uniqueAccounts > 0 ? b.uniqueAccounts.toLocaleString() : "–"}</td>
                              <td style={{ color: "#60a5fa" }}>{b.pctShare}%</td>
                              {SG_GROUPS.map(sg => <td key={sg} style={{ color: GC[sg] || tk.textSub }}>{(b.bySG[sg] || 0).toLocaleString()}</td>)}
                              <td style={{ color: "#3b82f6" }}>{b.rpcRate}%</td>
                              <td style={{ color: "#f58c0b" }}>{b.ptpRate}%</td>
                              <td style={{ color: "#22c55e" }}>{b.keptRate}%</td>
                            </tr>
                          ))}</tbody>
                        </table>
                      </div>
                    );
                  })()}
                </div>
                {selectedBucket && selectedBucketData && (
                  <div className="card" style={{ gridColumn: "1/-1", border: `1px solid ${BUCKET_COLORS[selectedBucket] || tk.borderMed}44` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: tk.textBright }}>📍 {selectedBucket} — Deep Dive</div>
                      <span style={{ background: (BUCKET_COLORS[selectedBucket] || tk.textMuted) + "22", color: BUCKET_COLORS[selectedBucket] || "#f97316", borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 600 }}>{selectedBucketData.total.toLocaleString()} records</span>
                      {selectedBucketData.uniqueAccounts > 0 && <span style={{ background: isDark ? "#172554" : "#dbeafe", color: isDark ? "#60a5fa" : "#2563eb", borderRadius: 20, padding: "2px 10px", fontSize: 12 }}>{selectedBucketData.uniqueAccounts.toLocaleString()} unique accounts</span>}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: tk.textSub, marginBottom: 8 }}>Touch Point Breakdown</div>
                        <ResponsiveContainer width="100%" height={220}>
                          <PieChart>
                            <Pie data={Object.entries(selectedBucketData.byTP).map(([k, v]) => ({ name: k, value: v }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                              {Object.entries(selectedBucketData.byTP).map(([tp], i) => <Cell key={i} fill={TP_COLORS[tp] || PC[i % PC.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={TS} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: tk.textSub, marginBottom: 8 }}>Outcome Group Breakdown</div>
                        <ResponsiveContainer width="100%" height={220}>
                          <PieChart>
                            <Pie data={Object.entries(selectedBucketData.bySG).map(([k, v]) => ({ name: k, value: v }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                              {Object.entries(selectedBucketData.bySG).map(([sg], i) => <Cell key={i} fill={GC[sg] || PC[i % PC.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={TS} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: tk.textSub, marginBottom: 8 }}>Touch Point Details</div>
                        <table>
                          <thead><tr><th>TP</th><th>Efforts</th><th>%</th></tr></thead>
                          <tbody>{Object.entries(selectedBucketData.byTP).sort((a, b) => b[1] - a[1]).map(([tp, cnt]) => (
                            <tr key={tp}><td style={{ color: TP_COLORS[tp] || tk.textSub, fontWeight: 500 }}>{tp}</td><td style={{ fontWeight: 700 }}>{cnt.toLocaleString()}</td><td style={{ color: "#60a5fa" }}>{((cnt / selectedBucketData.total) * 100).toFixed(1)}%</td></tr>
                          ))}</tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
                </>)}
              </div>
            );
          })())}

          {/* ═══════════════════════════════════════════════════════════════
              ── 🎯 PENETRATION TAB (NEW) ──
          ═══════════════════════════════════════════════════════════════ */}
          {tab === "penetration" && (
            !data?.oick
              ? (
                <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
                  <div style={{ fontSize: 40, marginBottom: 16 }}>🎯</div>
                  <div style={{ fontWeight: 700, fontSize: 18, color: tk.textBright, marginBottom: 8 }}>No Bucket / Placement Column Detected</div>
                  <div style={{ fontSize: 13, color: tk.textMuted, maxWidth: 480, margin: "0 auto", lineHeight: 1.6 }}>
                    Penetration analysis requires an <code style={{ color: "#60a5fa", background: tk.bgSurface, padding: "1px 6px", borderRadius: 4 }}>Old IC</code>, <code style={{ color: "#60a5fa", background: tk.bgSurface, padding: "1px 6px", borderRadius: 4 }}>Placement</code>, or <code style={{ color: "#60a5fa", background: tk.bgSurface, padding: "1px 6px", borderRadius: 4 }}>Bucket</code> column plus an Account No. column.
                  </div>
                </div>
              )
              : an.bucketAnalytics?.allUnmapped
              ? (
                <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
                  <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
                  <div style={{ fontWeight: 700, fontSize: 18, color: tk.textBright, marginBottom: 8 }}>Bucket Codes Not Recognized</div>
                  <div style={{ fontSize: 13, color: tk.textMuted, maxWidth: 540, margin: "0 auto", lineHeight: 1.6 }}>
                    Penetration analysis per bucket requires matching IC codes like <code style={{ color: "#60a5fa", background: tk.bgSurface, padding: "1px 6px", borderRadius: 4 }}>01OAFSA</code>, <code style={{ color: "#60a5fa", background: tk.bgSurface, padding: "1px 6px", borderRadius: 4 }}>01BDA</code>, etc.
                    The values in your <strong style={{ color: "#f59e0b" }}>{data.oick}</strong> column did not match the known mapping.
                    {an.bucketAnalytics?.unmappedSamples?.length > 0 && (
                      <span> Sample values found: {an.bucketAnalytics.unmappedSamples.map(s => (
                        <code key={s} style={{ background: tk.bgCard, color: tk.textSub, padding: "1px 6px", borderRadius: 3, marginRight: 4 }}>{s}</code>
                      ))}</span>
                    )}
                  </div>
                </div>
              )
              : !an.bucketAnalytics?.hasAccountData
              ? (
                <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
                  <div style={{ fontSize: 40, marginBottom: 16 }}>👤</div>
                  <div style={{ fontWeight: 700, fontSize: 18, color: tk.textBright, marginBottom: 8 }}>No Account Number Column Detected</div>
                  <div style={{ fontSize: 13, color: tk.textMuted, maxWidth: 480, margin: "0 auto", lineHeight: 1.6 }}>
                    Penetration % requires an <code style={{ color: "#60a5fa", background: tk.bgSurface, padding: "1px 6px", borderRadius: 4 }}>Account No.</code> column to count unique accounts per bucket.
                    Please upload a file that includes this column.
                  </div>
                </div>
              )
              : (() => {
            const { bucketList, penetrationMatrix, tpMaxPct, penetrationBarData, activeTPs } = an.bucketAnalytics;
            const opd = an.overallPenetrationData;

            // Highest / lowest penetration per TP
            const topPenetrations = activeTPs.map(tp => {
              const best = penetrationMatrix.reduce((a, b) => (b[`${tp}_pct`] || 0) > (a[`${tp}_pct`] || 0) ? b : a, penetrationMatrix[0]);
              return { tp, bucket: best?.bucket, pct: best?.[`${tp}_pct`] || 0 };
            }).sort((a, b) => b.pct - a.pct);

            // Bar chart data: for each bucket, penetration % per TP
            const bucketPenetrationChartData = bucketList.map(b => {
              const row = { name: b.name };
              activeTPs.forEach(tp => {
                const idx = penetrationMatrix.find(r => r.bucket === b.name);
                row[tp] = idx ? (idx[`${tp}_pct`] || 0) : 0;
              });
              return row;
            });

            return (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
                {/* Summary KPIs */}
                <div className="card" style={{ gridColumn: "1/-1", background: isDark ? "linear-gradient(135deg,#0f1f3d,#0f172a)" : "linear-gradient(135deg,#eff6ff,#f8fafc)", border: `1px solid ${isDark ? "#1e3a5f" : "#bfdbfe"}` }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: tk.textBright, marginBottom: 6 }}>🎯 Touch Point Penetration per Bucket</div>
                  <div style={{ fontSize: 13, color: tk.textMuted, marginBottom: 0 }}>
                    Penetration % = Unique accounts touched by each touch point ÷ Total unique accounts in that bucket.
                    A higher % means more accounts in that bucket were reached via that channel.
                  </div>
                </div>

                {/* ── Overall Penetration KPIs ── */}
                {opd && (<>
                  <div className="sc" style={{ gridColumn: "1/2" }}>
                    <div style={{ fontSize: 20, marginBottom: 6 }}>🌐</div>
                    <div style={{ fontSize: 11, color: tk.textMuted, textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600 }}>Total Unique Accounts</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "#60a5fa", fontFamily: "'Space Grotesk',sans-serif", marginTop: 2 }}>{opd.totalUA.toLocaleString()}</div>
                  </div>
                  <div className="sc" style={{ gridColumn: "2/3" }}>
                    <div style={{ fontSize: 20, marginBottom: 6 }}>✅</div>
                    <div style={{ fontSize: 11, color: tk.textMuted, textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600 }}>Accounts with Any Effort</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "#22c55e", fontFamily: "'Space Grotesk',sans-serif", marginTop: 2 }}>{opd.accountsWithEffort.toLocaleString()}</div>
                  </div>
                  <div className="sc" style={{ gridColumn: "3/4" }}>
                    <div style={{ fontSize: 20, marginBottom: 6 }}>🏆</div>
                    <div style={{ fontSize: 11, color: tk.textMuted, textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600 }}>Top Penetration Channel</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: TP_COLORS[opd.tpPenetrationOverall[0]?.tp] || "#a78bfa", fontFamily: "'Space Grotesk',sans-serif", marginTop: 2 }}>{opd.tpPenetrationOverall[0]?.tp || "–"}</div>
                    <div style={{ fontSize: 11, color: tk.textFaint, marginTop: 2 }}>{opd.tpPenetrationOverall[0]?.pct}% of accounts reached</div>
                  </div>
                  <div className="sc" style={{ gridColumn: "4/5" }}>
                    <div style={{ fontSize: 20, marginBottom: 6 }}>📊</div>
                    <div style={{ fontSize: 11, color: tk.textMuted, textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600 }}>Overall Penetration</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "#f59e0b", fontFamily: "'Space Grotesk',sans-serif", marginTop: 2 }}>{opd.overallPct}%</div>
                    <div style={{ fontSize: 11, color: tk.textFaint, marginTop: 2 }}>Avg of all TP penetration %</div>
                  </div>

                  {/* Overall TP Penetration Table & Chart */}
                  <div className="card" style={{ gridColumn: "1/3" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: tk.textBright }}>🌐 Overall Penetration by Touch Point</div>
                    <div style={{ fontSize: 12, color: tk.textMuted, marginBottom: 12 }}>
                      Unique accounts reached per channel as % of all {opd.totalUA.toLocaleString()} accounts.
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={opd.tpPenetrationOverall} layout="vertical" margin={{ left: 0, right: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                        <XAxis type="number" tick={{ fill: tk.textMuted, fontSize: 11 }} unit="%" domain={[0, 100]} />
                        <YAxis type="category" dataKey="tp" tick={{ fill: tk.textSub, fontSize: 11 }} width={130} />
                        <Tooltip contentStyle={TS} formatter={(v, n, p) => [`${v}% (${p.payload.uniqueAccountsTouched.toLocaleString()} accts)`, "Penetration"]} />
                        <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
                          {opd.tpPenetrationOverall.map((r, i) => <Cell key={i} fill={TP_COLORS[r.tp] || PC[i % PC.length]} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <div style={{ marginTop: 12, overflowX: "auto" }}>
                      <table>
                        <thead><tr>
                          <th>Touch Point</th>
                          <th>Accounts Reached</th>
                          <th>Penetration %</th>
                          <th style={{ width: 120 }}>Bar</th>
                        </tr></thead>
                        <tbody>{opd.tpPenetrationOverall.map((r, i) => (
                          <tr key={r.tp}>
                            <td style={{ color: TP_COLORS[r.tp] || tk.textSub, fontWeight: 600 }}>{r.tp}</td>
                            <td style={{ fontWeight: 700, color: tk.textPrimary }}>{r.uniqueAccountsTouched.toLocaleString()}</td>
                            <td style={{ color: "#60a5fa", fontWeight: 700 }}>{r.pct}%</td>
                            <td><Pb tk={tk} pct={r.pct} c={TP_COLORS[r.tp] || PC[i % PC.length]} /></td>
                          </tr>
                        ))}</tbody>
                      </table>
                    </div>
                  </div>

                  {/* Overall SG Penetration */}
                  <div className="card" style={{ gridColumn: "3/5" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: tk.textBright }}>🎯 Accounts Reached per Outcome Group</div>
                    <div style={{ fontSize: 12, color: tk.textMuted, marginBottom: 12 }}>
                      Unique accounts that received each outcome group — as % of total accounts.
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={opd.sgPenetrationOverall} layout="vertical" margin={{ left: 0, right: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                        <XAxis type="number" tick={{ fill: tk.textMuted, fontSize: 11 }} unit="%" domain={[0, 100]} />
                        <YAxis type="category" dataKey="sg" tick={{ fill: tk.textSub, fontSize: 11 }} width={50} />
                        <Tooltip contentStyle={TS} formatter={(v, n, p) => [`${v}% (${p.payload.uniqueAccounts.toLocaleString()} accts)`, "Penetration"]} />
                        <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
                          {opd.sgPenetrationOverall.map((r, i) => <Cell key={i} fill={GC[r.sg] || PC[i % PC.length]} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <div style={{ marginTop: 12 }}>
                      <table>
                        <thead><tr><th>Outcome Group</th><th>Unique Accounts</th><th>% of Total</th><th style={{ width: 100 }}>Bar</th></tr></thead>
                        <tbody>{opd.sgPenetrationOverall.map((r, i) => (
                          <tr key={r.sg}>
                            <td><span className="bdg" style={{ background: (GC[r.sg] || tk.borderMed) + "33", color: GC[r.sg] || tk.textSub }}>{r.sg}</span></td>
                            <td style={{ fontWeight: 700, color: tk.textPrimary }}>{r.uniqueAccounts.toLocaleString()}</td>
                            <td style={{ color: "#60a5fa", fontWeight: 700 }}>{r.pct}%</td>
                            <td><Pb tk={tk} pct={r.pct} c={GC[r.sg] || PC[i % PC.length]} /></td>
                          </tr>
                        ))}</tbody>
                      </table>
                    </div>
                  </div>
                </>)}

                {/* View mode toggle */}
                <div style={{ gridColumn: "1/-1", display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: tk.textMuted }}>Display mode:</span>
                  {[["pct", "Penetration %"], ["efforts", "Total Efforts"], ["accounts", "Unique Accounts"]].map(([k, l]) => (
                    <button key={k} className={`mode-btn${penetrationMode === k ? " active" : ""}`} onClick={() => setPenetrationMode(k)}>{l}</button>
                  ))}
                </div>

                {/* Heatmap matrix */}
                <div className="card" style={{ gridColumn: "1/-1" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: tk.textBright }}>
                    Penetration Heatmap — Bucket × Touch Point
                    {penetrationMode === "pct" && <span style={{ fontWeight: 400, fontSize: 12, color: tk.textMuted, marginLeft: 8 }}>Blue intensity = penetration %. Darker = higher reach.</span>}
                    {penetrationMode === "efforts" && <span style={{ fontWeight: 400, fontSize: 12, color: tk.textMuted, marginLeft: 8 }}>Total effort count per bucket × TP combination.</span>}
                    {penetrationMode === "accounts" && <span style={{ fontWeight: 400, fontSize: 12, color: tk.textMuted, marginLeft: 8 }}>Unique accounts worked per bucket × TP combination.</span>}
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ fontSize: 12 }}>
                      <thead>
                        <tr>
                          <th style={{ minWidth: 120, position: "sticky", left: 0, background: tk.bgSurface, zIndex: 2 }}>Bucket</th>
                          <th style={{ color: "#60a5fa" }}>Unique Accts</th>
                          <th style={{ color: tk.textSub }}>Total Efforts</th>
                          {activeTPs.map(tp => (
                            <th key={tp} style={{ color: TP_COLORS[tp] || tk.textSub, textAlign: "center", minWidth: 70 }}>{tp}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {penetrationMatrix.map(row => (
                          <tr key={row.bucket}>
                            <td style={{ fontWeight: 600, position: "sticky", left: 0, background: tk.bgCard, zIndex: 1 }}>
                              <span className="bdg" style={{ background: (BUCKET_COLORS[row.bucket] || tk.textMuted) + "33", color: BUCKET_COLORS[row.bucket] || tk.textSub }}>{row.bucket}</span>
                            </td>
                            <td style={{ color: "#60a5fa", fontWeight: 700 }}>{row.uniqueAccounts.toLocaleString()}</td>
                            <td style={{ color: tk.textSub }}>{row.total.toLocaleString()}</td>
                            {activeTPs.map(tp => {
                              const pct = row[`${tp}_pct`] || 0;
                              const efforts = row[`${tp}_efforts`] || 0;
                              const accounts = row[`${tp}_accounts`] || 0;
                              const displayVal = penetrationMode === "pct" ? (pct > 0 ? pct.toFixed(1) + "%" : "–")
                                : penetrationMode === "efforts" ? (efforts > 0 ? efforts.toLocaleString() : "–")
                                : (accounts > 0 ? accounts.toLocaleString() : "–");
                              const intensity = tpMaxPct[tp] > 0 ? pct / tpMaxPct[tp] : 0;
                              const bg = penetrationMode === "pct"
                                ? (pct === 0 ? tk.heatEmpty : `rgba(59,130,246,${0.08 + intensity * 0.82})`)
                                : (efforts === 0 ? tk.heatEmpty : `rgba(34,197,94,${0.08 + (efforts / Math.max(...penetrationMatrix.map(r => r[`${tp}_efforts`] || 0))) * 0.82})`);
                              const textColor = intensity > 0.55 ? "#fff" : tk.textSub;
                              return (
                                <td key={tp} style={{ padding: "6px 8px", textAlign: "center" }}>
                                  <div style={{
                                    background: bg, color: textColor, borderRadius: 5,
                                    padding: "4px 2px", fontWeight: 600, fontSize: 11,
                                    border: `1px solid ${tk.border}`, minWidth: 54,
                                    transition: "all 0.2s"
                                  }}>
                                    {displayVal}
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Bar chart: penetration % per TP grouped by bucket */}
                <div className="card" style={{ gridColumn: "1/-1" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: tk.textBright }}>Penetration % by Touch Point across Buckets</div>
                  <div style={{ fontSize: 12, color: tk.textMuted, marginBottom: 16 }}>Each group = one touch point. Bars = penetration % per bucket. Higher = more accounts reached in that bucket via that channel.</div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={penetrationBarData} margin={{ bottom: 50 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                      <XAxis dataKey="tp" tick={{ fill: tk.textMuted, fontSize: 11 }} />
                      <YAxis tick={{ fill: tk.textMuted, fontSize: 11 }} unit="%" domain={[0, 100]} />
                      <Tooltip contentStyle={TS} formatter={v => [v.toFixed(1) + "%"]} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      {bucketList.map(b => (
                        <Bar key={b.name} dataKey={b.name} fill={BUCKET_COLORS[b.name] || tk.textMuted} name={b.name} radius={[2, 2, 0, 0]} />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Per-bucket penetration bar chart (grouped by TP) */}
                <div className="card" style={{ gridColumn: "1/-1" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: tk.textBright }}>Penetration % per Bucket by Touch Point</div>
                  <div style={{ fontSize: 12, color: tk.textMuted, marginBottom: 16 }}>Each group = one bucket. Bars = penetration % per touch point within that bucket.</div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={bucketPenetrationChartData} margin={{ bottom: 50 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                      <XAxis dataKey="name" tick={{ fill: tk.textMuted, fontSize: 11 }} angle={bucketList.length > 5 ? -20 : 0} textAnchor={bucketList.length > 5 ? "end" : "middle"} interval={0} />
                      <YAxis tick={{ fill: tk.textMuted, fontSize: 11 }} unit="%" domain={[0, 100]} />
                      <Tooltip contentStyle={TS} formatter={v => [v.toFixed(1) + "%"]} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      {activeTPs.map(tp => (
                        <Bar key={tp} dataKey={tp} fill={TP_COLORS[tp] || tk.textMuted} name={tp} radius={[2, 2, 0, 0]} />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Top penetrations summary */}
                <div className="card" style={{ gridColumn: "1/3" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, color: tk.textBright }}>🏆 Highest Penetration by Touch Point</div>
                  <table>
                    <thead><tr><th>Touch Point</th><th>Best Bucket</th><th>Penetration %</th><th style={{ width: 100 }}>Bar</th></tr></thead>
                    <tbody>{topPenetrations.map((t, i) => (
                      <tr key={t.tp}>
                        <td style={{ color: TP_COLORS[t.tp] || tk.textSub, fontWeight: 600 }}>{t.tp}</td>
                        <td>
                          {t.bucket ? <span className="bdg" style={{ background: (BUCKET_COLORS[t.bucket] || tk.textMuted) + "33", color: BUCKET_COLORS[t.bucket] || tk.textSub }}>{t.bucket}</span> : "–"}
                        </td>
                        <td style={{ color: "#3b82f6", fontWeight: 700 }}>{t.pct.toFixed(1)}%</td>
                        <td><Pb tk={tk} pct={t.pct} c={TP_COLORS[t.tp] || PC[i % PC.length]} /></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>

                {/* Detailed full table */}
                <div className="card" style={{ gridColumn: "3/5" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, color: tk.textBright }}>📊 Accounts Worked per Bucket</div>
                  <table>
                    <thead><tr><th>Bucket</th><th>Unique Accts</th><th>Total Efforts</th><th>Efforts/Acct</th></tr></thead>
                    <tbody>{bucketList.map(b => (
                      <tr key={b.name}>
                        <td><span className="bdg" style={{ background: (BUCKET_COLORS[b.name] || tk.textMuted) + "33", color: BUCKET_COLORS[b.name] || tk.textSub }}>{b.name}</span></td>
                        <td style={{ color: "#60a5fa", fontWeight: 700 }}>{b.uniqueAccounts > 0 ? b.uniqueAccounts.toLocaleString() : "–"}</td>
                        <td style={{ color: tk.textSub }}>{b.total.toLocaleString()}</td>
                        <td style={{ color: "#f59e0b", fontWeight: 600 }}>
                          {b.uniqueAccounts > 0 ? (b.total / b.uniqueAccounts).toFixed(1) : "–"}
                        </td>
                      </tr>
                    ))}</tbody>
                  </table>
                  <div style={{ marginTop: 12, fontSize: 11, color: tk.textFaint }}>Efforts/Acct = avg number of attempts per unique account in each bucket.</div>
                </div>
              </div>
            );
          })())}

          {/* ═══════════════════════════════════════════════════════════════
              ── ⏱️ HOURLY EFFORTS TAB (NEW) ──
          ═══════════════════════════════════════════════════════════════ */}
          {tab === "hourly" && an.hourlyCollectorAnalytics && (() => {
            const { rawRows, allCollectors, noCollector } = an.hourlyCollectorAnalytics;
            const activeTimeKey = data.timek || data.dtk;
            const activeDateKey = data.datек || data.dtk;

            // ── Date Range filter (uses global date filter) ───────────────
            const hasDateFilter = !!(globalDateFrom || globalDateTo);

            const filteredRows = rawRows.filter(r => {
              if (!hasDateFilter) return true;
              const d = r._dateISO; // YYYY-MM-DD — safe string comparison
              if (!d) return false;
              if (globalDateFrom && d < globalDateFrom) return false;
              if (globalDateTo   && d > globalDateTo)   return false;
              return true;
            });

            // Recompute heatmap data from filtered rows
            const collectorHourMap2 = {};
            const hourCollectorMap2 = {};
            filteredRows.forEach(r => {
              const collector = data.rk && r[data.rk] ? String(r[data.rk]).trim() : null;
              const tRaw = activeTimeKey ? r[activeTimeKey] : null;
              if (!collector || !tRaw) return;
              const hr = parseTimeHour(tRaw);
              if (hr === null) return;
              if (!collectorHourMap2[collector]) collectorHourMap2[collector] = {};
              collectorHourMap2[collector][hr] = (collectorHourMap2[collector][hr] || 0) + 1;
              if (!hourCollectorMap2[hr]) hourCollectorMap2[hr] = {};
              hourCollectorMap2[hr][collector] = (hourCollectorMap2[hr][collector] || 0) + 1;
            });

            const sortedCollectors = Object.keys(collectorHourMap2).sort((a, b) => {
              const ta = Object.values(collectorHourMap2[a]).reduce((s, v) => s + v, 0);
              const tb = Object.values(collectorHourMap2[b]).reduce((s, v) => s + v, 0);
              return tb - ta;
            });

            const heatmapRows = sortedCollectors.slice(0, 30).map(col => {
              const hours = collectorHourMap2[col];
              const total = Object.values(hours).reduce((s, v) => s + v, 0);
              const peakHour = Object.entries(hours).sort((a, b) => b[1] - a[1])[0]?.[0];
              const row = { collector: col, total, peakHour: peakHour != null ? `${String(peakHour).padStart(2, "0")}:00` : "–" };
              for (let h = 0; h < 24; h++) row[`h${h}`] = hours[h] || 0;
              return row;
            });

            let heatmapMax = 0;
            heatmapRows.forEach(r => { for (let h = 0; h < 24; h++) { if (r[`h${h}`] > heatmapMax) heatmapMax = r[`h${h}`]; } });

            const hourTopData = Array.from({ length: 24 }, (_, h) => {
              const hMap = hourCollectorMap2[h] || {};
              const total = Object.values(hMap).reduce((s, v) => s + v, 0);
              const topCol = Object.entries(hMap).sort((a, b) => b[1] - a[1])[0];
              return { hour: `${String(h).padStart(2, "0")}:00`, total, topCollector: topCol?.[0] || "–", topCount: topCol?.[1] || 0 };
            });

            // Hourly TP breakdown for filtered rows
            const hourTPMap2 = {};
            filteredRows.forEach(r => {
              const tRaw = activeTimeKey ? r[activeTimeKey] : null;
              if (!tRaw) return;
              const hr = parseTimeHour(tRaw);
              if (hr === null) return;
              if (!hourTPMap2[hr]) hourTPMap2[hr] = {};
              hourTPMap2[hr][r._d.tp] = (hourTPMap2[hr][r._d.tp] || 0) + 1;
            });
            const hourTPData = Array.from({ length: 24 }, (_, h) => ({ hour: `${String(h).padStart(2, "0")}:00`, ...hourTPMap2[h] || {} }));

            const shiftMap2 = { "Early (6–9)": [6,7,8], "Morning (9–12)": [9,10,11], "Afternoon (12–17)": [12,13,14,15,16], "Evening (17–21)": [17,18,19,20], "Night (21–6)": [21,22,23,0,1,2,3,4,5] };
            const shiftData = Object.entries(shiftMap2).map(([label, hours]) => ({
              name: label,
              count: hours.reduce((s, h) => s + (Object.values(hourCollectorMap2[h] || {}).reduce((a, b) => a + b, 0)), 0),
            }));

            const peakHourObj = hourTopData.reduce((a, b) => b.total > a.total ? b : a, hourTopData[0]);
            const totalWithTime = hourTopData.reduce((s, r) => s + r.total, 0);
            const activeTPs_hourly = ALL_TP.filter(tp => hourTPData.some(r => r[tp] > 0));
            const topShift = shiftData.length > 0 ? shiftData.reduce((a, b) => b.count > a.count ? b : a, shiftData[0]) : null;

            return (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
                {/* Note: Date range is controlled by the global filter above the tabs */}
                {(globalDateFrom || globalDateTo) && (
                  <div style={{ gridColumn: "1/-1", fontSize: 11, color: "#60a5fa", background: isDark ? "#172554" : "#dbeafe", border: "1px solid #3b82f6", borderRadius: 7, padding: "6px 14px" }}>
                    📅 Filtered to date range: <strong>{globalDateFrom || "start"}</strong> → <strong>{globalDateTo || "end"}</strong> · {filteredRows.length.toLocaleString()} of {rawRows.length.toLocaleString()} records
                  </div>
                )}
                {/* KPIs */}
                {[
                  { l: "Records w/ Time", v: totalWithTime.toLocaleString(), i: "⏱️", c: "#a78bfa" },
                  { l: "Peak Hour", v: peakHourObj?.hour || "–", i: "🔝", c: "#f59e0b", sub: peakHourObj?.total.toLocaleString() + " efforts" },
                  { l: "Busiest Shift", v: topShift?.name || "–", i: "📊", c: "#3b82f6", sub: topShift?.count.toLocaleString() + " efforts" },
                  { l: "Collectors Tracked", v: noCollector ? "N/A" : sortedCollectors.length, i: "👥", c: "#06b6d4", sub: noCollector ? "No Remark By col" : "" },
                ].map(k => (
                  <div key={k.l} className="sc">
                    <div style={{ fontSize: 20, marginBottom: 6 }}>{k.i}</div>
                    <div style={{ fontSize: 11, color: tk.textMuted, textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600 }}>{k.l}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: k.c, fontFamily: "'Space Grotesk',sans-serif", marginTop: 2 }}>{k.v}</div>
                    {k.sub && <div style={{ fontSize: 11, color: tk.textFaint, marginTop: 2 }}>{k.sub}</div>}
                  </div>
                ))}

                {/* Total efforts by hour */}
                <div className="card" style={{ gridColumn: "1/-1" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: tk.textBright }}>Total Efforts by Hour of Day</div>
                  {totalWithTime > 0 && peakHourObj && (
                    <Insight icon="⏰" color="#f59e0b" text={`Peak activity is at <strong>${peakHourObj.hour}</strong> with <strong>${peakHourObj.total.toLocaleString()}</strong> efforts. ${topShift ? `The <strong>${topShift.name}</strong> window is the busiest shift. ` : ""}Consider scheduling follow-ups and priority calls during peak hours for better contact rates.`} />
                  )}
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={hourTopData} margin={{ left: 0, right: 16 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                      <XAxis dataKey="hour" tick={{ fill: tk.textMuted, fontSize: 10 }} interval={1} />
                      <YAxis tick={{ fill: tk.textMuted, fontSize: 11 }} />
                      <Tooltip contentStyle={TS} formatter={(v, n, p) => [v.toLocaleString() + " efforts", p.payload.hour]} />
                      <Bar dataKey="total" radius={[3, 3, 0, 0]} name="Efforts">
                        {hourTopData.map((h, i) => {
                          const intensity = heatmapMax > 0 ? h.total / Math.max(...hourTopData.map(x => x.total)) : 0;
                          const color = h.total === 0 ? tk.border
                            : intensity > 0.8 ? "#ef4444"
                            : intensity > 0.6 ? "#f97316"
                            : intensity > 0.4 ? "#f59e0b"
                            : intensity > 0.2 ? "#3b82f6"
                            : "#1d4ed8";
                          return <Cell key={i} fill={color} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Shift breakdown */}
                {shiftData.length > 0 && (
                  <div className="card" style={{ gridColumn: "1/3" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: tk.textBright }}>Efforts by Shift Window</div>
                    {topShift && <Insight icon="🕐" color="#3b82f6" text={`<strong>${topShift.name}</strong> is the most active shift with <strong>${topShift.count.toLocaleString()}</strong> efforts. Allocate more collectors to this window for maximum coverage.`} />}
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={shiftData} layout="vertical" margin={{ left: 10, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                        <XAxis type="number" tick={{ fill: tk.textMuted, fontSize: 11 }} />
                        <YAxis type="category" dataKey="name" tick={{ fill: tk.textSub, fontSize: 11 }} width={120} />
                        <Tooltip contentStyle={TS} />
                        <Bar dataKey="count" fill="#a78bfa" radius={[0, 4, 4, 0]} name="Efforts">
                          {shiftData.map((s, i) => <Cell key={i} fill={PC[i % PC.length]} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Touch point by hour stacked */}
                <div className="card" style={{ gridColumn: shiftData.length > 0 ? "3/5" : "1/-1" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: tk.textBright }}>Touch Point Mix by Hour</div>
                  {activeTPs_hourly.length > 0 && (() => {
                    const dominantTP = activeTPs_hourly.reduce((best, tp) => {
                      const total = hourTPData.reduce((s, r) => s + (r[tp] || 0), 0);
                      const bestTotal = hourTPData.reduce((s, r) => s + (r[best] || 0), 0);
                      return total > bestTotal ? tp : best;
                    }, activeTPs_hourly[0]);
                    return <Insight icon="📡" color="#06b6d4" text={`<strong>${dominantTP}</strong> is the most active channel throughout the day. Watch for hours where multiple channels overlap — this signals high-intensity collection periods.`} />;
                  })()}
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={hourTPData} margin={{ left: 0, right: 16 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                      <XAxis dataKey="hour" tick={{ fill: tk.textMuted, fontSize: 9 }} interval={2} />
                      <YAxis tick={{ fill: tk.textMuted, fontSize: 11 }} />
                      <Tooltip contentStyle={TS} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      {activeTPs_hourly.map(tp => <Bar key={tp} dataKey={tp} stackId="h" fill={TP_COLORS[tp] || tk.textMuted} name={tp} />)}
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Hourly line trend stacked */}
                <div className="card" style={{ gridColumn: "1/-1" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: tk.textBright }}>Hourly Touch Point Trend (Lines)</div>
                  <div style={{ fontSize: 12, color: tk.textMuted, marginBottom: 16 }}>See how each channel's activity rises and falls across the day.</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={hourTPData} margin={{ left: 0, right: 16 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                      <XAxis dataKey="hour" tick={{ fill: tk.textMuted, fontSize: 10 }} interval={1} />
                      <YAxis tick={{ fill: tk.textMuted, fontSize: 11 }} />
                      <Tooltip contentStyle={TS} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      {activeTPs_hourly.map(tp => <Line key={tp} type="monotone" dataKey={tp} stroke={TP_COLORS[tp] || tk.textMuted} strokeWidth={2} dot={false} name={tp} />)}
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* ── COLLECTOR HEATMAP (only if rk available) ── */}
                {!noCollector && heatmapRows.length > 0 && <>
                  <div className="card" style={{ gridColumn: "1/-1" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8, flexWrap: "wrap" }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: tk.textBright }}>🔥 Collector × Hour Heatmap</div>
                      <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                        {[["heatmap","🟦 Heatmap"],["bar","📊 Bar"],["top","🏆 Top by Hour"]].map(([k, l]) => (
                          <button key={k} className={`mode-btn${hourlyCollectorView === k ? " active" : ""}`} onClick={() => setHourlyCollectorView(k)}>{l}</button>
                        ))}
                      </div>
                    </div>
                    {(() => {
                      const topC = heatmapRows[0];
                      const peakH = topC?.peakHour;
                      return <Insight icon="🔥" color="#ef4444" text={`<strong>${topC?.collector}</strong> leads with <strong>${topC?.total?.toLocaleString()}</strong> efforts${peakH && peakH !== "–" ? `, peaking at <strong>${peakH}</strong>` : ""}. Red/orange cells indicate high-volume hours per collector. Use this to identify overworked collectors and optimize shift assignments.`} />;
                    })()}

                    {/* Color legend */}
                    <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: tk.textMuted }}>Intensity:</span>
                      {[["0", tk.border],["Low","rgba(59,130,246,0.3)"],["Med","rgba(16,185,129,0.6)"],["High","rgba(245,158,11,0.8)"],["Peak","rgba(239,68,68,0.9)"]].map(([l, c]) => (
                        <span key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: tk.textSub }}>
                          <span style={{ width: 14, height: 14, borderRadius: 3, background: c, display: "inline-block", border: `1px solid ${tk.borderMed}` }} />{l}
                        </span>
                      ))}
                    </div>

                    {hourlyCollectorView === "heatmap" && (
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ fontSize: 11, borderCollapse: "separate", borderSpacing: 2 }}>
                          <thead>
                            <tr>
                              <th style={{ position: "sticky", left: 0, background: tk.bgSurface, minWidth: 130, zIndex: 2, textAlign: "left" }}>Collector</th>
                              <th style={{ color: "#22c55e", minWidth: 60 }}>Total</th>
                              <th style={{ color: "#a78bfa", minWidth: 60 }}>Peak Hr</th>
                              {Array.from({ length: 24 }, (_, h) => (
                                <th key={h} style={{ color: tk.textFaint, minWidth: 28, textAlign: "center", padding: "4px 2px" }}>
                                  {String(h).padStart(2,"0")}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {heatmapRows.map(row => (
                              <tr key={row.collector}>
                                <td style={{ position: "sticky", left: 0, background: tk.bgCard, fontWeight: 600, color: tk.textPrimary, padding: "4px 8px", zIndex: 1 }}>{row.collector}</td>
                                <td style={{ color: "#22c55e", fontWeight: 700, textAlign: "center" }}>{row.total.toLocaleString()}</td>
                                <td style={{ color: "#a78bfa", textAlign: "center" }}>{row.peakHour}</td>
                                {Array.from({ length: 24 }, (_, h) => {
                                  const val = row[`h${h}`] || 0;
                                  const bg = hourlyColor(val, heatmapMax);
                                  return (
                                    <td key={h} style={{ padding: "2px" }}>
                                      <div className="hm-cell" style={{
                                        background: bg,
                                        color: val > heatmapMax * 0.5 ? "#fff" : tk.textMuted,
                                        title: `${row.collector} @ ${String(h).padStart(2,"0")}:00 — ${val} efforts`
                                      }}>
                                        {val > 0 ? val : ""}
                                      </div>
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {hourlyCollectorView === "bar" && (
                      <div>
                        <div style={{ fontSize: 12, color: tk.textMuted, marginBottom: 12 }}>Top 15 collectors — stacked bar showing effort distribution across hours</div>
                        <ResponsiveContainer width="100%" height={Math.max(300, heatmapRows.slice(0,15).length * 22 + 80)}>
                          <BarChart data={heatmapRows.slice(0, 15).map(r => {
                            const row = { name: r.collector };
                            // Group into time buckets for readability
                            row["00-06"] = Array.from({length:6},(_,h)=>r[`h${h}`]||0).reduce((s,v)=>s+v,0);
                            row["06-09"] = Array.from({length:3},(_,h)=>r[`h${h+6}`]||0).reduce((s,v)=>s+v,0);
                            row["09-12"] = Array.from({length:3},(_,h)=>r[`h${h+9}`]||0).reduce((s,v)=>s+v,0);
                            row["12-15"] = Array.from({length:3},(_,h)=>r[`h${h+12}`]||0).reduce((s,v)=>s+v,0);
                            row["15-18"] = Array.from({length:3},(_,h)=>r[`h${h+15}`]||0).reduce((s,v)=>s+v,0);
                            row["18-21"] = Array.from({length:3},(_,h)=>r[`h${h+18}`]||0).reduce((s,v)=>s+v,0);
                            row["21-24"] = Array.from({length:3},(_,h)=>r[`h${h+21}`]||0).reduce((s,v)=>s+v,0);
                            return row;
                          })} layout="vertical" margin={{ left: 10, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                            <XAxis type="number" tick={{ fill: tk.textMuted, fontSize: 11 }} />
                            <YAxis type="category" dataKey="name" tick={{ fill: tk.textSub, fontSize: 11 }} width={130} />
                            <Tooltip contentStyle={TS} />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                            {["00-06","06-09","09-12","12-15","15-18","18-21","21-24"].map((slot, i) => (
                              <Bar key={slot} dataKey={slot} stackId="t" fill={PC[i % PC.length]} name={slot} />
                            ))}
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {hourlyCollectorView === "top" && (
                      <div>
                        <div style={{ fontSize: 12, color: tk.textMuted, marginBottom: 12 }}>For each hour, the collector with the most efforts.</div>
                        <table>
                          <thead><tr><th>Hour</th><th>Total Efforts</th><th>Top Collector</th><th>Their Count</th><th>Share</th><th style={{ width: 120 }}>Bar</th></tr></thead>
                          <tbody>{hourTopData.map(h => (
                            <tr key={h.hour}>
                              <td style={{ fontWeight: 700, color: "#a78bfa" }}>{h.hour}</td>
                              <td style={{ color: tk.textSub }}>{h.total.toLocaleString()}</td>
                              <td style={{ color: tk.textPrimary, fontWeight: 500 }}>{h.total > 0 ? h.topCollector : "–"}</td>
                              <td style={{ color: "#22c55e" }}>{h.topCount > 0 ? h.topCount.toLocaleString() : "–"}</td>
                              <td style={{ color: "#60a5fa" }}>{h.total > 0 && h.topCount > 0 ? ((h.topCount / h.total) * 100).toFixed(1) + "%" : "–"}</td>
                              <td><Pb tk={tk} pct={peakHourObj?.total > 0 ? (h.total / peakHourObj.total) * 100 : 0} c="#a78bfa" /></td>
                            </tr>
                          ))}</tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Collector peak hour distribution */}
                  <div className="card" style={{ gridColumn: "1/3" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: tk.textBright }}>Collector Peak Hour Distribution</div>
                    <div style={{ fontSize: 12, color: tk.textMuted, marginBottom: 16 }}>How many collectors peak at each hour of the day?</div>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={Array.from({length:24},(_,h)=>({
                        hour: `${String(h).padStart(2,"0")}:00`,
                        collectors: heatmapRows.filter(r => r.peakHour === `${String(h).padStart(2,"0")}:00`).length
                      }))} margin={{ left: 0, right: 16 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                        <XAxis dataKey="hour" tick={{ fill: tk.textMuted, fontSize: 9 }} interval={2} />
                        <YAxis tick={{ fill: tk.textMuted, fontSize: 11 }} />
                        <Tooltip contentStyle={TS} formatter={v => [v + " collectors"]} />
                        <Bar dataKey="collectors" fill="#f59e0b" radius={[3, 3, 0, 0]} name="Collectors peaking" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Top collectors table with peak hours */}
                  <div className="card" style={{ gridColumn: "3/5" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, color: tk.textBright }}>Collector Summary — Hourly Profile</div>
                    <div style={{ overflowY: "auto", maxHeight: 280 }}>
                      <table>
                        <thead><tr><th>#</th><th>Collector</th><th>Total</th><th>Peak Hr</th><th>06-12</th><th>12-18</th><th>18-24</th></tr></thead>
                        <tbody>{heatmapRows.map((r, i) => {
                          const am = Array.from({length:6},(_,h)=>r[`h${h+6}`]||0).reduce((s,v)=>s+v,0);
                          const pm = Array.from({length:6},(_,h)=>r[`h${h+12}`]||0).reduce((s,v)=>s+v,0);
                          const eve = Array.from({length:6},(_,h)=>r[`h${h+18}`]||0).reduce((s,v)=>s+v,0);
                          return (
                            <tr key={r.collector}>
                              <td style={{ color: tk.textFaint }}>{i + 1}</td>
                              <td style={{ fontWeight: 600, color: tk.textPrimary }}>{r.collector}</td>
                              <td style={{ color: "#22c55e", fontWeight: 700 }}>{r.total.toLocaleString()}</td>
                              <td style={{ color: "#a78bfa" }}>{r.peakHour}</td>
                              <td style={{ color: "#3b82f6" }}>{am}</td>
                              <td style={{ color: "#f59e0b" }}>{pm}</td>
                              <td style={{ color: "#f97316" }}>{eve}</td>
                            </tr>
                          );
                        })}</tbody>
                      </table>
                    </div>
                  </div>
                </>}

                {noCollector && (
                  <div className="card" style={{ gridColumn: "1/-1", border: `1px solid ${tk.borderMed}` }}>
                    <div style={{ color: tk.textMuted, fontSize: 13, textAlign: "center", padding: 20 }}>
                      ℹ️ No "Remark By" column detected — collector-level hourly heatmap unavailable. The hourly charts above still show total efforts and touch point breakdown by hour.
                    </div>
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
            {/* const fieldPTPRate = fa.totalFieldVisits>0?((fa.fieldPtpCount/fa.totalFieldVisits)*100).toFixed(1):0; */}

            return (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:12 }}>
                {/* KPIs */}
                {/*{ l:"Field PTP Count", v:fa.fieldPtpCount.toLocaleString(), i:"💰", c:"#22c55e", sub:"Rate: "+fieldPTPRate+"%" },
                  { l:"Field PTP Amount", v:"₱"+fN(fa.fieldPtpAmt), i:"💳", c:"#06b6d4" }, */}
                {[
                  { l:"Total Field Visits", v:fa.totalFieldVisits.toLocaleString(), i:"🚗", c:"#22c55e" },
                  { l:"Unique Accts Visited", v:fa.uniqueFieldAccounts!=null?fa.uniqueFieldAccounts.toLocaleString():"N/A", i:"👤", c:"#3b82f6" },
                  { l:"Field Rate", v:fa.fieldRate!=null?fa.fieldRate+"%":"N/A", i:"💹", c:"#06b6d4" },
                  { l:"Active Field Days", v:fa.activeDays, i:"📅", c:"#a78bfa" },
                  { l:"Avg Visits/Day", v:fa.avgVisitsPerDay, i:"📊", c:"#f59e0b" },
                  { l:"Peak Field Day", v:fa.peakFieldDay?.date||"–", i:"🔝", c:"#f97316", sub:fa.peakFieldDay?.count.toLocaleString()+" visits" },
                  { l:"Buckets Visited", v:fa.bucketVisitData.length, i:"📍", c:"#ec4899" },

                ].map(k=>(
                  <div key={k.l} className="sc">
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
                      <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
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
                          <Pb tk={tk} pct={parseFloat(b.pctOfAccts)} c={BUCKET_COLORS[b.name]||"#3b82f6"} />
                        </div>
                      ))}
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={fa.bucketVisitData.filter(b=>b.totalAccts>0)} margin={{ bottom:30 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
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
                          <td><Pb tk={tk} pct={(b.visits/fa.bucketVisitData[0].visits)*100} c={BUCKET_COLORS[b.name]||"#3b82f6"} /></td>
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
                        <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
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
                        <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
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
                        <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                        <XAxis type="number" tick={{ fill:"#6b7280",fontSize:11 }} />
                        <YAxis type="category" dataKey="name" tick={{ fill:"#9ca3af",fontSize:10 }} width={120} />
                        <Tooltip contentStyle={TS} />
                        <Bar dataKey="count" radius={[0,4,4,0]} fill="#22c55e" name="Visits" label={{ position:"right", fill:"#6b7280", fontSize:10, formatter:v=>v.toLocaleString() }}>
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
                          <td style={{ fontWeight:500, color:tk.textPrimary }}>{s.status}</td>
                          <td><span className="bdg" style={{ background:(GC[s.grp]||"#22c55e")+"33", color:GC[s.grp]||"#22c55e" }}>{s.grp}</span></td>
                          <td style={{ fontWeight:700, color:"#22c55e" }}>{s.count.toLocaleString()}</td>
                          <td style={{ color:"#60a5fa" }}>{s.pct}%</td>
                          <td><Pb tk={tk} pct={parseFloat(s.pct)} c={GC[s.grp]||"#22c55e"} /></td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ════════════════════════════════════════════════════════════════
              ── 🔽 PTP CONVERSION FUNNEL TAB ──
          ════════════════════════════════════════════════════════════════ */}
          {tab === "funnel" && (() => {
            const { stages, stepConv, hasAccount, bucketFunnel, collectorFunnel, totalUA } = an.funnelAnalytics;
            const maxVal = stages[0]?.value || 1;
            return (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:14 }}>
                {/* Header */}
                <div style={{ gridColumn:"1/-1", background:isDark ? "#0f1f3d" : "#eff6ff", border:`1px solid ${isDark ? "#1e3a5f" : "#bfdbfe"}`, borderRadius:12, padding:"14px 18px" }}>
                  <div style={{ fontWeight:700, fontSize:15, color:tk.textBright, marginBottom:4 }}>🔽 Promise-to-Pay Conversion Funnel</div>
                  <div style={{ fontSize:13, color:tk.textMuted }}>
                    {hasAccount
                      ? `Tracks how accounts move through: All Accounts → Right Party Contact → PTP Set → PTP Kept. Based on ${totalUA?.toLocaleString()} unique accounts.`
                      : "No Account No. column — showing effort-based funnel counts instead of unique accounts."}
                  </div>
                </div>

                {/* Visual funnel bars */}
                <div className="card" style={{ gridColumn:"1/3" }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:16, color:tk.textBright }}>Funnel Stages</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    {stages.map((s, i) => {
                      const w = maxVal > 0 ? Math.max((s.value / maxVal) * 100, 4) : 4;
                      const prev = i > 0 ? stages[i-1] : null;
                      const drop = prev && prev.value > 0 ? (((prev.value - s.value) / prev.value) * 100).toFixed(1) : null;
                      return (
                        <div key={s.label}>
                          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:5 }}>
                            <div style={{ fontSize:13, fontWeight:600, color:tk.textPrimary }}>{s.label}</div>
                            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                              {drop !== null && parseFloat(drop) > 0 && (
                                <span style={{ fontSize:11, color:"#ef4444", background:"#450a0a", padding:"1px 7px", borderRadius:10 }}>↓ {drop}% drop</span>
                              )}
                              <span style={{ fontSize:15, fontWeight:700, color:s.color }}>{s.value.toLocaleString()}</span>
                              <span style={{ fontSize:12, color:tk.textFaint }}>{s.pct}%</span>
                            </div>
                          </div>
                          <div style={{ height:30, background:tk.bgSurface, borderRadius:6, overflow:"hidden" }}>
                            <div style={{ height:"100%", width:w+"%", background:s.color, borderRadius:6, opacity:0.85, display:"flex", alignItems:"center", paddingLeft:10, transition:"width .4s" }}>
                              <span style={{ fontSize:11, fontWeight:600, color:"#fff", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.sub}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Step conversion rates */}
                <div className="card" style={{ gridColumn:"3/5" }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:16, color:tk.textBright }}>Stage-to-Stage Conversion</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
                    {stepConv.map((s, i) => (
                      <div key={i}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                          <div style={{ fontSize:12, color:tk.textSub }}>
                            <span style={{ color:"#60a5fa" }}>{s.from}</span>
                            <span style={{ color:tk.textFaint }}> → </span>
                            <span style={{ color:"#f59e0b" }}>{s.to}</span>
                          </div>
                          <span style={{ fontWeight:700, fontSize:18, color: parseFloat(s.rate)>=50?"#22c55e":parseFloat(s.rate)>=25?"#f59e0b":"#ef4444" }}>
                            {s.rate}%
                          </span>
                        </div>
                        <div style={{ height:12, background:tk.bgSurface, borderRadius:6, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:Math.min(parseFloat(s.rate),100)+"%", background:parseFloat(s.rate)>=50?"#22c55e":parseFloat(s.rate)>=25?"#f59e0b":"#ef4444", borderRadius:6 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop:20, borderTop:`1px solid ${tk.border}`, paddingTop:14, display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                    {[
                      { l:"PTP Set Rate",  v: stages[0]?.value>0?((stages.find(s=>s.label.includes("PTP Set"))?.value||0)/stages[0].value*100).toFixed(1)+"%" : "N/A", c:"#f59e0b" },
                      { l:"PTP Kept Rate", v: stages[0]?.value>0?((stages.find(s=>s.label.includes("Kept"))?.value||0)/stages[0].value*100).toFixed(1)+"%" : "N/A", c:"#22c55e" },
                    ].map(k=>(
                      <div key={k.l} className="sc" style={{ padding:12 }}>
                        <div style={{ fontSize:10, color:tk.textMuted, textTransform:"uppercase", letterSpacing:".06em" }}>{k.l}</div>
                        <div style={{ fontSize:24, fontWeight:700, color:k.c, fontFamily:"'Space Grotesk',sans-serif", marginTop:4 }}>{k.v}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Funnel bar chart */}
                <div className="card" style={{ gridColumn:"1/-1" }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:4, color:tk.textBright }}>Funnel Volume Chart</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={stages.filter(s=>!s.label.includes("Broken"))} layout="vertical" margin={{ left:20, right:70 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                      <XAxis type="number" tick={{ fill:tk.textMuted, fontSize:11 }} />
                      <YAxis type="category" dataKey="label" tick={{ fill:tk.textSub, fontSize:11 }} width={170} />
                      <Tooltip contentStyle={TS} formatter={(v)=>[v.toLocaleString(), hasAccount?"Accounts":"Efforts"]} />
                      <Bar dataKey="value" radius={[0,6,6,0]} label={{ position:"right", fill:tk.textMuted, fontSize:11, formatter:(v)=>v.toLocaleString() }}>
                        {stages.filter(s=>!s.label.includes("Broken")).map((s,i)=><Cell key={i} fill={s.color} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* By-bucket funnel */}
                {bucketFunnel && bucketFunnel.length > 0 && (
                  <div className="card" style={{ gridColumn:"1/-1" }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8, marginBottom:8 }}>
                      <div>
                        <div style={{ fontWeight:700, fontSize:14, color:tk.textBright }}>📍 Funnel by Bucket</div>
                        <div style={{ fontSize:12, color:tk.textMuted }}>Conversion rates per bucket. Conv. Rate = Kept ÷ PTP Set.</div>
                      </div>
                      <ExportBtn onClick={() => exportXlsx(bucketFunnel.map(b=>({
                        Bucket:b.name, "Total Accounts":b.total, "RPC Accounts":b.rpc, "PTP Set":b.ptp, "PTP Kept":b.kept,
                        "RPC Rate%":b.rpcRate, "PTP Set Rate%":b.ptpRate, "Kept Rate%":b.keptRate, "Conv Rate%":b.convRate
                      })), "funnel_by_bucket.xlsx")} />
                    </div>
                    <div style={{ overflowX:"auto" }}>
                      <table>
                        <thead><tr>
                          <th>Bucket</th><th>Total Accts</th>
                          <th style={{ color:"#a78bfa" }}>RPC</th><th style={{ color:"#a78bfa" }}>RPC%</th>
                          <th style={{ color:"#f59e0b" }}>PTP Set</th><th style={{ color:"#f59e0b" }}>PTP%</th>
                          <th style={{ color:"#22c55e" }}>Kept</th><th style={{ color:"#22c55e" }}>Kept%</th>
                          <th style={{ color:"#06b6d4" }}>Conv.%</th>
                        </tr></thead>
                        <tbody>{bucketFunnel.map(b=>(
                          <tr key={b.name}>
                            <td><span className="bdg" style={{ background:(BUCKET_COLORS[b.name]||tk.textMuted)+"33", color:BUCKET_COLORS[b.name]||tk.textSub }}>{b.name}</span></td>
                            <td style={{ fontWeight:700 }}>{b.total.toLocaleString()}</td>
                            <td style={{ color:"#a78bfa" }}>{b.rpc.toLocaleString()}</td>
                            <td style={{ color:"#a78bfa" }}>{b.rpcRate}%</td>
                            <td style={{ color:"#f59e0b" }}>{b.ptp.toLocaleString()}</td>
                            <td style={{ color:"#f59e0b" }}>{b.ptpRate}%</td>
                            <td style={{ color:"#22c55e" }}>{b.kept.toLocaleString()}</td>
                            <td style={{ color:"#22c55e" }}>{b.keptRate}%</td>
                            <td style={{ fontWeight:700, color:"#06b6d4" }}>{b.convRate}%</td>
                          </tr>
                        ))}</tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* By-collector funnel */}
                {collectorFunnel && collectorFunnel.length > 0 && (
                  <div className="card" style={{ gridColumn:"1/-1" }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8, marginBottom:8 }}>
                      <div>
                        <div style={{ fontWeight:700, fontSize:14, color:tk.textBright }}>👥 Funnel by Collector (top 30)</div>
                        <div style={{ fontSize:12, color:tk.textMuted }}>Each collector's pipeline — unique accounts per stage.</div>
                      </div>
                      <ExportBtn onClick={() => exportXlsx(collectorFunnel.map(c=>({
                        Collector:c.name, "Total Accounts":c.total, "RPC Accounts":c.rpc, "PTP Set":c.ptp, "PTP Kept":c.kept,
                        "RPC Rate%":c.rpcRate, "PTP Set Rate%":c.ptpRate, "Kept Rate%":c.keptRate, "Conv Rate%":c.convRate
                      })), "funnel_by_collector.xlsx")} />
                    </div>
                    <div style={{ overflowX:"auto", maxHeight:400, overflowY:"auto" }}>
                      <table>
                        <thead><tr>
                          <th>#</th><th>Collector</th><th>Accts</th>
                          <th style={{ color:"#a78bfa" }}>RPC</th><th style={{ color:"#a78bfa" }}>RPC%</th>
                          <th style={{ color:"#f59e0b" }}>PTP</th><th style={{ color:"#f59e0b" }}>PTP%</th>
                          <th style={{ color:"#22c55e" }}>Kept</th><th style={{ color:"#22c55e" }}>Kept%</th>
                          <th style={{ color:"#06b6d4" }}>Conv.%</th>
                        </tr></thead>
                        <tbody>{collectorFunnel.map((c,i)=>(
                          <tr key={c.name}>
                            <td style={{ color:tk.textFaint }}>{i+1}</td>
                            <td style={{ fontWeight:600, color:tk.textPrimary }}>{c.name}</td>
                            <td style={{ fontWeight:700 }}>{c.total.toLocaleString()}</td>
                            <td style={{ color:"#a78bfa" }}>{c.rpc.toLocaleString()}</td>
                            <td style={{ color:"#a78bfa" }}>{c.rpcRate}%</td>
                            <td style={{ color:"#f59e0b" }}>{c.ptp.toLocaleString()}</td>
                            <td style={{ color:"#f59e0b" }}>{c.ptpRate}%</td>
                            <td style={{ color:"#22c55e" }}>{c.kept.toLocaleString()}</td>
                            <td style={{ color:"#22c55e" }}>{c.keptRate}%</td>
                            <td style={{ fontWeight:700, color:"#06b6d4" }}>{c.convRate}%</td>
                          </tr>
                        ))}</tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
          
          {/* ════════════════════════════════════════════════════════════════
              ── 💔 BROKEN PROMISE (BP) TAB ──
          ════════════════════════════════════════════════════════════════ */}
          {tab === "bp" && (() => {
            if (!an.bpAnalytics) return (
              <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>💔</div>
                <div style={{ fontWeight: 700, fontSize: 18, color: tk.textBright, marginBottom: 8 }}>Broken Promise Analysis Unavailable</div>
                <div style={{ fontSize: 13, color: tk.textMuted, maxWidth: 480, margin: "0 auto", lineHeight: 1.6 }}>
                  Requires <code style={{ color:"#60a5fa",background:tk.bgSurface,padding:"1px 6px",borderRadius:4 }}>Account No.</code>, <code style={{ color:"#60a5fa",background:tk.bgSurface,padding:"1px 6px",borderRadius:4 }}>PTP Amount</code>, and <code style={{ color:"#60a5fa",background:tk.bgSurface,padding:"1px 6px",borderRadius:4 }}>PTP Date</code> columns.
                  Claim Paid Date is used to verify if the PTP was honored.
                </div>
              </div>
            );
            const { bpAccounts, keptAccounts, totalPTPAccounts, bpRate, bpTotalAmt, bpDateTrend, bpCollectorData, bpBucketData } = an.bpAnalytics;
            const filteredBP = bpSearch.trim()
              ? bpAccounts.filter(b => b.acct.toLowerCase().includes(bpSearch.toLowerCase()) || b.collector.toLowerCase().includes(bpSearch.toLowerCase()) || b.bucket.toLowerCase().includes(bpSearch.toLowerCase()) || (b.debtor && b.debtor.toLowerCase().includes(bpSearch.toLowerCase())))
              : bpAccounts;
            return (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
                {/* KPIs */}
                {[
                  { l:"Total PTP Accounts", v:totalPTPAccounts.toLocaleString(), i:"🤝", c:"#f59e0b", sub:"accounts with PTP date" },
                  { l:"Broken Promises", v:bpAccounts.length.toLocaleString(), i:"💔", c:"#ef4444", sub:`${bpRate}% of PTP accounts` },
                  { l:"Kept Promises", v:keptAccounts.length.toLocaleString(), i:"✅", c:"#22c55e", sub:`${totalPTPAccounts>0?((keptAccounts.length/totalPTPAccounts)*100).toFixed(1):0}% of PTP accounts` },
                  { l:"BP Amount at Risk", v:"₱"+fN(bpTotalAmt), i:"💸", c:"#f97316", sub:"sum of broken PTP amounts" },
                ].map(k=>(
                  <div key={k.l} className="sc">
                    <div style={{ fontSize:20,marginBottom:6 }}>{k.i}</div>
                    <div style={{ fontSize:11,color:tk.textMuted,textTransform:"uppercase",letterSpacing:".06em",fontWeight:600 }}>{k.l}</div>
                    <div style={{ fontSize:18,fontWeight:700,color:k.c,fontFamily:"'Space Grotesk',sans-serif",marginTop:2 }}>{k.v}</div>
                    <div style={{ fontSize:11,color:tk.textFaint,marginTop:2 }}>{k.sub}</div>
                  </div>
                ))}

                {/* BP Rate Gauge */}
                <div className="card" style={{ gridColumn:"1/3" }}>
                  <div style={{ fontWeight:700,fontSize:14,marginBottom:4,color:tk.textBright }}>📊 PTP Fulfillment Rate</div>
                  <Insight icon="💔" color={parseFloat(bpRate)>50?"#ef4444":"#22c55e"} text={`<strong>${bpRate}%</strong> of PTP accounts are broken promises — <strong>${bpAccounts.length.toLocaleString()}</strong> accounts have no claim paid recorded. ${parseFloat(bpRate)>50?"⚠️ More than half of PTPs are unfulfilled. Prioritize follow-ups on these accounts.":"✅ Fulfillment rate is healthy. Continue monitoring for new broken promises."}`} />
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={[
                        { name:"KEPT", value:keptAccounts.length },
                        { name:"BP", value:bpAccounts.length },
                      ]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90}
                        label={({name,percent})=>`${name} ${(percent*100).toFixed(1)}%`} labelLine={false}>
                        <Cell fill="#22c55e" />
                        <Cell fill="#ef4444" />
                      </Pie>
                      <Tooltip contentStyle={TS} formatter={(v)=>[v.toLocaleString(),"Accounts"]} />
                      <Legend wrapperStyle={{ fontSize:12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* BP date trend */}
                {bpDateTrend.length > 0 && (
                  <div className="card" style={{ gridColumn:"3/5" }}>
                    <div style={{ fontWeight:700,fontSize:14,marginBottom:4,color:tk.textBright }}>📅 Broken PTP Date Trend</div>
                    {(() => {
                      const peak = bpDateTrend.reduce((a,b)=>b.count>a.count?b:a, bpDateTrend[0]);
                      return <Insight icon="📅" color="#ef4444" text={`Peak broken promises occurred on <strong>${peak?.date}</strong> with <strong>${peak?.count}</strong> accounts. Dates with many BPs may indicate a batch of follow-ups that were missed — review collector activity around those dates.`} />;
                    })()}
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={bpDateTrend} margin={{ bottom:60, top:20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                        <XAxis dataKey="date" tick={{ fill:tk.textMuted,fontSize:9 }} angle={-40} textAnchor="end" interval={Math.max(0,Math.floor(bpDateTrend.length/12)-1)} />
                        <YAxis tick={{ fill:tk.textMuted,fontSize:11 }} />
                        <Tooltip contentStyle={TS} />
                        <Bar dataKey="count" fill="#ef4444" radius={[3,3,0,0]} name="Broken PTPs" label={{ position:"top", fill:tk.textMuted, fontSize:10, formatter:v=>v>0?v:"" }} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* BP by collector */}
                {bpCollectorData.length > 0 && (
                  <div className="card" style={{ gridColumn:"1/3" }}>
                    <div style={{ fontWeight:700,fontSize:14,marginBottom:4,color:tk.textBright }}>👥 BPs by Collector</div>
                    <Insight icon="👥" color="#f97316" text={`<strong>${bpCollectorData[0]?.name}</strong> has the most broken promises (<strong>${bpCollectorData[0]?.count}</strong>, ${bpCollectorData[0]?.pct}% of all BPs). High BP counts may indicate missed follow-ups or accounts needing reassignment.`} />
                    <ResponsiveContainer width="100%" height={Math.max(200, bpCollectorData.slice(0,10).length * 32)}>
                      <BarChart data={bpCollectorData.slice(0,10)} layout="vertical" margin={{ left:0,right:50 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                        <XAxis type="number" tick={{ fill:tk.textMuted,fontSize:11 }} />
                        <YAxis type="category" dataKey="name" tick={{ fill:tk.textSub,fontSize:10 }} width={140} />
                        <Tooltip contentStyle={TS} />
                        <Bar dataKey="count" fill="#f97316" radius={[0,4,4,0]} name="Broken PTPs" label={{ position:"right", fill:tk.textMuted, fontSize:10, formatter:v=>v.toLocaleString() }} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* BP by bucket */}
                {bpBucketData.length > 0 && (
                  <div className="card" style={{ gridColumn:"3/5" }}>
                    <div style={{ fontWeight:700,fontSize:14,marginBottom:4,color:tk.textBright }}>📍 BPs by Bucket</div>
                    <Insight icon="📍" color="#ef4444" text={`<strong>${bpBucketData[0]?.name}</strong> has the highest concentration of broken promises with <strong>${bpBucketData[0]?.count}</strong> accounts (${bpBucketData[0]?.pct}%). Focus recovery efforts on this bucket first.`} />
                    <ResponsiveContainer width="100%" height={Math.max(200, bpBucketData.length * 36)}>
                      <BarChart data={bpBucketData} layout="vertical" margin={{ left:0,right:50 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                        <XAxis type="number" tick={{ fill:tk.textMuted,fontSize:11 }} />
                        <YAxis type="category" dataKey="name" tick={{ fill:tk.textSub,fontSize:10 }} width={120} />
                        <Tooltip contentStyle={TS} />
                        <Bar dataKey="count" radius={[0,4,4,0]} name="Broken PTPs" label={{ position:"right", fill:tk.textMuted, fontSize:10, formatter:v=>v.toLocaleString() }}>
                          {bpBucketData.map((b,i)=><Cell key={i} fill={BUCKET_COLORS[b.name]||PC[i%PC.length]} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Full BP account list */}
                <div className="card" style={{ gridColumn:"1/-1" }}>
                  <div style={{ fontWeight:700,fontSize:14,marginBottom:4,color:tk.textBright }}>
                     Broken Promise Account List — {bpAccounts.length.toLocaleString()} accounts
                  </div>
                  <div style={{ fontSize:12,color:tk.textMuted,marginBottom:12 }}>
                    Accounts with a PTP date but <strong style={{ color:"#ef4444" }}>no Claim Paid</strong> recorded. Sorted by most recent PTP date first.
                  </div>
                  <SearchBar tk={tk} value={bpSearch} onChange={setBpSearch} placeholder="Filter by account, debtor, collector, or bucket..." />
                  <div style={{ overflowX:"auto", maxHeight:480, overflowY:"auto" }}>
                    <table>
                      <thead><tr>
                        <th>#</th>
                        <th>Account No.</th>
                        {data.dnk && <th>Debtor</th>}
                        <th style={{ color:"#ef4444" }}>PTP Date</th>
                        <th>PTP Amount</th>
                        <th style={{ color:tk.textMuted }}>Last Claim Date</th>
                        <th>Collector</th>
                        <th>Bucket</th>
                        {data.clk && <th>Client</th>}
                      </tr></thead>
                      <tbody>{filteredBP.map((b, i) => (
                        <tr key={b.acct}>
                          <td style={{ color:tk.textFaint }}>{i+1}</td>
                          <td style={{ fontWeight:600,color:tk.textPrimary,fontFamily:"monospace",fontSize:12 }}>{b.acct}</td>
                          {data.dnk && <td style={{ color:tk.textSub,fontSize:12 }}>{b.debtor !== "–" ? b.debtor : <span style={{ color:tk.borderMed }}>–</span>}</td>}
                          <td style={{ color:"#ef4444",fontWeight:600 }}>{b.ptpDate}</td>
                          <td style={{ color:"#f59e0b" }}>₱{fN(b.ptpAmt)}</td>
                          <td style={{ color:tk.textMuted,fontStyle: b.claimDate==="–"?"italic":"normal" }}>{b.claimDate}</td>
                          <td style={{ color:tk.textSub }}>{b.collector}</td>
                          <td>
                            {b.bucket !== "–"
                              ? <span className="bdg" style={{ background:(BUCKET_COLORS[b.bucket]||tk.textMuted)+"33",color:BUCKET_COLORS[b.bucket]||tk.textSub }}>{b.bucket}</span>
                              : <span style={{ color:tk.borderMed }}>–</span>}
                          </td>
                          {data.clk && <td style={{ color:tk.textMuted }}>{b.client}</td>}
                        </tr>
                      ))}</tbody>
                    </table>
                    {filteredBP.length === 0 && (
                      <div style={{ textAlign:"center",padding:"24px",color:tk.textFaint,fontSize:13 }}>
                        {bpSearch ? "No results match your search." : "No broken promises found — all PTPs were honored! 🎉"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ════════════════════════════════════════════════════════════════
              ── 👥📍 COLLECTOR × BUCKET TAB ──
          ════════════════════════════════════════════════════════════════ */}
          {tab === "colbucket" && (() => {
            if (!an.collectorBucketAnalytics) return (
              <div className="card" style={{ textAlign:"center",padding:"48px 24px" }}>
                <div style={{ fontSize:40,marginBottom:16 }}>👥📍</div>
                <div style={{ fontWeight:700,fontSize:18,color:tk.textBright,marginBottom:8 }}>Collector × Bucket Analysis Unavailable</div>
                <div style={{ fontSize:13,color:tk.textMuted,maxWidth:480,margin:"0 auto",lineHeight:1.6 }}>
                  Requires both a <code style={{ color:"#60a5fa",background:tk.bgSurface,padding:"1px 6px",borderRadius:4 }}>Remark By</code> column and an <code style={{ color:"#60a5fa",background:tk.bgSurface,padding:"1px 6px",borderRadius:4 }}>Old IC / Bucket</code> column.
                </div>
              </div>
            );
            const { collectorBucketRows, cbHeatmap, cbHeatmapMax, allBuckets, bucketSummaryForCollectors } = an.collectorBucketAnalytics;

            // Heatmap color: blue gradient
            const cbColor = (val, max) => {
              if (!val || max === 0) return tk.heatEmpty;
              const i = val / max;
              if (i < 0.2) return `rgba(59,130,246,${0.15+i*1.5})`;
              if (i < 0.5) return `rgba(16,185,129,${0.25+i})`;
              if (i < 0.75) return `rgba(245,158,11,${0.35+i*0.9})`;
              return `rgba(239,68,68,${0.45+i*0.55})`;
            };

            return (
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12 }}>
                {/* KPIs */}
                {[
                  { l:"Total Collectors", v:collectorBucketRows.length, i:"👥", c:"#3b82f6" },
                  { l:"Active Buckets", v:allBuckets.length, i:"📍", c:"#f97316" },
                  { l:"Avg Buckets / Collector", v:collectorBucketRows.length>0?(collectorBucketRows.reduce((s,c)=>s+Object.keys(c.buckets).length,0)/collectorBucketRows.length).toFixed(1):"–", i:"📊", c:"#a78bfa", sub:"how many buckets each collector touches" },
                  { l:"Most Worked Bucket", v:bucketSummaryForCollectors[0]?.bucket||"–", i:"🏆", c:"#22c55e", sub:bucketSummaryForCollectors[0]?.totalEfforts.toLocaleString()+" efforts" },
                ].map(k=>(
                  <div key={k.l} className="sc">
                    <div style={{ fontSize:20,marginBottom:6 }}>{k.i}</div>
                    <div style={{ fontSize:11,color:tk.textMuted,textTransform:"uppercase",letterSpacing:".06em",fontWeight:600 }}>{k.l}</div>
                    <div style={{ fontSize:16,fontWeight:700,color:k.c,fontFamily:"'Space Grotesk',sans-serif",marginTop:2 }}>{k.v}</div>
                    {k.sub&&<div style={{ fontSize:11,color:tk.textFaint,marginTop:2 }}>{k.sub}</div>}
                  </div>
                ))}

                {/* Bucket summary */}
                <div className="card" style={{ gridColumn:"1/3" }}>
                  <div style={{ fontWeight:700,fontSize:14,marginBottom:4,color:tk.textBright }}>📍 Bucket Workload Summary</div>
                  <div style={{ fontSize:12,color:tk.textMuted,marginBottom:10 }}>Total efforts and unique collectors assigned per bucket</div>
                  <ResponsiveContainer width="100%" height={Math.max(180,bucketSummaryForCollectors.length*36)}>
                    <BarChart data={bucketSummaryForCollectors} layout="vertical" margin={{ left:0,right:40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                      <XAxis type="number" tick={{ fill:tk.textMuted,fontSize:11 }} />
                      <YAxis type="category" dataKey="bucket" tick={{ fill:tk.textSub,fontSize:10 }} width={110} />
                      <Tooltip contentStyle={TS} />
                      <Bar dataKey="totalEfforts" radius={[0,4,4,0]} name="Total Efforts">
                        {bucketSummaryForCollectors.map((b,i)=><Cell key={i} fill={BUCKET_COLORS[b.bucket]||PC[i%PC.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Stacked bar: top collectors colored by primary bucket */}
                <div className="card" style={{ gridColumn:"3/5" }}>
                  <div style={{ fontWeight:700,fontSize:14,marginBottom:4,color:tk.textBright }}>👥 Top Collectors by Bucket Mix</div>
                  <div style={{ fontSize:12,color:tk.textMuted,marginBottom:10 }}>Each collector's efforts split by bucket (top 15)</div>
                  <ResponsiveContainer width="100%" height={Math.max(200,Math.min(15,collectorBucketRows.length)*28+60)}>
                    <BarChart data={collectorBucketRows.slice(0,15).map(c=>({ name:c.name, ...Object.fromEntries(allBuckets.map(b=>[b,c.buckets[b]?.total||0])) }))} layout="vertical" margin={{ left:0,right:16 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                      <XAxis type="number" tick={{ fill:tk.textMuted,fontSize:11 }} />
                      <YAxis type="category" dataKey="name" tick={{ fill:tk.textSub,fontSize:9 }} width={130} />
                      <Tooltip contentStyle={TS} />
                      <Legend wrapperStyle={{ fontSize:10 }} />
                      {allBuckets.map((b,i)=><Bar key={b} dataKey={b} stackId="s" fill={BUCKET_COLORS[b]||PC[i%PC.length]} name={b} />)}
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Heatmap: Collector × Bucket */}
                <div className="card" style={{ gridColumn:"1/-1" }}>
                  <div style={{ fontWeight:700,fontSize:14,marginBottom:4,color:tk.textBright }}>🔥 Collector × Bucket Effort Heatmap</div>
                  <div style={{ fontSize:12,color:tk.textMuted,marginBottom:10 }}>Each cell = total efforts. Color = intensity relative to max.</div>
                  <div style={{ display:"flex",gap:8,marginBottom:10,alignItems:"center" }}>
                    <span style={{ fontSize:11,color:tk.textMuted }}>Intensity:</span>
                    {[["0",tk.border],["Low","rgba(59,130,246,0.3)"],["Med","rgba(16,185,129,0.6)"],["High","rgba(245,158,11,0.8)"],["Peak","rgba(239,68,68,0.9)"]].map(([l,c])=>(
                      <span key={l} style={{ display:"flex",alignItems:"center",gap:4,fontSize:11,color:tk.textSub }}>
                        <span style={{ width:12,height:12,borderRadius:2,background:c,display:"inline-block",border:`1px solid ${tk.borderMed}` }} />{l}
                      </span>
                    ))}
                  </div>
                  <div style={{ overflowX:"auto" }}>
                    <table style={{ fontSize:11,borderCollapse:"separate",borderSpacing:2 }}>
                      <thead>
                        <tr>
                          <th style={{ position:"sticky",left:0,background:tk.bgSurface,minWidth:130,zIndex:2,textAlign:"left" }}>Collector</th>
                          <th style={{ color:"#22c55e",minWidth:60 }}>Total</th>
                          <th style={{ color:"#f59e0b",minWidth:80 }}>Primary Bucket</th>
                          {allBuckets.map(b=>(
                            <th key={b} style={{ color:BUCKET_COLORS[b]||tk.textSub,minWidth:80,textAlign:"center",padding:"4px 4px" }}>{b}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {cbHeatmap.map(row=>(
                          <tr key={row.collector}>
                            <td style={{ position:"sticky",left:0,background:tk.bgCard,fontWeight:600,color:tk.textPrimary,padding:"4px 8px",zIndex:1 }}>{row.collector}</td>
                            <td style={{ color:"#22c55e",fontWeight:700,textAlign:"center" }}>{row.total.toLocaleString()}</td>
                            <td style={{ textAlign:"center" }}>
                              {row.primaryBucket!=="–"
                                ?<span className="bdg" style={{ background:(BUCKET_COLORS[row.primaryBucket]||tk.textMuted)+"33",color:BUCKET_COLORS[row.primaryBucket]||tk.textSub,fontSize:10 }}>{row.primaryBucket}</span>
                                :<span style={{ color:tk.borderMed }}>–</span>}
                            </td>
                            {allBuckets.map(b=>{
                              const val=row[b]||0;
                              const bg=cbColor(val,cbHeatmapMax);
                              return (
                                <td key={b} style={{ padding:"2px" }}>
                                  <div style={{ background:bg,color:val>cbHeatmapMax*0.5?"#fff":tk.textMuted,borderRadius:3,fontSize:10,fontWeight:600,textAlign:"center",padding:"3px 4px",minWidth:60 }}>
                                    {val>0?val.toLocaleString():"–"}
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Collector detail table */}
                <div className="card" style={{ gridColumn:"1/-1" }}>
                  <div style={{ fontWeight:700,fontSize:14,marginBottom:4,color:tk.textBright }}>Collector Detail — Bucket Breakdown</div>
                  <div style={{ overflowX:"auto",maxHeight:400,overflowY:"auto" }}>
                    <table>
                      <thead><tr>
                        <th>#</th>
                        <th>Collector</th>
                        <th>Total</th>
                        <th>Primary Bucket</th>
                        <th>Buckets Worked</th>
                        <th style={{ color:"#22c55e" }}>KEPT</th>
                        <th style={{ color:"#f59e0b" }}>PTP</th>
                        <th style={{ color:"#3b82f6" }}>RPC</th>
                        {data.pak && <th style={{ color:"#22c55e" }}>PTP Amt</th>}
                        {data.cak && <th style={{ color:"#f97316" }}>Claim Amt</th>}
                      </tr></thead>
                      <tbody>{collectorBucketRows.map((c,i)=>{
                        const bucketsWorked = Object.keys(c.buckets).length;
                        return (
                          <tr key={c.name}>
                            <td style={{ color:tk.textFaint }}>{i+1}</td>
                            <td style={{ fontWeight:600,color:tk.textPrimary }}>{c.name}</td>
                            <td style={{ fontWeight:700,color:"#60a5fa" }}>{c.total.toLocaleString()}</td>
                            <td>
                              <span className="bdg" style={{ background:(BUCKET_COLORS[c.primaryBucket]||tk.textMuted)+"33",color:BUCKET_COLORS[c.primaryBucket]||tk.textSub }}>{c.primaryBucket}</span>
                            </td>
                            <td style={{ color:"#a78bfa" }}>{bucketsWorked} bucket{bucketsWorked!==1?"s":""}</td>
                            <td style={{ color:"#22c55e" }}>{(c.bySG.KEPT||0).toLocaleString()}</td>
                            <td style={{ color:"#f59e0b" }}>{(c.bySG.PTP||0).toLocaleString()}</td>
                            <td style={{ color:"#3b82f6" }}>{(c.bySG.RPC||0).toLocaleString()}</td>
                            {data.pak && <td style={{ color:"#22c55e",fontSize:12 }}>₱{fN(c.ptpAmt)}</td>}
                            {data.cak && <td style={{ color:"#f97316",fontSize:12 }}>₱{fN(c.claimAmt)}</td>}
                          </tr>
                        );
                      })}</tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ════════════════════════════════════════════════════════════════
              ── 🕐 ACCOUNT ACTIVITY TIMELINE TAB ──
          ════════════════════════════════════════════════════════════════ */}
          {tab === "timeline" && (() => {
            const td = data?.ak || data?.dik; // primary account key
            const dnk = data?.dnk; // debtor name key
            const oick = data?.oick; // old IC key
            const dik2 = data?.dik && data?.ak ? data?.dik : null; // debtor ID key (secondary)
            if (!td && !dnk && !oick) return (
              <div className="card" style={{ textAlign:"center", padding:"48px 24px" }}>
                <div style={{ fontSize:40, marginBottom:16 }}>🕐</div>
                <div style={{ fontWeight:700, fontSize:18, color:tk.textBright, marginBottom:8 }}>Account Timeline Unavailable</div>
                <div style={{ fontSize:13, color:tk.textMuted, maxWidth:480, margin:"0 auto" }}>
                  Requires an <code style={{ color:"#60a5fa", background:tk.bgSurface, padding:"1px 6px", borderRadius:4 }}>Account No.</code> column to look up individual account histories.
                </div>
              </div>
            );

            // Build search index: for each row, collect all searchable fields
            const buildKey = r => [
              td ? String(r[td] || "").trim() : "",
              dnk ? String(r[dnk] || "").trim() : "",
              oick ? String(r[oick] || "").trim() : "",
              dik2 ? String(r[dik2] || "").trim() : "",
            ].filter(Boolean).join("|");

            const allAccounts = [...new Map(
              data.rows
                .map(r => ({
                  acctNo: td ? String(r[td] || "").trim() : "",
                  debtor: dnk ? String(r[dnk] || "").trim() : "",
                  oldIc:  oick ? String(r[oick] || "").trim() : "",
                  debtorId: dik2 ? String(r[dik2] || "").trim() : "",
                }))
                .filter(x => x.acctNo || x.debtor || x.oldIc || x.debtorId)
                .map(x => [x.acctNo || x.debtorId || x.oldIc, x])
            ).values()].sort((a,b) => (a.acctNo||a.debtorId||"").localeCompare(b.acctNo||b.debtorId||""));

            const suggestions = timelineSearch.trim().length >= 2
              ? allAccounts.filter(a => {
                  const q = timelineSearch.toLowerCase();
                  return a.acctNo.toLowerCase().includes(q)
                    || a.debtor.toLowerCase().includes(q)
                    || a.oldIc.toLowerCase().includes(q)
                    || a.debtorId.toLowerCase().includes(q);
                }).slice(0, 12)
              : [];

            // When an account is selected, match by the primary key value
            const timeline = timelineAccount
              ? data.rows
                  .filter(r => {
                    const acctVal = td ? String(r[td] || "").trim() : "";
                    const diVal = dik2 ? String(r[dik2] || "").trim() : "";
                    return acctVal === timelineAccount || diVal === timelineAccount;
                  })
                  .map(r => {
                    const dateKey = data.datек || data.dtk;
                    return {
                      date:    dateKey ? fD(r[dateKey]) : null,
                      time:    data.timek ? String(r[data.timek]||"").trim()||null : null,
                      status:  r._status,
                      sg:      r._d.sg,
                      tp:      r._d.tp,
                      collector: data.rk && r[data.rk] ? String(r[data.rk]).trim() : null,
                      remark:  data.rmk && r[data.rmk] ? String(r[data.rmk]).trim() : null,
                      bucket:  r._bucket || null,
                      client:  r._client || null,
                      ptpDate: data.pdk ? fD(r[data.pdk]) : null,
                      ptpAmt:  (() => { const v = data.pak ? parseAmt(r[data.pak]) : NaN; return !isNaN(v) && v > 0 ? v : null; })(),
                      claimDate: data.cdk ? fD(r[data.cdk]) : null,
                      claimAmt:  (() => { const v = data.cak ? parseAmt(r[data.cak]) : NaN; return !isNaN(v) && v > 0 ? v : null; })(),
                    };
                  })
                  .sort((a, b) => {
                    const da = a.date ? new Date(a.date) : new Date(0);
                    const db = b.date ? new Date(b.date) : new Date(0);
                    return da - db;
                  })
              : [];

            const acctSummary = timelineAccount && timeline.length > 0 ? (() => {
              const tpC = {}, sgC = {};
              let totalPTP = 0, totalClaim = 0;
              timeline.forEach(e => {
                tpC[e.tp] = (tpC[e.tp]||0) + 1;
                sgC[e.sg] = (sgC[e.sg]||0) + 1;
                if (e.ptpAmt) totalPTP += e.ptpAmt;
                if (e.claimAmt) totalClaim += e.claimAmt;
              });
              const hasBP = timeline.some(e=>e.sg==="PTP") && !timeline.some(e=>e.sg==="KEPT");
              const hasKept = timeline.some(e=>e.sg==="KEPT");
              const collectors = [...new Set(timeline.map(e=>e.collector).filter(Boolean))];
              return { tpC, sgC, totalPTP, totalClaim, hasBP, hasKept, collectors };
            })() : null;

            const sgIcon = { KEPT:"✅", PTP:"🤝", RPC:"📞", POS:"💬", NEG:"❌" };
            const tpIcon = { CALL:"📱", FIELD:"🚗", SMS:"💬", VIBER:"💜", EMAIL:"📧", INTERNET:"🌐", "CEASE COLLECTION":"🛑", "REPO AI":"🤖", "FIELD REQUEST":"📋" };

            return (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:14 }}>
                {/* Search card */}
                <div className="card" style={{ gridColumn:"1/-1" }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:6, color:tk.textBright }}>
                    🕐 Account Activity Timeline
                  </div>
                  <div style={{ fontSize:12, color:tk.textMuted, marginBottom:12 }}>
                    Search by account number, debtor name, old IC, or debtor ID to see its complete activity log.
                    {allAccounts.length > 0 && <span style={{ color:tk.textFaint }}> {allAccounts.length.toLocaleString()} unique accounts in file.</span>}
                  </div>
                  <div style={{ position:"relative", maxWidth:500 }}>
                    <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:tk.textFaint, fontSize:14 }}>🔍</span>
                    <input
                      value={timelineSearch}
                      onChange={e => { setTimelineSearch(e.target.value); if (e.target.value !== timelineAccount) setTimelineAccount(null); }}
                      placeholder="Account No., Debtor Name, Old IC, Debtor ID…"
                      style={{ width:"100%", background:tk.bgSurface, border:`1px solid ${tk.borderMed}`, borderRadius:8, color:tk.textPrimary, fontSize:13, padding:"9px 10px 9px 34px", fontFamily:"inherit", outline:"none" }}
                    />
                    {timelineSearch && (
                      <button onClick={() => { setTimelineSearch(""); setTimelineAccount(null); }}
                        style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:tk.textMuted, cursor:"pointer", fontSize:14 }}>✕</button>
                    )}
                  </div>
                  {suggestions.length > 0 && !timelineAccount && (
                    <div style={{ maxWidth:500, background:tk.bgCard, border:`1px solid ${tk.borderMed}`, borderRadius:8, marginTop:4, overflow:"hidden" }}>
                      {suggestions.map(s => {
                        const key = s.acctNo || s.debtorId || s.oldIc;
                        return (
                          <div key={key} onClick={() => { setTimelineAccount(key); setTimelineSearch(key); }}
                            style={{ padding:"8px 14px", cursor:"pointer", fontSize:13, color:tk.textSub, borderBottom:`1px solid ${tk.bgSurface}` }}
                            onMouseOver={e=>e.currentTarget.style.background=tk.borderMed}
                            onMouseOut={e=>e.currentTarget.style.background="transparent"}>
                            <span style={{ color:"#60a5fa", fontFamily:"monospace" }}>{key}</span>
                            {s.debtor && <span style={{ color:tk.textMuted, marginLeft:8, fontSize:12 }}>— {s.debtor}</span>}
                            {s.oldIc && key !== s.oldIc && <span style={{ color:tk.textFaint, marginLeft:6, fontSize:11 }}>IC: {s.oldIc}</span>}
                            {s.debtorId && key !== s.debtorId && <span style={{ color:tk.textFaint, marginLeft:6, fontSize:11 }}>ID: {s.debtorId}</span>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {timelineSearch.trim().length >= 2 && !timelineAccount && suggestions.length === 0 && (
                    <div style={{ fontSize:12, color:"#ef4444", marginTop:6 }}>No matching accounts found.</div>
                  )}
                </div>

                {/* Account loaded */}
                {timelineAccount && acctSummary && (<>
                  <div style={{ gridColumn:"1/-1" }}>
                    {/* Account Identity Card */}
                    {(() => {
                      const matchedRow = data.rows.find(r => {
                        const acctVal = td ? String(r[td] || "").trim() : "";
                        const diVal = dik2 ? String(r[dik2] || "").trim() : "";
                        return acctVal === timelineAccount || diVal === timelineAccount;
                      });
                      const debtorName = dnk && matchedRow ? String(matchedRow[dnk] || "").trim() : "";
                      const oldIcVal   = oick && matchedRow ? String(matchedRow[oick] || "").trim() : "";
                      const debtorIdVal= dik2 && matchedRow ? String(matchedRow[dik2] || "").trim() : "";
                      const acctNoVal  = td && matchedRow ? String(matchedRow[td] || "").trim() : "";
                      return (
                        <div style={{ background: tk.bgCard, border: `1px solid ${tk.borderMed}`, borderRadius: 12, padding: "14px 18px", marginBottom: 10, display: "flex", alignItems: "flex-start", gap: 18, flexWrap: "wrap" }}>
                          <div style={{ flex: 1, minWidth: 240 }}>
                            <div style={{ fontSize: 11, color: tk.textMuted, textTransform: "uppercase", fontWeight: 600, letterSpacing: ".06em", marginBottom: 4 }}>Account Profile</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                              {acctNoVal && (
                                <div>
                                  <div style={{ fontSize: 10, color: tk.textFaint, fontWeight: 600, textTransform: "uppercase" }}>Account No.</div>
                                  <div style={{ fontSize: 15, fontWeight: 700, color: "#60a5fa", fontFamily: "monospace" }}>{acctNoVal}</div>
                                </div>
                              )}
                              {debtorName && (
                                <div>
                                  <div style={{ fontSize: 10, color: tk.textFaint, fontWeight: 600, textTransform: "uppercase" }}>Debtor Name</div>
                                  <div style={{ fontSize: 15, fontWeight: 700, color: tk.textBright }}>{debtorName}</div>
                                </div>
                              )}
                              {oldIcVal && (
                                <div>
                                  <div style={{ fontSize: 10, color: tk.textFaint, fontWeight: 600, textTransform: "uppercase" }}>Old IC</div>
                                  <div style={{ fontSize: 14, fontWeight: 600, color: "#a78bfa", fontFamily: "monospace" }}>{oldIcVal}</div>
                                </div>
                              )}
                              {debtorIdVal && debtorIdVal !== acctNoVal && (
                                <div>
                                  <div style={{ fontSize: 10, color: tk.textFaint, fontWeight: 600, textTransform: "uppercase" }}>Debtor ID</div>
                                  <div style={{ fontSize: 14, fontWeight: 600, color: "#f59e0b", fontFamily: "monospace" }}>{debtorIdVal}</div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                            {acctSummary.hasBP && <span style={{ background:"#450a0a", color:"#f87171", border:"1px solid #7f1d1d", borderRadius:20, padding:"3px 12px", fontSize:12, fontWeight:600 }}>💔 Broken Promise</span>}
                            {acctSummary.hasKept && <span style={{ background:"#052e16", color:"#4ade80", border:"1px solid #166534", borderRadius:20, padding:"3px 12px", fontSize:12, fontWeight:600 }}>✅ Promise Kept</span>}
                            <ExportBtn onClick={() => exportXlsx(timeline.map(e=>({
                              "Account No": timelineAccount, "Debtor": debtorName||"–", "Old IC": oldIcVal||"–",
                              "Debtor ID": debtorIdVal||"–", Date:e.date||"–", Time:e.time||"–",
                              Status:e.status, Group:e.sg, "Touch Point":e.tp,
                              Collector:e.collector||"–", Bucket:e.bucket||"–", Client:e.client||"–",
                              "PTP Date":e.ptpDate||"–", "PTP Amount":e.ptpAmt||"",
                              "Claim Date":e.claimDate||"–", "Claim Amount":e.claimAmt||"",
                            })), `timeline_${timelineAccount}.xlsx`)} label="Export Timeline" />
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {[
                    { l:"Total Activities", v:timeline.length, c:"#3b82f6", i:"📋" },
                    { l:"Total PTP Amount",  v:acctSummary.totalPTP>0?"₱"+fN(acctSummary.totalPTP):"–", c:"#f59e0b", i:"🤝" },
                    { l:"Total Claim Paid",  v:acctSummary.totalClaim>0?"₱"+fN(acctSummary.totalClaim):"–", c:"#22c55e", i:"💳" },
                    { l:"Collectors",        v:acctSummary.collectors.length>0?acctSummary.collectors.join(", "):"–", c:"#a78bfa", i:"👥" },
                  ].map(k=>(
                    <div key={k.l} className="sc">
                      <div style={{ fontSize:18, marginBottom:4 }}>{k.i}</div>
                      <div style={{ fontSize:10, color:tk.textMuted, textTransform:"uppercase", letterSpacing:".06em", fontWeight:600 }}>{k.l}</div>
                      <div style={{ fontSize:14, fontWeight:700, color:k.c, marginTop:2, wordBreak:"break-word" }}>{k.v}</div>
                    </div>
                  ))}

                  <div className="card" style={{ gridColumn:"1/3" }}>
                    <div style={{ fontWeight:700, fontSize:13, marginBottom:10, color:tk.textBright }}>Outcome Breakdown</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                      {Object.entries(acctSummary.sgC).sort((a,b)=>b[1]-a[1]).map(([sg,cnt])=>(
                        <div key={sg} style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <span style={{ fontSize:14 }}>{sgIcon[sg]||"•"}</span>
                          <span style={{ fontSize:12, color:GC[sg]||tk.textSub, fontWeight:600, minWidth:50 }}>{sg}</span>
                          <div style={{ flex:1, height:8, background:tk.bgSurface, borderRadius:4, overflow:"hidden" }}>
                            <div style={{ height:"100%", width:((cnt/timeline.length)*100)+"%", background:GC[sg]||"#3b82f6", borderRadius:4 }} />
                          </div>
                          <span style={{ fontSize:12, color:tk.textSub, minWidth:55, textAlign:"right" }}>{cnt} ({((cnt/timeline.length)*100).toFixed(0)}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card" style={{ gridColumn:"3/5" }}>
                    <div style={{ fontWeight:700, fontSize:13, marginBottom:10, color:tk.textBright }}>Touch Point Breakdown</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                      {Object.entries(acctSummary.tpC).sort((a,b)=>b[1]-a[1]).map(([tp,cnt])=>(
                        <div key={tp} style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <span style={{ fontSize:14 }}>{tpIcon[tp]||"•"}</span>
                          <span style={{ fontSize:12, color:TP_COLORS[tp]||tk.textSub, fontWeight:600, minWidth:80 }}>{tp}</span>
                          <div style={{ flex:1, height:8, background:tk.bgSurface, borderRadius:4, overflow:"hidden" }}>
                            <div style={{ height:"100%", width:((cnt/timeline.length)*100)+"%", background:TP_COLORS[tp]||"#3b82f6", borderRadius:4 }} />
                          </div>
                          <span style={{ fontSize:12, color:tk.textSub, minWidth:30, textAlign:"right" }}>{cnt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline event log */}
                  <div className="card" style={{ gridColumn:"1/-1" }}>
                    <div style={{ fontWeight:700, fontSize:14, marginBottom:14, color:tk.textBright }}>
                      📅 Chronological Activity Log — {timeline.length} events
                    </div>
                    <div style={{ position:"relative" }}>
                      <div style={{ position:"absolute", left:20, top:0, bottom:0, width:2, background:tk.bgCard, borderRadius:2 }} />
                      <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
                        {timeline.map((e, i) => {
                          const dotColor = GC[e.sg] || tk.textFaint;
                          const isLast = i === timeline.length - 1;
                          return (
                            <div key={i} style={{ display:"flex", gap:16, paddingBottom:isLast?0:14, position:"relative" }}>
                              <div style={{ flexShrink:0, width:42, display:"flex", justifyContent:"center", paddingTop:4 }}>
                                <div style={{ width:14, height:14, borderRadius:"50%", background:dotColor, border:`2px solid ${dotColor}55`, boxShadow:`0 0 6px ${dotColor}44`, zIndex:1, position:"relative" }} />
                              </div>
                              <div style={{ flex:1, background:tk.bgSurface, border:`1px solid ${dotColor}22`, borderLeft:`3px solid ${dotColor}`, borderRadius:"0 8px 8px 0", padding:"10px 14px", marginBottom:isLast?0:2 }}>
                                <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:5 }}>
                                  {e.date && <span style={{ fontSize:12, color:"#60a5fa", fontWeight:600 }}>{e.date}{e.time ? " · "+e.time : ""}</span>}
                                  <span className="bdg" style={{ background:dotColor+"22", color:dotColor }}>{e.sg}</span>
                                  <span style={{ fontSize:11, color:TP_COLORS[e.tp]||tk.textMuted }}>{tpIcon[e.tp]||""} {e.tp}</span>
                                </div>
                                <div style={{ fontSize:13, fontWeight:600, color:tk.textPrimary, marginBottom:5 }}>{e.status}</div>
                                <div style={{ display:"flex", gap:14, flexWrap:"wrap", fontSize:11, color:tk.textMuted }}>
                                  {e.collector && <span>👤 {e.collector}</span>}
                                  {e.bucket && <span>📍 {e.bucket}</span>}
                                  {e.client && <span>🏢 {e.client}</span>}
                                  {e.ptpDate && <span style={{ color:"#f59e0b" }}>🤝 PTP: {e.ptpDate}{e.ptpAmt ? " · ₱"+fN(e.ptpAmt) : ""}</span>}
                                  {e.claimDate && <span style={{ color:"#22c55e" }}>💳 Claim: {e.claimDate}{e.claimAmt ? " · ₱"+fN(e.claimAmt) : ""}</span>}
                                </div>
                                {e.remark && (
                                  <div style={{ marginTop:7, fontSize:12, color:tk.textSub, background:tk.bgCard, border:`1px solid ${tk.border}`, borderRadius:6, padding:"6px 10px", lineHeight:1.5 }}>
                                    <span style={{ color:tk.textFaint, fontWeight:600, marginRight:6 }}>📝 Remark:</span>{e.remark}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </>)}

                {!timelineAccount && (
                  <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"48px 24px", color:tk.textFaint }}>
                    <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
                    <div style={{ fontSize:15, fontWeight:600, color:tk.textMuted, marginBottom:6 }}>Search for an account to view its full timeline</div>
                    <div style={{ fontSize:13 }}>Type at least 2 characters to see matching account numbers</div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ════════════════════════════════════════════════════════════════
              ── 🔮 PREDICTIVE ANALYSIS TAB ──
          ════════════════════════════════════════════════════════════════ */}
          {tab === "predictive" && (() => {
            // ── Linear regression helper ────────────────────────────────
            const linReg = (pts) => {
              // pts = [{x: number, y: number}]
              const n = pts.length;
              if (n < 2) return { slope: 0, intercept: pts[0]?.y || 0, r2: 0 };
              const sumX = pts.reduce((s,p)=>s+p.x,0);
              const sumY = pts.reduce((s,p)=>s+p.y,0);
              const sumXY = pts.reduce((s,p)=>s+p.x*p.y,0);
              const sumX2 = pts.reduce((s,p)=>s+p.x*p.x,0);
              const slope = (n*sumXY - sumX*sumY) / (n*sumX2 - sumX*sumX);
              const intercept = (sumY - slope*sumX) / n;
              const yMean = sumY/n;
              const ssTot = pts.reduce((s,p)=>s+(p.y-yMean)**2,0);
              const ssRes = pts.reduce((s,p)=>s+(p.y-(slope*p.x+intercept))**2,0);
              const r2 = ssTot > 0 ? Math.max(0, 1-ssRes/ssTot) : 0;
              return { slope, intercept, r2 };
            };

            // ── Moving average helper ────────────────────────────────────
            const movAvg = (arr, window=3) => arr.map((_,i,a)=>{
              const start = Math.max(0, i-window+1);
              const slice = a.slice(start, i+1);
              return slice.reduce((s,v)=>s+v,0)/slice.length;
            });

            // ── Build daily series ───────────────────────────────────────
            const dailySeries = an.dateAnalytics?.dateSorted || [];

            // Daily efforts forecast
            const dailyPts = dailySeries.map((d,i)=>({ x:i, y:d.total, date:d.date }));
            const effortReg = linReg(dailyPts);
            const FORECAST_DAYS = 7;
            const lastDateStr = dailySeries.length > 0 ? dailySeries[dailySeries.length-1].date : null;
            const forecastDates = lastDateStr ? Array.from({length:FORECAST_DAYS},(_,k)=>{
              const d = new Date(lastDateStr);
              d.setDate(d.getDate()+k+1);
              const mo = String(d.getMonth()+1).padStart(2,"0");
              const dy = String(d.getDate()).padStart(2,"0");
              return `${mo}/${dy}/${d.getFullYear()}`;
            }) : Array.from({length:FORECAST_DAYS},(_,k)=>`Day +${k+1}`);

            const effortForecast = forecastDates.map((date,k)=>{
              const x = dailyPts.length + k;
              return { date, predicted: Math.max(0, Math.round(effortReg.slope*x + effortReg.intercept)) };
            });

            const dailyMA = movAvg(dailySeries.map(d=>d.total));
            const effortChartData = [
              ...dailySeries.slice(-30).map((d,i,arr)=>({
                date: d.date, actual: d.total,
                trend: Math.max(0, parseFloat((effortReg.slope*(dailySeries.length-arr.length+i)+effortReg.intercept).toFixed(1))),
                ma: parseFloat(dailyMA[dailySeries.length-arr.length+i]?.toFixed(1)||0)
              })),
              ...effortForecast.map(f=>({ date:f.date, predicted:f.predicted }))
            ];

            // ── PTP daily forecast ───────────────────────────────────────
            const ptpDateMap = {};
            if (data.pdk) {
              data.rows.forEach(r => {
                const d = fD(r[data.pdk]); if (!d) return;
                ptpDateMap[d] = (ptpDateMap[d]||0)+1;
              });
            }
            const ptpSeries = Object.entries(ptpDateMap).sort((a,b)=>new Date(a[0])-new Date(b[0])).map(([date,count])=>({date,count}));
            const ptpPts = ptpSeries.map((d,i)=>({x:i,y:d.count,date:d.date}));
            const ptpReg = linReg(ptpPts);
            const ptpForecast = forecastDates.map((date,k)=>{
              const x = ptpPts.length + k;
              return { date, predicted: Math.max(0, Math.round(ptpReg.slope*x + ptpReg.intercept)) };
            });
            const ptpChartData = [
              ...ptpSeries.slice(-30).map((d,i,arr)=>({
                date:d.date, actual:d.count,
                trend:Math.max(0,parseFloat((ptpReg.slope*(ptpSeries.length-arr.length+i)+ptpReg.intercept).toFixed(1)))
              })),
              ...ptpForecast.map(f=>({ date:f.date, predicted:f.predicted }))
            ];

            // ── Claim paid daily forecast ────────────────────────────────
            const claimDateMap = {};
            if (data.cdk) {
              data.rows.forEach(r => {
                const d = fD(r[data.cdk]); if (!d) return;
                claimDateMap[d] = (claimDateMap[d]||0)+1;
              });
            }
            const claimSeries = Object.entries(claimDateMap).sort((a,b)=>new Date(a[0])-new Date(b[0])).map(([date,count])=>({date,count}));
            const claimPts = claimSeries.map((d,i)=>({x:i,y:d.count}));
            const claimReg = linReg(claimPts);
            const claimForecast = forecastDates.map((date,k)=>({
              date, predicted: Math.max(0,Math.round(claimReg.slope*(claimPts.length+k)+claimReg.intercept))
            }));
            const claimChartData = [
              ...claimSeries.slice(-30).map((d,i,arr)=>({
                date:d.date, actual:d.count,
                trend:Math.max(0,parseFloat((claimReg.slope*(claimSeries.length-arr.length+i)+claimReg.intercept).toFixed(1)))
              })),
              ...claimForecast.map(f=>({ date:f.date, predicted:f.predicted }))
            ];

            // ── Monthly forecast (if monthly data) ──────────────────────
            const monthly = an.monthlyAnalytics?.monthlySorted || [];
            const monthlyPts = monthly.map((m,i)=>({x:i,y:m.total,label:m.month}));
            const monthReg = linReg(monthlyPts);
            const MONTHS_AHEAD = 3;
            const MONTHS_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            const lastMonthLabel = monthly.length>0?monthly[monthly.length-1].month:null;
            const forecastMonths = lastMonthLabel ? Array.from({length:MONTHS_AHEAD},(_,k)=>{
              const [mon,yr] = lastMonthLabel.split(" ");
              const idx = MONTHS_NAMES.indexOf(mon);
              const newIdx = (idx+k+1)%12;
              const newYr = parseInt(yr) + Math.floor((idx+k+1)/12);
              return `${MONTHS_NAMES[newIdx]} ${newYr}`;
            }) : Array.from({length:MONTHS_AHEAD},(_,k)=>`M+${k+1}`);

            const monthlyPTPPts = monthly.map((m,i)=>({x:i,y:m.ptpAmt}));
            const monthPTPReg = linReg(monthlyPTPPts);
            const monthChartData = [
              ...monthly.map((m,i)=>({
                month:m.month, actual:m.total,
                trend:Math.max(0,parseFloat((monthReg.slope*i+monthReg.intercept).toFixed(1))),
                ptpAmt:m.ptpAmt
              })),
              ...forecastMonths.map((month,k)=>({
                month, predicted:Math.max(0,Math.round(monthReg.slope*(monthly.length+k)+monthReg.intercept)),
                predictedPTP:Math.max(0,Math.round(monthPTPReg.slope*(monthly.length+k)+monthPTPReg.intercept))
              }))
            ];

            // ── Collector productivity forecast ──────────────────────────
            // Simple: extrapolate each top collector's daily effort rate
            const topForecastCollectors = an.cd.slice(0,8).map(c=>{
              const dailyRate = dailySeries.length > 0 ? c.total/dailySeries.length : 0;
              const next7 = Math.round(dailyRate*7);
              const rpcRate = c.bySG?.RPC&&c.total>0?(c.bySG.RPC/c.total*100).toFixed(1):"0";
              const ptpRate = c.bySG?.PTP&&c.total>0?((c.bySG.PTP||0)/c.total*100).toFixed(1):"0";
              const keptRate = c.bySG?.KEPT&&c.total>0?((c.bySG.KEPT||0)/c.total*100).toFixed(1):"0";
              return { name:c.name, total:c.total, dailyRate:dailyRate.toFixed(1), next7, rpcRate, ptpRate, keptRate };
            });

            // ── Trend direction labels ───────────────────────────────────
            const trendLabel = (slope, unit="") => {
              if (Math.abs(slope) < 0.05) return { label:"Stable ➡", color:tk.textSub };
              if (slope > 0) return { label:`↑ +${slope.toFixed(2)}${unit}/day`, color:"#22c55e" };
              return { label:`↓ ${slope.toFixed(2)}${unit}/day`, color:"#ef4444" };
            };
            const effortTrend = trendLabel(effortReg.slope);
            const ptpTrend = trendLabel(ptpReg.slope, " PTPs");
            const claimTrend = trendLabel(claimReg.slope, " claims");
            const nextWeekEfforts = forecastDates.map((d,k)=>({date:d, predicted:effortForecast[k]?.predicted||0}));
            const totalNext7 = nextWeekEfforts.reduce((s,x)=>s+x.predicted,0);
            const totalNext7PTP = ptpForecast.reduce((s,x)=>s+x.predicted,0);

            return (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:14 }}>

                {/* Header banner */}
                <div style={{ gridColumn:"1/-1", background:isDark ? "linear-gradient(135deg,#0f1f3d,#130a2e)" : "linear-gradient(135deg,#eff6ff,#f5f3ff)", border:`1px solid ${isDark ? "#1e3a5f" : "#bfdbfe"}`, borderRadius:12, padding:"16px 20px" }}>
                  <div style={{ fontWeight:700, fontSize:16, color:tk.textBright, marginBottom:4 }}>🔮 Predictive Analysis</div>
                  <div style={{ fontSize:13, color:tk.textMuted }}>
                    Linear regression on historical effort, PTP, and claim data — extrapolated {FORECAST_DAYS} days ahead.
                    Forecasts are model estimates and will vary with real-world conditions.
                  </div>
                </div>

                {/* ── KPI: trend summary ── */}
                {[
                  { l:"Effort Trend", v:effortTrend.label, c:effortTrend.color, i:"📊", sub:`R²=${effortReg.r2.toFixed(2)} fit` },
                  { l:"Next 7 Days (Est.)", v:totalNext7.toLocaleString(), c:"#60a5fa", i:"📅", sub:"total predicted efforts" },
                  { l:"PTP Trend", v:ptpTrend.label, c:ptpTrend.color, i:"🤝", sub:`R²=${ptpReg.r2.toFixed(2)} fit` },
                  { l:"Next 7 Days PTP (Est.)", v:totalNext7PTP.toLocaleString(), c:"#f59e0b", i:"💰", sub:"predicted PTP records" },
                ].map(k=>(
                  <div key={k.l} className="sc">
                    <div style={{ fontSize:18,marginBottom:4 }}>{k.i}</div>
                    <div style={{ fontSize:10,color:tk.textMuted,textTransform:"uppercase",letterSpacing:".06em",fontWeight:600 }}>{k.l}</div>
                    <div style={{ fontSize:14,fontWeight:700,color:k.c,fontFamily:"'Space Grotesk',sans-serif",marginTop:2 }}>{k.v}</div>
                    <div style={{ fontSize:10,color:tk.textFaint,marginTop:2 }}>{k.sub}</div>
                  </div>
                ))}

                {/* ── Daily Efforts forecast chart ── */}
                {dailySeries.length >= 3 && (
                  <div className="card" style={{ gridColumn:"1/-1" }}>
                    <div style={{ fontWeight:700,fontSize:14,marginBottom:4,color:tk.textBright }}>📈 Daily Efforts — Trend &amp; 7-Day Forecast</div>
                    <div style={{ fontSize:12,color:tk.textMuted,marginBottom:12 }}>
                      Blue bars = actual. Orange line = regression trend. Purple bars = forecast.
                      <span style={{ marginLeft:12, color:effortTrend.color, fontWeight:600 }}>{effortTrend.label}</span>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={effortChartData} margin={{ left:0,right:16,bottom:effortChartData.length>20?70:30 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                        <XAxis dataKey="date" tick={{ fill:tk.textMuted,fontSize:9 }} angle={-35} textAnchor="end" interval={Math.floor(effortChartData.length/15)} />
                        <YAxis tick={{ fill:tk.textMuted,fontSize:11 }} />
                        <Tooltip contentStyle={TS} />
                        <Legend wrapperStyle={{ fontSize:11 }} />
                        <Bar dataKey="actual" fill="#3b82f6" name="Actual" radius={[2,2,0,0]} />
                        <Bar dataKey="predicted" fill="#a78bfa" name="Forecast" radius={[2,2,0,0]} />
                        <Line type="monotone" dataKey="trend" stroke="#f59e0b" strokeWidth={2} dot={false} name="Trend" strokeDasharray="4 2" />
                        <Line type="monotone" dataKey="ma" stroke="#06b6d4" strokeWidth={1.5} dot={false} name="3-day MA" strokeDasharray="2 3" />
                      </BarChart>
                    </ResponsiveContainer>
                    {/* 7-day forecast table */}
                    <div style={{ marginTop:14, overflowX:"auto" }}>
                      <div style={{ fontWeight:600,fontSize:12,color:tk.textSub,marginBottom:6 }}>7-Day Effort Forecast</div>
                      <table>
                        <thead><tr><th>Date</th><th>Predicted Efforts</th><th style={{width:160}}>Bar</th></tr></thead>
                        <tbody>{effortForecast.map(f=>(
                          <tr key={f.date}>
                            <td style={{ color:"#a78bfa",fontWeight:600 }}>{f.date}</td>
                            <td style={{ fontWeight:700,color:tk.textPrimary }}>{f.predicted.toLocaleString()}</td>
                            <td><Pb tk={tk} pct={totalNext7>0?(f.predicted/Math.max(...effortForecast.map(x=>x.predicted)))*100:0} c="#a78bfa" /></td>
                          </tr>
                        ))}</tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ── PTP forecast ── */}
                {ptpSeries.length >= 3 && (
                  <div className="card" style={{ gridColumn:"1/3" }}>
                    <div style={{ fontWeight:700,fontSize:14,marginBottom:4,color:tk.textBright }}>🤝 PTP Count Forecast (7 days)</div>
                    <div style={{ fontSize:12,color:tk.textMuted,marginBottom:10 }}>
                      <span style={{ color:ptpTrend.color,fontWeight:600 }}>{ptpTrend.label}</span>
                      <span style={{ color:tk.textFaint,marginLeft:8 }}>R²={ptpReg.r2.toFixed(2)}</span>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={ptpChartData} margin={{ left:0,right:12,bottom:50 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                        <XAxis dataKey="date" tick={{ fill:tk.textMuted,fontSize:9 }} angle={-35} textAnchor="end" interval={Math.floor(ptpChartData.length/10)} />
                        <YAxis tick={{ fill:tk.textMuted,fontSize:11 }} />
                        <Tooltip contentStyle={TS} />
                        <Legend wrapperStyle={{ fontSize:10 }} />
                        <Bar dataKey="actual" fill="#f59e0b" name="Actual PTP" radius={[2,2,0,0]} />
                        <Bar dataKey="predicted" fill="#fbbf24" name="Forecast" radius={[2,2,0,0]} opacity={0.7} />
                        <Line type="monotone" dataKey="trend" stroke="#ef4444" strokeWidth={2} dot={false} name="Trend" strokeDasharray="4 2" />
                      </BarChart>
                    </ResponsiveContainer>
                    <div style={{ marginTop:10 }}>
                      <table style={{ fontSize:12 }}>
                        <thead><tr><th>Date</th><th>Predicted PTPs</th></tr></thead>
                        <tbody>{ptpForecast.map(f=>(
                          <tr key={f.date}><td style={{ color:"#f59e0b" }}>{f.date}</td><td style={{ fontWeight:700 }}>{f.predicted}</td></tr>
                        ))}</tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ── Claim forecast ── */}
                {claimSeries.length >= 3 && (
                  <div className="card" style={{ gridColumn:"3/5" }}>
                    <div style={{ fontWeight:700,fontSize:14,marginBottom:4,color:tk.textBright }}>💳 Claim Paid Forecast (7 days)</div>
                    <div style={{ fontSize:12,color:tk.textMuted,marginBottom:10 }}>
                      <span style={{ color:claimTrend.color,fontWeight:600 }}>{claimTrend.label}</span>
                      <span style={{ color:tk.textFaint,marginLeft:8 }}>R²={claimReg.r2.toFixed(2)}</span>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={claimChartData} margin={{ left:0,right:12,bottom:50 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                        <XAxis dataKey="date" tick={{ fill:tk.textMuted,fontSize:9 }} angle={-35} textAnchor="end" interval={Math.floor(claimChartData.length/10)} />
                        <YAxis tick={{ fill:tk.textMuted,fontSize:11 }} />
                        <Tooltip contentStyle={TS} />
                        <Legend wrapperStyle={{ fontSize:10 }} />
                        <Bar dataKey="actual" fill="#f97316" name="Actual Claims" radius={[2,2,0,0]} />
                        <Bar dataKey="predicted" fill="#fdba74" name="Forecast" radius={[2,2,0,0]} opacity={0.7} />
                        <Line type="monotone" dataKey="trend" stroke="#ef4444" strokeWidth={2} dot={false} name="Trend" strokeDasharray="4 2" />
                      </BarChart>
                    </ResponsiveContainer>
                    <div style={{ marginTop:10 }}>
                      <table style={{ fontSize:12 }}>
                        <thead><tr><th>Date</th><th>Predicted Claims</th></tr></thead>
                        <tbody>{claimForecast.map(f=>(
                          <tr key={f.date}><td style={{ color:"#f97316" }}>{f.date}</td><td style={{ fontWeight:700 }}>{f.predicted}</td></tr>
                        ))}</tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ── Monthly forecast ── */}
                {monthly.length >= 2 && (
                  <div className="card" style={{ gridColumn:"1/-1" }}>
                    <div style={{ fontWeight:700,fontSize:14,marginBottom:4,color:tk.textBright }}>📆 Monthly Efforts — Trend &amp; {MONTHS_AHEAD}-Month Forecast</div>
                    <div style={{ fontSize:12,color:tk.textMuted,marginBottom:12 }}>Green bars = actual. Purple bars = forecast. R²={monthReg.r2.toFixed(2)}</div>
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={monthChartData} margin={{ left:0,right:16,bottom:monthly.length>6?50:20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={tk.border} />
                        <XAxis dataKey="month" tick={{ fill:tk.textMuted,fontSize:10 }} angle={-20} textAnchor="end" interval={0} />
                        <YAxis tick={{ fill:tk.textMuted,fontSize:11 }} />
                        <Tooltip contentStyle={TS} />
                        <Legend wrapperStyle={{ fontSize:11 }} />
                        <Bar dataKey="actual" fill="#3b82f6" name="Actual" radius={[2,2,0,0]} />
                        <Bar dataKey="predicted" fill="#a78bfa" name="Forecast" radius={[2,2,0,0]} opacity={0.8} />
                        <Line type="monotone" dataKey="trend" stroke="#f59e0b" strokeWidth={2} dot={false} name="Trend" strokeDasharray="4 2" />
                      </BarChart>
                    </ResponsiveContainer>
                    <div style={{ marginTop:12,overflowX:"auto" }}>
                      <div style={{ fontWeight:600,fontSize:12,color:tk.textSub,marginBottom:6 }}>Monthly Forecast</div>
                      <table>
                        <thead><tr><th>Month</th><th>Predicted Efforts</th><th>Predicted PTP (est.)</th><th style={{width:160}}>Bar</th></tr></thead>
                        <tbody>{forecastMonths.map((m,k)=>{
                          const pred = Math.max(0,Math.round(monthReg.slope*(monthly.length+k)+monthReg.intercept));
                          const predPTP = Math.max(0,Math.round(monthPTPReg.slope*(monthly.length+k)+monthPTPReg.intercept));
                          const maxActual = monthly.length>0?Math.max(...monthly.map(x=>x.total)):1;
                          return (
                            <tr key={m}>
                              <td style={{ color:"#a78bfa",fontWeight:600 }}>{m}</td>
                              <td style={{ fontWeight:700,color:tk.textPrimary }}>{pred.toLocaleString()}</td>
                              <td style={{ color:"#22c55e" }}>₱{fN(predPTP)}</td>
                              <td><Pb tk={tk} pct={(pred/Math.max(maxActual,pred))*100} c="#a78bfa" /></td>
                            </tr>
                          );
                        })}</tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ── Collector productivity forecast ── */}
                {topForecastCollectors.length > 0 && (
                  <div className="card" style={{ gridColumn:"1/-1" }}>
                    <div style={{ fontWeight:700,fontSize:14,marginBottom:4,color:tk.textBright }}>👥 Collector Productivity Forecast (Next 7 Days)</div>
                    <div style={{ fontSize:12,color:tk.textMuted,marginBottom:12 }}>
                      Estimated based on each collector's historical daily effort rate × 7 days.
                    </div>
                    <div style={{ overflowX:"auto" }}>
                      <table>
                        <thead><tr>
                          <th>#</th><th>Collector</th>
                          <th>Total (So Far)</th>
                          <th>Daily Rate</th>
                          <th style={{ color:"#a78bfa" }}>Est. Next 7 Days</th>
                          <th style={{ color:"#3b82f6" }}>RPC%</th>
                          <th style={{ color:"#f59e0b" }}>PTP%</th>
                          <th style={{ color:"#22c55e" }}>KEPT%</th>
                          <th style={{ width:120 }}>7-Day Bar</th>
                        </tr></thead>
                        <tbody>{topForecastCollectors.map((c,i)=>(
                          <tr key={c.name}>
                            <td style={{ color:"#4b5563" }}>{i+1}</td>
                            <td style={{ fontWeight:600,color:tk.textPrimary }}>{c.name}</td>
                            <td style={{ color:tk.textSub }}>{c.total.toLocaleString()}</td>
                            <td style={{ color:"#60a5fa" }}>{c.dailyRate}/day</td>
                            <td style={{ fontWeight:700,color:"#a78bfa" }}>{c.next7.toLocaleString()}</td>
                            <td style={{ color:"#3b82f6" }}>{c.rpcRate}%</td>
                            <td style={{ color:"#f59e0b" }}>{c.ptpRate}%</td>
                            <td style={{ color:"#22c55e" }}>{c.keptRate}%</td>
                            <td><Pb tk={tk} pct={(c.next7/Math.max(...topForecastCollectors.map(x=>x.next7),1))*100} c={PC[i%PC.length]} /></td>
                          </tr>
                        ))}</tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ── Model accuracy note ── */}
                <div style={{ gridColumn:"1/-1", background:tk.bgSurface, border:`1px solid ${tk.border}`, borderRadius:10, padding:"12px 16px" }}>
                  <div style={{ fontSize:12,color:"#78716c" }}>
                    ⚠️ <strong style={{ color:"#a8a29e" }}>Model Notes:</strong> Forecasts use ordinary least-squares linear regression on historical data.
                    R² (0–1) measures fit quality — values closer to 1 indicate stronger predictive power.
                    Short or irregular time series will have lower R² and wider error margins.
                    These are statistical estimates only — actual results depend on operational decisions and external factors.
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