/** Deployment-specific constants. */
export const REPO_URL = 'https://github.com/RamThiru83/epicompass';
export const REPO_BRANCH = 'main';
/** GitHub web-editor link for a content file (path relative to repo root). */
export const editUrl = (path: string) => `${REPO_URL}/edit/${REPO_BRANCH}/${path}`;
export const chapterFile = (n: number) => `apps/web/src/content/chapters/ch${String(n).padStart(2, '0')}.ts`;
