import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import {
  Pill,
  Search,
  Filter,
  ShieldAlert,
  ArrowRight,
  Plus,
} from "lucide-react";
import { DoctorMedicinesView } from "./DoctorMedicinesView";

export const dynamic = "force-dynamic";

export default async function DoctorMedicinesDirectoryPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const medicines = await prisma.medicine.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      patient: {
        include: { user: true },
      },
    },
  });

  return <DoctorMedicinesView medicines={medicines} />;
}
