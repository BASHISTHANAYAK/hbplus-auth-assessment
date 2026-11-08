export * from './types';
// Metro will resolve authAdapter.web.ts on web and authAdapter.native.ts on native
// @ts-ignore
export { authAdapter } from './authAdapter';
