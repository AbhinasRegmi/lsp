import * as z from 'zod';

export const requestSchema = z.object({
  jsonrpc: z.string(),
  id: z.number(),
  method: z.string(),
});

export const responseSchema = z.object({
  jsonrpc: z.string(),
  id: z.number().optional(),
});

export const notificationSchema = z.object({
  jsonrpc: z.string(),
  method: z.string(),
});
