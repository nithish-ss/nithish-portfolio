// Mirrors backend/app/schemas/demo.py. Change both together.
export type FieldValue = number | string | string[];

export interface DemoOption { value: string; label: string }

export interface DemoField {
  key: string;
  label: string;
  kind: "number" | "select" | "multiselect";
  help?: string | null;
  unit?: string | null;
  min?: number | null;
  max?: number | null;
  step?: number | null;
  default?: FieldValue | null;
  options?: DemoOption[] | null;
}

export interface ModelInfo {
  name: string;
  dataset: string;
  validation?: string | null;
  /** Only values measured by the training script. */
  metrics: Record<string, number>;
  notes: string[];
}

export interface DemoSchema {
  slug: string;
  title: string;
  intro: string;
  submit_label: string;
  fields: DemoField[];
  model: ModelInfo;
}

export interface PredictResponse {
  prediction: string;
  confidence: number | null;
  explanation: string;
  details: { label: string; value: string }[];
}
