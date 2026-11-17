"use client";

import { useActionState } from "react";
import { addGuest } from "@/app/actions";
import { Button } from "@/components/ui/button";

export function GuestForm({ id }: { id: string }) {
  const [state, action, pending] = useActionState(addGuest, { link: "", error: "" });
  return <form className="stack" action={action}>
    <input type="hidden" name="invitationId" value={id} />
    <label>Nama tamu<input name="name" required maxLength={100} /></label>
    <Button disabled={pending}>Buat tautan tamu</Button>
    {state.error && <p role="alert">{state.error}</p>}
    {state.link && <label>Simpan tautan ini. Tautan hanya tampil di sini.<input readOnly value={new URL(state.link, window.location.origin).href} onFocus={(event) => event.target.select()} /></label>}
  </form>;
}
