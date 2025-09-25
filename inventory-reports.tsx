"use client"

import { useState, useEffect } from "react"


export function InventoryReports() {
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate report data
    setTimeout(() => {
      setReport({
        totalProducts: 12,
        lowStockCount: 2,
        outOfStockCount: 1,
        totalValue: 1234.56,
        topSellingProducts: [
          { productId: 1, name: 'Bread', quantitySold: 50, revenue: 500 },
          { productId: 2, name: 'Cake', quantitySold: 30, revenue: 900 },
        ],
        recentTransactions: [
          { id: 1, type: 'sale', productId: 1, quantity: -2, previousStock: 10, newStock: 8, timestamp: Date.now(), reason: 'Sold' },
          { id: 2, type: 'restock', productId: 2, quantity: 5, previousStock: 0, newStock: 5, timestamp: Date.now(), reason: 'Restocked' },
        ],
      });
      setLoading(false);
    }, 500);
  }, []);

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case "sale":
        return { background:'#fee2e2', color:'#dc2626' };
      case "restock":
        return { background:'#d1fae5', color:'#16a34a' };
      case "adjustment":
        return { background:'#dbeafe', color:'#2563eb' };
      default:
        return { background:'#f3f4f6', color:'#888' };
    }
  };

  const exportReport = () => {
    if (!report) return;
    const reportData = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalProducts: report.totalProducts,
        lowStockCount: report.lowStockCount,
        outOfStockCount: report.outOfStockCount,
        totalValue: report.totalValue,
      },
      topSellingProducts: report.topSellingProducts,
      recentTransactions: report.recentTransactions,
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inventory-report-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div style={{display:'flex', alignItems:'center', justifyContent:'center', padding:'32px 0'}}>
        <div style={{width:32, height:32, border:'4px solid #2563eb', borderRadius:'50%', borderTop:'4px solid #fff', animation:'spin 1s linear infinite'}}></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div style={{textAlign:'center', padding:'32px 0', color:'#888'}}>Unable to generate inventory report</div>
    );
  }

  return (
    <div style={{padding:'24px'}}>
      {/* Report Header */}
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24}}>
        <div>
          <h2 style={{fontWeight:'bold', fontSize:24}}>Inventory Report</h2>
          <p style={{color:'#888'}}>Generated on {new Date().toLocaleDateString()}</p>
        </div>
        <button onClick={exportReport} style={{padding:8, borderRadius:4, background:'#fff', border:'1px solid #ccc', fontWeight:'bold', cursor:'pointer'}}>Export Report</button>
      </div>
      {/* Summary Cards */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:'24px', marginBottom:32}}>
        <div style={{border:'1px solid #eee', borderRadius:8, padding:16, background:'#fff'}}>
          <div style={{fontWeight:'bold', fontSize:14, marginBottom:8}}>Total Products</div>
          <div style={{fontWeight:'bold', fontSize:24}}>{report.totalProducts}</div>
          <p style={{fontSize:12, color:'#888'}}>Active products</p>
        </div>
        <div style={{border:'1px solid #eee', borderRadius:8, padding:16, background:'#fff'}}>
          <div style={{fontWeight:'bold', fontSize:14, marginBottom:8}}>Inventory Value</div>
          <div style={{fontWeight:'bold', fontSize:24}}>&#8378;{report.totalValue.toFixed(2)}</div>
          <p style={{fontSize:12, color:'#888'}}>Total stock value</p>
        </div>
        <div style={{border:'1px solid #eee', borderRadius:8, padding:16, background:'#fff'}}>
          <div style={{fontWeight:'bold', fontSize:14, marginBottom:8}}>Low Stock</div>
          <div style={{fontWeight:'bold', fontSize:24, color:'#ea580c'}}>{report.lowStockCount}</div>
          <p style={{fontSize:12, color:'#888'}}>Need restocking</p>
        </div>
        <div style={{border:'1px solid #eee', borderRadius:8, padding:16, background:'#fff'}}>
          <div style={{fontWeight:'bold', fontSize:14, marginBottom:8}}>Out of Stock</div>
          <div style={{fontWeight:'bold', fontSize:24, color:'#dc2626'}}>{report.outOfStockCount}</div>
          <p style={{fontSize:12, color:'#888'}}>Unavailable</p>
        </div>
      </div>
      {/* Top Selling Products */}
      <div style={{marginBottom:32}}>
        <h3 style={{fontWeight:'bold', fontSize:18, marginBottom:12}}>Top Selling Products</h3>
        <ul>
          {report.topSellingProducts.map((product: any, index: number) => (
            <li key={product.productId} style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
              <span style={{fontWeight:'bold'}}>#{index + 1} {product.name}</span>
              <span>{product.quantitySold} units sold</span>
              <span>&#8378;{product.revenue.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
      {/* Recent Transactions */}
      <div style={{marginBottom:32}}>
        <h3 style={{fontWeight:'bold', fontSize:18, marginBottom:12}}>Recent Transactions</h3>
        <ul>
          {report.recentTransactions.length === 0 ? (
            <li style={{color:'#888', textAlign:'center'}}>No transactions yet</li>
          ) : (
            report.recentTransactions.map((transaction: any) => (
              <li key={transaction.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12, border:'1px solid #eee', borderRadius:8, padding:12}}>
                <span style={{...getTransactionTypeColor(transaction.type), padding:'2px 8px', borderRadius:12, fontSize:12}}>{transaction.type}</span>
                <span>Product ID: {transaction.productId}</span>
                <span>{transaction.quantity > 0 ? '+' : ''}{transaction.quantity}</span>
                <span>{transaction.previousStock} → {transaction.newStock}</span>
                <span>{new Date(transaction.timestamp).toLocaleDateString()}</span>
                {transaction.reason && <span style={{color:'#888'}}>{transaction.reason}</span>}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
