import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { completion } from '@rocketnew/llm-sdk';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

type AiModule = 'patient' | 'professional' | 'organization';
type ChatMessage = { role: 'user' | 'assistant'; content: string };

const PROVIDER_KEY_ENV: Record<string, string> = {
  OPEN_AI: 'OPENAI_API_KEY',
  ANTHROPIC: 'ANTHROPIC_API_KEY',
  GEMINI: 'GEMINI_API_KEY',
  PERPLEXITY: 'PERPLEXITY_API_KEY',
};

const MODULE_CONFIG: Record<AiModule, { modelEnv: string; allowedRoles: string[]; systemPrompt: string }> = {
  patient: {
    modelEnv: 'SHIFA_AI_MODEL_PATIENT',
    allowedRoles: ['patient'],
    systemPrompt: "Tu es SHIFA AI, un assistant d'information générale en santé. Réponds en français, avec clarté et bienveillance. Tu ne poses aucun diagnostic, ne prescris aucun traitement et ne prétends pas remplacer un professionnel de santé. En cas de signe d'urgence, recommande de contacter immédiatement les services d'urgence locaux. Ne demande pas de données identifiantes inutiles et ne révèle jamais d'informations sur d'autres patients.",
  },
  professional: {
    modelEnv: 'SHIFA_AI_MODEL_PROFESSIONAL',
    allowedRoles: ['professional'],
    systemPrompt: "Tu es SHIFA AI Clinical, un assistant d'aide au travail des professionnels de santé. Réponds en français. Tes suggestions ne remplacent jamais le jugement clinique, la vérification des sources ni les protocoles locaux. Ne présente jamais une hypothèse comme un diagnostic confirmé et ne déclenche aucune action clinique. N'invente aucune donnée patient.",
  },
  organization: {
    modelEnv: 'SHIFA_AI_MODEL_ORGANIZATION',
    allowedRoles: ['org_admin'],
    systemPrompt: "Tu es SHIFA AI Organisation, un assistant d'analyse opérationnelle d'établissement de santé. Réponds en français, de manière concise et actionnable. N'accède pas aux dossiers médicaux individuels, ne demande pas de données directement identifiantes et distingue clairement les hypothèses des faits. Toute décision reste sous validation humaine.",
  },
};

function jsonError(status: number, code: string, requestId: string) {
  return NextResponse.json({ error: code, requestId }, { status });
}

function extractOutput(result: unknown): string {
  if (!result || typeof result !== 'object') return '';
  const value = result as {
    content?: unknown;
    choices?: Array<{ message?: { content?: unknown } }>;
  };
  const candidate = value.choices?.[0]?.message?.content ?? value.content;
  return typeof candidate === 'string' ? candidate : '';
}

export async function POST(request: NextRequest) {
  const requestId = randomUUID();

  // Enforce the limit on the actual body bytes; Content-Length alone is not trustworthy.
  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return jsonError(400, 'INVALID_JSON', requestId);
  }
  if (Buffer.byteLength(rawBody, 'utf8') > 32_000) {
    return jsonError(413, 'REQUEST_TOO_LARGE', requestId);
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return jsonError(400, 'INVALID_JSON', requestId);
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return jsonError(400, 'INVALID_REQUEST', requestId);
  }

  const payload = body as { module?: unknown; messages?: unknown; stream?: unknown };
  if (payload.stream === true) return jsonError(400, 'STREAMING_NOT_SUPPORTED', requestId);
  if (typeof payload.module !== 'string' || !Object.hasOwn(MODULE_CONFIG, payload.module)) {
    return jsonError(400, 'INVALID_MODULE', requestId);
  }

  const moduleName = payload.module as AiModule;
  const config = MODULE_CONFIG[moduleName];
  if (!Array.isArray(payload.messages) || payload.messages.length < 1 || payload.messages.length > 20) {
    return jsonError(400, 'INVALID_MESSAGES', requestId);
  }

  const messages: ChatMessage[] = [];
  let totalChars = 0;
  for (const item of payload.messages) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      return jsonError(400, 'INVALID_MESSAGES', requestId);
    }
    const message = item as { role?: unknown; content?: unknown };
    if ((message.role !== 'user' && message.role !== 'assistant') ||
        typeof message.content !== 'string' ||
        message.content.length < 1 || message.content.length > 8_000) {
      return jsonError(400, 'INVALID_MESSAGES', requestId);
    }
    totalChars += message.content.length;
    if (totalChars > 24_000) return jsonError(413, 'CONVERSATION_TOO_LARGE', requestId);
    messages.push({ role: message.role, content: message.content });
  }

  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return jsonError(401, 'AUTHENTICATION_REQUIRED', requestId);

    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role, is_active')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError || !profile || profile.is_active !== true) {
      return jsonError(403, 'ACCOUNT_NOT_AUTHORIZED', requestId);
    }
    if (!config.allowedRoles.includes(profile.role)) {
      return jsonError(403, 'MODULE_NOT_AUTHORIZED', requestId);
    }

    const provider = process.env.SHIFA_AI_PROVIDER;
    const apiKeyEnv = provider ? PROVIDER_KEY_ENV[provider] : undefined;
    const apiKey = apiKeyEnv ? process.env[apiKeyEnv] : undefined;
    const model = process.env[config.modelEnv];
    if (!provider || !apiKeyEnv || !apiKey || !model) {
      console.error('SHIFA AI configuration incomplete', { requestId, module: moduleName });
      return jsonError(503, 'AI_SERVICE_NOT_CONFIGURED', requestId);
    }

    const result = await completion({
      model,
      messages: [{ role: 'system', content: config.systemPrompt }, ...messages],
      stream: false,
      api_key: apiKey,
    });

    const output = extractOutput(result);
    if (!output) {
      console.error('SHIFA AI provider returned an empty or unsupported response', { requestId, module: moduleName });
      return jsonError(502, 'AI_EMPTY_RESPONSE', requestId);
    }

    return NextResponse.json({ requestId, output });
  } catch (error) {
    // Never return provider error text, prompts, or credentials to the browser.
    console.error('SHIFA AI request failed', {
      requestId,
      module: moduleName,
      errorType: error instanceof Error ? error.name : 'UnknownError',
    });
    return jsonError(502, 'AI_REQUEST_FAILED', requestId);
  }
}
