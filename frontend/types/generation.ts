export type PropDefinition = {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description: string;
};

export type ApiResponse = {
  componentName: string;
  description: string;
  styling: "tailwind" | "inline" | "css-module" | "none";
  props: PropDefinition[];
  sourceCode: string;
  accessibilityNotes?: string;
};
