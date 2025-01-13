import * as z from 'zod';
import { requestSchema, responseSchema } from './message';
import { textDocumentPositionParamsSchema } from './textdocument';

export const completionRequestSchema = z
  .object({
    params: textDocumentPositionParamsSchema,
  })
  .merge(requestSchema);

const completionItemSchema = z.object({
  label: z.string(),
  detail: z.string().optional(),
  documentation: z.string().optional(),
});
export type completionItemT = z.infer<typeof completionItemSchema>;

export const completionResponseSchema = z
  .object({
    result: z.array(completionItemSchema),
  })
  .merge(responseSchema);
export type completionResponseT = z.infer<typeof completionResponseSchema>;
