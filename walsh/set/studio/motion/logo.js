/* Logo in Motion (10/1/26): each study plays one of André's kept sumi tail logos, picked at random on every load.
   ?logo=NN pins one. The pool is his right swipes from the AM Sumi Tail Swipe deck. */
(function () {
  var P = ['01', '03', '12', '14', '39', '44', '45', '46', '47', '48'];
  var q = new URLSearchParams(location.search).get('logo');
  var n = P.indexOf(q) >= 0 ? q : P[Math.floor(Math.random() * P.length)];
  var B = new URL('../../../marks/sumi/', document.currentScript.src).href;
  window.AM_LOGO = { no: n, pool: P, lock: B + 'lock' + n + '.webp', mark: B + 'mark' + n + '.webp' };
  document.documentElement.dataset.logo = n;
  var set = function (el) { if (el.dataset && el.dataset.am) el.src = window.AM_LOGO[el.dataset.am]; };
  new MutationObserver(function (ms) { ms.forEach(function (m) { m.addedNodes.forEach(function (nd) {
    if (nd.nodeType !== 1) return; set(nd); if (nd.querySelectorAll) nd.querySelectorAll('[data-am]').forEach(set); }); }); })
    .observe(document.documentElement, { childList: true, subtree: true });
})();
