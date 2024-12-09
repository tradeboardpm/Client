import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Diamond,
  FileText,
  LayoutDashboard,
  LineChart,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import { usePointsStore } from "@/stores/points-store";

export default function Sidebar({ isOpen }) {
  const pathname = usePathname();
  const { points, currentLevel, nextLevel, pointsToNextLevel } =
    usePointsStore();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: FileText, label: "My Journal", href: "/my-journal" },
    {
      icon: LineChart,
      label: "Performance Analytics",
      href: "/performance-analytics",
    },
    {
      icon: Users,
      label: "Accountability Partner",
      href: "/accountability-partner",
    },
    { icon: User, label: "My Account", href: "/my-account" },
  ];

  return (
    <div
      className={`bg-card p-4 w-full lg:mt-0 mt-14 lg:w-64 md:w-64 md:mt-0 absolute inset-y-0 left-0 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0 transition duration-200 ease-in-out z-30 md:z-0 flex flex-col overflow-y-auto max-h-screen`}
    >
      <div className="flex flex-col space-y-6">
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={`w-full justify-start text-sm ${
                  pathname === item.href
                    ? "bg-primary text-background font-bold"
                    : ""
                }`}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <Card className="primary_gradient flex-shrink-0">
          <CardContent className="py-4 text-center flex flex-col items-center">
            <Image
              src="/images/diamond.png"
              width={70}
              height={70}
              alt="Level"
            />
            <p className="mt-2 font-semibold text-base text-white">
              <span className="font-thin">Upcoming Level: </span> {nextLevel}
            </p>
            <p className="text-sm text-gray-600">Points: {points}</p>
          </CardContent>
        </Card>

        <Card className="bg-primary/25 flex-shrink-0">
          <CardContent className="p-4 text-center flex flex-col items-center">
            <Image
              src="/images/Feature.png"
              width={140}
              height={100}
              alt="Upgrade"
            />
            <p className="mt-2 font-semibold">
              Upgrade to <span className="text-primary">PRO</span> for more
              features.
            </p>
            <Button className="text-background w-full mt-2">Upgrade</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
