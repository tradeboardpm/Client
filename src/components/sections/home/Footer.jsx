import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Mail, Phone, Twitter } from "lucide-react";

const navItems = [
  { name: "Home", href: "home" },
  { name: "Pricing", href: "pricing" },
  { name: "Tutorials", href: "tutorials" },
  { name: "Blog", href: "blog" },
  { name: "FAQs", href: "faqs" },
  { name: "Why Tradeboard", href: "why_tradeboard" },
];

const Footer = () => {
  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-[#12141D] text-card pt-8 px-4 md:pt-12 md:px-8 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="max-w-sm">
            <h3 className="text-xl md:text-4xl font-bold mb-4">TradeBoard</h3>
            <p className="text-base">
              We offer traders the tools to analyse their daily trading patterns
              and learn from it to establish themselves as successful traders.
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
                  <button
                    onClick={() => handleScroll(item.href)}
                    className="text-base hover:underline bg-transparent border-none cursor-pointer"
                  >
                    {item.name}
                  </button>
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

        <div className="mt-8 py-4 border-t border-[#BEC0CA]/50 text-xs flex flex-col md:flex-row items-center justify-between">
          <p className="text-center md:text-left mb-4 md:mb-0">
            © Copyright 2024. All Rights Reserved by TradeBoard
          </p>

          <p className="text-center md:text-right mt-4 md:mt-0">
            Version: {process.env.APP_VERSION}
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="link"
              className="text-background underline text-xs"
            >
              Terms and Conditions
            </Button>
            <Button
              variant="link"
              className="text-background underline text-xs"
            >
              Privacy Policy
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
