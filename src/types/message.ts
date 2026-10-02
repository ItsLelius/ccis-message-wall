export type Message = {
  id: string
  recipient_slug: string
  sender_name: string
  message: string
  avatar_seed: string
  created_at: string
}

export type NewMessage = {
  recipient_slug: string
  sender_name: string
  message: string
  avatar_seed: string
}