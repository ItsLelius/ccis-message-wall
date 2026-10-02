import { useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  ArrowRight,
  Mail,
  MessageCircle,
  Users,
} from "lucide-react"

import Navbar from "../components/Navbar"
import AvatarStack from "../components/AvatarStack"

const Home = () => {
  const navigate = useNavigate()

  const [isLeaving, setIsLeaving] =
    useState(false)

  const smoothNavigate = (
    path: string,
  ) => {
    if (isLeaving) return

    setIsLeaving(true)

    window.setTimeout(() => {
      navigate(path)
    }, 180)
  }

  const goToDirectory = () => {
    smoothNavigate("/faculty")
  }

  const goToMessages = () => {
    smoothNavigate("/messages")
  }

  return (
    <div
      className={`
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
      <Navbar />

      <main>

        {/* =========================================
            HERO
        ========================================= */}
        <section
          id="home"
          className="relative overflow-hidden border-b border-zinc-200/70"
        >

          {/* Soft Background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute left-1/2 top-[-120px] h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-blue-50/80 blur-3xl sm:h-[500px] sm:w-[900px]" />
          </div>


          <div className="relative mx-auto flex min-h-[calc(100svh-65px)] max-w-7xl flex-col items-center justify-center px-5 py-14 text-center sm:px-8 sm:py-20 lg:px-10">

            {/* Badge */}
            <div className="mb-7 inline-flex items-center rounded-full border border-zinc-200/80 bg-white/95 px-4 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] backdrop-blur">

              <span className="text-[12px] font-medium tracking-[-0.01em] text-zinc-600 sm:text-[13px]">
                Celebrating Teachers&apos; Day · 2026
              </span>

            </div>


            {/* Main Heading */}
            <h1 className="max-w-[680px] text-balance text-[38px] font-semibold leading-[1.04] tracking-[-0.045em] text-zinc-950 sm:max-w-4xl sm:text-6xl md:text-7xl lg:text-[82px]">

              To the people who taught us{" "}

              <span className="text-zinc-400">
                how to keep going.
              </span>

            </h1>


            {/* Description */}
            <p className="mt-6 max-w-[520px] text-pretty text-[15px] leading-7 text-zinc-500 sm:mt-7 sm:max-w-2xl sm:text-lg sm:leading-8">

              A small space for our computing and
              information sciences community to celebrate
              the people who guide, support, inspire, and
              believe in us.

            </p>


            {/* =====================================
                HERO ACTIONS
            ===================================== */}
            <div className="mt-8 flex w-full max-w-[360px] flex-col items-stretch justify-center gap-3 sm:w-auto sm:max-w-none sm:flex-row">

              {/* Leave a Message */}
              <button
                type="button"
                onClick={goToDirectory}
                disabled={isLeaving}
                className="
                  group
                  flex h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-md
                  bg-zinc-950
                  px-5
                  text-sm
                  font-medium
                  text-white
                  transition-all
                  duration-200
                  hover:-translate-y-[1px]
                  hover:bg-zinc-800
                  hover:shadow-md
                  active:translate-y-0
                  active:scale-[0.99]
                  disabled:pointer-events-none
                "
              >

                <Mail
                  size={15}
                  strokeWidth={2}
                  className="transition-transform duration-200 group-hover:-translate-y-0.5"
                />

                Leave a message

                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />

              </button>


              {/* View Messages */}
              <button
                type="button"
                onClick={goToMessages}
                disabled={isLeaving}
                className="
                  group
                  flex h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-md
                  border
                  border-zinc-200
                  bg-white
                  px-5
                  text-sm
                  font-medium
                  text-zinc-800
                  shadow-sm
                  transition-all
                  duration-200
                  hover:-translate-y-[1px]
                  hover:border-zinc-300
                  hover:bg-zinc-50
                  hover:shadow-md
                  active:translate-y-0
                  active:scale-[0.99]
                  disabled:pointer-events-none
                "
              >

                <MessageCircle
                  size={15}
                  strokeWidth={2}
                  className="text-zinc-500 transition-transform duration-200 group-hover:scale-105"
                />

                View Messages

                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />

              </button>

            </div>


            {/* =====================================
                SOCIAL PROOF
            ===================================== */}
            <div className="mt-10 flex flex-col items-center gap-3 sm:mt-12 sm:flex-row sm:gap-4">

              <AvatarStack />

              <div className="text-center sm:text-left">

                <div className="flex items-center justify-center gap-1.5 sm:justify-start">

                  <MessageCircle
                    size={13}
                    strokeWidth={2}
                    className="text-zinc-500"
                  />

                  <p className="text-sm font-medium text-zinc-800">
                    Messages shared with our community
                  </p>

                </div>

                <p className="mt-0.5 text-xs text-zinc-500">
                  Shared with appreciation by our students.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =========================================
            MESSAGE SECTION
        ========================================= */}
        <section
          id="about"
          className="border-b border-zinc-200/70 bg-white"
        >

          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">

            <div className="mx-auto max-w-4xl">

              {/* Label */}
              <div className="flex items-center gap-3">

                <div className="h-px w-7 bg-blue-600" />

                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 sm:text-xs">
                  A message from CCIS
                </p>

              </div>


              {/* Heading */}
              <h2 className="mt-7 max-w-4xl text-[34px] font-semibold leading-[1.08] tracking-[-0.04em] text-zinc-950 sm:text-5xl lg:text-6xl">

                Every lesson leaves{" "}

                <span className="text-zinc-400">
                  something behind.
                </span>

              </h2>


              {/* Content */}
              <div className="mt-8 grid gap-5 border-t border-zinc-200 pt-7 sm:mt-10 sm:pt-8 md:grid-cols-2 md:gap-12">

                <p className="text-[15px] leading-7 text-zinc-500 sm:text-base sm:leading-8">

                  Beyond lectures, activities, projects,
                  and deadlines are lessons that stay with
                  us long after the semester ends.

                </p>


                <p className="text-[15px] leading-7 text-zinc-500 sm:text-base sm:leading-8">

                  Today, we get the chance to recognize the
                  people who helped shape our journey and
                  simply say{" "}

                  <span className="font-medium text-zinc-950">
                    thank you.
                  </span>

                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =========================================
            DIRECTORY SECTION
        ========================================= */}
        <section
          id="directory"
          className="bg-zinc-50/60"
        >

          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">

            <div className="mx-auto max-w-2xl text-center">

              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 sm:text-xs">
                Our Community
              </p>


              <h2 className="mt-4 text-[32px] font-semibold leading-tight tracking-[-0.035em] text-zinc-950 sm:text-4xl">

                Who would you like to thank?

              </h2>


              <p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-zinc-500 sm:text-base">

                Find someone from CCIS, BLIS, or our
                personnel community and leave them a
                message of appreciation.

              </p>


              <button
                type="button"
                onClick={goToDirectory}
                disabled={isLeaving}
                className="
                  group
                  mt-7
                  inline-flex
                  h-11
                  items-center
                  gap-2
                  rounded-md
                  border
                  border-zinc-200
                  bg-white
                  px-5
                  text-sm
                  font-medium
                  text-zinc-800
                  shadow-sm
                  transition-all
                  duration-200
                  hover:-translate-y-[1px]
                  hover:border-zinc-300
                  hover:bg-zinc-100
                  hover:shadow-md
                  active:translate-y-0
                  active:scale-[0.99]
                  disabled:pointer-events-none
                "
              >

                <Users
                  size={15}
                  strokeWidth={2}
                  className="text-zinc-500"
                />

                Browse directory

                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />

              </button>

            </div>

          </div>

        </section>

      </main>


      {/* =========================================
          FOOTER
      ========================================= */}
      <footer className="border-t border-zinc-200 bg-white">

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

export default Home