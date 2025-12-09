import { LanguageModelUsage, LanguageModelV1 } from 'ai';

export type SynapseModel = {
  name: string;
  model_slug: string;
  ai: LanguageModelV1;
  maxTokens: number;
};

export type SynapseResult = {
  success: boolean;
  numDeploys: number;
  usage: LanguageModelUsage;
  files: Record<string, string>;
};
