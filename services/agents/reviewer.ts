import { CodePatch, Review } from '../../types';

export async function reviewerAgent(patches: CodePatch[]): Promise<Review> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const issues: string[] = [];

  // Basic heuristic checks
  for (const p of patches) {
    if (!p.diff || p.diff.length < 10) {
      issues.push(`Patch for ${p.filePath} seems empty or too small.`);
    }
    // warn if patch contains "TODO" (example)
    if (p.diff.includes("TODO")) {
      issues.push(`Patch for ${p.filePath} contains TODO markers. Please resolve.`);
    }
  }

  // Simulation: Randomly fail reviews sometimes if it's too simple? 
  // For demo consistency, we just rely on the TODO check.
  
  const ok = issues.length === 0;
  return { ok, issues };
}