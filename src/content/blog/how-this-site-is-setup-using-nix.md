---
title: How this site is setup using Nix
description: Nix is great for reproducibility, but there are some issues when trying to package software that can run arbitrary code.
pubDatetime: 2023-05-19T06:24:54Z
tags:
  - meta
  - nix
  - astro
---

I have been learning about different static site generators recently and settled on using Astro for this site.
Astro has been pretty great! It is a nice compromise between ultimate power and ease of use.
I even settled on this nice theme, [AstroPaper](https://github.com/satnaing/astro-paper).
It _appeared_ simple enough and did not appear that there would be issues with the dependencies.

### Nix Setup

The development shell for this site is fairly spartan.
I am using `npmlock2nix` to handle all the dirty work of dealing with npm packages.

```nix
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
          nodejs = pkgs.nodejs;
          node_modules_mode = "copy";

        };
      in {
        devShells.astro = astro-shell;
      }
    );
}
```

But, there was one issue; it did not work the first time I tried to enter the development shell.

### Failures... failures everywhere

```shell
% nix develop .\#astro   
trace: warning: [npmlock2nix] You are using the new v2 beta api. The interface isn't stable yet. Please report any issues at https://github.com/nix-community/npmlock2nix/issues
error: builder for '/nix/store/n1vxcbl6vrrr8acghhccvbf798nk0nni-astro-paper-2.3.0.drv' failed with exit code 127;
       last 10 log lines:
       >
       > sh: line 1: /build/node_modules/.bin/husky: cannot execute: required file not found
       > npm ERR! code 127
       > npm ERR! path /build
       > npm ERR! command failed
       > npm ERR! command sh -c husky install
       > 
       > npm ERR! A complete log of this run can be found in:
       > npm ERR!     /build/.npm/_logs/2023-05-17T06_31_45_382Z-debug-0.log
       > 
       For full logs, run 'nix log /nix/store/n1vxcbl6vrrr8acghhccvbf798nk0nni-astro-paper-2.3.0.drv'.
```

Digging into the derivation logs, I found this.

```shell
> astro-paper@2.3.0 prepare
> husky install

sh: line 1: /build/node_modules/.bin/husky: cannot execute: required file not found
npm ERR! code 127
npm ERR! path /build
npm ERR! command failed
npm ERR! command sh -c husky install

npm ERR! A complete log of this run can be found in:
npm ERR!     /build/.npm/_logs/2023-05-17T06_31_45_382Z-debug-0.log
```

Recently, I have run into issues like this before.
I could have removed the problematic dependency from the repo, but you cannot run from broken NPM packages when using Nix, or else nothing would work 🙃.
It is about principles damnit!
I tried all the tricks I knew:
 - Adding it as a `nativeBuildInput`.
 - Symlinking it in a `preBuildPhase`.
 - Adding it to the `PATH` in a `shellHook`.

Nothing was working!
I was grinding away at this for hours.
And then my friend tried it on their Mac as shown in the flake configuration above... and it just worked.
They could run pretty much anything they wanted in the `prepare` clause.
Stricken with grief and tired from spending way too much time on this, I nuked `husky` from every crevice of the repository and smiled when the devShell finally worked for me too.

### Wrap Up

Now that it was working for me and my friend and I confirmed a few things, I upstreamed the [issue](https://github.com/nix-community/npmlock2nix/issues/186) on the `npmlock2nix` repository.
Done with my contribution to the Nix community, I quickly started making this template theme my own.
And here we are.
I kinda like it.
It's nice.
👋
