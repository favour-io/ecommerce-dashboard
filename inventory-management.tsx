"use client"

import { useState, useEffect } from "react"
// Removed custom UI components, using basic HTML and inline styles
import { Package, Plus, Minus, AlertTriangle, Edit, Save, X, PackagePlus } from "lucide-react"
// Removed missing utility/type imports

type Product = {
  id: number;
  name: string;
  price: string;
  priceValue: number;
  image: string;
  category: string;
  description: string;
  isPopular: boolean;
  inStock: boolean;
  stockCount: number;
};

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Artisan Sourdough Bread",
    price: "₺25",
    priceValue: 25,
    image: "/artisan-sourdough-bread-golden-crust.jpg",
    category: "Breads",
    description: "Traditional sourdough with a perfect crust and soft interior",
    isPopular: true,
    inStock: true,
    stockCount: 10,
  },
  {
    id: 2,
    name: "Chocolate Croissants",
    price: "₺15",
    priceValue: 15,
    image: "/chocolate-croissants-pastry-golden-flaky.jpg",
    category: "Pastries",
    description: "Buttery, flaky croissants filled with rich dark chocolate",
    isPopular: false,
    inStock: true,
    stockCount: 8,
  },
  {
    id: 3,
    name: "Custom Birthday Cake",
    price: "₺150",
    priceValue: 150,
    image: "/elegant-birthday-cake-colorful-decorations.jpg",
    category: "Cakes",
    description: "Personalized cakes for your special celebrations",
    isPopular: true,
    inStock: true,
    stockCount: 3,
  },
  {
    id: 4,
    name: "Turkish Baklava",
    price: "₺35",
    priceValue: 35,
    image: "/turkish-baklava-honey-nuts-golden-layers.jpg",
    category: "Desserts",
    description: "Traditional baklava with pistachios and honey",
    isPopular: false,
    inStock: true,
    stockCount: 12,
  },
  {
    id: 5,
    name: "Fresh Fruit Tarts",
    price: "₺20",
    priceValue: 20,
    image: "/fresh-fruit-tarts-colorful-berries-cream.jpg",
    category: "Tarts",
    description: "Seasonal fruit tarts with vanilla custard",
    isPopular: true,
    inStock: true,
    stockCount: 6,
  },
  {
    id: 6,
    name: "Cinnamon Rolls",
    price: "₺12",
    priceValue: 12,
    image: "/cinnamon-rolls-glazed-sweet-pastry.jpg",
    category: "Pastries",
    description: "Warm, gooey cinnamon rolls with cream cheese glaze",
    isPopular: false,
    inStock: true,
    stockCount: 15,
  },
]

export function InventoryManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<number | null>(null)
  const [editValues, setEditValues] = useState<Partial<Product>>({})
  const [restockDialog, setRestockDialog] = useState<{ open: boolean; productId: number | null }>({
    open: false,
    productId: null,
  })
  const [restockData, setRestockData] = useState({ quantity: "", reason: "" })

  useEffect(() => {
    // Load inventory from localStorage or use initial data
    const savedInventory = localStorage.getItem("sweettreatcy-inventory")
    if (savedInventory) {
      setProducts(JSON.parse(savedInventory))
    } else {
      setProducts(initialProducts)
      localStorage.setItem("sweettreatcy-inventory", JSON.stringify(initialProducts))
    }
  }, [])

  const updateStock = (productId: number, change: number) => {
    const updatedProducts = products.map((product) => {
      if (product.id === productId) {
        const newStock = Math.max(0, product.stockCount + change)
        return {
          ...product,
          stockCount: newStock,
          inStock: newStock > 0,
        }
      }
      return product
    })
    setProducts(updatedProducts)
    localStorage.setItem("sweettreatcy-inventory", JSON.stringify(updatedProducts))

    // Record transaction
    if (change !== 0) {
      // Removed InventoryManager.adjustStock (no external manager available)
    }
  }

  const handleRestock = () => {
    if (restockDialog.productId && restockData.quantity) {
      const quantity = Number.parseInt(restockData.quantity)
      if (quantity > 0) {
  // Removed InventoryManager.restockProduct (no external manager available)

        // Update local state
        const updatedProducts = products.map((product) => {
          if (product.id === restockDialog.productId) {
            const newStock = product.stockCount + quantity
            return {
              ...product,
              stockCount: newStock,
              inStock: newStock > 0,
            }
          }
          return product
        })
        setProducts(updatedProducts)
        localStorage.setItem("sweettreatcy-inventory", JSON.stringify(updatedProducts))
      }
    }

    setRestockDialog({ open: false, productId: null })
    setRestockData({ quantity: "", reason: "" })
  }

  const startEditing = (product: Product) => {
    setEditingProduct(product.id)
    setEditValues({
      name: product.name,
      priceValue: product.priceValue,
      stockCount: product.stockCount,
      description: product.description,
    })
  }

  const saveEdit = () => {
    if (editingProduct && editValues) {
      const updatedProducts = products.map((product) => {
        if (product.id === editingProduct) {
          return {
            ...product,
            name: editValues.name || product.name,
            priceValue: editValues.priceValue || product.priceValue,
            price: `₺${editValues.priceValue || product.priceValue}`,
            stockCount: editValues.stockCount || product.stockCount,
            description: editValues.description || product.description,
            inStock: (editValues.stockCount || product.stockCount) > 0,
          }
        }
        return product
      })
      setProducts(updatedProducts)
      localStorage.setItem("sweettreatcy-inventory", JSON.stringify(updatedProducts))
      setEditingProduct(null)
      setEditValues({})
    }
  }

  const cancelEdit = () => {
    setEditingProduct(null)
    setEditValues({})
  }

  const lowStockProducts = products.filter((product) => product.stockCount <= 5 && product.inStock)
  const outOfStockProducts = products.filter((product) => !product.inStock)

  return (
    <div style={{padding:'24px'}}>
      <h2 style={{fontWeight:'bold', fontSize:24, marginBottom:24}}>Inventory Management</h2>
      {/* Inventory Alerts */}
      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <div style={{marginBottom:24}}>
          {outOfStockProducts.length > 0 && (
            <div style={{background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:8, padding:12, marginBottom:8}}>
              <strong>Out of Stock:</strong> {outOfStockProducts.map((p) => p.name).join(", ")}
            </div>
          )}
          {lowStockProducts.length > 0 && (
            <div style={{background:'#fef9c3', border:'1px solid #fde68a', borderRadius:8, padding:12}}>
              <strong>Low Stock Alert:</strong> {lowStockProducts.map((p) => `${p.name} (${p.stockCount})`).join(", ")}
            </div>
          )}
        </div>
      )}
      {/* Inventory Overview */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'24px', marginBottom:24}}>
        <div style={{border:'1px solid #eee', borderRadius:8, padding:16, background:'#fff'}}>
          <div style={{fontWeight:'bold', fontSize:14, marginBottom:8}}>Total Products</div>
          <div style={{fontWeight:'bold', fontSize:24}}>{products.length}</div>
          <p style={{fontSize:12, color:'#888'}}>Active products</p>
        </div>
        <div style={{border:'1px solid #eee', borderRadius:8, padding:16, background:'#fff'}}>
          <div style={{fontWeight:'bold', fontSize:14, marginBottom:8}}>Low Stock</div>
          <div style={{fontWeight:'bold', fontSize:24, color:'#ea580c'}}>{lowStockProducts.length}</div>
          <p style={{fontSize:12, color:'#888'}}>Items need restocking</p>
        </div>
        <div style={{border:'1px solid #eee', borderRadius:8, padding:16, background:'#fff'}}>
          <div style={{fontWeight:'bold', fontSize:14, marginBottom:8}}>Out of Stock</div>
          <div style={{fontWeight:'bold', fontSize:24, color:'#dc2626'}}>{outOfStockProducts.length}</div>
          <p style={{fontSize:12, color:'#888'}}>Items unavailable</p>
        </div>
      </div>
      {/* Products List */}
      <div style={{border:'1px solid #eee', borderRadius:8, padding:16, background:'#fff'}}>
        <div style={{fontWeight:'bold', fontSize:16, marginBottom:16}}>Product Inventory</div>
        <div>
          {products.map((product) => (
            <div key={product.id} style={{display:'flex', alignItems:'center', gap:16, padding:16, border:'1px solid #eee', borderRadius:8, marginBottom:12}}>
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                style={{width:64, height:64, objectFit:'cover', borderRadius:8}}
              />
              <div style={{flex:1}}>
                {editingProduct === product.id ? (
                  <div>
                    <input
                      style={{width:'100%', marginBottom:8, padding:8, borderRadius:4, border:'1px solid #ccc'}}
                      value={editValues.name || ""}
                      onChange={e => setEditValues((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Product name"
                    />
                    <input
                      style={{width:'100%', marginBottom:8, padding:8, borderRadius:4, border:'1px solid #ccc'}}
                      type="number"
                      value={editValues.priceValue || ""}
                      onChange={e => setEditValues((prev) => ({ ...prev, priceValue: Number(e.target.value) }))}
                      placeholder="Price"
                    />
                    <input
                      style={{width:'100%', marginBottom:8, padding:8, borderRadius:4, border:'1px solid #ccc'}}
                      value={editValues.description || ""}
                      onChange={e => setEditValues((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Description"
                    />
                  </div>
                ) : (
                  <>
                    <h3 style={{fontWeight:'bold'}}>{product.name}</h3>
                    <p style={{fontSize:14, color:'#888'}}>{product.description}</p>
                    <div style={{display:'flex', alignItems:'center', gap:8, marginTop:4}}>
                      <span style={{padding:'2px 8px', border:'1px solid #ccc', borderRadius:12, fontSize:12}}>{product.category}</span>
                      <span style={{fontSize:14, fontWeight:'bold'}}>{product.price}</span>
                      {product.isPopular && <span style={{padding:'2px 8px', border:'1px solid #facc15', borderRadius:12, fontSize:12, background:'#fef9c3'}}>Popular</span>}
                    </div>
                  </>
                )}
              </div>
              <div style={{display:'flex', alignItems:'center', gap:8}}>
                {/* Stock Management */}
                {editingProduct === product.id ? (
                  <input
                    style={{width:60, padding:8, borderRadius:4, border:'1px solid #ccc'}}
                    type="number"
                    value={editValues.stockCount || ""}
                    onChange={e => setEditValues((prev) => ({ ...prev, stockCount: Number(e.target.value) }))}
                    min="0"
                  />
                ) : (
                  <>
                    <button
                      style={{padding:4, border:'1px solid #ccc', borderRadius:4, background:'#fff', cursor:'pointer'}}
                      onClick={() => updateStock(product.id, -1)}
                    >
                      -
                    </button>
                    <span style={{width:48, textAlign:'center', fontWeight:'bold'}}>{product.stockCount}</span>
                    <button
                      style={{padding:4, border:'1px solid #ccc', borderRadius:4, background:'#fff', cursor:'pointer'}}
                      onClick={() => updateStock(product.id, 1)}
                    >
                      +
                    </button>
                  </>
                )}
                {/* Stock Status */}
                <span style={{width:60, padding:'2px 8px', border:'1px solid #ccc', borderRadius:12, fontSize:12, background:product.inStock ? (product.stockCount <= 5 ? '#fee2e2' : '#d1fae5') : '#fee2e2', color:product.inStock ? (product.stockCount <= 5 ? '#dc2626' : '#16a34a') : '#dc2626'}}>
                  {product.inStock ? (product.stockCount <= 5 ? 'Low' : 'In Stock') : 'Out'}
                </span>
                {/* Actions */}
                {editingProduct === product.id ? (
                  <>
                    <button
                      style={{padding:4, border:'1px solid #ccc', borderRadius:4, background:'#fff', cursor:'pointer'}}
                      onClick={saveEdit}
                    >
                      Save
                    </button>
                    <button
                      style={{padding:4, border:'1px solid #ccc', borderRadius:4, background:'#fff', cursor:'pointer'}}
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    style={{padding:4, border:'1px solid #ccc', borderRadius:4, background:'#fff', cursor:'pointer'}}
                    onClick={() => startEditing(product)}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  // End of InventoryManagement component
  )
}
