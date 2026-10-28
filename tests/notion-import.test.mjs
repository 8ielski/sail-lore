import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { APPROVED_PAGE, createSnapshot, convertBlocks, collectChildren, richText, safeLink } from '../scripts/notion-core.mjs';
const text = value => ({ type: 'text', plain_text: value, annotations: {} });
const paragraph = value => ({ type: 'paragraph', paragraph: { rich_text: [text(value)] } });
const title = { object: 'page', id: APPROVED_PAGE, properties: { Name: { type: 'title', title: [text('Canvas')] } } };
test('imports only the explicitly approved Canvas page', async () => {
  const paths = [];
  const result = await createSnapshot({ request: async path => { paths.push(path); return path.startsWith('/pages/') ? title : { results: [paragraph('Public Canvas text')], has_more: false }; }, image: () => assert.fail('No image expected') });
  assert.equal(result.slug, 'canvas'); assert.equal(result.title, 'Canvas');
  assert.equal(result.blocks[0].text[0].text, 'Public Canvas text');
  assert.deepEqual(paths, [`/pages/${APPROVED_PAGE}`, `/blocks/${APPROVED_PAGE}/children?page_size=100`]);
});
test('pagination retains later blocks', async () => {
  let n = 0;
  const result = await collectChildren(APPROVED_PAGE, async path => {
    if (!n++) return { results: [paragraph('First')], has_more: true, next_cursor: 'next cursor' };
    assert.match(path, /start_cursor=next%20cursor/); return { results: [paragraph('Last')], has_more: false };
  });
  assert.equal(result.length, 2);
});
test('bad pagination fails instead of dropping content', async () => {
  await assert.rejects(collectChildren(APPROVED_PAGE, async () => ({ results: [], has_more: true })), /cursor/);
});
test('retains rich links and emphasis; rejects executable links and equations', () => {
  assert.deepEqual(richText([{ ...text('Read'), href: 'https://sail-lore.com/', annotations: { bold: true, italic: true } }]), [{ text: 'Read', href: 'https://sail-lore.com/', bold: true, italic: true }]);
  assert.throws(() => safeLink('javascript:alert(1)'), /protocol/);
  assert.throws(() => safeLink('data:text/html,hello'), /protocol/);
  assert.throws(() => richText([{ type: 'equation' }]), /Unsupported/);
});
test('groups ordered/unordered lists and keeps headings/quotes/dividers', async () => {
  const blocks = await convertBlocks([
    { type: 'heading_1', heading_1: { rich_text: [text('Heading')] } },
    ...['A', 'B'].map(value => ({ type: 'bulleted_list_item', bulleted_list_item: { rich_text: [text(value)] } })),
    { type: 'numbered_list_item', numbered_list_item: { rich_text: [text('One')] } },
    { type: 'quote', quote: { rich_text: [text('Quote')] } }, { type: 'divider', divider: {} },
  ], {});
  assert.equal(blocks[0].level, 2); assert.equal(blocks[1].items.length, 2); assert.equal(blocks[2].ordered, true); assert.equal(blocks[3].type, 'quote'); assert.equal(blocks[4].type, 'divider');
});
test('multiple figures use durable local assets, captions and alt text', async () => {
  const blocks = await convertBlocks(['A', 'B'].map(label => ({ type: 'image', image: { type: 'file', file: { url: `https://files.example.com/${label}?temporary=secret` }, caption: [text(`Diagram ${label}`)] } })), { image: async url => `/media/notion/canvas/${new URL(url).pathname.slice(1)}.png` });
  assert.equal(blocks.length, 2); assert.equal(blocks[1].alt, 'Diagram B'); assert.equal(blocks[0].src, '/media/notion/canvas/A.png'); assert.ok(!JSON.stringify(blocks).includes('temporary'));
});
test('uncaptioned images and failed downloads stop the import', async () => {
  await assert.rejects(convertBlocks([{ type: 'image', image: { type: 'external', external: { url: 'https://example.com/a.png' }, caption: [] } }], {}), /caption/);
  await assert.rejects(convertBlocks([{ type: 'image', image: { type: 'external', external: { url: 'https://example.com/a.png' }, caption: [text('Diagram')] } }], { image: async () => { throw new Error('download failed'); } }), /download failed/);
});
test('tables preserve header cells and text', async () => {
  const blocks = await convertBlocks([{ id: 'table', type: 'table', has_children: true, table: { table_width: 2, has_column_header: true } }], { children: async () => [{ type: 'table_row', table_row: { cells: [[text('A')], [text('B')]] } }] });
  assert.equal(blocks[0].header, true); assert.equal(blocks[0].rows[0][1][0].text, 'B');
});
test('unsupported/nested blocks fail explicitly', async () => {
  await assert.rejects(convertBlocks([{ type: 'embed', embed: {} }], {}), /Unsupported/);
  await assert.rejects(convertBlocks([{ ...paragraph('Nested'), has_children: true }], {}), /Nested/);
});
test('rejects archived, wrong-ID and empty pages', async () => {
  for (const page of [{ ...title, archived: true }, { ...title, id: 'another-page' }]) await assert.rejects(createSnapshot({ request: async () => page }), /unavailable/);
  await assert.rejects(createSnapshot({ request: async path => path.startsWith('/pages/') ? title : { results: [], has_more: false } }), /empty/);
});
test('missing credentials leave the reviewed snapshot untouched', async () => {
  const url = new URL('../content/canvas.notion.json', import.meta.url); const before = await readFile(url, 'utf8');
  const result = spawnSync(process.execPath, ['scripts/import-notion.mjs'], { cwd: new URL('../', import.meta.url), env: { ...process.env, NOTION_TOKEN: '' }, encoding: 'utf8' });
  assert.notEqual(result.status, 0); assert.match(result.stderr, /NOTION_TOKEN is missing/); assert.equal(await readFile(url, 'utf8'), before);
});
