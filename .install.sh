#!/bin/sh

xcode-select --install

brew analytics off

brew tap FelixKratz/formulae

brew install tmux
brew install sketchybar
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
brew install --cask ghostty

brew install zsh
brew install zsh-autosuggestions

brew install orbstack
brew install oven-sh/bun/bun
brew install go
curl https://get.volta.sh | bash
brew install --cask dbeaver-community

curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix | sh -s -- install
nix registry pin nixpkgs

brew services start sketchybar

defaults write com.apple.dock workspaces-edge-delay -float 0.1
defaults write com.apple.dock autohide -bool true
defaults write NSGlobalDomain NSAutomaticWindowAnimationsEnabled -bool false
defaults write com.apple.finder DisableAllAnimations -bool true
defaults write -g NSScrollViewRubberbanding -int 0
sudo defaults write /Library/Preferences/FeatureFlags/Domain/UIKit.plist emoji_enhancements -dict-add Enabled -bool NO