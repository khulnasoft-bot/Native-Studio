import { Plan } from '../../types';

export async function architectAgent(task: string): Promise<Plan> {
  // Simulate "Thinking" delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const steps = [
    "Analyze task and list files to touch",
    "Prepare minimal change plan",
    "Produce patch specification"
  ];

  // Heuristic: infer files from short path tokens in the task (demo)
  const filesToEdit = extractPathsFromTask(task);

  // If no files found in prompt, default to index or api based on keywords
  if (filesToEdit.length === 0) {
      if (task.toLowerCase().includes('api')) filesToEdit.push('src/handlers/api.ts');
      else filesToEdit.push('src/index.ts');
  }

  const plan: Plan = {
    task,
    steps,
    filesToEdit: filesToEdit,
    metadata: {
        strategy: "Heuristic Path Extraction",
        confidence: "High"
    }
  };

  return plan;
}

function extractPathsFromTask(task: string): string[] {
  // naive extraction: look for token patterns like src/... or packages/...
  const regex = /([A-Za-z0-9_\/\.-]+\.ts|src\/[A-Za-z0-9_\/\.-]+|packages\/[A-Za-z0-9_\/\.-]+)/g;
  const matches = task.match(regex);
  return matches ? Array.from(new Set(matches)) : [];
}