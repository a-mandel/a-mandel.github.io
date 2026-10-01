/* ================================================================
   PROJECT DATA · the only file most projects need to rewrite.
   Everything the set says about the project lives here. The engine (../engine/living-set.js) draws the paper,
   binding, ruler, title block, notes and motion; this file feeds it words and numbers.
   Positions are sheet inches: origin at the top left of the 36 x 24 sheet. View notes are fractions of their view.
   Every line marked REPLACE is placeholder. See ../FRAMEWORK.md, section 5, for the full schema.
   ================================================================ */
window.SET = {
  /* the firm: ANDRÉ MANDEL on every set */
  firm: { name: 'ANDRÉ MANDEL', signer: 'André Mandel, LEED AP', line: 'Residential design', addr: ['40 Edith St #4', 'San Francisco CA 94133'], phone: '510.459.7686', email: 'andre.mandel@gmail.com' },

  /* REPLACE: the project */
  project: {
    name: 'Sample Residence', site: 'Lot 00', street: '000 Project Road', city: 'Truckee CA', address: '000 Project Road, Truckee CA',
    apn: '000 000 000 000', zoning: 'Zoning district', county: 'County', owner: 'Owner Name', ownerCo: 'Owner Company',
    // the title block's address lines, top to bottom (optional; default is street, site · city, county)
    tbLines: ['000 Project Road', 'Lot 00 · Truckee CA', 'County']
  },

  /* REPLACE: the site's own title lines, upper left of every sheet */
  header: { title: 'Sample Residence', lines: ['000 Project Road · Lot 00 · Truckee', 'APN 000 000 000 000 · Zoning district', 'Living set · 10/1/26'] },

  /* REPLACE: agencies. k is the long name (index sheet), abbr the title block label, agency and v the number or status */
  permits: [
    { k: 'Design review', abbr: 'DR', agency: 'HOA or design review board', v: 'no. pending' },
    { k: 'Building permit', abbr: 'Permit', agency: 'County building', v: 'no. pending' }
  ],
  fire: 'Fire hazard zone · confirm',        // a line in the title block's agencies; '' to drop it
  aor: null,                                 // or { k: 'Architect of record', abbr: 'AOR', v: 'Name, AIA' }

  /* REPLACE: the contractor box. Set logo to an image path to replace the placeholder wordmark */
  gc: { name: 'General Contractor Inc.', role: 'General contractor', logo: '' },

  /* issuances, oldest first; the title block shows newest first with room for 15. Each sheet lists the issuances it was in */
  issuances: [ { no: 1, date: '10/1/26', for: 'Living set framework' } ],
  date: '10/1/26', drawnBy: 'AM', status: 'Feasibility · not for construction',
  copy: '© 2026 André Mandel. Drawings are instruments of service.',

  /* REPLACE: where the set lives. The QR in the title block points here (tools/new_project.py rebuilds it) */
  live: { url: 'https://a-mandel.github.io/living-set/template/', show: ['a-mandel.github.io', '/living-set'], label: 'The living set' },

  /* the cover's live model and its still (print, phones and while it loads). planSheets: which sheet the cover
     borrows while the model's plan view shows a level (keys are the model's level buttons) */
  model: { src: 'model/?sheet', still: 'assets/cover-still.webp', planSheets: { site: 'A1.2', l1: 'A2.1', roof: 'A2.3' } },
  marks: { lockup: '../brand/am10_lockup.webp', mark: '../brand/am10_mark.webp' },

  /* seeds the frayed corner, so every sheet and every print of this set tear the same way. Use the lot number */
  seed: 1,

  /* engine labels (all optional): browser tab, cover buttons, conventions note on the index, contractor placeholder */
  kit: { docTitle: 'Sample Living Set', modelButtons: [['toModel', 'Enter the model']] },

  /* optional fine tuning of the corner in the breeze, e.g. { flutter: { period: 6 } } */
  tune: {},

  groups: ['General', 'Feasibility', 'Architectural', 'Landscape'],

  /* the sheets. kind: 'model' (live cover), 'index' (sheet index and project data), 'draw' (real drawings from
     draw/drawings.js), none (cartoon: dashed view boxes waiting for drawings). Crew files in sheets/ can add or replace
     sheets with html(ctx). cap and data feed the footer; foot is the footer title when it differs from title */
  sheets: [
    { id: 'A0.0', group: 'General', title: 'Cover · the site', short: 'Cover · the site', foot: 'The site', scale: 'Live model', kind: 'model', issued: [1],
      cap: 'REPLACE: one sentence on the site and the big idea.',
      data: ['REPLACE: four short facts', 'Fire zone · confirm', 'Approach · confirm', 'Live model · drag to orbit'] },
    { id: 'A0.1', group: 'General', title: 'Sheet index and project data', short: 'Index and project data', foot: 'Sheet index', scale: 'None', kind: 'index', issued: [1],
      cap: 'The sheets in four parts, with the issuances and the project data kept current as the set grows.',
      data: ['Sheets and issuances', 'APN 000 000 000 000', 'Zoning · County', 'Owner · Owner Name'],
      notes: [ { text: 'review board meets monthly', t: [26.3, 10.9], p: [25.6, 8.3], a: 'l' } ] },
    { id: 'A0.2', group: 'General', title: 'General notes', scale: 'None', issued: [1],
      cap: 'How to read the set, the codes it answers to and what is still to confirm.',
      data: ['2025 California codes', 'Effective 1/1/26', 'Confirm items flagged in orange', 'About, not for construction'] },
    { id: 'F1.0', group: 'Feasibility', title: 'Regulatory report', scale: 'As noted', issued: [1],
      cap: 'What the jurisdiction and the design review board ask of the lot, and the path to a permit.',
      data: ['Zoning and setbacks', 'Height limit · confirm', 'Roof forms · confirm', 'Review calendar'],
      views: [ { t: 'Zoning and setbacks', s: 'Diagram', x: 1.9, y: 3.8, w: 14.2, h: 7.06 }, { t: 'Height envelope', s: 'Diagram', x: 17.2, y: 3.8, w: 14.2, h: 7.06 }, { t: 'Approvals path', s: 'Not to scale', x: 1.9, y: 12.18, w: 29.5, h: 6.82 } ],
      notes: [ { v: 1, text: 'every roof under the line', t: [.52, .3], p: [.36, .56], a: 'l' }, { v: 2, text: 'the board meets monthly', t: [.62, .32], p: [.5, .6], a: 'l' } ] },
    { id: 'F2.0', group: 'Feasibility', title: 'Budget framework', scale: 'As noted', issued: [1],
      cap: 'Cost by assembly, allowances and soft costs, framed early so every design move carries a number.',
      data: ['Unit rates by assembly', 'Allowances carried separately', 'Soft costs, fees and permits', 'Feasibility grade, not a bid'] },
    { id: 'F3.0', group: 'Feasibility', title: 'Preliminary timeline', scale: 'As noted', issued: [1],
      cap: 'From design review through permit to groundbreaking, set against the review calendar and the build season.',
      data: ['Survey first', 'Review calendar', 'Earthwork window · confirm', 'Groundbreaking'],
      views: [ { t: 'Review and permit path', s: 'Not to scale', x: 1.9, y: 3.8, w: 29.5, h: 7.4 }, { t: 'Milestones', s: 'Schedule', x: 1.9, y: 12.4, w: 14.2, h: 6.6 }, { t: 'Review calendar', s: 'Schedule', x: 17.2, y: 12.4, w: 14.2, h: 6.6 } ],
      notes: [ { v: 0, text: 'groundbreaking', t: [.74, .3], p: [.88, .56], a: 'r' } ] },
    { id: 'A1.2', group: 'Architectural', title: 'Site plan', scale: '1 in = 10 ft', kind: 'draw', issued: [1],
      cap: 'The house on the lot, inside the setbacks, the drive coming in from the street.',
      data: ['Footprint about, from the model', 'Coverage about', 'Lot area · confirm on survey'] },
    { id: 'A2.1', group: 'Architectural', title: 'Level 1 plan', short: 'Level 1 plan', foot: 'Level 1 plan', scale: '1/4 in = 1 ft', kind: 'draw', issued: [1],
      cap: 'REPLACE: the main level in one sentence.',
      data: ['Conditioned about, from the model', 'Garage about', 'Rooms named as placeholders'] },
    { id: 'A2.3', group: 'Architectural', title: 'Roof plan', scale: '1/4 in = 1 ft', kind: 'draw', issued: [1],
      cap: 'REPLACE: the roof idea in one sentence.',
      data: ['Ridge and eave heights', 'Every roof under the height limit'] },
    { id: 'A3.0', group: 'Architectural', title: 'Sections', scale: '1/4 in = 1 ft', issued: [1],
      cap: 'Cut through the house where the levels and the roof tell the story.',
      data: ['Levels from the model', 'Height limit line'],
      views: [ { t: 'Section 1', s: '1/4 in = 1 ft', x: 1.9, y: 3.8, w: 29.5, h: 7.2 }, { t: 'Section 2', s: '1/4 in = 1 ft', x: 1.9, y: 12.4, w: 29.5, h: 6.6 } ] },
    { id: 'A4.0', group: 'Architectural', title: 'Exterior elevations', short: 'Elevations', foot: 'Elevations', scale: '1/4 in = 1 ft', issued: [1],
      cap: 'The four faces of the house, the arrival face first.',
      data: ['Every roof under the height limit', 'Materials keyed to A5.1'],
      views: [ { t: 'North', s: '1/4 in = 1 ft', x: 1.9, y: 3.8, w: 14.2, h: 6.9 }, { t: 'East', s: '1/4 in = 1 ft', x: 17.2, y: 3.8, w: 14.2, h: 6.9 }, { t: 'South', s: '1/4 in = 1 ft', x: 1.9, y: 12.1, w: 14.2, h: 6.9 }, { t: 'West', s: '1/4 in = 1 ft', x: 17.2, y: 12.1, w: 14.2, h: 6.9 } ] },
    { id: 'A5.1', group: 'Architectural', title: 'Exterior materials and colors', short: 'Materials and colors', foot: 'Materials and colors', scale: 'None', issued: [1],
      cap: 'A quiet, durable palette, hardened for fire. The glass kept clear.',
      data: ['Cladding', 'Roofing', 'Glazing and metals', 'Stone and concrete'],
      views: [ { t: 'Materials board', s: 'Samples', x: 1.9, y: 3.8, w: 18.15, h: 15.2 }, { t: 'Colors', s: 'Samples', x: 21.44, y: 3.8, w: 9.96, h: 6.9 }, { t: 'Glazing and metals', s: 'Samples', x: 21.44, y: 12.1, w: 9.96, h: 6.9 } ],
      notes: [ { v: 0, text: 'warm wood, dark metal, stone', t: [.3, .5], p: [.18, .3], a: 'l' } ] },
    { id: 'A6.1', group: 'Architectural', title: 'Wildfire hardening · Chapter 7A', short: 'Wildfire hardening', foot: 'Wildfire hardening', scale: 'As noted', issued: [1],
      cap: 'Every assembly hardened to Chapter 7A where the lot sits in a fire hazard zone.',
      data: ['Fire zone · confirm', 'Ember resistant vents', 'Ignition resistant decks', 'Defensible space'],
      views: [ { t: 'Vents and eaves', s: 'Details', x: 1.9, y: 3.8, w: 14.2, h: 6.9 }, { t: 'Glazing and doors', s: 'Details', x: 17.2, y: 3.8, w: 14.2, h: 6.9 }, { t: 'Decks and terraces', s: 'Details', x: 1.9, y: 12.1, w: 14.2, h: 6.9 }, { t: 'Defensible space', s: 'Diagram', x: 17.2, y: 12.1, w: 14.2, h: 6.9 } ] },
    { id: 'A7.0', group: 'Architectural', title: 'Door and window schedule', short: 'Openings schedule', foot: 'Openings schedule', scale: 'None', issued: [1],
      cap: 'Every opening by type. Square panes, clear glass, sizes about until the window maker confirms.',
      data: ['Types and counts from the model', 'Sizes about', 'Tempered where code asks'] },
    { id: 'L1.0', group: 'Landscape', title: 'Landscape concept', scale: '1/8 in = 1 ft', issued: [1],
      cap: 'Native planting kept close, terraces stepping with the land.',
      data: ['Keep the existing trees', 'Terraces', 'Fire wise planting'],
      views: [ { t: 'Landscape concept', s: '1/8 in = 1 ft', x: 1.9, y: 3.8, w: 21.3, h: 15.2 }, { t: 'Plant palette', s: 'Schedule', x: 24.4, y: 3.8, w: 7.0, h: 15.2 } ],
      notes: [ { v: 0, text: 'keep the existing trees', t: [.6, .26], p: [.47, .46], a: 'l' } ] }
  ],

  /* the QR (segno, written by tools/new_project.py or tools/make_qr.py from live.url); leave this marker in place */
  qr: /*QR*/{size: 37, d: "M2 2h7v1h-7zM15 2h2v1h-2zM18 2h2v1h-2zM21 2h3v1h-3zM25 2h1v1h-1zM28 2h7v1h-7zM2 3h1v1h-1zM8 3h1v1h-1zM11 3h2v1h-2zM14 3h6v1h-6zM23 3h2v1h-2zM26 3h1v1h-1zM28 3h1v1h-1zM34 3h1v1h-1zM2 4h1v1h-1zM4 4h3v1h-3zM8 4h1v1h-1zM10 4h1v1h-1zM12 4h4v1h-4zM17 4h1v1h-1zM19 4h2v1h-2zM23 4h1v1h-1zM25 4h1v1h-1zM28 4h1v1h-1zM30 4h3v1h-3zM34 4h1v1h-1zM2 5h1v1h-1zM4 5h3v1h-3zM8 5h1v1h-1zM10 5h3v1h-3zM16 5h1v1h-1zM18 5h1v1h-1zM21 5h2v1h-2zM24 5h2v1h-2zM28 5h1v1h-1zM30 5h3v1h-3zM34 5h1v1h-1zM2 6h1v1h-1zM4 6h3v1h-3zM8 6h1v1h-1zM10 6h2v1h-2zM13 6h1v1h-1zM17 6h1v1h-1zM20 6h1v1h-1zM23 6h1v1h-1zM25 6h1v1h-1zM28 6h1v1h-1zM30 6h3v1h-3zM34 6h1v1h-1zM2 7h1v1h-1zM8 7h1v1h-1zM10 7h2v1h-2zM14 7h5v1h-5zM22 7h3v1h-3zM28 7h1v1h-1zM34 7h1v1h-1zM2 8h7v1h-7zM10 8h1v1h-1zM12 8h1v1h-1zM14 8h1v1h-1zM16 8h1v1h-1zM18 8h1v1h-1zM20 8h1v1h-1zM22 8h1v1h-1zM24 8h1v1h-1zM26 8h1v1h-1zM28 8h7v1h-7zM10 9h1v1h-1zM12 9h3v1h-3zM17 9h1v1h-1zM23 9h1v1h-1zM26 9h1v1h-1zM2 10h1v1h-1zM4 10h5v1h-5zM11 10h2v1h-2zM14 10h4v1h-4zM19 10h1v1h-1zM24 10h1v1h-1zM26 10h1v1h-1zM28 10h5v1h-5zM4 11h3v1h-3zM9 11h1v1h-1zM12 11h1v1h-1zM14 11h1v1h-1zM18 11h1v1h-1zM20 11h4v1h-4zM25 11h1v1h-1zM28 11h2v1h-2zM31 11h2v1h-2zM34 11h1v1h-1zM2 12h3v1h-3zM6 12h1v1h-1zM8 12h1v1h-1zM10 12h1v1h-1zM12 12h2v1h-2zM17 12h1v1h-1zM20 12h1v1h-1zM23 12h2v1h-2zM27 12h1v1h-1zM30 12h1v1h-1zM32 12h1v1h-1zM3 13h2v1h-2zM10 13h5v1h-5zM16 13h3v1h-3zM22 13h3v1h-3zM26 13h1v1h-1zM30 13h5v1h-5zM4 14h1v1h-1zM6 14h3v1h-3zM10 14h1v1h-1zM20 14h1v1h-1zM26 14h2v1h-2zM30 14h2v1h-2zM33 14h1v1h-1zM2 15h3v1h-3zM7 15h1v1h-1zM9 15h1v1h-1zM11 15h1v1h-1zM14 15h1v1h-1zM16 15h3v1h-3zM22 15h2v1h-2zM25 15h1v1h-1zM28 15h1v1h-1zM31 15h1v1h-1zM33 15h2v1h-2zM4 16h6v1h-6zM13 16h4v1h-4zM19 16h3v1h-3zM23 16h2v1h-2zM26 16h3v1h-3zM30 16h4v1h-4zM5 17h3v1h-3zM9 17h1v1h-1zM12 17h5v1h-5zM18 17h1v1h-1zM20 17h5v1h-5zM27 17h2v1h-2zM30 17h3v1h-3zM3 18h1v1h-1zM6 18h4v1h-4zM12 18h2v1h-2zM15 18h2v1h-2zM19 18h4v1h-4zM24 18h4v1h-4zM29 18h3v1h-3zM34 18h1v1h-1zM2 19h2v1h-2zM5 19h3v1h-3zM9 19h2v1h-2zM12 19h4v1h-4zM18 19h5v1h-5zM25 19h1v1h-1zM28 19h2v1h-2zM31 19h2v1h-2zM34 19h1v1h-1zM2 20h2v1h-2zM8 20h3v1h-3zM15 20h5v1h-5zM22 20h1v1h-1zM24 20h1v1h-1zM27 20h1v1h-1zM29 20h2v1h-2zM32 20h2v1h-2zM2 21h2v1h-2zM6 21h1v1h-1zM11 21h4v1h-4zM16 21h1v1h-1zM18 21h3v1h-3zM23 21h2v1h-2zM27 21h1v1h-1zM29 21h4v1h-4zM34 21h1v1h-1zM2 22h4v1h-4zM8 22h2v1h-2zM11 22h6v1h-6zM18 22h1v1h-1zM21 22h3v1h-3zM25 22h3v1h-3zM29 22h3v1h-3zM33 22h2v1h-2zM2 23h1v1h-1zM4 23h1v1h-1zM7 23h1v1h-1zM9 23h1v1h-1zM11 23h3v1h-3zM15 23h1v1h-1zM17 23h1v1h-1zM19 23h2v1h-2zM25 23h1v1h-1zM28 23h2v1h-2zM32 23h1v1h-1zM34 23h1v1h-1zM2 24h1v1h-1zM8 24h4v1h-4zM13 24h7v1h-7zM22 24h3v1h-3zM26 24h1v1h-1zM29 24h1v1h-1zM31 24h1v1h-1zM33 24h1v1h-1zM2 25h1v1h-1zM9 25h1v1h-1zM17 25h1v1h-1zM20 25h1v1h-1zM23 25h1v1h-1zM26 25h2v1h-2zM31 25h4v1h-4zM2 26h1v1h-1zM4 26h1v1h-1zM6 26h1v1h-1zM8 26h2v1h-2zM11 26h1v1h-1zM13 26h1v1h-1zM16 26h2v1h-2zM19 26h1v1h-1zM26 26h5v1h-5zM33 26h2v1h-2zM10 27h4v1h-4zM15 27h2v1h-2zM20 27h4v1h-4zM26 27h1v1h-1zM30 27h1v1h-1zM32 27h1v1h-1zM34 27h1v1h-1zM2 28h7v1h-7zM11 28h3v1h-3zM17 28h2v1h-2zM20 28h1v1h-1zM22 28h2v1h-2zM25 28h2v1h-2zM28 28h1v1h-1zM30 28h1v1h-1zM32 28h2v1h-2zM2 29h1v1h-1zM8 29h1v1h-1zM10 29h2v1h-2zM13 29h1v1h-1zM16 29h1v1h-1zM18 29h1v1h-1zM21 29h3v1h-3zM25 29h2v1h-2zM30 29h4v1h-4zM2 30h1v1h-1zM4 30h3v1h-3zM8 30h1v1h-1zM10 30h2v1h-2zM13 30h1v1h-1zM16 30h1v1h-1zM20 30h1v1h-1zM23 30h1v1h-1zM26 30h6v1h-6zM34 30h1v1h-1zM2 31h1v1h-1zM4 31h3v1h-3zM8 31h1v1h-1zM10 31h2v1h-2zM14 31h1v1h-1zM16 31h4v1h-4zM22 31h1v1h-1zM25 31h2v1h-2zM30 31h3v1h-3zM34 31h1v1h-1zM2 32h1v1h-1zM4 32h3v1h-3zM8 32h1v1h-1zM10 32h4v1h-4zM15 32h2v1h-2zM20 32h2v1h-2zM24 32h2v1h-2zM28 32h2v1h-2zM31 32h2v1h-2zM2 33h1v1h-1zM8 33h1v1h-1zM11 33h1v1h-1zM14 33h1v1h-1zM16 33h1v1h-1zM18 33h1v1h-1zM21 33h3v1h-3zM25 33h1v1h-1zM27 33h2v1h-2zM30 33h3v1h-3zM2 34h7v1h-7zM10 34h1v1h-1zM13 34h4v1h-4zM19 34h1v1h-1zM21 34h1v1h-1zM24 34h4v1h-4zM29 34h1v1h-1zM31 34h1v1h-1zM33 34h1v1h-1z"}/*/QR*/
};
