# WUB Lost & Found

A lost-and-found website for students and staff of World University of Bangladesh (Uttara, Dhaka).
Student-run project, not an official university service.

## Pages
| Page | What it does |
|---|---|
| `index.html` | Home: search, stats, recent lost and found items, how it works, categories |
| `browse.html` | All items with search, Lost / Found / Reunited tabs, category, place and sort filters |
| `post.html` | Form to post a lost or found item, with photo upload |
| `item.html` | Item details, contact info, share link, matching items; the poster can mark it reunited or delete it |
| `my-posts.html` | Posts made from this device |
| `tips.html` | Safety tips and FAQ |
| `about.html` | About, privacy, and how to report a post |
| `404.html` | Not-found page |

Shared code is in `assets/`: `style.css`, `app.js` (layout and helpers), `store.js` (data), `config.js` (Firebase settings).

## Saving posts (Firebase)
Until Firebase is set up, the site runs in **demo mode** and keeps posts only on the visitor's own device.
To save posts for everyone:

1. Create a project at https://console.firebase.google.com
2. **Build → Firestore Database → Create database** (location `asia-south1`, production mode)
3. **Build → Authentication → Get started → Sign-in method → Anonymous → Enable**
4. **Firestore → Rules**: paste the contents of `firestore.rules` and click **Publish**
5. **Project settings → Your apps → Web (</>)**: register an app and copy the `firebaseConfig` values into `assets/config.js`
6. Commit; GitHub Pages updates in a minute or two

To remove a bad post, delete it in the Firebase console under Firestore → `posts`.

## Run locally
ES modules need a web server: `python3 -m http.server`, then open http://localhost:8000
