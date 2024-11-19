{
  description = "A minimal Nix flake for aarch64-darwin with qpdf";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs";

  outputs = { self, nixpkgs }: {
    devShell.aarch64-darwin = let
      pkgs = import nixpkgs { system = "aarch64-darwin"; };
    in pkgs.mkShell {
      buildInputs = [
        pkgs.qpdf
        pkgs.pdftk
        pkgs.ffmpeg
      ];
    };
  };
}
