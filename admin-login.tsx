"use client"

import { useState } from "react"

interface AdminLoginProps {
  onLogin: () => void
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    if (credentials.username === "admin" && credentials.password === "sweettreatcy2025") {
      localStorage.setItem(
        "sweettreatcy-admin-auth",
        JSON.stringify({ username: credentials.username, timestamp: Date.now() })
      );
      onLogin();
    } else {
      setError("Invalid username or password");
    }
    setIsLoading(false);
  };

  const handleChange = (e: any) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f9fafb', padding:16}}>
      <div style={{width:'100%', maxWidth:400, background:'#fff', borderRadius:8, boxShadow:'0 2px 8px #0001', padding:24}}>
        <h2 style={{fontWeight:'bold', fontSize:24, textAlign:'center', marginBottom:8}}>SweetTreatcy Admin</h2>
        <p style={{color:'#888', textAlign:'center', marginBottom:24}}>Sign in to access the dashboard</p>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:16}}>
            <label htmlFor="username" style={{display:'block', marginBottom:4}}>Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Enter username"
              required
              style={{width:'100%', padding:8, borderRadius:4, border:'1px solid #ccc'}}
            />
          </div>
          <div style={{marginBottom:16}}>
            <label htmlFor="password" style={{display:'block', marginBottom:4}}>Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              style={{width:'100%', padding:8, borderRadius:4, border:'1px solid #ccc'}}
            />
          </div>
          {error && (
            <div style={{color:'#dc2626', background:'#fee2e2', borderRadius:4, padding:8, marginBottom:12, textAlign:'center'}}>{error}</div>
          )}
          <button type="submit" style={{width:'100%', padding:10, borderRadius:4, background:'#2563eb', color:'#fff', fontWeight:'bold', border:'none'}} disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div style={{marginTop:24, background:'#f3f4f6', borderRadius:4, padding:12, textAlign:'center', fontSize:14}}>
          Demo credentials:<br />
          Username: <strong>admin</strong><br />
          Password: <strong>sweettreatcy2025</strong>
        </div>
      </div>
    </div>
  );
}
