import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  leftSlot?: React.ReactNode
  rightSlot?: React.ReactNode
  breadcrumbs?: {
    title: string
    href?: string
  }[]
  description?: string
}

export function Header({
  className,
  leftSlot,
  rightSlot,
  breadcrumbs,
  description,
  ...props
}: HeaderProps) {
  return (
    <div
      className={cn(
        "sticky top-0 z-10 flex h-14 shrink-0 items-center gap-4 border-b bg-background px-4 md:px-6",
        className
      )}
      {...props}
    >
      {leftSlot}
      <div className="flex min-w-0 flex-1 items-start gap-1.5">
        <div className="flex min-w-0 flex-col justify-center">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs?.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1
                return (
                  <React.Fragment key={index}>
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>{item.title}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={item.href}>
                          {item.title}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </React.Fragment>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
          {description && (
            <p className="hidden truncate text-xs text-muted-foreground md:block">
              {description}
            </p>
          )}
        </div>
      </div>
      {rightSlot}
    </div>
  )
}
