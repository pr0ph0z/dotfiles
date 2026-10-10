#!/bin/bash

# Follow the macOS Now Playing player, including Spotifast, Spotify and Music.
# Requires: brew install media-control
if [ "${1:-}" = toggle ]; then
  media-control toggle-play-pause || exit 1
fi
info=$(media-control get --no-artwork) || info=null
if /usr/bin/jq -e '(.title // "") | length > 0' <<< "$info" >/dev/null; then
  icon='󰏤'
  [ "$(/usr/bin/jq -r '.playing' <<< "$info")" = true ] || icon='󰐊'
  label=$(/usr/bin/jq -r '.title + (if (.artist // "") == "" then "" else " — " + .artist end)' <<< "$info")
  sketchybar --set media drawing=on icon="$icon" label="$label" \
    --set media_gap drawing=on
else
  sketchybar --set media drawing=off --set media_gap drawing=off
fi
