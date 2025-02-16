"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Flame, Package } from "lucide-react"
import { useRouter } from "next/navigation"
import { DashboardData, Transaction } from "@/app/types/dashboard"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { fetchWithCompanyInfo, getCompanyInfo } from "@/lib/utils"

type ProductSales = {
  [key: string]: {
    count: number;
    totalValue: number;
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<DashboardData | null>(null)
  const [productSales, setProductSales] = useState<ProductSales>({})
  const [chartData, setChartData] = useState<Array<{
    name: string;
    sales: number;
  }>>([])
  const [companyName, setCompanyName] = useState<string>('')

  useEffect(() => {
    const companyInfo = getCompanyInfo();
    if (!companyInfo) {
      router.push('/login');
      return;
    }
    setCompanyName(companyInfo.name);

    async function fetchDashboardData() {
      try {
        const response = await fetchWithCompanyInfo('/api/transactions')
        const result = await response.json()
        
        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch dashboard data')
        }

        if (result.success) {
          setData(result.data)
          
          // Calculate sales by product type
          const salesByProduct: ProductSales = {}
          result.data.transactions.forEach((transaction: Transaction) => {
            if (!salesByProduct[transaction.product_type]) {
              salesByProduct[transaction.product_type] = {
                count: 0,
                totalValue: 0
              }
            }
            salesByProduct[transaction.product_type].count += 1
            salesByProduct[transaction.product_type].totalValue += transaction.sale_value
          })
          setProductSales(salesByProduct)

          // Prepare chart data
          const chartData = Object.entries(salesByProduct).map(([type, data]) => ({
            name: formatProductType(type),
            sales: data.count
          }))
          setChartData(chartData)
        } else {
          throw new Error(result.message)
        }
      } catch (err: any) {
        console.error('Dashboard data fetch error:', err)
        if (err.message === 'Authentication expired') {
          router.push('/login')
        } else {
          setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [router])

  // Function to format product type for display
  const formatProductType = (type: string) => {
    return type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="sticky top-0 p-4 flex justify-between items-center z-30 bg-white shadow-sm">
        <Button 
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-xl font-bold text-green-700">
          {companyName}'s Dashboard
        </h1>
      </div>

      {/* Insights Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-8 px-4 shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-3">
            <Flame className="h-8 w-8 text-yellow-300 animate-pulse" />
            <h1 className="text-3xl md:text-4xl font-bold text-center">
              INSIGHTS BY CHILLI
            </h1>
            <Flame className="h-8 w-8 text-yellow-300 animate-pulse" />
          </div>
          <p className="text-center mt-2 text-green-100 font-medium">
            Your comprehensive trading analytics dashboard
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        ) : data ? (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-gray-700">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-700">
                    ₹{data.summary.totalRevenue.toFixed(2)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-gray-700">Total Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-700">
                    ₹{data.summary.totalProfit.toFixed(2)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-gray-700">Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-700">
                    {data.summary.totalTransactions}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-gray-700">Average Order Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-700">
                    ₹{data.summary.averageOrderValue.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sales Chart */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-600" />
                  <CardTitle>Number of Sales by Product Type</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#374151', fontSize: 12 }}
                        axisLine={{ stroke: '#9ca3af' }}
                      />
                      <YAxis 
                        tick={{ fill: '#374151', fontSize: 12 }}
                        axisLine={{ stroke: '#9ca3af' }}
                        label={{ 
                          value: 'Number of Sales', 
                          angle: -90, 
                          position: 'insideLeft',
                          style: { fill: '#374151', fontSize: 12 }
                        }}
                      />
                      <Tooltip 
                        cursor={{ fill: 'rgba(22, 163, 74, 0.1)' }}
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          fontSize: 12
                        }}
                        labelStyle={{ color: '#374151', fontWeight: 'bold', fontSize: 12 }}
                      />
                      <Bar 
                        dataKey="sales" 
                        fill="#16a34a"
                        radius={[4, 4, 0, 0]}
                        animationDuration={1000}
                        label={{
                          position: 'top',
                          fill: '#374151',
                          fontSize: 11
                        }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Product Sales Breakdown */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-600" />
                  <CardTitle>Sales by Product Type</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(productSales).map(([productType, stats]) => (
                    <div 
                      key={productType}
                      className="bg-white p-4 rounded-lg border border-gray-200 hover:border-green-500 transition-colors"
                    >
                      <h3 className="font-medium text-gray-800 mb-2">
                        {formatProductType(productType)}
                      </h3>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          Number of Sales: <span className="font-bold text-green-700">{stats.count}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Total Value: <span className="font-bold text-green-700">₹{stats.totalValue.toFixed(2)}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Average Value: <span className="font-bold text-green-700">
                            ₹{(stats.totalValue / stats.count).toFixed(2)}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Date</th>
                        <th className="text-left p-2">Client</th>
                        <th className="text-left p-2">Product</th>
                        <th className="text-right p-2">Purchase Price</th>
                        <th className="text-right p-2">Sale Value</th>
                        <th className="text-right p-2">Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.transactions.length === 0 ? (
                        <tr className="border-b">
                          <td className="p-2 text-gray-500" colSpan={6}>
                            No transactions found
                          </td>
                        </tr>
                      ) : (
                        data.transactions.map((transaction) => (
                          <tr key={transaction.id} className="border-b hover:bg-gray-50">
                            <td className="p-2">
                              {new Date(transaction.transaction_date).toLocaleDateString()}
                            </td>
                            <td className="p-2">{transaction.client_name}</td>
                            <td className="p-2">{formatProductType(transaction.product_type)}</td>
                            <td className="p-2 text-right">₹{transaction.purchase_price.toFixed(2)}</td>
                            <td className="p-2 text-right">₹{transaction.sale_value.toFixed(2)}</td>
                            <td className="p-2 text-right">
                              ₹{(transaction.sale_value - transaction.purchase_price).toFixed(2)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </main>
    </div>
  )
} 