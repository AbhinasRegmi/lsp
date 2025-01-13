import * as z from 'zod';
import { notificationSchema } from './message';
import { rangeSchema } from './textdocument';

const diagnosticsSchema = z.object({
  range: rangeSchema,
  severity: z.number(),
  source: z.string().optional(),
  message: z.string(),
});
export type diagnosticsT = z.infer<typeof diagnosticsSchema>;

const publishDiagnosticsParamsSchema = z.object({
  uri: z.string(),
  diagnostics: z.array(diagnosticsSchema),
});

export const publishDiagnosticsNotificationSchema = z
  .object({
    params: publishDiagnosticsParamsSchema,
  })
  .merge(notificationSchema);
export type publishDiagnosticsNotificationT = z.infer<
  typeof publishDiagnosticsNotificationSchema
>;
