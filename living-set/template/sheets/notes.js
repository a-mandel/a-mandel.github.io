/* notes crew (template): A0.2 General notes.
   Built with the kit components (engine/living-kit.js): columns of numbered notes, an abbreviations grid, the symbols
   legend and key value tables, all on curved rules. Lifted from the Walsh A0.2 layout. Replace the words, keep the
   columns. {cf} prints the orange CONFIRM tag; [ref] prints an italic code reference. */
(function () {
  const K = window.LIVING_KIT;

  const GENERAL = [
    'This set records design intent for the project at feasibility, for owner review, budgeting and the first design review meeting. It is not for construction and not for permit.',
    'All work shall comply with the 2025 California Building Standards Code, Title 24, effective 1/1/26, as amended by the jurisdiction, and with the design review guidelines. Where two rules differ, the stricter governs.',
    'Site information is at feasibility accuracy. Property lines, setbacks, grades, trees and utilities shall be confirmed on a current boundary and topographic survey. {cf}',
    'Areas, heights and quantities are about, measured from the design model, gross to the outside face of walls.',
    'Consultants not yet engaged join later issuances and govern within their disciplines.',
    'Written dimensions govern over scaled ones. Never scale from a screen.',
    'These drawings and the living set are instruments of service of André Mandel. Reuse or alteration needs written consent.'
  ];
  const SCOPE = [
    'Site plan with coverage and impervious area, sheet A1.2.',
    'Floor plans and the roof, sheets A2.1 and A2.3.',
    'Sections and elevations, sheets A3.0 and A4.0.',
    'The live model on the cover, sheet A0.0.',
    'Regulatory report, budget framework and preliminary timeline, sheets F1.0 to F3.0.'
  ];
  const CONVENTIONS = [
    'Sheets are 36 by 24 in. Scales noted are true only on a full size print; on screen the set scales to fit.',
    'Elevations are feet above the site datum used by the model. Datum to be tied to the survey benchmark. {cf}',
    'Views are numbered on each sheet. A bubble reads view number over the sheet where the view is drawn.',
    'Handwritten notes on thin leaders are design intent, never specification.',
    'Burnt orange is the one accent: timber in the models, and every item still to confirm.',
    'The living set on the web is current. A printed sheet is a snapshot of the issuance in its title block.'
  ];
  const ABBR = [
    ['AFF', 'above finished floor'], ['APN', 'assessor parcel number'], ['CBC', 'California Building Code'], ['CRC', 'California Residential Code'],
    ['DR', 'design review'], ['EL', 'elevation'], ['FF', 'finished floor'], ['FHSZ', 'fire hazard severity zone'], ['NTS', 'not to scale'],
    ['OC', 'on center'], ['PL', 'property line'], ['SF', 'square feet'], ['TYP', 'typical'], ['UON', 'unless otherwise noted'], ['VIF', 'verify in field']
  ];
  const CODE = [
    ['Codes', '2025 CRC, CBC, CALGreen, California Energy Code, California WUI Code, CMC, CPC, California Electrical Code, CFC. Effective 1/1/26.'],
    ['Jurisdiction', 'County building {cf}'],
    ['Design review', 'Board and guidelines {cf}'],
    ['Occupancy', 'R3 single family dwelling · U attached garage'],
    ['Construction', 'Type VB {cf}'],
    ['Fire hazard', 'Zone and hardening [CRC R337] {cf}'],
    ['Conditioned', 'about, from the model'],
    ['Height', 'Limit over natural grade {cf}']
  ];
  const CRITERIA = [
    ['Ground snow', 'Per the county · confirm with the engineer'],
    ['Wind', 'ASCE 7, 2022 edition · confirm with the engineer'],
    ['Seismic', 'Design category · confirm with the engineer'],
    ['Soils', 'Per the geotechnical report {cf}'],
    ['Datum', 'Main floor 100.0, site datum · confirm on survey']
  ];

  LIVING_SHEETS.push({
    id: 'A0.2', group: 'General', title: 'General notes', short: 'General notes', foot: 'General notes', scale: 'None', issued: [1],
    cap: 'The ground rules for the set: what it is, how to read it, and the code basis it stands on.',
    data: ['2025 California codes, effective 1/1/26', 'R3 · Type VB', 'Fire zone · confirm', 'Loads confirmed by the engineer'],
    notes: [ { text: 'confirm before design review', t: [27.0, 13.4], p: [29.1, 11.05], a: 'l' } ],
    html: ctx => {
      const top = 3.35;
      let h = '<div class="lkx">';
      h += K.col(ctx, .6, top, 6.85, K.sec('01', 'General conditions', GENERAL) + K.sec('02', 'Scope of this set', SCOPE));
      h += K.col(ctx, 7.85, top, 6.85, K.sec('03', 'Drawing conventions', CONVENTIONS) + K.sec('04', 'Abbreviations', K.abbr(ABBR)));
      h += K.col(ctx, 15.1, top, 6.75, K.sec('05', 'Symbols legend', K.legend(ctx, { datum: '100.0', spot: '99.3' })));
      h += K.col(ctx, 22.25, top, 8.1, K.sec('06', 'Design criteria', K.tab(CRITERIA, '1.35in')) + K.sec('07', 'Code analysis', K.tab(CODE, '1.35in')));
      return h + '</div>';
    }
  });
})();
