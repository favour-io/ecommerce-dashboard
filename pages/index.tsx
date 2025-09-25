"use client"


import { useState, useEffect } from "react"
import { AdminDashboard as RealAdminDashboard } from "../admin-dashboard"
import { InventoryManagement } from "../inventory-management"
import { SalesAnalytics } from "../sales-analytics"
import { InquiriesManagement } from "../inquiries-management"
import { InventoryReports } from "../inventory-reports"

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  return (
    <div style={{minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
      <h2 style={{fontWeight:'bold', fontSize:24, marginBottom:16}}>Admin Login</h2>
      <button
        style={{padding:8, borderRadius:4, background:'#2563eb', color:'#fff', border:'none', fontWeight:'bold'}}
        onClick={onLogin}
      >
        Login (Demo)
      </button>
    </div>
  );
}

const TABS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "inventory", label: "Inventory" },
  { key: "analytics", label: "Analytics" },
  { key: "inquiries", label: "Inquiries" },
  { key: "reports", label: "Reports" },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")

  useEffect(() => {
    // Check if admin is already logged in
    const adminAuth = localStorage.getItem("sweettreatcy-admin-auth")
    if (adminAuth) {
      const authData = JSON.parse(adminAuth)
      // Check if token is still valid (24 hours)
      const isValid = Date.now() - authData.timestamp < 24 * 60 * 60 * 1000
      setIsAuthenticated(isValid)
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
        <div style={{width:32, height:32, border:'4px solid #2563eb', borderRadius:'50%', borderTop:'4px solid #fff', animation:'spin 1s linear infinite'}}></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />
  }

  // Main dashboard with tabs
  return (
    <div style={{minHeight:'100vh', background:'#f9fafb'}}>
      {/* Header */}
      <div style={{borderBottom:'1px solid #eee', background:'#fff', padding:'16px 0', marginBottom:24}}>
        <div style={{maxWidth:1200, margin:'0 auto', padding:'0 16px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div>
            <h1 style={{fontWeight:'bold', fontSize:24}}>SweetTreatcy Admin</h1>
            <p style={{color:'#888'}}>Manage your bakery business</p>
          </div>
          <button style={{padding:8, borderRadius:4, background:'#fff', border:'1px solid #ccc', fontWeight:'bold', cursor:'pointer'}} onClick={() => setIsAuthenticated(false)}>Logout</button>
        </div>
      </div>
      <div style={{maxWidth:1200, margin:'0 auto', padding:'0 16px 32px 16px'}}>
        {/* Tabs */}
        <div style={{display:'flex', gap:16, marginBottom:24}}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              style={{
                padding:8,
                borderRadius:4,
                background: activeTab === tab.key ? '#2563eb' : '#fff',
                color: activeTab === tab.key ? '#fff' : '#2563eb',
                border:'1px solid #2563eb',
                fontWeight:'bold',
                cursor:'pointer',
                minWidth:100
              }}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* Tab Content */}
        <div style={{background:'#f3f4f6', borderRadius:8, padding:24, minHeight:400}}>
          {activeTab === "dashboard" && <RealAdminDashboard onLogout={() => setIsAuthenticated(false)} />}
          {activeTab === "inventory" && <InventoryManagement />}
          {activeTab === "analytics" && <SalesAnalytics orders={JSON.parse(localStorage.getItem("sweettreatcy-orders") || "[]")} />}
          {activeTab === "inquiries" && <InquiriesManagement />}
          {activeTab === "reports" && <InventoryReports />}
        </div>
      </div>
    </div>
  )
}
