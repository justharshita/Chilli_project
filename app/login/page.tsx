"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Phone } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      if (email) {
        // Store company info in localStorage and cookies
        const companyInfo = {
          name: email.split('@')[0], // Use part before @ as company name
          email: email
        }
        
        localStorage.setItem('companyInfo', JSON.stringify(companyInfo))
        document.cookie = `companyInfo=${JSON.stringify(companyInfo)}; path=/`
        
        router.push('/transaction')
      } else {
        setError('Please enter an email')
      }
    } catch (error) {
      console.error('Login failed:', error)
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-b from-white via-white/95 to-white">
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0">
        {/* Top Chilies */}
        <div className="absolute top-0 left-0 right-0 h-[300px]">
          <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent z-10" />
          <Image
            src="/chilies.jpg"
            alt="Chilies"
            fill
            className="object-cover object-top opacity-90"
            priority
          />
        </div>
        {/* Bottom Chilies */}
        <div className="absolute bottom-0 left-0 right-0 h-[300px]">
          <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent z-10" />
          <Image
            src="/chilies.jpg"
            alt="Chilies"
            fill
            className="object-cover object-bottom rotate-180 opacity-90"
            priority
          />
        </div>
      </div>

      {/* Navigation Header */}
      <div className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center z-30">
        <Button 
          variant="ghost" 
          size="icon"
          className="bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="h-5 w-5 text-green-700" />
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white"
              >
                <Phone className="h-5 w-5 text-green-700" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-white/90 backdrop-blur-md">
              <p className="font-medium">Need help? Call us</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Company Logo/Name */}
      <div className="absolute top-8 text-center w-full z-20">
        <div className="bg-white/90 p-6 backdrop-blur-md inline-block rounded-2xl shadow-lg border border-white/20">
          <h1 className="text-3xl font-bold text-green-700 mb-2 drop-shadow-sm">
            Chillis by Core
          </h1>
          <p className="text-red-700 font-medium drop-shadow-sm">
            Trading Management System
          </p>
        </div>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md z-20 shadow-xl bg-white/90 backdrop-blur-md mx-4 rounded-2xl border border-white/20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-green-700 drop-shadow-sm">
            Welcome
          </CardTitle>
          <CardDescription className="text-center text-gray-700 font-medium">
            Please enter your email to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-900 font-medium">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white border-green-300 focus:border-green-500 focus:ring-green-500 transition-all duration-200 placeholder:text-gray-500"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm font-medium bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium shadow-lg transition-all duration-200 hover:shadow-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                "Continue"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 