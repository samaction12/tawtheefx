export type AgentName = 'research' | 'coding' | 'security' | 'testing';

export interface AgentTaskInput {
  goal: string;
  context?: Record<string, unknown>;
  maxRetries?: number;
}

export type TaskPriority = 'low' | 'normal' | 'high';
export type TaskStatus = 'queued' | 'claimed' | 'running' | 'completed' | 'failed' | 'cancelled';
export interface AgentTask {
  id: string;
  type: AgentName;
  goal: string;
  priority: TaskPriority;
  assignedSystem: string;
  assignedAgent: AgentName;
  status: TaskStatus;
  filesInScope: string[];
  dependencies: string[];
  context: Record<string, unknown>;
  claimedBy?: string;
  retries: number;
  maxRetries: number;
  createdAt: number;
  updatedAt: number;
  result?: AgentResult;
  errors: string[];
  proposedDiff?: string;
  reviewApproved: boolean;
}

export interface AgentResult {
  summary: string;
  findings: string[];
  recommendations: string[];
  artifacts?: Record<string, unknown>;
}

export interface Agent {
  name: AgentName;
  description: string;
  run(task: AgentTask): Promise<AgentResult>;
}
