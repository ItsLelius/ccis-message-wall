import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { createPortal } from "react-dom"

import { useNavigate } from "react-router-dom"

import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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

import { getMessages } from "../lib/messages"

import type { Message } from "../types/message"


type CategoryFilter =
  | "All"
  | FacultyCategory

type SortOption =
  | "newest"
  | "oldest"
  | "recipient"

type PaginationItem =
  | number
  | "left-ellipsis"
  | "right-ellipsis"


const PAGE_SIZE = 8


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


const getMessagePreview = (
  content: string,
  maxLength = 180,
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


const getPaginationItems = (
  currentPage: number,
  totalPages: number,
): PaginationItem[] => {
  if (totalPages <= 7) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1,
    )
  }

  const items: PaginationItem[] = [1]

  const startPage =
    Math.max(2, currentPage - 1)

  const endPage =
    Math.min(
      totalPages - 1,
      currentPage + 1,
    )

  if (startPage > 2) {
    items.push("left-ellipsis")
  }

  for (
    let page = startPage;
    page <= endPage;
    page += 1
  ) {
    items.push(page)
  }

  if (endPage < totalPages - 1) {
    items.push("right-ellipsis")
  }

  items.push(totalPages)

  return items
}


const Messages = () => {
  const navigate = useNavigate()


  const [messages, setMessages] =
    useState<Message[]>([])

  const [loading, setLoading] =
    useState(true)

  const [loadError, setLoadError] =
    useState("")


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
    currentPage,
    setCurrentPage,
  ] = useState(1)


  const [
    selectedMessage,
    setSelectedMessage,
  ] = useState<Message | null>(null)


  const [
    isLeaving,
    setIsLeaving,
  ] = useState(false)


  const sortRef =
    useRef<HTMLDivElement>(null)

  const recipientRef =
    useRef<HTMLDivElement>(null)


  /* =========================================
     LOAD MESSAGES
  ========================================= */

  useEffect(() => {
    let active = true

    const loadMessages = async () => {
      try {
        const data =
          await getMessages()

        if (!active) return

        setMessages(data)
        setLoadError("")
      } catch (error) {
        console.error(error)

        if (!active) return

        setLoadError(
          "Unable to load messages right now.",
        )
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadMessages()

    return () => {
      active = false
    }
  }, [])


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
        setSelectedMessage(null)
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
     LOCK BODY WHEN MODAL IS OPEN
  ========================================= */

  useEffect(() => {
    if (!selectedMessage) {
      return
    }

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow =
      "hidden"

    return () => {
      document.body.style.overflow =
        previousOverflow
    }
  }, [selectedMessage])


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
        messages.filter(
          (item) => {
            const person =
              peopleBySlug.get(
                item.recipient_slug,
              )

            if (!person) {
              return false
            }

            const matchesSearch =
              item.sender_name
                .toLowerCase()
                .includes(query) ||
              item.message
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
          if (sort === "newest") {
            return (
              new Date(
                b.created_at,
              ).getTime() -
              new Date(
                a.created_at,
              ).getTime()
            )
          }

          if (sort === "oldest") {
            return (
              new Date(
                a.created_at,
              ).getTime() -
              new Date(
                b.created_at,
              ).getTime()
            )
          }

          const personA =
            peopleBySlug.get(
              a.recipient_slug,
            )

          const personB =
            peopleBySlug.get(
              b.recipient_slug,
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
      messages,
      search,
      category,
      recipient,
      sort,
      peopleBySlug,
    ])


  /* =========================================
     PAGINATION
  ========================================= */

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredMessages.length /
          PAGE_SIZE,
      ),
    )


  const startIndex =
    (currentPage - 1) *
    PAGE_SIZE


  const paginatedMessages =
    filteredMessages.slice(
      startIndex,
      startIndex + PAGE_SIZE,
    )


  const paginationItems =
    getPaginationItems(
      currentPage,
      totalPages,
    )


  const goToPage = (
    page: number,
  ) => {
    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage
    ) {
      return
    }

    setCurrentPage(page)

    window.requestAnimationFrame(
      () => {
        document
          .getElementById(
            "message-results",
          )
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
      },
    )
  }


  /* =========================================
     SELECTED FILTER VALUES
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
     NAVIGATION
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
     FILTER HANDLERS
  ========================================= */

  const handleSearch = (
    value: string,
  ) => {
    setSearch(value)
    setCurrentPage(1)
  }


  const handleCategory = (
    value: CategoryFilter,
  ) => {
    setCategory(value)
    setCurrentPage(1)
  }


  const handleRecipient = (
    value: string,
  ) => {
    setRecipient(value)
    setRecipientOpen(false)
    setCurrentPage(1)
  }


  const handleSort = (
    value: SortOption,
  ) => {
    setSort(value)
    setSortOpen(false)
    setCurrentPage(1)
  }


  const clearFilters = () => {
    setSearch("")
    setCategory("All")
    setRecipient("all")
    setSort("newest")
    setCurrentPage(1)
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


          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={() =>
                smoothNavigate("/")
              }
              disabled={isLeaving}
              aria-label="Back to home"
              className="group flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50 disabled:pointer-events-none sm:h-10 sm:w-auto sm:gap-2 sm:px-3.5"
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


            <button
              type="button"
              onClick={() =>
                smoothNavigate(
                  "/faculty",
                )
              }
              disabled={isLeaving}
              aria-label="Leave a message"
              className="group flex h-9 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-3.5 text-sm font-medium text-white transition-all duration-200 hover:bg-zinc-800 disabled:pointer-events-none sm:h-10 sm:px-4"
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
            MESSAGES SECTION
        ========================================= */}

        <section>

          <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 sm:py-8 lg:px-10">

            {/* SEARCH */}
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
                  handleSearch(
                    event.target.value,
                  )
                }
                placeholder="Search messages, names, or recipients..."
                className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-4 text-sm text-zinc-900 outline-none transition-all duration-200 placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
              />

            </div>


            {/* =====================================
                RECIPIENT + SORT
            ===================================== */}

            <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] gap-2.5">

              {/* RECIPIENT */}
              <div
                ref={recipientRef}
                className="relative min-w-0"
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
                    min-w-0
                    items-center
                    justify-between
                    gap-2
                    rounded-xl
                    border
                    border-zinc-200
                    bg-white
                    px-3
                    text-sm
                    text-zinc-700
                    transition-all
                    duration-200
                    hover:border-zinc-300
                    hover:bg-zinc-50
                    focus:outline-none
                    focus:ring-4
                    focus:ring-zinc-100
                    sm:px-3.5
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


                {/* RECIPIENT MENU */}
                <div
                  className={`
                    absolute
                    left-0
                    top-[calc(100%+8px)]
                    z-40
                    max-h-[320px]
                    w-[min(320px,calc(100vw-40px))]
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

                  <button
                    type="button"
                    onClick={() =>
                      handleRecipient(
                        "all",
                      )
                    }
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
                          onClick={() =>
                            handleRecipient(
                              person.slug,
                            )
                          }
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


              {/* SORT */}
              <div
                ref={sortRef}
                className="relative"
              >

                <button
                  type="button"
                  onClick={() => {
                    setSortOpen(
                      (current) =>
                        !current,
                    )

                    setRecipientOpen(false)
                  }}
                  aria-expanded={
                    sortOpen
                  }
                  className="
                    flex h-11
                    min-w-[112px]
                    items-center
                    justify-between
                    gap-2
                    rounded-xl
                    border
                    border-zinc-200
                    bg-white
                    px-3
                    text-sm
                    font-medium
                    text-zinc-700
                    transition-all
                    duration-200
                    hover:border-zinc-300
                    hover:bg-zinc-50
                    focus:outline-none
                    focus:ring-4
                    focus:ring-zinc-100
                    sm:min-w-[180px]
                    sm:px-3.5
                  "
                >

                  <span className="flex items-center gap-2">

                    <SlidersHorizontal
                      size={14}
                      strokeWidth={2}
                      className="shrink-0 text-zinc-400"
                    />


                    <span className="sm:hidden">

                      {sort === "newest"
                        ? "Newest"
                        : sort === "oldest"
                          ? "Oldest"
                          : "A–Z"}

                    </span>


                    <span className="hidden sm:inline">
                      {selectedSort.label}
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
                        sortOpen
                          ? "rotate-180"
                          : ""
                      }
                    `}
                  />

                </button>


                {/* SORT MENU */}
                <div
                  className={`
                    absolute
                    right-0
                    top-[calc(100%+8px)]
                    z-40
                    w-[190px]
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
                          onClick={() =>
                            handleSort(
                              option.value,
                            )
                          }
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
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      handleCategory(item)
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
                        category === item
                          ? "border-zinc-950 bg-zinc-950 text-white shadow-sm"
                          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
                      }
                    `}
                  >
                    {item}
                  </button>
                ),
              )}

            </div>


            {/* =====================================
                CONTENT
            ===================================== */}

            {loading ? (

              <div className="mt-6 grid gap-3 lg:grid-cols-2">

                {Array.from({
                  length: 4,
                }).map((_, index) => (

                  <div
                    key={index}
                    className="h-[200px] animate-pulse rounded-2xl border border-zinc-200 bg-zinc-50"
                  />

                ))}

              </div>

            ) : loadError ? (

              <div className="mt-6 flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 px-6 text-center">

                <MessageCircle
                  size={20}
                  className="text-zinc-400"
                />

                <p className="mt-4 text-sm font-semibold text-zinc-900">
                  Couldn&apos;t load messages
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  {loadError}
                </p>

              </div>

            ) : (

              <>

                {/* COUNT */}
                <div
                  id="message-results"
                  className="scroll-mt-24 mt-6"
                >

                  <div className="flex items-center justify-between gap-4">

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


                    {filteredMessages.length >
                      PAGE_SIZE && (

                      <p className="text-xs text-zinc-400">
                        Page{" "}
                        <span className="font-medium text-zinc-700">
                          {currentPage}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium text-zinc-700">
                          {totalPages}
                        </span>
                      </p>

                    )}

                  </div>

                </div>


                {/* =====================================
                    MESSAGE GRID
                ===================================== */}

                {filteredMessages.length >
                0 ? (

                  <div
                    key={`${category}-${recipient}-${sort}-${currentPage}`}
                    className="animate-filter-enter mt-5 grid gap-3 lg:grid-cols-2"
                  >

                    {paginatedMessages.map(
                      (item) => {
                        const person =
                          peopleBySlug.get(
                            item.recipient_slug,
                          )

                        if (!person) {
                          return null
                        }


                        const longMessage =
                          item.message.length >
                          180


                        const preview =
                          getMessagePreview(
                            item.message,
                            180,
                          )


                        return (
                          <article
                            key={item.id}
                            role="button"
                            tabIndex={0}
                            aria-label={`Open message from ${item.sender_name}`}
                            onClick={() =>
                              setSelectedMessage(
                                item,
                              )
                            }
                            onKeyDown={(
                              event,
                            ) => {
                              if (
                                event.key ===
                                  "Enter" ||
                                event.key ===
                                  " "
                              ) {
                                event.preventDefault()

                                setSelectedMessage(
                                  item,
                                )
                              }
                            }}
                            className="
                              animate-message-enter
                              group
                              h-[200px]
                              cursor-pointer
                              overflow-hidden
                              rounded-2xl
                              border
                              border-zinc-200
                              bg-white
                              p-4
                              shadow-[0_1px_2px_rgba(0,0,0,0.025)]
                              transition-all
                              duration-200
                              hover:-translate-y-[1px]
                              hover:border-zinc-300
                              hover:shadow-[0_10px_32px_rgba(0,0,0,0.055)]
                              focus:outline-none
                              focus:ring-4
                              focus:ring-zinc-100
                              sm:p-5
                            "
                          >

                            <div className="flex h-full flex-col">

                              {/* CARD HEADER */}
                              <div className="flex shrink-0 items-start gap-3">

                                <img
                                  src={`https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(
                                    item.avatar_seed,
                                  )}`}
                                  alt=""
                                  loading="lazy"
                                  className="h-10 w-10 shrink-0 rounded-full border border-zinc-200 bg-zinc-100"
                                />


                                <div className="min-w-0 flex-1">

                                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">

                                    <p className="truncate text-sm font-semibold text-zinc-950">
                                      {
                                        item.sender_name
                                      }
                                    </p>


                                    <span className="shrink-0 text-[11px] text-zinc-400">

                                      {new Date(
                                        item.created_at,
                                      ).toLocaleString(
                                        [],
                                        {
                                          month:
                                            "short",
                                          day:
                                            "numeric",
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
                                    onClick={(
                                      event,
                                    ) => {
                                      event.stopPropagation()

                                      smoothNavigate(
                                        `/faculty/${person.slug}`,
                                      )
                                    }}
                                    className="group/recipient mt-1 flex max-w-full items-center gap-1 text-left text-xs text-zinc-400 transition-colors duration-200 hover:text-zinc-700"
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
                                      className="shrink-0 transition-transform duration-200 group-hover/recipient:translate-x-0.5"
                                    />

                                  </button>

                                </div>

                              </div>


                              {/* MESSAGE PREVIEW */}
                              <div className="mt-4 min-h-0 flex-1">

                                <p className="max-h-[72px] overflow-hidden whitespace-pre-wrap break-words text-[14px] leading-6 text-zinc-600">

                                  {longMessage
                                    ? `${preview}...`
                                    : item.message}

                                </p>

                              </div>


                              {/* OPEN MESSAGE */}
                              <div className="mt-auto flex shrink-0 items-center gap-1 pt-2 text-xs font-semibold text-zinc-500 transition-colors duration-200 group-hover:text-zinc-950">

                                {longMessage
                                  ? "View full message"
                                  : "Open message"}

                                <ArrowRight
                                  size={12}
                                  strokeWidth={2}
                                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                                />

                              </div>

                            </div>

                          </article>
                        )
                      },
                    )}

                  </div>

                ) : (

                  /* EMPTY STATE */

                  <div className="animate-filter-enter mt-5 flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/40 px-6 text-center">

                    <MessageCircle
                      size={18}
                      className="text-zinc-500"
                    />

                    <h3 className="mt-4 text-sm font-semibold text-zinc-900">
                      No messages found
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500">
                      Try another search,
                      recipient, or category.
                    </p>

                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-4 rounded-md px-3 py-2 text-sm font-medium text-zinc-950 transition-colors duration-200 hover:bg-zinc-100"
                    >
                      Clear filters
                    </button>

                  </div>

                )}


                {/* =====================================
                    PAGINATION
                ===================================== */}

                {filteredMessages.length >
                  PAGE_SIZE && (

                  <nav
                    aria-label="Message pagination"
                    className="mt-8 flex flex-col items-center gap-3"
                  >

                    <div className="flex items-center justify-center gap-1.5">

                      {/* PREVIOUS */}
                      <button
                        type="button"
                        onClick={() =>
                          goToPage(
                            currentPage - 1,
                          )
                        }
                        disabled={
                          currentPage === 1
                        }
                        aria-label="Previous page"
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-lg
                          border
                          border-zinc-200
                          bg-white
                          text-zinc-600
                          transition-all
                          duration-200
                          hover:border-zinc-300
                          hover:bg-zinc-50
                          hover:text-zinc-950
                          disabled:pointer-events-none
                          disabled:opacity-35
                        "
                      >

                        <ChevronLeft
                          size={15}
                          strokeWidth={2}
                        />

                      </button>


                      {/* PAGE NUMBERS */}
                      {paginationItems.map(
                        (item) => {
                          if (
                            item ===
                              "left-ellipsis" ||
                            item ===
                              "right-ellipsis"
                          ) {
                            return (
                              <span
                                key={item}
                                className="flex h-9 w-7 items-center justify-center text-sm text-zinc-400"
                              >
                                …
                              </span>
                            )
                          }

                          const active =
                            item ===
                            currentPage

                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() =>
                                goToPage(
                                  item,
                                )
                              }
                              aria-current={
                                active
                                  ? "page"
                                  : undefined
                              }
                              className={`
                                flex
                                h-9
                                min-w-9
                                items-center
                                justify-center
                                rounded-lg
                                border
                                px-2.5
                                text-sm
                                font-medium
                                transition-all
                                duration-200

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


                      {/* NEXT */}
                      <button
                        type="button"
                        onClick={() =>
                          goToPage(
                            currentPage + 1,
                          )
                        }
                        disabled={
                          currentPage ===
                          totalPages
                        }
                        aria-label="Next page"
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-lg
                          border
                          border-zinc-200
                          bg-white
                          text-zinc-600
                          transition-all
                          duration-200
                          hover:border-zinc-300
                          hover:bg-zinc-50
                          hover:text-zinc-950
                          disabled:pointer-events-none
                          disabled:opacity-35
                        "
                      >

                        <ChevronRight
                          size={15}
                          strokeWidth={2}
                        />

                      </button>

                    </div>


                    <p className="text-xs text-zinc-400">
                      Showing{" "}
                      <span className="font-medium text-zinc-600">
                        {startIndex + 1}
                      </span>
                      {" – "}
                      <span className="font-medium text-zinc-600">
                        {Math.min(
                          startIndex +
                            PAGE_SIZE,
                          filteredMessages.length,
                        )}
                      </span>
                      {" of "}
                      <span className="font-medium text-zinc-600">
                        {
                          filteredMessages.length
                        }
                      </span>
                    </p>

                  </nav>

                )}

              </>

            )}

          </div>

        </section>

      </main>


      {/* =========================================
          MESSAGE MODAL
      ========================================= */}

      {selectedMessage &&
        createPortal(
          (() => {
            const person =
              peopleBySlug.get(
                selectedMessage.recipient_slug,
              )

            if (!person) {
              return null
            }

            return (
              <div
                className="
                  fixed
                  inset-0
                  z-[9999]
                  grid
                  place-items-center
                  bg-black/40
                  p-4
                  backdrop-blur-[3px]
                  sm:p-6
                "
                onClick={() =>
                  setSelectedMessage(
                    null,
                  )
                }
              >

                <div
                  role="dialog"
                  aria-modal="true"
                  aria-label="Full appreciation message"
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                  className="
                    animate-scale-enter
                    w-full
                    max-w-[560px]
                    rounded-2xl
                    border
                    border-zinc-200
                    bg-white
                    p-5
                    shadow-[0_24px_80px_rgba(0,0,0,0.22)]
                    sm:p-6
                  "
                >

                  {/* MODAL HEADER */}
                  <div className="flex items-start gap-3">

                    <img
                      src={`https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(
                        selectedMessage.avatar_seed,
                      )}`}
                      alt=""
                      className="h-11 w-11 shrink-0 rounded-full border border-zinc-200 bg-zinc-100"
                    />


                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">

                        <p className="text-sm font-semibold text-zinc-950">
                          {
                            selectedMessage.sender_name
                          }
                        </p>


                        <span className="text-[11px] text-zinc-400">

                          {new Date(
                            selectedMessage.created_at,
                          ).toLocaleString(
                            [],
                            {
                              month:
                                "short",
                              day:
                                "numeric",
                              year:
                                "numeric",
                              hour:
                                "2-digit",
                              minute:
                                "2-digit",
                            },
                          )}

                        </span>

                      </div>


                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMessage(
                            null,
                          )

                          smoothNavigate(
                            `/faculty/${person.slug}`,
                          )
                        }}
                        className="group mt-1 flex max-w-full items-center gap-1 text-left text-xs text-zinc-400 transition-colors duration-200 hover:text-zinc-700"
                      >

                        <span className="shrink-0">
                          To:
                        </span>

                        <span className="truncate font-medium">
                          {person.name}
                        </span>

                        <ArrowRight
                          size={11}
                          strokeWidth={2}
                          className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                        />

                      </button>

                    </div>

                  </div>


                  {/* FULL MESSAGE */}
                  <div className="mt-5 border-t border-zinc-100 pt-5">

                    <p className="whitespace-pre-wrap break-words text-[15px] leading-7 text-zinc-700">
                      {
                        selectedMessage.message
                      }
                    </p>

                  </div>


                  {/* SINGLE CLOSE ACTION */}
                  <div className="mt-6 flex justify-end">

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedMessage(
                          null,
                        )
                      }
                      className="
                        flex
                        h-10
                        items-center
                        justify-center
                        rounded-lg
                        bg-zinc-950
                        px-4
                        text-sm
                        font-medium
                        text-white
                        transition-all
                        duration-200
                        hover:bg-zinc-800
                        active:scale-[0.98]
                      "
                    >
                      Close
                    </button>

                  </div>

                </div>

              </div>
            )
          })(),
          document.body,
        )}


      {/* =========================================
          FOOTER
      ========================================= */}

      <footer className="mt-14 border-t border-zinc-200 bg-white">

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

export default Messages