# WUB Lost & Found

A lost-and-found board for students and staff of World University of Bangladesh (Uttara, Dhaka).
This is a student-run project, not an official university service.

## Features
- Post an item as **Lost** or **Found**: title, category, campus location, date, description, photo, and contact info
- Search by keyword, filter by Lost / Found / Reunited, category and place
- Mark a post as **Reunited** or delete it
- Safety tip for found ID cards, wallets and phones: keep one detail secret to verify the real owner
- Works on phones and desktops

## Run it
It's a single file: open `index.html` in a browser, or turn on GitHub Pages
(Settings → Pages → Deploy from branch → `main` / root).

## Note on saving posts
Posts are saved in a shared database only when the page runs as a Claude artifact.
On GitHub Pages it runs in preview mode, so posts are kept only until the page is closed.
To make posting work for everyone, connect a free database such as Firebase Firestore.
