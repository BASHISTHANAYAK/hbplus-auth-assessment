// Ambient type declarations for React Native Firebase Auth persistence
declare module 'firebase/auth' {
  export * from '@firebase/auth';
  export function getReactNativePersistence(storage: any): any;
}
