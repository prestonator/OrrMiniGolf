import { useQuery } from "@tanstack/react-query";
import { AuthForm } from "../components/AuthForm";
import { supabase } from "../utils/supabase";

export default function Login() {
  const { data: players, isLoading } = useQuery({
    queryKey: ["players"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username")
        .order("username", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="min-h-screen bg-[#d9c5a0] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] mix-blend-multiply pointer-events-none" />

      <div className="relative w-full max-w-md bg-[#f4ecd8] border-[6px] border-double border-[#5c3a21] shadow-2xl rounded-sm p-6 sm:p-8 z-10">
        {isLoading ? (
          <div className="text-center text-[#5c3a21]">Loading players...</div>
        ) : (
          <AuthForm players={players || []} />
        )}
      </div>
    </div>
  );
}
