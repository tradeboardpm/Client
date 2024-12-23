import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BriefcaseBusiness,
  Diamond,
  FileText,
  LayoutDashboard,
  LineChart,
  User,
  UserRound,
  Users,
  UsersRound,
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
      icon: BriefcaseBusiness,
      label: "Performance Analytics",
      href: "/performance-analytics",
    },
    {
      icon: UsersRound,
      label: "Accountability Partner",
      href: "/accountability-partner",
    },
    { icon: UserRound, label: "My Account", href: "/my-account" },
  ];

return (
  <div
    className={`bg-card p-3 w-full lg:mt-0 mt-14 lg:w-[14.5rem] md:w-[14.5rem] md:mt-0 absolute inset-y-0 left-0 transform ${
      isOpen ? "translate-x-0" : "-translate-x-full"
    } md:relative md:translate-x-0 transition duration-200 ease-in-out z-30 md:z-0 flex flex-col max-h-screen overflow-hidden hover:overflow-y-auto`}
  >
    <div className="flex flex-col space-y-4">
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={`w-full justify-start text-[0.8rem] py-6 rounded-xl ${
                pathname === item.href
                  ? "bg-primary text-background font-bold"
                  : "text-muted-foreground"
              }`}
            >
              <item.icon
                className={`mr-2 h-4 w-4 ${
                  pathname === item.href
                    ? "text-background fill-background rounded-full"
                    : "text-muted-foreground"
                }`}
              />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>

      <Card className="bg-gradient-to-b rounded-3xl from-[#A073F0] to-[#7886DD] shadow-[0px_8px_24px_rgba(6,46,112,0.25)] flex-shrink-0 ">
        <CardContent className="py-4 text-center flex flex-col items-center">
          <Image src="/images/diamond.png" width={70} height={70} alt="Level" />
          <p className="mt-2 font-semibold text-base text-white">
            <span className="font-thin">Upcoming Level: </span> {nextLevel}
          </p>
          <p className="text-xs text-white">Points: {points}</p>
        </CardContent>
      </Card>

      <Card className="bg-transparent flex-shrink-0 pt-12 relative shadow-none">
        <CardContent className="p-4 text-center flex flex-col items-center bg-[#EBEEFF] dark:bg-[#38383c] rounded-3xl">
          <Image
            src="/images/Feature.png"
            width={175}
            height={100}
            alt="Upgrade"
            className="absolute top-1.5"
          />
          <p className="mt-24 font-semibold">
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
