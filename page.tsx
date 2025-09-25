"use client"

import { useState, useEffect } from "react"
// Removed missing AdminLogin and AdminDashboard imports

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

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  return (
    <div style={{minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
      <h2 style={{fontWeight:'bold', fontSize:24, marginBottom:16}}>Admin Dashboard</h2>
      <button
        style={{padding:8, borderRadius:4, background:'#dc2626', color:'#fff', border:'none', fontWeight:'bold'}}
        onClick={onLogout}
      >
        Logout
      </button>
    </div>
  );
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />
  }

  return <AdminDashboard onLogout={() => setIsAuthenticated(false)} />
}
