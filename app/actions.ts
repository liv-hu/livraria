"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function adicionarTransacao(formData: FormData) {
  const descricao = formData.get("descricao") as string;
  const valor = Number(formData.get("valor"));
  const tipo = formData.get("tipo") as "receita" | "despesa";

  if (!descricao || !valor || !tipo) {
    return;
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("transacoes")
    .insert({
      descricao,
      valor,
      tipo,
    });

  if (error) {
    console.error("Erro ao adicionar transação:", error);
    return;
  }

  revalidatePath("/");
}