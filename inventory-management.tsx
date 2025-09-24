"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Package, Plus, Minus, AlertTriangle, Edit, Save, X, PackagePlus } from "lucide-react"
import { InventoryManager } from "@/lib/inventory-utils"
import { InventoryReports } from "./inventory-reports"
import type { Product } from "@/lib/types"

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
      InventoryManager.adjustStock(
        productId,
        products.find((p) => p.id === productId)!.stockCount + change,
        "Manual adjustment",
      )
    }
  }

  const handleRestock = () => {
    if (restockDialog.productId && restockData.quantity) {
      const quantity = Number.parseInt(restockData.quantity)
      if (quantity > 0) {
        InventoryManager.restockProduct(restockDialog.productId, quantity, restockData.reason || "Manual restock")

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
    <Tabs defaultValue="inventory" className="space-y-6">
      <TabsList>
        <TabsTrigger value="inventory">Inventory Management</TabsTrigger>
        <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
      </TabsList>

      <TabsContent value="inventory" className="space-y-6">
        {/* Inventory Alerts */}
        {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
          <div className="space-y-4">
            {outOfStockProducts.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Out of Stock:</strong> {outOfStockProducts.map((p) => p.name).join(", ")}
                </AlertDescription>
              </Alert>
            )}
            {lowStockProducts.length > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Low Stock Alert:</strong>{" "}
                  {lowStockProducts.map((p) => `${p.name} (${p.stockCount})`).join(", ")}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Inventory Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">Active products</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{lowStockProducts.length}</div>
              <p className="text-xs text-muted-foreground">Items need restocking</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{outOfStockProducts.length}</div>
              <p className="text-xs text-muted-foreground">Items unavailable</p>
            </CardContent>
          </Card>
        </div>

        {/* Products List */}
        <Card>
          <CardHeader>
            <CardTitle>Product Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />

                  <div className="flex-1">
                    {editingProduct === product.id ? (
                      <div className="space-y-2">
                        <Input
                          value={editValues.name || ""}
                          onChange={(e) => setEditValues((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="Product name"
                        />
                        <Input
                          type="number"
                          value={editValues.priceValue || ""}
                          onChange={(e) => setEditValues((prev) => ({ ...prev, priceValue: Number(e.target.value) }))}
                          placeholder="Price"
                        />
                        <Input
                          value={editValues.description || ""}
                          onChange={(e) => setEditValues((prev) => ({ ...prev, description: e.target.value }))}
                          placeholder="Description"
                        />
                      </div>
                    ) : (
                      <>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{product.category}</Badge>
                          <span className="text-sm font-medium">{product.price}</span>
                          {product.isPopular && <Badge variant="secondary">Popular</Badge>}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Stock Management */}
                    <div className="flex items-center space-x-2">
                      {editingProduct === product.id ? (
                        <Input
                          type="number"
                          value={editValues.stockCount || ""}
                          onChange={(e) => setEditValues((prev) => ({ ...prev, stockCount: Number(e.target.value) }))}
                          className="w-20"
                          min="0"
                        />
                      ) : (
                        <>
                          <Button variant="outline" size="sm" onClick={() => updateStock(product.id, -1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-12 text-center font-medium">{product.stockCount}</span>
                          <Button variant="outline" size="sm" onClick={() => updateStock(product.id, 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>

                    {/* Stock Status */}
                    <div className="w-20">
                      {product.inStock ? (
                        <Badge variant={product.stockCount <= 5 ? "destructive" : "secondary"}>
                          {product.stockCount <= 5 ? "Low" : "In Stock"}
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Out</Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Dialog
                        open={restockDialog.open && restockDialog.productId === product.id}
                        onOpenChange={(open) => setRestockDialog({ open, productId: open ? product.id : null })}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <PackagePlus className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Restock {product.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="quantity">Quantity to Add</Label>
                              <Input
                                id="quantity"
                                type="number"
                                value={restockData.quantity}
                                onChange={(e) => setRestockData((prev) => ({ ...prev, quantity: e.target.value }))}
                                placeholder="Enter quantity"
                                min="1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="reason">Reason (Optional)</Label>
                              <Textarea
                                id="reason"
                                value={restockData.reason}
                                onChange={(e) => setRestockData((prev) => ({ ...prev, reason: e.target.value }))}
                                placeholder="Reason for restocking..."
                                rows={3}
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                onClick={() => setRestockDialog({ open: false, productId: null })}
                              >
                                Cancel
                              </Button>
                              <Button onClick={handleRestock}>Add Stock</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {editingProduct === product.id ? (
                        <>
                          <Button variant="outline" size="sm" onClick={saveEdit}>
                            <Save className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={cancelEdit}>
                            <X className="h-3 w-3" />
                          </Button>
                        </>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => startEditing(product)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="reports">
        <InventoryReports />
      </TabsContent>
    </Tabs>
  )
}
