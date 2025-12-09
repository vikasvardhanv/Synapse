import type { WebContainer } from '@webcontainer/api';
import type { Message } from 'ai';

type SynapseDebug = {
  setLogLevel?: (level: any) => void;
  chatInitialId?: string;
  messages?: Message[];
  parsedMessages?: Message[];
  sessionId?: string;
  webcontainer?: WebContainer;
};

export function setSynapseDebugProperty(key: keyof SynapseDebug, value: SynapseDebug[keyof SynapseDebug]) {
  if (typeof window === 'undefined') {
    console.warn('setSynapseDebugProperty called on server, ignoring');
    return;
  }
  (window as any).__SYNAPSE_DEBUG = (window as any).__SYNAPSE_DEBUG || {};
  (window as any).__SYNAPSE_DEBUG[key] = value;
}
