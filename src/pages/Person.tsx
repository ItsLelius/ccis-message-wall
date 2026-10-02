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
  MessageCircle,
  Send,
} from "lucide-react"

import ccisLogo from "../assets/ccis-logo.png"
import { facultyMembers } from "../data/faculty"


type Message = {
  id: string
  sender: string
  content: string
  avatarSeed: string
  createdAt: Date
}


const Person = () => {
  const { slug } = useParams()
  const navigate = useNavigate()

  const [isLeaving, setIsLeaving] = useState(false)

  const [sender, setSender] = useState("")
  const [message, setMessage] = useState("")

  const [messages, setMessages] = useState<Message[]>([])

  const [sent, setSent] = useState(false)

  const [showAllMessages, setShowAllMessages] =
    useState(false)

  const [formHeight, setFormHeight] =
    useState(0)

  const [hasOverflow, setHasOverflow] =
    useState(false)

  const formCardRef =
    useRef<HTMLDivElement>(null)

  const messageViewportRef =
    useRef<HTMLDivElement>(null)


  /* =========================================
     FIND PERSON
  ========================================= */

  const person = useMemo(
    () =>
      facultyMembers.find(
        (member) =>
          member.slug === slug,
      ),
    [slug],
  )


  /* =========================================
     MATCH MESSAGE WALL HEIGHT TO FORM
  ========================================= */

  useEffect(() => {
    const element = formCardRef.current

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
      new ResizeObserver(updateHeight)

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [])


  /* =========================================
     CHECK IF MESSAGE LIST OVERFLOWS
  ========================================= */

  useEffect(() => {
    if (showAllMessages) return

    const frame =
      window.requestAnimationFrame(() => {
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
      window.cancelAnimationFrame(frame)
    }
  }, [
    messages,
    formHeight,
    showAllMessages,
  ])


  /* =========================================
     SMOOTH NAVIGATION
  ========================================= */

  const smoothNavigate = (
    path: string,
  ) => {
    if (isLeaving) return

    setIsLeaving(true)

    window.setTimeout(() => {
      navigate(path)
    }, 180)
  }


  const goBack = () => {
    smoothNavigate("/faculty")
  }


  /* =========================================
     SEND MESSAGE
  ========================================= */

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    const cleanMessage =
      message.trim()

    if (!cleanMessage) return

    const id =
      crypto.randomUUID()

    const newMessage: Message = {
      id,
      sender:
        sender.trim() ||
        "Anonymous",
      content: cleanMessage,
      avatarSeed: id,
      createdAt: new Date(),
    }

    setMessages((current) => [
      newMessage,
      ...current,
    ])

    setSender("")
    setMessage("")
    setSent(true)

    window.setTimeout(() => {
      setSent(false)
    }, 2200)
  }


  /* =========================================
     PERSON NOT FOUND
  ========================================= */

  if (!person) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-5 text-center">
        <div>

          <h1 className="text-2xl font-semibold tracking-[-0.03em] text-zinc-950">
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


  /* =========================================
     HEIGHT VARIABLE
  ========================================= */

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
        ease-out

        ${
          isLeaving
            ? "translate-y-1 opacity-0"
            : "translate-y-0 opacity-100"
        }
      `}
    >

      {/* =====================================
          NAVBAR
      ===================================== */}

      <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/95 backdrop-blur-xl">

        <div className="mx-auto flex h-[60px] max-w-7xl items-center justify-between px-5 sm:h-16 sm:px-8 lg:px-10">

          {/* Brand */}
          <button
            type="button"
            onClick={() =>
              smoothNavigate("/")
            }
            disabled={isLeaving}
            className="flex items-center gap-2.5 text-left transition-opacity duration-200 hover:opacity-75 disabled:pointer-events-none sm:gap-3"
          >

            <img
              src={ccisLogo}
              alt="CCIS Logo"
              className="h-8 w-8 object-contain sm:h-9 sm:w-9"
            />

            <div className="leading-none">

              <p className="text-[14px] font-semibold tracking-[-0.02em] text-zinc-950 sm:text-[15px]">
                CCIS
              </p>

              <p className="mt-1 text-[10px] text-zinc-500 sm:text-[11px]">
                Teachers&apos; Day 2026
              </p>

            </div>

          </button>


          {/* Back to Directory */}
          <button
            type="button"
            onClick={goBack}
            disabled={isLeaving}
            aria-label="Back to directory"
            className="
              group
              flex h-9 w-9
              items-center justify-center
              rounded-lg
              border border-zinc-200
              bg-white
              text-zinc-700
              transition-all duration-200
              hover:border-zinc-300
              hover:bg-zinc-50
              hover:shadow-sm
              active:scale-[0.97]
              disabled:pointer-events-none
              sm:h-10 sm:w-auto
              sm:gap-2 sm:px-3.5
            "
          >

            <ArrowLeft
              size={15}
              strokeWidth={2}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />

            <span className="hidden text-sm font-medium sm:block">
              Directory
            </span>

          </button>

        </div>

      </header>


      {/* =====================================
          CONTENT
      ===================================== */}

      <main>

        <section>
          <div className="mx-auto grid max-w-5xl gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:px-10">


            {/* =================================
                LEFT - MESSAGE FORM
            ================================= */}

            <div>

              <div className="lg:sticky lg:top-24">

                <div
                  ref={formCardRef}
                  className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] sm:p-6"
                >

                  {/* Heading */}
                  <div className="flex items-center gap-2">

                    <Mail
                      size={16}
                      strokeWidth={2}
                      className="text-blue-600"
                    />

                    <h1 className="text-base font-semibold tracking-[-0.02em] text-zinc-950">
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


                  {/* FORM */}
                  <form
                    onSubmit={handleSubmit}
                    className="mt-6"
                  >

                    {/* NAME */}
                    <label className="block">

                      <div className="flex items-center gap-1.5">

                        <span className="text-xs font-medium text-zinc-700">
                          Your name
                        </span>

                        <span className="text-xs text-zinc-400">
                          optional
                        </span>

                      </div>


                      <input
                        type="text"
                        value={sender}
                        onChange={(event) =>
                          setSender(
                            event.target.value,
                          )
                        }
                        maxLength={60}
                        placeholder="Anonymous"
                        className="
                          mt-2
                          h-11
                          w-full
                          rounded-xl
                          border
                          border-zinc-200
                          bg-white
                          px-3.5
                          text-sm
                          text-zinc-900
                          outline-none
                          transition-all
                          duration-200
                          placeholder:text-zinc-400
                          hover:border-zinc-300
                          focus:border-zinc-400
                          focus:ring-4
                          focus:ring-zinc-100
                        "
                      />

                    </label>


                    {/* MESSAGE */}
                    <label className="mt-5 block">

                      <div className="flex items-center justify-between">

                        <span className="text-xs font-medium text-zinc-700">
                          Message
                        </span>

                        <span className="text-[11px] text-zinc-400">
                          {message.length}/500
                        </span>

                      </div>


                      <textarea
                        value={message}
                        onChange={(event) =>
                          setMessage(
                            event.target.value,
                          )
                        }
                        maxLength={500}
                        rows={6}
                        placeholder="Write your message here..."
                        className="
                          mt-2
                          w-full
                          resize-none
                          rounded-xl
                          border
                          border-zinc-200
                          bg-white
                          p-3.5
                          text-sm
                          leading-6
                          text-zinc-900
                          outline-none
                          transition-all
                          duration-200
                          placeholder:text-zinc-400
                          hover:border-zinc-300
                          focus:border-zinc-400
                          focus:ring-4
                          focus:ring-zinc-100
                        "
                      />

                    </label>


                    {/* SEND */}
                    <button
                      type="submit"
                      disabled={
                        !message.trim()
                      }
                      className="
                        group
                        mt-5
                        flex
                        h-11
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-zinc-950
                        px-5
                        text-sm
                        font-medium
                        text-white
                        transition-all
                        duration-200
                        hover:bg-zinc-800
                        disabled:cursor-not-allowed
                        disabled:bg-zinc-200
                        disabled:text-zinc-400
                      "
                    >

                      {sent ? (
                        <>
                          <Check
                            size={15}
                          />

                          Message sent
                        </>
                      ) : (
                        <>
                          <Send
                            size={15}
                            strokeWidth={2}
                            className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          />

                          Send message
                        </>
                      )}

                    </button>

                  </form>

                </div>


                {/* Anonymous note */}
                <p className="mt-3 px-1 text-[11px] leading-5 text-zinc-400">
                  Leave your name blank if you
                  prefer to send your message
                  anonymously.
                </p>

              </div>

            </div>


            {/* =================================
                RIGHT - MESSAGE WALL
            ================================= */}

            <div
              style={wallStyle}
              className={`
                flex flex-col

                ${
                  !showAllMessages &&
                  formHeight > 0
                    ? "lg:h-[var(--form-height)]"
                    : ""
                }
              `}
            >

              {/* WALL HEADER */}
              <div className="flex shrink-0 items-end justify-between gap-4">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                    Message Wall
                  </p>

                  <h2 className="mt-1 text-xl font-semibold tracking-[-0.025em] text-zinc-950">
                    Messages of appreciation
                  </h2>

                </div>


                {messages.length > 0 && (
                  <div className="hidden items-center gap-1.5 text-xs text-zinc-400 sm:flex">

                    <MessageCircle
                      size={12}
                    />

                    <span>
                      {messages.length}
                    </span>

                  </div>
                )}

              </div>


              {/* =================================
                  EMPTY MESSAGE WALL
              ================================= */}

              {messages.length === 0 ? (

                <div className="mt-6 flex min-h-[300px] flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/40 px-6 text-center">

                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm">

                    <Mail
                      size={17}
                      className="text-zinc-500"
                    />

                  </div>


                  <h3 className="mt-4 text-sm font-semibold text-zinc-900">
                    No messages yet
                  </h3>


                  <p className="mt-1 max-w-[280px] text-sm leading-6 text-zinc-500">
                    Be the first to leave a
                    Teachers&apos; Day message for{" "}
                    {person.name}.
                  </p>

                </div>

              ) : (

                <>
                  {/* =================================
                      COLLAPSIBLE MESSAGE VIEWPORT
                  ================================= */}

                  <div
                    ref={messageViewportRef}
                    className={`
                      relative
                      mt-6

                      ${
                        showAllMessages
                          ? ""
                          : "max-h-[520px] overflow-hidden lg:min-h-0 lg:flex-1 lg:max-h-none"
                      }
                    `}
                  >

                    {/* MESSAGE LIST */}
                    <div className="space-y-3">

                      {messages.map(
                        (item) => (

                          <article
                            key={item.id}
                            className="
                              animate-message-enter
                              rounded-2xl
                              border
                              border-zinc-200
                              bg-white
                              p-4
                              shadow-[0_1px_2px_rgba(0,0,0,0.025)]
                              sm:p-5
                            "
                          >

                            <div className="flex items-start gap-3.5">

                              {/* RANDOM AVATAR */}
                              <img
                                src={`https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(
                                  item.avatarSeed,
                                )}`}
                                alt=""
                                loading="lazy"
                                className="h-10 w-10 shrink-0 rounded-full border border-zinc-200 bg-zinc-100"
                              />


                              {/* MESSAGE CONTENT */}
                              <div className="min-w-0 flex-1">

                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">

                                  <p className="text-sm font-semibold text-zinc-900">
                                    {item.sender}
                                  </p>


                                  <span className="text-[11px] text-zinc-400">
                                    {item.createdAt.toLocaleTimeString(
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


                                <p className="mt-2 whitespace-pre-wrap break-words text-[14px] leading-6 text-zinc-600">
                                  {item.content}
                                </p>

                              </div>

                            </div>

                          </article>

                        ),
                      )}

                    </div>


                    {/* BOTTOM FADE */}
                    {!showAllMessages &&
                      hasOverflow && (

                        <div
                          aria-hidden="true"
                          className="
                            pointer-events-none
                            absolute
                            inset-x-0
                            bottom-0
                            h-28
                            bg-gradient-to-t
                            from-white
                            via-white/95
                            to-transparent
                          "
                        />

                      )}

                  </div>


                  {/* =================================
                      SEE ALL / SHOW LESS
                  ================================= */}

                  {(hasOverflow ||
                    showAllMessages) && (

                    <div
                      className={`
                        relative
                        z-10
                        shrink-0
                        bg-white
                        pt-3

                        ${
                          !showAllMessages
                            ? ""
                            : "mt-1"
                        }
                      `}
                    >

                      <button
                        type="button"
                        onClick={() =>
                          setShowAllMessages(
                            (current) =>
                              !current,
                          )
                        }
                        className="
                          group
                          flex
                          h-10
                          w-full
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          border
                          border-zinc-200
                          bg-white
                          text-sm
                          font-medium
                          text-zinc-700
                          transition-all
                          duration-200
                          hover:border-zinc-300
                          hover:bg-zinc-50
                        "
                      >

                        {showAllMessages
                          ? "Show less"
                          : `See all ${messages.length} messages`}


                        <ChevronDown
                          size={14}
                          strokeWidth={2}
                          className={`
                            transition-transform
                            duration-300

                            ${
                              showAllMessages
                                ? "rotate-180"
                                : ""
                            }
                          `}
                        />

                      </button>

                    </div>

                  )}

                </>

              )}

            </div>

          </div>

        </section>

      </main>


      {/* =====================================
          FOOTER
      ===================================== */}

      <footer className="mt-12 border-t border-zinc-200 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col items-center px-5 py-6 text-center">

          <p className="text-sm font-medium leading-tight text-zinc-900">
            Developed by Lelius Lawas
          </p>

          <p className="mt-1 text-xs leading-tight text-zinc-500">
            College of Computing and
            Information Sciences
          </p>

        </div>

      </footer>

    </div>
  )
}

export default Person