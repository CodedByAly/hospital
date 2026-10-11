/** Resolves a file in /public against the configured base URL. */
export const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
