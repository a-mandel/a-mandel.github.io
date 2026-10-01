/* SHARED: one record every crew reads, so sheets never disagree (Walsh built it with draw/build_shared.py from the
   model). Model feet, x east, y down the sheet. Grow it as the project grows: rooms, dims, levels, heights, tags,
   openings. The template overlay (sheets/overlays.js) reads grids from here. */
window.SHARED = {
  meta: { built: '10/1/26', units: 'model feet: x east, y down the sheet (south on a plan)', datum: 100.0, note: 'Placeholder. About, confirm on survey.' },
  grids: { x: [ { id: '1', at: 0 }, { id: '2', at: 18 }, { id: '3', at: 36 }, { id: '4', at: 64 } ], y: [ { id: 'A', at: 0 }, { id: 'B', at: 24 } ] },
  levels: [ { name: 'Main level', el: 100.0 }, { name: 'Garage', el: 99.5 }, { name: 'Ridge', el: 124.0 } ]
};
