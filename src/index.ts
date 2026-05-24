interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Coinbase Exchange public MCP.
 */


const BASE = 'https://api.exchange.coinbase.com';
const UA = 'pipeworx-mcp-coinbase-exchange/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  { name: 'products', description: 'List trading pairs.', inputSchema: { type: 'object', properties: {} } },
  { name: 'product', description: 'Single product.', inputSchema: { type: 'object', properties: { product_id: { type: 'string' } }, required: ['product_id'] } },
  { name: 'product_book', description: 'Orderbook.', inputSchema: { type: 'object', properties: { product_id: { type: 'string' }, level: { type: 'number' } }, required: ['product_id'] } },
  { name: 'product_ticker', description: 'Best bid/ask + last trade.', inputSchema: { type: 'object', properties: { product_id: { type: 'string' } }, required: ['product_id'] } },
  {
    name: 'product_trades',
    description: 'Recent trades.',
    inputSchema: { type: 'object', properties: { product_id: { type: 'string' }, limit: { type: 'number' }, before: { type: 'string' }, after: { type: 'string' } }, required: ['product_id'] },
  },
  {
    name: 'product_candles',
    description: 'OHLC candles.',
    inputSchema: {
      type: 'object',
      properties: { product_id: { type: 'string' }, granularity: { type: 'number' }, start: { type: 'string' }, end: { type: 'string' } },
      required: ['product_id'],
    },
  },
  { name: 'product_stats', description: '24h stats.', inputSchema: { type: 'object', properties: { product_id: { type: 'string' } }, required: ['product_id'] } },
  { name: 'currencies', description: 'List currencies.', inputSchema: { type: 'object', properties: {} } },
  { name: 'currency', description: 'Single currency.', inputSchema: { type: 'object', properties: { currency_id: { type: 'string' } }, required: ['currency_id'] } },
  { name: 'time', description: 'Server time.', inputSchema: { type: 'object', properties: {} } },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const get = async (path: string, params?: Record<string, unknown>) => {
    const p = new URLSearchParams();
    if (params) for (const [k, v] of Object.entries(params)) if (v != null) p.set(k, String(v));
    const url = `${BASE}${path}${[...p].length ? `?${p}` : ''}`;
    const res = await fetch(url, { headers: { Accept: 'application/json', 'User-Agent': UA } });
    if (!res.ok) throw new Error(`Coinbase Exchange: ${res.status}`);
    return res.json();
  };
  const reqStr = (k: string, ex: string) => {
    const v = args[k];
    if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${k}" is missing. Pass a string like ${ex}.`);
    return v;
  };
  switch (name) {
    case 'products':
      return get('/products');
    case 'product':
      return get(`/products/${encodeURIComponent(reqStr('product_id', '"BTC-USD"'))}`);
    case 'product_book':
      return get(`/products/${encodeURIComponent(reqStr('product_id', '"BTC-USD"'))}/book`, { level: args.level });
    case 'product_ticker':
      return get(`/products/${encodeURIComponent(reqStr('product_id', '"BTC-USD"'))}/ticker`);
    case 'product_trades':
      return get(`/products/${encodeURIComponent(reqStr('product_id', '"BTC-USD"'))}/trades`, { limit: args.limit, before: args.before, after: args.after });
    case 'product_candles':
      return get(`/products/${encodeURIComponent(reqStr('product_id', '"BTC-USD"'))}/candles`, { granularity: args.granularity, start: args.start, end: args.end });
    case 'product_stats':
      return get(`/products/${encodeURIComponent(reqStr('product_id', '"BTC-USD"'))}/stats`);
    case 'currencies':
      return get('/currencies');
    case 'currency':
      return get(`/currencies/${encodeURIComponent(reqStr('currency_id', '"BTC"'))}`);
    case 'time':
      return get('/time');
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
