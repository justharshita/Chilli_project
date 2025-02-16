import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight, Phone } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-gradient-to-b from-white via-transparent to-white">
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0">
        {/* Top Chilies */}
        <div className="absolute top-0 left-0 right-0 h-[300px]">
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent z-10" />
        <Image
            src="/chilies.jpg"
            alt="Chilies"
            fill
            className="object-cover object-top"
          priority
        />
        </div>
        {/* Bottom Chilies */}
        <div className="absolute bottom-0 left-0 right-0 h-[300px]">
          <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent z-10" />
          <Image
            src="/chilies.jpg"
            alt="Chilies"
            fill
            className="object-cover object-bottom rotate-180"
            priority
          />
        </div>
      </div>

      {/* Navigation Header */}
      <div className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center z-30">
        <Button 
          variant="ghost" 
          size="icon"
          className="bg-white/70 backdrop-blur-md rounded-full shadow-md hover:bg-white/80"
        >
          <ArrowLeft className="h-5 w-5 text-green-600" />
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="bg-white/70 backdrop-blur-md rounded-full shadow-md hover:bg-white/80"
              >
                <Phone className="h-5 w-5 text-green-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Need help? Call us</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Content */}
      <div className="z-20 text-center space-y-6 bg-white/70 p-10 rounded-2xl backdrop-blur-md shadow-lg mx-4 border border-white/20">
        <h1 className="text-4xl md:text-6xl font-bold text-green-600 mb-2 drop-shadow-sm">
          Chillis by Core
        </h1>
        <p className="text-red-600 text-lg mb-8 font-medium drop-shadow-sm">
          Trading Management System
        </p>
        <Link href="/login">
          <Button 
            size="lg" 
            className="text-lg bg-green-600 text-white hover:bg-green-700 shadow-md transition-all duration-200 hover:shadow-lg px-8"
          >
            Login
          </Button>
        </Link>
      </div>
    </div>
  )
}
