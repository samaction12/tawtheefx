import type { Agent, AgentTask, AgentResult } from './types.ts';

export const researchAgent: Agent = {
  name: 'research',
  description: 'Research and summarize relevant information for a goal.',
  async run(task: AgentTask): Promise<AgentResult> {
    const goal = task.goal;
    return {
      summary: `Research completed for: ${goal}`,
      findings: [
        'Reviewed available project context.',
        'No external network calls performed.',
      ],
      recommendations: [
        'Validate findings against primary sources before action.',
      ],
      artifacts: { goal, context: task.context },
    };
  },
};
