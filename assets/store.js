// Data layer: uses Firebase Firestore when configured, otherwise this browser's localStorage.
import { firebaseConfig } from "./config.js";

const FB = "https://www.gstatic.com/firebasejs/10.12.2/";
const LOCAL_KEY = "wublf-posts";
const ME_KEY = "wublf-local-id";

let mode = "local";
let fs = null, dbi = null, uid = null;
let readyPromise = null;

function localId() {
  try {
    let id = localStorage.getItem(ME_KEY);
    if (!id) { id = "u" + Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem(ME_KEY, id); }
    return id;
  } catch (e) { return "anon"; }
}
function readLocal() { try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]"); } catch (e) { return []; } }
function writeLocal(list) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(list)); }
  catch (e) { throw new Error("Your browser storage is full. Try a post without a photo."); }
}

export function ready() {
  if (readyPromise) return readyPromise;
  readyPromise = (async () => {
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) { mode = "local"; uid = localId(); return mode; }
    try {
      const app = await import(FB + "firebase-app.js");
      const auth = await import(FB + "firebase-auth.js");
      fs = await import(FB + "firebase-firestore.js");
      const a = app.initializeApp(firebaseConfig);
      dbi = fs.getFirestore(a);
      const au = auth.getAuth(a);
      const cred = await auth.signInAnonymously(au);
      uid = cred.user.uid;
      mode = "firebase";
    } catch (e) {
      console.error("Firebase failed, using demo mode", e);
      mode = "local"; uid = localId();
    }
    return mode;
  })();
  return readyPromise;
}

export const getMode = () => mode;
export const me = () => uid;

export async function list() {
  await ready();
  if (mode === "firebase") {
    const q = fs.query(fs.collection(dbi, "posts"), fs.orderBy("createdAt", "desc"), fs.limit(300));
    const snap = await fs.getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(valid);
  }
  return readLocal().filter(valid).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

export async function get(id) {
  await ready();
  if (!id) return null;
  if (mode === "firebase") {
    const d = await fs.getDoc(fs.doc(dbi, "posts", id));
    return d.exists() ? { id: d.id, ...d.data() } : null;
  }
  return readLocal().find(p => p.id === id) || null;
}

export async function add(data) {
  await ready();
  const post = { ...data, authorId: uid, status: "open", createdAt: Date.now() };
  if (mode === "firebase") {
    const ref = await fs.addDoc(fs.collection(dbi, "posts"), post);
    return ref.id;
  }
  const id = "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const all = readLocal(); all.unshift({ id, ...post }); writeLocal(all);
  return id;
}

export async function setStatus(id, status) {
  await ready();
  if (mode === "firebase") return fs.updateDoc(fs.doc(dbi, "posts", id), { status });
  const all = readLocal(); const p = all.find(x => x.id === id); if (p) { p.status = status; writeLocal(all); }
}

export async function remove(id) {
  await ready();
  if (mode === "firebase") return fs.deleteDoc(fs.doc(dbi, "posts", id));
  writeLocal(readLocal().filter(p => p.id !== id));
}

function valid(p) { return p && (p.type === "lost" || p.type === "found") && typeof p.title === "string"; }
