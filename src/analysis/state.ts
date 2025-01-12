import { positionT } from "src/lsp/textdocument";
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

	hover(id: number, filename: string, position: positionT): hoverResponseT {
		const file = this.state[filename];

		return {
			id,
			jsonrpc: "2.0",
			result: {
				contents: `file: ${filename}, characters: ${file.length}`,
			},
		};
	}

}

