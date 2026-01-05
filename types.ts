
export interface Photo {
  id: string;
  url: string;
  name: string;
  orientation: 'landscape' | 'portrait';
  width: number;
  height: number;
}

export interface ReportMetadata {
  objeto: string;
  data: string;
  orgao: string;
  logoUrl?: string;
}
