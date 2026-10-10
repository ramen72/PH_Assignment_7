
import { Badge } from "@/components/ui/badge";
import { PaymentStatus } from "@/types";
import {
  CheckCircle2,
  Clock3,
  XCircle,
  Ban,
  RotateCcw,
} from "lucide-react";


const statusConfig = {
  PAID: {
    label: "Paid",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
  },
  PENDING: {
    label: "Pending",
    className:
      "border-amber-200 bg-amber-50 text-amber-700",
    icon: Clock3,
  },
  FAILED: {
    label: "Failed",
    className: "border-red-200 bg-red-50 text-red-700",
    icon: XCircle,
  },
  CANCELLED: {
    label: "Cancelled",
    className: "border-slate-200 bg-slate-100 text-slate-700",
    icon: Ban,
  },
  REFUNDED: {
    label: "Refunded",
    className: "border-violet-200 bg-violet-50 text-violet-700",
    icon: RotateCcw,
  },
} as const;

export function PaymentStatusBadge({
  status,
}: {
  status: PaymentStatus | string;
}) {
  const config =
    statusConfig[status as keyof typeof statusConfig] ??
    statusConfig.PENDING;

  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`gap-1.5 rounded-full px-2.5 py-1 font-medium ${config.className}`}
    >
      <Icon className="size-3.5" />
      {config.label}
    </Badge>
  );
}
