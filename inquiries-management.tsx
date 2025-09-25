"use client"

import { useState, useEffect } from "react"
// Removed custom UI components, using basic HTML and inline styles
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
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'24px'}}>
        <div style={{border:'1px solid #eee', borderRadius:8, padding:16, background:'#fff'}}>
          <div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingBottom:8}}>
            <span style={{fontWeight:'bold', fontSize:14}}>Total Inquiries</span>
          </div>
          <div>
            <div style={{fontWeight:'bold', fontSize:24}}>{inquiries.length}</div>
            <p style={{fontSize:12, color:'#888'}}>All time</p>
          </div>
        </div>
        <div style={{border:'1px solid #eee', borderRadius:8, padding:16, background:'#fff'}}>
          <div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingBottom:8}}>
            <span style={{fontWeight:'bold', fontSize:14}}>New Inquiries</span>
          </div>
          <div>
            <div style={{fontWeight:'bold', fontSize:24, color:'#2563eb'}}>{newInquiries.length}</div>
            <p style={{fontSize:12, color:'#888'}}>Need attention</p>
          </div>
        </div>
        <div style={{border:'1px solid #eee', borderRadius:8, padding:16, background:'#fff'}}>
          <div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingBottom:8}}>
            <span style={{fontWeight:'bold', fontSize:14}}>Replied</span>
          </div>
          <div>
            <div style={{fontWeight:'bold', fontSize:24, color:'#16a34a'}}>{repliedInquiries.length}</div>
            <p style={{fontSize:12, color:'#888'}}>Awaiting response</p>
          </div>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px'}}>
        {/* Inquiries List */}
        <div style={{border:'1px solid #eee', borderRadius:8, padding:16, background:'#fff'}}>
          <div style={{fontWeight:'bold', fontSize:16, marginBottom:8}}>Customer Inquiries ({inquiries.length})</div>
          <div style={{maxHeight:384, overflowY:'auto'}}>
            {inquiries.length === 0 ? (
              <div style={{textAlign:'center', padding:'32px 0'}}>
                <p style={{color:'#888'}}>No inquiries yet</p>
                <p style={{fontSize:14, color:'#888'}}>Customer messages will appear here</p>
              </div>
            ) : (
              inquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  style={{padding:16, border:'1px solid #eee', borderRadius:8, cursor:'pointer', marginBottom:12, background:selectedInquiry?.id === inquiry.id ? '#e0e7ff' : '#fff'}}
                  onClick={() => setSelectedInquiry(inquiry)}
                >
                  <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8}}>
                    <span style={{fontWeight:'bold'}}>{inquiry.name}</span>
                    <span style={{marginLeft:8, padding:'2px 8px', border:'1px solid #ccc', borderRadius:12, fontSize:12}}>{inquiry.status}</span>
                  </div>
                  <p style={{fontSize:14, color:'#888', marginBottom:8}}>{inquiry.message}</p>
                  <div style={{fontSize:12, color:'#888'}}>{new Date(inquiry.date).toLocaleDateString()}</div>
                </div>
              ))
            )}
          </div>
        </div>
        {/* Inquiry Details */}
        <div style={{border:'1px solid #eee', borderRadius:8, padding:16, background:'#fff'}}>
          <div style={{fontWeight:'bold', fontSize:16, marginBottom:8}}>Inquiry Details</div>
          {selectedInquiry ? (
            <div>
              {/* Customer Info */}
              <div style={{marginBottom:24}}>
                <h3 style={{fontWeight:'bold', marginBottom:12}}>Customer Information</h3>
                <div style={{fontSize:14}}>
                  <p><strong>Name:</strong> {selectedInquiry.name}</p>
                  <p><strong>Email:</strong> {selectedInquiry.email}</p>
                  {selectedInquiry.phone && <p><strong>Phone:</strong> {selectedInquiry.phone}</p>}
                  <p><strong>Date:</strong> {new Date(selectedInquiry.date).toLocaleDateString()}</p>
                </div>
              </div>
              {/* Message */}
              <div style={{marginBottom:24}}>
                <h3 style={{fontWeight:'bold', marginBottom:8}}>Message</h3>
                <div style={{background:'#f3f4f6', borderRadius:8, padding:12}}>
                  <p style={{fontSize:14}}>{selectedInquiry.message}</p>
                </div>
              </div>
              {/* Previous Reply */}
              {selectedInquiry.reply && (
                <div style={{marginBottom:24}}>
                  <h3 style={{fontWeight:'bold', marginBottom:8}}>Your Reply</h3>
                  <div style={{background:'#e0fbe0', border:'1px solid #bbf7d0', borderRadius:8, padding:12}}>
                    <p style={{fontSize:14}}>{selectedInquiry.reply}</p>
                  </div>
                </div>
              )}
              {/* Status Update */}
              <div style={{marginBottom:24}}>
                <h3 style={{fontWeight:'bold', marginBottom:8}}>Status</h3>
                <select
                  style={{width:'100%', padding:8, borderRadius:4, border:'1px solid #ccc', marginTop:8}}
                  value={selectedInquiry.status}
                  onChange={e => updateInquiryStatus(selectedInquiry.id, e.target.value as Inquiry["status"])}
                >
                  <option value="new">New</option>
                  <option value="replied">Replied</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              {/* Reply Section */}
              <div>
                <h3 style={{fontWeight:'bold', marginBottom:8}}>Send Reply</h3>
                <textarea
                  style={{width:'100%', minHeight:80, padding:8, borderRadius:4, border:'1px solid #ccc'}}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  rows={4}
                />
                <button
                  style={{marginTop:8, width:'100%', padding:8, background:'#16a34a', color:'#fff', border:'none', borderRadius:4, fontWeight:'bold'}}
                  onClick={handleReply}
                  disabled={!replyText.trim()}
                >
                  Send Reply
                </button>
              </div>
            </div>
          ) : (
            <p style={{color:'#888', textAlign:'center', padding:'32px 0'}}>Select an inquiry to view details</p>
          )}
        </div>
      </div>
    </div>
  )
}
