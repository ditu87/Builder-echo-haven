import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/AuthContext";
import { supabase, Message, User } from "@/lib/supabase";
import {
  MessageSquare,
  Send,
  Phone,
  MoreVertical,
  Image as ImageIcon,
  Paperclip,
  Search,
} from "lucide-react";

interface Conversation {
  id: string;
  otherUser: User;
  lastMessage?: Message;
  unreadCount: number;
  productTitle?: string;
}

const Messages: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!user) return;

    fetchConversations();

    // Set up real-time subscription for messages
    const subscription = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${user.id}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);
          // Update conversation list
          fetchConversations();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      // Get all messages where user is sender or receiver
      const { data: messagesData } = await supabase
        .from("messages")
        .select(
          `
          *,
          sender:users!messages_sender_id_fkey(*),
          receiver:users!messages_receiver_id_fkey(*),
          product:products(*)
        `,
        )
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (!messagesData) return;

      // Group messages by conversation (other user)
      const conversationMap = new Map<string, Conversation>();

      messagesData.forEach((message: any) => {
        const otherUserId =
          message.sender_id === user.id
            ? message.receiver_id
            : message.sender_id;
        const otherUser =
          message.sender_id === user.id ? message.receiver : message.sender;

        if (!conversationMap.has(otherUserId)) {
          conversationMap.set(otherUserId, {
            id: otherUserId,
            otherUser,
            lastMessage: message,
            unreadCount: 0,
            productTitle: message.product?.title,
          });
        } else {
          const conversation = conversationMap.get(otherUserId)!;
          if (
            new Date(message.created_at) >
            new Date(conversation.lastMessage?.created_at || "")
          ) {
            conversation.lastMessage = message;
          }
        }

        // Count unread messages
        if (message.receiver_id === user.id && !message.is_read) {
          const conversation = conversationMap.get(otherUserId)!;
          conversation.unreadCount++;
        }
      });

      const conversationsList = Array.from(conversationMap.values());
      setConversations(conversationsList);

      // Auto-select conversation from URL params
      const productId = searchParams.get("product");
      const userId = searchParams.get("user");
      if (userId && !selectedConversation) {
        const targetConversation = conversationsList.find(
          (c) => c.id === userId,
        );
        if (targetConversation) {
          setSelectedConversation(targetConversation);
          fetchMessages(userId);
        }
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId: string) => {
    if (!user) return;

    try {
      const { data: messagesData } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`,
        )
        .order("created_at", { ascending: true });

      if (messagesData) {
        setMessages(messagesData);
        // Mark messages as read
        await supabase
          .from("messages")
          .update({ is_read: true })
          .eq("sender_id", otherUserId)
          .eq("receiver_id", user.id)
          .eq("is_read", false);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!user || !selectedConversation || !newMessage.trim()) return;

    setSending(true);
    try {
      const { error } = await supabase.from("messages").insert([
        {
          sender_id: user.id,
          receiver_id: selectedConversation.id,
          message: newMessage.trim(),
          is_read: false,
        },
      ]);

      if (error) throw error;

      setNewMessage("");
      // Refresh messages
      fetchMessages(selectedConversation.id);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Sign in Required
              </h2>
              <p className="text-gray-600">
                Please sign in to access your messages.
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
              <div className="bg-gray-200 rounded"></div>
              <div className="lg:col-span-2 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-2">
            Communicate with renters and owners
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search messages..." className="pl-10" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[480px]">
                {conversations.length === 0 ? (
                  <div className="p-6 text-center">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 text-sm">
                      No conversations yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {conversations.map((conversation) => (
                      <button
                        key={conversation.id}
                        onClick={() => {
                          setSelectedConversation(conversation);
                          fetchMessages(conversation.id);
                        }}
                        className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b ${
                          selectedConversation?.id === conversation.id
                            ? "bg-primary/5 border-primary/20"
                            : ""
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary text-white">
                              {conversation.otherUser.full_name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {conversation.otherUser.full_name}
                              </p>
                              {conversation.unreadCount > 0 && (
                                <Badge className="bg-primary text-white">
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                            </div>
                            {conversation.productTitle && (
                              <p className="text-xs text-primary mb-1">
                                Re: {conversation.productTitle}
                              </p>
                            )}
                            <p className="text-sm text-gray-600 truncate">
                              {conversation.lastMessage?.message ||
                                "No messages yet"}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {conversation.lastMessage &&
                                new Date(
                                  conversation.lastMessage.created_at,
                                ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary text-white">
                          {selectedConversation.otherUser.full_name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">
                          {selectedConversation.otherUser.full_name}
                        </h3>
                        {selectedConversation.otherUser.is_verified && (
                          <Badge className="bg-blue-500 text-xs">
                            ✓ Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px] p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender_id === user.id
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.sender_id === user.id
                                ? "bg-primary text-white"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{message.message}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.sender_id === user.id
                                  ? "text-blue-100"
                                  : "text-gray-500"
                              }`}
                            >
                              {new Date(message.created_at).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex items-end space-x-2">
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex-1">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        disabled={sending}
                      />
                    </div>
                    <Button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || sending}
                      size="sm"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <CardContent className="h-full flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-600">
                    Choose a conversation from the list to start messaging.
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
