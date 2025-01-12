import { positionT } from "src/lsp/textdocument";
import { definitionResponseT } from "src/lsp/textdocument-definition";
import { hoverResponseT } from "src/lsp/textdocument-hover";

export class FileState {
	constructor(private state: Record<string, string> = {}) {
	}

	addFileState(filename: string, content: string): void {
		this.state[filename] = content;
	}

	updateFileState(filename: string, content: string): void {
		this.state[filename] = content;
	}

	hover(id: number, filename: string): hoverResponseT {
		const file = this.state[filename];

		return {
			id,
			jsonrpc: "2.0",
			result: {
				contents: `file: ${filename}, characters: ${file.length}`,
			},
		};
	}

	definition(id: number, filename: string, position: positionT): definitionResponseT {

		return {
			id,
			jsonrpc: "2.0",
			result: {
				uri: filename,
				range: {
					start: {
						line: (position.line - 1) > 0 ? (position.line - 1) : 0,
						character: 0,
					},
					end: {
						line: (position.line - 1) > 0 ? (position.line - 1) : 0,
						character: 0,
					},
				},
			},
		};

	}

}

