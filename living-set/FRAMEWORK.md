# ANDRÉ MANDEL · Living Set Framework

**v1.0 · 10/1/26 · exported from the Walsh Residence living set (`walsh/set/v2.html`, commit cb385c2)**

The living plan set as a kit: a bound 36 x 24 drawing set that lives on screen, pages like paper, carries a live model on its cover and prints true scale. Walsh was the first one. This folder is everything needed to make the next one look exactly the same with different data.

Proof it is the same set: the Walsh data run through this engine renders pixel identical to `walsh/set/v2.html` on all 34 sheets (0.000% of pixels differ). See section 12.

Live demo: [a-mandel.github.io/living-set/template](https://a-mandel.github.io/living-set/template/) · Reference set: [a-mandel.github.io/walsh/set](https://a-mandel.github.io/walsh/set/)

---

## Contents

1. What is in the kit
2. How a set is put together
3. The sheet: geometry
4. The look: paper, ink, type, color
5. Project data: `project.js` (the SET schema)
6. Sheet kinds
7. Crew sheets and overlays: the extension API
8. Real drawings: `drawings.src.json` to `drawings.js`
9. The cover's live model
10. Motion, phone, print
11. Migrating a project, step by step
12. Verification
13. House rules
14. The Walsh reference crews
15. Tuning knobs

---

## 1. What is in the kit

```
living-set/
  FRAMEWORK.md            this file
  engine/
    living-set.css        the look: paper, binding, ruler, title block, notes, drawings, motion, phone, print
    living-set.js         the engine: builds every sheet from window.SET, turns pages, flutters, prints
    living-kit.js         house components for crew sheets: notes columns, tables, legend, details, schedules
  brand/                  the AM lockup and mark (am10), the vector logo, favicons
  model/
    pocket.js, pocket.css the pocket model: massing JSON or GLB, drafting style, the reel the cover reads
    three.r128.min.js     three.js r128, vendored
  template/               a complete blank set: Sample Residence, 15 sheets, every sheet kind in use
    index.html            the shell (load order lives here)
    project.js            THE file to rewrite per project
    draw/drawings.src.json  plan geometry in model feet, built into draw/drawings.js
    draw/shared.js        the one record every crew reads (grids, levels, rooms)
    sheets/notes.js       A0.2 General notes, with the kit
    sheets/schedules.js   F2.0 Budget framework and A7.0 Openings schedule, with the kit
    sheets/overlays.js    grid bubbles over the plans, the registration pattern
    model/index.html, massing.json   the cover's live model
    assets/cover-still.webp          the cover still (print, phone, loading)
  tools/
    new_project.py        scaffold a new set from the template, identity filled, QR written
    build_drawings.py     drawings.src.json (layers, DXF or SVG) to drawings.js, in the Walsh pen table
    make_qr.py            the title block QR from SET.live.url
    make_still.py         the cover still from the model's first shot
    check.py              renders every sheet, phone, print PDF, video check; the last step before it goes out
    lskit.py              shared helpers (local server, offline fonts)
```

Python tools need `pip install playwright segno ezdxf pillow pypdf` and `python3 -m playwright install chromium`. ezdxf only for DXF.

## 2. How a set is put together

One HTML shell loads, in this order (it matters):

| # | File | Puts on `window` | Role |
|---|---|---|---|
| 1 | `project.js` | `SET` | every word and number about the project |
| 2 | `draw/drawings.js` | `DRAWINGS` | true scale plan views, labels, tables, notes, view registration |
| 3 | inline script | `LIVING_SHEETS = []`, `LIVING_OVERLAYS = []` | the crew registries |
| 4 | `draw/shared.js` | `SHARED` | the shared record crews read (grids, levels, rooms, dims, tags) |
| 5 | `engine/living-kit.js` | `LIVING_KIT` | house components for crew sheets |
| 6 | `sheets/*.js` | pushes to the registries | crew sheets and overlays |
| 7 | `engine/living-set.js` | | merges crew sheets into SET, builds and runs the set |

The engine never holds project words. A sheet pushed by a crew with an existing id replaces that sheet's entry; a new id slots in by group, then by prefix, then by number (A0.0, A0.1, A1.2, A2.1 …).

## 3. The sheet: geometry

All in sheet inches, origin at the top left of the 36 x 24 sheet.

| Element | Value |
|---|---|
| Sheet | 36 x 24 in, landscape. Print `@page size:36in 24in, margin 0` |
| Binding | full 1 in on the left, black book cloth (#181715 with noise, ribs and a highlight), three rivets at y 4, 12, 20, x 0.8 |
| Border | rounded rect from x 1.25 (BL) to 35.5, y 0.5 to 23.5, corner radius 0.3, stroke 1.1 px ink |
| Margins | 1/4 in between binding and border on the left, 1/2 in top, right and bottom |
| Ruler | a true ruler: a tick at every inch measured from the paper edge, numbered by the inch (first mark past the binding reads 2). Every 6th tick long. Top and bottom ticks 0.12 / 0.24 in, left 0.07 / 0.13 in. Numbers in Tenor Sans, muted, 50% (78% on the long ticks). No ticks in the binding, on a rounded corner or in the corner cut |
| Drafting readout | ticks warm toward the cursor within 3.2 in, the nearest inch turns burnt orange, carets ride the top and left rules, the control pill reads `x · y` |
| Title block | the sidebar from the 32 1/2 line (TBX = 32.5) to the border at 35.5, 3 in wide, one vertical rule. Text margins TXL 32.8, TXR 35.28 |
| Lockup | the AM lockup fills the sidebar; MANDEL centered between the two rules; top at y 0.74 |
| Corner cut | the upper right corner follows the roof stroke of the logo, concave: x = 53.38 + 0.0741 y + 0.001358 y² (lockup px) offset 0.3 in out, eased into the border with fillets r 0.34 |
| Field | the drawing field: x 1.25 to 32.5, y 0.5 to 23.5 (31.25 x 23 in). Crew html and overlays draw in field inches: field x = sheet x − 1.25, field y = sheet y − 0.5 |
| Site header | upper left of the field at (0.6, 0.26) field in: project title in Tenor Sans caps, letterspaced .3em, then three lines of small caps |
| Site footer | along the bottom of the field: a grid of ticks (one per sheet, done / now in orange), the footer title, an italic caption, a data list on curved rules, and the buttons |

**Title block, top to bottom** (10/1/26): lockup · PROJECT (name in Garamond, address lines, APN, owner) · ISSUED (No, Date, For; newest on top with an orange tick, ruled blank rows to hold 15) · GENERAL CONTRACTOR (their logo box, a placeholder wordmark until they send a file) · AGENCIES (AOR only when there is one, each permit, the fire zone line) · AGENCY STAMP (a 4 in tall pocket for agency stamps) · the one QR and the live address · colophon (André Mandel, LEED AP, address, phone, email, copyright) · SHEET (title lettered like MANDEL, the scale in drafting form, Sheet n of N, the number painted in sumi, flipping like a split flap). No sheet index here: it lives on A0.1 and behind the Sheet index button.

## 4. The look: paper, ink, type, color

**Tokens** (`:root` in `living-set.css`)

| Token | Value | Use |
|---|---|---|
| `--paper` | #f6f3ec | the sheet |
| `--paper2` | #ebe9e3 | the desk behind the set, the torn corner on screen |
| `--ink` | #1b1a18 | all line and type |
| `--muted` | #6c6963 | labels, captions |
| `--faint` | #a19e97 | placeholders |
| `--rule` | rgba(27,26,24,.2) | thin rules |
| `--accent` | #c07a2c | burnt orange, the one accent: note dots, current sheet, confirm tags, the newest issuance |
| `--u` | px per inch, set by the engine; 1 in = 96 px in print | every size is `calc(var(--u) * inches)` |
| `--fl` | 1 on screen, 0 in print | px floors keep type legible on small screens |

Drawing pens add timber #c98a52 (decks, the orange grain), pine #2c5a37 (trees on site plans), roof #d6d5d1, glass fill #f6f5f1.

**Type: three fonts only** (Google Fonts)

* **Tenor Sans** for titles, labels, sheet numbers, uppercase with wide letterspacing (.14 to .32em)
* **EB Garamond** (italic for values, captions, data) the secondary voice
* **Nothing You Could Do** for handwritten notes on the drawings

**Curved footer lines.** Every horizontal rule swoops like the ribbon roof, level and sagging, then lifting at the right: the `--swoop` SVG background, used on footer data, issuance rows, title block sections, kit tables. No straight rules anywhere.

**Paper.** Baked once at startup into one 36 x 24 in bitmap at 60 ppi: fiber turbulence, mottling, mist, foxing, faint graphite smudges, long construction lines, yellowing deeper at the edges and the binding, handling wear on the right edge, an old crease low right. Then eight aging layers at 30 ppi (foxing clusters, smudges, wear at a different edge, a crease on some, a dried splash on a few) in four orientations: 32 looks, neighbors never share one, seeded by sheet index so every visit ages the same way. Some sheets (42%) carry a small deckle tear on the bottom or outer edge, and one to five ruler numbers wear off. The torn top right corner (seeded by `SET.seed`) frays with loose fibers and flutters in an irregular breeze. Screen only: print stays clean and lighter.

**Notes.** Handwritten design intent on a thin dotted leader (a quadratic curve) ending in a burnt orange dot. Never specification. The leader draws, the words write, the dot lands, in that order, staggered 520 ms per note.

**Drawings.** Pencil and straightedge, monochrome graphite, a little Zaha, Woods and Libeskind in the DNA without looking like their sets. Hairlines are non scaling, so they stay one pixel at any zoom.

## 5. Project data: `project.js` (the SET schema)

```js
window.SET = {
  firm:     { name, signer, line, addr: [l1, l2], phone, email },            // ANDRÉ MANDEL on every set
  project:  { name, site, street, city, address, apn, zoning, county, owner, ownerCo,
              tbLines: [..] },                     // optional: the title block address lines
  header:   { title, lines: [l1, l2, l3] },        // upper left of every sheet
  permits:  [ { k, abbr, agency, v } ],            // k long name (index), abbr title block label, v number or status
  fire:     'Very High FHSZ · Chapter 7A',         // '' to drop the line
  aor:      null | { k, abbr, v },                 // the AOR line only when there is one
  gc:       { name, role, logo },                  // logo: image path, else a placeholder wordmark
  issuances:[ { no, date, for } ],                 // oldest first; the title block shows newest first, room for 15
  date, drawnBy, status, copy,
  live:     { url, show: [host, path], label },    // the QR points at url
  model:    { src: 'model/?sheet', still, planSheets: { site, l1, l2, roof } },
  marks:    { lockup, mark },
  seed:     235,                                   // the frayed corner, so prints agree; use the lot number
  projectData: [[k, v], ..],                       // optional: override the A0.1 project data rows
  kit:      { docTitle, modelButtons: [[id, label]], conventions, gcPlaceholder, stampLabel },   // engine labels
  tune:     { flutter: { .. } },                   // optional fine tuning, section 15
  groups:   ['General', 'Feasibility', 'Architectural', 'Landscape'],
  sheets:   [ { id, group, title, short, foot, scale, kind, issued: [n], cap, data: [..], views, notes } ],
  qr:       /*QR*/{ size, d }/*/QR*/               // written by tools/make_qr.py
};
```

**A sheet entry**

| Field | Meaning |
|---|---|
| `id` | sheet number, e.g. A2.1. Prefix letters set the order inside a group |
| `group` | one of `groups`; sets the order of parts |
| `title` | full title. The title block letters the part before ` · ` (so 'Cover · the site' reads COVER) |
| `short`, `foot` | shorter titles for the phone strip and the footer |
| `scale` | '1/4 in = 1 ft' prints as 1/4" = 1'-0"; 'None' or 'Live model' prints NTS; anything else prints as written |
| `kind` | 'model', 'index', 'draw', 'html' (set by crew files), or none for a cartoon sheet |
| `issued` | the issuance numbers this sheet was in (dots on A0.1) |
| `cap`, `data` | the footer caption and up to four data lines |
| `views` | cartoon sheets: `{ t, s, x, y, w, h }` dashed view boxes in sheet inches, titled and numbered |
| `notes` | `{ text, t: [x, y], p: [x, y], a: 'l' or 'r', v }`. With `v`, t and p are fractions of view v; without, sheet inches. `a` sets which end of the words sits at t |

Write dates M/D/YY. Qualify numbers with "about". Anything unverified ends "confirm".

## 6. Sheet kinds

| Kind | What the engine draws | Data |
|---|---|---|
| `model` | the live model full field, seamless on the paper (multiply, masked under title and footer); the footer follows the model's reel; Enter the model hands the field to the model | `SET.model`, the model page (section 9) |
| `index` | sheet index by group with issuance dots, project data, issuances, a conventions legend | SET itself |
| `draw` | true scale views from `DRAWINGS.sheets[id]`: SVG or image art, labels, view titles with scale bars, key plans, tables on curved rules, north arrow, notes | section 8 |
| `html` | whatever the crew's `html(ctx)` returns, in field inches | section 7 |
| cartoon | dashed boxes waiting for drawings, titled and numbered, with hand notes | `views`, `notes` |

The cover borrows a plan sheet's number, title and scale while the model shows a plan (`model.planSheets`), and gives it back when the plan closes.

## 7. Crew sheets and overlays: the extension API

A crew owns one file in `sheets/`, never edits the engine or another crew's file.

```js
LIVING_SHEETS.push({ id: 'A1.4', group: 'Architectural', title: 'Building height', scale: 'As noted', issued: [2],
  cap: '..', data: ['..'], notes: [..],
  html: ctx => '<div>..</div>' });                         // drawn in field inches, origin top left of the field

LIVING_OVERLAYS.push({ id: 'A2.1', z: 4, html: ctx => '..' });   // a layer over any sheet, any kind
```

`ctx` gives: `U(inches)` to CSS length · `esc` · `viewTitle(n, title, scale)` · `noteHTML(note, w, h, delay)` · `FX`, `FY` sheet to field inches · `SET` · `DRW` (DRAWINGS, with `DRW.reg` view registration) · `SHARED` (overlays) · `BL` 1.25 · `TBX` 32.5 · `sheet` · `W` 31.25 · `H` 23.

Size type in inches with a screen floor, like the engine: `max(calc(10px * var(--fl)), calc(var(--u) * .21))`. Phones: give your layer a rule under the engine's phone query so it flows as one column (the kit components already do).

**The kit components** (`window.LIVING_KIT`, from the Walsh A0.2 and A7.0 crews). Wrap notes layouts in `<div class="lkx">`.

| Call | Draws |
|---|---|
| `col(ctx, x, y, w, inner)` | a positioned column, field inches |
| `sec(no, title, items or html, ref)` | a numbered section: heading on a swoop, numbered notes |
| `tab(rows, keyWidth)` | key value table on curved rules |
| `abbr(rows)` | the two column abbreviations grid |
| `legend(ctx, { datum, spot })` | the symbols legend: view title, section, elevation and detail marks, level datum, spot elevation, north, hand note, property line, setback, tree, hatches, confirm |
| `detail(ctx, o)` | a hairline detail with labels and leaders, titled; pens `P Ln Rc Pg dots hatch tick` with classes k k2 kf kh kd kt cl fi o od of ofs |
| `schedule(ctx, o)` | a schedule: ringed numbers, orange group rows, cells `{ t, c: 'mu' or 'ac' }`, placeholder rows, a foot and a view title |
| `list(ctx, o)` | a numbered or keyed list on curved rules |
| `north(l, t, s, deg)` | a north arrow |
| `rt(text)` | rich text: `{cf}` prints the orange CONFIRM tag, `[ref]` an italic code reference |

## 8. Real drawings: `drawings.src.json` to `drawings.js`

Geometry in **model feet**, x east, y down the sheet (south on a plan). `tools/build_drawings.py` sets it at true scale and drafts it in the Walsh pen table.

```json
{ "north": 0, "calcs": { },
  "sheets": { "A2.1": {
    "views": [ { "id": "l1", "x": 6.4, "y": 4.3, "scale": 0.25, "box": [-33, -7.5, 68, 40],
                 "layers": [ { "pen": "wall", "segs": [[[0,0],[64,0],0.5]] }, { "pen": "glass", "segs": [..] } ],
                 "dxf": "cad/L1.dxf", "units": "in", "layermap": { "A-WALL": "wall", "A-GLAZ": "glass" },
                 "svg": "cad/extra.svg",
                 "top": [ { "pen": "dot", "circles": [[24,52,1.1]] } ],
                 "labels": [ { "at": [50,13], "t": "Living", "s": "about 672 sf", "k": "room" } ] } ],
    "vt": [ { "n": 1, "t": "Level 1 plan", "s": "1/4 in = 1 ft", "x": 7.4, "y": 16.75, "bar": [0,4,8,16] } ],
    "north": { "x": 4.2, "y": 13.6, "s": 1.1 },
    "tables": [ { "x": 1.9, "y": 4.0, "w": 4.2, "title": "Level 1 areas", "rows": [["Main level","about 1,536 sf"]], "foot": ".." } ],
    "notes": [ { "text": "the living room opens to the terrace", "t": [20.6,17.55], "pf": [50,33], "a": "l" } ] } } }
```

* A view's sheet size is `(box width) x scale` by `(box height) x scale`; x, y is its top left in sheet inches. Keep plans of one project on one registration (same box and scale) so overlays and the cover's plan swap line up.
* Layer shapes: `poly` / `polys`, `rects` [x0,y0,x1,y1], `segs` [[a],[b],thickness] (walls and glass by centerline), `lines` (open polylines), `circles` [x,y,r], `texts` [x,y,text,size,rotate].
* Notes: `t` in sheet inches; the dot at `pf` in model feet (converted through the view) or `p` in sheet inches.
* Label kinds: room, tag (bold caps with an italic line), dim, spot, dat, lim (orange caps), road, bub.
* `DRAWINGS.reg[id][k]` = `{ x, y, box, scale }`: sheet x = x + (ft − box[0]) × scale. Overlays use this.
* Elevations and sections in Walsh were print resolution renders of the model (webp, 200 px per sheet inch) with `img`, `px`, `py`, `iw` instead of `svg`; the engine draws either.

**The pen table**

| Pen | Draws |
|---|---|
| outline 1.3 · cut 1.1 | building outline, cut lines |
| wall | poche, solid ink |
| slab · slab2 | floor tone at the cut level, at another level |
| glass | paper fill, 0.6 ink edge |
| line 0.6 · thin 0.45 at 70% · faint 0.45 at 30% | casework, mullions, ghosts |
| hidden (3 2) · overhead (9 3 2 3) | below and above the cut |
| roof · roof2 · ridge | roof planes (gray, paper), ridges 1.1 |
| deck (timber grain) · flag (flagstone) · concrete (dots) · earth (45° hatch) | surfaces |
| drive · property (18 4 3 4, 1.5) · setback (6 4) · contour · contour5 | site |
| tree · tree2 (pine green) · timber (orange) · accent · dot (the one orange mark) | |

## 9. The cover's live model

`model/pocket.js` draws the cover in the pocket model's drafting style: pale gray paper massing, black hairline edges, warm orange timber as the one accent, clear glass panelized at 4 ft, a 54° wide angle lens, gentle eased camera moves (2.6 s), drag sideways to turn, **drag up looks up**, wheel to come closer, damped.

`massing.json`: `volumes` (poly, base, eave, roof gable / shed / flat with overhang, glass runs with sill and head) · `chimneys` · `decks` (timber or stone) · `site` (lot, grade, contours, trees with an optional signature mark) · `shots` (title, line, data, dur, cam { th, ph in degrees, r in radii, look [x, y, el], fov }). Or `glb` for a model exported from Vectorworks, Rhino or SketchUp (load three's GLTFLoader too).

**The contract the cover reads** (keep these ids if you bring your own model page, like Walsh's): `#app[data-mode]` reel or model · `#shotTitle` · `#shotLine` · `#shotData li` · `#shotNo` · `#ticks i` (done, now run, `--dur`) · `#toModel` · `#toReel` · optional `#toInfo` and a plans panel `.plansheet` with `#plSheets button[aria-pressed][data-sh]` (site, l1, l2, roof). `?sheet` hides the model's own chrome; `?still` renders the first shot once for `make_still.py`.

The Walsh pocket model (`walsh/mobile/`) is the full version: schemes, layers, plans, the loader, the FA package. It is project specific; copy it as a starting point only for a project that needs that depth.

## 10. Motion, phone, print

* **Page turns.** A corner lifts and the leaf folds back over itself toward the binding, clipped along the fold, its underside drawn as a foreshortened flap, shadows on the sheet beneath. One of three moves at random: bottom curl (960 ms), top curl (900 ms), full flip (1080 ms). Arrows, swipes (touch and two finger trackpad, one sheet per gesture), keys (← → PageUp PageDown Home End), the index, and faint sumi brush arrows in the desk beside the set.
* **Arrival.** Leaders draw, words write, dots land, issuance rows rise, the newest gets an orange tick, the sheet number flips like a split flap.
* **The corner in the breeze.** Layered sines at unrelated periods, quick lift and slow settle, still spells. Constants in `FLUTTER`, overridable in `SET.tune.flutter`.
* **Reduced motion.** A quick crossfade, no curl, no flutter, the torn fibers static.
* **Phone** (≤ 760 px, or portrait ≤ 1100 px): the drawing fills the screen and scrolls as one column, views keep their aspect, the title block becomes a bottom strip with the mark, number, title and an Index button; the index is a drawer.
* **Print.** Every sheet at true size, one 36 x 24 page each, final still state, the corner flat with bare stock where the paper is gone, the aging lighter, the model's still in place of the live model. The printed set is built from what is on screen.

## 11. Migrating a project, step by step

1. **Scaffold.** `python3 tools/new_project.py ../<project>/set --name "<Name> Residence" --street .. --city .. --site .. --apn .. --zoning .. --county .. --owner .. --url https://a-mandel.github.io/<project>/set/ --seed <lot no>`. A frozen copy of the engine lands in `_kit/` so later kit changes never move an issued set (`--link` to follow the kit instead).
2. **project.js.** Permits and agencies, the fire line, AOR (or null), the GC and its logo, issuances, status, the sheet list with captions and data. Delete the REPLACE markers as you go.
3. **Drawings.** Replace `draw/drawings.src.json`: point views at DXF exports with a layer map, or script the layers from the model. Pick one registration for all plans. `python3 tools/build_drawings.py <project>/draw/drawings.src.json`.
4. **Shared record.** Fill `draw/shared.js` with grids, levels, rooms and dims, so plans, sections and overlays never disagree.
5. **Crew sheets.** Rewrite `sheets/notes.js` and `sheets/schedules.js` for the project; add crews for anything new (copy a Walsh crew from section 14 as a start). Add each file to the shell.
6. **Model.** Replace `model/massing.json` (or point `glb` at an export, or drop in a full pocket model page), set the shots, then `python3 tools/make_still.py <project>`.
7. **Check.** `python3 tools/check.py <project>`: every sheet, the phone, the PDF page count, script errors, videos. Look at `check/contact.png`.
8. **Publish** on the personal GitHub (a-mandel.github.io), never a CHxTLD account. Then `make_qr.py` if the address changed.

Keep the business straight before step 1: an ANDRÉ MANDEL set lives on andre.mandel@gmail.com tools and the personal GitHub only. A CHxTLD project needs its own firm block, letterhead decision and hosting, asked first.

## 12. Verification

* **Fidelity.** A harness loaded the Walsh SET (with its words moved into `projectData`, `kit` and `abbr` hooks) into this engine. All 34 Walsh sheets match v2.html pixel for pixel at 1680 x 1180, reduced motion, model still.
* **Template.** 15 sheets, no script errors, 15 page PDF at 36 x 24, phone layout, live model reel feeding the cover footer.
* **Scaffold.** `new_project.py` into an empty folder, then `check.py`: clean.

## 13. House rules

* No dashes of any kind in anything written for a set. Commas, periods, restructure.
* Dates M/D/YY. Numbers qualified "about". Unverified items carry CONFIRM in orange.
* One accent, burnt orange. No dark styling. Clear glass only, square panes, 4 by 8 ft max unless the project says otherwise.
* One QR per sheet, in the title block. No sheet index in the title block.
* The logo shape never changes; it may animate.
* Video in any page: progressive MP4 only (no moof or mvex, moov before mdat). `check.py` tests every MP4.
* CAD and DWG files issue in a single ZIP with the disclosure statement that we are not responsible for use of the file.
* Code cited is the 2025 California Building Standards Code, effective 1/1/26. Never 2022 or older.

## 14. The Walsh reference crews

Richer sheets already exist in Walsh. Copy the file, swap its data block, keep the drawing code. Their data blocks were written by Python builders run in the Walsh sessions; the templates and source data that are in the repo sit in `walsh/set/sheets/tools/`.

| Walsh file | Sheets | What to reuse |
|---|---|---|
| `cover-a.js` | A0.9 Renderings | stills laid into hairline drafting, datum runs and eye level lines by camera projection |
| `cover-b.js` | A0.5 Axonometrics, A9.1 Perspectives | model stills with notes projected through the camera |
| `reg-a.js` | F1.0 Regulatory, A1.3 Design review compliance | zoning diagram, approvals path, compliance matrix |
| `reg-b.js` | A0.2, A0.3 Code and energy, A6.1 Wildfire | the source of the kit's notes components; hardening details |
| `height.js` | A1.4 Building height | height points over natural grade, the 30 ft envelope |
| `plans-a.js` | A0.6 Area diagrams, A2.0 Lower level and foundation | area hatches read live from DRAWINGS.calcs |
| `plans-b.js` | A2.4, A2.5 Reflected ceiling plans | RCP on the plan registration |
| `sectelev-a.js` | A3.1 Building sections | cut renders with a wall section strip, key plan, levels table |
| `sectelev-b.js` | A5.0 Interior elevations, A5.1 Materials | interior elevations off a plan extract |
| `land-a.js`, `land-b.js` | L1.0 Landscape concept, L1.1 Defensible space | planting and fire zones on the site registration |
| `sched-a.js`, `sched-b.js` | A7.0 Doors, A7.1 Windows | the source of the kit's schedule; door types drawn at 3/8 in |
| `overlays-*.js` | plans, sections and elevations, site, styled stills | grids, dims, room names, compliance tags, the drafting layer over renders |

## 15. Tuning knobs

| Constant | File | Default | Controls |
|---|---|---|---|
| `FLUTTER` | living-set.js | period 5.2 s, lift 0.95 in, rest 0.12 in, gust 0.38, calm 0.44, rise 0.26 s, settle 1.35 s | the corner in the breeze (`SET.tune.flutter`) |
| `FRAY` | living-set.js | reach 2.8 in, depth 0.105 in, 22 fibers, seed `SET.seed` | the torn corner |
| `WEAR` | living-set.js | 8 variants, tear 42%, 1 to 5 worn numbers | per sheet aging |
| `TURN` | living-set.js | three moves, shadow 0.3 | page turns |
| `SWIPE` | living-set.js | wheel 70, quiet 420 ms, cooldown 1000 ms, touch 50 px | gestures |
| `PAPER`, `AGE`, `FOX`, `GRAPHITE` | living-set.js | 60 ppi bake | the paper |
| `RULER` | living-set.js | marks every inch, long every 6 | the ruler |
| `TBX`, `LOCK`, `ENV`, `GAP` | living-set.js | 32.5 in, lockup, corner curve, 0.3 in | sidebar and corner |
| `--t-*`, `--s-*` | living-set.css | inches with px floors | type sizes |

Change a knob in the kit and every linked set follows; frozen sets keep theirs until you copy the new engine into `_kit/`.
