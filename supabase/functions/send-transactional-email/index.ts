import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // ✅ CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    // P0.6: JWT authentication required for transactional emails
    // Exception: password_reset emails may be triggered server-side
    // but we still validate the caller has a valid JWT or a service-role key.
    const authHeader = req.headers.get("Authorization");
    const apiKey = req.headers.get("apikey");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";

    // Determine if caller is using service role (internal server call) or user JWT
    const isServiceRoleCall =
      authHeader === `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` ||
      apiKey === SUPABASE_SERVICE_ROLE_KEY;

    let callerUserId: string | null = null;

    if (!isServiceRoleCall) {
      // Validate user JWT
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return new Response(
          JSON.stringify({ error: "Missing or invalid authorization header" }),
          { status: 401, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
        );
      }

      const token = authHeader.replace("Bearer ", "");
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);

      if (authError || !user) {
        return new Response(
          JSON.stringify({ error: "Unauthorized — invalid JWT" }),
          { status: 401, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
        );
      }
      callerUserId = user.id;
    }

    const { type, to, data } = await req.json();

    if (!type || !to) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: type, to" }),
        { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    let subject = "";
    let html = "";

    switch (type) {
      case "password_reset": {
        subject = "Réinitialisation de votre mot de passe SHIFA";
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <div style="background: linear-gradient(135deg, #0066ff, #00c2ff); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">SHIFA Health OS</h1>
            </div>
            <div style="background: #ffffff; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
              <h2 style="color: #111827; margin-top: 0;">Réinitialisation de mot de passe</h2>
              <p style="color: #6b7280;">Bonjour ${data?.name || ""},</p>
              <p style="color: #6b7280;">Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour continuer.</p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${data?.resetUrl || "#"}" style="background: #0066ff; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
                  Réinitialiser mon mot de passe
                </a>
              </div>
              <p style="color: #9ca3af; font-size: 13px;">Ce lien expire dans 1 heure. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
            </div>
          </div>
        `;
        break;
      }

      case "appointment_reminder": {
        subject = `Rappel de rendez-vous — ${data?.date || ""}`;
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <div style="background: linear-gradient(135deg, #0066ff, #00c2ff); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">SHIFA Health OS</h1>
            </div>
            <div style="background: #ffffff; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
              <h2 style="color: #111827; margin-top: 0;">🗓️ Rappel de rendez-vous</h2>
              <p style="color: #6b7280;">Bonjour ${data?.patientName || ""},</p>
              <p style="color: #6b7280;">Vous avez un rendez-vous prévu :</p>
              <div style="background: #f0f7ff; border-left: 4px solid #0066ff; padding: 16px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 4px 0; color: #111827;"><strong>Date :</strong> ${data?.date || "—"}</p>
                <p style="margin: 4px 0; color: #111827;"><strong>Heure :</strong> ${data?.time || "—"}</p>
                <p style="margin: 4px 0; color: #111827;"><strong>Médecin :</strong> ${data?.doctorName || "—"}</p>
                <p style="margin: 4px 0; color: #111827;"><strong>Lieu :</strong> ${data?.location || "—"}</p>
              </div>
              <p style="color: #6b7280; font-size: 13px;">Pour annuler ou modifier votre rendez-vous, connectez-vous à votre espace patient SHIFA.</p>
            </div>
          </div>
        `;
        break;
      }

      case "appointment_confirmation": {
        subject = `✅ Rendez-vous confirmé — ${data?.date || ""}`;
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <div style="background: linear-gradient(135deg, #0066ff, #00c2ff); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">SHIFA Health OS</h1>
              <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 14px;">Confirmation de rendez-vous</p>
            </div>
            <div style="background: #ffffff; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
              <h2 style="color: #111827; margin-top: 0; text-align: center;">Votre rendez-vous est confirmé</h2>
              <p style="color: #6b7280;">Bonjour ${data?.patientName || ""},</p>
              <div style="background: #f0f7ff; border-left: 4px solid #0066ff; padding: 16px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 4px 0; color: #111827;"><strong>Date :</strong> ${data?.date || "—"}</p>
                <p style="margin: 4px 0; color: #111827;"><strong>Heure :</strong> ${data?.time || "—"}</p>
                <p style="margin: 4px 0; color: #111827;"><strong>Médecin :</strong> ${data?.doctorName || "—"}</p>
                <p style="margin: 4px 0; color: #111827;"><strong>Spécialité :</strong> ${data?.specialty || "—"}</p>
                <p style="margin: 4px 0; color: #111827;"><strong>Lieu :</strong> ${data?.location || "—"}</p>
                ${data?.appointmentType === 'teleconsultation' ? '<p style="margin: 8px 0 0; color: #0066ff; font-weight: 600;">📹 Téléconsultation — un lien vous sera envoyé avant la séance</p>' : ''}
              </div>
              <p style="color: #6b7280; font-size: 13px;">Référence : <strong>${data?.appointmentId || "—"}</strong></p>
            </div>
          </div>
        `;
        break;
      }

      case "lab_result_ready": {
        subject = `🔬 Résultats d'analyses disponibles — ${data?.testName || "Analyse"}`;
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <div style="background: linear-gradient(135deg, #0066ff, #00c2ff); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">SHIFA Health OS</h1>
            </div>
            <div style="background: #ffffff; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
              <h2 style="color: #111827; margin-top: 0;">🔬 Vos résultats sont disponibles</h2>
              <p style="color: #6b7280;">Bonjour ${data?.patientName || ""},</p>
              <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 4px 0; color: #111827;"><strong>Analyse :</strong> ${data?.testName || "—"}</p>
                <p style="margin: 4px 0; color: #111827;"><strong>Laboratoire :</strong> ${data?.labName || "—"}</p>
                <p style="margin: 4px 0; color: #111827;"><strong>Date de résultat :</strong> ${data?.resultDate || "—"}</p>
                ${data?.hasAlert ? '<p style="margin: 8px 0 0; color: #dc2626; font-weight: 600;">⚠️ Certains résultats nécessitent attention.</p>' : '<p style="margin: 8px 0 0; color: #059669; font-weight: 600;">✅ Résultats dans les normes</p>'}
              </div>
              <div style="text-align: center; margin: 24px 0;">
                <a href="${data?.dossierUrl || "#"}" style="background: #0066ff; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
                  Consulter mes résultats
                </a>
              </div>
            </div>
          </div>
        `;
        break;
      }

      case "lab_result_notification": {
        subject = `Résultats disponibles — ${data?.testName || "Analyse"}`;
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <div style="background: linear-gradient(135deg, #0066ff, #00c2ff); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">SHIFA Health OS</h1>
            </div>
            <div style="background: #ffffff; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
              <h2 style="color: #111827; margin-top: 0;">🔬 Résultats disponibles</h2>
              <p style="color: #6b7280;">Bonjour ${data?.patientName || ""},</p>
              <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 4px 0; color: #111827;"><strong>Analyse :</strong> ${data?.testName || "—"}</p>
                <p style="margin: 4px 0; color: #111827;"><strong>Laboratoire :</strong> ${data?.labName || "—"}</p>
                <p style="margin: 4px 0; color: #111827;"><strong>Date :</strong> ${data?.date || "—"}</p>
              </div>
              <div style="text-align: center; margin: 24px 0;">
                <a href="${data?.dossierUrl || "#"}" style="background: #0066ff; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
                  Voir mes résultats
                </a>
              </div>
            </div>
          </div>
        `;
        break;
      }

      case "prescription_dispensed": {
        subject = `💊 Ordonnance dispensée — ${data?.medicationName || "Médicament"}`;
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <div style="background: linear-gradient(135deg, #0066ff, #00c2ff); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">SHIFA Health OS</h1>
            </div>
            <div style="background: #ffffff; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
              <h2 style="color: #111827; margin-top: 0;">💊 Votre ordonnance a été dispensée</h2>
              <p style="color: #6b7280;">Bonjour ${data?.patientName || ""},</p>
              <div style="background: #faf5ff; border-left: 4px solid #8b5cf6; padding: 16px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 4px 0; color: #111827;"><strong>Médicament :</strong> ${data?.medicationName || "—"}</p>
                <p style="margin: 4px 0; color: #111827;"><strong>Posologie :</strong> ${data?.dosage || "—"}</p>
                <p style="margin: 4px 0; color: #111827;"><strong>Pharmacie :</strong> ${data?.pharmacyName || "—"}</p>
                <p style="margin: 4px 0; color: #111827;"><strong>Prescrit par :</strong> ${data?.prescribedBy || "—"}</p>
              </div>
            </div>
          </div>
        `;
        break;
      }

      case "shifa_card_shipped": {
        subject = `📦 Votre SHIFA Card est en route !`;
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <div style="background: linear-gradient(135deg, #0066ff, #00c2ff); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">SHIFA Health OS</h1>
            </div>
            <div style="background: #ffffff; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
              <h2 style="color: #111827; margin-top: 0; text-align: center;">Votre SHIFA Card est expédiée !</h2>
              <p style="color: #6b7280;">Bonjour ${data?.patientName || ""},</p>
              <div style="background: #f0f7ff; border-left: 4px solid #0066ff; padding: 16px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 4px 0; color: #111827;"><strong>Numéro de suivi :</strong> ${data?.trackingNumber || "—"}</p>
                <p style="margin: 4px 0; color: #111827;"><strong>Transporteur :</strong> ${data?.carrier || "—"}</p>
                <p style="margin: 4px 0; color: #111827;"><strong>Délai estimé :</strong> ${data?.estimatedDelivery || "3-5 jours ouvrés"}</p>
              </div>
            </div>
          </div>
        `;
        break;
      }

      case "access_verification_log": {
        subject = `🔐 Accès à votre dossier SHIFA — ${data?.accessDate || ""}`;
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <div style="background: linear-gradient(135deg, #0066ff, #00c2ff); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">SHIFA Health OS</h1>
            </div>
            <div style="background: #ffffff; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
              <h2 style="color: #111827; margin-top: 0;">🔐 Accès à votre dossier de santé</h2>
              <p style="color: #6b7280;">Bonjour ${data?.patientName || ""},</p>
              <div style="background: ${data?.accessGranted ? '#f0f7ff' : '#fef2f2'}; border-left: 4px solid ${data?.accessGranted ? '#0066ff' : '#dc2626'}; padding: 16px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 4px 0; color: #111827;"><strong>Professionnel :</strong> ${data?.professionalName || "—"}</p>
                <p style="margin: 4px 0; color: #111827;"><strong>Date et heure :</strong> ${data?.accessDate || "—"}</p>
                <p style="margin: 8px 0 0; color: ${data?.accessGranted ? '#059669' : '#dc2626'}; font-weight: 600;">${data?.accessGranted ? '✅ Accès autorisé' : '❌ Accès refusé'}</p>
              </div>
              <p style="color: #9ca3af; font-size: 12px;">Référence : <strong>${data?.verificationId || "—"}</strong></p>
            </div>
          </div>
        `;
        break;
      }

      case "consultation_invitation": {
        subject = `Invitation à une consultation — ${data?.doctorName || ""}`;
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <div style="background: linear-gradient(135deg, #0066ff, #00c2ff); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">SHIFA Health OS</h1>
            </div>
            <div style="background: #ffffff; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
              <h2 style="color: #111827; margin-top: 0;">💬 Invitation à une consultation</h2>
              <p style="color: #6b7280;">Bonjour ${data?.patientName || ""},</p>
              <div style="background: #faf5ff; border-left: 4px solid #8b5cf6; padding: 16px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 4px 0; color: #111827;"><strong>Type :</strong> ${data?.consultationType || "Consultation"}</p>
                <p style="margin: 4px 0; color: #111827;"><strong>Date proposée :</strong> ${data?.proposedDate || "—"}</p>
                <p style="margin: 4px 0; color: #111827;"><strong>Motif :</strong> ${data?.reason || "—"}</p>
              </div>
            </div>
          </div>
        `;
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: `Unknown email type: ${type}` }),
          { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
        );
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Resend API error: ${response.status} — ${errorBody}`);
    }

    const result = await response.json();

    return new Response(JSON.stringify({ success: true, id: result.id }), {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});
