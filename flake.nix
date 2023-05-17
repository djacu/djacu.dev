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

        husky = pkgs.buildNpmPackage rec {
          pname = "husky";
          version = "8.0.3";

          src = pkgs.fetchFromGitHub {
            owner = "typicode";
            repo = "husky";
            rev = "v${version}";
            hash = "sha256-KoF2+vikgFyCGjfKeaqkC720UVMuvCIn9ApDPKbudsA=";
          };

          npmDepsHash = "sha256-u1dndTKvInobva+71yI2vPiwrW9vqzAJ2sDAqT9YJsg=";
        };

        astro-shell = pkgs.npmlock2nix.v2.shell {
          src = ./.;
          nodejs = pkgs.nodejs;
          node_modules_mode = "copy";

          node_modules_attrs.nativeBuildInputs = [
            husky
          ];

          node_modules_attrs.shellHook = ''
            export PATH="${husky}/bin/:$PATH"
          '';

          # buildInputs = [husky];

          #sourceOverrides = {
          #  astro-paper = sourceInfo: drv:
          #    drv.overrideAttrs (old: {
          #      postPatch = ''
          #        mkdir -p vendor
          #        ln -sf ${husky} ./vendor/husky
          #      '';
          #    });
          #};
        };

        astro-modules = pkgs.npmlock2nix.v2.node_modules {
          src = ./.;
          nodejs = pkgs.nodejs;
          # node_modules_mode = "copy";

          sourceOverrides = {
            "astro-paper@2.3.0" = sourceInfo: drv:
              drv.overrideAttrs (old: {
                postPatch = ''
                  echo FUCK
                  ln -sf ${husky} ./node_modules/.bin/husky
                  exit 123
                '';
              });
          };
        };
      in {
        devShells.astro = astro-shell;
        packages = {
          inherit husky;
          inherit astro-modules;
        };
      }
    );
}
