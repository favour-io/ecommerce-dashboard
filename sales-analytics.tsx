"use client"

import { useMemo } from "react"
// Removed custom UI components and recharts


type Order = {
  orderDate: string;
  totalAmount: number;
  items: Array<{
    product: {
      id: number;
      name: string;
      priceValue: number;
      category: string;
    };
    quantity: number;
  }>;
};

interface SalesAnalyticsProps {
  orders: Order[];
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
    <div style={{padding:'24px'}}>
      <h2 style={{fontWeight:'bold', fontSize:24, marginBottom:24}}>Sales Analytics</h2>
      {/* Monthly Overview */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'24px', marginBottom:24}}>
        <div style={{border:'1px solid #eee', borderRadius:8, padding:16, background:'#fff'}}>
          <div style={{fontWeight:'bold', fontSize:14, marginBottom:8}}>Monthly Orders</div>
          <div style={{fontWeight:'bold', fontSize:24}}>{analytics.monthlyStats.orders}</div>
          <p style={{fontSize:12, color:'#888'}}>This month</p>
        </div>
        <div style={{border:'1px solid #eee', borderRadius:8, padding:16, background:'#fff'}}>
          <div style={{fontWeight:'bold', fontSize:14, marginBottom:8}}>Monthly Revenue</div>
          <div style={{fontWeight:'bold', fontSize:24}}>&#8378;{analytics.monthlyStats.revenue.toFixed(2)}</div>
          <p style={{fontSize:12, color:'#888'}}>This month</p>
        </div>
        <div style={{border:'1px solid #eee', borderRadius:8, padding:16, background:'#fff'}}>
          <div style={{fontWeight:'bold', fontSize:14, marginBottom:8}}>Avg Order Value</div>
          <div style={{fontWeight:'bold', fontSize:24}}>&#8378;{analytics.monthlyStats.averageOrderValue.toFixed(2)}</div>
          <p style={{fontSize:12, color:'#888'}}>Per order</p>
        </div>
      </div>
      {/* Category Sales Summary */}
      <div style={{marginBottom:24}}>
        <h3 style={{fontWeight:'bold', fontSize:18, marginBottom:12}}>Sales by Category</h3>
        <ul>
          {analytics.categoryData.map((cat, idx) => (
            <li key={cat.name} style={{marginBottom:8}}>
              <span style={{fontWeight:'bold'}}>{cat.name}:</span> &#8378;{cat.value.toFixed(2)} ({cat.count} units)
            </li>
          ))}
        </ul>
      </div>
      {/* Top Products */}
      <div style={{border:'1px solid #eee', borderRadius:8, padding:16, background:'#fff'}}>
        <h3 style={{fontWeight:'bold', fontSize:18, marginBottom:12}}>Top Selling Products</h3>
        <ul>
          {analytics.topProducts.map((product, index) => (
            <li key={product.name} style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
              <span style={{fontWeight:'bold'}}>#{index + 1} {product.name}</span>
              <span>{product.quantity} units sold</span>
              <span>&#8378;{product.revenue.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
