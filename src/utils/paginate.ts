export type PaginatedResponse<T> = {
  data: Array<T>
  hasNextPage: boolean
  currentPage: number
  totalCount: number
  totalPages: number
}

export function paginateData<T>(data: Array<T>, page: number, limit: number): PaginatedResponse<T> {
  const paginatedItems = data.slice(page * limit, (page + 1) * limit)

  return {
    data: paginatedItems,
    hasNextPage: data.slice((page + 1) * limit).length > 0,
    currentPage: page,
    totalCount: paginatedItems.length,
    totalPages: Math.floor(data.length / limit),
  }
}
