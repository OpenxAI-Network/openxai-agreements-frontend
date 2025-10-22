export const indexerUrl = "https://indexer.core.openxai.org";

export interface Agreement {
  id: number;
  for_account: string;
  title: string;
  description: string;
  created_at: number;
  signed_at: number | null;
  signature: string | null;
}
