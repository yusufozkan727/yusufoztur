// @ts-nocheck
// Cloudflare Pages Function: POST /api/update-content
// Commits content changes to GitHub repo using REST API.

export const onRequestPost: PagesFunction = async ({ request, env }) => {
  try {
    const adminPass = request.headers.get('x-admin-password') || '';
    if (!env.ADMIN_PASSWORD) {
      return json({ ok: false, error: 'ADMIN_PASSWORD not set' }, 500);
    }
    if (adminPass !== env.ADMIN_PASSWORD) {
      return json({ ok: false, error: 'Unauthorized' }, 401);
    }

    const { type, lang, data } = await request.json();
    if (!type) return json({ ok: false, error: 'Missing type' }, 400);

    const owner = env.GITHUB_OWNER;
    const repo = env.GITHUB_REPO;
    const token = env.GITHUB_TOKEN;
    const branch = env.DEFAULT_BRANCH || 'main';
    if (!owner || !repo || !token) {
      return json({ ok: false, error: 'GitHub env vars missing' }, 500);
    }

    let path = '';
    let content = '';
    let message = '';

    if (type === 'settings') {
      path = 'content/settings.json';
      content = JSON.stringify(data, null, 2) + '\n';
      message = 'chore(content): update settings.json via admin-lite';
    } else if (type === 'home') {
      path = 'content/home.md';
      content = toFrontmatter({
        lang: data.lang || lang || 'tr',
        hero_title: data.hero_title,
        hero_subtitle: data.hero_subtitle,
        primary_cta: data.primary_cta,
        secondary_cta: data.secondary_cta,
      });
      message = `chore(content): update home.md (${lang}) via admin-lite`;
    } else if (type === 'contact') {
      path = 'content/contact.md';
      content = toFrontmatter({
        lang: data.lang || lang || 'tr',
        whatsapp: data.whatsapp,
        email: data.email,
        msg: data.msg || '',
      });
      message = `chore(content): update contact.md (${lang}) via admin-lite`;
    } else if (type === 'testimonial') {
      const slug = slugify(`${data.name}-${(data.date || '').toString().slice(0,10) || Date.now()}`);
      path = `content/testimonials/${slug}.md`;
      content = toFrontmatter({
        lang: data.lang || lang || 'tr',
        name: data.name,
        rating: Number(data.rating) || 5,
        quote: data.quote,
        date: data.date || new Date().toISOString(),
        avatar: data.avatar || '',
      });
      message = `feat(content): add testimonial ${slug} via admin-lite`;
    } else if (type === 'place') {
      const slug = slugify(data.slug || data.title || 'place');
      path = `content/places/${slug}.md`;
      content = toFrontmatter({
        lang: data.lang || lang || 'tr',
        slug,
        title: data.title,
        summary: data.summary || '',
        cover: data.cover || '',
        location: data.location || {},
        open: data.open || '',
        ticket: data.ticket || '',
        gallery: data.gallery || [],
        tips: data.tips || [],
      }, data.body || '');
      message = `feat(content): add/update place ${slug} via admin-lite`;
    } else {
      return json({ ok: false, error: 'Unsupported type' }, 400);
    }

    const res = await commitFile({ owner, repo, token, branch, path, content, message });
    return json({ ok: true, path, commit: res?.commit?.sha || null });
  } catch (err: any) {
    return json({ ok: false, error: err?.message || String(err) }, 500);
  }
};

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function slugify(s: string) {
  return (s || '')
    .toString()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function toFrontmatter(obj: any, body = '') {
  const yaml = toYAML(obj);
  return `---\n${yaml}---\n\n${body}`;
}

function toYAML(obj: any, indent = 0) {
  const pad = '  '.repeat(indent);
  let out = '';
  for (const [key, val] of Object.entries(obj)) {
    if (val === undefined || val === null || val === '') continue;
    if (Array.isArray(val)) {
      if (val.length === 0) continue;
      out += `${pad}${key}:\n`;
      for (const item of val) {
        if (typeof item === 'object') {
          out += `${pad}- ${objectToInlineYAML(item)}\n`;
        } else {
          out += `${pad}- ${String(item)}\n`;
        }
      }
    } else if (typeof val === 'object') {
      out += `${pad}${key}:\n` + toYAML(val, indent + 1);
    } else if (typeof val === 'number') {
      out += `${pad}${key}: ${val}\n`;
    } else {
      out += `${pad}${key}: ${escapeYAML(String(val))}\n`;
    }
  }
  return out;
}

function objectToInlineYAML(obj: any) {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null || v === '') continue;
    if (typeof v === 'object') {
      parts.push(`${k}: { ... }`);
    } else if (typeof v === 'number') {
      parts.push(`${k}: ${v}`);
    } else {
      parts.push(`${k}: ${String(v)}`);
    }
  }
  return parts.join(', ');
}

function escapeYAML(s: string) {
  if (/[:#\-?*&!|>'"%@`{}]/.test(s) || /\s/.test(s)) {
    return JSON.stringify(s);
  }
  return s;
}

async function commitFile({ owner, repo, token, branch, path, content, message }: any) {
  const apiBase = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
  } as any;

  // Check if file exists to include sha
  let sha: string | undefined = undefined;
  const getRes = await fetch(`${apiBase}?ref=${branch}`, { headers });
  if (getRes.status === 200) {
    const data = await getRes.json();
    sha = data.sha;
  }

  const encoded = base64Encode(content);
  const body = JSON.stringify({
    message,
    content: encoded,
    branch,
    sha,
  });
  const putRes = await fetch(apiBase, { method: 'PUT', headers, body });
  if (!putRes.ok) {
    const txt = await putRes.text();
    throw new Error(`GitHub PUT failed: ${putRes.status} ${txt}`);
  }
  return await putRes.json();
}

function base64Encode(str: string) {
  // Handle Unicode safely in Workers
  const utf8 = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < utf8.length; i++) binary += String.fromCharCode(utf8[i]);
  return btoa(binary);
}

