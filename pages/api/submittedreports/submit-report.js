// pages/api/submittedreports/submit-report.js
import dbConnect from "@/lib/dbConnect";
import SubmittedReport from "@/models/SubmittedReport";
import getNextSequence from "@/lib/getNextSequence";

const N8N_WEBHOOK_URL = "https://primary-production-a1769.up.railway.app/webhook/sm-lahansai";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    await dbConnect();
    const complaintId = await getNextSequence("complaintId");
    const newReport = await SubmittedReport.create({
      ...req.body,
      complaintId,
    });

    // ✅ Return 201 ทันที — user ไม่ต้องรอ n8n
    res.status(201).json({ success: true, data: newReport, complaintId });

    // ── Fire-and-forget: ทำต่อหลัง response ส่งไปแล้ว ──────────────────────
    // เรียงภาพให้ล่าสุดอยู่ index 0 (n8n อ่าน images[0])
    const reportData = newReport.toObject();
    const orderedImages = Array.isArray(reportData.images)
      ? [...reportData.images].filter(Boolean).reverse()
      : [];

    fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...reportData, images: orderedImages }),
      signal: AbortSignal.timeout(8000),
    }).then(async (r) => {
      if (!r.ok) console.error("🚨 n8n webhook failed:", r.status, await r.text());
    }).catch((err) => {
      if (err?.name === "TimeoutError") {
        console.warn("[n8n] Webhook timed out");
      } else {
        console.error("[n8n] Webhook error:", err);
      }
    });

  } catch (error) {
    console.error("[submit-report] Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: "Server error" });
    }
  }
}
