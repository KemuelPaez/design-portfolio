# One-page Design Portfolio

This is a small, single-page static portfolio for showcasing graphics design, video editing and social media management.

Tech stack
- HTML, CSS (vanilla), small JavaScript for UX — minimal, fast, and easy to host.

Why this stack
- Static files are simple to edit and deploy (GitHub Pages, Netlify). No backend needed for a basic portfolio.

Files
- `index.html` — page content and structure
- `styles.css` — responsive styling
- `script.js` — small UX helpers (smooth scroll + year)

Run locally
1. Open `index.html` in your browser (double-click or use your editor's Live Preview).

Optional: run a simple static server (recommended for local testing):

PowerShell example:
```
# if you have Python installed
python -m http.server 8000
# then visit http://localhost:8000
```

Deploy
- GitHub Pages: push this repo to GitHub and enable Pages from the `main` branch (or `gh-pages`).
- Netlify/Vercel: drag-and-drop the site folder or connect the repository for continuous deploys.

Next steps / Enhancements
- Replace placeholder tiles with real images/videos (optimize for web).
- Add case studies pages or modal popups for project details.
- Add a contact form backed by Formspree or a small serverless function.
- Add SEO metadata and social preview images.
