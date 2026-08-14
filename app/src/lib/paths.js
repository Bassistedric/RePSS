export function getPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

// Retourne une copie immuable de obj avec path mis à jour.
export function setPath(obj, path, value) {
  const keys = path.split(".");
  const [head, ...rest] = keys;
  if (rest.length === 0) {
    return { ...obj, [head]: value };
  }
  return { ...obj, [head]: setPath(obj[head] ?? {}, rest.join("."), value) };
}
