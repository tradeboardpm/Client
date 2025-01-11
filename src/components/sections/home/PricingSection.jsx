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
      "Weekly/Monthly Analysis",
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
      "Weekly/Monthly Analysis",
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
      "Weekly/Monthly Analysis",
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl text-center mb-4">
          Simple Pricing, Great Value
        </h2>
        <p className="text-4xl font-semibold text-center mb-14">
          Every Plan Offers Complete{" "}
          <span className="text-foreground">Features Access</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-8 lg:gap-14 justify-items-center">
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
              <Card
                className={`${
                  plan.highlight ? "border-primary" : ""
                } bg-background text-foreground w-full sm:w-[16rem] lg:w-[20rem] rounded-3xl p-4 border-2 shadow-lg`}
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
                        <Check className="mr-2 h-4 w-4 text-[#0ED991]" />
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
