"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
const router = useRouter();
const supabase = createClient();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [erro, setErro] = useState("");
const [carregando, setCarregando] = useState(false);

async function handleLogin(event: FormEvent<HTMLFormElement>) {
event.preventDefault();

setErro("");
setCarregando(true);

const { error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

if (error) {
  setErro("E-mail ou senha incorretos.");
  setCarregando(false);
  return;
}

router.push("/");
router.refresh();

}

return (
<main
className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 py-10"
style={{
backgroundImage: "url('/catedral-gotica.jpg')",
backgroundSize: "cover",
backgroundPosition: "center",
}}
>
<div className="absolute inset-0 bg-black/75" />

  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />

  <div className="relative z-10 w-full max-w-md">
    <div
      className="rounded-2xl border p-8 shadow-2xl backdrop-blur-md sm:p-10"
      style={{
        backgroundColor: "rgba(10, 10, 12, 0.88)",
        borderColor: "#4A0F16",
      }}
    >
      <div className="mb-8 text-center">
        <div
          className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border"
          style={{
            borderColor: "#4A0F16",
            backgroundColor: "#151519",
          }}
        >
          <span
            className="text-2xl"
            style={{ color: "#C77B84" }}
          >
            ✦
          </span>
        </div>

        <p
          className="mb-2 text-xs font-semibold uppercase tracking-[0.3em]"
          style={{ color: "#C77B84" }}
        >
          Casa Serena
        </p>

        <h1
          className="text-3xl font-normal tracking-wide"
          style={{
            color: "#E4E4E7",
            fontFamily: "Georgia, serif",
          }}
        >
          Controle financeiro
        </h1>

        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "#B8B8BC" }}
        >
          Entre na sua conta para organizar
          <br />
          suas finanças.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium"
            style={{ color: "#E4E4E7" }}
          >
            E-mail
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="seuemail@email.com"
            required
            className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:ring-1"
            style={{
              backgroundColor: "#151519",
              borderColor: "#3A3A3F",
              color: "#E4E4E7",
            }}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium"
            style={{ color: "#E4E4E7" }}
          >
            Senha
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            required
            className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:ring-1"
            style={{
              backgroundColor: "#151519",
              borderColor: "#3A3A3F",
              color: "#E4E4E7",
            }}
          />
        </div>

        {erro && (
          <div
            className="rounded-lg border px-4 py-3 text-sm"
            style={{
              backgroundColor: "rgba(74, 15, 22, 0.25)",
              borderColor: "#4A0F16",
              color: "#C77B84",
            }}
          >
            {erro}
          </div>
        )}

        <button
          type="submit"
          disabled={carregando}
          className="w-full rounded-lg border px-5 py-3 text-sm font-semibold tracking-wide transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            backgroundColor: "#4A0F16",
            borderColor: "#6B2028",
            color: "#E4E4E7",
          }}
        >
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <div
        className="mt-8 border-t pt-5 text-center text-xs"
        style={{
          borderColor: "#29292E",
          color: "#77777D",
        }}
      >
        Casa Serena · Controle financeiro pessoal
      </div>
    </div>
  </div>
</main>

);
}