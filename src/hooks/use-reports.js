import { useState, useEffect } from "react";
import { getReports, createReport, deleteReport } from "@/api/client";
import { toast } from "react-toastify";

export function useReports() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const response = await getReports();
      setReports(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch reports");
      toast.error("Failed to fetch reports");
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = async (reportData) => {
    try {
      const response = await createReport(reportData);
      setReports([...reports, response.data]);
      toast.success("Report generated successfully");
      return response.data;
    } catch (err) {
      toast.error("Failed to generate report");
      return null;
    }
  };

  const deleteReportById = async (id) => {
    try {
      await deleteReport(id);
      setReports(reports.filter((report) => report.id !== id));
      toast.success("Report deleted successfully");
    } catch (err) {
      toast.error("Failed to delete report");
    }
  };

  return {
    reports,
    isLoading,
    error,
    generateReport,
    deleteReport: deleteReportById,
    refreshReports: fetchReports,
  };
}
