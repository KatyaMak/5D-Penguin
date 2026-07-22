# How to turn on 5D Penguin

It's a one-line edit — no rebuild, no tools needed.

Open `config.js` and change:

```js
SHOW_5D_PENGUIN: false,
```
to
```js
SHOW_5D_PENGUIN: true,
```

Save it, reload the page — the 5D Penguin nav link, blog pill, blog tag, and the page itself all come back immediately. Set it back to `false` and it all disappears again cleanly. That's the whole point of the flag: it's just that one word, `true`/`false`.

Two things worth knowing:

- **Locally** (editing the file on this computer without pushing to GitHub) this only affects your own local copy — nothing changes on the live site.
- **Once the site is live on GitHub Pages**, flipping it means editing that same line in `config.js` in the repo (either locally + push, or directly in GitHub's web editor) and it goes live within a minute or two of GitHub Pages rebuilding — no other steps.
