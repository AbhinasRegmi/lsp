import * as z from "zod";

export const textDocumentItemSchema = z.object({
	uri: z.string(),
	languageId: z.string(),
	version: z.number(),
	text: z.string(), // the actual content of the opened file.
});
