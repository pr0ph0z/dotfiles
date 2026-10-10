#!/bin/sh

sketchybar --set "$NAME" label="$(TZ=":Asia/Jakarta" date '+%H:%M')"
