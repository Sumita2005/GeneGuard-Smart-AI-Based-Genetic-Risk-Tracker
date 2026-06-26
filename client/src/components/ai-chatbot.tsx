import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("currentUserId");
    if (userId) {
      setCurrentUserId(parseInt(userId));
    }
  }, []);

  const { data: chatMessages = [] } = useQuery({
    queryKey: ["/api/users", currentUserId, "chat-messages"],
    enabled: !!currentUserId && isOpen,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      const response = await apiRequest("POST", `/api/users/${currentUserId}/chat`, {
        message: messageText,
      });
      return response.json();
    },
    onSuccess: () => {
      setMessage("");
      // Scroll to bottom after message is sent
      setTimeout(() => {
        const messagesContainer = document.getElementById('chat-messages');
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      }, 100);
    },
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (sendMessageMutation.isSuccess) {
      queryClient.invalidateQueries({ 
        queryKey: ["/api/users", currentUserId, "chat-messages"] 
      });
    }
  }, [sendMessageMutation.isSuccess, queryClient, currentUserId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentUserId) return;
    sendMessageMutation.mutate(message);
  };

  const handlePresetQuestion = (question: string) => {
    if (!currentUserId) return;
    sendMessageMutation.mutate(question);
  };

  const presetQuestions = [
    "What's my diabetes risk?",
    "Lifestyle tips",
    "Screening schedule",
    "Family history impact"
  ];

  if (!currentUserId) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg transition-colors ${
          isOpen ? 'bg-slate-600 hover:bg-slate-700' : 'bg-health-primary hover:bg-emerald-600'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="absolute bottom-16 right-0 w-80 shadow-2xl border border-slate-200">
          <CardHeader className="bg-health-primary text-white p-4 rounded-t-xl">
            <CardTitle className="flex items-center space-x-3 text-sm">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold">AI Health Assistant</h4>
                <p className="text-xs text-emerald-100">Ask me about your health</p>
              </div>
            </CardTitle>
          </CardHeader>

          {/* Chat Messages */}
          <div id="chat-messages" className="h-64 overflow-y-auto p-4 space-y-3">
            {/* Welcome Message */}
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-health-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-3 h-3 text-white" />
              </div>
              <div className="bg-slate-100 rounded-lg px-3 py-2 max-w-xs">
                <p className="text-sm text-slate-700">
                  Hi! I'm your AI health assistant. I can help answer questions about your genetic risks, 
                  lifestyle recommendations, or general health concerns. What would you like to know?
                </p>
              </div>
            </div>

            {/* Quick Action Buttons (show only if no messages yet) */}
            {chatMessages.length === 0 && (
              <div className="flex flex-wrap gap-2 px-8">
                {presetQuestions.map((question) => (
                  <button
                    key={question}
                    onClick={() => handlePresetQuestion(question)}
                    className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full hover:bg-slate-200 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {/* Chat History */}
            {chatMessages.map((chat: any) => (
              <div key={chat.id} className="space-y-2">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-health-primary text-white rounded-lg px-3 py-2 max-w-xs">
                    <p className="text-sm">{chat.message}</p>
                  </div>
                </div>
                
                {/* Bot Response */}
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-health-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-slate-100 rounded-lg px-3 py-2 max-w-xs">
                    <p className="text-sm text-slate-700">{chat.response}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading state */}
            {sendMessageMutation.isPending && (
              <>
                <div className="flex justify-end">
                  <div className="bg-health-primary text-white rounded-lg px-3 py-2 max-w-xs">
                    <p className="text-sm">{message}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-health-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-slate-100 rounded-lg px-3 py-2 max-w-xs">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Chat Input */}
          <CardContent className="p-4 border-t border-slate-200">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about your health..."
                className="flex-1 text-sm"
                disabled={sendMessageMutation.isPending}
              />
              <Button
                type="submit"
                size="sm"
                className="bg-health-primary hover:bg-emerald-600"
                disabled={!message.trim() || sendMessageMutation.isPending}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
