import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  LabelList,
} from "recharts";

/* ---------- palette ---------- */
const TEAL = "#0f766e";
const BRIGHT = "#14b8a6";
const AMBER = "#d97706";
const ROSE = "#be123c";
const DEEP = "#134e4a";

/* ---------- data (from survey, n = 16) ---------- */
const roleData = [
  { name: "หัวหน้าฝ่าย/งาน", value: 5 },
  { name: "เจ้าหน้าที่ปฏิบัติงาน", value: 5 },
  { name: "IT/สารสนเทศ", value: 2 },
  { name: "พนักงานจ้าง", value: 2 },
  { name: "ผู้บริหาร", value: 2 },
];
const roleColors = [TEAL, BRIGHT, "#5eead4", AMBER, DEEP];

const skillData = [
  { name: "ใช้คล่อง", value: 7, c: TEAL },
  { name: "ใช้บ้าง", value: 5, c: BRIGHT },
  { name: "ใช้น้อย", value: 3, c: AMBER },
  { name: "ไม่เคยใช้", value: 1, c: ROSE },
];

const painData = [
  { name: "ข้อมูลกระจาย ค้นหายาก", value: 9 },
  { name: "ประสานงานข้ามกองไม่สะดวก", value: 9 },
  { name: "ไม่มีแจ้งเตือนงานใหม่/ด่วน", value: 8 },
  { name: "ไม่มีระบบจัดการวัสดุ", value: 8 },
  { name: "ส่งต่องานข้ามฝ่ายช้า", value: 7 },
  { name: "รายงานทำมือ เสียเวลา", value: 7 },
  { name: "ขาด Dashboard ภาพรวม", value: 7 },
];

const timeData = [
  { name: "จัดทำรายงาน/เอกสาร", value: 12 },
  { name: "ลงพื้นที่ตรวจสอบ", value: 2 },
  { name: "ประสานงานภายใน", value: 1 },
  { name: "ติดตามสถานะงาน", value: 1 },
];

const featData = [
  { name: "แผนที่ GIS จุดปัญหา/บริการ", value: 3.75 },
  { name: "ระบบรับแจ้งร้องเรียน (แอป)", value: 3.69 },
  { name: "ระบบ AI ตอบคำถาม", value: 3.69 },
  { name: "ระบบติดตามสถานะงาน", value: 3.62 },
  { name: "ระบบขอยืมอุปกรณ์/วัสดุ", value: 3.62 },
  { name: "ระบบภาษีที่ดิน (ม.10)", value: 3.62 },
  { name: "บันทึกผู้สูงอายุ/ติดเตียง", value: 3.56 },
  { name: "รายงานสถิติ/ส่งออก Excel", value: 3.56 },
  { name: "แจ้งเตือนงาน (มือถือ)", value: 3.5 },
  { name: "Dashboard ภาพรวม", value: 3.5 },
];

const popData = [
  { name: "เชื่อมสวัสดิการ", value: 3.6 },
  { name: "ครัวเรือน", value: 3.6 },
  { name: "กลุ่มเปราะบาง", value: 3.53 },
  { name: "สถิติเกิด/ตาย/ย้าย", value: 3.53 },
  { name: "ทะเบียนราษฎร์", value: 3.47 },
];
const gisData = [
  { name: "Pin จุดร้องเรียน", value: 3.69 },
  { name: "เขตพื้นที่บริการ", value: 3.67 },
  { name: "Heat Map", value: 3.62 },
  { name: "โครงสร้างพื้นฐาน", value: 3.5 },
  { name: "บ้านผู้สูงอายุ", value: 3.47 },
  { name: "แปลงที่ดิน ม.10", value: 3.47 },
];
const dbData = [
  { name: "เชื่อมระหว่างกอง", value: 3.69 },
  { name: "API เชื่อมต่อ", value: 3.62 },
  { name: "Single Search", value: 3.56 },
  { name: "ดึงจากภายนอก", value: 3.5 },
  { name: "ส่งออกรายงาน", value: 3.5 },
];

const secData = [
  { name: "สำรองข้อมูล (Backup)", value: 13 },
  { name: "กำหนดสิทธิ์ผู้ใช้", value: 12 },
  { name: "เข้ารหัส PDPA", value: 11 },
  { name: "บันทึก Log การเข้าถึง", value: 9 },
  { name: "2FA ผู้ดูแลระบบ", value: 8 },
  { name: "แยกสิทธิ์ ผู้บริหาร/จนท.", value: 7 },
];
const execData = [
  { name: "ภาระงานแต่ละกอง", value: 10 },
  { name: "ความพึงพอใจประชาชน", value: 10 },
  { name: "งบฯ จริง vs แผน", value: 8 },
  { name: "จำนวนเรื่องร้องเรียน", value: 7 },
  { name: "เวลาเฉลี่ยแก้ปัญหา", value: 7 },
  { name: "Heat Map จุดปัญหา", value: 7 },
];

/* ---------- small ui helpers ---------- */
const Kicker = ({ num, title, note }: { num: string; title: string; note?: string }) => (
  <div className="flex items-baseline gap-3 mb-4 flex-wrap">
    <span className="font-mono text-sm font-semibold text-teal-700 border border-teal-700 rounded-md px-2 py-0.5">
      {num}
    </span>
    <h2 className="text-xl md:text-2xl font-bold text-teal-950">{title}</h2>
    {note && <span className="text-xs text-gray-500 ml-auto max-w-xs text-right hidden md:block">{note}</span>}
  </div>
);

const Card = ({ title, cap, children }: { title: string; cap?: string; children: React.ReactNode }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-5">
    <h3 className="font-bold text-gray-800">{title}</h3>
    {cap && <p className="text-sm text-gray-500 mb-3">{cap}</p>}
    {children}
  </div>
);

/* horizontal score bar (range 3–4) — height derives from row count so bar
   thickness & spacing stay consistent across cards with different item counts */
const ScoreBar = ({ data, color = BRIGHT, rowHeight = 44 }: { data: { name: string; value: number }[]; color?: string; rowHeight?: number }) => (
  <ResponsiveContainer width="100%" height={data.length * rowHeight}>
    <BarChart data={data} layout="vertical" margin={{ top: 4, bottom: 4, left: 8, right: 28 }} barCategoryGap="28%">
      <XAxis type="number" domain={[3, 4]} tick={{ fontSize: 11 }} />
      <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11 }} />
      <Tooltip cursor={{ fill: "rgba(15,118,110,0.06)" }} />
      <Bar dataKey="value" radius={[0, 5, 5, 0]} fill={color} maxBarSize={22}>
        <LabelList dataKey="value" position="right" style={{ fontSize: 11, fill: "#475569" }} />
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

/* horizontal count bar (range 0–16) */
const CountBar = ({ data, color, height = 240 }: { data: { name: string; value: number }[]; color: string; height?: number }) => (
  <ResponsiveContainer width="100%" height={height}>
    <BarChart data={data} layout="vertical" margin={{ left: 8, right: 28 }}>
      <XAxis type="number" domain={[0, 16]} tick={{ fontSize: 11 }} />
      <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11 }} />
      <Tooltip cursor={{ fill: "rgba(15,118,110,0.06)" }} />
      <Bar dataKey="value" radius={[0, 5, 5, 0]} fill={color}>
        <LabelList dataKey="value" position="right" style={{ fontSize: 11, fill: "#475569" }} />
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

const Insight = ({ tag, title, children, tone = "teal" }: { tag: string; title: string; children: React.ReactNode; tone?: "teal" | "amber" | "rose" }) => {
  const border = tone === "amber" ? "border-l-amber-600" : tone === "rose" ? "border-l-rose-700" : "border-l-teal-700";
  const tagc = tone === "amber" ? "text-amber-600" : tone === "rose" ? "text-rose-700" : "text-teal-700";
  return (
    <div className={`bg-white border border-gray-200 border-l-4 ${border} rounded-xl p-5`}>
      <div className={`font-mono text-xs tracking-wide uppercase font-semibold ${tagc}`}>{tag}</div>
      <h4 className="text-base font-bold mt-1.5 mb-1.5 text-gray-800">{title}</h4>
      <p className="text-sm text-gray-600">{children}</p>
    </div>
  );
};

const Phase = ({ pill, title, when, why, feats, tone }: { pill: string; title: string; when: string; why: string; feats: string[]; tone: string }) => {
  const bar = tone === "p2" ? "before:bg-teal-400" : tone === "p3" ? "before:bg-amber-600" : "before:bg-teal-700";
  const pillc = tone === "p2" ? "bg-teal-400" : tone === "p3" ? "bg-amber-600" : "bg-teal-700";
  return (
    <div className={`relative bg-white border border-gray-200 rounded-2xl p-6 mb-4 before:content-[''] before:absolute before:left-0 before:top-6 before:bottom-6 before:w-1 before:rounded ${bar}`}>
      <div className="flex items-center gap-3 mb-1.5 pl-3 flex-wrap">
        <span className={`font-mono text-xs font-semibold text-white px-3 py-0.5 rounded-full ${pillc}`}>{pill}</span>
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <span className="text-xs text-gray-500 ml-auto font-mono">{when}</span>
      </div>
      <p className="text-sm text-gray-500 pl-3 mb-3">{why}</p>
      <div className="flex flex-wrap gap-2 pl-3">
        {feats.map((f, i) => (
          <span key={i} className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700">{f}</span>
        ))}
      </div>
    </div>
  );
};

/* ---------- page ---------- */
export default function Roadmap() {
  return (
    <div className="max-w-5xl mx-auto pb-10">
      {/* Hero */}
      <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-teal-800 to-teal-600 text-teal-50 p-7 md:p-10 relative">
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <div className="font-mono text-xs tracking-[3px] uppercase text-teal-200">Smart Lahan Sai · Needs Assessment</div>
          <div className="font-mono text-xs text-teal-200">จัดทำ 29 มิถุนายน 2569</div>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold leading-snug max-w-2xl">
          สรุปผลแบบสำรวจความต้องการระบบดิจิทัล เทศบาลตำบลละหานทราย
        </h1>
        <p className="mt-3 text-teal-100 max-w-xl text-sm md:text-base">
          วิเคราะห์เสียงสะท้อนจากเจ้าหน้าที่และผู้บริหาร เพื่อจัดลำดับการพัฒนาระบบให้ตรงกับการใช้งานจริง
        </p>
        <div className="flex gap-7 mt-6 flex-wrap">
          {[["16", "ผู้ตอบแบบสำรวจ"], ["8", "กอง/สำนัก/ฝ่าย"], ["5", "ระดับบทบาท"], ["75%", "ใช้ดิจิทัลได้คล่อง–พอใช้"]].map(([n, l]) => (
            <div key={l}>
              <div className="text-2xl md:text-3xl font-extrabold leading-none">{n}</div>
              <div className="text-xs text-teal-200 mt-1">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 1 respondents */}
      <section className="mt-10">
        <Kicker num="01" title="ผู้ตอบแบบสำรวจ" note="ครอบคลุมครบทุกระดับและหลากหลายกอง" />
        <div className="grid md:grid-cols-2 gap-5">
          <Card title="บทบาทในองค์กร" cap="กระจายตั้งแต่ผู้บริหารถึงพนักงานจ้าง">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={roleData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={2}>
                  {roleData.map((_, i) => <Cell key={i} fill={roleColors[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center text-xs text-gray-600">
              {roleData.map((d, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <i className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: roleColors[i] }} />
                  {d.name} ({d.value})
                </span>
              ))}
            </div>
          </Card>
          <Card title="สังกัด · ระดับทักษะดิจิทัล" cap="สำนักปลัดตอบมากที่สุด · ส่วนใหญ่ใช้งานได้">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={skillData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: "rgba(15,118,110,0.06)" }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {skillData.map((d, i) => <Cell key={i} fill={d.c} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </section>

      {/* 2 problems */}
      <section className="mt-10">
        <Kicker num="02" title="ปัญหาที่เจอจริงในงานประจำ" note="ความต้องการระบบมาจากความเจ็บปวดเหล่านี้โดยตรง" />
        <div className="grid md:grid-cols-2 gap-5">
          <Card title="ปัญหาที่พบบ่อยที่สุด" cap="เลือกได้หลายข้อ · จากผู้ตอบ 16 คน">
            <CountBar data={painData} color={TEAL} height={250} />
          </Card>
          <Card title="งานที่กินเวลามากที่สุดต่อวัน" cap="จัดทำรายงาน/เอกสาร นำขาด 12/16">
            <CountBar data={timeData} color={BRIGHT} height={170} />
            <p className="text-sm text-gray-500 mt-3">
              เชื่อมโยงตรงกับปัญหา <b className="text-teal-800">ข้อมูลกระจาย</b> และ{" "}
              <b className="text-teal-800">รายงานทำมือ</b> — จุดที่ระบบควรแก้เป็นอันดับแรก
            </p>
          </Card>
        </div>
      </section>

      {/* 3 features */}
      <section className="mt-10">
        <Kicker num="03" title="ฟีเจอร์ที่ต้องการ — จัดอันดับด้วยคะแนน" note="คะแนนเต็ม 4.00 (จำเป็นมาก=4 … ไม่จำเป็น=1)" />
        <Card title="" cap="ทุกฟีเจอร์ได้คะแนนเกิน 3.5 — ไม่มีอันไหนตัดทิ้งได้ แต่ 3 อันดับแรกควรเริ่มก่อน">
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={featData} layout="vertical" margin={{ left: 8, right: 30 }}>
              <XAxis type="number" domain={[3, 4]} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 11 }} />
              <Tooltip cursor={{ fill: "rgba(15,118,110,0.06)" }} />
              <Bar dataKey="value" radius={[0, 5, 5, 0]}>
                {featData.map((_, i) => <Cell key={i} fill={i < 3 ? TEAL : i < 6 ? BRIGHT : "#7dd3c8"} />)}
                <LabelList dataKey="value" position="right" style={{ fontSize: 11, fill: "#475569" }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </section>

      {/* 4 deep dive */}
      <section className="mt-10">
        <Kicker num="04" title="ความต้องการเชิงลึก" note="ข้อมูลประชากร · แผนที่ GIS · ฐานข้อมูลกลาง" />
        <div className="grid md:grid-cols-3 gap-5">
          <Card title="5.1 ข้อมูลประชากร" cap="อยากเห็นข้อมูลที่เชื่อมโยงกัน"><ScoreBar data={popData} /></Card>
          <Card title="5.2 แผนที่ GIS" cap="Pin จุดร้องเรียน + เขตบริการ นำ"><ScoreBar data={gisData} /></Card>
          <Card title="5.3 ฐานข้อมูลกลาง" cap="เชื่อมข้อมูลระหว่างกอง สูงสุด"><ScoreBar data={dbData} /></Card>
        </div>
      </section>

      {/* 5 security + exec */}
      <section className="mt-10">
        <Kicker num="05" title="ความปลอดภัย และมุมผู้บริหาร" />
        <div className="grid md:grid-cols-2 gap-5">
          <Card title="5.4 ความปลอดภัยที่ให้ความสำคัญ" cap="Backup · กำหนดสิทธิ์ · เข้ารหัส PDPA นำ">
            <CountBar data={secData} color={DEEP} />
          </Card>
          <Card title="ข้อมูลที่ผู้บริหารต้องการ" cap="ภาระงานแต่ละกอง + ความพึงพอใจประชาชน นำ">
            <CountBar data={execData} color={AMBER} />
          </Card>
        </div>
      </section>

      {/* 6 strategic insights */}
      <section className="mt-10">
        <Kicker num="06" title="ข้อค้นพบเชิงกลยุทธ์" />
        <div className="grid md:grid-cols-2 gap-4">
          <Insight tag="Platform" title="ต้องเป็น Responsive / PWA · 75%">
            12 จาก 16 คน (75%) ต้องการเข้าถึงทั้งมือถือและเว็บ — ระบบเดียวต้องใช้ได้ทั้งสองจอ
          </Insight>
          <Insight tag="ข้อจำกัด · เร่งด่วน" title="เน็ตในพื้นที่ไม่เสถียร · 75%" tone="rose">
            12 จาก 16 คน (75%) ระบุเป็นอุปสรรค — ต้องออกแบบ offline-first ให้บันทึกงานได้แม้สัญญาณขาด แล้วค่อย sync ทีหลัง
          </Insight>
          <Insight tag="การยอมรับระบบ" title="ราว 50% ต้องการอบรมการใช้งาน" tone="amber">
            56% (9/16) ยังไม่คุ้นแอป และ 44% (7/16) มองว่าขาดงบฯ อบรม — ต้องมี onboarding + ฝึกอบรม มิฉะนั้นระบบดีแค่ไหนก็ไม่ถูกใช้จริง
          </Insight>
          <Insight tag="Compliance" title="PDPA: 62% ยังเข้าใจไม่เต็มที่" tone="amber">
            10 จาก 16 คน (62%) เลือก &quot;เข้าใจบ้าง/ยังไม่เข้าใจ&quot; — ทีมพัฒนาต้องช่วยดูแล compliance ทั้งกำหนดสิทธิ์ เข้ารหัส และ Log การเข้าถึง
          </Insight>
        </div>
      </section>

      {/* 7 roadmap */}
      <section className="mt-10">
        <Kicker num="07" title="แนวทางพัฒนาต่อยอด · จัดลำดับตามความต้องการ" />
        <Phase
          tone="p1"
          pill="PHASE 1"
          title="แก้ pain point หลัก — เริ่มได้ทันที"
          when="เดือน 1–3"
          why='โฟกัสสิ่งที่คะแนนสูงสุดและตรงกับปัญหา "ข้อมูลกระจาย + รายงานทำมือ + ประสานงานข้ามกอง"'
          feats={["ระบบรับแจ้งเรื่องร้องเรียน ผ่านแอป (3.69)", "แผนที่ GIS Pin จุดปัญหา + เขตบริการ (3.75)", "ระบบติดตามสถานะงาน ส่งต่อข้ามฝ่าย (3.62)", "รายงานสถิติ ส่งออก Excel อัตโนมัติ"]}
        />
        <Phase
          tone="p2"
          pill="PHASE 2"
          title="เชื่อมข้อมูล + ผู้บริหารเห็นภาพรวม"
          when="เดือน 4–6"
          why='ตอบโจทย์ "เชื่อมข้อมูลระหว่างกอง" (3.69) และ Dashboard ที่ผู้บริหารอยากเห็น'
          feats={["ฐานข้อมูลกลาง + Single Search", "เชื่อมข้อมูลระหว่างกอง อัตโนมัติ", "Dashboard ผู้บริหาร ภาระงาน·พึงพอใจ·งบฯ", "Heat Map จุดปัญหาบ่อย", "ข้อมูลประชากร เชื่อมสวัสดิการ"]}
        />
        <Phase
          tone="p3"
          pill="PHASE 3"
          title="ต่อยอดอัจฉริยะ + ขยายผล"
          when="เดือน 7–9"
          why="ฟีเจอร์ขั้นสูงที่คะแนนสูงแต่ต้องมีฐานข้อมูลพร้อมก่อน"
          feats={["AI ตอบคำถามข้อมูลองค์กร (3.69)", "ระบบภาษีที่ดิน ม.10 + แปลงที่ดิน", "บันทึกผู้สูงอายุ/ติดเตียง", "ระบบขอยืมอุปกรณ์/วัสดุ", "API เชื่อมระบบภายนอก/อนาคต"]}
        />
        <div className="bg-white border border-gray-200 border-l-4 border-l-teal-400 rounded-xl p-5 mt-5">
          <div className="font-mono text-xs tracking-wide uppercase font-semibold text-teal-500">เสียงสะท้อนสรุปทั้งหมด</div>
          <h4 className="text-base font-bold mt-1.5 mb-1.5 text-gray-800">&quot;ข้อมูลเชื่อมโยงถึงกัน และสามารถใช้งานง่าย&quot;</h4>
          <p className="text-sm text-gray-600">คำขอเดียวที่สรุปทุกความต้องการ — ระบบที่ดีต้องเชื่อมข้อมูลให้ไหลถึงกัน และเรียบง่ายพอที่ทุกระดับใช้ได้จริง</p>
        </div>
      </section>
    </div>
  );
}