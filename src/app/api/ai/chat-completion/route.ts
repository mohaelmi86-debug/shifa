import { NextRequest, NextResponse } from 'next/server';
import { completion } from '@rocketnew/llm-sdk';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

const PROVIDERS = {
  OPEN_AI: { key: process.env.OPENAI_API_KEY, models: ['gpt-4o-mini', 'gpt-4o'] },
  ANTHROPIC: { key: process.env.ANTHROPIC_API_KEY, models: ['claude-3-5-haiku-latest', 'claude-3-5-sonnet-latest'] },
  GEMINI: { key: process.env.GEMINI_API_KEY, models: ['gemini-2.0-flash', 'gemini-2.5-flash'] },
  PERPLEXITY: { key: process.env.PERPLEXITY_API_KEY, models: ['sonar', 'sonar-pro'] },
} as const;

const MAX_MESSAGES = 30;
const MAX_CONTENT_CHARS = 12_000;
const MAX_BODY_BYTES = 64 * 1024;
const MAX_TOKENS = 2_000;

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function validateMessages(messages: unknown): messages is Array<{ role: string; content: string }> {
  if (!Array.isArray(messages) || messages.length < 1 || messages.length > MAX_MESSAGES) return false;
  let total = 0;
  for (const message of messages) {
    if (!message || typeof message !== 'object') return false;
    const m = message as Record<string, unknown>;
    if (!['system', 'user', 'assistant'].includes(String(m.role))) return false;
    if (typeof m.content !== 'string' || !m.content.trim()) return false;
    total += m.content.length;
    if (total > MAX_CONTENT_CHARS) return false;
  }
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return jsonError('Authentification requise.', 401);

    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > MAX_BODY_BYTES) return jsonError('Requête trop volumineuse.', 413);
    // Enforce the limit on actual bytes too; Content-Length is optional/untrusted.
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return jsonError('Requête trop volumineuse.', 413);
    }
    let body: unknown;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return jsonError('JSON invalide.', 400);
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return jsonError('Corps de requête invalide.', 400);
    }
    body = body as Record<string, unknown>;
    const providerName = body?.provider as keyof typeof PROVIDERS;
    const provider = PROVIDERS[providerName];
    const model = body?.model;
    const messages = body?.messages;
    const stream = body?.stream === true;
    const parameters = body?.parameters ?? {};

    if (!provider || typeof model !== 'string' || !provider.models.includes(model as never)) {
      return jsonError('Fournisseur ou modèle non autorisé.', 400);
    }
    if (!validateMessages(messages)) return jsonError('Messages invalides ou trop volumineux.', 400);
    if (parameters && (typeof parameters !== 'object' || Array.isArray(parameters))) {
      return jsonError('Paramètres invalides.', 400);
    }
    const temperature = parameters.temperature;
    const maxTokens = parameters.max_tokens ?? parameters.maxTokens;
    if (temperature !== undefined && (typeof temperature !== 'number' || temperature < 0 || temperature > 1.5)) {
      return jsonError('temperature hors limites.', 400);
    }
    if (maxTokens !== undefined && (!Number.isInteger(maxTokens) || maxTokens < 1 || maxTokens > MAX_TOKENS)) {
      return jsonError('max_tokens hors limites.', 400);
    }
    if (!provider.key) return jsonError('Fournisseur IA indisponible.', 503);

    const safeParameters = {
      ...(temperature !== undefined ? { temperature } : {}),
      ...(maxTokens !== undefined ? { max_tokens: maxTokens } : {}),
    };
    const result = await completion({
      model,
      messages,
      stream,
      api_key: provider.key,
      ...safeParameters,
    });

    if (!stream) return NextResponse.json(result);

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'start' })}\n\n`));
          for await (const chunk of result as AsyncIterable<unknown>) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'chunk', chunk })}\n\n`));
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
          controller.close();
        } catch {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', error: 'Erreur du fournisseur IA.' })}\n\n`));
          controller.close();
        }
      },
    });
    return new NextResponse(readable, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error) {
    // Never send provider messages or configuration details to clients.
    console.error('AI completion failed', error instanceof Error ? error.name : 'UnknownError');
    return jsonError('Erreur interne du service IA.', 500);
  }
}
