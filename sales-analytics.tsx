"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, Calendar, Package, DollarSign } from "lucide-react"
import type { Order } from "@/lib/types"

interface SalesAnalyticsProps {
  orders: Order[]
}

export function SalesAnalytics({ orders }: SalesAnalyticsProps) {
  const analytics = useMemo(() => {
    // Daily sales data
    const dailySales = orders.reduce(
      (acc, order) => {
        const date = new Date(order.orderDate).toLocaleDateString()
        if (!acc[date]) {
          acc[date] = { date, revenue: 0, orders: 0 }
        }
        acc[date].revenue += order.totalAmount
        acc[date].orders += 1
        return acc
      },
      {} as Record<string, { date: string; revenue: number; orders: number }>,
    )

    const dailySalesData = Object.values(dailySales).slice(-7) // Last 7 days

    // Product category sales
    const categorySales = orders.reduce(
      (acc, order) => {
        order.items.forEach((item) => {
          const category = item.product.category
          if (!acc[category]) {
            acc[category] = { name: category, value: 0, count: 0 }
          }
          acc[category].value += item.product.priceValue * item.quantity
          acc[category].count += item.quantity
        })
        return acc
      },
      {} as Record<string, { name: string; value: number; count: number }>,
    )

    const categoryData = Object.values(categorySales)

    // Top products
    const productSales = orders.reduce(
      (acc, order) => {
        order.items.forEach((item) => {
          const productId = item.product.id
          if (!acc[productId]) {
            acc[productId] = {
              name: item.product.name,
              revenue: 0,
              quantity: 0,
            }
          }
          acc[productId].revenue += item.product.priceValue * item.quantity
          acc[productId].quantity += item.quantity
        })
        return acc
      },
      {} as Record<number, { name: string; revenue: number; quantity: number }>,
    )

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    // Monthly stats
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const monthlyOrders = orders.filter((order) => {
      const orderDate = new Date(order.orderDate)
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
    })

    const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + order.totalAmount, 0)
    const averageOrderValue = monthlyOrders.length > 0 ? monthlyRevenue / monthlyOrders.length : 0

    return {
      dailySalesData,
      categoryData,
      topProducts,
      monthlyStats: {
        orders: monthlyOrders.length,
        revenue: monthlyRevenue,
        averageOrderValue,
      },
    }
  }, [orders])

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00ff00"]

  return (
    <div className="space-y-6">
      {/* Monthly Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Orders</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.monthlyStats.orders}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₺{analytics.monthlyStats.revenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₺{analytics.monthlyStats.averageOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per order</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Sales (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.dailySalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Sales Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Top Selling Products</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline">#{index + 1}</Badge>
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.quantity} units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">₺{product.revenue.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Revenue</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
