"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  FileText,
  Bell,
  HelpCircle,
  User,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Layers,
  Upload,
} from "lucide-react";
import {
  INITIAL_REPORTS,
  MOCK_PATIENTS,
  PatientReport,
  ReportStatus,
} from "@/lib/data/reports-data";
import { SummaryCards } from "@/components/reports/SummaryCard";
import { FilterControls, FilterState } from "@/components/reports/FilterPanel";
import { ReportTable } from "@/components/reports/ReportTable";
import { ReportAnalysisDetailModal } from "@/components/reports/ReportAnalysisDetailModal";
import { PatientUploadModal } from "@/components/reports/PatientUploadModal";
import { PatientProfileModal } from "@/components/reports/PatientProfileModal";
import { ToastNotification } from "@/components/reports/ToastNotification";

const INITIAL_FILTERS: FilterState = {
  searchQuery: "",
  reportType: "all",
  category: "all",
  reviewStatus: "all",
  dateRange: "all",
  patientId: "all",
  sortBy: "newest",
  majorTab: "all",
  aiStatus: "all",
  providerAgreement: "all",
};

export function DoctorReportsClient() {
  const [reports, setReports] = useState<PatientReport[]>(INITIAL_REPORTS);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<PatientReport | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const pageSize = 10;

  // Dynamic Summary Counts (Section 4)
  const totalCount = reports.length;
  const reviewRequiredCount = reports.filter((r) => r.status === "review_required").length;
  const improveCount = reports.filter((r) => r.status === "improve").length;
  const newFindingsCount = reports.filter((r) => r.status === "new_findings").length;

  // Patient Options for Filter Dropdown
  const patientOptions = useMemo(() => {
    return Object.values(MOCK_PATIENTS).map((p) => ({ id: p.id, name: p.name }));
  }, []);

  // Filter and Sort Processing (Section 8, 9, 10, 29, 38, 42)
  const filteredAndSortedReports = useMemo(() => {
    let result = [...reports];

    // 1. Search filter (real-time matching patient name, ID, report name, category)
    if (filters.searchQuery.trim() !== "") {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.patientName.toLowerCase().includes(q) ||
          r.patientId.toLowerCase().includes(q) ||
          r.reportName.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.summary.toLowerCase().includes(q)
      );
    }

    // 2. Major Tab Filter (Section 3: Report Analysis Option)
    if (filters.majorTab === "images") {
      result = result.filter(
        (r) =>
          ["X-Ray", "CT Scan", "MRI", "Ultrasound", "Imaging"].includes(r.category) ||
          r.sourceFiles?.some((f) => f.isImage)
      );
    } else if (filters.majorTab === "lab") {
      result = result.filter((r) => ["Blood Test", "Pathology"].includes(r.category));
    } else if (filters.majorTab === "pathology") {
      result = result.filter((r) => r.category === "Pathology");
    } else if (filters.majorTab === "radiology") {
      result = result.filter((r) =>
        ["X-Ray", "CT Scan", "MRI", "Ultrasound", "Imaging"].includes(r.category)
      );
    } else if (filters.majorTab === "other") {
      result = result.filter((r) => ["General Health", "Other"].includes(r.category));
    }

    // 3. Report Type / Status filter
    if (filters.reportType !== "all") {
      result = result.filter((r) => r.status === filters.reportType);
    }

    // 4. Category filter
    if (filters.category !== "all") {
      result = result.filter((r) => r.category === filters.category);
    }

    // 5. Review status filter
    if (filters.reviewStatus !== "all") {
      result = result.filter((r) => r.reviewStatus === filters.reviewStatus);
    }

    // 6. AI Analysis Status filter (Section 38)
    if (filters.aiStatus !== "all") {
      result = result.filter((r) => r.aiAnalysisStatus === filters.aiStatus);
    }

    // 7. Provider Agreement filter (Section 38)
    if (filters.providerAgreement !== "all") {
      result = result.filter((r) => r.providerAgreement === filters.providerAgreement);
    }

    // 8. Patient ID filter
    if (filters.patientId !== "all") {
      result = result.filter((r) => r.patientId === filters.patientId);
    }

    // 9. Date range filter
    if (filters.dateRange !== "all") {
      const referenceNow = new Date("2026-10-02T12:00:00Z").getTime();
      const dayMs = 24 * 60 * 60 * 1000;

      result = result.filter((r) => {
        const reportTime = new Date(r.date).getTime();
        const diffDays = (referenceNow - reportTime) / dayMs;

        if (filters.dateRange === "today") return diffDays <= 1;
        if (filters.dateRange === "7days") return diffDays <= 7;
        if (filters.dateRange === "30days") return diffDays <= 30;
        if (filters.dateRange === "90days") return diffDays <= 90;
        return true;
      });
    }

    // 10. Sorting
    result.sort((a, b) => {
      if (filters.sortBy === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (filters.sortBy === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (filters.sortBy === "patient_asc") {
        return a.patientName.localeCompare(b.patientName);
      }
      if (filters.sortBy === "patient_desc") {
        return b.patientName.localeCompare(a.patientName);
      }
      if (filters.sortBy === "priority") {
        const priorityOrder: Record<ReportStatus, number> = {
          review_required: 1,
          new_findings: 2,
          improve: 3,
        };
        return priorityOrder[a.status] - priorityOrder[b.status];
      }
      return 0;
    });

    return result;
  }, [reports, filters]);

  // Handlers
  function handleFilterChange(newFilterUpdates: Partial<FilterState>) {
    setFilters((prev) => ({ ...prev, ...newFilterUpdates }));
    setCurrentPage(1); // Reset to page 1 on filter modification
  }

  function handleClearFilters() {
    setFilters(INITIAL_FILTERS);
    setCurrentPage(1);
    setToastMessage("All filters cleared");
  }

  function handleSelectSummaryCardStatus(status: ReportStatus | "all") {
    if (filters.reportType === status) {
      handleFilterChange({ reportType: "all" });
    } else {
      handleFilterChange({ reportType: status });
    }
  }

  function handleToggleReview(reportId: string) {
    let newReviewState = "reviewed";
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          const nextState = r.reviewStatus === "reviewed" ? "unreviewed" : "reviewed";
          newReviewState = nextState;
          return { ...r, reviewStatus: nextState };
        }
        return r;
      })
    );

    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport((prev) => (prev ? { ...prev, reviewStatus: newReviewState as any } : null));
    }

    setToastMessage(
      newReviewState === "reviewed"
        ? "Report marked as reviewed"
        : "Report marked as unreviewed"
    );
  }

  function handleChangeStatus(reportId: string, newStatus: ReportStatus) {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          return { ...r, status: newStatus };
        }
        return r;
      })
    );

    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    const readableStatus =
      newStatus === "review_required"
        ? "Review Required"
        : newStatus === "improve"
        ? "Improve"
        : "New Findings";

    setToastMessage(`Report status updated to "${readableStatus}"`);
  }

  function handleReportUploaded(newReport: PatientReport) {
    setReports((prev) => [newReport, ...prev]);
    setSelectedReport(newReport);
    setToastMessage(`Report "${newReport.reportName}" uploaded and analyzed by 3 AI models.`);
  }

  function handleSelectReportById(reportId: string) {
    const target = reports.find((r) => r.id === reportId);
    if (target) {
      setSelectedReport(target);
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-['Quicksand',sans-serif] pt-2 sm:pt-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#D6EDE1]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-[#064E3B] tracking-tight">
              Patient Reports
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F8F0] text-[#059669] border border-[#BCE8D0]">
              Clinical Inbox
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Review and manage diagnostic laboratory tests, pathology reports, and imaging scans with AI decision support.
          </p>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Report</span>
          </button>

          <Link
            href="/doctor/notifications"
            className="p-2 rounded-2xl border border-[#D6EDE1] bg-white hover:bg-[#E8F8F0] text-slate-700 hover:text-[#064E3B] transition-colors shadow-2xs relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-[#059669] absolute top-1.5 right-1.5" />
          </Link>

          <Link
            href="/doctor/settings"
            className="p-2 rounded-2xl border border-[#D6EDE1] bg-white hover:bg-[#E8F8F0] text-slate-700 hover:text-[#064E3B] transition-colors shadow-2xs"
            title="Help and Integration Status"
          >
            <HelpCircle className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 4 Report Summary Cards */}
      <SummaryCards
        totalCount={totalCount}
        reviewRequiredCount={reviewRequiredCount}
        improveCount={improveCount}
        newFindingsCount={newFindingsCount}
        activeStatusFilter={filters.reportType}
        onSelectStatusFilter={handleSelectSummaryCardStatus}
      />

      {/* Main Reports Section Header & Controls */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-700" />
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Report Analysis & Directory
            </h2>
          </div>

          <span className="text-xs text-slate-600 font-medium">
            AI second-reader decision support for attending physicians
          </span>
        </div>

        {/* Filter Controls (Search, Report Type, Sorting, Expandable Filters) */}
        <FilterControls
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          patientOptions={patientOptions}
          isPanelOpen={isFilterPanelOpen}
          onTogglePanel={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
          totalFilteredCount={filteredAndSortedReports.length}
          onOpenUploadModal={() => setIsUploadModalOpen(true)}
        />

        {/* Table List & Mobile Cards (Sections 11-13, 25, 26) */}
        <ReportTable
          reports={filteredAndSortedReports}
          totalReportsCount={filteredAndSortedReports.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={(p) => setCurrentPage(p)}
          onViewReport={(r) => setSelectedReport(r)}
          onViewPatient={(pid) => setSelectedPatientId(pid)}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Two-Column Report Analysis Detail Modal (Sections 4, 11-17, 39, 44) */}
      {selectedReport && (
        <ReportAnalysisDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onToggleReview={handleToggleReview}
          onChangeStatus={handleChangeStatus}
          onOpenPatientProfile={(pid) => {
            setSelectedReport(null);
            setSelectedPatientId(pid);
          }}
          onSelectReportById={handleSelectReportById}
          onShowToast={(msg) => setToastMessage(msg)}
        />
      )}

      {/* Patient Upload Modal (Sections 1 & 2) */}
      <PatientUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onReportCreated={handleReportUploaded}
      />

      {/* Patient Profile Modal (Section 39) */}
      {selectedPatientId && (
        <PatientProfileModal
          patientId={selectedPatientId}
          onClose={() => setSelectedPatientId(null)}
          onSelectReport={(r) => {
            setSelectedPatientId(null);
            setSelectedReport(r);
          }}
        />
      )}

      {/* Toast Feedback (Section 37) */}
      <ToastNotification
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
