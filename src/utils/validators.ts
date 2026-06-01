export const isEmpty = (value: any) => {
  if (value == null) return true;
  if (typeof value === 'string' || Array.isArray(value))
    return value.length === 0;
  if (value instanceof Map || value instanceof Set) return value.size === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

export const isValidUUID = (value: string) => {
  if (typeof value !== 'string') return false;

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return uuidRegex.test(value);
};
