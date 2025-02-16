"use client"

import * as React from "react"
import Link from "next/link"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const Header = () => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      const link = e.currentTarget as HTMLAnchorElement
      link.click()
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Company Logo/Name */}
        <Link 
          href="/" 
          className="flex items-center space-x-2"
          tabIndex={0}
          aria-label="Home"
          onKeyDown={handleKeyDown}
        >
          <span className="font-bold text-xl">TradingTracker</span>
        </Link>

        {/* Main Navigation */}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Dashboard</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 w-[400px]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/dashboard"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Trading Overview
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          View your trading statistics and performance metrics
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Analytics</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        href="/analytics"
                      >
                        <div className="text-sm font-medium leading-none">Trade Analysis</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Detailed analysis of your trading patterns
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline"
            onClick={() => {}}
            className="hidden sm:flex"
          >
            Sign In
          </Button>
          <Button
            onClick={() => {}}
          >
            Get Started
          </Button>
        </div>
      </div>
    </header>
  )
}

export default  Header  