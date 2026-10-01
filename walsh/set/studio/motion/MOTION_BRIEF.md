# Logo motion studies, brief (9/30/26)

André Mandel (private practice, ANDRÉ MANDEL) wants his logo to feel alive on the living plan set, the browser based 36 x 24 drawing set at walsh/set/v2.html. The logo itself never changes shape. What moves is how it arrives, its surface, the light on it, and what it does to the paper around it.

## His words
Shimmer. Gooey. Shows up by being painted, natural strokes. Singes the page. Branded, like with heat. Palimpsest, corrosion, rust, weather. Textures made over time: buildings whose paint is chipping off with layer upon layer of older paint underneath. A sense of time and touch, physical change, physical decay. Also a hot wax stamp as a personal signature on the title block.

## Assets (repo root /home/claude/a-mandel.github.io)
- walsh/marks/am10_lockup.webp: the full lockup, 357 x 520 px, transparent (the brushed A mark over MANDEL in Tenor Sans)
- walsh/marks/am10_mark.webp and am10_name.webp: the mark and the name alone
- walsh/set/v2.html: the reference sheet. See how the sidebar, lockup and paper look (LOCK, borderPath, the paper texture CSS)

## Every study
- One self contained HTML page in your folder, walsh/set/studio/motion/<your folder>/sNN.html, referencing the webp files by relative path (../../../../marks/am10_lockup.webp). No other external assets except Google Fonts (Tenor Sans, EB Garamond, Nothing You Could Do) and, only if truly needed, a library from cdnjs.cloudflare.com
- Stage: the top of the title block sidebar at true proportion, about 3 in wide by 4.5 in tall, on pale weathered paper (warm off white, faint foxing and fiber), the lockup filling the sidebar width as on v2, the black border with the concave curved corner at the upper right is optional. Center the stage on a quiet white page, scaled to fit the viewport, phone friendly
- Plays on load, then either holds its final state or loops gently. A small replay control (a pill with Tenor Sans caps, label "Replay"). Respect prefers-reduced-motion by showing the final state
- Techniques: SVG filters (feTurbulence, feDisplacementMap, feMorphology, feComponentTransfer, lighting), canvas 2D, WebGL or CSS. No video files of any kind
- Under about 1 MB per page. 60 fps on a laptop. Nothing corny, nothing cartoonish, no clip art. Elegant, material, crafted. Think Zaha Hadid paintings, Lebbeus Woods, Studio Cognitive Pulse renders, aged plaster, letterpress
- Burnt orange (#c4571f) is the one accent in his system. Avoid CHxTLD orange as a dominant color. His favorite color is cobalt; he loves turquoise and earthy colors
- No dashes of any kind in visible text (no em dash, en dash, or hyphen as punctuation). Dates M/D/YY
- A tiny caption under the stage: study number, a two to four word name, one italic line in EB Garamond saying what happens

## Verify
Serve the repo root with python3 -m http.server on your assigned port. Google Fonts may be blocked in this sandbox; that is fine for checks. With Python Playwright (installed) capture three frames per study (early, middle, final) at 1280 x 900 to walsh/set/studio/motion/<your folder>/shots/sNN_a.jpg, _b.jpg, _c.jpg (JPEG quality 80, about 900 px wide), and a final frame sNN.jpg. Look at every frame yourself and iterate until it is beautiful. Check for console errors. Stop your server when done.

## Do not
Use any connector (Gmail, Drive, Dropbox, Zoom). Commit or push. Touch files outside your folder.

## Report (under 120 words)
Your studies with one line each, your favorite and why, anything unresolved.
