"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Mail, Phone, Calendar, Reply } from "lucide-react"

interface Inquiry {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  status: "new" | "replied" | "resolved"
  date: Date
  reply?: string
}

export function InquiriesManagement() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [replyText, setReplyText] = useState("")

  useEffect(() => {
    // Load inquiries from localStorage
    const savedInquiries = JSON.parse(localStorage.getItem("sweettreatcy-inquiries") || "[]")
    setInquiries(savedInquiries)
  }, [])

  const updateInquiryStatus = (inquiryId: string, status: Inquiry["status"], reply?: string) => {
    const updatedInquiries = inquiries.map((inquiry) =>
      inquiry.id === inquiryId ? { ...inquiry, status, reply } : inquiry,
    )
    setInquiries(updatedInquiries)
    localStorage.setItem("sweettreatcy-inquiries", JSON.stringify(updatedInquiries))

    if (selectedInquiry?.id === inquiryId) {
      setSelectedInquiry({ ...selectedInquiry, status, reply })
    }
  }

  const handleReply = () => {
    if (selectedInquiry && replyText.trim()) {
      updateInquiryStatus(selectedInquiry.id, "replied", replyText)
      setReplyText("")
    }
  }

  const getStatusColor = (status: Inquiry["status"]) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "replied":
        return "bg-green-100 text-green-800"
      case "resolved":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const newInquiries = inquiries.filter((i) => i.status === "new")
  const repliedInquiries = inquiries.filter((i) => i.status === "replied")

  return (
    <div className="space-y-6">
      {/* Inquiries Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inquiries.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Inquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{newInquiries.length}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Replied</CardTitle>
            <Reply className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{repliedInquiries.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inquiries List */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Inquiries ({inquiries.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {inquiries.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No inquiries yet</p>
                  <p className="text-sm text-muted-foreground">Customer messages will appear here</p>
                </div>
              ) : (
                inquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedInquiry?.id === inquiry.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedInquiry(inquiry)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{inquiry.name}</span>
                      <Badge className={getStatusColor(inquiry.status)}>{inquiry.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{inquiry.message}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(inquiry.date).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Inquiry Details */}
        <Card>
          <CardHeader>
            <CardTitle>Inquiry Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedInquiry ? (
              <div className="space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="font-semibold mb-3">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Name:</strong> {selectedInquiry.name}
                    </p>
                    <p className="flex items-center">
                      <Mail className="h-3 w-3 mr-2" />
                      {selectedInquiry.email}
                    </p>
                    {selectedInquiry.phone && (
                      <p className="flex items-center">
                        <Phone className="h-3 w-3 mr-2" />
                        {selectedInquiry.phone}
                      </p>
                    )}
                    <p className="flex items-center">
                      <Calendar className="h-3 w-3 mr-2" />
                      {new Date(selectedInquiry.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <h3 className="font-semibold mb-2">Message</h3>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm">{selectedInquiry.message}</p>
                  </div>
                </div>

                {/* Previous Reply */}
                {selectedInquiry.reply && (
                  <div>
                    <h3 className="font-semibold mb-2">Your Reply</h3>
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <p className="text-sm">{selectedInquiry.reply}</p>
                    </div>
                  </div>
                )}

                {/* Status Update */}
                <div>
                  <h3 className="font-semibold mb-3">Status</h3>
                  <Select
                    value={selectedInquiry.status}
                    onValueChange={(value) => updateInquiryStatus(selectedInquiry.id, value as Inquiry["status"])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="replied">Replied</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Reply Section */}
                <div>
                  <h3 className="font-semibold mb-3">Send Reply</h3>
                  <div className="space-y-3">
                    <Textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply here..."
                      rows={4}
                    />
                    <Button onClick={handleReply} disabled={!replyText.trim()}>
                      <Reply className="h-4 w-4 mr-2" />
                      Send Reply
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">Select an inquiry to view details</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
