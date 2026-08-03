# Alico Home-7 — Mobile Touch Fix for the "Compare quotes" Coverage Slider

Restores full drag interaction of the coverage-amount slider in the
**"Compare quotes and get life insurance"** section on smartphones (iOS Safari,
Android Chrome), so it behaves exactly like it does on desktop.

## The problem

That slider is a **jQuery UI range slider** (`.ct-range-slider`). jQuery UI's
slider widget only listens for **mouse** events — it has no built-in touch
support. On desktop a mouse drives it fine. On a phone the browser fires a single
synthetic tap, which nudges the handle once and then it "freezes" — you can't
drag it. That's the exact behaviour reported.

## The fix

`alico-slider-touch-fix.js` — a ~1.5 KB, dependency-free drop-in. It translates
the standard **Pointer Events** that mobile browsers already fire for touch into
the mouse events the slider understands, so jQuery UI runs its normal drag logic
and every linked label (coverage amount, premium, etc.) updates just like on
desktop.

- No redesign, no markup changes, nothing else in the template is touched.
- Desktop behaviour is left 100% untouched (the script ignores `mouse` pointers).
- Uses only web-standard Pointer Events — future-proof, no extra libraries.

## Install (WordPress) — pick ONE

### Option A — Child theme (recommended)
1. Copy `alico-slider-touch-fix.js` into your child theme, e.g.
   `wp-content/themes/alico-child/js/alico-slider-touch-fix.js`
2. Add this to the child theme's `functions.php`:

```php
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_script(
        'alico-slider-touch-fix',
        get_stylesheet_directory_uri() . '/js/alico-slider-touch-fix.js',
        array('jquery', 'jquery-ui-slider'), // load after jQuery UI
        '1.0.0',
        true // in footer
    );
}, 100);
```

### Option B — Code snippet plugin
If you use a plugin like "WPCode" / "Code Snippets", add a new **JS snippet**,
paste the contents of `alico-slider-touch-fix.js`, and set it to run in the
site **footer** on the front-end.

That's it — no build step, no configuration.

## Test it yourself
Open `demo/demo.html` on your phone (or the live theme after installing). Try to
drag the coverage slider with your finger — it now moves smoothly to any value,
identical to the desktop experience.
