import { supabase } from "./supabase"

import type {
  Message,
  NewMessage,
} from "../types/message"


export const getMessages = async () => {
  const { data, error } =
    await supabase
      .from("messages")
      .select("*")
      .order("created_at", {
        ascending: false,
      })

  if (error) {
    throw error
  }

  return (data ?? []) as Message[]
}


export const getMessagesByRecipient = async (
  recipientSlug: string,
) => {
  const { data, error } =
    await supabase
      .from("messages")
      .select("*")
      .eq(
        "recipient_slug",
        recipientSlug,
      )
      .order("created_at", {
        ascending: false,
      })

  if (error) {
    throw error
  }

  return (data ?? []) as Message[]
}


export const createMessage = async (
  newMessage: NewMessage,
) => {
  const { data, error } =
    await supabase
      .from("messages")
      .insert(newMessage)
      .select()
      .single()

  if (error) {
    throw error
  }

  return data as Message
}


export const getMessageCount = async () => {
  const { count, error } =
    await supabase
      .from("messages")
      .select("*", {
        count: "exact",
        head: true,
      })

  if (error) {
    throw error
  }

  return count ?? 0
}