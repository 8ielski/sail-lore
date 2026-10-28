export const APPROVED_PAGE = '76a9a8d1f4d149f089c4ff18fcb8d87f';
export function safeLink(value) {
  if (!value) return undefined;
  if (/^\/(?!\/)|^#/.test(value)) return value;
  const u = new URL(value);
  if (!['https:', 'http:', 'mailto:'].includes(u.protocol)) throw new Error('Unsupported link protocol');
  return value;
}
export function richText(values = []) {
  return values.map(value => {
    if (!['text', 'mention'].includes(value.type)) throw new Error(`Unsupported rich text: ${value.type}`);
    const a = value.annotations || {};
    if (a.strikethrough || a.underline) throw new Error('Underline/strikethrough need renderer support before importing');
    return { text: value.plain_text ?? value.text?.content ?? '', ...(value.href ? { href: safeLink(value.href) } : {}), ...(a.bold ? { bold: true } : {}), ...(a.italic ? { italic: true } : {}), ...(a.code ? { code: true } : {}) };
  });
}
export async function convertBlocks(blocks, { children, image }) {
  const out = [];
  for (const block of blocks) {
    const type = block.type, data = block[type];
    if (!data) throw new Error(`Malformed block: ${type}`);
    if (block.has_children && type !== 'table') throw new Error(`Nested ${type} requires review; nothing was imported`);
    if (['paragraph', 'heading_1', 'heading_2', 'heading_3', 'quote'].includes(type)) {
      out.push({ type: type.startsWith('heading') ? 'heading' : type, text: richText(data.rich_text), ...(type.startsWith('heading') ? { level: type === 'heading_3' ? 3 : 2 } : {}) });
    } else if (type === 'bulleted_list_item' || type === 'numbered_list_item') {
      const ordered = type === 'numbered_list_item';
      const previous = out.at(-1);
      if (previous?.type === 'list' && previous.ordered === ordered) previous.items.push(richText(data.rich_text));
      else out.push({ type: 'list', ordered, items: [richText(data.rich_text)] });
    } else if (type === 'image') {
      const caption = richText(data.caption), alt = caption.map(x => x.text).join('').trim();
      if (!alt) throw new Error('Add a descriptive caption to each Notion image before import');
      const url = data[data.type]?.url;
      if (!url) throw new Error('Image URL missing');
      out.push({ type: 'figure', src: await image(url), alt, caption });
    } else if (type === 'table') {
      if (data.has_row_header) throw new Error('Tables with a first-column header need review');
      const rows = await children(block.id);
      if (!rows.length || rows.some(row => row.type !== 'table_row' || row.table_row.cells.length !== data.table_width)) throw new Error('Malformed table');
      out.push({ type: 'table', header: Boolean(data.has_column_header), rows: rows.map(row => row.table_row.cells.map(richText)) });
    } else if (type === 'divider') {
      out.push({ type: 'divider' });
    } else throw new Error(`Unsupported Notion block: ${type}. No content snapshot was replaced.`);
  }
  return out;
}
export async function collectChildren(id, request) {
  const blocks = []; let cursor;
  for (let page = 0; page < 100; page++) {
    const result = await request(`/blocks/${id}/children?page_size=100${cursor ? `&start_cursor=${encodeURIComponent(cursor)}` : ''}`);
    if (!Array.isArray(result.results)) throw new Error('Malformed Notion block response');
    blocks.push(...result.results);
    if (!result.has_more) return blocks;
    if (!result.next_cursor || result.next_cursor === cursor) throw new Error('Notion pagination cursor missing/repeated');
    cursor = result.next_cursor;
  }
  throw new Error('Notion pagination limit exceeded');
}
export async function createSnapshot({ request, image }) {
  const page = await request(`/pages/${APPROVED_PAGE}`);
  if (page.id?.replaceAll('-', '') !== APPROVED_PAGE || page.archived || page.in_trash || page.object !== 'page') throw new Error('Approved Canvas page unavailable or archived');
  const titleProperty = Object.values(page.properties || {}).find(p => p.type === 'title');
  const title = richText(titleProperty?.title).map(x => x.text).join('').trim();
  if (!title) throw new Error('Page title missing');
  const children = id => collectChildren(id, request);
  const blocks = await convertBlocks(await children(APPROVED_PAGE), { children, image });
  if (!blocks.some(block => block.type === 'paragraph' && block.text.some(t => t.text.trim()))) throw new Error('Refusing an empty Canvas import');
  return { pageId: APPROVED_PAGE, slug: 'canvas', title, blocks };
}
