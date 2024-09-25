import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"


export default function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
      <Card className=" rounded-xl border-slate-300 bg-slate-200/50">
        <CardHeader>
          <div className="mb-4 mx-auto">{icon}</div>
          <CardTitle className="text-center">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-center">{description}</CardDescription>
        </CardContent>
      </Card>
    )
  }