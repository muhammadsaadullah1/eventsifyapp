/**
 * Global polyfills for React Native
 * 
 * This file contains polyfills needed for various libraries
 * to work correctly in the React Native environment.
 */

// Polyfill for nanoid
// This ensures React Navigation can properly use nanoid/non-secure
if (!global.crypto) {
  // Use proper type casting for crypto polyfill
  global.crypto = {
    // Use a type assertion to match the expected signature
    getRandomValues: (<T extends ArrayBufferView | null>(array: T): T => {
      if (array === null) return array;
      const bytes = new Uint8Array(array.byteLength);
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = Math.floor(Math.random() * 256);
      }
      
      // Copy random values into the original array if it's a TypedArray
      if (array instanceof Uint8Array) {
        for (let i = 0; i < bytes.length; i++) {
          array[i] = bytes[i];
        }
      }
      
      return array;
    }) as Crypto['getRandomValues']
  } as Crypto;
}
