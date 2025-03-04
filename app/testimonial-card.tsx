import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface TestimonialCardProps {
  quote: string
  name: string
  role: string
  university: string
  imageSrc: string
}

export function TestimonialCard({ quote, name, role, university, imageSrc }: TestimonialCardProps) {
  return (
    <Card className="transition-all hover:shadow-lg hover:-translate-y-1 border-none bg-white shadow overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          <div className="mb-4">
            <svg
              width="45"
              height="36"
              className="text-primary/20"
              viewBox="0 0 45 36"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M13.5 18H9C9 12.4772 13.4772 8 19 8V12C15.6863 12 13 14.6863 13 18V18.75C13 19.9926 14.0074 21 15.25 21H18.25C19.4926 21 20.5 19.9926 20.5 18.75V15.75C20.5 14.5074 19.4926 13.5 18.25 13.5H15.25C14.0074 13.5 13 14.5074 13 15.75V18Z" />
              <path d="M34.5 18H30C30 12.4772 34.4772 8 40 8V12C36.6863 12 34 14.6863 34 18V18.75C34 19.9926 35.0074 21 36.25 21H39.25C40.4926 21 41.5 19.9926 41.5 18.75V15.75C41.5 14.5074 40.4926 13.5 39.25 13.5H36.25C35.0074 13.5 34 14.5074 34 15.75V18Z" />
            </svg>
          </div>
          <p className="text-gray-600 flex-1 mb-6">{quote}</p>
          <div className="flex items-center mt-auto">
            <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
              <Image src={imageSrc || "/placeholder.svg"} alt={name} fill className="object-cover" />
            </div>
            <div>
              <h4 className="font-semibold text-primary">{name}</h4>
              <p className="text-sm text-gray-500">{role}</p>
              <p className="text-xs text-gray-400">{university}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

