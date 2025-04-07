export function requireAuth(userId) {
  if (!userId) {
    throw new Error('Not authenticated');
  }
}
