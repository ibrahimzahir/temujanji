"use client";

import { createAuthClient } from "better-auth/react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

const auth = createAuthClient();

export function AccountForm({ next }: { next: string }) {
  const [signup, setSignup] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = new FormData(event.currentTarget);
      const credentials = { email: String(data.get("email")), password: String(data.get("password")) };
      const result = signup
        ? await auth.signUp.email({ ...credentials, name: String(data.get("name")) })
        : await auth.signIn.email(credentials);
      if (result.error) setError("Akun tidak dapat diproses. Periksa data dan coba lagi.");
      else window.location.assign(next);
    } catch {
      setError("Koneksi bermasalah. Coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  return <form className="stack" onSubmit={submit}>
    {signup && <label>Nama<input name="name" required maxLength={100} autoComplete="name" /></label>}
    <label>Email<input name="email" type="email" required maxLength={254} autoComplete="email" /></label>
    <label>Kata sandi<input name="password" type="password" required minLength={12} maxLength={128} autoComplete={signup ? "new-password" : "current-password"} /></label>
    {error && <p role="alert">{error}</p>}
    <Button disabled={busy}>{busy ? "Memproses…" : signup ? "Buat akun" : "Masuk"}</Button>
    <Button type="button" variant="outline" onClick={() => { setSignup(!signup); setError(""); }}>{signup ? "Sudah punya akun" : "Buat akun baru"}</Button>
  </form>;
}

export function Logout() {
  return <Button variant="outline" onClick={async () => { await auth.signOut(); window.location.assign("/"); }}>Keluar</Button>;
}
