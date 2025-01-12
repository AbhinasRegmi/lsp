import * as z from "zod";

// request schemas
const clientInfoSchema = z.object({
	name: z.string(),
	version: z.string().optional(),
})

const initializeRequestParamsSchema = z.object({
	clientInfo: clientInfoSchema.optional(),
});

export const initializeRequestSchema = z.object({
	method: z.string(),
	jsonrpc: z.string(),
	id: z.number(),
	params: initializeRequestParamsSchema,
});

// response schemas
const serverCapabiliesSchema = z.object({
	textDocumentSync: z.number(),
	hoverProvider: z.boolean().optional(),
	definitionProvider: z.boolean().optional(),
});

const serverInfoSchema = z.object({
	name: z.string(),
	version: z.string().optional(),
});

const initializeResultSchema = z.object({
	capabilities: serverCapabiliesSchema,
	serverInfo: serverInfoSchema.optional(),
});

export const initializeResponseSchema = z.object({
	id: z.number(),
	jsonrpc: z.string(),
	result: initializeResultSchema,
});

export function newInitializeResponse(id: number): z.infer<typeof initializeResponseSchema> {
	return {
		id,
		jsonrpc: "2.0",
		result: {
			capabilities: {
				textDocumentSync: 1,
				hoverProvider: true,
				definitionProvider: true,
			},
			serverInfo: {
				name: "educationalLsp",
				version: "0.0.1",
			},
		},
	};
}

