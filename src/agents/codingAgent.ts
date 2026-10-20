import { Agent, AgentTask, AgentResult } from './types';

export const codingAgent: Agent = {
  name: 'coding',
  description: 'Propose code changes and review guidance (no automatic edits).',
  async run(task: AgentTask): Promise<AgentResult> {
    return {
      summary: `Coding review prepared for: ${task.goal}`,
      findings: ['Analyzed requested change scope.', 'No files were modified.'],
      recommendations: [
        'Apply changes in small, reviewable commits.',
        'Run lint and tests before merging.',
      ],
      artifacts: { goal: task.goal },
    };
  },
};
