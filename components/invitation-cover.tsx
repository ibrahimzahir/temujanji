import Image from "next/image";
import type { templates } from "@/lib/catalog";

export function InvitationCover({ template, title, greeting, thumbnail = false, heading = "h1" }: {
  template: (typeof templates)[number];
  title: string;
  greeting: string;
  thumbnail?: boolean;
  heading?: "h1" | "h2";
}) {
  const animated = !thumbnail && template.category.startsWith("Motion");
  const Title = thumbnail ? "span" : heading;

  return <div
    className={thumbnail ? "invitation-cover invitation-thumbnail" : "invitation-cover"}
    data-layout={template.layout}
    style={{ backgroundColor: template.color }}
    aria-hidden={thumbnail || undefined}
  >
    <div className="invitation-photo" data-animated={animated || undefined}>
      <Image src={template.image} alt="" fill loading={thumbnail ? "lazy" : "eager"}
        sizes={thumbnail ? "(max-width: 700px) 45vw, (max-width: 900px) 47vw, 33vw" : "(max-width: 700px) 94vw, 680px"}
      />
    </div>
    <div className="invitation-title">
      <p>{greeting}</p>
      <Title className="invitation-name">{title}</Title>
    </div>
  </div>;
}
