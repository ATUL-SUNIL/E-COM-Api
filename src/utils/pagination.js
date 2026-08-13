// Parse ?page & ?limit into safe, clamped values (default 20, max 100 per page).
// Anything non-numeric or hostile (e.g. an object) falls back to the default.
export function paginate(query = {}) {
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 20, 1), 100);
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  return { page, limit, skip: (page - 1) * limit };
}
