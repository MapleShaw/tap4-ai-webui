export type SortField = 'star_rating' | 'collection_time';
export type SortOrder = 'asc' | 'desc';

export interface ExploreParams {
  tags?: string[];
  sortField?: SortField;
  sortOrder?: SortOrder;
}
