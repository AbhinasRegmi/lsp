import { positionT } from "src/lsp/textdocument";
import { completionItemT, completionResponseT } from "src/lsp/textdocument-completion";
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

	completion(id: number, filename: string): completionResponseT {
		const items: Array<completionItemT> = [
			{
				label: "neovim",
				detail: "super editor",
				documentation: "This is an absolutely must have editor for poweruser.",
			},
			{
				label: "vscode",
				detail: "editor by almighty microsoft",
				documentation: "This is a good editor created by microsoft for the developers.",
			},
			{
				label: "abhinasregmi",
				detail: "superstart developer",
				documentation: "this lsp autocomplete is the result of hard effor by abhinas regmi. He is a full stack devloper working at either cotivity or ebpearls, or leapfrog in the future, who knows fusemachine too."
			}
		];

		return {
			id,
			jsonrpc: "2.0",
			result: items,
		}
	}

}

