import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { useNavigate } from "react-router-dom"

import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Mail,
  MessageCircle,
  Search,
  SlidersHorizontal,
  Users,
} from "lucide-react"

import ccisLogo from "../assets/ccis-logo.png"

import {
  facultyMembers,
  type FacultyCategory,
} from "../data/faculty"

import {
  appreciationMessages,
} from "../data/messages"


type CategoryFilter =
  | "All"
  | FacultyCategory

type SortOption =
  | "newest"
  | "oldest"
  | "recipient"


const categories: CategoryFilter[] = [
  "All",
  "CCIS",
  "BLIS",
  "Personnel",
]


const sortOptions: {
  value: SortOption
  label: string
}[] = [
  {
    value: "newest",
    label: "Newest first",
  },
  {
    value: "oldest",
    label: "Oldest first",
  },
  {
    value: "recipient",
    label: "Recipient A–Z",
  },
]


/* =========================================
   MESSAGE PREVIEW
========================================= */

const getMessagePreview = (
  content: string,
  maxLength = 220,
) => {
  if (content.length <= maxLength) {
    return content
  }

  const shortened =
    content.slice(0, maxLength)

  const lastSpace =
    shortened.lastIndexOf(" ")

  if (lastSpace === -1) {
    return shortened
  }

  return shortened
    .slice(0, lastSpace)
    .trim()
}


const Messages = () => {
  const navigate = useNavigate()

  const [search, setSearch] =
    useState("")

  const [category, setCategory] =
    useState<CategoryFilter>("All")

  const [recipient, setRecipient] =
    useState("all")

  const [sort, setSort] =
    useState<SortOption>("newest")

  const [sortOpen, setSortOpen] =
    useState(false)

  const [
    recipientOpen,
    setRecipientOpen,
  ] = useState(false)

  const [
    visibleCount,
    setVisibleCount,
  ] = useState(8)

  const [
    expandedMessages,
    setExpandedMessages,
  ] = useState<Set<string>>(
    new Set(),
  )

  const [
    isLeaving,
    setIsLeaving,
  ] = useState(false)

  const sortRef =
    useRef<HTMLDivElement>(null)

  const recipientRef =
    useRef<HTMLDivElement>(null)


  /* =========================================
     OUTSIDE CLICK
  ========================================= */

  useEffect(() => {
    const handleOutside = (
      event: MouseEvent,
    ) => {
      const target =
        event.target as Node

      if (
        sortRef.current &&
        !sortRef.current.contains(
          target,
        )
      ) {
        setSortOpen(false)
      }

      if (
        recipientRef.current &&
        !recipientRef.current.contains(
          target,
        )
      ) {
        setRecipientOpen(false)
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutside,
    )

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutside,
      )
    }
  }, [])


  /* =========================================
     ESCAPE KEY
  ========================================= */

  useEffect(() => {
    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setSortOpen(false)
        setRecipientOpen(false)
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
  }, [])


  /* =========================================
     PERSON LOOKUP
  ========================================= */

  const peopleBySlug =
    useMemo(() => {
      return new Map(
        facultyMembers.map(
          (person) => [
            person.slug,
            person,
          ],
        ),
      )
    }, [])


  /* =========================================
     FILTER + SEARCH + SORT
  ========================================= */

  const filteredMessages =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase()

      let results =
        appreciationMessages.filter(
          (message) => {
            const person =
              peopleBySlug.get(
                message.recipientSlug,
              )

            if (!person) {
              return false
            }

            const matchesSearch =
              message.sender
                .toLowerCase()
                .includes(query) ||
              message.content
                .toLowerCase()
                .includes(query) ||
              person.name
                .toLowerCase()
                .includes(query)

            const matchesCategory =
              category === "All" ||
              person.category ===
                category

            const matchesRecipient =
              recipient === "all" ||
              person.slug ===
                recipient

            return (
              matchesSearch &&
              matchesCategory &&
              matchesRecipient
            )
          },
        )


      results = [...results].sort(
        (a, b) => {
          /* NEWEST */
          if (sort === "newest") {
            return (
              new Date(
                b.createdAt,
              ).getTime() -
              new Date(
                a.createdAt,
              ).getTime()
            )
          }


          /* OLDEST */
          if (sort === "oldest") {
            return (
              new Date(
                a.createdAt,
              ).getTime() -
              new Date(
                b.createdAt,
              ).getTime()
            )
          }


          /* RECIPIENT A-Z */
          const personA =
            peopleBySlug.get(
              a.recipientSlug,
            )

          const personB =
            peopleBySlug.get(
              b.recipientSlug,
            )

          return (
            personA?.name.localeCompare(
              personB?.name ?? "",
            ) ?? 0
          )
        },
      )

      return results
    }, [
      search,
      category,
      recipient,
      sort,
      peopleBySlug,
    ])


  /* =========================================
     VISIBLE MESSAGES
  ========================================= */

  const visibleMessages =
    filteredMessages.slice(
      0,
      visibleCount,
    )


  /* =========================================
     SELECTED VALUES
  ========================================= */

  const selectedRecipient =
    recipient === "all"
      ? null
      : peopleBySlug.get(
          recipient,
        )


  const selectedSort =
    sortOptions.find(
      (option) =>
        option.value === sort,
    ) ?? sortOptions[0]


  /* =========================================
     RESET LOAD MORE
  ========================================= */

  useEffect(() => {
    setVisibleCount(8)
  }, [
    search,
    category,
    recipient,
    sort,
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


  /* =========================================
     EXPAND / COLLAPSE MESSAGE
  ========================================= */

  const toggleMessage = (
    id: string,
  ) => {
    setExpandedMessages(
      (current) => {
        const next =
          new Set(current)

        if (next.has(id)) {
          next.delete(id)
        } else {
          next.add(id)
        }

        return next
      },
    )
  }


  /* =========================================
     CLEAR FILTERS
  ========================================= */

  const clearFilters = () => {
    setSearch("")
    setCategory("All")
    setRecipient("all")
    setSort("newest")
  }


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

      {/* =========================================
          NAVBAR
      ========================================= */}

      <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/95 backdrop-blur-xl">

        <div className="mx-auto flex h-[60px] max-w-7xl items-center justify-between px-5 sm:h-16 sm:px-8 lg:px-10">

          {/* BRAND */}
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


          {/* NAV ACTIONS */}
          <div className="flex items-center gap-2">

            {/* HOME */}
            <button
              type="button"
              onClick={() =>
                smoothNavigate("/")
              }
              disabled={isLeaving}
              aria-label="Back to home"
              className="
                group
                flex h-9 w-9
                items-center
                justify-center
                rounded-lg
                border
                border-zinc-200
                bg-white
                text-zinc-700
                transition-all
                duration-200
                hover:border-zinc-300
                hover:bg-zinc-50
                disabled:pointer-events-none
                sm:h-10
                sm:w-auto
                sm:gap-2
                sm:px-3.5
              "
            >

              <ArrowLeft
                size={14}
                strokeWidth={2}
                className="transition-transform duration-200 group-hover:-translate-x-0.5"
              />

              <span className="hidden text-sm font-medium sm:inline">
                Home
              </span>

            </button>


            {/* LEAVE MESSAGE */}
            <button
              type="button"
              onClick={() =>
                smoothNavigate(
                  "/faculty",
                )
              }
              disabled={isLeaving}
              aria-label="Leave a message"
              className="
                group
                flex h-9
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-zinc-950
                px-3.5
                text-sm
                font-medium
                text-white
                transition-all
                duration-200
                hover:bg-zinc-800
                disabled:pointer-events-none
                sm:h-10
                sm:px-4
              "
            >

              <Mail
                size={14}
                strokeWidth={2}
              />

              <span className="hidden sm:inline">
                Leave a message
              </span>

              <ArrowRight
                size={13}
                strokeWidth={2}
                className="hidden transition-transform duration-200 group-hover:translate-x-0.5 sm:block"
              />

            </button>

          </div>

        </div>

      </header>


      <main>

        {/* =========================================
            INTRO
        ========================================= */}

        <section className="border-b border-zinc-200/70">

          <div className="mx-auto max-w-7xl px-5 py-9 sm:px-8 sm:py-12 lg:px-10 lg:py-14">

            <div className="max-w-3xl">

              <h1 className="text-[36px] font-semibold leading-[1.02] tracking-[-0.045em] text-zinc-950 sm:text-5xl lg:text-6xl">

                Messages of{" "}

                <span className="text-zinc-400">
                  appreciation.
                </span>

              </h1>


              <p className="mt-4 max-w-2xl text-[14px] leading-6 text-zinc-500 sm:mt-5 sm:text-base sm:leading-7">

                Read the messages shared with
                the people who teach, guide,
                support, and inspire our
                community.

              </p>

            </div>

          </div>

        </section>


        {/* =========================================
            MESSAGES
        ========================================= */}

        <section>

          <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 sm:py-8 lg:px-10">

            {/* =====================================
                SEARCH
            ===================================== */}

            <div className="relative">

              <Search
                size={16}
                strokeWidth={2}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Search messages, names, or recipients..."
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-zinc-200
                  bg-white
                  pl-10
                  pr-4
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

            </div>


            {/* =====================================
                FILTER TOOLBAR
            ===================================== */}

            <div className="mt-3 flex flex-col gap-2.5 sm:flex-row">

              {/* =================================
                  RECIPIENT DROPDOWN
              ================================= */}

              <div
                ref={recipientRef}
                className="relative flex-1"
              >

                <button
                  type="button"
                  onClick={() => {
                    setRecipientOpen(
                      (current) =>
                        !current,
                    )

                    setSortOpen(false)
                  }}
                  aria-expanded={
                    recipientOpen
                  }
                  className="
                    flex h-11
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    border
                    border-zinc-200
                    bg-white
                    px-3.5
                    text-sm
                    text-zinc-700
                    transition-all
                    duration-200
                    hover:border-zinc-300
                    hover:bg-zinc-50
                    focus:ring-4
                    focus:ring-zinc-100
                  "
                >

                  <span className="flex min-w-0 items-center gap-2">

                    <Users
                      size={14}
                      strokeWidth={2}
                      className="shrink-0 text-zinc-400"
                    />

                    <span className="truncate font-medium">

                      {selectedRecipient
                        ? selectedRecipient.name
                        : "All recipients"}

                    </span>

                  </span>


                  <ChevronDown
                    size={14}
                    strokeWidth={2}
                    className={`
                      shrink-0
                      text-zinc-400
                      transition-transform
                      duration-200

                      ${
                        recipientOpen
                          ? "rotate-180"
                          : ""
                      }
                    `}
                  />

                </button>


                {/* MENU */}
                <div
                  className={`
                    absolute
                    left-0
                    top-[calc(100%+8px)]
                    z-40
                    max-h-[320px]
                    w-full
                    overflow-y-auto
                    rounded-xl
                    border
                    border-zinc-200
                    bg-white
                    p-1.5
                    shadow-[0_14px_40px_rgba(0,0,0,0.10)]
                    transition-all
                    duration-200
                    ease-out

                    ${
                      recipientOpen
                        ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                        : "pointer-events-none -translate-y-1 scale-[0.98] opacity-0"
                    }
                  `}
                >

                  {/* ALL */}
                  <button
                    type="button"
                    onClick={() => {
                      setRecipient("all")

                      setRecipientOpen(
                        false,
                      )
                    }}
                    className={`
                      flex
                      w-full
                      items-center
                      justify-between
                      rounded-lg
                      px-3
                      py-2.5
                      text-left
                      text-sm
                      transition-colors
                      duration-150

                      ${
                        recipient === "all"
                          ? "bg-zinc-100 font-medium text-zinc-950"
                          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
                      }
                    `}
                  >

                    All recipients

                    {recipient ===
                      "all" && (
                      <Check
                        size={14}
                        strokeWidth={2}
                      />
                    )}

                  </button>


                  {/* PEOPLE */}
                  {facultyMembers.map(
                    (person) => {

                      const active =
                        recipient ===
                        person.slug

                      return (
                        <button
                          key={
                            person.id
                          }
                          type="button"
                          onClick={() => {
                            setRecipient(
                              person.slug,
                            )

                            setRecipientOpen(
                              false,
                            )
                          }}
                          className={`
                            flex
                            w-full
                            items-center
                            justify-between
                            gap-3
                            rounded-lg
                            px-3
                            py-2.5
                            text-left
                            text-sm
                            transition-colors
                            duration-150

                            ${
                              active
                                ? "bg-zinc-100 font-medium text-zinc-950"
                                : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
                            }
                          `}
                        >

                          <span className="truncate">
                            {person.name}
                          </span>

                          {active && (
                            <Check
                              size={14}
                              strokeWidth={2}
                              className="shrink-0"
                            />
                          )}

                        </button>
                      )
                    },
                  )}

                </div>

              </div>


              {/* =================================
                  SORT DROPDOWN
              ================================= */}

              <div
                ref={sortRef}
                className="relative sm:w-[190px]"
              >

                <button
                  type="button"
                  onClick={() => {
                    setSortOpen(
                      (current) =>
                        !current,
                    )

                    setRecipientOpen(
                      false,
                    )
                  }}
                  aria-expanded={sortOpen}
                  className="
                    flex h-11
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    border
                    border-zinc-200
                    bg-white
                    px-3.5
                    text-sm
                    font-medium
                    text-zinc-700
                    transition-all
                    duration-200
                    hover:border-zinc-300
                    hover:bg-zinc-50
                    focus:ring-4
                    focus:ring-zinc-100
                  "
                >

                  <span className="flex items-center gap-2">

                    <SlidersHorizontal
                      size={14}
                      strokeWidth={2}
                      className="text-zinc-400"
                    />

                    {selectedSort.label}

                  </span>


                  <ChevronDown
                    size={14}
                    strokeWidth={2}
                    className={`
                      text-zinc-400
                      transition-transform
                      duration-200

                      ${
                        sortOpen
                          ? "rotate-180"
                          : ""
                      }
                    `}
                  />

                </button>


                {/* MENU */}
                <div
                  className={`
                    absolute
                    right-0
                    top-[calc(100%+8px)]
                    z-40
                    w-full
                    min-w-[190px]
                    rounded-xl
                    border
                    border-zinc-200
                    bg-white
                    p-1.5
                    shadow-[0_14px_40px_rgba(0,0,0,0.10)]
                    transition-all
                    duration-200
                    ease-out

                    ${
                      sortOpen
                        ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                        : "pointer-events-none -translate-y-1 scale-[0.98] opacity-0"
                    }
                  `}
                >

                  {sortOptions.map(
                    (option) => {

                      const active =
                        sort ===
                        option.value

                      return (
                        <button
                          key={
                            option.value
                          }
                          type="button"
                          onClick={() => {
                            setSort(
                              option.value,
                            )

                            setSortOpen(
                              false,
                            )
                          }}
                          className={`
                            flex
                            w-full
                            items-center
                            justify-between
                            rounded-lg
                            px-3
                            py-2.5
                            text-left
                            text-sm
                            transition-colors
                            duration-150

                            ${
                              active
                                ? "bg-zinc-100 font-medium text-zinc-950"
                                : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
                            }
                          `}
                        >

                          {option.label}

                          {active && (
                            <Check
                              size={14}
                              strokeWidth={2}
                            />
                          )}

                        </button>
                      )
                    },
                  )}

                </div>

              </div>

            </div>


            {/* =====================================
                CATEGORY FILTERS
            ===================================== */}

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

              {categories.map(
                (item) => {

                  const active =
                    category === item

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setCategory(item)
                      }
                      className={`
                        shrink-0
                        rounded-full
                        border
                        px-4
                        py-2
                        text-xs
                        font-medium
                        transition-all
                        duration-200
                        active:scale-[0.97]

                        ${
                          active
                            ? "border-zinc-950 bg-zinc-950 text-white shadow-sm"
                            : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950"
                        }
                      `}
                    >
                      {item}
                    </button>
                  )
                },
              )}

            </div>


            {/* =====================================
                RESULT COUNT
            ===================================== */}

            <div className="mt-6">

              <p className="text-sm text-zinc-500">

                <span className="font-semibold text-zinc-950">
                  {
                    filteredMessages.length
                  }
                </span>{" "}

                {filteredMessages.length ===
                1
                  ? "message"
                  : "messages"}

              </p>

            </div>


            {/* =====================================
                MESSAGE GRID
            ===================================== */}

            {filteredMessages.length >
            0 ? (

              <div
                key={`${category}-${recipient}-${sort}`}
                className="animate-filter-enter mt-5 grid items-start gap-3 lg:grid-cols-2"
              >

                {visibleMessages.map(
                  (message) => {

                    const person =
                      peopleBySlug.get(
                        message.recipientSlug,
                      )

                    if (!person) {
                      return null
                    }


                    const expanded =
                      expandedMessages.has(
                        message.id,
                      )


                    const longMessage =
                      message.content.length >
                      220


                    const preview =
                      getMessagePreview(
                        message.content,
                        220,
                      )


                    return (
                      <article
                        key={
                          message.id
                        }
                        className="
                          animate-message-enter
                          rounded-2xl
                          border
                          border-zinc-200
                          bg-white
                          p-4
                          shadow-[0_1px_2px_rgba(0,0,0,0.025)]
                          transition-all
                          duration-200
                          hover:border-zinc-300
                          hover:shadow-[0_8px_28px_rgba(0,0,0,0.04)]
                          sm:p-5
                        "
                      >

                        {/* =========================
                            MESSAGE HEADER
                        ========================= */}

                        <div className="flex items-start gap-3">

                          {/* AVATAR */}
                          <img
                            src={`https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(
                              message.avatarSeed,
                            )}`}
                            alt=""
                            loading="lazy"
                            className="h-10 w-10 shrink-0 rounded-full border border-zinc-200 bg-zinc-100"
                          />


                          <div className="min-w-0 flex-1">

                            {/* SENDER */}
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">

                              <p className="text-sm font-semibold text-zinc-950">
                                {
                                  message.sender
                                }
                              </p>


                              <span className="text-[11px] text-zinc-400">

                                {new Date(
                                  message.createdAt,
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


                            {/* RECIPIENT */}
                            <button
                              type="button"
                              onClick={() =>
                                smoothNavigate(
                                  `/faculty/${person.slug}`,
                                )
                              }
                              className="
                                group
                                mt-1
                                flex
                                max-w-full
                                items-center
                                gap-1
                                text-left
                                text-xs
                                text-zinc-400
                                transition-colors
                                duration-200
                                hover:text-zinc-700
                              "
                            >

                              <span className="shrink-0">
                                To:
                              </span>

                              <span className="truncate font-medium">
                                {
                                  person.name
                                }
                              </span>

                              <ArrowRight
                                size={11}
                                strokeWidth={2}
                                className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                              />

                            </button>

                          </div>

                        </div>


                        {/* =========================
                            MESSAGE CONTENT
                        ========================= */}

                        {longMessage ? (

                          <button
                            type="button"
                            onClick={() =>
                              toggleMessage(
                                message.id,
                              )
                            }
                            aria-expanded={
                              expanded
                            }
                            className="
                              mt-4
                              block
                              w-full
                              cursor-pointer
                              text-left
                            "
                          >

                            <p className="whitespace-pre-wrap break-words text-[14px] leading-6 text-zinc-600">

                              {expanded ? (
                                <>
                                  {
                                    message.content
                                  }

                                  {" "}

                                  <span className="whitespace-nowrap font-semibold text-zinc-950 transition-colors duration-200 hover:text-blue-600">
                                    Show less
                                  </span>
                                </>
                              ) : (
                                <>
                                  {preview}
                                  {"... "}

                                  <span className="whitespace-nowrap font-semibold text-zinc-950 transition-colors duration-200 hover:text-blue-600">
                                    See more
                                  </span>
                                </>
                              )}

                            </p>

                          </button>

                        ) : (

                          <p className="mt-4 whitespace-pre-wrap break-words text-[14px] leading-6 text-zinc-600">
                            {
                              message.content
                            }
                          </p>

                        )}

                      </article>
                    )
                  },
                )}

              </div>

            ) : (

              /* =================================
                  EMPTY STATE
              ================================= */

              <div className="animate-filter-enter mt-5 flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/40 px-6 text-center">

                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm">

                  <MessageCircle
                    size={18}
                    strokeWidth={2}
                    className="text-zinc-500"
                  />

                </div>


                <h3 className="mt-4 text-sm font-semibold text-zinc-900">
                  No messages found
                </h3>


                <p className="mt-1 max-w-[280px] text-sm leading-6 text-zinc-500">

                  Try another search,
                  recipient, or category.

                </p>


                <button
                  type="button"
                  onClick={clearFilters}
                  className="
                    mt-4
                    rounded-md
                    px-3
                    py-2
                    text-sm
                    font-medium
                    text-zinc-950
                    transition-colors
                    duration-200
                    hover:bg-zinc-100
                  "
                >
                  Clear filters
                </button>

              </div>

            )}


            {/* =====================================
                LOAD MORE
            ===================================== */}

            {visibleCount <
              filteredMessages.length && (

              <div className="mt-7 flex justify-center">

                <button
                  type="button"
                  onClick={() =>
                    setVisibleCount(
                      (current) =>
                        current + 8,
                    )
                  }
                  className="
                    group
                    flex
                    h-11
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-zinc-200
                    bg-white
                    px-5
                    text-sm
                    font-medium
                    text-zinc-700
                    shadow-sm
                    transition-all
                    duration-200
                    hover:border-zinc-300
                    hover:bg-zinc-50
                    hover:shadow-md
                  "
                >

                  Load more messages

                  <ChevronDown
                    size={14}
                    strokeWidth={2}
                    className="transition-transform duration-200 group-hover:translate-y-0.5"
                  />

                </button>

              </div>

            )}

          </div>

        </section>

      </main>


      {/* =========================================
          FOOTER
      ========================================= */}

      <footer className="mt-14 border-t border-zinc-200 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col items-center px-5 py-6 text-center sm:px-8 lg:px-10">

          <p className="text-sm font-medium leading-tight text-zinc-900">
            Developed by Lelius Lawas
          </p>

          <p className="mt-1 text-xs leading-tight text-zinc-500">
            College of Computing and Information Sciences
          </p>

        </div>

      </footer>

    </div>
  )
}

export default Messages