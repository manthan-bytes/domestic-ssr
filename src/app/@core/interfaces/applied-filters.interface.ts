export interface AppliedFilters {
  name: string;
  value: string;
  type?: string;
  states?: State[];
  isSelected?: boolean;
}

export interface State {
  name: string;
  value: string;
  type: string;
}
