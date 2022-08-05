export function getUniqueKeys<T, K>(arr: T[], key: (item: T) => K): K[] {
  return Array.from(new Set(arr.map((item) => key(item))));
}
