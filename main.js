// Shared vanilla-JS behaviors for the Katya Maksimava site. No build step, no dependencies.

(function () {
  'use strict';

  // ---------- Expand/collapse (approach cards, FAQ) ----------
  function initExpandables() {
    document.querySelectorAll('[data-expandable]').forEach(function (el) {
      el.addEventListener('click', function () {
        el.classList.toggle('expanded');
      });
    });
  }

  // ---------- Blog category filter ----------
  function initBlogFilter() {
    var pills = document.querySelectorAll('[data-cat-filter]');
    var posts = document.querySelectorAll('[data-post-categories]');
    if (!pills.length) return;

    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        pills.forEach(function (p) { p.classList.remove('active'); });
        pill.classList.add('active');
        var cat = pill.getAttribute('data-cat-filter');
        posts.forEach(function (post) {
          var cats = (post.getAttribute('data-post-categories') || '').split(',');
          post.classList.toggle('is-hidden', cat !== 'all' && cats.indexOf(cat) === -1);
        });
      });
    });
  }

  // ---------- "Back to previous page" (browser history) ----------
  function initBackHistory() {
    document.querySelectorAll('[data-back-history]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        window.history.back();
      });
    });
  }

  // ---------- Anchor-scroll-on-load fix ----------
  function initAnchorScroll() {
    if (window.location.hash) {
      var id = window.location.hash.slice(1);
      setTimeout(function () {
        var el = document.getElementById(id);
        if (el) el.scrollIntoView({ block: 'start' });
      }, 50);
    }
  }

  // ---------- Home "What I Work With" Venn map ----------
  function initMapNodes() {
    var nodes = document.querySelectorAll('[data-map-node]');
    if (!nodes.length) return;
    var detailBoxes = document.querySelectorAll('[data-map-detail]');
    var emptyState = document.querySelector('[data-map-empty]');

    nodes.forEach(function (node) {
      node.addEventListener('click', function () {
        var id = node.getAttribute('data-map-node');

        nodes.forEach(function (n) {
          var circle = n.querySelector('.map-node-dot');
          n.classList.toggle('is-active', n === node);
          if (circle) circle.style.background = (n === node) ? circle.getAttribute('data-active-fill') : '';
        });

        detailBoxes.forEach(function (box) {
          box.classList.toggle('is-hidden', box.getAttribute('data-map-detail') !== id);
        });
        if (emptyState) emptyState.classList.add('is-hidden');
      });
    });
  }

  // ---------- Cycle of Contact interactive diagram ----------
  function curvePath(points) {
    var d = 'M' + points[0].x + ',' + points[0].y + ' ';
    for (var i = 0; i < points.length - 1; i++) {
      var p0 = points[i === 0 ? i : i - 1];
      var p1 = points[i];
      var p2 = points[i + 1];
      var p3 = points[i + 2 === points.length ? i + 1 : i + 2];
      var cp1x = p1.x + (p2.x - p0.x) / 6;
      var cp1y = p1.y + (p2.y - p0.y) / 6;
      var cp2x = p2.x - (p3.x - p1.x) / 6;
      var cp2y = p2.y - (p3.y - p1.y) / 6;
      d += 'C' + cp1x + ',' + cp1y + ' ' + cp2x + ',' + cp2y + ' ' + p2.x + ',' + p2.y + ' ';
    }
    return d;
  }

  function initCycleOfContact(config) {
    var svg = document.getElementById('cycle-svg');
    if (!svg) return;
    var VIEW_W = 680, VIEW_H = 320;
    var phases = config.phases;
    var disruptions = config.disruptions;
    var ns = 'http://www.w3.org/2000/svg';

    function el(tag, attrs) {
      var e = document.createElementNS(ns, tag);
      Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
      return e;
    }

    var path = el('path', { d: curvePath(phases), fill: 'none', stroke: 'oklch(38% 0.06 230)', 'stroke-width': '3' });
    svg.appendChild(path);

    phases.forEach(function (p) {
      svg.appendChild(el('line', {
        x1: p.x, y1: p.y + 12, x2: p.x, y2: 273,
        stroke: 'oklch(75% 0.02 60)', 'stroke-width': '1', 'stroke-dasharray': '3,3',
      }));
    });

    var overlay = document.getElementById('cycle-overlay');
    var detailTitle = document.getElementById('cycle-detail-title');
    var detailBody = document.getElementById('cycle-detail-body');
    var detailEmpty = document.getElementById('cycle-detail-empty');

    function select(type, i, item) {
      phases.forEach(function (p, idx) {
        var c = document.getElementById('phase-circle-' + idx);
        var isSel = type === 'phase' && idx === i;
        c.setAttribute('r', isSel ? 9 : 7);
        c.setAttribute('fill', isSel ? 'oklch(38% 0.06 230)' : 'oklch(97% 0.015 80)');
      });
      disruptions.forEach(function (d, idx) {
        var c = document.getElementById('disruption-circle-' + idx);
        var isSel = type === 'disruption' && idx === i;
        c.setAttribute('r', isSel ? 7 : 5);
        c.setAttribute('fill', isSel ? 'oklch(50% 0.1 30)' : 'oklch(97% 0.015 80)');
      });
      detailTitle.textContent = item.label;
      detailBody.textContent = item.body;
      detailTitle.classList.remove('is-hidden');
      detailBody.classList.remove('is-hidden');
      detailEmpty.classList.add('is-hidden');
    }

    phases.forEach(function (p, i) {
      var circle = el('circle', {
        id: 'phase-circle-' + i, cx: p.x, cy: p.y, r: 7, fill: 'oklch(97% 0.015 80)',
        stroke: 'oklch(38% 0.06 230)', 'stroke-width': '2', style: 'cursor:pointer;',
      });
      circle.addEventListener('click', function () { select('phase', i, p); });
      svg.appendChild(circle);

      var label = document.createElement('div');
      label.textContent = p.label;
      label.style.cssText = 'position:absolute;left:' + (p.x / VIEW_W * 100) + '%;top:' + ((p.y - 22) / VIEW_H * 100) + '%;transform:translate(-50%,-50%);font-size:13px;font-family:\'Public Sans\',sans-serif;font-weight:600;color:oklch(22% 0.02 60);white-space:nowrap;cursor:pointer;pointer-events:auto;';
      label.addEventListener('click', function () { select('phase', i, p); });
      overlay.appendChild(label);
    });

    disruptions.forEach(function (d, i) {
      var x = phases[i].x;
      var circle = el('circle', {
        id: 'disruption-circle-' + i, cx: x, cy: 280, r: 5, fill: 'oklch(97% 0.015 80)',
        stroke: 'oklch(50% 0.1 30)', 'stroke-width': '2', style: 'cursor:pointer;',
      });
      circle.addEventListener('click', function () { select('disruption', i, d); });
      svg.appendChild(circle);

      var label = document.createElement('div');
      label.textContent = d.label;
      label.style.cssText = 'position:absolute;left:' + (x / VIEW_W * 100) + '%;top:' + (300 / VIEW_H * 100) + '%;transform:translate(-50%,-50%);font-size:12px;font-family:\'Public Sans\',sans-serif;font-weight:500;color:oklch(45% 0.09 30);white-space:nowrap;cursor:pointer;pointer-events:auto;';
      label.addEventListener('click', function () { select('disruption', i, d); });
      overlay.appendChild(label);
    });
  }

  // ---------- 5D Penguin feature flag ----------
  function applyFeatureFlags() {
    var show = !!(window.SITE_CONFIG && window.SITE_CONFIG.SHOW_5D_PENGUIN);
    if (show) return;

    document.querySelectorAll('[data-feature="5d-penguin"]').forEach(function (el) {
      el.classList.add('is-hidden');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyFeatureFlags();
    initExpandables();
    initBlogFilter();
    initBackHistory();
    initAnchorScroll();
    initMapNodes();
    if (window.CYCLE_CONFIG) initCycleOfContact(window.CYCLE_CONFIG);
  });
})();
