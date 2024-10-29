#!/bin/sh

xcode-select --install

brew analytics off

brew tap FelixKratz/formulae

brew install sketchybar

brew services start sketchybar