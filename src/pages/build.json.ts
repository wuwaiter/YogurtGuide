import type { APIRoute } from 'astro';
import { execSync } from 'node:child_process';

// 部署檢查用：記下這次建置的 commit。Cloudflare Workers Builds 帶 WORKERS_CI_COMMIT_SHA，GitHub Actions 帶 GITHUB_SHA。
// 本機建置（例如 app:debug 打包 APK）沒有這兩個變數，改讀 git 的 HEAD，App 設定頁才看得到內建內容是哪一版。
function localCommit(): string {
	try {
		return execSync('git rev-parse HEAD', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
	} catch {
		return '';
	}
}

export const GET: APIRoute = () => {
	const commit = process.env.WORKERS_CI_COMMIT_SHA ?? process.env.GITHUB_SHA ?? localCommit();
	return new Response(JSON.stringify({ commit }), {
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
	});
};
