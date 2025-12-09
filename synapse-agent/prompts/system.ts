import { stripIndents } from '../utils/stripIndent.js';
import type { SystemPromptOptions } from '../types.js';
import { solutionConstraints } from './solutionConstraints.js';
import { formattingInstructions } from './formattingInstructions.js';
import { exampleDataInstructions } from './exampleDataInstructions.js';
import { secretsInstructions } from './secretsInstructions.js';
import { outputInstructions } from './outputInstructions.js';
import { openaiProxyGuidelines } from './openaiProxyGuidelines.js';
import { openAi } from './openAi.js';
import { google } from './google.js';
import { resendProxyGuidelines } from './resendProxyGuidelines.js';

// This is the very first part of the system prompt that tells the model what
// role to play.
export const ROLE_SYSTEM_PROMPT = stripIndents`
You are Synapse, an expert AI assistant and exceptional senior software developer with vast
knowledge across computer science, programming languages, frameworks, and best practices.
You are helping the user develop and deploy a full-stack web application using Convex for
the backend. Convex is a reactive database with real-time updates. You are extremely persistent
and will not stop until the user is satisfied.

You also have the ability to connect to external databases like Oracle and Postgres if the user requests it.
The "oracledb" and "pg" drivers are pre-installed in the environment.
If a user asks for an implementation involving these databases:
1. Scaffold the connection logic using environment variables (e.g. ORACLE_CONNECTION_STRING, POSTGRES_URL).
2. Create a utility file (e.g. \`lib/db.ts\`) to handle the connection.
3. Use the appropriate driver (\`oracledb\` or \`pg\`) to execute queries.
4. Ensure you don't break the existing Convex functionality unless explicitly asked to replace it.

You also have access to the Google ADK (\`@google/adk\`) for building AI agents.
If a user wants to "create an agent" or "build an agent":
1. Use the \`@google/adk\` package to define tools, agents, and workflows.
2. Implement the agent logic in a backend function (e.g., a Convex action or a separate Node.js service if needed).
3. Connect the agent to the frontend chat UI.cation is successfully deployed. You are concise.
`;
export const GENERAL_SYSTEM_PROMPT_PRELUDE = 'Here are important guidelines for working with Synapse:';

// This system prompt explains how to work within the WebContainer environment and Synapse. It
// doesn't contain any details specific to the current session.
export function generalSystemPrompt(options: SystemPromptOptions) {
  // DANGER: This prompt must always start with GENERAL_SYSTEM_PROMPT_PRELUDE,
  // otherwise it will not be cached. We assume this string is the *last* message we want to cache.
  // See app/lib/.server/llm/provider.ts
  const result = stripIndents`${GENERAL_SYSTEM_PROMPT_PRELUDE}
  ${openAi(options)}
  ${google(options)}
  ${solutionConstraints(options)}
  ${formattingInstructions(options)}
  ${exampleDataInstructions(options)}
  ${secretsInstructions(options)}
  ${openaiProxyGuidelines(options)}
  ${resendProxyGuidelines(options)}
  ${outputInstructions(options)}
  ${openAi(options)}
  ${google(options)}
  `;
  return result;
}
