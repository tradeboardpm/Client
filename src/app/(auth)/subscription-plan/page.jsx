import { ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  "Dashboard",
  "My Journal",
  "Tarde Logs",
  "Auto Import Logs",
  "Performance Analytics",
  "Accountability Partner",
]

const plans = [
  {
    name: "7-day trial plan",
    price: "Free",
    period: "",
    buttonText: "Get Started Now",
    buttonVariant: "outline" ,
  },
  {
    name: "6 month plan",
    price: "₹ 199",
    period: "per month",
    buttonText: "Get Started Now",
    buttonVariant: "outline" ,
  },
  {
    name: "12 month plan",
    price: "₹ 149",
    period: "per month",
    buttonText: "Get Started Now",
    buttonVariant: "default" ,
    highlight: true,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <Button variant="outline" className="mb-8 rounded-full size-12 p-0">
          <ArrowLeft className=" h-6 w-6" />
        </Button>
        <h1 className="mb-2 text-center text-xl">Simple Pricing, Great Value</h1>
        <p className="mb-14 text-center text-2xl font-extrabold">
          Every plan offers complete features access
        </p>
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <Card
              key={plan.name}
              className={`relative overflow-hidden ${plan.highlight ? "border-purple-400 shadow-lg" : ""}`}
            >
              {plan.highlight && (
                <div className="absolute right-0 top-0 bg-green-400 px-3 py-1 text-sm font-semibold text-white">
                  SAVE UP TO 30%
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6 text-3xl font-bold">
                  {plan.price}
                  <span className="text-base font-normal text-gray-600">{plan.period}</span>
                </div>
                <ul className="space-y-2">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="mr-2 h-5 w-5 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={plan.buttonVariant}>
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}