import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  change: string
  positive: boolean
  description: string
}

export function StatCard({ title, value, change, positive, description }: StatCardProps) {
  return (
    <Card className="enhanced-card glass-card hover-lift">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground/80">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-bold gradient-text">{value}</div>
          {change && (
            <div 
              className={`flex items-center text-xs font-medium rounded-full px-2 py-1 ${
                positive 
                  ? "bg-success/10 text-success" 
                  : "bg-error/10 text-error"
              }`}
            >
              {positive ? (
                <ArrowUpRight className="h-3 w-3 mr-0.5" />
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-0.5" />
              )}
              {change}
            </div>
          )}
        </div>
        <CardDescription className="mt-2 text-xs text-foreground/60">{description}</CardDescription>
        <div className="mt-4 h-2 w-full rounded-full bg-muted/30 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${Math.floor(Math.random() * 40) + 60}%`,
              background: "linear-gradient(135deg, rgb(var(--primary)), rgb(var(--secondary)))",
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}

