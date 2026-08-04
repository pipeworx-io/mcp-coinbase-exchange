# @pipeworx/coinbase-exchange

[Coinbase Exchange](https://docs.cdp.coinbase.com/exchange/docs/welcome) MCP — keyless public market endpoints.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `products()` — list trading pairs
- `product(product_id)` — single product (e.g. `BTC-USD`)
- `product_book(product_id, level?)` — orderbook (level `1|2|3`)
- `product_ticker(product_id)` — best bid/ask + last trade
- `product_trades(product_id, limit?, before?, after?)` — recent trades
- `product_candles(product_id, granularity?, start?, end?)` — OHLC (granularity in seconds: `60|300|900|3600|21600|86400`)
- `product_stats(product_id)` — 24h stats
- `currencies()` — list currencies
- `currency(currency_id)` — single currency
- `time()` — server time

## Data source

`https://api.exchange.coinbase.com`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "coinbase-exchange": {
      "url": "https://gateway.pipeworx.io/coinbase-exchange/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Coinbase Exchange data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
