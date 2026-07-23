import { Badge } from "@/components/ui/badge";

const styles = {
  open: "bg-amber-100 text-amber-800 border-amber-200",
  in_progress: "bg-blue-100 text-blue-800 border-blue-200",
  resolved: "bg-green-100 text-green-800 border-green-200",
};

const labels = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
};

const StatusBadge = ({ status }) => (
  <Badge variant="outline" className={styles[status] || ""}>
    {labels[status] || status}
  </Badge>
);

export default StatusBadge;
