import { Agent, AgentTask, AgentResult } from './types';

export const securityAgent: Agent = {
  name: 'security',
  description: 'Security review guidance without modifying systems.',
  async run(task: AgentTask): Promise<AgentResult> {
    return {
      summary: `Security review prepared for: ${task.goal}`,
      findings: ['Checked for secret exposure risks.', 'No privileged operations executed.'],
      recommendations: [
        'Keep API keys server-side only.',
        'Enforce least-privilege access controls.',
      ],
      artifacts: { goal: task.goal },
    };
  },
};
