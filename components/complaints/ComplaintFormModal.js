import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import CommunitySelector from './CommunitySelector';
import ReporterInput from './ReporterInput';

import { useProblemOptionStore } from '@/stores/useProblemOptionStore';
import ImageUploads from '@/components/ImageUploads';
import Swal from 'sweetalert2';
import { z } from 'zod';
import Image from 'next/image';
const LocationConfirm = dynamic(() => import('@/components/LocationConfirm'), { ssr: false });

const schema = z.object({
  community: z.string().min(1, 'กรุณาระบุ 1 ชุมชน'),
});

const ComplaintFormModal = ({ selectedLabel, onClose }) => {
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const [prefix, setPrefix] = useState('นาย');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [detail, setDetail] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [location, setLocation] = useState(null);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [validateTrigger, setValidateTrigger] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const reporterValidRef = useRef(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { problemOptions, fetchProblemOptions } = useProblemOptionStore();

  useEffect(() => {
    fetchProblemOptions();
  }, [fetchProblemOptions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setValidateTrigger(true);
    await new Promise((resolve) => setTimeout(resolve, 0));

    const result = schema.safeParse({ community: selectedCommunity });
    if (!result.success) {
      setFormErrors(result.error.flatten().fieldErrors);
      return;
    } else {
      setFormErrors({});
    }

    if (!reporterValidRef.current) {
      await Swal.fire({
        icon: 'warning',
        title: 'กรุณาตรวจสอบข้อมูล',
        text: 'กรุณากรอกข้อมูลให้ถูกต้องก่อนส่งเรื่อง',
        confirmButtonText: 'ตกลง'
      });
      return;
    }

    if (!location) {
      await Swal.fire({
        icon: 'warning',
        title: 'กรุณาเลือกตำแหน่ง',
        text: 'ต้องระบุตำแหน่งก่อนส่งเรื่อง',
        confirmButtonText: 'ตกลง'
      });
      return;
    }

    if (imageUrls.length === 0) {
      await Swal.fire({
        icon: 'warning',
        title: 'กรุณาอัปโหลดรูปภาพ',
        text: 'ต้องมีอย่างน้อย 1 รูปภาพก่อนส่งเรื่อง',
        confirmButtonText: 'ตกลง'
      });
      return;
    }

    if (!fullName.trim()) {
      await Swal.fire({
        icon: 'warning',
        title: 'กรุณากรอกชื่อผู้แจ้ง',
        text: 'ต้องระบุชื่อผู้แจ้งก่อนส่งเรื่อง',
        confirmButtonText: 'ตกลง'
      });
      return;
    }

    if (selectedProblems.length === 0) {
      await Swal.fire({
        icon: 'warning',
        title: 'กรุณาเลือกรายการปัญหา',
        text: 'ต้องเลือกรายการปัญหาอย่างน้อย 1 รายการ',
        confirmButtonText: 'ตกลง'
      });
      return;
    }

    const payload = {
      fullName,
      phone,
      community: selectedCommunity,
      problems: selectedProblems.map(id => {
        const match = problemOptions.find(opt => opt._id === id);
        return match ? match.label : id;
      }),
      category: selectedLabel,
      images: imageUrls,
      detail,
      location,
      status: 'อยู่ระหว่างดำเนินการ',
      officer: '',
      updatedAt: new Date(),
    };

    console.log("📤 Payload ส่งไป backend:", payload);

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/submittedreports/submit-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-app-id': process.env.NEXT_PUBLIC_APP_ID || 'app_e',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('ส่งข้อมูลไม่สำเร็จ');

      const data = await res.json();
      const complaintId = data.complaintId;
      await new Promise((resolve) => setTimeout(resolve, 4000));
      await Swal.fire({
        icon: 'success',
        title: 'ส่งเรื่องสำเร็จ',
        html: `เลขที่เรื่องของคุณคือ <strong>${complaintId}</strong>`,
        confirmButtonText: 'ตกลง',
      });
      handleClearForm();
      onClose?.();
    } catch (err) {
      console.error('❌ เกิดข้อผิดพลาด:', err);
      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: err.message || 'ไม่สามารถส่งข้อมูลได้',
        confirmButtonText: 'ตกลง',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearForm = () => {
    setSelectedCommunity('');
    setPrefix('นาย');
    setFullName('');
    setAddress('');
    setPhone('');
    setDetail('');
    setImageUrls([]);
    setUseCurrentLocation(false);
    setLocation(null);
    setSelectedProblems([]);
    setValidateTrigger(false);
    setFormErrors({});
    reporterValidRef.current = true;
    setIsSubmitting(false);
  };

  const handleCommunitySelect = (community) => {
    setSelectedCommunity(community);
  };

  useEffect(() => {
    import('leaflet').then(L => {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/leaflet/marker-icon-2x.png',
        iconUrl: '/leaflet/marker-icon.png',
        shadowUrl: '/leaflet/marker-shadow.png',
      });
    });
  }, []);

  if (!selectedLabel) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 overflow-y-auto flex items-center justify-center transition-all">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all duration-300 opacity-0 scale-95 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-semibold text-gray-800">
            ฟอร์มสำหรับ: {selectedLabel}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-sm"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <CommunitySelector
            selected={selectedCommunity}
            onSelect={handleCommunitySelect}
            error={formErrors.community?.[0]}
          />
          <div>
            <p className="font-semibold text-sm text-gray-700">2.เลือกรายการปัญหา</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {problemOptions
                .filter(option => option.category === selectedLabel)
                .map(option => (
                  <button
                    key={option._id}
                    type="button"
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border whitespace-nowrap ${selectedProblems.includes(option._id) ? 'bg-pink-100 text-black border-pink-400' : 'border-gray-300 text-black hover:bg-gray-100'}`}
                    onClick={() => {
                      setSelectedProblems(prev =>
                        prev.includes(option._id)
                          ? prev.filter(id => id !== option._id)
                          : [...prev, option._id]
                      );
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src={option.iconUrl}
                        alt={option.label}
                        width={20}
                        height={20}
                        className="w-5 h-5"
                      />
                      <span>{option.label}</span>
                    </div>
                  </button>
                ))}
            </div>
          </div>
          <ImageUploads onChange={(urls) => setImageUrls(urls)} />
          <ReporterInput
            prefix={prefix}
            setPrefix={setPrefix}
            fullName={fullName}
            setFullName={setFullName}
            address={address}
            setAddress={setAddress}
            phone={phone}
            setPhone={setPhone}
            detail={detail}
            setDetail={setDetail}
            validateTrigger={validateTrigger}
            setValid={(v) => reporterValidRef.current = v}
          />
          <LocationConfirm
            useCurrent={useCurrentLocation}
            onToggle={setUseCurrentLocation}
            location={location}
            setLocation={setLocation}
          />
          <div className="flex mb-4 gap-2 justify-end">
            <button
              type="button"
              onClick={handleClearForm}
              className="btn btn-outline btn-warning"
            >
              ล้างฟอร์ม
            </button>
            <button type="submit" className="btn btn-info" disabled={isSubmitting}>
              {isSubmitting && <span className="loading loading-infinity loading-xs mr-2" />}
              ส่งเรื่อง
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintFormModal;
