import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const batchesDir = join(projectRoot, 'src', 'content', 'batches');
const inputPath = join(projectRoot, 'batch-input.txt');

const template = `請填寫每個欄位；評價可以換行。
格式說明：市售優格（心樸優格 120ml）、菌粉（川秀60菌）、傳代（川秀60菌 傳代*2 60ml）。

日期：
室溫：
發酵溫度：
牛奶：
菌種：
發酵：
冷藏：
凝乳：
質地：
酸度：
評價：
`;

const fieldNames = new Map([
	['日期', 'date'],
	['室溫', 'ambientTempC'],
	['發酵溫度', 'incubationTempC'],
	['牛奶', 'milk'],
	['菌種', 'culture'],
	['發酵', 'fermentation'],
	['冷藏', 'refrigeration'],
	['凝乳', 'resultSet'],
	['質地', 'resultTexture'],
	['酸度', 'resultAcidity'],
	['評價', 'resultOverall'],
]);

function cleanKey(value) {
	return value.replace(/\s+/g, '');
}

function yamlString(value) {
	return JSON.stringify(String(value));
}

function parseDate(value, defaultYear = new Date().getFullYear()) {
	const normalized = value.trim().replaceAll('-', '/');
	const parts = normalized.split('/').map(Number);
	if (parts.length !== 2 && parts.length !== 3) {
		throw new Error(`日期格式無法辨識：${value}。請使用 8/30 或 2026/8/30。`);
	}
	const [year, month, day] = parts.length === 3 ? parts : [defaultYear, ...parts];
	const probe = new Date(year, month - 1, day);
	if (
		!Number.isInteger(year) ||
		probe.getFullYear() !== year ||
		probe.getMonth() !== month - 1 ||
		probe.getDate() !== day
	) {
		throw new Error(`日期不存在：${value}`);
	}
	return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function parseTemperature(value, label) {
	const match = value.match(/-?\d+(?:\.\d+)?/);
	if (!match) throw new Error(`${label}無法辨識：${value}`);
	return match[0];
}

function parseClockRange(value, label) {
	const match = value.match(/(\d{1,2})\s*:?\s*(\d{2})\s*[-–—~～至]\s*(\d{1,2})\s*:?\s*(\d{2})/);
	if (!match) throw new Error(`${label}時間無法辨識：${value}。請使用 02:00-15:00。`);
	const startHour = Number(match[1]);
	const startMinute = Number(match[2]);
	const endHour = Number(match[3]);
	const endMinute = Number(match[4]);
	if (startHour > 23 || endHour > 23 || startMinute > 59 || endMinute > 59) {
		throw new Error(`${label}時間超出範圍：${value}`);
	}
	const startTotal = startHour * 60 + startMinute;
	let endTotal = endHour * 60 + endMinute;
	if (endTotal < startTotal) endTotal += 24 * 60;
	const duration = endTotal - startTotal;
	const hours = Math.floor(duration / 60);
	const minutes = duration % 60;
	return {
		start: `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`,
		end: `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`,
		duration: minutes === 0 ? `${hours}h` : `${hours}h${minutes}m`,
	};
}

function splitTopLevel(value) {
	const parts = [];
	let depth = 0;
	let current = '';
	for (const char of value) {
		if (char === '(' || char === '（') depth += 1;
		if (char === ')' || char === '）') depth -= 1;
		if (char === '+' && depth === 0) {
			parts.push(current.trim());
			current = '';
		} else {
			current += char;
		}
	}
	if (current.trim()) parts.push(current.trim());
	return parts;
}

function parseMilk(value) {
	const ingredients = [];
	for (const part of splitTopLevel(value)) {
		const fresh = part.match(/^鮮奶\s*(\d+(?:\.\d+)?\s*ml)(?:\s*[（(](.+?)[）)])?$/i);
		if (fresh) {
			const item = { type: 'fresh-milk', amount: fresh[1].replace(/\s+/g, ' ') };
			if (fresh[2]) item.brand = fresh[2].trim();
			ingredients.push(item);
			continue;
		}

		const powder = part.match(/^奶粉\s*(\d+(?:\.\d+)?\s*ml)(?:\s*[（(](.+?)[）)])?$/i);
		if (powder) {
			const details = powder[2]?.trim();
			const mixture = details?.match(/^(.+?)\s+(\d+(?:\.\d+)?\s*ml)\s*\+\s*水\s*(\d+(?:\.\d+)?\s*ml)$/i);
			if (mixture) {
				ingredients.push({
					type: 'milk-powder',
					brand: mixture[1].replace(/奶粉$/u, '').trim(),
					amount: mixture[2].replace(/\s+/g, ' '),
				});
				ingredients.push({ type: 'water', amount: mixture[3].replace(/\s+/g, ' ') });
			} else {
				const item = { type: 'milk-powder', amount: powder[1].replace(/\s+/g, ' ') };
				if (details) item.brand = details.replace(/奶粉$/u, '').trim();
				ingredients.push(item);
			}
			continue;
		}

		const water = part.match(/^水\s*(\d+(?:\.\d+)?\s*ml)$/i);
		if (water) {
			ingredients.push({ type: 'water', amount: water[1].replace(/\s+/g, ' ') });
			continue;
		}
		throw new Error(`牛奶內容無法辨識：${part}`);
	}
	if (ingredients.length === 0) throw new Error('牛奶欄位不可空白。');
	return ingredients;
}

function parseCulture(value) {
	const match = value.trim().match(/^(市售優格|菌粉|傳代)\s*[（(](.+)[）)]$/);
	if (!match) {
		throw new Error('菌種格式無法辨識。請使用「市售優格（心樸優格 120ml）」、「菌粉（川秀60菌）」或「傳代（川秀60菌 傳代*2 60ml）」。');
	}
	const [, source, details] = match;
	if (source === '市售優格') {
		const amountMatch = details.match(/^(.*?)\s+(\d+(?:\.\d+)?\s*ml)$/i);
		const name = (amountMatch?.[1] ?? details).trim();
		return {
			cultureSource: 'commercial-yogurt',
			cultureName: name,
			cultureOrigin: '市售優格當 starter',
			...(amountMatch ? { cultureAmount: amountMatch[2].replace(/\s+/g, ' ') } : {}),
		};
	}
	if (source === '菌粉') {
		return {
			cultureSource: 'new-powder',
			cultureName: details.trim(),
			cultureOrigin: '新開封菌粉',
		};
	}
	const generationMatch = details.match(/^(.*?)\s+傳代\s*[*＊xX×]\s*(\d+)(?:\s+(\d+(?:\.\d+)?\s*ml))?$/i);
	if (!generationMatch) {
		throw new Error('傳代格式無法辨識。請使用「傳代（川秀60菌 傳代*2 60ml）」。');
	}
	return {
		cultureSource: 'mother',
		cultureName: generationMatch[1].trim(),
		cultureOrigin: `傳代第 ${generationMatch[2]} 次`,
		cultureGeneration: Number(generationMatch[2]),
		...(generationMatch[3] ? { cultureAmount: generationMatch[3].replace(/\s+/g, ' ') } : {}),
	};
}

function parseFields(text) {
	const lines = text.replace(/^\uFEFF/, '').replaceAll('\r\n', '\n').split('\n');
	const firstDataLine = lines.findIndex(
		(line) =>
			/^\s*(?:\d{4}[/-])?\d{1,2}[/-]\d{1,2}\s*$/.test(line) ||
			/^\s*日期\s*[：:]\s*\S+/.test(line),
	);
	if (firstDataLine < 0) throw new Error('找不到日期。第一個資料列請使用 8/30 或 2026/8/30。');

	const firstLine = lines[firstDataLine].trim();
	const firstLabeled = firstLine.match(/^日期\s*[：:]\s*(.+)$/);
	const fields = { date: firstLabeled ? firstLabeled[1].trim() : firstLine };
	let currentField = null;
	for (const rawLine of lines.slice(firstDataLine + 1)) {
		const line = rawLine.trim();
		if (!line) continue;
		const labeled = line.match(/^([^：:]+)\s*[：:]\s*(.*)$/);
		const mapped = labeled ? fieldNames.get(cleanKey(labeled[1])) : null;
		if (mapped) {
			fields[mapped] = labeled[2].trim();
			currentField = mapped;
		} else if (currentField === 'resultOverall') {
			fields.resultOverall = `${fields.resultOverall} ${line}`.trim();
		} else {
			throw new Error(`無法辨識這一行：${line}`);
		}
	}
	const required = [
		['ambientTempC', '室溫'], ['incubationTempC', '發酵溫度'], ['milk', '牛奶'],
		['culture', '菌種'], ['fermentation', '發酵'], ['refrigeration', '冷藏'], ['resultSet', '凝乳'],
	];
	const missing = required.filter(([key]) => !fields[key]).map(([, label]) => label);
	if (missing.length) throw new Error(`缺少必要欄位：${missing.join('、')}`);
	return fields;
}

export function parseBatchText(text, defaultYear) {
	const fields = parseFields(text);
	if (fields.resultOverall?.includes('在這裡輸入成品觀察')) {
		throw new Error('評價仍是範本內容。請填寫實際成品觀察後再匯入。');
	}
	const date = parseDate(fields.date, defaultYear);
	const fermentation = parseClockRange(fields.fermentation, '發酵');
	const refrigeration = parseClockRange(fields.refrigeration, '冷藏');
	const culture = parseCulture(fields.culture);
	let resultAcidity = fields.resultAcidity?.trim();
	if (resultAcidity && date >= '2026-08-26' && !resultAcidity.includes('分數越高越酸')) {
		resultAcidity += '（分數越高越酸；6 以上為很酸，2 以下無明顯酸味）';
	}
	return {
		date,
		ambientTempC: parseTemperature(fields.ambientTempC, '室溫'),
		incubationTempC: parseTemperature(fields.incubationTempC, '發酵溫度'),
		incubationTimeH: `${fermentation.start}–${fermentation.end}（${fermentation.duration}）；冷藏 ${refrigeration.start}–${refrigeration.end}（${refrigeration.duration}）`,
		ingredients: parseMilk(fields.milk),
		...culture,
		resultSet: fields.resultSet.trim(),
		...(fields.resultTexture ? { resultTexture: fields.resultTexture.trim() } : {}),
		...(resultAcidity ? { resultAcidity } : {}),
		...(fields.resultOverall ? { resultOverall: fields.resultOverall.trim() } : {}),
	};
}

function nextBatchId(date) {
	const numbers = readdirSync(batchesDir)
		.map((name) => name.match(/^b(\d+)-/i))
		.filter(Boolean)
		.map((match) => Number(match[1]));
	const next = (numbers.length ? Math.max(...numbers) : 0) + 1;
	return `b${String(next).padStart(3, '0')}-${date.replaceAll('-', '')}`;
}

export function renderBatchMarkdown(batch) {
	const ingredientLines = batch.ingredients.map((item) => `  - ${JSON.stringify(item)}`).join('\n');
	const cultureLines = [
		batch.cultureAmount ? `cultureAmount: ${yamlString(batch.cultureAmount)}` : null,
		batch.cultureGeneration != null ? `cultureGeneration: ${batch.cultureGeneration}` : null,
	].filter(Boolean);
	const resultLines = [
		batch.resultTexture ? `resultTexture: ${yamlString(batch.resultTexture)}` : null,
		batch.resultAcidity ? `resultAcidity: ${yamlString(batch.resultAcidity)}` : null,
		batch.resultOverall ? `resultOverall: ${yamlString(batch.resultOverall)}` : null,
	].filter(Boolean);
	return `---
title: ${yamlString(batch.date.replaceAll('-', '/'))}
titleEn: ${yamlString(batch.date)}
date: ${yamlString(batch.date)}
ambientTempC: ${yamlString(batch.ambientTempC)}
incubationTempC: ${yamlString(batch.incubationTempC)}
incubationTimeH: ${yamlString(batch.incubationTimeH)}
equipment: {"device":"保溫小冰箱, 固定${batch.incubationTempC}度"}
ingredients:
${ingredientLines}
cultureSource: ${yamlString(batch.cultureSource)}
cultureName: ${yamlString(batch.cultureName)}
cultureOrigin: ${yamlString(batch.cultureOrigin)}
${cultureLines.join('\n')}${cultureLines.length ? '\n' : ''}resultSet: ${yamlString(batch.resultSet)}
${resultLines.join('\n')}${resultLines.length ? '\n' : ''}draft: false
---
`;
}

function prepareInputFile() {
	const untouchedLegacyTemplate = existsSync(inputPath) && [
		'8/30', '室溫：28 度', '發酵溫度：42 度', '牛奶：鮮奶 400ml',
		'菌種：菌粉（川秀60菌）', '評價：在這裡輸入成品觀察',
	].every((line) => readFileSync(inputPath, 'utf8').includes(line));
	if (!existsSync(inputPath) || untouchedLegacyTemplate) writeFileSync(inputPath, template, 'utf8');
	return inputPath;
}

function openEditor() {
	prepareInputFile();
	console.log(`\n請在記事本填寫：${inputPath}`);
	console.log('儲存並關閉記事本後，工具會繼續。\n');
	const editor = spawnSync('notepad.exe', [inputPath], { stdio: 'inherit' });
	if (editor.error) throw new Error(`無法開啟記事本：${editor.error.message}`);
	return inputPath;
}

function run() {
	const args = process.argv.slice(2);
	if (args.includes('--prepare')) {
		console.log(`已準備輸入檔：${prepareInputFile()}`);
		return;
	}
	const dryRun = args.includes('--dry-run');
	const inputArgIndex = args.indexOf('--input');
	const suppliedInput = inputArgIndex >= 0 ? args[inputArgIndex + 1] : null;
	const sourcePath = suppliedInput
		? resolve(projectRoot, suppliedInput)
		: args.includes('--from-default')
			? inputPath
			: openEditor();
	if (!existsSync(sourcePath)) throw new Error(`找不到輸入檔：${sourcePath}`);

	const batch = parseBatchText(readFileSync(sourcePath, 'utf8'));
	const id = nextBatchId(batch.date);
	const outputPath = join(batchesDir, `${id}.md`);
	const markdown = renderBatchMarkdown(batch);

	console.log('\n轉換預覽');
	console.log(`日期：${batch.date}`);
	console.log(`菌種：${batch.cultureSource} / ${batch.cultureName}`);
	console.log(`時間：${batch.incubationTimeH}`);
	console.log(`輸出：${outputPath}\n`);

	if (dryRun) {
		console.log(markdown);
		return;
	}
	writeFileSync(outputPath, markdown, { encoding: 'utf8', flag: 'wx' });
	console.log(`已建立：${outputPath}`);
	console.log('\n正在執行 npm run build...\n');
	try {
		execFileSync('npm.cmd', ['run', 'build'], { cwd: projectRoot, stdio: 'inherit' });
	} catch {
		throw new Error(`批次檔已建立，但建置失敗。請修正 ${outputPath} 後重新執行 npm run build。`);
	}
	if (!suppliedInput && existsSync(inputPath)) unlinkSync(inputPath);
	console.log(`\n完成：${id}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	try {
		run();
	} catch (error) {
		console.error(`\n匯入失敗：${error.message}`);
		if (existsSync(inputPath)) console.error(`輸入內容保留在：${inputPath}`);
		process.exitCode = 1;
	}
}
