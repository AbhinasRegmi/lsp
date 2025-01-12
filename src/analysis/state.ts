export class FileState {
	constructor(private state: Record<string, string> = {}){
	}

	addFileState(filename: string, content: string): void {
		this.state[filename] = content;
	}
}

