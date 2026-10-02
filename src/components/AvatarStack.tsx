type AvatarStackProps = {
  count: number
  loading?: boolean
}

const avatarSeeds = [
  "ccis-student-1",
  "ccis-student-2",
  "ccis-student-3",
  "ccis-student-4",
]


const AvatarStack = ({
  count,
  loading = false,
}: AvatarStackProps) => {
  return (
    <div className="flex items-center">

      <div className="flex -space-x-2">

        {avatarSeeds.map(
          (seed) => (
            <img
              key={seed}
              src={`https://api.dicebear.com/9.x/notionists/svg?seed=${seed}`}
              alt=""
              className="h-9 w-9 rounded-full border-2 border-white bg-zinc-100 object-cover"
            />
          ),
        )}

      </div>


      <div className="-ml-1 flex h-9 min-w-9 items-center justify-center rounded-full border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-700 shadow-sm">

        {loading ? (
          <span className="inline-block h-3 w-5 animate-pulse rounded bg-zinc-200" />
        ) : (
          count.toLocaleString()
        )}

      </div>

    </div>
  )
}

export default AvatarStack