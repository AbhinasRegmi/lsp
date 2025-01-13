import fs from 'node:fs';

export class FileLogger {
  private logStream: fs.WriteStream | undefined;

  constructor(private readonly filename: string) {
    this.logStream = fs.createWriteStream(this.filename, {
      flags: 'w',
      encoding: 'utf8',
    });
  }

  write(message: string) {
    const timestamp = new Date().toISOString();
    this.logStream.write(`[educationalLsp]:[${timestamp}] - ${message} \n`);
  }
}
