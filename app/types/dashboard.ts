export type Transaction = {
  id: string
  transaction_date: string
  sales_poc: string
  product_type: string
  client_name: string
  client_email: string
  purchase_price: number
  sale_value: number
  delivery_date: string
  delivery_address: string
  supplier_terms?: string
  client_terms?: string
  remarks?: string
  created_at: string
}

export type DashboardSummary = {
  totalRevenue: number
  totalProfit: number
  totalTransactions: number
  averageOrderValue: number
}

export type DashboardData = {
  transactions: Transaction[]
  summary: DashboardSummary
} 