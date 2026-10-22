import { orchestrator } from '../src/agents/orchestrator.ts';

async function main() {
  // overlapping scopes
  const a = orchestrator.createTask('coding', { goal: 'a', filesInScope: ['src/foo.ts'] });
  const claimedA = orchestrator.claimTask(a.id);
  if (!claimedA) throw new Error('A claim failed');
  const b = orchestrator.createTask('coding', { goal: 'b', filesInScope: ['src/foo.ts'] });
  if (orchestrator.claimTask(b.id)) throw new Error('overlapping claim allowed');
  orchestrator.cancelTask(a.id);

  // parent directory conflict
  const c = orchestrator.createTask('coding', { goal: 'c', filesInScope: ['src'] });
  if (!orchestrator.claimTask(c.id)) throw new Error('parent claim failed');
  const d = orchestrator.createTask('coding', { goal: 'd', filesInScope: ['src/bar.ts'] });
  if (orchestrator.claimTask(d.id)) throw new Error('parent/child overlap allowed');
  orchestrator.cancelTask(c.id);

  // lock release after completion
  const e = orchestrator.createTask('coding', { goal: 'e', filesInScope: ['x.ts'] });
  orchestrator.claimTask(e.id);
  orchestrator.completeTask(e.id, { summary: 'done', findings: [], recommendations: [] });
  const f = orchestrator.createTask('coding', { goal: 'f', filesInScope: ['x.ts'] });
  if (!orchestrator.claimTask(f.id)) throw new Error('lock not released');
  orchestrator.cancelTask(f.id);

  // invalid transitions
  const g = orchestrator.createTask('research', { goal: 'g' });
  if (orchestrator.completeTask(g.id, { summary: 'x', findings: [], recommendations: [] })) throw new Error('complete from queued allowed');

  // cancellation
  const h = orchestrator.createTask('research', { goal: 'h' });
  if (!orchestrator.cancelTask(h.id)) throw new Error('cancel failed');

  // dependency gating
  const dep = orchestrator.createTask('testing', { goal: 'dep' });
  const child = orchestrator.createTask('coding', { goal: 'child', dependencies: [dep.id] });
  if (orchestrator.claimTask(child.id)) throw new Error('dependency not enforced');
  orchestrator.claimTask(dep.id);
  orchestrator.completeTask(dep.id, { summary: 'done', findings: [], recommendations: [] });
  if (!orchestrator.claimTask(child.id)) throw new Error('dependency claim failed after completion');

  // submitDiff
  if (!orchestrator.submitDiff(child.id, 'diff --git a/x b/x')) throw new Error('submitDiff failed');
  if (orchestrator.getTask(child.id)?.proposedDiff !== 'diff --git a/x b/x') throw new Error('diff not stored');

  // parallel read-only tasks (no scopes) can be claimed
  const r1 = orchestrator.createTask('research', { goal: 'r1' });
  const r2 = orchestrator.createTask('research', { goal: 'r2' });
  if (!orchestrator.claimTask(r1.id) || !orchestrator.claimTask(r2.id)) throw new Error('parallel read-only claim failed');

  console.log('PASS: coordination verification');
}

main().catch((e) => {
  console.error('FAIL:', e);
  process.exit(1);
});
