export interface TableColumns<T> {
  label: string;
  csslabel: string[];
  property: keyof T | string;
  cssProperty: string[];
  subPRoperty?: keyof T | string;
  cssSubProperty?: string[];
  type: 'text' | 'date' | 'datetime' | 'time' | 'icon' | 'button' | 'badge';
  visible: boolean;
  sort: boolean;
  sortProperty?: string;
  action?: string;
  sticky: boolean;
  tooltip?: string;
  download?: boolean;
  propertyDownload?: string;
}

export interface TableFooter<T> {
  label: string;
  property: keyof T | string;
  tooltip: string;
}
