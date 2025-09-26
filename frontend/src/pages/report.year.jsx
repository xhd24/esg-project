// src/pages/report.year.jsx
import { useParams, Navigate } from "react-router-dom";
import ESG_Report_2025 from "./ESG_Report_2025.jsx";
import ESG_Report_2024 from "./ESG_Report_2024.jsx";
import ESG_Report_2023 from "./ESG_Report_2023.jsx";

const map = {
  "2025": ESG_Report_2025,
  "2024": ESG_Report_2024,
  "2023": ESG_Report_2023,
};

export default function ReportYear() {
  const { year } = useParams();
  const Comp = map[year];
  if (!Comp) return <Navigate to="/report" replace />;
  return <Comp />;
}
