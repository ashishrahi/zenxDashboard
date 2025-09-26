// More concise version
export function globalFilter<T>(
  items: T[] | undefined,
  searchText: string = "",
  keys: (keyof T)[] = []
): T[] {
  if (!Array.isArray(items)) return [];

  const lowerSearch = searchText.toLowerCase();
  
  return items.filter(item => 
    keys.some(key => 
      String(item?.[key] ?? "").toLowerCase().includes(lowerSearch)
    )
  );
}