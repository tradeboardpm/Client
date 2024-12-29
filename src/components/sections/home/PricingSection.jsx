import { Check } from "lucide-react";

const { Button } = require("@/components/ui/button");
const { Card, CardHeader, CardTitle, CardContent, CardFooter } = require("@/components/ui/card");
const { default: Image } = require("next/image");

// components/sections/PricingSection.jsx
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
    buttonVariant: "outline",
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
    buttonVariant: "outline",
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
    discount: true, // New property to indicate discount
  },
];

const PricingSection = () => {
  return (
    <section
      className="py-20 primary_gradient scroll-mt-20 text-background"
      id="pricing"
    >
      <div className="container mx-auto px-">
        <h2 className="text-2xl text-center mb-4">
          Simple Pricing, Great Value
        </h2>
        <p className="text-4xl font-semibold  text-center mb-14">
          Every Plan Offers Complete{" "}
          <span className="text-foreground">Features Access</span>
        </p>
        <div className="flex gap-14 justify-center items-center container lg:px-48 relative">
          {pricingPlans.map((plan, index) => (
            <div key={index} className="relative">
              {plan.discount && (
                <div className="absolute -top-8 -right-10 flex items-center">
                  <Image
                    src="/images/arrow.svg"
                    alt="Discount"
                    width={50}
                    height={50}
                    className="mr-2"
                  />
                  <span className="text-base font-bold text-green-400">
                    SAVE UP TO 30%
                  </span>
                </div>
              )}
              {plan.discount ? (
                <Card
                  className={`${
                    plan.highlight ? "border-primary" : ""
                  } bg-background text-foreground w-[20rem] rounded-3xl p-2 border-2 shadow-[0_20px_50px_rgba(255,_255,_255,_0.5)]`}
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
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <Check className="mr-2 h-3 w-3 outline-double outline-[#0ED991] text-background rounded  bg-[#0ED991]" />
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
              ) : (
                <Card
                  className={`${
                    plan.highlight ? "border-primary" : ""
                  } bg-background text-foreground w-[20rem] rounded-3xl p-2`}
                >
                  <CardHeader>
                    <CardTitle className="text-xl mb-2  font-medium">
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
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <Check className="mr-2 h-3 w-3 outline-double outline-[#0ED991] text-background rounded  bg-[#0ED991]" />
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
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection
