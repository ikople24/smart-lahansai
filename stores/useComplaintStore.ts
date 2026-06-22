import { create } from 'zustand';
import axios from 'axios';

interface Complaint {
  _id: string;
  detail: string;
  category: string;
  problems: string[];
  images: string[];
  status: string;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  complaintId?: string;
  community?: string;
  isConfidential?: boolean;
  pdpaSensitive?: boolean;
  pdpaDetailRedactions?: { start: number; end: number }[];
  pdpaPublicSanitized?: boolean;
  location?: { lat: number; lng: number };
}

interface ComplaintState {
  complaints: Complaint[];
  isLoading: boolean;
  error: string | null;
  fetchComplaints: (status?: string) => Promise<void>;
}

const useComplaintStore = create<ComplaintState>((set) => ({
  complaints: [],
  isLoading: false,
  error: null,
  fetchComplaints: async (status?: string) => {
    set({ isLoading: true, error: null });
    try {
      const url = status ? `/api/complaints?status=${encodeURIComponent(status)}` : '/api/complaints';
      const res = await axios.get<Complaint[]>(url);
      console.log("(store) fetched complaints ✅", res.data);
      set({ complaints: res.data, isLoading: false });
    } catch (err: any) {
      console.error("(store) fetch error ❌", err.message);
      set({ error: err.message || 'Failed to fetch', isLoading: false });
    }
  }
}));

export default useComplaintStore;