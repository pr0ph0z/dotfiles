# Herdr desktop config

This folder has my changes to the Herdr desktop app (`~/.config/herdr-app`).
Herdr writes its own files in that folder. Thus, `.install.sh` links only the items in this folder:

- `keys.json` → `~/.config/herdr-app/keys.json`
- each `mods/<name>/` → `~/.config/herdr-app/mods/<name>`

`.gitignore` ignores `gpui-kit.d.ts` and `jsconfig.json`. Herdr writes these files into each mod folder when it starts.

## Keys (`keys.json`)

These bindings are different from the Herdr defaults:

| Key | Action | Default | Why |
|---|---|---|---|
| `cmd-shift-p` | `mod.open:my-palette` | `app.palette` | Opens my palette (see below) instead of the built-in palette. |
| `cmd-alt-t` | `mod.open:auto-title` | (none) | Opens the Auto Title popup. |

Herdr keeps a changed `keys.json` as yours and does not add new default bindings to it.
Thus, this file does not have these newer defaults:

- `cmd-m` → `window.minimize` (global)
- `cmd-a` → `terminal.select_all` (terminal)

Add them by hand if you want them.

## Mods (`mods/`)

### `my-palette`

This mod is a personal copy of the built-in command palette (`frame/palette/main.js`).
Herdr rewrites `frame/` each time it starts, so changes there are lost. Open it with `cmd-shift-p`.

Additions to the built-in palette:

- **New worktree (hwt)**: opens the `hwt` mod.
- **Delete worktree (hwt -d)**: opens the `hwt-delete` mod.
- **Open Zed**: runs `zed -n .` in the folder of the focused terminal. No dialog opens.
  To add more programs, add entries to the `PROGRAMS` list in `main.js`.

After a Herdr update, compare `main.js` with `~/.config/herdr-app/frame/palette/main.js`. Then copy the new changes into this file.

### `hwt`

This dialog creates a new git worktree.
Type a branch name. The mod then runs `hwt <branch>` in the folder of the focused terminal.
A notification shows the result. An error shows in the dialog.

### `hwt-delete`

This dialog deletes the worktree of the focused terminal with `hwt -d <branch>`.

- It refuses the main checkout and a detached HEAD.
- It force-deletes the branch (`git branch -D`). Commits that are not merged are lost.
- It closes the Herdr space of the worktree.
- If the worktree has modified or untracked files, the button changes to **Delete anyway (--force)**.

## Requirements

- `hwt`: the script is `script/hwt` in this repo. It must be on the `PATH` that Herdr uses (for example `/usr/local/bin/hwt`).
- `zed`: the Zed command-line tool, for **Open Zed**.
- `auto-title` mod: this repo does not have it. Install it in `~/.config/herdr-app/mods/auto-title` before you use `cmd-alt-t`.
