#!/bin/sh

xcode-select --install

brew analytics off

brew tap FelixKratz/formulae

brew install sketchybar

brew services start sketchybar

defaults write com.apple.dock workspaces-edge-delay -float 0.1
defaults write com.apple.dock autohide -bool true
defaults write NSGlobalDomain NSAutomaticWindowAnimationsEnabled -bool false
defaults write com.apple.finder DisableAllAnimations -bool true
defaults write -g NSScrollViewRubberbanding -int 0