import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const { data: livros, error } = await supabase
    .from("livros")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-100 px-6">
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-stone-900">
            Erro ao carregar os livros
          </h1>

          <p className="mt-3 text-stone-500">
            Não foi possível acessar o catálogo.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-100 text-stone-900">
      {/* Cabeçalho */}
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              📚 Livraria
            </h1>

            <p className="text-sm text-stone-500">
              Encontre sua próxima leitura
            </p>
          </div>

          <Link
            href="/login"
            className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-700"
          >
            Entrar
          </Link>
        </div>
      </header>

      {/* Conteúdo */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Nosso catálogo</h2>

          <p className="mt-2 text-stone-600">
            Explore nossa seleção de livros.
          </p>
        </div>

        {/* Grade de livros */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {livros.map((livro) => (
            <article
              key={livro.id}
              className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="h-72 bg-stone-200">
                <img
                  src={livro.imagem}
                  alt={`Capa de ${livro.titulo}`}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  {livro.genero ?? "Sem gênero informado"}
                </span>

                <h3 className="mt-2 line-clamp-2 text-lg font-bold">
                  {livro.titulo}
                </h3>

                <p className="mt-1 text-sm font-medium text-stone-600">
                  {livro.autor}
                </p>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-500">
                  {livro.descricao ?? "Descrição não informada."}
                </p>

                <button className="mt-5 w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-medium transition hover:bg-stone-100">
                  Ver detalhes
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}