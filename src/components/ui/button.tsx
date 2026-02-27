import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 min-h-[44px] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90 active:bg-primary-600 active:shadow-inner",
        primary:
          "bg-primary-400 text-brown-700 shadow hover:bg-primary-500 focus-visible:ring-primary-400 active:bg-primary-600 active:shadow-inner",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:bg-destructive/80",
        danger:
          "bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800",
        success:
          "bg-green-600 text-white shadow-sm hover:bg-green-700 active:bg-green-800",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground active:bg-brown-50 active:border-brown-400",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 active:bg-secondary/70",
        ghost: "hover:bg-accent hover:text-accent-foreground active:bg-brown-100",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-7 min-h-[28px] px-2 text-xs",
        sm: "h-9 min-h-[36px] rounded-md px-3 text-xs",
        default: "h-10 min-h-[44px] px-4 py-2 text-sm",
        base: "h-10 min-h-[44px] px-4 text-sm",
        lg: "h-12 min-h-[48px] rounded-md px-8 text-base",
        xl: "h-14 min-h-[56px] px-10 text-lg",
        icon: "h-10 w-10 min-h-[44px]",
      },
      width: {
        auto: "w-auto",
        full: "w-full",
        fullMobile: "w-full lg:w-auto", // Mobile-first: full width on mobile, auto on desktop
      },
      loading: {
        true: "opacity-75 cursor-wait pointer-events-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      width: "fullMobile", // Default: full width on mobile
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, width, loading, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, width, loading, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && <Loader2 className="animate-spin" />}
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
