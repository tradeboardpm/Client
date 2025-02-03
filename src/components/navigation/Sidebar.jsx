"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Crown } from "lucide-react"
import Image from "next/image"
import { usePointsStore } from "@/stores/points-store"

export default function Sidebar({ isOpen }) {
  const pathname = usePathname()
  const { points, currentLevel, nextLevel, pointsToNextLevel } = usePointsStore()
  const sidebarRef = useRef(null)
  const [hasOverflow, setHasOverflow] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(true) // Default collapsed for medium screens
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const checkOverflow = () => {
      if (sidebarRef.current) {
        const hasVerticalOverflow = sidebarRef.current.scrollHeight > sidebarRef.current.clientHeight
        setHasOverflow(hasVerticalOverflow)
      }
    }

    checkOverflow()
    window.addEventListener("resize", checkOverflow)
    return () => window.removeEventListener("resize", checkOverflow)
  }, [])

  const navItems = [
    {
      icon: `/images/dashboard${pathname === "/dashboard" ? "_bold" : "_icon"}.svg`,
      label: "Dashboard",
      href: "/dashboard",
      pattern: /^\/dashboard/,
    },
    {
      icon: `/images/journal${pathname.startsWith("/my-journal") ? "_bold" : "_icon"}.svg`,
      label: "My Journal",
      href: "/my-journal",
      pattern: /^\/my-journal/,
    },
    {
      icon: `/images/performance${pathname.startsWith("/performance-analytics") ? "_bold" : "_icon"}.svg`,
      label: "Performance",
      href: "/performance-analytics",
      pattern: /^\/performance-analytics/,
    },
    {
      icon: `/images/accountability${pathname.startsWith("/accountability-partner") ? "_bold" : "_icon"}.svg`,
      label: "Accountability",
      href: "/accountability-partner",
      pattern: /^\/accountability-partner/,
    },
    {
      icon: `/images/account${pathname.startsWith("/my-account") ? "_bold" : "_icon"}.svg`,
      label: "My Account",
      href: "/my-account",
      pattern: /^\/my-account/,
    },
  ]

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const isRouteActive = (pattern) => {
    return pattern.test(pathname)
  }

  // Determine if we're on a small screen
  const isSmallScreen = windowWidth < 768 // md breakpoint

  // Determine sidebar classes based on screen size
  const getSidebarClasses = () => {
    if (isSmallScreen) {
      return `fixed inset-y-0 left-0 transform ${
        isOpen ? 'translate-x-0 w-full' : '-translate-x-full'
      } w-64 z-50 transition-transform duration-200 ease-in-out mt-14`
    }
    
    return `relative transform translate-x-0 ${
      isCollapsed ? 'lg:w-16 md:w-16' : 'lg:w-[14.5rem] md:w-[14.5rem]'
    } transition-all duration-200 ease-in-out z-0`
  }

  return (
    <div className="relative flex">
      <div
        ref={sidebarRef}
        className={`bg-card ${getSidebarClasses()} flex flex-col max-h-screen overflow-hidden hover:overflow-y-auto ${
          isCollapsed && !isSmallScreen ? 'p-2' : 'p-3'
        }`}
      >
        <div className="flex flex-col justify-between h-full space-y-4">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full py-6 rounded-xl ${
                    isRouteActive(item.pattern)
                      ? "bg-primary text-background hover:text-background font-bold hover:bg-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  } ${isCollapsed && !isSmallScreen ? "px-0 justify-center" : "px-4 justify-start"}`}
                >
                  <span className={`flex items-center ${isCollapsed && !isSmallScreen ? "justify-center" : ""}`}>
                    <Image
                      src={item.icon || "/placeholder.svg"}
                      width={16}
                      height={16}
                      alt={item.label}
                      className={isRouteActive(item.pattern) ? "text-background" : "text-muted-foreground"}
                    />
                    {(!isCollapsed || isSmallScreen) && <span className="ml-2">{item.label}</span>}
                  </span>
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-2">
            {/* Points Card */}
            <Card
              className={`bg-gradient-to-b from-[#A073F0] to-[#7886DD] shadow-[0px_8px_24px_rgba(6,46,112,0.25)] flex-shrink-0 ${
                isCollapsed && !isSmallScreen ? "p-2 rounded-lg" : "rounded-3xl"
              }`}
            >
              <CardContent className={`py-4 text-center flex flex-col items-center ${
                isCollapsed && !isSmallScreen ? "p-0" : ""
              }`}>
                {isCollapsed && !isSmallScreen ? (
                  <div className="flex flex-col items-center w-full">
                    <Image src="/images/diamond.png" width={14} height={14} alt="Level" />
                    <span className="text-xs text-white font-semibold mt-1">{points}</span>
                  </div>
                ) : (
                  <>
                    <Image src="/images/diamond.png" width={70} height={70} alt="Level" />
                    <p className="mt-2 font-semibold text-base text-white">
                      <span className="font-normal">Upcoming Level: </span> {nextLevel}
                    </p>
                    <p className="text-xs text-white">Points: {points}</p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Upgrade Card */}
            <Card className={`bg-transparent flex-shrink-0 ${
              isCollapsed && !isSmallScreen ? "pt-4" : "pt-12"
            } relative shadow-none`}>
              <CardContent
                className={`text-center flex flex-col items-center bg-[#EBEEFF] dark:bg-[#38383c] ${
                  isCollapsed && !isSmallScreen ? "px-2 py-4 rounded-lg" : "p-4 rounded-3xl"
                }`}
              >
                {isCollapsed && !isSmallScreen ? (
                  <div className="flex justify-center w-full">
                    <Crown className="h-5 w-5 text-primary" />
                  </div>
                ) : (
                  <>
                    <Image
                      src="/images/Feature.png"
                      width={175}
                      height={100}
                      alt="Upgrade"
                      className="absolute top-1.5"
                    />
                    <p className="mt-24 font-semibold">
                      Upgrade to <span className="text-primary">PRO</span> for more features.
                    </p>
                    <Button className="text-background w-full mt-2">Upgrade</Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Collapse button - only show on medium and large screens */}
      {!isSmallScreen && (
        <Button
          variant="ghost"
          onClick={toggleCollapse}
          className="absolute top-1/2 p-0 -right-5 z-10 h-8 w-8 rounded-full bg-card shadow-md border-none flex items-center justify-center transform -translate-y-1/2 border border-border hidden md:flex"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      )}

      {/* Overlay for small screens */}
      {isSmallScreen && isOpen && (
        <div
          className="fixed inset-0"
          onClick={() => isOpen && window.dispatchEvent(new CustomEvent('closeSidebar'))}
        />
      )}
    </div>
  )
}