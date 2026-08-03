/*!
 * Alico Home-7 – Mobile touch fix for the "Compare quotes" coverage slider.
 * Adds touch/pen drag support to the jQuery UI range slider (.ct-range-slider),
 * which by default only responds to a mouse. Nothing else in the theme is changed.
 *
 * How it works: modern mobile browsers (iOS Safari, Android Chrome) fire Pointer
 * Events for touch. We translate those into the mouse events the slider already
 * understands, so jQuery UI runs its normal drag logic and all linked labels
 * (coverage amount, premium, etc.) update exactly as they do on desktop.
 *
 * Drop-in: enqueue AFTER jquery + jquery-ui. No markup or CSS changes required.
 */
(function () {
  'use strict';

  function bridge(track) {
    if (track.__alicoTouchBridge) return;
    track.__alicoTouchBridge = true;

    // Let the browser's own gestures scroll the page vertically, but hand
    // horizontal drags on the slider to us.
    track.style.touchAction = 'none';

    function fireMouse(type, e) {
      var target = document.elementFromPoint(e.clientX, e.clientY) || e.target || track;
      target.dispatchEvent(new MouseEvent(type, {
        bubbles: true, cancelable: true, view: window,
        clientX: e.clientX, clientY: e.clientY,
        button: 0, buttons: type === 'mouseup' ? 0 : 1
      }));
    }

    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse') return; // desktop already works natively
      try { track.setPointerCapture(e.pointerId); } catch (x) {}
      fireMouse('mousedown', e);
      e.preventDefault();

      function onMove(ev) { fireMouse('mousemove', ev); ev.preventDefault(); }
      function onUp(ev) {
        fireMouse('mouseup', ev);
        track.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
      }
      track.addEventListener('pointermove', onMove, { passive: false });
      window.addEventListener('pointerup', onUp, false);
      window.addEventListener('pointercancel', onUp, false);
    }, { passive: false });
  }

  function init() {
    var nodes = document.querySelectorAll('.ct-range-slider, .ui-slider');
    for (var i = 0; i < nodes.length; i++) bridge(nodes[i]);
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
  // Sliders inside tabs/accordions can initialise late – re-scan after load.
  window.addEventListener('load', function () { setTimeout(init, 400); });
})();
