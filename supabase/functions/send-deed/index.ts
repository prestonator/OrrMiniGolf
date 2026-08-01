// @ts-ignore
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
// @ts-ignore
import { Resend } from "npm:resend";

// @ts-ignore
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, pdfBase64, name } = await req.json();

    if (!email || !pdfBase64) {
      return new Response(
        JSON.stringify({ error: "Email and pdfBase64 are required." }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    const { data, error } = await resend.emails.send({
      from: "Orr Family Farm <homestead@prestonator.com>", // Using the verified domain
      to: email,
      subject: "Your Official 1889 Homestead Deed!",
      html: `
        <h2>Congratulations, Pioneer ${name || ""}!</h2>
        <p>You have successfully proven up your 160-acre plot at the Orr Family Farm Homestead Mini Golf Course.</p>
        <p>Please find your official 1889 Homestead Deed attached as a PDF.</p>
        <br/>
        <p>Best Regards,</p>
        <p>The Orr Family Farm Team</p>
      `,
      attachments: [
        {
          filename: "Homestead_Deed.pdf",
          content: pdfBase64, // The base64 string from the frontend
        },
      ],
    });

    if (error) {
      return new Response(JSON.stringify({ error }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
