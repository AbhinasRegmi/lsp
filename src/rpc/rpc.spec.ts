import { decodeMessage, encodeMessage } from './rpc';

interface testMessage {
  testing: boolean;
}

test('encoding of message', () => {
  const testData: testMessage = { testing: true };
  expect(encodeMessage(testData)).toBe(
    `Content-Length: 16\r\n\r\n{"testing":true}`,
  );
});

test('decoding of message', () => {
  const testData: testMessage = { testing: true };
  const encodedMsg = encodeMessage(testData);

  expect(decodeMessage(encodedMsg)).toBe(16);
});
