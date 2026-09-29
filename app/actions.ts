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
throw new Error("Não foi possível adicionar a transação.");
}

revalidatePath("/");
}

export async function excluirTransacao(formData: FormData) {
const id = Number(formData.get("id"));

if (!id) {
throw new Error("ID da transação não encontrado.");
}

const supabase = await createClient();

const { error } = await supabase
.from("transacoes")
.delete()
.eq("id", id);

if (error) {
console.error("Erro ao excluir transação:", error);
throw new Error("Não foi possível excluir a transação.");
}

revalidatePath("/");
}