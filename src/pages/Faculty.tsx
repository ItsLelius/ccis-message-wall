import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { useNavigate } from "react-router-dom"

import {
  ArrowLeft,
  Check,
  ChevronDown,
  Search,
  SlidersHorizontal,
} from "lucide-react"

import ccisLogo from "../assets/ccis-logo.png"

import {
  facultyMembers,
  type FacultyCategory,
} from "../data/faculty"


type CategoryFilter = "All" | FacultyCategory

type SortOption = "az" | "za"


const categories: CategoryFilter[] = [
  "All",
  "CCIS",
  "BLIS",
  "Personnel",
]


const sortOptions: {
  value: SortOption
  label: string
  shortLabel: string
}[] = [
  {
    value: "az",
    label: "Name: A–Z",
    shortLabel: "A–Z",
  },
  {
    value: "za",
    label: "Name: Z–A",
    shortLabel: "Z–A",
  },
]


const Faculty = () => {
  const navigate = useNavigate()

  const [search, setSearch] = useState("")
  const [category, setCategory] =
    useState<CategoryFilter>("All")

  const [sort, setSort] =
    useState<SortOption>("az")

  const [sortOpen, setSortOpen] =
    useState(false)

  const [isLeaving, setIsLeaving] =
    useState(false)

  const sortRef =
    useRef<HTMLDivElement>(null)


  // Close sort menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent,
    ) => {
      if (
        sortRef.current &&
        !sortRef.current.contains(
          event.target as Node,
        )
      ) {
        setSortOpen(false)
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    )

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      )
    }
  }, [])


  // Close sort menu with Escape
  useEffect(() => {
    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setSortOpen(false)
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


  // Search + filter + sorting
  const filteredFaculty = useMemo(() => {
    const query =
      search.trim().toLowerCase()

    let results =
      facultyMembers.filter((member) => {
        const matchesSearch =
          member.name
            .toLowerCase()
            .includes(query)

        const matchesCategory =
          category === "All" ||
          member.category === category

        return (
          matchesSearch &&
          matchesCategory
        )
      })

    results = [...results].sort(
      (a, b) => {
        if (sort === "az") {
          return a.name.localeCompare(
            b.name,
          )
        }

        return b.name.localeCompare(
          a.name,
        )
      },
    )

    return results
  }, [search, category, sort])


  const currentSort =
    sortOptions.find(
      (option) =>
        option.value === sort,
    ) ?? sortOptions[0]


  // Smooth page navigation
  const smoothNavigate = (
    path: string,
  ) => {
    if (isLeaving) return

    setIsLeaving(true)

    window.setTimeout(() => {
      navigate(path)
    }, 180)
  }


  const goHome = () => {
    smoothNavigate("/")
  }


  const goToPerson = (
    slug: string,
  ) => {
    smoothNavigate(
      `/faculty/${slug}`,
    )
  }


  const selectSort = (
    value: SortOption,
  ) => {
    setSort(value)
    setSortOpen(false)
  }


  const clearFilters = () => {
    setSearch("")
    setCategory("All")
    setSort("az")
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

      {/* ========================================
          NAVBAR
      ======================================== */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/95 backdrop-blur-xl">

        <div className="mx-auto flex h-[60px] max-w-7xl items-center justify-between px-5 sm:h-16 sm:px-8 lg:px-10">

          {/* Brand */}
          <button
            type="button"
            onClick={goHome}
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


          {/* Back Home */}
          <button
            type="button"
            onClick={goHome}
            disabled={isLeaving}
            aria-label="Back to home"
            className="
              group
              flex h-9 w-9
              items-center justify-center
              rounded-lg
              border border-zinc-200
              bg-white
              text-zinc-700
              transition-all duration-200
              hover:-translate-y-[1px]
              hover:border-zinc-300
              hover:bg-zinc-50
              hover:shadow-sm
              active:translate-y-0
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
              Back home
            </span>

          </button>

        </div>

      </header>


      <main>

        {/* ========================================
            PAGE INTRO
        ======================================== */}
        <section className="border-b border-zinc-200/70">

          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-11 lg:px-10 lg:py-13">

            <div className="max-w-3xl">

              <h1 className="max-w-[560px] text-[35px] font-semibold leading-[1.02] tracking-[-0.045em] text-zinc-950 sm:text-5xl lg:text-6xl">

                Who would you like{" "}

                <span className="text-zinc-400">
                  to thank?
                </span>

              </h1>


              <p className="mt-4 max-w-xl text-[14px] leading-6 text-zinc-500 sm:mt-5 sm:text-base sm:leading-7">

                Find someone from CCIS,
                BLIS, or our personnel
                community and leave them a
                message for Teachers&apos; Day.

              </p>

            </div>

          </div>

        </section>


        {/* ========================================
            DIRECTORY
        ======================================== */}
        <section>

          <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 sm:py-8 lg:px-10">

            {/* SEARCH + SORT */}
            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2.5 border-b border-zinc-200 pb-5 sm:gap-3">

              {/* Search */}
              <div className="relative min-w-0">

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
                  placeholder="Search by name..."
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border border-zinc-200
                    bg-white
                    pl-10 pr-3
                    text-[14px]
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


              {/* CUSTOM SORT */}
              <div
                ref={sortRef}
                className="relative"
              >

                <button
                  type="button"
                  onClick={() =>
                    setSortOpen(
                      (previous) =>
                        !previous,
                    )
                  }
                  aria-expanded={sortOpen}
                  className="
                    group
                    flex h-11
                    min-w-[100px]
                    items-center
                    justify-between
                    gap-2
                    rounded-xl
                    border border-zinc-200
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
                    sm:min-w-[155px]
                    sm:px-3.5
                  "
                >

                  <span className="flex items-center gap-2">

                    <SlidersHorizontal
                      size={14}
                      strokeWidth={2}
                      className="text-zinc-400"
                    />

                    <span className="sm:hidden">
                      {
                        currentSort.shortLabel
                      }
                    </span>

                    <span className="hidden sm:inline">
                      {
                        currentSort.label
                      }
                    </span>

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


                {/* Dropdown Menu */}
                <div
                  className={`
                    absolute
                    right-0
                    top-[calc(100%+8px)]
                    z-40
                    w-[180px]
                    origin-top-right
                    overflow-hidden
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
                            selectSort(
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

                          {
                            option.label
                          }

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


            {/* ========================================
                FILTERS
            ======================================== */}
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


            {/* RESULT COUNT */}
            <div className="mt-6">

              <p className="text-sm text-zinc-500">

                <span className="font-semibold text-zinc-950">
                  {
                    filteredFaculty.length
                  }
                </span>{" "}

                {filteredFaculty.length ===
                1
                  ? "person"
                  : "people"}

              </p>

            </div>


            {/* ========================================
                PEOPLE GRID
            ======================================== */}
            {filteredFaculty.length >
            0 ? (

              <div
                key={`${category}-${sort}-${search}`}
                className="
                  animate-filter-enter
                  mt-5
                  grid
                  grid-cols-1
                  gap-3
                  sm:grid-cols-2
                  sm:gap-4
                  lg:grid-cols-3
                "
              >

                {filteredFaculty.map(
                  (member) => (

                    <button
                      key={member.id}
                      type="button"
                      onClick={() =>
                        goToPerson(
                          member.slug,
                        )
                      }
                      disabled={
                        isLeaving
                      }
                      className="
                        group
                        relative
                        flex
                        min-h-[88px]
                        appearance-none
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-2xl
                        border
                        border-zinc-200/80
                        bg-white
                        px-5
                        py-6
                        text-center
                        shadow-[0_1px_2px_rgba(0,0,0,0.03)]
                        transition-all
                        duration-300
                        ease-out

                        hover:-translate-y-0.5
                        hover:border-zinc-300
                        hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]

                        active:translate-y-0
                        active:scale-[0.995]

                        disabled:pointer-events-none

                        sm:min-h-[96px]
                      "
                    >

                      {/* Minimal blue top accent */}
                      <div
                        aria-hidden="true"
                        className="
                          absolute
                          inset-x-6
                          top-0
                          h-px
                          bg-gradient-to-r
                          from-transparent
                          via-blue-500/35
                          to-transparent
                        "
                      />


                      {/* Very subtle hover glow */}
                      <div
                        aria-hidden="true"
                        className="
                          absolute
                          -right-12
                          -top-12
                          h-28
                          w-28
                          rounded-full
                          bg-blue-50
                          opacity-0
                          blur-2xl
                          transition-opacity
                          duration-300
                          group-hover:opacity-100
                        "
                      />


                      {/* Name only */}
                      <h2 className="
                        relative
                        text-[16px]
                        font-semibold
                        leading-snug
                        tracking-[-0.02em]
                        !text-zinc-950
                        transition-transform
                        duration-300
                        group-hover:scale-[1.01]
                        sm:text-[17px]
                      ">
                        {member.name}
                      </h2>

                    </button>

                  ),
                )}

              </div>

            ) : (

              /* ======================================
                  EMPTY STATE
              ====================================== */
              <div
                key={`${category}-${search}`}
                className="animate-filter-enter flex min-h-[260px] flex-col items-center justify-center text-center"
              >

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100">

                  <Search
                    size={17}
                    strokeWidth={2}
                    className="text-zinc-500"
                  />

                </div>


                <h3 className="mt-4 text-sm font-semibold text-zinc-900">
                  No one found
                </h3>


                <p className="mt-1 text-sm text-zinc-500">
                  Try another name or
                  category.
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

          </div>

        </section>

      </main>


      {/* ========================================
          FOOTER
      ======================================== */}
      <footer className="mt-12 border-t border-zinc-200 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col items-center px-5 py-6 text-center sm:px-8 lg:px-10">

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

export default Faculty