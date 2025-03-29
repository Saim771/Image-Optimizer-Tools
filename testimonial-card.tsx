import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

interface TestimonialCardProps {
  name: string
  role: string
  image: string
  content: string
}

export default function TestimonialCard({ name, role, image, content }: TestimonialCardProps) {
  return (
    <Card className="bg-card p-6 rounded-xl border border-border/50 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-12 w-12 rounded-full bg-primary/20 overflow-hidden">
          <img src={image || "/placeholder.svg"} alt={`${name} avatar`} className="h-full w-full object-cover" />
        </div>
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
      <div className="flex mb-3">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        ))}
      </div>
      <p className="text-muted-foreground">"{content}"</p>
    </Card>
  )
}

