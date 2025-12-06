import { CodePatch, Plan, FileContext } from '../../types';
import { createUnifiedDiff } from '../diffUtils';

export async function coderAgent(plan: Plan, context: FileContext[]): Promise<CodePatch[]> {
  // Simulate LLM Generation delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const patches: CodePatch[] = [];

  for (const relPath of plan.filesToEdit) {
    // Utilize the context passed from FileOps agent instead of reading disk directly
    const fileCtx = context.find(f => f.path === relPath);
    const oldContent = fileCtx ? fileCtx.content : "";
    
    // Pass full context to generator to simulate context-aware coding
    const newContent = generateReplacementContent(oldContent, plan, relPath, context);

    const diff = createUnifiedDiff(relPath, relPath, oldContent, newContent);
    patches.push({ filePath: relPath, diff, ok: true });
  }

  return patches;
}

function generateReplacementContent(oldContent: string, plan: Plan, relPath: string, context: FileContext[]) {
  // Minimal content generator — in practice, the LLM should return the full new file or patch.
  
  // Simulate prompt augmentation: The LLM "sees" other files in the context
  const otherFiles = context.filter(f => f.path !== relPath).map(f => f.path);
  const contextNote = otherFiles.length > 0 
    ? `// Context Aware: Checked ${otherFiles.join(', ')} for definitions`
    : `// Context: No other files provided`;

  if (!oldContent) {
    return `// NEW FILE CREATED BY CoderAgent
// Task: ${plan.task}
${contextNote}

export default function placeholder() {
  // TODO: implement logic for ${plan.task}
}
`;
  }

  // Intelligent appending based on file type (Mocking LLM behavior)
  const timestamp = new Date().toISOString();
  
  // Specific logic for the example prompt about "Redis"
  if (plan.task.toLowerCase().includes('redis') && relPath.includes('api.ts')) {
      const redisCode = `
// PATCH: Redis Cache Layer Added
// ${contextNote}
import { createClient } from 'redis';
const redis = createClient();

export const getCachedUser = async (id: string) => {
    await redis.connect();
    const cached = await redis.get(\`user:\${id}\`);
    if(cached) return JSON.parse(cached);
    
    const user = getUser(id); // Upstream call
    await redis.set(\`user:\${id}\`, JSON.stringify(user));
    return user;
};
`;
    // Insert before the last closing brace or just append
    return oldContent + redisCode;
  }

  // Generic fallback
  return oldContent + `\n\n// PATCH: Applied change for task: ${plan.task}\n// Timestamp: ${timestamp}\n${contextNote}\n`;
}