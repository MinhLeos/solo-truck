export const DOCUMENT_KINDS = [
  { value: 'permit', label: 'Health permit' },
  { value: 'commissary_agreement', label: 'Commissary agreement' },
  { value: 'food_manager_cert', label: 'Food manager certificate' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'other', label: 'Other' },
] as const;

export type DocumentKind = (typeof DOCUMENT_KINDS)[number]['value'];

export interface DocumentRecord {
  id: string;
  kind: string;
  filePath: string;
  expiresAt: string | null;
  createdAt: string;
}
