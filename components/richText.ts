// Preserve editor formatting while removing pasted layouts and executable HTML.
export function sanitizeContent(html: string): string {
  const document = new DOMParser().parseFromString(html, 'text/html');
  document.querySelectorAll('script,style,iframe,object,embed,form,input,button,svg,math,link,meta').forEach(node => node.remove());
  const allowed = new Set(['P', 'DIV', 'SPAN', 'BR', 'STRONG', 'B', 'EM', 'I', 'U', 'S', 'H1', 'H2', 'H3', 'H4', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'PRE', 'CODE', 'A', 'IMG', 'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD', 'HR', 'SUB', 'SUP']);
  for (const element of Array.from(document.body.querySelectorAll('*'))) {
    if (!allowed.has(element.tagName)) { element.replaceWith(...Array.from(element.childNodes)); continue; }
    const color = (element as HTMLElement).style.color;
    const background = (element as HTMLElement).style.backgroundColor;
    for (const attribute of Array.from(element.attributes)) {
      const safeClass = attribute.name === 'class' && attribute.value.split(/\s+/).every(c => /^ql-(align-(center|right|justify)|indent-[1-8]|direction-rtl|size-(small|large|huge)|font-(serif|monospace))$/.test(c));
      const safeLink = element.tagName === 'A' && attribute.name === 'href' && /^(https?:|mailto:)/i.test(attribute.value);
      const safeImage = element.tagName === 'IMG' && ((attribute.name === 'src' && /^(https?:|data:image\/(png|jpeg|gif|webp);base64,)/i.test(attribute.value)) || attribute.name === 'alt');
      if (!safeClass && !safeLink && !safeImage && !(element.tagName === 'LI' && attribute.name === 'data-list')) element.removeAttribute(attribute.name);
    }
    if (color) (element as HTMLElement).style.color = color;
    if (background) (element as HTMLElement).style.backgroundColor = background;
    if (element.tagName === 'A') { element.setAttribute('target', '_blank'); element.setAttribute('rel', 'noopener noreferrer'); }
    if (element.tagName === 'IMG') element.setAttribute('loading', 'lazy');
  }
  return document.body.innerHTML;
}

export function extractText(html: string): string {
  const document = new DOMParser().parseFromString(html, 'text/html');
  document.querySelectorAll('script, style').forEach(node => node.remove());
  document.querySelectorAll('p, div, h1, h2, h3, h4, li, br, td').forEach(node => node.append(document.createTextNode(' ')));
  return (document.body.textContent || '').replace(/\s+/g, ' ').trim();
}
