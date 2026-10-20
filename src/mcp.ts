import { orchestrator } from './agents/orchestrator';

function getToken(req: any): string | null {
  const h = req.headers?.authorization || '';
  const m = /^Bearer\s+(.+)$/i.exec(h);
  return m ? m[1] : null;
}

function authorized(req: any): boolean {
  const expected = process.env.MCP_TOKEN;
  if (!expected) return false;
  return getToken(req) === expected;
}

function textResult(text: string) {
  return { content: [{ type: 'text', text }] };
}

export async function handleMcp(req: any, res: any): Promise<void> {
  // DNS rebinding protection
  const origin = req.headers?.origin;
  if (origin) {
    try {
      const o = new URL(origin);
      const host = req.headers?.host;
      if (host && o.host !== host) {
        res.status(403).json({ jsonrpc: '2.0', id: null, error: { code: -32000, message: 'forbidden_origin' } });
        return;
      }
    } catch {
      res.status(400).json({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'invalid_origin' } });
      return;
    }
  }

  if (req.method === 'GET') {
    res.status(405).set('Allow', 'POST').json({ jsonrpc: '2.0', id: null, error: { code: -32000, message: 'method_not_allowed' } });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).set('Allow', 'POST, GET').end();
    return;
  }

  const body = req.body || {};
  const { jsonrpc, id, method, params } = body;
  if (jsonrpc !== '2.0') {
    res.status(400).json({ jsonrpc: '2.0', id: id ?? null, error: { code: -32600, message: 'Invalid Request' } });
    return;
  }

  if (method === 'initialize') {
    const requested = params?.protocolVersion;
    const supported = '2025-03-26';
    res.json({ jsonrpc: '2.0', id, result: { protocolVersion: supported, capabilities: { tools: {} }, serverInfo: { name: 'tawtheefx-mcp', version: '0.1.0' } } });
    return;
  }

  if (method === 'tools/list') {
    res.json({ jsonrpc: '2.0', id, result: { tools: [
      { name: 'tawtheefx_list_tasks', description: 'List tasks in the shared ledger', inputSchema: { type: 'object', properties: {} } },
      { name: 'tawtheefx_get_task', description: 'Read a task and its scope', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
      { name: 'tawtheefx_claim_task', description: 'Claim an eligible task', inputSchema: { type: 'object', properties: { id: { type: 'string' }, owner: { type: 'string' } }, required: ['id'] } },
      { name: 'tawtheefx_submit_result', description: 'Submit a result for a claimed task', inputSchema: { type: 'object', properties: { id: { type: 'string' }, summary: { type: 'string' } }, required: ['id', 'summary'] } },
      { name: 'tawtheefx_submit_diff', description: 'Submit a proposed diff for review', inputSchema: { type: 'object', properties: { id: { type: 'string' }, diff: { type: 'string' } }, required: ['id', 'diff'] } },
    ] } });
    return;
  }

  if (method === 'tools/call') {
    const name = params?.name;
    const args = params?.arguments || {};
    // state-changing tools require auth
    const mutating = ['tawtheefx_claim_task', 'tawtheefx_submit_result', 'tawtheefx_submit_diff'].includes(name);
    if (mutating && !authorized(req)) {
      res.json({ jsonrpc: '2.0', id, error: { code: -32001, message: 'unauthorized' } });
      return;
    }
    // reads also require token for safety
    if (!authorized(req)) {
      res.json({ jsonrpc: '2.0', id, error: { code: -32001, message: 'unauthorized' } });
      return;
    }
    try {
      if (name === 'tawtheefx_list_tasks') {
        const tasks = orchestrator.listTasks();
        res.json({ jsonrpc: '2.0', id, result: textResult(JSON.stringify(tasks)) });
        return;
      }
      if (name === 'tawtheefx_get_task') {
        const t = orchestrator.getTask(String(args.id));
        if (!t) throw new Error('not_found');
        res.json({ jsonrpc: '2.0', id, result: textResult(JSON.stringify(t)) });
        return;
      }
      if (name === 'tawtheefx_claim_task') {
        const ok = orchestrator.claimTask(String(args.id), args.owner ? String(args.owner) : 'antigravity');
        res.json({ jsonrpc: '2.0', id, result: textResult(JSON.stringify({ ok })) });
        return;
      }
      if (name === 'tawtheefx_submit_result') {
        const ok = orchestrator.completeTask(String(args.id), { summary: String(args.summary), findings: [], recommendations: [] }, undefined, 'antigravity');
        res.json({ jsonrpc: '2.0', id, result: textResult(JSON.stringify({ ok })) });
        return;
      }
      if (name === 'tawtheefx_submit_diff') {
        const ok = orchestrator.submitDiff(String(args.id), String(args.diff), 'antigravity');
        res.json({ jsonrpc: '2.0', id, result: textResult(JSON.stringify({ ok })) });
        return;
      }
      res.json({ jsonrpc: '2.0', id, error: { code: -32601, message: 'method not found' } });
    } catch (e) {
      res.json({ jsonrpc: '2.0', id, error: { code: -32000, message: e instanceof Error ? e.message : String(e) } });
    }
    return;
  }

  res.json({ jsonrpc: '2.0', id, error: { code: -32601, message: 'method not found' } });
}
