import * as z from "zod";
import { textDocumentItemSchema } from "./textdocument";
import { notificationSchema } from "./message";

const didOpenTextDocumentParamsSchema = z.object({
	textDocument: textDocumentItemSchema,
});

export const didOpenTextDocumentNotificationSchema = notificationSchema.merge(
	z.object({
		params: didOpenTextDocumentParamsSchema,
	})
); 

export type didOpenTextDocumentNotificationT = z.infer<typeof didOpenTextDocumentNotificationSchema>
