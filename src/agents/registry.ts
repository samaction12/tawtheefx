import { Agent } from './types';

const registry = new Map<string, Agent>();

export function registerAgent(agent: Agent): void {
  registry.set(agent.name, agent);
}

export function getAgent(name: string): Agent | undefined {
  return registry.get(name);
}

export function listAgents(): Agent[] {
  return [...registry.values()];
}

export function hasAgent(name: string): boolean {
  return registry.has(name);
}
