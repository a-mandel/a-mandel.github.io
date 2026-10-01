/* schedules crew (template): F2.0 Budget framework and A7.0 Door and window schedule.
   Built with the kit's schedule() and list(): ringed tags, group rows in burnt orange, curved rules, a view title
   under each table. Cells may be { t, c: 'mu' | 'ac' } for muted or accent text. Replace the rows with the project's. */
(function () {
  const K = window.LIVING_KIT;

  /* ------------------------------------------------------------ F2.0 Budget framework. Rates are placeholders until the owner
     supplies or confirms them; quantities come from the model */
  const ASSEMBLIES = [
    { g: 'Site and foundations', rows: [
      ['01', 'Site work and grading', 'ls', '1', { t: 'rate · owner', c: 'mu' }, 'Earthwork window · confirm'],
      ['02', 'Foundations and slab', 'sf', 'about 2,116', { t: 'rate · owner', c: 'mu' }, 'Per the geotechnical report'] ] },
    { g: 'Shell', rows: [
      ['03', 'Framing and sheathing', 'sf', 'about 2,116', { t: 'rate · owner', c: 'mu' }, ''],
      ['04', 'Roofing', 'sf', 'about 2,708', { t: 'rate · owner', c: 'mu' }, 'Class A, ember resistant vents'],
      ['05', 'Cladding', 'sf', 'about, from the model', { t: 'rate · owner', c: 'mu' }, 'Ignition resistant'],
      ['06', 'Windows and doors', 'ea', 'from A7.0', { t: 'rate · owner', c: 'mu' }, 'Dual tempered, square panes'] ] },
    { g: 'Interiors and systems', rows: [
      ['07', 'Interiors', 'sf', 'about 1,632', { t: 'allowance', c: 'ac' }, 'Allowance until selections'],
      ['08', 'Mechanical, electrical, plumbing', 'sf', 'about 1,632', { t: 'rate · owner', c: 'mu' }, 'Title 24 model to follow'] ] },
    { g: 'Allowances and soft costs', rows: [
      { ph: 'Allowances carried separately: appliances, fixtures, lighting, landscape. Soft costs: design, engineering, survey, permits and fees.', n: '··' } ] }
  ];

  LIVING_SHEETS.push({
    id: 'F2.0', group: 'Feasibility', title: 'Budget framework', scale: 'As noted', issued: [1],
    cap: 'Cost by assembly, allowances and soft costs, framed early so every design move carries a number.',
    data: ['Unit rates by assembly', 'Allowances carried separately', 'Soft costs, fees and permits', 'Feasibility grade, not a bid'],
    notes: [ { text: 'the owner prices hard costs', t: [14.0, 12.4], p: [11.9, 9.55], a: 'l' } ],
    html: ctx => K.schedule(ctx, {
        x: .65, y: 3.75, w: 21.6, title: 'Cost by assembly',
        cols: [['No.', .72], ['Assembly', 4.6], ['Unit', .9], ['Quantity', 2.6], ['Rate', 2.4], ['Notes', 9.6]],
        groups: ASSEMBLIES, foot: 'Quantities about, from the model. Rates by the owner or the builder. Feasibility grade, not a bid.',
        view: [1, 'Cost by assembly', 'Schedule']
      }) +
      K.list(ctx, { x: 23.2, y: 3.75, w: 7.6, title: 'How the numbers work', items: [
        'Quantities come from the model and change with the design.',
        'Unit rates by assembly, supplied or confirmed by the owner.',
        'Allowances carried separately until selections are made.',
        'Soft costs listed, priced by the owner.',
        'About, not a bid. {cf}'
      ] })
  });

  /* ------------------------------------------------------------ A7.0 Door and window schedule */
  const OPENINGS = [
    { g: 'Doors · main level', rows: [
      ['101', 'Entry, vestibule', 'Pivot', '4′ 0″', '9′ 0″', 'Dark steel', 'None, solid core', { t: 'none', c: 'mu' }],
      ['102', 'Garage to house', 'Solid swing', '3′ 0″', '8′ 0″', 'Dark steel', 'None', { t: '20 min', c: 'ac' }],
      ['103', 'Living to terrace', 'Lift and slide', '16′ 0″', '8′ 0″', 'Aluminum clad', 'Dual, tempered', { t: 'none', c: 'mu' }],
      ['104', 'Garage, two doors', 'Overhead', '9′ 0″', '8′ 0″', 'Dark steel jamb', 'None', { t: 'none', c: 'mu' }] ] },
    { g: 'Windows · main level', rows: [
      ['W1', 'South wall, living and dining', 'Fixed', '4′ 0″', '8′ 0″', 'Dark steel', 'Dual, tempered', { t: 'none', c: 'mu' }],
      ['W2', 'East wall, living', 'Fixed', '4′ 0″', '8′ 0″', 'Dark steel', 'Dual, tempered', { t: 'none', c: 'mu' }] ] },
    { g: 'Interior doors', rows: [ { ph: 'Interior doors follow room planning.', n: '1xx' } ] }
  ];

  LIVING_SHEETS.push({
    id: 'A7.0', group: 'Architectural', title: 'Door and window schedule', short: 'Openings schedule', foot: 'Openings schedule', scale: 'None', issued: [1],
    cap: 'Every opening by type. Square panes, clear glass, sizes about until the window maker confirms.',
    data: ['Types and counts from the model', 'Sizes about', 'Tempered where code asks'],
    html: ctx => K.schedule(ctx, {
        x: .65, y: 3.75, w: 21.6, title: 'Openings',
        cols: [['No.', .72], ['Location', 4.2], ['Operation', 2.2], ['Width about', 1.3], ['Height about', 1.3], ['Frame', 2.4], ['Glazing', 2.6], ['Fire rating', 1.4]],
        groups: OPENINGS, foot: 'Numbers run by level: 1xx main. Sizes about, nominal leaf or panel, feasibility accuracy.',
        view: [1, 'Doors and windows', 'Schedule']
      }) +
      K.list(ctx, { x: 23.2, y: 3.75, w: 7.6, title: 'Opening notes', items: [
        'Panes hold to about 4 ft by 8 ft, square, clear glass only.',
        'Fire hazard zone: dual glazing with tempered lites, ember seals all round. {cf}',
        'Garage to house per [CRC R302.5.1]: 20 minute or solid core, self closing.',
        'U factor and SHGC from the energy model.'
      ] })
  });
})();
