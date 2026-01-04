export { createClient as createClientBrowser } from './client';
export { updateSession } from './middleware';

// Note: createClientServer is exported separately to avoid Edge Runtime issues
// Import directly from './server' when needed in Server Components
