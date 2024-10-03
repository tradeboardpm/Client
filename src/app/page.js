"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check, Instagram, Twitter, Facebook, Phone, Mail } from "lucide-react";

const navItems = [
  { name: "Home", href: "#" },
  { name: "Pricing", href: "#" },
  { name: "Tutorials", href: "#" },
  { name: "Blog", href: "#" },
  { name: "FAQs", href: "#" },
  { name: "Why Tradeboard", href: "#" },
];

const whyTradeboardItems = [
  {
    title: "Encourages Discipline in Trading",
    description:
      "Trading respects disciplined ones. TradeBoard provides tools to achieve it.",
  },
  {
    title: "Build Strong Trading Psychology",
    description:
      "When you start journaling daily, note down your mistakes and lessons from your trading rules, you end up building strong trading psychology.",
  },
  {
    title: "Performance Visualizations",
    description:
      "Once you end your trading day, you need a board which highlights your performance visually to keep you in the right direction.",
  },
  {
    title: "Promotes Being Accountable",
    description:
      "Even if trading journey and it's outcome is personal, it always helps to have someone, friend or family who watches over your journey.",
  },
  {
    title: "In this together",
    description:
      "We are in this together. We have built it with sole purpose of supporting each and every trader in their journey.",
  },
  {
    title: "For Your Success",
    description:
      "Our mission is to upgrade your trading game with our platform. Come, join the tribe!",
  },
];

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
  },
];

const faqs = [
  {
    question: "What is the Tradeboard platform?",
    answer:
      "In a world full of different technical indicators, trading courses and technical analysis tools, the Tradeboard is your one friendly platform where you can journal your thoughts and your trading patterns. Based on your trading pattern, we tell you what worked and what went against you. Using this information, you can build a strong trading psychology and focus on rules working for you.",
  },
  {
    question:
      "Do I need to add actual capital to add trades in the Tradeboard?",
    answer:
      "No, you don't need to add actual capital. Tradeboard is a journaling and analysis tool, not a trading platform.",
  },
  {
    question: "Is the Accountability Partner feature optional?",
    answer:
      "Yes, the Accountability Partner feature is optional. You can choose to use it or not based on your preferences.",
  },
  {
    question: "Will I get any rewards for journaling points and levels?",
    answer:
      "We have a gamification system that rewards consistent journaling with points and levels. These can unlock certain features or badges within the platform.",
  },
  {
    question: "I want to promote Tradeboard, how can I get benefitted?",
    answer:
      "We have an affiliate program for those interested in promoting Tradeboard. Please contact our support team for more information on how to participate and benefit from it.",
  },
];

const AnimatedSection = ({ children }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (inView && !hasAnimated) {
      controls.start("visible");
      setHasAnimated(true);
    }
  }, [controls, inView, hasAnimated]);

  return (
    <motion.section
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 },
      }}
      transition={{
        type: "spring",
        damping: 30,
        stiffness: 100,
        duration: 0.5,
      }}
    >
      {children}
    </motion.section>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <nav className=" flex items-center justify-between p-4 bg-primary text-background">
        <div className="flex items-center space-x-2">
          <Image
            src="/placeholder.svg"
            alt="Tradeboard.in Logo"
            width={40}
            height={40}
          />
          <span className="text-xl font-bold">Tradeboard.in</span>
        </div>
        <div className="hidden md:flex space-x-4 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost">Login</Button>
          <Button className="bg-background hover:bg-secondary">Sign up</Button>
        </div>
      </nav>

      <main>
          <section className="bg-primary text-background pt-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Trade Better With Discipline
              </h1>
              <p className="text-md md:text-lg mb-8 max-w-3xl mx-auto">
                We offer traders the tools to analyse their daily trading
                patterns and learn from it to establish themselves as successful
                traders.
              </p>
              <div className="bg-gradient-to-b from-primary from-50% to-background to-50% p-4">
                <div className="relative w-full max-w-4xl mx-auto aspect-video">
                  <img
                    src="/images/Dashboard.png"
                    alt="Tradeboard Dashboard"
                    layout="fill"
                    objectFit="contain"
                    className="shadow-xl rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </section>

        <AnimatedSection>
          <section className="py-8 md:py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8">
                Manage Your{" "}
                <span className="text-primary">Trading Psychology</span>
              </h2>
              <div className="flex flex-col gap-8 lg:px-24">
                <div className="flex flex-col lg:flex-row-reverse items-center gap-6 justify-between">
                  <div className="flex flex-col gap-4 w-full lg:w-1/2">
                    <Card className="p-4">
                      <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">
                        Journal
                      </h3>
                      <p className="text-sm md:text-base mb-2 md:mb-4">
                        Journal allows you to add different aspects of your
                        thought process during trading.
                      </p>
                    </Card>
                    <Card className="p-4">
                      <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">
                        Rules
                      </h3>
                      <p className="text-sm md:text-base mb-2 md:mb-4">
                        Rules keep you disciplined. Checkmark the followed rules
                        and keep the unfollowed ones unchecked.
                      </p>
                    </Card>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary w-fit ">
                    <img
                      src="/images/Dashboard.png"
                      alt="Journal and Rules Interface"
                      layout="responsive"
                      className="rounded-lg shadow-md max-w-md"
                    />
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row items-center gap-6 justify-between">
                  <Card className="p-4 w-full lg:w-1/2">
                    <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">
                      Trade Log
                    </h3>
                    <p className="text-sm md:text-base mb-2 md:mb-4">
                      Automatically add the trades log using tradebook provided
                      by your broker or create manual trades entries. We analyse
                      this data to provide you best trading performance
                      analytics.
                    </p>
                  </Card>
                  <div className="p-4 rounded-xl bg-secondary w-fit ">
                    <img
                      src="/images/Dashboard.png"
                      alt="Trade Log Interface"
                      layout="responsive"
                      className="rounded-lg shadow-md max-w-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="py-8 md:py-16 bg-muted">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8">
                Analyse Your{" "}
                <span className="text-primary">Trading Discipline</span>
              </h2>
              <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:px-24">
                <div className="w-fit p-4 rounded-xl bg-secondary">
                  <img
                    src="/images/Dashboard.png"
                    alt="Trading Analysis Dashboard"
                    layout="responsive"
                    className="rounded-lg shadow-md max-w-md"
                  />
                </div>
                <div className="w-full lg:w-1/3 space-y-6">
                  <Card className="p-4">
                    <h3 className="text-lg md:text-xl font-semibold mb-2">
                      Tradeboard Intelligence
                    </h3>
                    <p className="text-sm md:text-base">
                      For each trading outcome, get the analysis of your trading
                      pattern for specific period.
                    </p>
                  </Card>
                  <Card className="p-4">
                    <h3 className="text-lg md:text-xl font-semibold mb-2">
                      Journal Analysis
                    </h3>
                    <p className="text-sm md:text-base">
                      Filter out your daily logged journals based on various
                      performance parameters. Focus on what is working for you.
                    </p>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="py-8 md:py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8">
                Be Accountable For Your{" "}
                <span className="text-primary">Trading Journey</span>
              </h2>
              <div className="flex flex-col gap-8 lg:px-24">
                <div className="flex flex-col lg:flex-row items-center gap-6 justify-between">
                  <Card className="p-4 w-full lg:w-1/2">
                    <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">
                      Add An Accountability Partner
                    </h3>
                    <p className="text-sm md:text-base mb-2 md:mb-4">
                      This feature allows you to add someone who can guide and
                      keep track of your trading progress. This is optional but
                      having an accountability partner always pushes you to do
                      your best.
                    </p>
                  </Card>
                  <div className="p-4 rounded-xl bg-secondary w-fit ">
                    <img
                      src="/images/Dashboard.png"
                      alt="Add Accountability Partner UI"
                      layout="responsive"
                      className="rounded-lg shadow-md max-w-md"
                    />
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row-reverse items-center gap-6 justify-between">
                  <Card className="p-4 w-full lg:w-1/2">
                    <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">
                      Your Progress is Shared
                    </h3>
                    <p className="text-sm md:text-base mb-2 md:mb-4">
                      This progress page is shared to your partner when you
                      decide to add someone as your accountability partner and
                      choose to share your progress with them.
                    </p>
                  </Card>
                  <div className="p-4 rounded-xl bg-secondary w-fit ">
                    <img
                      src="/images/Dashboard.png"
                      alt="Trading Progress Charts"
                      layout="responsive"
                      className="rounded-lg shadow-md max-w-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
                Why <span className="text-primary">TradeBoard</span>?
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 container lg:px-24">
                {whyTradeboardItems.map((item, index) => (
                  <Card key={index} className="p-0">
                    <CardHeader className="px-4">
                      <CardTitle>{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 text-sm text-accent-foreground/80">
                      <p>{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="py-20 bg-primary text-background">
            <div className="container mx-auto px-4">
              <h2 className="text-xl text-center mb-4">
                Simple Pricing, Great Value
              </h2>
              <p className="text-3xl font-bold text-center mb-8">
                Every Plan Offers Complete{" "}
                <span className="text-foreground">Features Access</span>
              </p>
              <div className="grid md:grid-cols-3 gap-8 container lg:px-48">
                {pricingPlans.map((plan, index) => (
                  <Card
                    key={index}
                    className={`${
                      plan.highlight ? "border-primary" : ""
                    } bg-background text-foreground`}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <div className="text-3xl font-bold">
                        {plan.price}
                        <span className="text-sm font-normal">
                          /{plan.period}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-primary" />
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
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
                Frequently Asked Questions
              </h2>
              <Accordion
                type="single"
                collapsible
                className="w-full max-w-3xl mx-auto"
              >
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        </AnimatedSection>

        
          <div className="flex items-center justify-center bg-gradient-to-b from-background from-50% to-foreground to-50%">
            <section className="py-16 bg-primary w-full md:w-fit rounded-3xl px-6 text-background my-8">
              <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Get Started with{" "}
                  <span className="text-foreground">TradeBoard?</span>
                </h2>
                <p className="text-base mb-8">
                  Give trading psychology a chance in your trading journey. Best
                  time to upgrade your trading game with us is NOW.
                </p>
                <Button variant="secondary" size="lg">
                  Sign up with free
                </Button>
              </div>
            </section>
          </div>
      </main>

      <footer className="bg-foreground text-background pt-8 px-4 md:pt-12 md:px-8 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="max-w-sm">
              <h3 className="text-xl md:text-2xl font-bold mb-4">TradeBoard</h3>
              <p className="text-sm">
                We offer traders the tools to analyse their daily trading
                patterns and learn from it to establish themselves as successful
                traders.
              </p>
              <div className="flex space-x-4 mt-4">
                <Instagram className="h-5 w-5" />
                <Twitter className="h-5 w-5" />
                <Facebook className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-6 md:mt-0">
              <h3 className="text-base font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-sm hover:underline">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 md:mt-0">
              <h3 className="text-base font-semibold mb-4">
                Contact & Support
              </h3>
              <p className="text-sm flex items-center gap-2">
                <Phone size={14} /> +91 8457691231
              </p>
              <p className="text-sm flex items-center gap-2 hover:underline cursor-pointer">
                <Mail size={14} />
                info@tradeboard.in
              </p>
            </div>
          </div>
          <div className="mt-8 py-4 border-t border-background/10 text-sm flex flex-col md:flex-row items-center justify-between">
            <p className="text-center md:text-left mb-4 md:mb-0">
              © Copyright 2024. All Rights Reserved by TradeBoard
            </p>
            <div className="flex items-center gap-3">
              <Button variant="link" className="text-background">
                Terms & Conditions
              </Button>
              <Button variant="link" className="text-background">
                Privacy Policy
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
