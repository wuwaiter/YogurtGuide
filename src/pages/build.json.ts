import type { APIRoute } from 'astro';
import { execSync } from 'node:child_process';

// 部署檢查用：記下這次建置的 commit。Cloudflare Workers Builds 帶 WORKERS_CI_COMMIT_SHA，GitHub Actions 帶 GITHUB_SHA。
// 本機建置（例如 app:debug 打包 APK）沒有這兩個變數，改讀 git 的 HEAD，App 設定頁才看得到內建內容是哪一版。
// 有還沒 commit 的改動時加上 -dirty：內容和那個 commit 不同，App 也不會把它當成已是最新版。
function localCommit(): string {
	const git = (args: string) => execSync(`git ${args}`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
	try {
		const sha = git('rev-parse HEAD');
		return git('status --porcelain') ? `${sha}-dirty` : sha;
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
