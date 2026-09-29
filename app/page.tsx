import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LogoutButton from "./LogoutButton";
import { adicionarTransacao } from "./actions";

export default async function Home() {
  const supabase = await createClient();

  // Verifica se existe usuário logado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Busca as transações no banco
  const { data: transacoes, error } = await supabase
    .from("transacoes")
    .select("*")
    .order("criado_em", { ascending: false });

  if (error) {
    return (
      <main
        className="flex min-h-screen items-center justify-center px-6"
        style={{
          backgroundColor: "#000000",
          color: "#E4E4E7",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          className="rounded-2xl border p-8 text-center"
          style={{
            backgroundColor: "#151519",
            borderColor: "#4A0F16",
          }}
        >
          <h1 className="text-2xl font-bold">
            Erro ao carregar as transações
          </h1>

          <p className="mt-3" style={{ color: "#B8B8BC" }}>
            Não foi possível acessar o banco de dados.
          </p>
        </div>
      </main>
    );
  }

  // Garante que sempre teremos um array
  const listaTransacoes = transacoes ?? [];

  // Calcula as receitas
  const totalReceitas = listaTransacoes
    .filter((transacao) => transacao.tipo === "receita")
    .reduce(
      (total, transacao) => total + Number(transacao.valor),
      0
    );

  // Calcula as despesas
  const totalDespesas = listaTransacoes
    .filter((transacao) => transacao.tipo === "despesa")
    .reduce(
      (total, transacao) => total + Number(transacao.valor),
      0
    );

  // Calcula o saldo
  const saldo = totalReceitas - totalDespesas;

  // Formata valores em reais
  function formatarMoeda(valor: number) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  // Formata datas
  function formatarData(data: string) {
    return new Date(data).toLocaleDateString("pt-BR");
  }

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{
        backgroundColor: "#000000",
        color: "#E4E4E7",
        fontFamily: "Georgia, serif",
      }}
    >
      {/* FUNDO */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <img
          src="/catedral-gotica.jpg"
          alt=""
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/75" />
      </div>

      {/* CONTEÚDO */}
      <div className="relative z-10">

        {/* CABEÇALHO */}
        <header
          className="border-b"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.90)",
            borderColor: "#4A0F16",
          }}
        >
          <div className="mx-auto flex min-h-[140px] max-w-7xl items-center justify-between px-6 py-8">

            <div>
              <p
                className="mb-2 text-sm uppercase tracking-[0.3em]"
                style={{ color: "#B8B8BC" }}
              >
                Controle financeiro
              </p>

              <h1
                className="text-4xl font-bold sm:text-5xl"
                style={{ color: "#E4E4E7" }}
              >
                Casa Serena
              </h1>

              <p
                className="mt-2"
                style={{ color: "#B8B8BC" }}
              >
                Organize suas finanças
              </p>
            </div>

            {user && <LogoutButton />}

          </div>
        </header>

        {/* CONTEÚDO PRINCIPAL */}
        <section className="mx-auto max-w-7xl px-6 py-12">

          {/* TÍTULO */}
          <div className="mb-10">

            <p
              className="text-sm uppercase tracking-[0.25em]"
              style={{ color: "#B8B8BC" }}
            >
              Visão geral
            </p>

            <h2
              className="mt-2 text-4xl font-bold"
              style={{ color: "#E4E4E7" }}
            >
              Meu financeiro
            </h2>

            <p
              className="mt-3"
              style={{ color: "#B8B8BC" }}
            >
              Acompanhe suas receitas, despesas e saldo atual.
            </p>

          </div>

          {/* DASHBOARD */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

            {/* SALDO */}
            <div
              className="rounded-2xl border p-7 shadow-lg"
              style={{
                backgroundColor: "rgba(21, 21, 25, 0.94)",
                borderColor: "#B8B8BC",
              }}
            >
              <p
                className="text-sm uppercase tracking-wider"
                style={{ color: "#B8B8BC" }}
              >
                Saldo atual
              </p>

              <p
                className="mt-4 text-3xl font-bold"
                style={{
                  color: saldo >= 0 ? "#E4E4E7" : "#C77B84",
                }}
              >
                {formatarMoeda(saldo)}
              </p>
            </div>

            {/* RECEITAS */}
            <div
              className="rounded-2xl border p-7 shadow-lg"
              style={{
                backgroundColor: "rgba(21, 21, 25, 0.94)",
                borderColor: "#4A0F16",
              }}
            >
              <p
                className="text-sm uppercase tracking-wider"
                style={{ color: "#B8B8BC" }}
              >
                Total de receitas
              </p>

              <p
                className="mt-4 text-3xl font-bold"
                style={{ color: "#A8C7A0" }}
              >
                {formatarMoeda(totalReceitas)}
              </p>
            </div>

            {/* DESPESAS */}
            <div
              className="rounded-2xl border p-7 shadow-lg"
              style={{
                backgroundColor: "rgba(21, 21, 25, 0.94)",
                borderColor: "#4A0F16",
              }}
            >
              <p
                className="text-sm uppercase tracking-wider"
                style={{ color: "#B8B8BC" }}
              >
                Total de despesas
              </p>

              <p
                className="mt-4 text-3xl font-bold"
                style={{ color: "#C77B84" }}
              >
                {formatarMoeda(totalDespesas)}
              </p>
            </div>

          </div>

          {/* NOVA TRANSAÇÃO */}
          <div
            className="mt-10 rounded-2xl border p-7 shadow-lg"
            style={{
              backgroundColor: "rgba(21, 21, 25, 0.95)",
              borderColor: "#4A0F16",
            }}
          >

            <div className="mb-6">

              <h2
                className="text-2xl font-bold"
                style={{ color: "#E4E4E7" }}
              >
                Nova transação
              </h2>

              <p
                className="mt-2 text-sm"
                style={{ color: "#B8B8BC" }}
              >
                Registre uma nova receita ou despesa.
              </p>

            </div>

            <form
              action={adicionarTransacao}
              className="grid grid-cols-1 gap-5 md:grid-cols-4"
            >

              {/* DESCRIÇÃO */}
              <div className="md:col-span-2">

                <label
                  htmlFor="descricao"
                  className="mb-2 block text-sm font-semibold"
                  style={{ color: "#E4E4E7" }}
                >
                  Descrição
                </label>

                <input
                  id="descricao"
                  name="descricao"
                  type="text"
                  placeholder="Ex.: Salário, mercado, energia..."
                  required
                  className="w-full rounded-xl border px-4 py-3 outline-none"
                  style={{
                    backgroundColor: "#000000",
                    borderColor: "#4A0F16",
                    color: "#E4E4E7",
                  }}
                />

              </div>

              {/* VALOR */}
              <div>

                <label
                  htmlFor="valor"
                  className="mb-2 block text-sm font-semibold"
                  style={{ color: "#E4E4E7" }}
                >
                  Valor
                </label>

                <input
                  id="valor"
                  name="valor"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="2000.00"
                  required
                  className="w-full rounded-xl border px-4 py-3 outline-none"
                  style={{
                    backgroundColor: "#000000",
                    borderColor: "#4A0F16",
                    color: "#E4E4E7",
                  }}
                />

              </div>

              {/* TIPO */}
              <div>

                <label
                  htmlFor="tipo"
                  className="mb-2 block text-sm font-semibold"
                  style={{ color: "#E4E4E7" }}
                >
                  Classificação
                </label>

                <select
                  id="tipo"
                  name="tipo"
                  required
                  defaultValue="receita"
                  className="w-full rounded-xl border px-4 py-3 outline-none"
                  style={{
                    backgroundColor: "#000000",
                    borderColor: "#4A0F16",
                    color: "#E4E4E7",
                  }}
                >
                  <option value="receita">
                    Receita
                  </option>

                  <option value="despesa">
                    Despesa
                  </option>
                </select>

              </div>

              {/* BOTÃO */}
              <div className="md:col-span-4">

                <button
                  type="submit"
                  className="rounded-xl border px-6 py-3 font-semibold transition hover:opacity-80"
                  style={{
                    backgroundColor: "#4A0F16",
                    borderColor: "#B8B8BC",
                    color: "#E4E4E7",
                  }}
                >
                  Adicionar transação
                </button>

              </div>

            </form>

          </div>

          {/* HISTÓRICO */}
          <div
            className="mt-10 rounded-2xl border shadow-lg"
            style={{
              backgroundColor: "rgba(21, 21, 25, 0.95)",
              borderColor: "#4A0F16",
            }}
          >

            <div
              className="border-b p-7"
              style={{ borderColor: "#4A0F16" }}
            >

              <h2
                className="text-2xl font-bold"
                style={{ color: "#E4E4E7" }}
              >
                Histórico de transações
              </h2>

              <p
                className="mt-2 text-sm"
                style={{ color: "#B8B8BC" }}
              >
                Confira as movimentações registradas.
              </p>

            </div>

            {listaTransacoes.length === 0 ? (

              <div className="p-10 text-center">

                <p
                  className="text-lg"
                  style={{ color: "#B8B8BC" }}
                >
                  Nenhuma transação registrada ainda.
                </p>

                <p
                  className="mt-2 text-sm"
                  style={{ color: "#77777D" }}
                >
                  Adicione sua primeira receita ou despesa acima.
                </p>

              </div>

            ) : (

              <div>

                {listaTransacoes.map((transacao) => {

                  const ehReceita = transacao.tipo === "receita";

                  return (
                    <div
                      key={transacao.id}
                      className="flex items-center justify-between border-b px-7 py-5 last:border-b-0"
                      style={{ borderColor: "#25252A" }}
                    >

                      <div className="flex items-center gap-4">

                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold"
                          style={{
                            backgroundColor: ehReceita
                              ? "#263B29"
                              : "#4A0F16",
                            color: ehReceita
                              ? "#A8C7A0"
                              : "#C77B84",
                          }}
                        >
                          {ehReceita ? "↑" : "↓"}
                        </div>

                        <div>

                          <p
                            className="font-semibold"
                            style={{ color: "#E4E4E7" }}
                          >
                            {transacao.descricao}
                          </p>

                          <p
                            className="mt-1 text-sm"
                            style={{ color: "#77777D" }}
                          >
                            {formatarData(transacao.criado_em)}
                          </p>

                        </div>

                      </div>

                      <p
                        className="font-bold"
                        style={{
                          color: ehReceita
                            ? "#A8C7A0"
                            : "#C77B84",
                        }}
                      >
                        {ehReceita ? "+" : "-"}{" "}
                        {formatarMoeda(Number(transacao.valor))}
                      </p>

                    </div>
                  );

                })}

              </div>

            )}

          </div>

        </section>

        {/* RODAPÉ */}
        <footer
          className="mt-10 border-t"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            borderColor: "#4A0F16",
          }}
        >

          <div className="mx-auto max-w-7xl px-6 py-8 text-center">

            <p
              className="font-bold"
              style={{ color: "#E4E4E7" }}
            >
              Casa Serena
            </p>

            <p
              className="mt-2 text-sm"
              style={{ color: "#B8B8BC" }}
            >
              Controle financeiro pessoal
            </p>

          </div>

        </footer>

      </div>
    </main>
  );
}