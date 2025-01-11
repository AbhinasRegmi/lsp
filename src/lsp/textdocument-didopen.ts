import * as z from "zod";
import { textDocumentItemSchema } from "./textdocument";
import { notificationSchema } from "./message";

const didOpenTextDocumentParams = z.object({
	textDocument: textDocumentItemSchema,
});

export const didOpenTextDocumentNotificationSchema = notificationSchema.merge(
	z.object({
		params: didOpenTextDocumentParams,
	})
); 

export type didOpenTextDocumentNotificationT = z.infer<typeof didOpenTextDocumentNotificationSchema>
