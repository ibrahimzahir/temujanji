interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendEmailWithResend(params: SendEmailParams) {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM_EMAIL ?? "Temu Janji Studio <no-reply@temujanji.id>";

  if (!apiKey) {
    console.info(
      `[Resend Dev Fallback] To: ${params.to} | Subject: ${params.subject} | ${params.text}`
    );
    return { delivered: false, fallback: true };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [params.to],
      subject: params.subject,
      html: params.html,
      text: params.text,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend API error (${response.status}): ${body}`);
  }

  return { delivered: true, fallback: false };
}
