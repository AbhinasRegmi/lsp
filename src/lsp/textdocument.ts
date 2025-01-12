import * as z from "zod";


export const textDocumentItemSchema = z.object({
	uri: z.string(),
	languageId: z.string().optional(),
	version: z.number().optional(),
	text: z.string().optional(), // the actual content of the opened file.
});

export const textDocumentIdentifierSchema = z.object({
	uri: z.string(),
});

export const versionTextDocumentIdentifierSchema = z.object({
	version: z.number(),
}).merge(textDocumentIdentifierSchema);

const positionSchema = z.object({
	line: z.number(),
	character: z.number(),
});

export const textDocumentPositionParamsSchema = z.object({
	textDocument: textDocumentItemSchema,
	position: positionSchema,

});
