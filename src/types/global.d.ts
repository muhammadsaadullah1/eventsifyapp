// Add type declarations for modules that don't have their own declaration files

declare module 'base-64' {
  export function encode(str: string): string;
  export function decode(str: string): string;
}

declare module 'web-streams-polyfill/ponyfill' {
  export class ReadableStream<T = any> {
    constructor(underlyingSource?: any, strategy?: any);
    // Add other methods as needed
  }
  
  export class WritableStream<T = any> {
    constructor(underlyingSink?: any, strategy?: any);
    // Add other methods as needed
  }
  
  export class TransformStream<I = any, O = any> {
    constructor(transformer?: any, writableStrategy?: any, readableStrategy?: any);
    // Add other methods as needed
  }
}

declare module 'text-encoding' {
  export class TextEncoder {
    encode(input: string): Uint8Array;
  }
  
  export class TextDecoder {
    constructor(label?: string, options?: { fatal?: boolean });
    decode(input: Uint8Array | ArrayBuffer | ArrayBufferView): string;
  }
}

declare module 'abortcontroller-polyfill/dist/polyfill-patch-fetch' {
  // This module doesn't export anything directly, it just patches global
}

declare module '@azure/core-asynciterator-polyfill' {
  // This module doesn't export anything directly, it just patches global
}
