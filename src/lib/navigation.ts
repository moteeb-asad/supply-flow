export function isActivePath(currentPath: string, targetPath: string): boolean {
  // Exact match
  if (currentPath === targetPath) return true;

  // Section-level match (e.g. /settings, /settings/users)
  if (targetPath !== "/" && currentPath.startsWith(`${targetPath}/`)) {
    return true;
  }

  return false;
}
