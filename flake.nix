{
  description = "djacu's personal site";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.npmlock2nix.url = "github:nix-community/npmlock2nix";
  inputs.npmlock2nix.flake = false;

  outputs = {
    self,
    nixpkgs,
    flake-utils,
    npmlock2nix,
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {
          inherit system;
          overlays = [
            (self: super: {
              npmlock2nix = pkgs.callPackage npmlock2nix {};
            })
          ];
        };

        astro-shell = pkgs.npmlock2nix.v2.shell {
          src = ./.;
          nodejs = pkgs.nodejs_latest;
          node_modules_mode = "copy";
        };
      in {
        devShells.astro = astro-shell;
      }
    );
}
