"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Users,
  AlertTriangle,
  ShieldCheck,
  ArrowUpDown,
  ChevronRight,
  Calendar,
} from "lucide-react";

export interface PatientRowData {
  id: string;
  name: string;
  email: string;
  dob: string | null;
  gender: string | null;
  bloodGroup: string | null;
  lastVisitDate: string;
  lastVisitTimestamp: number;
  latestUpdateName: string;
  latestUpdateDate: string;
  status: "REQUIRES_REVIEW" | "STABLE";
  primaryCondition?: string;
  keyBiomarker?: string;
}

interface DoctorPatientsClientProps {
  patients: PatientRowData[];
}

export function DoctorPatientsClient({ patients }: DoctorPatientsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "REVIEW" | "STABLE">("ALL");
  const [sortField, setSortField] = useState<"lastVisit" | "name" | "status">("lastVisit");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  function getAge(dob: string | null): number {
    if (!dob) return 50;
    const year = parseInt(dob.split("-")[0]);
    return isNaN(year) ? 50 : new Date().getFullYear() - year;
  }

  function handleSort(field: "lastVisit" | "name" | "status") {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder(field === "name" ? "asc" : "desc");
    }
  }

  const reviewCount = patients.filter((p) => p.status === "REQUIRES_REVIEW").length;
  const stableCount = patients.filter((p) => p.status === "STABLE").length;

  const filteredPatients = useMemo(() => {
    let list = patients.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        (p.primaryCondition && p.primaryCondition.toLowerCase().includes(q));

      if (!matchSearch) return false;
      if (filterType === "REVIEW") return p.status === "REQUIRES_REVIEW";
      if (filterType === "STABLE") return p.status === "STABLE";
      return true;
    });

    list.sort((a, b) => {
      let cmp = 0;
      if (sortField === "lastVisit") {
        cmp = (b.lastVisitTimestamp || 0) - (a.lastVisitTimestamp || 0);
      } else if (sortField === "name") {
        cmp = a.name.localeCompare(b.name);
      } else if (sortField === "status") {
        const valA = a.status === "REQUIRES_REVIEW" ? 1 : 0;
        const valB = b.status === "REQUIRES_REVIEW" ? 1 : 0;
        cmp = valB - valA;
      }
      return sortOrder === "asc" ? -cmp : cmp;
    });

    return list;
  }, [patients, searchQuery, filterType, sortField, sortOrder]);

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      
      {/* Search, Filter & Quick Sort (Clean & Simple) */}
      <div className="bg-white p-4 rounded-2xl border border-[#EFE8DE] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient name, email, or condition..."
            className="w-full bg-[#F3EDE4] border border-[#E7DFD1] rounded-xl pl-10 pr-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C89B5F]/20 font-medium"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilterType("ALL")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-semibold transition-all cursor-pointer ${
              filterType === "ALL"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-[#F3EDE4] text-slate-700 hover:bg-[#EBE2D5]"
            }`}
          >
            All Patients ({patients.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterType("REVIEW")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterType === "REVIEW"
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Requires Review ({reviewCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterType("STABLE")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterType === "STABLE"
                ? "bg-emerald-700 text-white shadow-xs"
                : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Stable ({stableCount})</span>
          </button>
        </div>

      </div>

      {/* Clean, Simple Patients Table */}
      <div className="bg-white rounded-2xl border border-[#EFE8DE] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#EFE8DE] text-slate-500 font-bold uppercase text-xs tracking-wider select-none">
                
                {/* Name */}
                <th
                  onClick={() => handleSort("name")}
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Patient</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>

                {/* Age */}
                <th className="py-3.5 px-4">Age &amp; Gender</th>

                {/* Last Visit */}
                <th
                  onClick={() => handleSort("lastVisit")}
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Last Visit</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>

                {/* Condition */}
                <th className="py-3.5 px-4">Primary Condition</th>

                {/* Status */}
                <th
                  onClick={() => handleSort("status")}
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>

                {/* Action */}
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F7F3EC]">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500 text-sm">
                    No patients match your search.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((pat) => {
                  const age = getAge(pat.dob);
                  const isReview = pat.status === "REQUIRES_REVIEW";

                  return (
                    <tr
                      key={pat.id}
                      className="hover:bg-[#FAF7F2] transition-colors"
                    >
                      {/* Patient */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                              isReview
                                ? "bg-rose-100 text-rose-800 border border-rose-200"
                                : "bg-teal-100 text-teal-800 border border-teal-200"
                            }`}
                          >
                            {pat.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/doctor/patients/${pat.id}?tab=what-changed`}
                              className="font-bold text-slate-900 text-sm hover:text-[#0D8272] transition-colors block truncate"
                            >
                              {pat.name}
                            </Link>
                            <span className="text-xs text-slate-500 truncate block mt-0.5">
                              {pat.email}
                            </span>
                            {pat.name.includes("Rajesh") && (
                              <div className="mt-1">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-100 text-teal-800 border border-teal-300">
                                  <Users className="w-3 h-3 text-teal-700" />
                                  <span>Sharma Family Unit (4 Linked)</span>
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Age & Gender */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-700 text-sm font-medium">
                        {age} yrs &bull; {pat.gender || "Male"}
                      </td>

                      {/* Last Visit */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-teal-600" />
                          <span>{pat.lastVisitDate}</span>
                        </span>
                      </td>

                      {/* Condition */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="font-semibold text-slate-800 text-sm truncate block">
                          {pat.primaryCondition || pat.latestUpdateName}
                        </span>
                        {isReview && pat.keyBiomarker && (
                          <span className="text-xs text-rose-700 font-bold block mt-0.5">
                            {pat.keyBiomarker}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isReview ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-900 border border-rose-300">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                            <span>Requires Review</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Stable</span>
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Link
                          href={`/doctor/patients/${pat.id}?tab=what-changed`}
                          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-xs"
                        >
                          <span>Open Record</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
