import process from "node:process";

import { getLogger } from "./utils/logger";
import { type baseMessageT, checkValidStdMessage, decodeMessage, encodeMessage } from "./rpc";
import { initializeRequestSchema, newInitializeResponse } from "./lsp/initialize";

// Initialize the process
process.stdin.setEncoding('utf8');
process.stdin.resume();

// this is global logger. Pass this everywhere
const logger = getLogger("/home/abhinasregmi/development/side/lsp/log.txt");
logger("LSP has been started...");

// Listen to the stdin
process.stdin.on('data', (data) => {
	const out = checkValidStdMessage(data);

	const { ok, value } = decodeMessage(data);

	if (!ok) {
		logger("Got an error during decoding...");
		logger(data.toString());
		return;
	}

	if (out.ok) {
		handleStdMessage(value.request, value.content, logger);
	}
});
process.stdin.on('end', () => { }); // Do nothing when the stream ends


function handleStdMessage(baseMessage: baseMessageT, content: string, logger: (_: string) => void) {
	logger("Received message with method: " + baseMessage.method);

	switch (baseMessage.method) {
		case "initialize":
			const { success, data, error } = initializeRequestSchema.safeParse(JSON.parse(content))

			if (!success) {
				logger("Couldn't parse json for initialize => " + error.message);
			}

			// respond to initialize message to the server
			const message = newInitializeResponse(data.id);
			const reply = encodeMessage(message);
			
			// send to the server
			process.stdout.write(reply, 'utf8');
			logger("Send initialize response to the server.");

			break;
		default:
			logger("Unhandled method received " + baseMessage.method);
	}
}

