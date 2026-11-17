import { IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { StudioDashboardPayload } from "@/lib/schemas/studio"

export function SectionCards({
  summary,
}: {
  summary?: StudioDashboardPayload["summary"]
}) {
  const totalOrders = summary?.totalOrders ?? 5
  const paidOrders = summary?.paidOrders ?? 4
  const publishedThemes = summary?.publishedThemesCount ?? 6
  const totalRsvp = summary?.totalConfirmedRsvp ?? 1331
  const totalViews = summary?.totalViews30d ?? 9420

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:border-border/80 *:data-[slot=card]:bg-gradient-to-b *:data-[slot=card]:from-card *:data-[slot=card]:to-secondary/35 *:data-[slot=card]:shadow-[0_1px_2px_rgba(91,35,107,0.04)] lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pesanan &amp; RSVP Aktif</CardDescription>
          <CardTitle className="font-sans text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalOrders}
          </CardTitle>
          <CardAction>
            <Badge variant="secondary" className="gap-1 border border-border/70">
              <IconTrendingUp className="size-3.5" />
              {paidOrders} Lunas
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex items-center gap-1.5 font-medium">
            Tersimpan di Prisma PostgreSQL
          </div>
          <div className="text-xs text-muted-foreground">
            Undangan dalam proses kurasi studio
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Koleksi Tema</CardDescription>
          <CardTitle className="font-sans text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {publishedThemes}
          </CardTitle>
          <CardAction>
            <Badge variant="secondary" className="gap-1 border border-border/70">
              Aktif
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex items-center gap-1.5 font-medium">
            Dikelola penuh via backend
          </div>
          <div className="text-xs text-muted-foreground">
            Tersedia untuk seluruh paket undangan
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Konfirmasi RSVP Tamu</CardDescription>
          <CardTitle className="font-sans text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalRsvp.toLocaleString("id-ID")}
          </CardTitle>
          <CardAction>
            <Badge variant="secondary" className="gap-1 border border-border/70">
              <IconTrendingUp className="size-3.5" />
              Real-time
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex items-center gap-1.5 font-medium">
            Rekap kehadiran tamu aktif
          </div>
          <div className="text-xs text-muted-foreground">
            Sinkron dengan pesanan klien
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Tayangan Undangan</CardDescription>
          <CardTitle className="font-sans text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalViews.toLocaleString("id-ID")}
          </CardTitle>
          <CardAction>
            <Badge variant="secondary" className="gap-1 border border-border/70">
              <IconTrendingUp className="size-3.5" />
              14 Hari
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex items-center gap-1.5 font-medium">
            Mobile &amp; Desktop terukur
          </div>
          <div className="text-xs text-muted-foreground">
            Diperbarui dari metrik harian studio
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
