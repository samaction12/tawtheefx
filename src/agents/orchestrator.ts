import { randomUUID } from 'node:crypto';
import type { AgentTask, AgentTaskInput, AgentName, TaskPriority, TaskStatus } from './types.ts';
import { registerAgent, getAgent, listAgents } from './registry.ts';
import { researchAgent } from './researchAgent.ts';
import { codingAgent } from './codingAgent.ts';
import { securityAgent } from './securityAgent.ts';
import { testingAgent } from './testingAgent.ts';

registerAgent(researchAgent);
registerAgent(codingAgent);
registerAgent(securityAgent);
registerAgent(testingAgent);

const store = new Map<string, AgentTask>();
const locks = new Map<string, string>(); // normalized scope -> taskId

export interface ExternalAdapter {
  name: string;
  invoke(task: AgentTask): Promise<AgentTask>;
}

const adapters = new Map<string, ExternalAdapter>();
export function registerAdapter(adapter: ExternalAdapter): void {
  adapters.set(adapter.name, adapter);
}
export function listAdapters(): string[] {
  return [...adapters.keys()];
}

function normalizePath(p: string): string {
  return p.replace(/\\/g, '/').replace(/\/+/g, '/').replace(/^\.\//, '').replace(/\/$/, '');
}

function scopeKey(p: string): string {
  return normalizePath(p);
}

function scopesOverlap(a: string, b: string): boolean {
  const na = scopeKey(a);
  const nb = scopeKey(b);
  if (na === nb) return true;
  if (na.startsWith(nb + '/')) return true;
  if (nb.startsWith(na + '/')) return true;
  return false;
}

function hasOverlap(taskId: string, scopes: string[]): boolean {
  for (const [scope, owner] of locks.entries()) {
    if (owner === taskId) continue;
    for (const s of scopes) {
      if (scopesOverlap(scope, s)) return true;
    }
  }
  return false;
}

export function createTask(type: AgentName, input: AgentTaskInput & { priority?: TaskPriority; assignedSystem?: string; filesInScope?: string[]; dependencies?: string[] }): AgentTask {
  const id = randomUUID();
  const now = Date.now();
  const mr = Number.isInteger(input.maxRetries) ? Math.min(2, Math.max(0, input.maxRetries as number)) : 2;
  const scopes = (input.filesInScope || []).map(normalizePath);
  const task: AgentTask = {
    id,
    type,
    goal: input.goal,
    priority: input.priority || 'normal',
    assignedSystem: input.assignedSystem || 'tawtheefx',
    assignedAgent: type,
    status: 'queued',
    filesInScope: scopes,
    dependencies: input.dependencies || [],
    context: input.context || {},
    retries: 0,
    maxRetries: mr,
    createdAt: now,
    updatedAt: now,
    errors: [],
    reviewApproved: false,
  };
  store.set(id, task);
  return task;
}

export function getTask(id: string): AgentTask | undefined {
  return store.get(id);
}

export function listTasks(): AgentTask[] {
  return [...store.values()];
}

export function claimTask(id: string, owner?: string): boolean {
  const task = store.get(id);
  if (!task || task.status !== 'queued') return false;
  // dependencies must be completed
  for (const dep of task.dependencies) {
    const d = store.get(dep);
    if (!d || d.status !== 'completed') return false;
  }
  if (task.filesInScope.length && hasOverlap(id, task.filesInScope)) return false;
  for (const s of task.filesInScope) locks.set(scopeKey(s), id);
  task.status = 'claimed';
  task.claimedBy = owner;
  task.updatedAt = Date.now();
  return true;
}

export function startTask(id: string): boolean {
  const task = store.get(id);
  if (!task || task.status !== 'claimed') return false;
  task.status = 'running';
  task.updatedAt = Date.now();
  return true;
}

export async function runTask(id: string): Promise<AgentTask> {
  const task = store.get(id);
  if (!task) throw new Error('task_not_found');
  if (!claimTask(id)) {
    if (task.status !== 'running' && task.status !== 'claimed') {
      // already terminal or locked
    }
  }
  if (task.status === 'queued') {
    // claim failed due to lock
    task.status = 'failed';
    task.errors.push('scope_locked');
    task.updatedAt = Date.now();
    return task;
  }
  if (task.status === 'claimed') startTask(id);
  const agent = getAgent(task.type);
  if (!agent) {
    failTask(id, 'agent_not_found');
    return task;
  }
  let attempt = 0;
  while (attempt <= task.maxRetries) {
    try {
      const result = await agent.run(task);
      if (task.status === 'cancelled') return task;
      task.result = result;
      task.status = 'completed';
      task.updatedAt = Date.now();
      releaseLocks(id);
      return task;
    } catch (err) {
      attempt++;
      task.retries = attempt;
      const msg = err instanceof Error ? err.message : String(err);
      task.errors.push(msg);
      task.updatedAt = Date.now();
      if (task.status === 'cancelled') {
        releaseLocks(id);
        return task;
      }
      if (attempt > task.maxRetries) {
        task.status = 'failed';
        releaseLocks(id);
        return task;
      }
      await new Promise((r) => setTimeout(r, 50 * attempt));
    }
  }
  task.status = 'failed';
  task.updatedAt = Date.now();
  releaseLocks(id);
  return task;
}

export function completeTask(id: string, result: AgentTask['result'], proposedDiff?: string, owner?: string): boolean {
  const task = store.get(id);
  if (!task || (task.status !== 'running' && task.status !== 'claimed')) return false;
  if (task.claimedBy && owner && task.claimedBy !== owner) return false;
  task.result = result;
  task.proposedDiff = proposedDiff;
  task.status = 'completed';
  task.updatedAt = Date.now();
  releaseLocks(id);
  return true;
}

export function failTask(id: string, error: string): boolean {
  const task = store.get(id);
  if (!task || task.status === 'completed' || task.status === 'cancelled') return false;
  task.errors.push(error);
  task.status = 'failed';
  task.updatedAt = Date.now();
  releaseLocks(id);
  return true;
}

export function cancelTask(id: string): boolean {
  const task = store.get(id);
  if (!task || task.status === 'completed' || task.status === 'failed') return false;
  task.status = 'cancelled';
  task.updatedAt = Date.now();
  releaseLocks(id);
  return true;
}

function releaseLocks(taskId: string): void {
  for (const [scope, owner] of [...locks.entries()]) {
    if (owner === taskId) locks.delete(scope);
  }
}

export function submitDiff(id: string, diff: string, owner?: string): boolean {
  const task = store.get(id);
  if (!task || (task.status !== 'claimed' && task.status !== 'running')) return false;
  if (task.claimedBy && owner && task.claimedBy !== owner) return false;
  task.proposedDiff = diff;
  task.updatedAt = Date.now();
  return true;
}

export function approveReview(id: string): boolean {
  const task = store.get(id);
  if (!task || task.status !== 'completed') return false;
  task.reviewApproved = true;
  task.updatedAt = Date.now();
  return true;
}

export const orchestrator = {
  createTask,
  getTask,
  listTasks,
  claimTask,
  startTask,
  runTask,
  completeTask,
  failTask,
  cancelTask,
  submitDiff,
  approveReview,
  listAgents,
  registerAdapter,
  listAdapters,
  normalizePath,
  scopesOverlap,
};
