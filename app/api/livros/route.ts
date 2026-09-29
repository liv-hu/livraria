import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("livros")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    return Response.json(
      { error: "Erro ao buscar os livros." },
      { status: 500 }
    );
  }

  return Response.json(data);
}