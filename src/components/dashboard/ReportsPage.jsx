import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useWallets } from "@/hooks/use-wallets";
import { useCategories } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  PieChart,
  FileText,
  Download,
  Trash2,
  Plus,
  Calendar,
  FileSpreadsheet,
  FileIcon as FilePdf,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { toast } from "react-toastify";
import { FinancialChart } from "./FinancialChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import apiClient from "@/api/client";
import { Loader2 } from "lucide-react";
import jsPDF from "jspdf";
// import "jspdf-autotable"

// convert JSON data to CSV
function jsonToCSV(data) {
  if (!data || data.length === 0) return "";

  // Get headers
  const headers = Object.keys(data[0]);

  // Convert each object to a row
  const rows = data.map((obj) =>
    headers
      .map((header) => {
        const value = obj[header];
        // Handle values with commas, quotes, or newlines
        if (value === null || value === undefined) {
          return "";
        }
        const stringValue = String(value);
        if (
          stringValue.includes(",") ||
          stringValue.includes('"') ||
          stringValue.includes("\n")
        ) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      })
      .join(","),
  );

  // Combine headers and rows
  return [headers.join(","), ...rows].join("\n");
}

export function ReportsPage() {
  const { user } = useAuth();
  const { wallets } = useWallets();
  const { categories } = useCategories();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isCreateReportOpen, setIsCreateReportOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportParameters, setReportParameters] = useState({
    title: "",
    type: "expense_summary",
    wallet_id: "all",
    category_id: "all",
    start_date: startOfMonth(new Date()),
    end_date: endOfMonth(new Date()),
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/api/reports");
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);

      const reportData = {
        title: reportParameters.title,
        type: reportParameters.type,
        parameters: {
          wallet_id:
            reportParameters.wallet_id !== "all"
              ? Number.parseInt(reportParameters.wallet_id)
              : null,
          category_id:
            reportParameters.category_id !== "all"
              ? Number.parseInt(reportParameters.category_id)
              : null,
          start_date: reportParameters.start_date.toISOString(),
          end_date: reportParameters.end_date.toISOString(),
        },
      };

      const response = await apiClient.post("/api/reports", reportData);

      toast.success("Report generated successfully!");
      fetchReports();
      setIsCreateReportOpen(false);
      setSelectedReport(response.data.report);

      // Reset form
      setReportParameters({
        title: "",
        type: "expense_summary",
        wallet_id: "all",
        category_id: "all",
        start_date: startOfMonth(new Date()),
        end_date: endOfMonth(new Date()),
      });
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this report?")) {
      return;
    }

    try {
      await apiClient.delete(`/api/reports/${reportId}`);
      toast.success("Report deleted successfully");
      fetchReports();
      if (selectedReport?.id === reportId) {
        setSelectedReport(null);
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      toast.error("Failed to delete report");
    }
  };

  //  export report as JSON
  const handleExportReportJSON = (report) => {
    try {
      // JSON blob
      const data = JSON.stringify(report.data, null, 2);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      //  download link and trigger it
      const a = document.createElement("a");
      a.href = url;
      a.download = `${report.title.replace(/\s+/g, "_")}_${format(new Date(), "yyyy-MM-dd")}.json`;
      document.body.appendChild(a);
      a.click();

      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Report exported as JSON successfully");
    } catch (error) {
      console.error("Error exporting report as JSON:", error);
      toast.error("Failed to export report as JSON");
    }
  };

  // export report as CSV
  const handleExportReportCSV = (report) => {
    try {
      setIsExporting(true);
      let csvData = [];

      // Format data based on report type
      switch (report.type) {
        case "expense_summary":
        case "income_summary":
          // Convert category breakdown to array of objects
          csvData = Object.entries(report.data.category_breakdown || {}).map(
            ([category, amount]) => ({
              Category: category,
              Amount: amount,
            }),
          );

          // Add total row
          csvData.push({
            Category: "TOTAL",
            Amount: report.data.total_expenses || report.data.total_income || 0,
          });
          break;

        case "budget_analysis":
          csvData = (report.data.budgets || []).map((budget) => ({
            Category: budget.category,
            Period: budget.period,
            "Budget Amount": budget.budget_amount,
            "Spent Amount": budget.spent_amount,
            "Percentage Used": `${budget.percentage_used.toFixed(1)}%`,
            "Start Date": format(new Date(budget.start_date), "yyyy-MM-dd"),
            "End Date": budget.end_date
              ? format(new Date(budget.end_date), "yyyy-MM-dd")
              : "",
          }));
          break;

        case "cash_flow":
          // Convert daily flow to array of objects
          csvData = Object.entries(report.data.daily_flow || {})
            .sort((a, b) => new Date(a[0]) - new Date(b[0]))
            .map(([date, flow]) => ({
              Date: format(new Date(date), "yyyy-MM-dd"),
              Income: flow.income,
              Expense: flow.expense,
              "Net Flow": flow.net,
            }));

          // Add summary row
          csvData.push({
            Date: "TOTAL",
            Income: report.data.total_income || 0,
            Expense: report.data.total_expense || 0,
            "Net Flow": report.data.net_flow || 0,
          });
          break;

        default:
          csvData = [{ Error: "Report type not supported for CSV export" }];
      }

      // Convert to CSV
      const csv = jsonToCSV(csvData);

      // Create a CSV blob
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      // download link and trigger it
      const a = document.createElement("a");
      a.href = url;
      a.download = `${report.title.replace(/\s+/g, "_")}_${format(new Date(), "yyyy-MM-dd")}.csv`;
      document.body.appendChild(a);
      a.click();

      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Report exported as CSV successfully");
    } catch (error) {
      console.error("Error exporting report as CSV:", error);
      toast.error("Failed to export report as CSV");
    } finally {
      setIsExporting(false);
    }
  };

  //  export report as PDF
  const handleExportReportPDF = (report) => {
    try {
      setIsExporting(true);

      //  new PDF document
      const doc = new jsPDF();

      // Set font sizes and styles
      const titleFontSize = 18;
      const subtitleFontSize = 14;
      const normalFontSize = 12;
      const smallFontSize = 10;

      // Set margins and positions
      const margin = 20;
      let yPos = margin;

      // Add title
      doc.setFontSize(titleFontSize);
      doc.setFont("helvetica", "bold");
      doc.text(report.title, margin, yPos);
      yPos += 10;

      //  date range
      doc.setFontSize(normalFontSize);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Period: ${format(new Date(report.data.date_range?.start), "MMM d, yyyy")} - ${format(
          new Date(report.data.date_range?.end),
          "MMM d, yyyy",
        )}`,
        margin,
        yPos,
      );
      yPos += 6;

      //generation date
      doc.setFontSize(smallFontSize);
      doc.text(
        `Generated on: ${format(new Date(report.created_at), "MMM d, yyyy")}`,
        margin,
        yPos,
      );
      yPos += 10;

      // content based on report type
      switch (report.type) {
        case "expense_summary":
          // total expenses
          yPos += 5;
          doc.setFontSize(subtitleFontSize);
          doc.setFont("helvetica", "bold");
          doc.text(
            `Total Expenses: ${report.data.total_expenses?.toLocaleString() || 0}`,
            margin,
            yPos,
          );
          yPos += 10;

          // category breakdown table
          doc.setFontSize(normalFontSize);
          doc.setFont("helvetica", "bold");
          doc.text("Category Breakdown", margin, yPos);
          yPos += 8;

          // Draw table header
          doc.setFillColor(240, 240, 240);
          doc.rect(margin, yPos - 6, 170, 8, "F");
          doc.setFont("helvetica", "bold");
          doc.text("Category", margin + 5, yPos);
          doc.text("Amount", margin + 120, yPos);
          yPos += 8;

          // Draw table rows
          doc.setFont("helvetica", "normal");
          Object.entries(report.data.category_breakdown || {}).forEach(
            ([category, amount], index) => {
              // Alternate row background
              if (index % 2 === 0) {
                doc.setFillColor(248, 248, 248);
                doc.rect(margin, yPos - 6, 170, 8, "F");
              }

              doc.text(category, margin + 5, yPos);
              doc.text(amount.toLocaleString(), margin + 120, yPos);
              yPos += 8;

              // Add a new page if we're near the bottom
              if (yPos > 270) {
                doc.addPage();
                yPos = margin;
              }
            },
          );

          // Draw total row
          doc.setFillColor(230, 230, 230);
          doc.rect(margin, yPos - 6, 170, 8, "F");
          doc.setFont("helvetica", "bold");
          doc.text("TOTAL", margin + 5, yPos);
          doc.text(
            report.data.total_expenses?.toLocaleString() || "0",
            margin + 120,
            yPos,
          );
          break;

        case "income_summary":
          // total income
          yPos += 5;
          doc.setFontSize(subtitleFontSize);
          doc.setFont("helvetica", "bold");
          doc.text(
            `Total Income: ${report.data.total_income?.toLocaleString() || 0}`,
            margin,
            yPos,
          );
          yPos += 10;

          // Addcategory breakdown table
          doc.setFontSize(normalFontSize);
          doc.setFont("helvetica", "bold");
          doc.text("Category Breakdown", margin, yPos);
          yPos += 8;

          // Draw table header
          doc.setFillColor(240, 240, 240);
          doc.rect(margin, yPos - 6, 170, 8, "F");
          doc.setFont("helvetica", "bold");
          doc.text("Category", margin + 5, yPos);
          doc.text("Amount", margin + 120, yPos);
          yPos += 8;

          // Draw table rows
          doc.setFont("helvetica", "normal");
          Object.entries(report.data.category_breakdown || {}).forEach(
            ([category, amount], index) => {
              // Alternate row
              if (index % 2 === 0) {
                doc.setFillColor(248, 248, 248);
                doc.rect(margin, yPos - 6, 170, 8, "F");
              }

              doc.text(category, margin + 5, yPos);
              doc.text(amount.toLocaleString(), margin + 120, yPos);
              yPos += 8;

              if (yPos > 270) {
                doc.addPage();
                yPos = margin;
              }
            },
          );

          // Draw total row
          doc.setFillColor(230, 230, 230);
          doc.rect(margin, yPos - 6, 170, 8, "F");
          doc.setFont("helvetica", "bold");
          doc.text("TOTAL", margin + 5, yPos);
          doc.text(
            report.data.total_income?.toLocaleString() || "0",
            margin + 120,
            yPos,
          );
          break;

        case "budget_analysis":
          // budget analysis table
          yPos += 5;
          doc.setFontSize(subtitleFontSize);
          doc.setFont("helvetica", "bold");
          doc.text("Budget Analysis", margin, yPos);
          yPos += 10;

          // Draw table header
          doc.setFontSize(normalFontSize);
          doc.setFillColor(240, 240, 240);
          doc.rect(margin, yPos - 6, 170, 8, "F");
          doc.setFont("helvetica", "bold");
          doc.text("Category", margin + 5, yPos);
          doc.text("Budget", margin + 70, yPos);
          doc.text("Spent", margin + 110, yPos);
          doc.text("% Used", margin + 150, yPos);
          yPos += 8;

          // Draw table rows
          doc
            .setFont(
              "helvetica",
              "normal",
            )(report.data.budgets || [])
            .forEach((budget, index) => {
              if (index % 2 === 0) {
                doc.setFillColor(248, 248, 248);
                doc.rect(margin, yPos - 6, 170, 8, "F");
              }

              doc.text(budget.category, margin + 5, yPos);
              doc.text(
                budget.budget_amount.toLocaleString(),
                margin + 70,
                yPos,
              );
              doc.text(
                budget.spent_amount.toLocaleString(),
                margin + 110,
                yPos,
              );
              doc.text(
                `${budget.percentage_used.toFixed(1)}%`,
                margin + 150,
                yPos,
              );
              yPos += 8;

              if (yPos > 270) {
                doc.addPage();
                yPos = margin;
              }
            });
          break;

        case "cash_flow":
          // Add summary
          yPos += 5;
          doc.setFontSize(subtitleFontSize);
          doc.setFont("helvetica", "bold");
          doc.text("Cash Flow Summary", margin, yPos);
          yPos += 10;

          doc.setFontSize(normalFontSize);
          doc.text(
            `Total Income: ${report.data.total_income?.toLocaleString() || 0}`,
            margin,
            yPos,
          );
          yPos += 8;
          doc.text(
            `Total Expenses: ${report.data.total_expense?.toLocaleString() || 0}`,
            margin,
            yPos,
          );
          yPos += 8;
          doc.text(
            `Net Cash Flow: ${report.data.net_flow?.toLocaleString() || 0}`,
            margin,
            yPos,
          );
          yPos += 15;

          // Add daily flow table
          doc.setFontSize(normalFontSize);
          doc.setFont("helvetica", "bold");
          doc.text("Daily Cash Flow", margin, yPos);
          yPos += 8;

          // Draw table header
          doc.setFillColor(240, 240, 240);
          doc.rect(margin, yPos - 6, 170, 8, "F");
          doc.setFont("helvetica", "bold");
          doc.text("Date", margin + 5, yPos);
          doc.text("Income", margin + 60, yPos);
          doc.text("Expense", margin + 100, yPos);
          doc.text("Net Flow", margin + 140, yPos);
          yPos += 8;

          doc.setFont("helvetica", "normal");
          Object.entries(report.data.daily_flow || {})
            .sort((a, b) => new Date(a[0]) - new Date(b[0]))
            .forEach(([date, flow], index) => {
              if (index % 2 === 0) {
                doc.setFillColor(248, 248, 248);
                doc.rect(margin, yPos - 6, 170, 8, "F");
              }

              doc.text(format(new Date(date), "MMM d, yyyy"), margin + 5, yPos);
              doc.text(flow.income.toLocaleString(), margin + 60, yPos);
              doc.text(flow.expense.toLocaleString(), margin + 100, yPos);
              doc.text(flow.net.toLocaleString(), margin + 140, yPos);
              yPos += 8;

              if (yPos > 270) {
                doc.addPage();
                yPos = margin;
              }
            });

          // Draw total row
          doc.setFillColor(230, 230, 230);
          doc.rect(margin, yPos - 6, 170, 8, "F");
          doc.setFont("helvetica", "bold");
          doc.text("TOTAL", margin + 5, yPos);
          doc.text(
            report.data.total_income?.toLocaleString() || "0",
            margin + 60,
            yPos,
          );
          doc.text(
            report.data.total_expense?.toLocaleString() || "0",
            margin + 100,
            yPos,
          );
          doc.text(
            report.data.net_flow?.toLocaleString() || "0",
            margin + 140,
            yPos,
          );
          break;

        default:
          doc.setFontSize(subtitleFontSize);
          doc.text("Report type not supported for PDF export", margin, yPos);
      }

      // Save the PDF
      doc.save(
        `${report.title.replace(/\s+/g, "_")}_${format(new Date(), "yyyy-MM-dd")}.pdf`,
      );

      toast.success("Report exported as PDF successfully");
    } catch (error) {
      console.error("Error exporting report as PDF:", error);
      toast.error("Failed to export report as PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const renderReportContent = (report) => {
    if (!report || !report.data) return null;

    switch (report.type) {
      case "expense_summary":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Expense Summary</h3>
                <p className="text-sm text-muted-foreground">
                  {format(
                    new Date(report.data.date_range.start),
                    "MMM d, yyyy",
                  )}{" "}
                  -{" "}
                  {format(new Date(report.data.date_range.end), "MMM d, yyyy")}
                </p>
              </div>
              <div className="text-2xl font-bold">
                Total: {report.data.total_expenses?.toLocaleString() || 0}
              </div>
            </div>

            <div className="h-[300px]">
              {report.data.chart_data?.length > 0 ? (
                <FinancialChart data={report.data.chart_data} type="expense" />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">
                    No expense data available
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Category Breakdown</h4>
              <div className="space-y-2">
                {Object.entries(report.data.category_breakdown || {}).map(
                  ([category, amount]) => (
                    <div key={category} className="flex justify-between">
                      <span>{category}</span>
                      <span className="font-medium">
                        {amount.toLocaleString()}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        );

      case "income_summary":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Income Summary</h3>
                <p className="text-sm text-muted-foreground">
                  {format(
                    new Date(report.data.date_range.start),
                    "MMM d, yyyy",
                  )}{" "}
                  -{" "}
                  {format(new Date(report.data.date_range.end), "MMM d, yyyy")}
                </p>
              </div>
              <div className="text-2xl font-bold text-green-600">
                Total: {report.data.total_income?.toLocaleString() || 0}
              </div>
            </div>

            <div className="h-[300px]">
              {report.data.chart_data?.length > 0 ? (
                <FinancialChart data={report.data.chart_data} type="income" />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">
                    No income data available
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Category Breakdown</h4>
              <div className="space-y-2">
                {Object.entries(report.data.category_breakdown || {}).map(
                  ([category, amount]) => (
                    <div key={category} className="flex justify-between">
                      <span>{category}</span>
                      <span className="font-medium">
                        {amount.toLocaleString()}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        );

      case "budget_analysis":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Budget Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  {format(
                    new Date(report.data.date_range.start),
                    "MMM d, yyyy",
                  )}{" "}
                  -{" "}
                  {format(new Date(report.data.date_range.end), "MMM d, yyyy")}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {report.data.budgets?.length > 0 ? (
                report.data.budgets.map((budget, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        {budget.category}
                      </CardTitle>
                      <CardDescription>
                        {budget.period} budget •{" "}
                        {format(new Date(budget.start_date), "MMM d, yyyy")}
                        {budget.end_date &&
                          ` - ${format(new Date(budget.end_date), "MMM d, yyyy")}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="flex justify-between mb-2">
                        <span>
                          Budget: {budget.budget_amount.toLocaleString()}
                        </span>
                        <span>
                          Spent: {budget.spent_amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                        <div
                          className={`h-2.5 rounded-full ${
                            budget.percentage_used > 100
                              ? "bg-red-500"
                              : budget.percentage_used > 80
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                          style={{
                            width: `${Math.min(budget.percentage_used, 100)}%`,
                          }}
                        ></div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {budget.percentage_used.toFixed(1)}% used
                        {budget.percentage_used > 100 &&
                          ` (${(budget.percentage_used - 100).toFixed(1)}% over budget)`}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No budget data available
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case "cash_flow":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Cash Flow Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  {format(
                    new Date(report.data.date_range.start),
                    "MMM d, yyyy",
                  )}{" "}
                  -{" "}
                  {format(new Date(report.data.date_range.end), "MMM d, yyyy")}
                </p>
              </div>
              <div
                className={`text-2xl font-bold ${report.data.net_flow >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                Net Flow: {report.data.net_flow?.toLocaleString() || 0}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Total Income</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {report.data.total_income?.toLocaleString() || 0}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Total Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {report.data.total_expense?.toLocaleString() || 0}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Daily Cash Flow</h4>
              <div className="space-y-2">
                {Object.entries(report.data.daily_flow || {})
                  .sort((a, b) => new Date(b[0]) - new Date(a[0]))
                  .map(([date, flow]) => (
                    <div key={date} className="flex justify-between">
                      <span>{format(new Date(date), "MMM d, yyyy")}</span>
                      <div>
                        <span className="text-green-600 mr-4">
                          +{flow.income.toLocaleString()}
                        </span>
                        <span className="text-red-600 mr-4">
                          -{flow.expense.toLocaleString()}
                        </span>
                        <span
                          className={
                            flow.net >= 0
                              ? "text-green-600 font-medium"
                              : "text-red-600 font-medium"
                          }
                        >
                          {flow.net.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Report type not supported</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Reports & Analytics
          </h2>
          <p className="text-muted-foreground">
            Generate and view detailed financial reports
          </p>
        </div>
        <Button onClick={() => setIsCreateReportOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Generate Report
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-[400px] col-span-2" />
          <Skeleton className="h-[400px]" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            {selectedReport ? (
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>{selectedReport.title}</CardTitle>
                    <CardDescription>
                      Generated on{" "}
                      {format(
                        new Date(selectedReport.created_at),
                        "MMM d, yyyy",
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isExporting}
                        >
                          {isExporting ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4 mr-1" />
                          )}{" "}
                          Export
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleExportReportJSON(selectedReport)}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Export as JSON
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleExportReportCSV(selectedReport)}
                        >
                          <FileSpreadsheet className="h-4 w-4 mr-2" />
                          Export as CSV
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleExportReportPDF(selectedReport)}
                        >
                          <FilePdf className="h-4 w-4 mr-2" />
                          Export as PDF
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteReport(selectedReport.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>{renderReportContent(selectedReport)}</CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No Report Selected
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Select a report from the list or generate a new one
                  </p>
                  <Button onClick={() => setIsCreateReportOpen(true)}>
                    Generate New Report
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Your Reports</CardTitle>
              </CardHeader>
              <CardContent>
                {reports.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      No reports generated yet
                    </p>
                    <Button onClick={() => setIsCreateReportOpen(true)}>
                      Generate Your First Report
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {reports.map((report) => (
                      <div
                        key={report.id}
                        className={`p-3 rounded-md cursor-pointer flex justify-between items-center ${
                          selectedReport?.id === report.id
                            ? "bg-muted"
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() => setSelectedReport(report)}
                      >
                        <div>
                          <div className="font-medium">{report.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(report.created_at), "MMM d, yyyy")}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {report.type === "expense_summary" && (
                            <PieChart className="h-4 w-4 text-muted-foreground" />
                          )}
                          {report.type === "income_summary" && (
                            <PieChart className="h-4 w-4 text-muted-foreground" />
                          )}
                          {report.type === "budget_analysis" && (
                            <BarChart className="h-4 w-4 text-muted-foreground" />
                          )}
                          {report.type === "cash_flow" && (
                            <BarChart className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Create Report Dialog */}
      <Dialog open={isCreateReportOpen} onOpenChange={setIsCreateReportOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate New Report</DialogTitle>
            <DialogDescription>
              Create a custom financial report
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Report Title</Label>
              <Input
                id="title"
                value={reportParameters.title}
                onChange={(e) =>
                  setReportParameters({
                    ...reportParameters,
                    title: e.target.value,
                  })
                }
                placeholder="Monthly Expense Summary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Report Type</Label>
              <Select
                value={reportParameters.type}
                onValueChange={(value) =>
                  setReportParameters({ ...reportParameters, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense_summary">
                    Expense Summary
                  </SelectItem>
                  <SelectItem value="income_summary">Income Summary</SelectItem>
                  <SelectItem value="budget_analysis">
                    Budget Analysis
                  </SelectItem>
                  <SelectItem value="cash_flow">Cash Flow</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="wallet_id">Wallet (Optional)</Label>
              <Select
                value={reportParameters.wallet_id}
                onValueChange={(value) =>
                  setReportParameters({ ...reportParameters, wallet_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Wallets" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Wallets</SelectItem>
                  {wallets?.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.id.toString()}>
                      {wallet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category_id">Category (Optional)</Label>
              <Select
                value={reportParameters.category_id}
                onValueChange={(value) =>
                  setReportParameters({
                    ...reportParameters,
                    category_id: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {reportParameters.start_date ? (
                        format(reportParameters.start_date, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={reportParameters.start_date}
                      onSelect={(date) =>
                        setReportParameters({
                          ...reportParameters,
                          start_date: date,
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {reportParameters.end_date ? (
                        format(reportParameters.end_date, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={reportParameters.end_date}
                      onSelect={(date) =>
                        setReportParameters({
                          ...reportParameters,
                          end_date: date,
                        })
                      }
                      initialFocus
                      disabled={(date) => date < reportParameters.start_date}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateReportOpen(false)}
                disabled={isGenerating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleGenerateReport}
                disabled={isGenerating || !reportParameters.title}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Report"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
