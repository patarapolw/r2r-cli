export interface IEntry {
  _id?: string;
  deck: string;
  front?: string;
  back?: string;
  mnemonic?: string;
  srsLevel?: number;
  nextReview?: string | Date;
  tag?: string[];
  stat?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
  template?: {
    name: string;
    front?: string;
    back?: string;
    css?: string;
    js?: string;
  }
  note?: {
    meta?: Record<string, any>;
    data: Record<string, any>;
  }
  source?: {
    name?: string;
    h: string;
  }
}
