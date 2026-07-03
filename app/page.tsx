import { supabase } from "../lib/supabase";
export default async function Page() {
  const { data } = await supabase.from("songs").select("*").limit(10);

  return (
    <div>
      {data?.map((song) => (
        <p key={song.id}>{song.track_name}</p>
      ))}
    </div>
  );
}
