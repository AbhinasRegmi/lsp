import * as z from "zod";


export const textDocumentItemSchema = z.object({
	uri: z.string(),
	languageId: z.string(),
	version: z.number(),
	text: z.string(), // the actual content of the opened file.
});

const textDocumentIdentifierSchema = z.object({
	uri: z.string(),
});
export const versionTextDocumentIdentifierSchema = z.object({
	version: z.number(),
}).merge(textDocumentIdentifierSchema);
