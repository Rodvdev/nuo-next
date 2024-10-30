'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, X } from 'lucide-react'

export function SupportChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')

  const toggleChat = () => setIsOpen(!isOpen)

  const sendMessage = () => {
    // Here you would typically send the message to your support system
    console.log('Sending message:', message)
    setMessage('')
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg p-4 w-80">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Support Chat</h3>
            <Button variant="ghost" size="sm" onClick={toggleChat}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-60 overflow-y-auto mb-4 border rounded p-2">
            {/* Chat messages would be displayed here */}
          </div>
          <div className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </div>
      ) : (
        <Button onClick={toggleChat}>
          <MessageCircle className="h-4 w-4 mr-2" />
          Support
        </Button>
      )}
    </div>
  )
}