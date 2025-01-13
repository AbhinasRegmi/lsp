import * as z from 'zod';

// request schemas
const clientInfoSchema = z.object({
  name: z.string(),
  version: z.string().optional(),
});

const initializeRequestParamsSchema = z.object({
  clientInfo: clientInfoSchema.optional(),
});

export const initializeRequestSchema = z.object({
  method: z.string(),
  jsonrpc: z.string(),
  id: z.number(),
  params: initializeRequestParamsSchema,
});

const completionOptionsSchema = z.object({});

// response schemas
const serverCapabiliesSchema = z.object({
  textDocumentSync: z.number(),
  hoverProvider: z.boolean().optional(),
  definitionProvider: z.boolean().optional(),
  completionProvider: completionOptionsSchema.optional(),
});

const serverInfoSchema = z.object({
  name: z.string(),
  version: z.string().optional(),
});

const initializeResultSchema = z.object({
  capabilities: serverCapabiliesSchema,
  serverInfo: serverInfoSchema.optional(),
});

export const initializeResponseSchema = z.object({
  id: z.number(),
  jsonrpc: z.string(),
  result: initializeResultSchema,
});

export function newInitializeResponse(
  id: number,
): z.infer<typeof initializeResponseSchema> {
  return {
    id,
    jsonrpc: '2.0',
    result: {
      capabilities: {
        textDocumentSync: 1,
        hoverProvider: true,
        definitionProvider: true,
        completionProvider: {},
      },
      serverInfo: {
        name: 'educationalLsp',
        version: '0.0.1',
      },
    },
  } satisfies z.infer<typeof initializeResponseSchema>;
}
