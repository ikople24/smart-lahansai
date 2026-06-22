import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FaTrophy, FaListUl, FaChartBar, FaCalendarAlt, FaArrowUp, FaArrowDown, FaDownload, FaSmileBeam } from 'react-icons/fa';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { getThaiFiscalYear } from '@/lib/fiscalYear';
import { useMenuStore } from '@/stores/useMenuStore';
import CardModalDetail from '@/components/complaints/CardModalDetail';

const CHART_COLORS = [
  '#6366f1', '#3b82f6', '#10b981', '#f59e0b',
  '#ef4444', '#a855f7', '#ec4899', '#22c55e',
];

const RECENT_PAGE_SIZE = 9;

const thaiMonths = [
  { value: 1, short: 'ม.ค.', label: 'มกราคม' },
  { value: 2, short: 'ก.พ.', label: 'กุมภาพันธ์' },
  { value: 3, short: 'มี.ค.', label: 'มีนาคม' },
  { value: 4, short: 'เม.ย.', label: 'เมษายน' },
  { value: 5, short: 'พ.ค.', label: 'พฤษภาคม' },
  { value: 6, short: 'มิ.ย.', label: 'มิถุนายน' },
  { value: 7, short: 'ก.ค.', label: 'กรกฎาคม' },
  { value: 8, short: 'ส.ค.', label: 'สิงหาคม' },
  { value: 9, short: 'ก.ย.', label: 'กันยายน' },
  { value: 10, short: 'ต.ค.', label: 'ตุลาคม' },
  { value: 11, short: 'พ.ย.', label: 'พฤศจิกายน' },
  { value: 12, short: 'ธ.ค.', label: 'ธันวาคม' },
];

export default function DashboardPage() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const { menu, fetchMenu } = useMenuStore();

  const currentFiscalYearThai = getThaiFiscalYear(new Date());
  const fiscalYearOptions = Array.from({ length: 5 }, (_, i) => String(currentFiscalYearThai - i));

  const [year, setYear] = useState(String(currentFiscalYearThai));
  const [month, setMonth] = useState('');
  const [summary, setSummary] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [satisfaction, setSatisfaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState(null);
  const [recentPage, setRecentPage] = useState(1);

  const fiscalYearMonths = useMemo(() => {
    const fyThai = Number(year);
    if (!Number.isFinite(fyThai)) return [];
    const fiscalGregorianYear = fyThai - 543;
    const start = new Date(fiscalGregorianYear - 1, 9, 1);
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
      const monthNum = d.getMonth() + 1;
      const buddhistYear = d.getFullYear() + 543;
      const th = thaiMonths[monthNum - 1];
      return {
        value: `${d.getFullYear()}-${String(monthNum).padStart(2, '0')}`,
        label: `${th.short} ${buddhistYear}`,
        fullLabel: `${th.label} ${buddhistYear}`,
      };
    });
  }, [year]);

  const selectedMonthLabel = month ? (fiscalYearMonths.find((m) => m.value === month)?.label || month) : null;

  useEffect(() => {
    if (isLoaded && !userId) {
      router.replace('/');
    }
  }, [isLoaded, userId, router]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  useEffect(() => {
    setRecentPage(1);
    setModalData(null);
  }, [year, month]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const monthParam = month ? `&month=${encodeURIComponent(month)}` : '';
        const [complaintsRes, statsRes] = await Promise.all([
          fetch(`/api/complaints/fiscal-year?fiscalYear=${encodeURIComponent(year)}&role=admin${monthParam}`),
          fetch(`/api/submittedreports/stats?fiscalYear=${encodeURIComponent(year)}${monthParam}`)
        ]);

        const complaintsJson = await complaintsRes.json();
        const statsJson = await statsRes.json();

        const data = complaintsJson?.success && Array.isArray(complaintsJson?.data) ? complaintsJson.data : [];
        setSatisfaction(typeof statsJson?.satisfaction === 'number' ? statsJson.satisfaction : null);

        const countByCategory = data.reduce((acc, item) => {
          const cat = item.category || 'ไม่ระบุ';
          acc[cat] = (acc[cat] || 0) + 1;
          return acc;
        }, {});

        setSummary(Object.entries(countByCategory).map(([category, count]) => ({ category, count })));
        setRawData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setSatisfaction(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [year, month]);

  const total = summary.reduce((sum, item) => sum + item.count, 0);
  const topCategory = [...summary].sort((a, b) => b.count - a.count)[0]?.category || '-';
  const categoryCount = summary.length;

  const recentComplaintsSorted = useMemo(() => {
    return [...rawData].sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0));
  }, [rawData]);

  const recentTotalPages = Math.max(1, Math.ceil(recentComplaintsSorted.length / RECENT_PAGE_SIZE));

  const recentComplaintsPage = useMemo(() => {
    const start = (recentPage - 1) * RECENT_PAGE_SIZE;
    return recentComplaintsSorted.slice(start, start + RECENT_PAGE_SIZE);
  }, [recentComplaintsSorted, recentPage]);

  const getStatusBadgeClass = (status) => {
    if (status === 'ดำเนินการเสร็จสิ้น') return 'badge badge-success';
    if (status === 'อยู่ระหว่างดำเนินการ') return 'badge badge-info';
    return 'badge badge-ghost';
  };

  const exportToCSV = () => {
    const exportData = rawData.map((item, index) => ({
      'ลำดับ': index + 1,
      'รหัสคำร้อง': item.complaintId || 'ไม่ระบุ',
      'ประเภทปัญหา': item.category || 'ไม่ระบุ',
      'วันที่แจ้ง': item.createdAt ? new Date(item.createdAt).toLocaleDateString('th-TH') : 'ไม่ระบุ',
      'สถานะ': item.status || 'ไม่ระบุ',
      'รายละเอียด': item.detail || 'ไม่มีรายละเอียด',
      'ชุมชน': item.community || 'ไม่ระบุ',
    }));

    const headers = Object.keys(exportData[0] || {});
    const csvContent = [
      headers.join(','),
      ...exportData.map(row =>
        headers.map(header => {
          const value = row[header];
          if (typeof value === 'string' && (value.includes(',') || value.includes('\n') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob(['﻿' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const monthSuffix = month ? `_${month}` : '';
    link.download = `complaints_dashboard_${year}${monthSuffix}_${new Date().toISOString().split('T')[0]}.csv`;
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isLoaded || !userId) {
    return <div className="text-center p-8">กำลังโหลด...</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-lg text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Smart-Lahansai | แดชบอร์ด</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  📊 แดชบอร์ด
                </h1>
                <p className="text-gray-600">วิเคราะห์ข้อมูลการร้องเรียนประจำปีงบประมาณ</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-primary" />
                  <label className="text-sm font-medium text-gray-700">ปีงบประมาณ:</label>
                  <select
                    className="select select-bordered select-sm w-28 bg-white"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  >
                    {fiscalYearOptions.map((fy) => (
                      <option key={fy} value={fy}>{fy}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">เดือน:</label>
                  <select
                    className="select select-bordered select-sm w-40 bg-white"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                  >
                    <option value="">ทั้งปีงบประมาณ</option>
                    {fiscalYearMonths.map((m) => (
                      <option key={m.value} value={m.value}>{m.fullLabel}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={exportToCSV}
                  className="btn btn-sm gap-2 bg-green-600 hover:bg-green-700 text-white border-none"
                  disabled={rawData.length === 0}
                >
                  <FaDownload />
                  Export ({rawData.length})
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl">
              <div className="card-body py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 mb-1">รวมรายการทั้งหมด</p>
                    <p className="text-3xl font-bold">{total.toLocaleString()}</p>
                    <p className="text-xs opacity-80 mt-1 flex items-center gap-1">
                      <FaArrowUp className="text-green-300" />
                      {selectedMonthLabel || `ปีงบ ${year}`}
                    </p>
                  </div>
                  <FaListUl className="text-4xl opacity-70" />
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-xl">
              <div className="card-body py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 mb-1">ประเภทที่แจ้งมากที่สุด</p>
                    <p className="text-lg font-bold truncate max-w-[140px]">{topCategory}</p>
                    <p className="text-xs opacity-80 mt-1 flex items-center gap-1">
                      <FaChartBar className="text-yellow-300" />
                      อันดับ 1
                    </p>
                  </div>
                  <FaTrophy className="text-4xl opacity-70" />
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-xl">
              <div className="card-body py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 mb-1">จำนวนประเภทปัญหา</p>
                    <p className="text-3xl font-bold">{categoryCount}</p>
                    <p className="text-xs opacity-80 mt-1 flex items-center gap-1">
                      <FaArrowDown className="text-pink-300" />
                      ประเภท
                    </p>
                  </div>
                  <FaChartBar className="text-4xl opacity-70" />
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-xl">
              <div className="card-body py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 mb-1">ความพึงพอใจรวม</p>
                    <p className="text-3xl font-bold">{satisfaction !== null ? `${satisfaction}%` : '-'}</p>
                    <p className="text-xs opacity-80 mt-1 flex items-center gap-1">
                      <FaArrowUp className="text-emerald-200" />
                      {selectedMonthLabel || `ปีงบ ${year}`}
                    </p>
                  </div>
                  <FaSmileBeam className="text-4xl opacity-70" />
                </div>
              </div>
            </div>
          </div>

          {/* Chart + Category List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Bar Chart */}
            <div className="lg:col-span-2">
              <div className="card bg-white shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-gray-800 mb-4">
                    📈 จำนวนร้องเรียนตามประเภทปัญหา
                  </h3>
                  {summary.length === 0 ? (
                    <div className="h-72 flex items-center justify-center text-gray-400">
                      ไม่มีข้อมูลในช่วงที่เลือก
                    </div>
                  ) : (
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={summary.sort((a, b) => b.count - a.count)} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis
                            dataKey="category"
                            tick={{ fontSize: 11 }}
                            angle={-35}
                            textAnchor="end"
                            interval={0}
                          />
                          <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                          <Tooltip
                            formatter={(value) => [`${value} รายการ`, 'จำนวน']}
                            contentStyle={{ borderRadius: 8, fontSize: 13 }}
                          />
                          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                            {summary.map((_, index) => (
                              <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Category Ranking List */}
            <div className="lg:col-span-1">
              <div className="card bg-white shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-gray-800 mb-4">
                    📋 รายการประเภทปัญหา
                  </h3>
                  {summary.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-8">ไม่มีข้อมูล</p>
                  ) : (
                    <div className="space-y-3 overflow-y-auto max-h-64">
                      {[...summary].sort((a, b) => b.count - a.count).map((item, index) => (
                        <div key={item.category} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                            />
                            <div>
                              <p className="font-medium text-gray-800 text-sm truncate max-w-[120px]">{item.category}</p>
                              <p className="text-xs text-gray-500">{total > 0 ? ((item.count / total) * 100).toFixed(1) : 0}%</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-gray-800">{item.count}</p>
                            <p className="text-xs text-gray-500">รายการ</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Complaints */}
          <div className="card bg-white shadow-xl mb-8">
            <div className="card-body">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
                <div>
                  <h3 className="card-title text-gray-800">🕒 รายการปัญหาล่าสุด</h3>
                  <p className="text-sm text-gray-600">
                    {selectedMonthLabel ? `ช่วง: ${selectedMonthLabel}` : `ปีงบประมาณ ${year}`} • พบ {recentComplaintsSorted.length.toLocaleString()} รายการ
                  </p>
                </div>
                <Link href="/admin/manage-complaints" className="btn btn-outline btn-sm">
                  ไปหน้าจัดการเรื่องร้องเรียน →
                </Link>
              </div>

              {recentComplaintsSorted.length === 0 ? (
                <div className="text-center py-10 text-gray-500">ไม่พบข้อมูลในช่วงที่เลือก</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {recentComplaintsPage.map((item) => {
                      const createdAt = new Date(item?.createdAt || Date.now());
                      const imageUrl = Array.isArray(item?.images) ? item.images[0] : null;
                      const categoryIcon = menu?.find((m) => m.Prob_name === item?.category)?.Prob_pic;
                      const canOpenModal = Boolean(item?.complaintId && item?.category);

                      return (
                        <div
                          key={item?._id || item?.complaintId}
                          className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all bg-white"
                        >
                          <div className="h-40 bg-gray-100 relative overflow-hidden">
                            {imageUrl ? (
                              <img src={imageUrl} alt="ภาพปัญหา" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">ไม่มีภาพ</div>
                            )}
                            <div className="absolute top-2 left-2 flex items-center gap-2">
                              {categoryIcon && (
                                <img src={categoryIcon} alt={item?.category || ''} className="w-8 h-8 bg-white/80 rounded-lg p-1 object-contain" />
                              )}
                              <span className={getStatusBadgeClass(item?.status)}>
                                {item?.status || 'ไม่ระบุสถานะ'}
                              </span>
                            </div>
                            <div className="absolute top-2 right-2">
                              <span className="px-2 py-1 text-xs rounded-full bg-white/80 text-gray-700">
                                {createdAt.toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: '2-digit' })}
                              </span>
                            </div>
                          </div>

                          <div className="p-4">
                            <div className="font-semibold text-gray-900 truncate mb-1">
                              {item?.category || 'ไม่ระบุหมวดหมู่'}
                            </div>
                            {item?.community && (
                              <div className="text-xs text-gray-500 mb-2">ชุมชน: {item.community}</div>
                            )}
                            <div className="text-sm text-gray-700 line-clamp-2 mb-3">
                              {item?.detail || '-'}
                            </div>
                            <button
                              className="btn btn-sm btn-outline w-full"
                              disabled={!canOpenModal}
                              onClick={() => { if (canOpenModal) setModalData({ ...item, blurImage: false }); }}
                            >
                              ดูรายละเอียด
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {recentComplaintsSorted.length > RECENT_PAGE_SIZE && (
                    <div className="flex items-center justify-center gap-3 mt-6">
                      <button className="btn btn-sm btn-outline" disabled={recentPage <= 1} onClick={() => setRecentPage(p => p - 1)}>
                        ก่อนหน้า
                      </button>
                      <span className="text-sm text-gray-600">หน้า {recentPage} / {recentTotalPages}</span>
                      <button className="btn btn-sm btn-outline" disabled={recentPage >= recentTotalPages} onClick={() => setRecentPage(p => p + 1)}>
                        ถัดไป
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="card bg-gray-50 border border-gray-200">
            <div className="card-body text-center py-4">
              <p className="text-gray-500 text-sm">
                📊 ข้อมูลสรุปประจำปีงบประมาณ {year} • อัปเดตล่าสุด: {new Date().toLocaleDateString('th-TH')}
              </p>
            </div>
          </div>

        </div>
      </div>

      {modalData && (
        <CardModalDetail
          modalData={modalData}
          onClose={() => setModalData(null)}
        />
      )}
    </>
  );
}
