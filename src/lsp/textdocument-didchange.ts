import * as z from 'zod';
import { notificationSchema } from './message';
import { versionTextDocumentIdentifierSchema } from './textdocument';

const textDocumentContentChangeEventSchema = z.object({
  // whole file change is contained here
  text: z.string(),
});

const didChangeTextDocumentParamsSchema = z.object({
  textDocument: versionTextDocumentIdentifierSchema,
  contentChanges: z.array(textDocumentContentChangeEventSchema),
});

export const didChangeTextDocumentNotificationSchema = notificationSchema.merge(
  z.object({
    params: didChangeTextDocumentParamsSchema,
  }),
);
