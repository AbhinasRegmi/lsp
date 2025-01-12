import * as z from "zod";
import { requestSchema, responseSchema } from "./message";
import { textDocumentPositionParamsSchema } from "./textdocument";

export const hoverRequestSchema = z.object({
	params: textDocumentPositionParamsSchema,
}).merge(requestSchema);

const hoverResultSchema = z.object({
	contents: z.string(),
})

export const hoverResponseSchema = z.object({
	result: hoverResultSchema,
}).merge(responseSchema);
export type hoverResponseT = z.infer<typeof hoverResponseSchema>;
