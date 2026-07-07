import Image from "next/image";
import { supabase } from "@/lib/supabase";

type Song = {
  id: number;
  track_name: string;
  artist: string;
  album_name?: string;
  album_cover?: string | null;
  moods?: string[];
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  let request = supabase
    .from("songs")
    .select("id, track_name, artist, album_name, album_cover, moods")
    .limit(24);

  if (query) {
    request = request.or(
      `track_name.ilike.%${query}%,artist.ilike.%${query}%,album_name.ilike.%${query}%`,
    );
  }

  const { data: songs, error } = await request;

  if (error) {
    return <div className="p-8 text-red-500">{error.message}</div>;
  }

  const results = (songs ?? []) as Song[];

  return (
    <main className="min-h-screen px-6 py-8">
      {/* SEARCH BAR */}
      <form className="mx-auto mb-8 max-w-xl" method="get">
        <input
          name="q"
          defaultValue={query}
          placeholder="Search songs, artists, albums..."
          className="w-full rounded-2xl border px-4 py-3 shadow-sm outline-none"
        />
      </form>

      {/* RESULTS */}
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {results.map((song) => (
          <div
            key={song.id}
            className="rounded-2xl border p-3 shadow-sm hover:shadow-md"
          >
            {song.album_cover ? (
              <Image
                src={song.album_cover}
                alt={`Album cover for ${song.track_name}`}
                className="aspect-square w-full rounded-xl object-cover"
                width={200}
                height={200}
              />
            ) : (
              <div className="aspect-square w-full rounded-xl bg-gray-200" />
            )}

            <h2 className="mt-2 font-semibold">{song.track_name}</h2>
            <p className="text-sm text-gray-400">{song.artist}</p>

            {/* MOODS */}
            <div className="mt-2 flex flex-wrap gap-1">
              {(song.moods ?? []).slice(0, 3).map((mood) => (
                <span
                  key={mood}
                  className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800"
                >
                  {mood}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      {query && results.length === 0 && (
        <p className="mt-10 text-center text-gray-500">
          No results found for “{query}”
        </p>
      )}
    </main>
  );
}
