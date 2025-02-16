"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { Calendar as CalendarIcon, ArrowLeft, Phone, CheckCircle2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { fetchWithCompanyInfo } from "@/lib/utils"

export default function TransactionPage() {
  const router = useRouter()
  const [transactionDate, setTransactionDate] = useState<Date>()
  const [deliveryDate, setDeliveryDate] = useState<Date>()
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    salesPoc: '',
    productType: '',
    clientName: '',
    clientEmail: '',
    purchasePrice: '',
    saleValue: '',
    deliveryAddress: '',
    supplierTerms: '',
    clientTerms: '',
    remarks: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    console.log('Input change detected:', { id, value })
    setFormData(prev => {
      const newState = {
        ...prev,
        [id]: value
      }
      console.log('Updated form state:', newState)
      return newState
    })
  }

  const handleSelectChange = (value: string, field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    console.log('Form submission started')
    
    try {
      // Validate prices
      if (parseFloat(formData.purchasePrice) < 0) {
        throw new Error('Purchase price cannot be negative')
      }
      if (parseFloat(formData.saleValue) < 0) {
        throw new Error('Sale value cannot be negative')
      }

      const payload = {
        transactionDate: transactionDate?.toISOString(),
        deliveryDate: deliveryDate?.toISOString(),
        ...formData,
        // Convert string values to numbers for price fields
        purchasePrice: parseFloat(formData.purchasePrice),
        saleValue: parseFloat(formData.saleValue)
      }
      console.log('Payload being sent:', payload)

      const response = await fetchWithCompanyInfo('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      console.log('Response received:', data)

      if (data.success) {
        setShowSuccessModal(true)
      } else {
        throw new Error(data.message)
      }
    } catch (error: any) {
      console.error('Submission failed:', error)
      if (error.message === 'Authentication expired') {
        router.push('/login')
      } else {
        alert('Failed to submit transaction. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleExit = () => {
    router.push('/')
  }

  const handleViewDashboard = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-b from-white via-white/95 to-white py-20">
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
          onClick={() => router.back()}
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

      {/* Transaction Form */}
      <Card className="w-full max-w-4xl z-20 shadow-xl bg-white/90 backdrop-blur-md mx-4 rounded-2xl border border-white/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-green-700">New Transaction</CardTitle>
          <CardDescription className="text-center text-gray-700 font-medium">Enter the transaction details below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Transaction Date */}
              <div className="space-y-2">
                <Label htmlFor="transaction-date" className="text-gray-900 font-medium">Transaction Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-white border-green-300 hover:bg-green-50"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-green-700" />
                      {transactionDate ? format(transactionDate, "PPP") : <span className="text-gray-500">Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white">
                    <Calendar
                      mode="single"
                      selected={transactionDate}
                      onSelect={setTransactionDate}
                      initialFocus
                      className="rounded-md border border-green-200"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Sales POC */}
              <div className="space-y-2">
                <Label htmlFor="sales-poc" className="text-gray-900 font-medium">Sales POC</Label>
                <Select onValueChange={(value) => handleSelectChange(value, 'salesPoc')}>
                  <SelectTrigger className="bg-white border-green-300 focus:ring-green-500">
                    <SelectValue placeholder="Select POC" className="text-gray-500" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="john">John Smith</SelectItem>
                    <SelectItem value="sarah">Sarah Johnson</SelectItem>
                    <SelectItem value="michael">Michael Brown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Product Type */}
              <div className="space-y-2">
                <Label htmlFor="product-type" className="text-gray-900 font-medium">Product Type</Label>
                <Select onValueChange={(value) => handleSelectChange(value, 'productType')}>
                  <SelectTrigger className="bg-white border-green-300 focus:ring-green-500">
                    <SelectValue placeholder="Select product type" className="text-gray-500" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="red-dried">Red Chili - Dried</SelectItem>
                    <SelectItem value="red-packaged">Red Chili - Packaged</SelectItem>
                    <SelectItem value="green-dried">Green Chili - Dried</SelectItem>
                    <SelectItem value="green-packaged">Green Chili - Packaged</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Client Name */}
              <div className="space-y-2">
                <Label htmlFor="clientName" className="text-gray-900 font-medium">Client Name</Label>
                <Input 
                  id="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  className="bg-white border-green-300 focus:ring-green-500"
                  placeholder="Enter client name"
                />
              </div>

              {/* Client Email */}
              <div className="space-y-2">
                <Label htmlFor="clientEmail" className="text-gray-900 font-medium">Client Email</Label>
                <Input 
                  id="clientEmail"
                  type="email"
                  value={formData.clientEmail}
                  onChange={handleInputChange}
                  className="bg-white border-green-300 focus:ring-green-500"
                  placeholder="Enter client email"
                />
              </div>

              {/* Purchase Price */}
              <div className="space-y-2">
                <Label htmlFor="purchasePrice" className="text-gray-900 font-medium">Purchase Price</Label>
                <Input 
                  id="purchasePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.purchasePrice}
                  onChange={handleInputChange}
                  className="bg-white border-green-300 focus:ring-green-500"
                  placeholder="Enter purchase price"
                />
              </div>

              {/* Sale Value */}
              <div className="space-y-2">
                <Label htmlFor="saleValue" className="text-gray-900 font-medium">Sale Value</Label>
                <Input 
                  id="saleValue"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.saleValue}
                  onChange={handleInputChange}
                  className="bg-white border-green-300 focus:ring-green-500"
                  placeholder="Enter sale value"
                />
              </div>

              {/* Expected Delivery Date */}
              <div className="space-y-2">
                <Label htmlFor="delivery-date" className="text-gray-900 font-medium">Delivery Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-white border-green-300 hover:bg-green-50"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-green-700" />
                      {deliveryDate ? format(deliveryDate, "PPP") : <span className="text-gray-500">Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white">
                    <Calendar
                      mode="single"
                      selected={deliveryDate}
                      onSelect={setDeliveryDate}
                      initialFocus
                      className="rounded-md border border-green-200"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Delivery Address */}
              <div className="space-y-2">
                <Label htmlFor="deliveryAddress" className="text-gray-900 font-medium">Delivery Address</Label>
                <Input 
                  id="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleInputChange}
                  className="bg-white border-green-300 focus:ring-green-500"
                  placeholder="Enter delivery address"
                />
              </div>

              {/* Supplier Terms */}
              <div className="space-y-2">
                <Label htmlFor="supplierTerms" className="text-gray-900 font-medium">Supplier Terms</Label>
                <Input 
                  id="supplierTerms"
                  value={formData.supplierTerms}
                  onChange={handleInputChange}
                  className="bg-white border-green-300 focus:ring-green-500"
                  placeholder="Enter supplier terms"
                />
              </div>

              {/* Client Terms */}
              <div className="space-y-2">
                <Label htmlFor="clientTerms" className="text-gray-900 font-medium">Client Terms</Label>
                <Input 
                  id="clientTerms"
                  value={formData.clientTerms}
                  onChange={handleInputChange}
                  className="bg-white border-green-300 focus:ring-green-500"
                  placeholder="Enter client terms"
                />
              </div>

              {/* Remarks */}
              <div className="space-y-2">
                <Label htmlFor="remarks" className="text-gray-900 font-medium">Remarks (Optional)</Label>
                <Textarea 
                  id="remarks"
                  name="remarks"
                  placeholder="Enter any additional remarks"
                  className="bg-white/80"
                  value={formData.remarks}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium shadow-lg transition-all duration-200 hover:shadow-xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  Submitting...
                </div>
              ) : (
                "Submit Transaction"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="bg-white/95 backdrop-blur-md border border-white/20 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-center flex flex-col items-center gap-4">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
              <span className="text-2xl font-bold text-green-700">Transaction Submitted!</span>
            </DialogTitle>
            <DialogDescription className="text-center text-gray-700 pt-2">
              Your transaction has been successfully recorded. What would you like to do next?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button
              onClick={handleViewDashboard}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              View Dashboard
            </Button>
            <Button
              onClick={handleExit}
              variant="outline"
              className="w-full border-green-600 text-green-700 hover:bg-green-50 font-medium"
            >
              Exit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 