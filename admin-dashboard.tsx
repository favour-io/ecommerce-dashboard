"use client"

import { useState, useEffect } from "react"
// Removed all custom UI, icons, and utility imports


interface AdminDashboardProps {
  onLogout: () => void;
}

type Order = {
  customerEmail: string;
  status: string;
  totalAmount: number;
};

export function AdminDashboard({ onLogout }: AdminDashboardProps) {

  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    const loadData = () => {
      const storedOrders = JSON.parse(localStorage.getItem("sweettreatcy-orders") || "[]")
      setOrders(storedOrders)

      const uniqueCustomers = new Set(storedOrders.map((order: Order) => order.customerEmail))
      const pendingCount = storedOrders.filter((order: Order) => order.status === "pending").length
      const totalRevenue = storedOrders.reduce((sum: number, order: Order) => sum + order.totalAmount, 0)

      setStats({
        totalOrders: storedOrders.length,
        totalRevenue,
        pendingOrders: pendingCount,
        totalCustomers: uniqueCustomers.size,
      })
    }

    loadData()

    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{minHeight:'100vh', background:'#f9fafb'}}>
      {/* Header */}
      <div style={{borderBottom:'1px solid #eee', background:'#fff', padding:'16px 0', marginBottom:24}}>
        <div style={{maxWidth:1200, margin:'0 auto', padding:'0 16px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div>
            <h1 style={{fontWeight:'bold', fontSize:24}}>SweetTreatcy Admin</h1>
            <p style={{color:'#888'}}>Manage your bakery business</p>
          </div>
          <button style={{padding:8, borderRadius:4, background:'#fff', border:'1px solid #ccc', fontWeight:'bold', cursor:'pointer'}} onClick={onLogout}>Logout</button>
        </div>
      </div>
      <div style={{maxWidth:1200, margin:'0 auto', padding:'0 16px 32px 16px'}}>
        {/* Stats Overview */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:'24px', marginBottom:32}}>
          <div style={{border:'1px solid #eee', borderRadius:8, padding:16, background:'#fff'}}>
            <div style={{fontWeight:'bold', fontSize:14, marginBottom:8}}>Total Orders</div>
            <div style={{fontWeight:'bold', fontSize:24}}>{stats.totalOrders}</div>
            <p style={{fontSize:12, color:'#888'}}>All time orders</p>
          </div>
          <div style={{border:'1px solid #eee', borderRadius:8, padding:16, background:'#fff'}}>
            <div style={{fontWeight:'bold', fontSize:14, marginBottom:8}}>Total Revenue</div>
            <div style={{fontWeight:'bold', fontSize:24}}>&#8378;{stats.totalRevenue.toFixed(2)}</div>
            <p style={{fontSize:12, color:'#888'}}>Total earnings</p>
          </div>
          <div style={{border:'1px solid #eee', borderRadius:8, padding:16, background:'#fff'}}>
            <div style={{fontWeight:'bold', fontSize:14, marginBottom:8}}>Pending Orders</div>
            <div style={{fontWeight:'bold', fontSize:24}}>{stats.pendingOrders}</div>
            <p style={{fontSize:12, color:'#888'}}>Need attention</p>
          </div>
          <div style={{border:'1px solid #eee', borderRadius:8, padding:16, background:'#fff'}}>
            <div style={{fontWeight:'bold', fontSize:14, marginBottom:8}}>Total Customers</div>
            <div style={{fontWeight:'bold', fontSize:24}}>{stats.totalCustomers}</div>
            <p style={{fontSize:12, color:'#888'}}>Unique customers</p>
          </div>
        </div>
        {/* Main Content Tabs (simplified) */}
        <div style={{display:'flex', gap:16, marginBottom:24}}>
          <button style={{padding:8, borderRadius:4, background:'#2563eb', color:'#fff', border:'none', fontWeight:'bold', cursor:'pointer'}}>Orders</button>
          <button style={{padding:8, borderRadius:4, background:'#2563eb', color:'#fff', border:'none', fontWeight:'bold', cursor:'pointer'}}>Inventory</button>
          <button style={{padding:8, borderRadius:4, background:'#2563eb', color:'#fff', border:'none', fontWeight:'bold', cursor:'pointer'}}>Analytics</button>
          <button style={{padding:8, borderRadius:4, background:'#2563eb', color:'#fff', border:'none', fontWeight:'bold', cursor:'pointer'}}>Inquiries</button>
          <button style={{padding:8, borderRadius:4, background:'#2563eb', color:'#fff', border:'none', fontWeight:'bold', cursor:'pointer'}}>Reports</button>
        </div>
        <div style={{background:'#f3f4f6', borderRadius:8, padding:24, textAlign:'center', color:'#888'}}>
          <p>Tab content goes here. (Orders, Inventory, Analytics, Inquiries, Reports)</p>
        </div>
      </div>
    </div>
  );
}
