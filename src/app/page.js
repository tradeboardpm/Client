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
  { name: "Why Tradeboard", href: "#" },
  { name: "Pricing", href: "#" },
  { name: "Tutorials", href: "#" },
  { name: "Blog", href: "#" },
  { name: "FAQs", href: "#" },
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
    discount: true, // New property to indicate discount
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
  const [isSticky, setIsSticky] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const heroSectionRef = useRef(null);
  const lastScrollY = useRef(0);


 useEffect(() => {
   const handleScroll = () => {
     const currentScrollY = window.scrollY;

     if (heroSectionRef.current) {
       const heroBottom = heroSectionRef.current.getBoundingClientRect().bottom;
       const isInHeroSection = heroBottom > 0;

       // Hide navigation when in hero section
       if (isInHeroSection) {
         setShowNav(false);
         setIsSticky(false);
       } else {
         setShowNav(true);
         setIsSticky(true);
       }
     }

     lastScrollY.current = currentScrollY;
   };

   window.addEventListener("scroll", handleScroll);
   return () => window.removeEventListener("scroll", handleScroll);
 }, []);

  return (
    <div className="min-h-screen">
      {/* Sticky Navigation */}
      {/* Initial Navigation (visible only at top) */}
      <div className="bg-primary">
        <nav className="flex items-center justify-between p-4 text-background mx-auto container max-w-[84rem]">
          <div className="flex items-center space-x-2">
            <Image
              src="/images/home_logo.png"
              alt="Tradeboard.in Logo"
              width={240}
              height={60}
            />
          </div>
          <div className="hidden md:flex space-x-7 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="hover:text-foreground transition-all duration-300 ease-in-out"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-6 text-lg">
            <Link href="/login">
              <Button variant="ghost" className="text-base">
                Login
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-background text-base text-foreground hover:bg-secondary px-10 rounded-xl py-6 font-semibold">
                Sign up
              </Button>
            </Link>
          </div>
        </nav>
      </div>

      {/* Sticky Navigation */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          showNav ? "translate-y-0" : "-translate-y-full"
        } ${isSticky ? "bg-primary shadow-md" : "bg-transparent"}`}
      >
        <nav className="flex items-center justify-between p-4 text-background mx-auto container max-w-[84rem]">
          <div className="flex items-center space-x-2">
            <Image
              src="/images/home_logo.png"
              alt="Tradeboard.in Logo"
              width={240}
              height={60}
            />
          </div>
          <div className="hidden md:flex space-x-7 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="hover:text-foreground transition-all duration-300 ease-in-out"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-6 text-lg">
            <Link href="/login">
              <Button variant="ghost" className="text-base">
                Login
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-background text-base text-foreground hover:bg-secondary px-10 rounded-xl py-6 font-semibold">
                Sign up
              </Button>
            </Link>
          </div>
        </nav>
      </div>

      <main>
        <section
          ref={heroSectionRef}
          className=" primary_gradient text-background pt-28  "
        >
          <div className="text-center min-h-screen  space-y-4">
            <h1 className="text-5xl md:text-[4.15rem] mb-6 poppins-bold">
              Trade Better With Discipline
            </h1>
            <span className="text-[1.4rem] mb-4 max-w-7xl mx-auto">
              We offer traders the tools to analyse their daily trading patterns
              and learn from <br />
              it to establish themselves as successful traders.
            </span>
            <div className="bg-gradient-to-b from-transparent from-50% to-background to-50% p-4 ">
              <div className="relative w-full max-w-[58rem] mx-auto aspect-video">
                <img
                  src="/images/Dashboard.png"
                  alt="Tradeboard Dashboard"
                  layout="fill"
                  objectFit="contain"
                  className=" rounded-3xl"
                />
              </div>
            </div>
          </div>
        </section>

        <AnimatedSection>
          <section className="py-8 md:py-16">
            <div className="container mx-auto px-">
              <h2 className="poppins-bold text-2xl md:text-3xl lg:text-4xl font-bold poppins-bold text-center mb-12">
                Manage Your{" "}
                <span className="text-primary">Trading Psychology</span>
              </h2>
              <div className="flex flex-col gap-20 lg:px-24">
                <div className="flex flex-col lg:flex-row-reverse items-center gap-16 justify-between">
                  <div className="flex flex-col gap-4 w-full lg:w-1/2">
                    <Card className="p-4">
                      <h3 className="text-lg md:text-[1.4rem] font-semibold  mb-2 md:mb-4">
                        Journal
                      </h3>
                      <p className="text-sm md:text-base mb-2 md:mb-4">
                        Journal allows you to add different aspects of your
                        thought process during trading.
                      </p>
                    </Card>
                    <Card className="p-4">
                      <h3 className="text-lg md:text-[1.4rem] font-semibold  mb-2 md:mb-4">
                        Rules
                      </h3>
                      <p className="text-sm md:text-base mb-2 md:mb-4">
                        Rules keep you disciplined. Checkmark the followed rules
                        and keep the unfollowed ones unchecked.
                      </p>
                    </Card>
                  </div>
                  <div className="p-4 rounded-xl bg-[#8885FF]/15 w-fit ">
                    <img
                      src="/images/rules.png"
                      alt="Journal and Rules Interface"
                      layout="responsive"
                      className="rounded-lg max-w-[38rem]"
                    />
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row items-center gap-8 justify-between">
                  <Card className="p-4 w-full lg:w-1/2">
                    <h3 className="text-lg md:text-[1.4rem] font-semibold  mb-2 md:mb-4">
                      Trade Log
                    </h3>
                    <p className="text-sm md:text-base mb-2 md:mb-4">
                      Automatically add the trades log using tradebook provided
                      by your broker or create manual trades entries. We analyse
                      this data to provide you best trading performance
                      analytics.
                    </p>
                  </Card>
                  <div className="p-4 rounded-xl bg-[#8885FF]/15 w-fit ">
                    <img
                      src="/images/trades.png"
                      alt="Trade Log Interface"
                      layout="responsive"
                      className="rounded-lg max-w-[38rem]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="py-8 md:py-16 bg-muted">
            <div className="container mx-auto px-">
              <h2 className="poppins-bold text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8">
                Analyse Your{" "}
                <span className="text-primary">Trading Discipline</span>
              </h2>
              <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:px-24">
                <div className="w-fit p-4 rounded-xl bg-[#8885FF]/15">
                  <img
                    src="/images/analytics.png"
                    alt="Trading Analysis Dashboard"
                    layout="responsive"
                    className="rounded-lg max-w-[38rem]"
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
            <div className="container mx-auto px-">
              <h2 className="poppins-bold text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8">
                Be Accountable For Your{" "}
                <span className="text-primary">Trading Journey</span>
              </h2>
              <div className="flex flex-col gap-8 lg:px-24">
                <div className="flex flex-col lg:flex-row items-center gap-6 justify-between">
                  <Card className="p-4 w-full lg:w-1/2">
                    <h3 className="text-lg md:text-[1.4rem] font-semibold  mb-2 md:mb-4">
                      Add An Accountability Partner
                    </h3>
                    <p className="text-sm md:text-base mb-2 md:mb-4">
                      This feature allows you to add someone who can guide and
                      keep track of your trading progress. This is optional but
                      having an accountability partner always pushes you to do
                      your best.
                    </p>
                  </Card>
                  <div className="p-4 rounded-xl bg-[#8885FF]/15 w-fit ">
                    <img
                      src="/images/ap.png"
                      alt="Add Accountability Partner UI"
                      layout="responsive"
                      className="rounded-lg max-w-[38rem]"
                    />
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row-reverse items-center gap-6 justify-between">
                  <Card className="p-4 w-full lg:w-1/2">
                    <h3 className="text-lg md:text-[1.4rem] font-semibold  mb-2 md:mb-4">
                      Your Progress is Shared
                    </h3>
                    <p className="text-sm md:text-base mb-2 md:mb-4">
                      This progress page is shared to your partner when you
                      decide to add someone as your accountability partner and
                      choose to share your progress with them.
                    </p>
                  </Card>
                  <div className="p-4 rounded-xl bg-[#8885FF]/15 w-fit ">
                    <img
                      src="/images/apd.png"
                      alt="Trading Progress Charts"
                      layout="responsive"
                      className="rounded-lg max-w-[38rem]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="py-16">
            <div className="container mx-auto px-">
              <h2 className="poppins-bold text-3xl md:text-4xl font-bold text-center mb-8">
                Why <span className="text-primary">TradeBoard</span>?
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-14 container lg:px-24">
                {whyTradeboardItems.map((item, index) => (
                  <Card key={index} className="p-0">
                    <CardHeader className="px-4">
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 text-base text-accent-foreground/80">
                      <p>{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="py-20 primary_gradient text-background">
            <div className="container mx-auto px-">
              <h2 className="text-2xl text-center mb-4">
                Simple Pricing, Great Value
              </h2>
              <p className="text-4xl poppins-bold  text-center mb-14">
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
                          <CardTitle className="text-xl mb-2">
                            {plan.name}
                          </CardTitle>
                          <div className="text-2xl font-bold">
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
                              <li
                                key={featureIndex}
                                className="flex items-center"
                              >
                                <Check className="mr-2 h-3 w-3  text-background rounded ring-1 ring-green-600 bg-green-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                        <CardFooter>
                          <Button
                            className="w-full"
                            variant={plan.buttonVariant}
                          >
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
                          <CardTitle className="text-xl mb-2">
                            {plan.name}
                          </CardTitle>
                          <div className="text-2xl font-bold">
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
                              <li
                                key={featureIndex}
                                className="flex items-center"
                              >
                                <Check className="mr-2 h-3 w-3  text-background rounded ring-1 ring-green-600 bg-green-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                        <CardFooter>
                          <Button
                            className="w-full"
                            variant={plan.buttonVariant}
                          >
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
        </AnimatedSection>

        <AnimatedSection>
          <section className="py-24">
            <div className="container mx-auto px-">
              <h2 className="poppins-bold text-3xl md:text-[2.5rem] font-bold text-center mb-14">
                Frequently Asked Questions
              </h2>
              <Accordion
                type="single"
                collapsible
                className="w-full max-w-5xl mx-auto"
              >
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="px-8"
                  >
                    <AccordionTrigger className="text-lg font-semibold">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-base">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        </AnimatedSection>

        <div className="flex items-center justify-center bg-gradient-to-b from-background from-50% to-[#12141D] to-50%">
          <section className="py-12 primary_gradient w-full max-w-5xl rounded-3xl px-6 text-background my-8">
            <div className="container mx-auto px-4 text-center">
              <h2 className="poppins-bold text-3xl md:text-4xl font-bold mb-4">
                Ready to Get Started with{" "}
                <span className="text-foreground">TradeBoard?</span>
              </h2>
              <p className="text-base mb-8">
                Give trading psychology a chance in your trading journey. Best
                time to upgrade your trading game <br /> with us is NOW.
              </p>
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="bg-background hover:bg-secondary font-semibold text-base py-6 px-5 rounded-xl text-foreground hover:text-primary"
                >
                  Sign up with free
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-[#12141D] text-background pt-8 px-4 md:pt-12 md:px-8 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="max-w-sm">
              <h3 className="text-xl md:text-4xl poppins-bold font-bold mb-4">
                TradeBoard
              </h3>
              <p className="text-base">
                We offer traders the tools to analyse their daily trading
                patterns and learn from it to establish themselves as successful
                traders.
              </p>
              <p className="mt-3">Follow us on:</p>
              <div className="flex space-x-4 mt-2">
                <span className=" bg-[#4B4B4B] rounded-full p-1">
                  <Instagram className="h-5 w-5" />
                </span>
                <span className=" bg-[#4B4B4B] rounded-full p-1">
                  <Twitter className="h-5 w-5" />
                </span>
                <span className=" bg-[#4B4B4B] rounded-full p-1">
                  <Facebook className="h-5 w-5" />
                </span>
              </div>
            </div>
            <div className="mt-6 md:mt-0">
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-base hover:underline"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 md:mt-0">
              <h3 className="text-xl font-semibold mb-4">Contact & Support</h3>
              <p className="text-base flex items-center gap-2 mb-4">
                <Phone size={14} /> +91 8457691231
              </p>
              <p className="text-base flex items-center gap-2 hover:underline cursor-pointer underline">
                <Mail size={14} />
                info@tradeboard.in
              </p>
            </div>
          </div>

          <div className="mt-8 py-4 border-t border-background/10 text-sm flex flex-col md:flex-row items-center justify-between">
            <p className="text-center md:text-left mb-4 md:mb-0">
              © Copyright 2024. All Rights Reserved by TradeBoard
            </p>

            <p className="text-sm text-center md:text-right mt-4 md:mt-0">
              Version: 0.64
            </p>
            <div className="flex items-center gap-3">
              <Button variant="link" className="text-background underline">
                Terms & Conditions
              </Button>
              <Button variant="link" className="text-background underline">
                Privacy Policy
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
