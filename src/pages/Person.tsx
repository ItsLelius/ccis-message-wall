import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react"

import {
  useNavigate,
  useParams,
} from "react-router-dom"

import {
  ArrowLeft,
  Check,
  ChevronDown,
  Mail,
  Send,
} from "lucide-react"

import ccisLogo from "../assets/ccis-logo.png"
import { facultyMembers } from "../data/faculty"

import {
  createMessage,
  getMessagesByRecipient,
} from "../lib/messages"

import type { Message } from "../types/message"


const Person = () => {
  const { slug } = useParams()

  const navigate = useNavigate()

  const [sender, setSender] =
    useState("")

  const [message, setMessage] =
    useState("")

  const [messages, setMessages] =
    useState<Message[]>([])

  const [loadingMessages, setLoadingMessages] =
    useState(true)

  const [loadError, setLoadError] =
    useState("")

  const [submitError, setSubmitError] =
    useState("")

  const [confirmOpen, setConfirmOpen] =
    useState(false)

  const [isSubmitting, setIsSubmitting] =
    useState(false)

  const [successVisible, setSuccessVisible] =
    useState(false)

  const [showAllMessages, setShowAllMessages] =
    useState(false)

  const [formHeight, setFormHeight] =
    useState(0)

  const [hasOverflow, setHasOverflow] =
    useState(false)

  const [isLeaving, setIsLeaving] =
    useState(false)

  const formCardRef =
    useRef<HTMLDivElement>(null)

  const messageViewportRef =
    useRef<HTMLDivElement>(null)


  const person = useMemo(
    () =>
      facultyMembers.find(
        (member) =>
          member.slug === slug,
      ),
    [slug],
  )


  useEffect(() => {
    if (!person) return

    let active = true

    const loadMessages = async () => {
      try {
        const data =
          await getMessagesByRecipient(
            person.slug,
          )

        if (!active) return

        setMessages(data)
        setLoadError("")
      } catch (error) {
        console.error(error)

        if (!active) return

        setLoadError(
          "Unable to load messages.",
        )
      } finally {
        if (active) {
          setLoadingMessages(false)
        }
      }
    }

    void loadMessages()

    return () => {
      active = false
    }
  }, [person])


  useEffect(() => {
    const element =
      formCardRef.current

    if (!element) return

    const updateHeight = () => {
      setFormHeight(
        Math.ceil(
          element.getBoundingClientRect()
            .height,
        ),
      )
    }

    updateHeight()

    const observer =
      new ResizeObserver(
        updateHeight,
      )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [])


  useEffect(() => {
    if (showAllMessages) return

    const frame =
      requestAnimationFrame(() => {
        const viewport =
          messageViewportRef.current

        if (!viewport) {
          setHasOverflow(false)
          return
        }

        setHasOverflow(
          viewport.scrollHeight >
            viewport.clientHeight + 2,
        )
      })

    return () => {
      cancelAnimationFrame(frame)
    }
  }, [
    messages,
    formHeight,
    showAllMessages,
  ])


  useEffect(() => {
    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key === "Escape" &&
        !isSubmitting
      ) {
        setConfirmOpen(false)
      }
    }

    document.addEventListener(
      "keydown",
      handleEscape,
    )

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape,
      )
    }
  }, [isSubmitting])


  const smoothNavigate = (
    path: string,
  ) => {
    if (isLeaving) return

    setIsLeaving(true)

    setTimeout(() => {
      navigate(path)
    }, 180)
  }


  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    if (!message.trim()) return

    setSubmitError("")
    setConfirmOpen(true)
  }


  const confirmSend = async () => {
    if (
      !person ||
      !message.trim() ||
      isSubmitting
    ) {
      return
    }

    setIsSubmitting(true)
    setSubmitError("")

    try {
      const avatarSeed =
        crypto.randomUUID()

      const created =
        await createMessage({
          recipient_slug:
            person.slug,

          sender_name:
            sender.trim() ||
            "Anonymous",

          message:
            message.trim(),

          avatar_seed:
            avatarSeed,
        })

      setMessages(
        (current) => [
          created,
          ...current,
        ],
      )

      setSender("")
      setMessage("")
      setConfirmOpen(false)

      setSuccessVisible(true)

      window.setTimeout(() => {
        setSuccessVisible(false)
      }, 2200)
    } catch (error) {
      console.error(error)

      setSubmitError(
        "Your message could not be sent. Please try again.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }


  if (!person) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-5 text-center">

        <div>

          <h1 className="text-2xl font-semibold text-zinc-950">
            Person not found
          </h1>

          <button
            type="button"
            onClick={() =>
              navigate("/faculty")
            }
            className="mt-5 text-sm font-medium text-zinc-600 underline underline-offset-4"
          >
            Return to directory
          </button>

        </div>

      </div>
    )
  }


  const wallStyle = {
    "--form-height":
      `${formHeight}px`,
  } as CSSProperties


  return (
    <div
      className={`
        animate-page-enter
        min-h-screen
        bg-white
        text-zinc-950
        transition-[opacity,transform]
        duration-200

        ${
          isLeaving
            ? "translate-y-1 opacity-0"
            : "opacity-100"
        }
      `}
    >

      <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/95 backdrop-blur-xl">

        <div className="mx-auto flex h-[60px] max-w-7xl items-center justify-between px-5 sm:h-16 sm:px-8 lg:px-10">

          <button
            type="button"
            onClick={() =>
              smoothNavigate("/")
            }
            className="flex items-center gap-2.5 text-left"
          >

            <img
              src={ccisLogo}
              alt="CCIS Logo"
              className="h-8 w-8 sm:h-9 sm:w-9"
            />

            <div>

              <p className="text-sm font-semibold">
                CCIS
              </p>

              <p className="text-[10px] text-zinc-500 sm:text-[11px]">
                Teachers&apos; Day 2026
              </p>

            </div>

          </button>


          <button
            type="button"
            onClick={() =>
              smoothNavigate(
                "/faculty",
              )
            }
            className="group flex h-9 items-center gap-2 rounded-lg border border-zinc-200 px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >

            <ArrowLeft
              size={15}
              className="transition-transform group-hover:-translate-x-0.5"
            />

            <span className="hidden sm:inline">
              Directory
            </span>

          </button>

        </div>

      </header>


      <main>

        <section>

          <div className="mx-auto grid max-w-5xl gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:px-10">

            <div>

              <div className="lg:sticky lg:top-24">

                <div
                  ref={formCardRef}
                  className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6"
                >

                  <div className="flex items-center gap-2">

                    <Mail
                      size={16}
                      className="text-blue-600"
                    />

                    <h1 className="font-semibold">
                      Leave a message
                    </h1>

                  </div>


                  <p className="mt-2 text-sm leading-6 text-zinc-500">

                    Share a short message of
                    appreciation for{" "}

                    <span className="font-medium text-zinc-700">
                      {person.name}
                    </span>.

                  </p>


                  <form
                    onSubmit={handleSubmit}
                    className="mt-6"
                  >

                    <label className="block">

                      <span className="text-xs font-medium text-zinc-700">
                        Your name
                      </span>

                      <span className="ml-1 text-xs text-zinc-400">
                        optional
                      </span>

                      <input
                        type="text"
                        value={sender}
                        maxLength={60}
                        onChange={(event) =>
                          setSender(
                            event.target.value,
                          )
                        }
                        placeholder="Anonymous"
                        className="mt-2 h-11 w-full rounded-xl border border-zinc-200 px-3.5 text-sm outline-none transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
                      />

                    </label>


                    <label className="mt-5 block">

                      <div className="flex justify-between">

                        <span className="text-xs font-medium text-zinc-700">
                          Message
                        </span>

                        <span className="text-[11px] text-zinc-400">
                          {message.length}/500
                        </span>

                      </div>

                      <textarea
                        value={message}
                        maxLength={500}
                        rows={6}
                        onChange={(event) =>
                          setMessage(
                            event.target.value,
                          )
                        }
                        placeholder="Write your message here..."
                        className="mt-2 w-full resize-none rounded-xl border border-zinc-200 p-3.5 text-sm leading-6 outline-none transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
                      />

                    </label>


                    <button
                      type="submit"
                      disabled={
                        !message.trim()
                      }
                      className="group mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400"
                    >

                      <Send
                        size={15}
                      />

                      Send message

                    </button>

                  </form>

                </div>


                <p className="mt-3 px-1 text-[11px] leading-5 text-zinc-400">
                  Leave your name blank if you prefer to send your message anonymously.
                </p>

              </div>

            </div>


            <div
              style={wallStyle}
              className={
                !showAllMessages &&
                formHeight > 0
                  ? "flex flex-col lg:h-[var(--form-height)]"
                  : "flex flex-col"
              }
            >

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                  Message Wall
                </p>

                <h2 className="mt-1 text-xl font-semibold tracking-[-0.025em]">
                  Messages of appreciation
                </h2>

              </div>


              {loadingMessages ? (

                <div className="mt-6 flex min-h-[300px] flex-1 items-center justify-center rounded-2xl border border-zinc-200">

                  <p className="text-sm text-zinc-400">
                    Loading messages...
                  </p>

                </div>

              ) : loadError ? (

                <div className="mt-6 flex min-h-[300px] flex-1 items-center justify-center rounded-2xl border border-dashed border-zinc-200 px-6 text-center">

                  <p className="text-sm text-zinc-500">
                    {loadError}
                  </p>

                </div>

              ) : messages.length === 0 ? (

                <div className="mt-6 flex min-h-[300px] flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/40 px-6 text-center">

                  <Mail
                    size={18}
                    className="text-zinc-400"
                  />

                  <h3 className="mt-4 text-sm font-semibold">
                    No messages yet
                  </h3>

                  <p className="mt-1 max-w-[280px] text-sm leading-6 text-zinc-500">
                    Be the first to leave a Teachers&apos; Day message for {person.name}.
                  </p>

                </div>

              ) : (

                <>

                  <div
                    ref={messageViewportRef}
                    className={
                      showAllMessages
                        ? "relative mt-6"
                        : "relative mt-6 max-h-[520px] overflow-hidden lg:min-h-0 lg:flex-1 lg:max-h-none"
                    }
                  >

                    <div className="space-y-3">

                      {messages.map(
                        (item) => (

                          <article
                            key={item.id}
                            className="animate-message-enter rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5"
                          >

                            <div className="flex gap-3">

                              <img
                                src={`https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(
                                  item.avatar_seed,
                                )}`}
                                alt=""
                                className="h-10 w-10 shrink-0 rounded-full border border-zinc-200"
                              />

                              <div className="min-w-0">

                                <div className="flex flex-wrap items-center gap-2">

                                  <p className="text-sm font-semibold">
                                    {
                                      item.sender_name
                                    }
                                  </p>

                                  <span className="text-[11px] text-zinc-400">
                                    {new Date(
                                      item.created_at,
                                    ).toLocaleTimeString(
                                      [],
                                      {
                                        hour:
                                          "2-digit",
                                        minute:
                                          "2-digit",
                                      },
                                    )}
                                  </span>

                                </div>

                                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-zinc-600">
                                  {
                                    item.message
                                  }
                                </p>

                              </div>

                            </div>

                          </article>

                        ),
                      )}

                    </div>


                    {!showAllMessages &&
                      hasOverflow && (

                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white via-white/95 to-transparent" />

                      )}

                  </div>


                  {(hasOverflow ||
                    showAllMessages) && (

                    <button
                      type="button"
                      onClick={() =>
                        setShowAllMessages(
                          (current) =>
                            !current,
                        )
                      }
                      className="mt-3 flex h-10 items-center justify-center gap-2 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                    >

                      {showAllMessages
                        ? "Show less"
                        : `See all ${messages.length} messages`}

                      <ChevronDown
                        size={14}
                        className={
                          showAllMessages
                            ? "rotate-180 transition-transform"
                            : "transition-transform"
                        }
                      />

                    </button>

                  )}

                </>

              )}

            </div>

          </div>

        </section>

      </main>


      {confirmOpen && (

        <div className="animate-fade-enter fixed inset-0 z-[100] flex items-center justify-center px-5">

          <button
            type="button"
            aria-label="Close confirmation"
            disabled={isSubmitting}
            onClick={() =>
              setConfirmOpen(false)
            }
            className="absolute inset-0 cursor-default bg-black/35 backdrop-blur-[2px]"
          />


          <div className="animate-scale-enter relative z-10 w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100">

              <Mail
                size={17}
                className="text-zinc-700"
              />

            </div>


            <h2 className="mt-4 text-lg font-semibold tracking-[-0.02em]">
              Send this message?
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Your message will be published immediately and visible to everyone.
            </p>


            <div className="mt-5 rounded-xl border border-zinc-200 bg-zinc-50 p-4">

              <p className="text-xs font-medium text-zinc-500">
                To
              </p>

              <p className="mt-1 text-sm font-semibold text-zinc-900">
                {person.name}
              </p>

              <p className="mt-4 text-sm leading-6 text-zinc-600">
                {message.trim()}
              </p>

              <p className="mt-4 text-xs text-zinc-400">
                From:{" "}
                {sender.trim() ||
                  "Anonymous"}
              </p>

            </div>


            {submitError && (

              <p className="mt-4 text-sm text-red-600">
                {submitError}
              </p>

            )}


            <div className="mt-6 flex gap-3">

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() =>
                  setConfirmOpen(false)
                }
                className="h-11 flex-1 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:pointer-events-none"
              >
                Cancel
              </button>


              <button
                type="button"
                disabled={isSubmitting}
                onClick={confirmSend}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-zinc-950 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60"
              >

                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send
                      size={14}
                    />
                    Send message
                  </>
                )}

              </button>

            </div>

          </div>

        </div>

      )}


      {successVisible && (

        <div className="animate-fade-enter fixed inset-0 z-[110] flex items-center justify-center bg-black/20 px-5 backdrop-blur-[2px]">

          <div className="animate-scale-enter w-full max-w-sm rounded-2xl border border-zinc-200 bg-white px-6 py-8 text-center shadow-2xl">

            <div className="relative mx-auto flex h-16 w-16 items-center justify-center">

              <span className="absolute inset-2 animate-ping rounded-full bg-zinc-200" />

              <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-zinc-950">

                <Check
                  size={25}
                  strokeWidth={2.5}
                  className="text-white"
                />

              </div>

            </div>


            <h2 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-zinc-950">
              Message sent!
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Your appreciation message is now part of {person.name}&apos;s message wall.
            </p>

          </div>

        </div>

      )}


      <footer className="mt-12 border-t border-zinc-200 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col items-center px-5 py-6 text-center">

          <p className="text-sm font-medium text-zinc-900">
            Developed by Lelius Lawas
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            College of Computing and Information Sciences
          </p>

        </div>

      </footer>

    </div>
  )
}

export default Person