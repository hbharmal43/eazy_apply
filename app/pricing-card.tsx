import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface PricingCardProps {
  title: string
  price: string
  description: string
  features: string[]
  buttonText: string
  buttonVariant: "default" | "outline"
  popular?: boolean
  onClick?: () => void
  selected?: boolean
}

export function PricingCard({
  title,
  price,
  description,
  features,
  buttonText,
  buttonVariant,
  popular = false,
  onClick,
  selected = false,
}: PricingCardProps) {
  return (
    <Card
      className={`flex flex-col transition-all ${
        popular ? "border-primary shadow-lg scale-105 relative z-10" : "hover:shadow-md hover:-translate-y-1"
      } ${selected ? "ring-2 ring-primary" : ""}`}
      onClick={onClick}
    >
      {popular && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center">
          <div className="bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">Most Popular</div>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">{price}</span>
          {price !== "Custom" && <span className="text-sm text-muted-foreground">/month</span>}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
              <span className="text-sm text-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          variant={buttonVariant}
          className={`w-full ${
            buttonVariant === "default"
              ? "bg-primary hover:bg-primary/90 text-white"
              : "border-primary text-primary hover:bg-primary/10"
          }`}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}

