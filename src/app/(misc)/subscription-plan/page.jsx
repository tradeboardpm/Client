"use client";

import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Image from "next/image";

const pricingPlans = [
  {
    name: "7-day trial plan",
    price: "Free",
    period: "",
    features: [
      "Dashboard",
      "My Journal",
      "Trade Logs",
      "Auto Import Logs",
      "Performance Analytics",
      "Accountability Partner",
    ],
    buttonText: "Get Started Now",
    buttonVariant: "",
  },
  {
    name: "6 month plan",
    price: "₹ 199",
    period: "per month",
    features: [
      "Dashboard",
      "My Journal",
      "Trade Logs",
      "Auto Import Logs",
      "Performance Analytics",
      "Accountability Partner",
    ],
    buttonText: "Get Started Now",
    buttonVariant: "",
  },
  {
    name: "12 month plan",
    price: "₹ 149",
    period: "per month",
    features: [
      "Dashboard",
      "My Journal",
      "Trade Logs",
      "Auto Import Logs",
      "Performance Analytics",
      "Accountability Partner",
    ],
    buttonText: "Get Started Now",
    buttonVariant: "default",
    highlight: true,
    discount: true,
  },
];

export default function PricingPage() {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push("/dashboard");
  };




  return (
    <div className="flex items-center justify-center h-screen">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center relative">
        <Button
          variant="outline"
          className=" rounded-ful border-black rounded-full size-10 p-0 bg-background text-foreground absolute top-0 left-40"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <h2 className="text-[1.65rem] text-center mb-4">
          Simple Pricing, Great Value
        </h2>
        <p className="text-3xl font-semibold text-center mb-14">
          Every plan offers complete{" "}
          <span className="text-foreground">features access</span>
        </p>

        <div className="flex flex-col md:flex-row gap-10 justify-center items-center container lg:px-48 relative">
          {pricingPlans.map((plan, index) => (
            <div key={index} className="relative">
              {plan.discount && (
                <div className="absolute -top-12 -right-1 flex items-center">
                  <Image
                    src="/images/arrow_black.svg"
                    alt="Discount"
                    width={80}
                    height={80}
                    className="mr- "
                  />
                  <span className="text-[0.75rem] mb-4 mr-4 font-medium text-green-400 ">
                    SAVE UP TO 30%
                  </span>
                </div>
              )}
              <Card
                className={`${
                  plan.highlight ? "border-primary" : ""
                } bg-card text-foreground w-[20rem] rounded-3xl p-2 ${
                  plan.discount
                    ? "border-2 shadow-[0_8px_24px_rgba(119,_50,_187,_0.18)]"
                    : "shadow-[0_8px_24px_rgba(0,_0,_0,_0.08)]"
                }`}
              >
                <CardHeader>
                  <CardTitle className="text-xl mb-2 font-medium">
                    {plan.name}
                  </CardTitle>
                  <div className="text-2xl font-semibold">
                    {plan.price}
                    {plan.period && (
                      <span className="text-sm font-normal">
                        /{plan.period}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="mr-2 h-3 w-3 outline-double outline-[#0ED991] text-background rounded bg-[#0ED991]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full h-10"
                    variant={plan.buttonVariant}
                    onClick={handleButtonClick}
                  >
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
