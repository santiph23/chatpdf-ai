
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { cn, formatBytes } from "@/lib/utils"
import { ArrowRight, MessageSquare } from "lucide-react"
import Link from "next/link"

export type File = {
  id: string
  name: string
  type: string
  size: number
  status: string
}

export const columns: ColumnDef<File>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => {
      const size = row.original.size

      return (
        <div>
          {
            formatBytes(size)
          }
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status

      let color: string;
      switch (status) {
        case "SUCCESS":
          color = "bg-purple-600";
          break;
        case "PROCESSING":
          color = "bg-gray-600";
          break;
        case "FAILED":
          color = "bg-red-600";
          break;
        case "PENDING":
          color = "bg-yellow-500";
          break;
        default:
          color = "bg-gray-600";
      }

      return (
        <div className={cn(color, "py-1 px-2 max-w-min rounded-md text-xs")}>
          {
            status
          }
        </div>
      )
    },
  },
  {
    id: "chat",
    header: "",
    cell: ({ row }) => {
      const id = row.original.id

      return (
        <Link
          href={`/dashboard/${id}`}
        >
          <ArrowRight />
        </Link>
      )
    },
  },
]
