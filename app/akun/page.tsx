import { AccountForm } from "@/components/account-form";

export const metadata = { title: "Ruang Klien", robots: { index: false } };

export default async function Account({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const destination = next && /^\/(?:ruang|studio|pesan\/[a-z-]+)$/.test(next) ? next : "/ruang";
  return <section className="shell section"><h1>Ruang klien.</h1><AccountForm next={destination} /></section>;
}
