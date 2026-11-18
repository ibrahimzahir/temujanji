"use client";

import { twoFactorClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

const auth = createAuthClient({
  plugins: [twoFactorClient()],
});

export function AccountForm({ next }: { next: string }) {
  const [signup, setSignup] = useState(false);
  const [needs2FA, setNeeds2FA] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = new FormData(event.currentTarget);
      const credentials = {
        email: String(data.get("email")),
        password: String(data.get("password")),
      };
      const result = signup
        ? await auth.signUp.email({
            ...credentials,
            name: String(data.get("name")),
          })
        : await auth.signIn.email(credentials);

      if (result.error) {
        setError("Akun tidak dapat diproses. Periksa data dan coba lagi.");
        return;
      }

      const maybeTwoFactor = result.data as { twoFactorRedirect?: boolean } | null;
      if (maybeTwoFactor?.twoFactorRedirect) {
        setNeeds2FA(true);
        await auth.twoFactor.sendOtp();
        setOtpSent(true);
        return;
      }

      window.location.assign(next);
    } catch {
      setError("Koneksi bermasalah. Coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyTwoFactor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await auth.twoFactor.verifyOtp({
        code: otpCode.trim(),
        trustDevice: true,
      });
      if (res.error) {
        setError("Kode 2FA tidak valid atau sudah kedaluwarsa.");
        return;
      }
      window.location.assign(next);
    } catch {
      setError("Verifikasi 2FA gagal. Coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  if (needs2FA) {
    return (
      <form className="stack" onSubmit={verifyTwoFactor}>
        <p className="text-sm text-muted-foreground">
          {otpSent
            ? "Kode verifikasi 2FA (6 digit) telah dikirim ke email Anda melalui Resend."
            : "Masukkan kode verifikasi 2FA Anda."}
        </p>
        <label>
          Kode OTP 2FA
          <input
            name="otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            minLength={6}
            maxLength={8}
            placeholder="123456"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
          />
        </label>
        {error && <p role="alert">{error}</p>}
        <Button disabled={busy}>
          {busy ? "Memverifikasi…" : "Verifikasi & Masuk"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={async () => {
            await auth.twoFactor.sendOtp();
            setOtpSent(true);
          }}
        >
          Kirim Ulang Kode OTP
        </Button>
      </form>
    );
  }

  return (
    <form className="stack" onSubmit={submit}>
      {signup && (
        <label>
          Nama
          <input name="name" required maxLength={100} autoComplete="name" />
        </label>
      )}
      <label>
        Email
        <input
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
        />
      </label>
      <label>
        Kata sandi
        <input
          name="password"
          type="password"
          required
          minLength={12}
          maxLength={128}
          autoComplete={signup ? "new-password" : "current-password"}
        />
      </label>
      {error && <p role="alert">{error}</p>}
      <Button disabled={busy}>
        {busy ? "Memproses…" : signup ? "Buat akun" : "Masuk"}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          setSignup(!signup);
          setError("");
        }}
      >
        {signup ? "Sudah punya akun" : "Buat akun baru"}
      </Button>
    </form>
  );
}

export function Logout() {
  return (
    <Button
      variant="outline"
      onClick={async () => {
        await auth.signOut();
        window.location.assign("/");
      }}
    >
      Keluar
    </Button>
  );
}
