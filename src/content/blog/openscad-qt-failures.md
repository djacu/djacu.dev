---
title: Qt errors with OpenSCAD from nixpkgs.
description: I tried getting OpenSCAD running on a non-NixOS machine.
pubDatetime: 2023-07-24T03:53:52Z
tags:
  - nix
  - nixpkgs
  - qt
  - openscad
---
I've been playing with OpenSCAD to generate the NixOS flake logo parametrically, but I installed OpenSCAD via `apt` (this machine is running Linux Mint).
I wanted to include some libraries, but did not want to install them globally, so I thought I would package it in a flake.

### Nix Setup

Packaging the libraries and OpenSCAD was pretty straightfoward.
I do not know if there is an easier way to pull files from a repository and put them in the nix store, but this is clear to me.

```nix
bosl2 = pkgs.stdenvNoCC.mkDerivation {
  pname = "bosl2";
  version = "2.0.652";
  src = pkgs.fetchFromGitHub {
    owner = "BelfrySCAD";
    repo = "BOSL2";
    rev = "c803f1a1710bbe87dd0a598699c59d50ead3b7ba";
    sha256 = "sha256-vGT71J5bMQ/C1puZ1MboUvw3v9YhL2GgIw77brr0hf8=";
  };
  dontBuild = true;
  installPhase = ''
    mkdir -p $out/bosl2
    cp ./*.scad $out/bosl2/
  '';
};
```

Again not sure if there is an easier way but I wanted something clear.
There were additionaly libraries I wanted to add so I pulled them all into a single derivation.

```nix
libraries = pkgs.stdenvNoCC.mkDerivation {
  pname = "openscad-libraries";
  version = "0.1.0";
  dontUnpack = true;
  dontBuild = true;
  installPhase = ''
    mkdir -p $out
    cp -R ${bosl2}/* $out/
    cp -R ${constructive}/* $out/
  '';
};
```

And made all the libraries available to OpenSCAD.

```nix
wrapped-openscad =
  pkgs.runCommand "wrapped-openscad"
  {
    nativeBuildInputs = [pkgs.makeWrapper];
  }
  ''
    mkdir -p $out/bin
    ln -s ${pkgs.openscad}/bin/openscad $out/bin/openscad
    wrapProgram $out/bin/openscad \
      --set OPENSCADPATH ${libraries}
  '';
```

### Building and Running

After building, the result looked correct but when running the binary...

```shell
% ./result/bin/openscad                                         
Gtk-Message: 21:06:15.325: Failed to load module "xapp-gtk3-module"
qt.glx: qglx_findConfig: Failed to finding matching FBConfig for QSurfaceFormat(version 2.0, options QFlags<QSurfaceFormat::FormatOption>(), depthBufferSize -1, redBufferSize 1, greenBufferSize 1, blueBufferSize 1, alphaBufferSize -1, stencilBufferSize -1, samples -1, swapBehavior QSurfaceFormat::SingleBuffer, swapInterval 1, colorSpace QSurfaceFormat::DefaultColorSpace, profile  QSurfaceFormat::NoProfile)
No XVisualInfo for format QSurfaceFormat(version 2.0, options QFlags<QSurfaceFormat::FormatOption>(), depthBufferSize -1, redBufferSize 1, greenBufferSize 1, blueBufferSize 1, alphaBufferSize -1, stencilBufferSize -1, samples -1, swapBehavior QSurfaceFormat::SingleBuffer, swapInterval 1, colorSpace QSurfaceFormat::DefaultColorSpace, profile  QSurfaceFormat::NoProfile)
Falling back to using screens root_visual.
```

Well the splash menu loaded.
Not going to let a few errors stop me.
So I tried creating a new file.

```shell
qt.glx: qglx_findConfig: Failed to finding matching FBConfig for QSurfaceFormat(version 2.0, options QFlags<QSurfaceFormat::FormatOption>(), depthBufferSize -1, redBufferSize 1, greenBufferSize 1, blueBufferSize 1, alphaBufferSize -1, stencilBufferSize -1, samples -1, swapBehavior QSurfaceFormat::SingleBuffer, swapInterval 1, colorSpace QSurfaceFormat::DefaultColorSpace, profile  QSurfaceFormat::NoProfile)
No XVisualInfo for format QSurfaceFormat(version 2.0, options QFlags<QSurfaceFormat::FormatOption>(), depthBufferSize -1, redBufferSize 1, greenBufferSize 1, blueBufferSize 1, alphaBufferSize -1, stencilBufferSize -1, samples -1, swapBehavior QSurfaceFormat::SingleBuffer, swapInterval 1, colorSpace QSurfaceFormat::DefaultColorSpace, profile  QSurfaceFormat::NoProfile)
Falling back to using screens root_visual.
qt.glx: qglx_findConfig: Failed to finding matching FBConfig for QSurfaceFormat(version 2.0, options QFlags<QSurfaceFormat::FormatOption>(), depthBufferSize -1, redBufferSize 1, greenBufferSize 1, blueBufferSize 1, alphaBufferSize -1, stencilBufferSize -1, samples -1, swapBehavior QSurfaceFormat::SingleBuffer, swapInterval 1, colorSpace QSurfaceFormat::DefaultColorSpace, profile  QSurfaceFormat::NoProfile)
qt.glx: qglx_findConfig: Failed to finding matching FBConfig for QSurfaceFormat(version 2.0, options QFlags<QSurfaceFormat::FormatOption>(), depthBufferSize -1, redBufferSize 1, greenBufferSize 1, blueBufferSize 1, alphaBufferSize -1, stencilBufferSize -1, samples -1, swapBehavior QSurfaceFormat::SingleBuffer, swapInterval 1, colorSpace QSurfaceFormat::DefaultColorSpace, profile  QSurfaceFormat::NoProfile)
Could not initialize GLX
zsh: abort (core dumped)  ./result/bin/openscad
```

...oh

well...

### Debugging

Working with a friend, we tried a few things.

We looked at the differences in dynamically linked libraries using `ldd` and there were _several_.

```python
("nix_not_in_apt = ['libcap', 'libkeyutils', "
 "'/nix/store/m0xa5bz7vw7p43wi0jppvvi3c9vgqvp7-glibc-2', 'libopus', "
 "'libgssapi_krb5', 'libkrb5support', 'libboost_thread', 'libCGAL', "
 "'libk5crypto', 'libXext', 'libboost_system', 'libpulse-mainloop-glib', "
 "'libQt5Concurrent', 'libgthread-2', 'libmvec', 'libpulsecommon-14', "
 "'libssl', 'libkrb5', 'libcom_err', '(0x00007ffdb23ef000)']")
("apt_not_in_nix = ['libQt5Gamepad', '(0x00007fe354022000)', 'libasyncns', "
 "'libapparmor', 'libnsl', 'libuuid', '/lib64/ld-linux-x86-64', 'libbsd', "
 "'(0x00007ffe0f199000)', 'lib3MF', 'libwrap', 'libpulsecommon-13', "
 "'libspnav']")
```

The number of differences were troubling but we were not sure what to make of it.

We found a thread _somewhere_ that tried setting an environment variable.

```shell
export QT_XCB_GL_INTEGRATION=none
```

I tried using `wrapQtAppsHook` via [these instructions](https://nixos.org/manual/nixpkgs/stable/#qt-runtime-dependencies) that I found on [this thread](https://github.com/NixOS/nixpkgs/issues/85866#issuecomment-957692480).

Nothing worked.

I finally tried running this on my NixOS machine and it worked fine.
Not sure if anything can be done to fix this so I will deal with what works for now.

👋
