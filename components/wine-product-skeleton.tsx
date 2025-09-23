import { Card, CardContent } from "@/components/ui/card"

export function WineProductSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Image skeleton */}
          <div className="aspect-[3/4] bg-muted rounded-lg animate-pulse" />

          {/* Title skeleton */}
          <div className="space-y-2">
            <div className="h-5 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
          </div>

          {/* Rating skeleton */}
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-4 h-4 bg-muted rounded animate-pulse" />
            ))}
          </div>

          {/* Price skeleton */}
          <div className="h-6 bg-muted rounded w-20 animate-pulse" />

          {/* Controls skeleton */}
          <div className="flex items-center justify-between pt-2">
            <div className="h-8 w-24 bg-muted rounded animate-pulse" />
            <div className="h-8 w-8 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
