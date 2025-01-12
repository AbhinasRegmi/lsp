import process from "node:process";

import { FileLogger } from "./utils/logger";
import { type baseMessageT, checkValidStdMessage, decodeMessage, encodeMessage } from "./rpc";
import { initializeRequestSchema, newInitializeResponse } from "./lsp/initialize";
import { didOpenTextDocumentNotificationSchema } from "./lsp/textdocument-didopen";
import { FileState } from "./analysis/state";
import { didChangeTextDocumentNotificationSchema } from "./lsp/textdocument-didchange";

// Initialize the process
process.stdin.setEncoding('utf8');
process.stdin.resume();

const globalState = new FileState();
const globalLogger = new FileLogger("/home/abhinasregmi/development/side/lsp/log.txt");

globalLogger.write("LSP has been started...");

// Listen to the stdin
process.stdin.on('data', (data) => {
	const out = checkValidStdMessage(data);

	const { ok, value } = decodeMessage(data);

	if (!ok) {
		globalLogger.write("Got an error during decoding...");
		globalLogger.write(data.toString());
		return;
	}

	if (out.ok) {
		handleStdMessage(value.request, value.content, globalLogger, globalState);
	}
});
process.stdin.on('end', () => { }); // Do nothing when the stream ends


function handleStdMessage(baseMessage: baseMessageT, content: string, logger: FileLogger, fileState: FileState) {
	logger.write("Received message with method: " + baseMessage.method);

	switch (baseMessage.method) {
		case "initialize": {
			const { success, data, error } = initializeRequestSchema.safeParse(JSON.parse(content))

			if (!success) {
				logger.write("Couldn't parse json for initialize => " + error.message);
			}

			// respond to initialize message to the server
			const message = newInitializeResponse(data.id);
			const reply = encodeMessage(message);

			// send to the server
			process.stdout.write(reply, 'utf8');
			logger.write("Send initialize response to the server.");
			break;
		}
		case "textDocument/didOpen": {
			const jsonContent = JSON.parse(content);
			const { success, data } = didOpenTextDocumentNotificationSchema.safeParse(jsonContent);

			if (!success) {
				logger.write("Couldn't parse for textDocuemnt/didOpen");
			}

			logger.write("Opened file: " + data.params?.textDocument?.uri);
			fileState.addFileState(data.params.textDocument.uri, data.params.textDocument.text);

			break;
		}
		case "textDocument/didChange": {
			const jsonContent = JSON.parse(content);
			const { success, data } = didChangeTextDocumentNotificationSchema.safeParse(jsonContent);

			if (!success) {
				logger.write("Couldn't parse for textDocuemnt/didChange");
			}

			logger.write("Changed file: " + data.params?.textDocument?.uri);
			logger.write("Changed file content: " + data.params.contentChanges.map(i => i.text).join('\n'));
			fileState.addFileState(data.params.textDocument.uri, data.params.contentChanges.map(i => i.text).join('\n'));

			break;
		}
		default:
			break;
	}
}

