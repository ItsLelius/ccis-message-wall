export type AppreciationMessage = {
  id: string
  recipientSlug: string
  sender: string
  content: string
  avatarSeed: string
  createdAt: string
}

export const appreciationMessages: AppreciationMessage[] = [
  {
    id: "message-1",
    recipientSlug: "benjie-pabroa",
    sender: "Anonymous",
    content:
      "Thank you for your patience, guidance, and for always encouraging us to keep learning. Happy Teachers' Day!",
    avatarSeed: "message-1",
    createdAt: "2026-10-02T10:42:00+08:00",
  },
  {
    id: "message-2",
    recipientSlug: "cesar-tecson",
    sender: "BSCS Student",
    content:
      "Thank you for helping build a community where students are encouraged to grow, learn, and challenge themselves. We appreciate everything you do for us.",
    avatarSeed: "message-2",
    createdAt: "2026-10-02T10:28:00+08:00",
  },
  {
    id: "message-3",
    recipientSlug: "sergio-tecson",
    sender: "Anonymous",
    content:
      "Happy Teachers' Day! Thank you for sharing your knowledge with us and for helping us whenever we encounter problems during our activities.",
    avatarSeed: "message-3",
    createdAt: "2026-10-02T10:12:00+08:00",
  },
  {
    id: "message-4",
    recipientSlug: "maria-lorena-abangan",
    sender: "BLIS Student",
    content:
      "Thank you for your dedication and guidance. Your lessons and support continue to inspire us to become better students and future professionals.",
    avatarSeed: "message-4",
    createdAt: "2026-10-02T09:55:00+08:00",
  },
  {
    id: "message-5",
    recipientSlug: "ciemavil-alcain",
    sender: "Anonymous",
    content:
      "Thank you for being patient with us and for making every lesson meaningful. We truly appreciate the time and effort you give to your students.",
    avatarSeed: "message-5",
    createdAt: "2026-10-02T09:34:00+08:00",
  },
  {
    id: "message-6",
    recipientSlug: "chamie-talara",
    sender: "CCIS Student",
    content:
      "Thank you for all the support you provide behind the scenes. Your work is an important part of our everyday experience here.",
    avatarSeed: "message-6",
    createdAt: "2026-10-02T09:15:00+08:00",
  },
]