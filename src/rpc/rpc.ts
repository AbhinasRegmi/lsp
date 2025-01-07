export function encodeMessage(msg: unknown): string {
  const content = JSON.stringify(msg);
  const contentLength = content.length;

  const response = `Content-Length: ${contentLength}\r\n\r\n${content}`;

  return response;
}

export function decodeMessage(msg: string) {
  // not sure right now if the msg will be binary or just normal string
  const [header, body] = msg.toString().split('\r\n\r\n');

  if (!header || !body) {
    throw new Error("Couldn't find the separator.");
  }

  const contentLengthBytes = header.substring('Content-Length: '.length);
  const contentLength = Number(contentLengthBytes);

  return contentLength;
}
