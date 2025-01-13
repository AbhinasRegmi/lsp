import { positionT, rangeT } from 'src/lsp/textdocument';
import {
  completionItemT,
  completionResponseT,
} from 'src/lsp/textdocument-completion';
import { definitionResponseT } from 'src/lsp/textdocument-definition';
import { diagnosticsT } from 'src/lsp/textdocument-diagnostics';
import { hoverResponseT } from 'src/lsp/textdocument-hover';

export class FileState {
  constructor(private state: Record<string, string> = {}) {}

  #getLineRange(line: number, start: number, end: number): rangeT {
    return {
      start: {
        line,
        character: start,
      },
      end: {
        line: line,
        character: end,
      },
    };
  }

  #getDiagnosticsFor(filename: string): Array<diagnosticsT> {
    const diagnostics: Array<diagnosticsT> = [];
    const file = this.state[filename];

    file.split('\n').forEach((line, i) => {
      // if the line contains vscode show error
      if (line.includes('vscode')) {
        const idx = line.indexOf('vscode');

        diagnostics.push({
          range: this.#getLineRange(i, idx, idx + 'vscode'.length),
          severity: 1,
          source: 'educationalLsp',
          message: 'You should know better. Use neovim',
        });
      }

      // if the line contains frontend show error
      if (line.includes('frontend')) {
        const idx = line.indexOf('frontend');

        diagnostics.push({
          range: this.#getLineRange(i, idx, idx + 'frontend'.length),
          severity: 1,
          source: 'educationalLsp',
          message:
            'What !!. You should be a backend developer. Better a fullstack developer',
        });
      }
    });
    return diagnostics;
  }

  // it means opening a document
  addFileState(filename: string, content: string): Array<diagnosticsT> {
    this.state[filename] = content;

    return this.#getDiagnosticsFor(filename);
  }

  // it means changing the content of the document
  updateFileState(filename: string, content: string): Array<diagnosticsT> {
    this.state[filename] = content;

    return this.#getDiagnosticsFor(filename);
  }

  hover(id: number, filename: string): hoverResponseT {
    const file = this.state[filename];

    return {
      id,
      jsonrpc: '2.0',
      result: {
        contents: `file: ${filename}, characters: ${file.length}`,
      },
    };
  }

  definition(
    id: number,
    filename: string,
    position: positionT,
  ): definitionResponseT {
    return {
      id,
      jsonrpc: '2.0',
      result: {
        uri: filename,
        range: {
          start: {
            line: position.line - 1 > 0 ? position.line - 1 : 0,
            character: 0,
          },
          end: {
            line: position.line - 1 > 0 ? position.line - 1 : 0,
            character: 0,
          },
        },
      },
    };
  }

  completion(id: number, filename: string): completionResponseT {
    const items: Array<completionItemT> = [
      {
        label: 'neovim',
        detail: 'super editor',
        documentation: 'This is an absolutely must have editor for poweruser.',
      },
      {
        label: 'vscode',
        detail: 'editor by almighty microsoft',
        documentation:
          'This is a good editor created by microsoft for the developers.',
      },
      {
        label: 'abhinasregmi',
        detail: 'superstart developer',
        documentation:
          'this lsp autocomplete is the result of hard effor by abhinas regmi. He is a full stack devloper working at either cotivity or ebpearls, or leapfrog in the future, who knows fusemachine too.',
      },
    ];

    return {
      id,
      jsonrpc: '2.0',
      result: items,
    };
  }
}
