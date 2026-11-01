// Shared helpers, site header/footer, and item cards.
import * as store from "./store.js";
export { store };

export const CATS = [
  ["phone", "📱", "Mobile phone"], ["wallet", "👛", "Wallet / Money"], ["id", "🪪", "ID card / Documents"],
  ["keys", "🔑", "Keys"], ["bag", "🎒", "Bag / Backpack"], ["books", "📚", "Books / Notes"],
  ["electronics", "💻", "Laptop / Electronics"], ["earbuds", "🎧", "Earbuds / Headphones"],
  ["clothing", "🧥", "Clothing / Accessories"], ["jewelry", "💍", "Jewellery / Watch"],
  ["bottle", "🥤", "Water bottle / Tiffin"], ["umbrella", "☂️", "Umbrella"], ["other", "📦", "Other"]
];
export const LOCS = ["Classroom", "Library", "Cafeteria / Canteen", "Auditorium", "Computer / Science lab", "Washroom",
  "Corridor / Stairs / Lift", "Main gate / Reception", "Parking area", "University bus / Transport", "Prayer room",
  "Sports / Common room", "Outside campus (nearby)", "Other"];
export const DEPTS = ["Business Administration", "Tourism & Hospitality Management", "English", "Law",
  "Media Studies & Journalism", "Education", "Pharmacy", "Architecture", "Biomedical Engineering & Public Health",
  "Computer Science & Engineering", "Textile Engineering & Fashion Design", "Mechatronics", "Mechanical", "Automobile",
  "Electrical & Electronic", "Civil", "Staff / Faculty member", "Visitor"];
export const catOf = k => CATS.find(c => c[0] === k) || CATS[CATS.length - 1];

export const $ = s => document.querySelector(s);
export function el(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === "class") e.className = v;
    else if (k === "text") e.textContent = v;
    else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  }
  for (const k of kids) if (k != null) e.append(k);
  return e;
}
export const opt = (v, t) => el("option", { value: v, text: t });
export const param = k => new URLSearchParams(location.search).get(k);

export function fmtDate(d) {
  if (!d) return "";
  try { return new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }
  catch (e) { return d; }
}
export function ago(ts) {
  if (!ts) return "";
  const s = (Date.now() - ts) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return Math.floor(s / 60) + " min ago";
  if (s < 86400) return Math.floor(s / 3600) + " h ago";
  const d = Math.floor(s / 86400);
  return d < 30 ? d + " day" + (d > 1 ? "s" : "") + " ago" : new Date(ts).toLocaleDateString("en-GB");
}
export function todayLocal() { const t = new Date(); t.setMinutes(t.getMinutes() - t.getTimezoneOffset()); return t.toISOString().slice(0, 10); }
export function photoSrc(p) {
  const d = p && p.photo;
  return typeof d === "string" && d.startsWith("data:image/") ? d : null;
}

export function toast(msg) {
  let t = $("#toast"); if (!t) { t = el("div", { id: "toast", class: "toast" }); document.body.append(t); }
  t.textContent = msg; t.classList.add("show");
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2600);
}
export async function copy(text) {
  try { await navigator.clipboard.writeText(text); toast("Copied"); }
  catch (e) { toast("Couldn't copy. Select the text and copy it."); }
}

const NAV = [["index.html", "Home"], ["browse.html", "Browse"], ["post.html", "Post an item"], ["my-posts.html", "My posts"], ["tips.html", "Tips & FAQ"], ["about.html", "About"]];

const LOGO_SVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';

export function layout(active) {
  const header = el("header", { class: "site" });
  const inner = el("div", { class: "wrap nav" });
  const logo = el("a", { class: "logo", href: "index.html" });
  const mark = el("span", { class: "mark" }); mark.innerHTML = LOGO_SVG;
  logo.append(mark, el("span", {}, el("b", { text: "WUB Lost & Found" }), el("small", { text: "World University of Bangladesh" })));
  const menuBtn = el("button", { class: "menu-btn", "aria-label": "Menu", "aria-expanded": "false", text: "☰" });
  const links = el("nav", { class: "links" });
  for (const [href, label] of NAV) links.append(el("a", { href, class: href === active ? "on" : null, text: label }));
  menuBtn.addEventListener("click", () => { const o = links.classList.toggle("open"); menuBtn.setAttribute("aria-expanded", o); });
  inner.append(logo, menuBtn, links); header.append(inner);
  document.body.prepend(header);

  const footer = el("footer", { class: "site" });
  const fw = el("div", { class: "wrap fgrid" });
  fw.append(
    el("div", {}, el("b", { text: "WUB Lost & Found" }),
      el("p", { text: "A student-run community board for World University of Bangladesh, Uttara, Dhaka. Not an official university service." })),
    el("div", {}, el("b", { text: "Pages" }), ...NAV.map(([h, l]) => el("a", { href: h, text: l }))),
    el("div", {}, el("b", { text: "Found something valuable?" }),
      el("p", { text: "ID cards, wallets and phones can also be handed in at the university reception or office." }))
  );
  footer.append(fw, el("div", { class: "wrap fbottom", text: "© " + new Date().getFullYear() + " WUB Lost & Found · Made by students, for students" }));
  document.body.append(footer);

  store.ready().then(m => {
    if (m === "local") {
      const n = el("div", { class: "demo" }, el("div", { class: "wrap", text: "Demo mode: posts are saved only on this device until the database is connected." }));
      header.after(n);
    }
  });
}

export function card(p) {
  const c = catOf(p.category), src = photoSrc(p), done = p.status === "resolved";
  const ph = el("div", { class: "ph" });
  if (src) ph.append(el("img", { src, alt: "", loading: "lazy" })); else ph.append(el("span", { class: "ico", text: c[1] }));
  ph.append(el("span", { class: "badge " + (done ? "b-done" : p.type === "lost" ? "b-lost" : "b-found"), text: done ? "Reunited" : p.type }));
  return el("a", { class: "card" + (done ? " resolved" : ""), href: "item.html?id=" + encodeURIComponent(p.id) },
    ph,
    el("div", { class: "cb" },
      el("h3", { text: p.title }),
      el("div", { class: "meta", text: "📍 " + p.location + (p.place ? " · " + p.place : "") }),
      el("div", { class: "meta", text: "🗓 " + fmtDate(p.date) + " · " + ago(p.createdAt) }),
      p.desc ? el("p", { text: p.desc }) : null));
}

export function empty(icon, title, text, action) {
  return el("div", { class: "empty" }, el("div", { class: "big", text: icon }), el("h3", { text: title }), el("p", { text }), action || null);
}
export function loading() { return el("div", { class: "empty" }, el("div", { class: "big", text: "⏳" }), el("h3", { text: "Loading…" })); }
