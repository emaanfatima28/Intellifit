import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[#2563eb] text-white hover:bg-[#1e293b]",
        secondary: "border-transparent bg-[#f59e42] text-[#1e293b] hover:bg-[#2563eb] hover:text-white",
        destructive: "border-transparent bg-[#ef4444] text-white hover:bg-[#b91c1c]",
        outline: "border-[#2563eb] text-[#2563eb] bg-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

