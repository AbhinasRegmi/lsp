import fs from "node:fs";

export function getLogger(filename: string) {
	const logStream = fs.createWriteStream(filename, { flags: 'w', encoding: 'utf8' });

	return (message: string) => {
		const timestamp = new Date().toISOString();
		logStream.write(`[educationalLsp]:[${timestamp}] - ${message} \n`);
	};
}
