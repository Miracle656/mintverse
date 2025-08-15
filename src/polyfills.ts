import { Buffer } from 'buffer';
import process from 'process';

// Polyfill global variables
if (typeof window !== 'undefined') {
  (window as any).global = window;
  (window as any).Buffer = Buffer;
  (window as any).process = process;
}

export { Buffer, process };
