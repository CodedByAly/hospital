/** URL of a file in /public that also works when the site is served from a sub-path. */
export const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
