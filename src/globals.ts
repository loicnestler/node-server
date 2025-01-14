import crypto from 'node:crypto'
import {
  ReadableStream as NodeReadableStream,
  WritableStream as NodeWritableStream,
  TransformStream as NodeTransformStream,
  TextDecoderStream as NodeTextDecoderStream,
  TextEncoderStream as NodeTextEncoderStream,
} from '@remix-run/web-stream'

import { atob, btoa } from './base64'
import {
  Blob as NodeBlob,
  File as NodeFile,
  FormData as NodeFormData,
  Headers as NodeHeaders,
  Request as NodeRequest,
  Response as NodeResponse,
  fetch as nodeFetch,
} from './fetch'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
    }

    interface Global {
      atob: typeof atob
      btoa: typeof btoa

      Blob: typeof Blob
      File: typeof File

      Headers: typeof Headers
      Request: typeof Request
      Response: typeof Response
      fetch: typeof fetch
      FormData: typeof FormData

      ReadableStream: typeof ReadableStream
      WritableStream: typeof WritableStream
      TransformStream: typeof TransformStream
      TextDecoderStream: typeof TextDecoderStream
      TextEncoderStream: typeof TextEncoderStream

      crypto: Crypto
    }
  }
}

export function installGlobals() {
  if (typeof atob === 'undefined') global.atob = atob
  if (typeof btoa === 'undefined') global.btoa = btoa

  if (typeof Blob === 'undefined') global.Blob = NodeBlob
  global.File = NodeFile

  global.Headers = NodeHeaders as typeof Headers
  global.Request = NodeRequest as unknown as typeof Request
  global.Response = NodeResponse as unknown as typeof Response
  global.fetch = nodeFetch as typeof fetch
  global.FormData = NodeFormData

  global.ReadableStream = NodeReadableStream
  global.WritableStream = NodeWritableStream
  global.TransformStream = NodeTransformStream
  global.TextDecoderStream = NodeTextDecoderStream
  global.TextEncoderStream = NodeTextEncoderStream

  if (typeof global.crypto === 'undefined') {
    // If crypto.subtle is undefined, we're in a Node.js v16 environment
    if (typeof (crypto as Crypto).subtle === 'undefined') {
      // We can use the webcrypto polyfill
      global.crypto = require('crypto').webcrypto as Crypto
    } else {
      global.crypto = crypto as Crypto
    }
  }
}

/**
 * Credits:
 *   - https://github.com/remix-run/remix/blob/e77e2eb/packages/remix-node/globals.ts
 */
