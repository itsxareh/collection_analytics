import { useState, useMemo, useRef } from "react";
import * as XLSX from "xlsx";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const DISP = {
  // ──────────────────────────────────────────────
  // CALL group
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

  // Short call dispositions
  "BUSY": { tp: "CALL", sg: "NEG" },
  "DROPPED": { tp: "CALL", sg: "NEG" },
  "RNA": { tp: "CALL", sg: "NEG" },
  "PM": { tp: "CALL", sg: "NEG" },
  "PU": { tp: "CALL", sg: "NEG" },

  // ──────────────────────────────────────────────
  // CARAVAN → now FIELD
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

  // ──────────────────────────────────────────────
  // SKIP → now INTERNET
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

  // SMEDIA → now INTERNET
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

  // ──────────────────────────────────────────────
  // FIELD group (already FIELD)
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

  // ──────────────────────────────────────────────
  // EMAIL group
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

  // ──────────────────────────────────────────────
  // SMS group
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

  // ──────────────────────────────────────────────
  // VIBER group
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

  // ──────────────────────────────────────────────
  // CEASE COLLECTION
  "CEASE - POSSIBLE COMPLAINT": { tp: "CEASE COLLECTION", sg: "NEG" },
  "CEASE - PENDING COMPLAINT": { tp: "CEASE COLLECTION", sg: "NEG" },
  "CEASE - VALID COMPLAINT": { tp: "CEASE COLLECTION", sg: "NEG" },
  "CEASE - REQUESTED BY BANK": { tp: "CEASE COLLECTION", sg: "NEG" },
  "CEASE - CLAIMING PAID": { tp: "CEASE COLLECTION", sg: "RPC" },
  "CEASE - INSURANCE CLAIM": { tp: "CEASE COLLECTION", sg: "RPC" },
  "CEASE - REPOSSESSED BY OTHER ECA": { tp: "CEASE COLLECTION", sg: "NEG" },

  // ──────────────────────────────────────────────
  // FIELD REQUEST
  "FIELD REQUEST - OTS SURE REPO": { tp: "FIELD REQUEST", sg: "NEG" },
  "FIELD REQUEST - FOR REVISIT": { tp: "FIELD REQUEST", sg: "NEG" },
  "FIELD REQUEST - BP_NC": { tp: "FIELD REQUEST", sg: "NEG" },
  "FIELD REQUEST - NEW_ADDRESS": { tp: "FIELD REQUEST", sg: "NEG" },

  // ──────────────────────────────────────────────
  // REPO AI
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

const GC={"NEG":"#c94537","RPC":"#3b82f6","KEPT":"#22c55e","PTP":"#f58c0b","FOLLOW UP":"#a78bfa","POS":"#06b6d4"};
const PC=["#3b82f6","#22c55e","#f59e0b","#ef4444","#a78bfa","#06b6d4","#f97316","#84cc16","#ec4899","#14b8a6"];
const DU={};Object.keys(DISP).forEach(k=>{DU[k.toUpperCase()]={...DISP[k],orig:k}});
const fN=n=>n==null?"-":typeof n==="number"?n.toLocaleString("en-PH",{minimumFractionDigits:2,maximumFractionDigits:2}):String(n);
const parseAmt=v=>{
  if(v==null||v==="")return NaN;
  if(typeof v==="number")return v;
  // string like "27,452.00" — strip commas, currency symbols, spaces
  const cleaned=String(v).replace(/[₱$,\s]/g,"").trim();
  const n=parseFloat(cleaned);
  return n;
};

const fD=v=>{if(!v)return"-";if(v instanceof Date)return v.toLocaleDateString("en-PH");const d=new Date(v);return isNaN(d.getTime())?String(v):d.toLocaleDateString("en-PH")};
const Pb=({pct,c})=><div style={{height:6,background:"#0f172a",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",borderRadius:3,width:Math.min(pct,100)+"%",background:c}}/></div>;

export default function App(){
  const [data,setData]=useState(null);
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const [tab,setTab]=useState("overview");
  const fRef=useRef();

  const hf=file=>{
    if(!file)return;
    if(!file.name.match(/\.(xlsx|xls)$/i)){setErr("Error: File must be .xlsx or .xls");return;}
    setLoading(true);setErr("");setData(null);
    const r=new FileReader();
    r.onload=e=>{
      try{
        const wb=XLSX.read(e.target.result,{type:"array",cellDates:true});
        const ws=wb.Sheets[wb.SheetNames[0]];
        const raw=XLSX.utils.sheet_to_json(ws,{defval:null,raw:false}); 
        if(!raw.length){setErr("Error: The uploaded file is empty.");setLoading(false);return;}
        const keys=Object.keys(raw[0]);
        const sk=keys.find(k=>k.trim().toLowerCase()==="status");
        if(!sk){setErr("Error: The uploaded file does not contain a 'Status' column.");setLoading(false);return;}
        const ak=keys.find(k=>k.toLowerCase().includes("account no")||k.toLowerCase().includes("acct no"));
        const rk=keys.find(k=>k.toLowerCase().includes("remark by"));
        const pak=keys.find(k=>k.toLowerCase().includes("ptp amount"));
        const pdk=keys.find(k=>k.toLowerCase().includes("ptp date")&&!k.toLowerCase().includes("claim"));
        const cak=keys.find(k=>k.toLowerCase().includes("claim paid amount"));
        const cdk=keys.find(k=>k.toLowerCase().includes("claim paid date"));
        const rows=raw
          .map(r=>({...r,_su:r[sk]?String(r[sk]).trim().toUpperCase():null}))
          .filter(r=>r._su&&DU[r._su])
          .map(r=>({...r,_status:DU[r._su].orig,_d:DU[r._su]}));
        if(!rows.length){setErr("Error: No valid recognized statuses found in the file.");setLoading(false);return;}
        setData({rows,sk,ak,rk,pak,pdk,cak,cdk,totalRaw:raw.length});
      }catch(ex){setErr("Error parsing file: "+ex.message);}
      setLoading(false);
    };
    r.readAsArrayBuffer(file);
  };

  const an=useMemo(()=>{
    if(!data)return null;
    const{rows,ak,rk,pak,pdk,cak,cdk}=data;
    const sc={},gc={},tc={};
    rows.forEach(r=>{
      sc[r._status]=(sc[r._status]||0)+1;
      gc[r._d.sg]=(gc[r._d.sg]||0)+1;
      tc[r._d.tp]=(tc[r._d.tp]||0)+1;
    });
    const T=rows.length;
    const rowGrp=s=>rows.find(r=>r._status===s)?._d||{};
    const sd=Object.entries(sc).sort((a,b)=>b[1]-a[1]).map(([s,c])=>({
      status:s,count:c,pct:((c/T)*100).toFixed(1),
      grp:rowGrp(s).sg||"",tp:rowGrp(s).tp||""
    }));
    const gd=Object.entries(gc).sort((a,b)=>b[1]-a[1]).map(([g,c])=>({name:g,value:c,pct:((c/T)*100).toFixed(1)}));
    const td=Object.entries(tc).sort((a,b)=>b[1]-a[1]).map(([t,c])=>({name:t,count:c,pct:((c/T)*100).toFixed(1)}));
    const ua=ak?new Set(rows.map(r=>r[ak]).filter(Boolean)).size:null;
    const cm={};
    if(rk)rows.forEach(r=>{const v=r[rk];if(v){const k=String(v).trim();cm[k]=(cm[k]||0)+1;}});
    const cd=Object.entries(cm).sort((a,b)=>b[1]-a[1]).map(([n,c])=>({name:n,count:c}));
    let pt=0,pc=0;
    if(pak)rows.forEach(r=>{const v=parseAmt(r[pak]);if(!isNaN(v)&&v>0){pt+=v;pc++;}});
    let ct=0,cc=0;
    if(cak)rows.forEach(r=>{const v=parseAmt(r[cak]);if(!isNaN(v)&&v>0){ct+=v;cc++;}});
    const pdc={};
    if(pdk)rows.forEach(r=>{const d=r[pdk];if(d){const k=fD(d);pdc[k]=(pdc[k]||0)+1;}});
    const pdd=Object.entries(pdc).sort((a,b)=>new Date(a[0])-new Date(b[0])).slice(-15).map(([d,c])=>({date:d,count:c}));
    const cdc={};
    if(cdk)rows.forEach(r=>{const d=r[cdk];if(d){const k=fD(d);cdc[k]=(cdc[k]||0)+1;}});
    const cdd=Object.entries(cdc).sort((a,b)=>new Date(a[0])-new Date(b[0])).slice(-15).map(([d,c])=>({date:d,count:c}));
    return{sd,gd,td,ua,cd,pt,pc,ct,cc,pdd,cdd,T};
  },[data]);

  const TS={background:"#1e293b",border:"1px solid #334155",borderRadius:8,fontSize:12};

  return(
    <div style={{minHeight:"100vh",background:"#0f172a",color:"#e2e8f0",fontFamily:"'DM Sans',sans-serif"}}>
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
      `}</style>

      {/* Header */}
      <div style={{background:"#0f172a",borderBottom:"1px solid #1e293b",padding:"16px 32px",display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
        <div style={{width:36,height:36,background:"linear-gradient(135deg,#3b82f6,#8b5cf6)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>📊</div>
        <div>
          <div style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:18,color:"#f1f5f9"}}>Collections Analytics</div>
          <div style={{fontSize:12,color:"#64748b"}}>Status Disposition Intelligence System · 255 Recognized Dispositions</div>
        </div>
        {data&&an&&<div style={{marginLeft:"auto",fontSize:12,color:"#22c55e",background:"#052e16",padding:"4px 12px",borderRadius:20,border:"1px solid #166534"}}>✓ {an.T.toLocaleString()} valid records loaded</div>}
      </div>

      <div style={{maxWidth:1400,margin:"0 auto",padding:24}}>
        {!data&&(
          <div style={{maxWidth:540,margin:"80px auto"}}>
            <div className="card">
              <div style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:22,marginBottom:8,color:"#f1f5f9"}}>Upload Collections File</div>
              <div style={{fontSize:13,color:"#64748b",marginBottom:24}}>Upload an Excel file (.xlsx/.xls) with a <code style={{color:"#60a5fa",background:"#0f172a",padding:"1px 5px",borderRadius:4}}>Status</code> column. The system will automatically validate statuses against 255 recognized disposition codes.</div>
              <div className="dz"
                onClick={()=>fRef.current.click()}
                onDragOver={e=>{e.preventDefault();e.currentTarget.style.borderColor="#3b82f6"}}
                onDragLeave={e=>{e.currentTarget.style.borderColor="#334155"}}
                onDrop={e=>{e.preventDefault();e.currentTarget.style.borderColor="#334155";hf(e.dataTransfer.files[0])}}>
                <div style={{fontSize:40,marginBottom:12}}>📂</div>
                <div style={{fontWeight:600,fontSize:15,color:"#e2e8f0"}}>Drop your Excel file here</div>
                <div style={{fontSize:13,color:"#64748b",marginTop:6}}>or click to browse · .xlsx / .xls accepted</div>
              </div>
              <input ref={fRef} type="file" accept=".xlsx,.xls" onChange={e=>hf(e.target.files[0])} />
              {loading&&<div style={{marginTop:16,textAlign:"center",color:"#60a5fa",fontSize:14}}>⏳ Processing file...</div>}
              {err&&<div style={{marginTop:16,background:"#450a0a",border:"1px solid #7f1d1d",borderRadius:8,padding:12,color:"#fca5a5",fontSize:13}}>{err}</div>}
              <div style={{marginTop:20,padding:"12px 16px",background:"#0f172a",borderRadius:8,fontSize:12,color:"#475569"}}>
                <div style={{fontWeight:600,color:"#64748b",marginBottom:6}}>Expected columns (auto-detected):</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {["Status","Account No.","Remark By","PTP Amount","PTP Date","Claim Paid Amount","Claim Paid Date"].map(c=><span key={c} style={{background:"#1e293b",padding:"2px 8px",borderRadius:4,color:"#94a3b8"}}>{c}</span>)}
                </div>
              </div>
            </div>
          </div>
        )}

        {data&&an&&<>
          {/* KPI Row */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:12,marginBottom:20}}>
            {[
              {l:"Total Records",v:data.totalRaw.toLocaleString(),i:"📋",c:"#3b82f6"},
              {l:"Valid Records",v:an.T.toLocaleString(),i:"✅",c:"#22c55e"},
              {l:"Unique Statuses",v:an.sd.length,i:"🏷️",c:"#a78bfa"},
              {l:"Unique Accounts",v:an.ua?.toLocaleString()??"N/A",i:"👤",c:"#f59e0b"},
              {l:"Collectors",v:an.cd.length,i:"👥",c:"#06b6d4"},
              {l:"PTP Amount",v:"₱"+fN(an.pt),i:"💰",c:"#22c55e"},
              {l:"Claim Paid",v:"₱"+fN(an.ct),i:"💳",c:"#f97316"},
            ].map(k=>(
              <div key={k.l} className="sc">
                <div style={{fontSize:20,marginBottom:6}}>{k.i}</div>
                <div style={{fontSize:11,color:"#64748b",textTransform:"uppercase",letterSpacing:".06em",fontWeight:600}}>{k.l}</div>
                <div style={{fontSize:17,fontWeight:700,color:k.c,fontFamily:"'Space Grotesk',sans-serif",marginTop:2,wordBreak:"auto-phrase"}}>{k.v}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{display:"flex",gap:4,marginBottom:8,background:"#0f172a",padding:4,borderRadius:12,width:"fit-content",flexWrap:"wrap"}}>
            {[["overview","📊 Overview"],["status","🏷️ Status Detail"],["collectors","👥 Collectors"],["ptp","💰 PTP & Claims"],["touch","📱 Touch Points"]].map(([t,l])=>(
              <button key={t} className={`tb${tab===t?" ac":""}`} onClick={()=>setTab(t)}>{l}</button>
            ))}
          </div>
          <div style={{textAlign:"right",marginBottom:16}}>
            <button onClick={()=>{setData(null);setErr("")}} style={{background:"#1e293b",border:"1px solid #334155",color:"#94a3b8",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:12}}>↩ Upload New File</button>
          </div>

          {/* Overview */}
          {tab==="overview"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div className="card">
              <div style={{fontWeight:700,fontSize:14,marginBottom:16,color:"#f1f5f9"}}>Status Group Distribution</div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={an.gd} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({name,pct})=>`${name} ${pct}%`} labelLine={false}>
                    {an.gd.map((e,i)=><Cell key={i} fill={GC[e.name]||PC[i%PC.length]}/>)}
                  </Pie>
                  <Tooltip formatter={(v,n,p)=>[`${v.toLocaleString()} (${p.payload.pct}%)`,n]} contentStyle={TS}/>
                  <Legend wrapperStyle={{fontSize:12}}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div style={{fontWeight:700,fontSize:14,marginBottom:16,color:"#f1f5f9"}}>Top 15 Statuses by Count</div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={an.sd.slice(0,15)} layout="vertical" margin={{left:0,right:16}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                  <XAxis type="number" tick={{fill:"#64748b",fontSize:11}}/>
                  <YAxis type="category" dataKey="status" tick={{fill:"#94a3b8",fontSize:10}} width={180}/>
                  <Tooltip contentStyle={TS}/>
                  <Bar dataKey="count" radius={[0,4,4,0]}>
                    {an.sd.slice(0,15).map((e,i)=><Cell key={i} fill={GC[e.grp]||PC[i%PC.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card" style={{gridColumn:"1/-1"}}>
              <div style={{fontWeight:700,fontSize:14,marginBottom:16,color:"#f1f5f9"}}>Group Summary</div>
              <table>
                <thead><tr><th>Group</th><th>Count</th><th>%</th><th style={{width:220}}>Distribution</th></tr></thead>
                <tbody>{an.gd.map(g=><tr key={g.name}>
                  <td><span className="bdg" style={{background:(GC[g.name]||"#3b82f6")+"33",color:GC[g.name]||"#94a3b8"}}>{g.name}</span></td>
                  <td style={{fontWeight:600}}>{g.value.toLocaleString()}</td>
                  <td>{g.pct}%</td>
                  <td><Pb pct={parseFloat(g.pct)} c={GC[g.name]||"#3b82f6"}/></td>
                </tr>)}</tbody>
              </table>
            </div>
          </div>}

          {/* Status Detail */}
          {tab==="status"&&<div className="card">
            <div style={{fontWeight:700,fontSize:14,marginBottom:4,color:"#f1f5f9"}}>Status Detail — {an.sd.length} Valid Statuses Found</div>
            <div style={{fontSize:12,color:"#64748b",marginBottom:16}}>Only statuses present in your file are shown. Statuses not in the 255-code master list are excluded.</div>
            <div style={{overflowX:"auto"}}>
              <table>
                <thead><tr><th>#</th><th>Status</th><th>Group</th><th>Touch Point</th><th>Count</th><th>%</th><th style={{width:100}}>Bar</th></tr></thead>
                <tbody>{an.sd.map((s,i)=><tr key={s.status}>
                  <td style={{color:"#475569"}}>{i+1}</td>
                  <td style={{fontWeight:500,color:"#e2e8f0"}}>{s.status}</td>
                  <td><span className="bdg" style={{background:(GC[s.grp]||"#3b82f6")+"33",color:GC[s.grp]||"#94a3b8"}}>{s.grp}</span></td>
                  <td style={{color:"#94a3b8"}}>{s.tp}</td>
                  <td style={{fontWeight:600,color:"#f1f5f9"}}>{s.count.toLocaleString()}</td>
                  <td style={{color:"#60a5fa"}}>{s.pct}%</td>
                  <td><Pb pct={parseFloat(s.pct)} c={GC[s.grp]||"#3b82f6"}/></td>
                </tr>)}</tbody>
              </table>
            </div>
          </div>}

          {/* Collectors */}
          {tab==="collectors"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div className="card" style={{gridColumn:"1/-1"}}>
              <div style={{fontWeight:700,fontSize:14,marginBottom:4,color:"#f1f5f9"}}>Collector Efforts (Remark By)</div>
              {an.cd.length===0
                ?<div style={{color:"#64748b",fontSize:13,marginTop:8}}>No "Remark By" column detected in the uploaded file.</div>
                :<>
                  <div style={{fontSize:12,color:"#64748b",marginBottom:16}}>{an.cd.length} collectors · {an.T.toLocaleString()} total efforts</div>
                  <div style={{maxHeight:380,overflowY:"auto"}}>
                    <table>
                      <thead><tr><th>Rank</th><th>Collector</th><th>Efforts</th><th>% Share</th><th style={{width:160}}>Bar</th></tr></thead>
                      <tbody>{an.cd.map((c,i)=><tr key={c.name}>
                        <td style={{color:"#475569"}}>{i+1}</td>
                        <td style={{fontWeight:500,color:"#e2e8f0"}}>{c.name}</td>
                        <td style={{fontWeight:700,color:"#22c55e"}}>{c.count.toLocaleString()}</td>
                        <td style={{color:"#60a5fa"}}>{((c.count/an.T)*100).toFixed(1)}%</td>
                        <td><Pb pct={(c.count/an.cd[0].count)*100} c="#3b82f6"/></td>
                      </tr>)}</tbody>
                    </table>
                  </div>
                </>}
            </div>
            {an.cd.length>0&&<div className="card" style={{gridColumn:"1/-1"}}>
              <div style={{fontWeight:700,fontSize:14,marginBottom:16,color:"#f1f5f9"}}>Top 20 Collectors by Efforts</div>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={an.cd.slice(0,20)} margin={{bottom:90}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                  <XAxis dataKey="name" tick={{fill:"#64748b",fontSize:10}} angle={-40} textAnchor="end" interval={0}/>
                  <YAxis tick={{fill:"#64748b",fontSize:11}}/>
                  <Tooltip contentStyle={TS}/>
                  <Bar dataKey="count" fill="#3b82f6" radius={[4,4,0,0]} name="Efforts"/>
                </BarChart>
              </ResponsiveContainer>
            </div>}
          </div>}

          {/* PTP & Claims */}
          {tab==="ptp"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            {[
              {l:"PTP Records",v:an.pc.toLocaleString(),c:"#3b82f6",s:"rows with PTP amount > 0"},
              {l:"Total PTP Amount",v:"₱"+fN(an.pt),c:"#22c55e"},
              {l:"Claim Paid Records",v:an.cc.toLocaleString(),c:"#f59e0b",s:"rows with claim paid amount > 0"},
              {l:"Total Claim Paid Amount",v:"₱"+fN(an.ct),c:"#f97316"},
            ].map(k=><div key={k.l} className="sc">
              <div style={{fontSize:12,color:"#64748b",textTransform:"uppercase",letterSpacing:".05em",fontWeight:600}}>{k.l}</div>
              <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:26,fontWeight:700,color:k.c,marginTop:4}}>{k.v}</div>
              {k.s&&<div style={{fontSize:12,color:"#475569",marginTop:4}}>{k.s}</div>}
            </div>)}
            {an.pdd.length>0&&<div className="card" style={{gridColumn:"1/-1"}}>
              <div style={{fontWeight:700,fontSize:14,marginBottom:16,color:"#f1f5f9"}}>PTP Date Trend (Last 15 Dates)</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={an.pdd} margin={{bottom:70}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                  <XAxis dataKey="date" tick={{fill:"#64748b",fontSize:10}} angle={-35} textAnchor="end" interval={0}/>
                  <YAxis tick={{fill:"#64748b",fontSize:11}}/>
                  <Tooltip contentStyle={TS}/>
                  <Bar dataKey="count" fill="#3b82f6" radius={[4,4,0,0]} name="PTP Records"/>
                </BarChart>
              </ResponsiveContainer>
            </div>}
            {an.cdd.length>0&&<div className="card" style={{gridColumn:"1/-1"}}>
              <div style={{fontWeight:700,fontSize:14,marginBottom:16,color:"#f1f5f9"}}>Claim Paid Date Trend (Last 15 Dates)</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={an.cdd} margin={{bottom:70}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                  <XAxis dataKey="date" tick={{fill:"#64748b",fontSize:10}} angle={-35} textAnchor="end" interval={0}/>
                  <YAxis tick={{fill:"#64748b",fontSize:11}}/>
                  <Tooltip contentStyle={TS}/>
                  <Bar dataKey="count" fill="#f97316" radius={[4,4,0,0]} name="Claim Records"/>
                </BarChart>
              </ResponsiveContainer>
            </div>}
            {an.pdd.length===0&&an.cdd.length===0&&(
              <div style={{gridColumn:"1/-1",color:"#64748b",fontSize:13,padding:"8px 0"}}>No PTP Date or Claim Paid Date columns detected in the uploaded file.</div>
            )}
          </div>}

          {/* Touch Points */}
          {tab==="touch"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div className="card">
              <div style={{fontWeight:700,fontSize:14,marginBottom:16,color:"#f1f5f9"}}>Touch Point Distribution</div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={an.td} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({name,pct})=>`${name} ${pct}%`} labelLine={false}>
                    {an.td.map((e,i)=><Cell key={i} fill={PC[i%PC.length]}/>)}
                  </Pie>
                  <Tooltip formatter={(v,n,p)=>[`${v.toLocaleString()} (${p.payload.pct}%)`,n]} contentStyle={TS}/>
                  <Legend wrapperStyle={{fontSize:12}}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div style={{fontWeight:700,fontSize:14,marginBottom:16,color:"#f1f5f9"}}>Efforts by Touch Point</div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={an.td} layout="vertical" margin={{left:0,right:20}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                  <XAxis type="number" tick={{fill:"#64748b",fontSize:11}}/>
                  <YAxis type="category" dataKey="name" tick={{fill:"#94a3b8",fontSize:11}} width={130}/>
                  <Tooltip contentStyle={TS}/>
                  <Bar dataKey="count" radius={[0,4,4,0]}>
                    {an.td.map((e,i)=><Cell key={i} fill={PC[i%PC.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card" style={{gridColumn:"1/-1"}}>
              <div style={{fontWeight:700,fontSize:14,marginBottom:16,color:"#f1f5f9"}}>Touch Point Summary</div>
              <table>
                <thead><tr><th>Touch Point</th><th>Efforts</th><th>%</th><th style={{width:200}}>Bar</th></tr></thead>
                <tbody>{an.td.map((t,i)=><tr key={t.name}>
                  <td style={{fontWeight:500,color:"#e2e8f0"}}>{t.name}</td>
                  <td style={{fontWeight:700,color:PC[i%PC.length]}}>{t.count.toLocaleString()}</td>
                  <td>{t.pct}%</td>
                  <td><Pb pct={parseFloat(t.pct)} c={PC[i%PC.length]}/></td>
                </tr>)}</tbody>
              </table>
            </div>
          </div>}
        </>}
      </div>
    </div>
  );
}