import * as z from "zod";
import { requestSchema, responseSchema } from "./message";
import { locationSchema, textDocumentPositionParamsSchema } from "./textdocument";

export const definitionRequestSchema = z.object({
	params: textDocumentPositionParamsSchema,
}).merge(requestSchema);

export const definitionResponseSchema = z.object({
	result: locationSchema,
}).merge(responseSchema);
export type definitionResponseT = z.infer<typeof definitionResponseSchema>;
