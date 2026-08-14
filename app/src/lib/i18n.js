export function makeTranslator(i18n, lang) {
  const table = i18n?.[lang]?.ui || {};
  const fallback = i18n?.fr?.ui || {};
  return function t(key) {
    return table[key] ?? fallback[key] ?? key;
  };
}
