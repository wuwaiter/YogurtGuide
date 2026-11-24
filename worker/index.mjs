// Cloudflare Worker 入口（wrangler.toml 的 main）。只能匯出 handler，實作與說明在 handlers.mjs。
import { handlers } from './handlers.mjs';

export default handlers;
