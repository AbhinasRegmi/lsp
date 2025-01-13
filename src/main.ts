import process from 'node:process';

import { FileLogger } from './utils/logger';
import {
  type baseMessageT,
  checkValidStdMessage,
  decodeMessage,
  encodeMessage,
} from './rpc';
import {
  initializeRequestSchema,
  newInitializeResponse,
} from './lsp/initialize';
import { didOpenTextDocumentNotificationSchema } from './lsp/textdocument-didopen';
import { FileState } from './analysis/state';
import { didChangeTextDocumentNotificationSchema } from './lsp/textdocument-didchange';
import { hoverRequestSchema } from './lsp/textdocument-hover';
import { definitionRequestSchema } from './lsp/textdocument-definition';
import { completionRequestSchema } from './lsp/textdocument-completion';
import { publishDiagnosticsNotificationT } from './lsp/textdocument-diagnostics';

// Initialize the process
process.stdin.setEncoding('utf8');
process.stdin.resume();

const globalState = new FileState();
const globalLogger = new FileLogger(
  '/home/abhinasregmi/development/side/lsp/log.txt',
);

globalLogger.write('LSP has been started...');

// Listen to the stdin
process.stdin.on('data', (data) => {
  const out = checkValidStdMessage(data);

  const { ok, value } = decodeMessage(data);

  if (!ok) {
    globalLogger.write('Got an error during decoding...');
    globalLogger.write(data.toString());
    return;
  }

  if (out.ok) {
    handleStdMessage(value.request, value.content, globalLogger, globalState);
  }
});
process.stdin.on('end', () => {}); // Do nothing when the stream ends

function handleStdMessage(
  baseMessage: baseMessageT,
  content: string,
  logger: FileLogger,
  fileState: FileState,
) {
  logger.write('Received message with method: ' + baseMessage.method);

  const jsonContent = JSON.parse(content);

  switch (baseMessage.method) {
    case 'initialize': {
      const { success, data, error } =
        initializeRequestSchema.safeParse(jsonContent);

      if (!success) {
        logger.write("Couldn't parse json for initialize => " + error.message);
      }

      // respond to initialize message to the server
      const message = newInitializeResponse(data.id);
      const reply = encodeMessage(message);

      // send to the server
      process.stdout.write(reply, 'utf8');
      logger.write('Send initialize response to the server.');
      break;
    }

    case 'textDocument/didOpen': {
      const { success, data } =
        didOpenTextDocumentNotificationSchema.safeParse(jsonContent);

      if (!success) {
        logger.write("Couldn't parse for textDocuemnt/didOpen");
      }

      logger.write('Opened file: ' + data.params?.textDocument?.uri);

      const diagnostics = fileState.addFileState(
        data.params.textDocument.uri,
        data.params.textDocument.text,
      );

      const message = {
        jsonrpc: '2.0',
        method: 'textDocument/publishDiagnostics',
        params: {
          uri: data.params.textDocument.uri,
          diagnostics,
        },
      } satisfies publishDiagnosticsNotificationT;

      const reply = encodeMessage(message);
      process.stdout.write(reply, 'utf8');

      logger.write('Send publish diagnostic notification');
      break;
    }

    case 'textDocument/didChange': {
      const { success, data } =
        didChangeTextDocumentNotificationSchema.safeParse(jsonContent);

      if (!success) {
        logger.write("Couldn't parse for textDocuemnt/didChange");
      }

      logger.write('Changed file: ' + data.params?.textDocument?.uri);
      data.params.contentChanges.forEach((change) => {
        const diagnostics = fileState.updateFileState(
          data.params.textDocument.uri,
          change.text,
        );

        const message = {
          jsonrpc: '2.0',
          method: 'textDocument/publishDiagnostics',
          params: {
            uri: data.params.textDocument.uri,
            diagnostics,
          },
        } satisfies publishDiagnosticsNotificationT;

        const reply = encodeMessage(message);
        process.stdout.write(reply, 'utf8');

        logger.write('Send publish diagnostic notification');
      });

      break;
    }

    case 'textDocument/hover': {
      const { success, data } = hoverRequestSchema.safeParse(jsonContent);

      if (!success) {
        logger.write("Couldn't parse for textDocuemnt/hover");
      }

      const message = fileState.hover(data.id, data.params.textDocument.uri);
      const reply = encodeMessage(message);

      process.stdout.write(reply, 'utf8');
      logger.write('Send hover response to the server.');
      break;
    }

    case 'textDocument/definition': {
      const { success, data } = definitionRequestSchema.safeParse(jsonContent);

      if (!success) {
        logger.write("Couldn't parse for textDocument/definition");
      }

      const message = fileState.definition(
        data.id,
        data.params.textDocument.uri,
        data.params.position,
      );
      const reply = encodeMessage(message);

      process.stdout.write(reply, 'utf8');
      logger.write('Send definition response to the server.');
      break;
    }

    case 'textDocument/completion': {
      const { success, data } = completionRequestSchema.safeParse(jsonContent);

      if (!success) {
        logger.write("Couldn't parse for textDocument/completion");
      }

      const message = fileState.completion(
        data.id,
        data.params.textDocument.uri,
      );
      const reply = encodeMessage(message);

      process.stdout.write(reply, 'utf8');
      logger.write('Send completion response to the server.');
      break;
    }

    case 'textDocument/diagnostics': {
      break;
    }

    default:
      break;
  }
}
