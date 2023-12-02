---
title: Update Framework BIOS on NixOS
description: Documentation is scattered; here is quick tutorial.
pubDatetime: 2023-12-02T06:19:10Z
tags:
  - nixos
  - nix
  - framework
  - bios
  - fwupd
---

## Introduction

I have been playing with my NixOS config for my Framework laptop and noticed that there was a significantly more recent version of the BIOS available.
There are some basic instructions for updating the bios using fwupdmgr, firmware update manager client utility, in the [nixos-hardware Framework's readme][ nixos-hardware-framework-readme ].
Those instruction did not work for me but after some digging I found [this thread][framework-discourse-lvfs-testing] on the Framework discourse.
Of course, if I had looked properly, I could have found the [complete instructions][framework-update-bios-guide] on the Framework knowledge base.

What you want to pay extra special attention to is the "Linux/LVFS Beta Testing BIOS" section.
One thing you will notice are these instructions to modify the `/etc/fwupd/uefi_capsule.conf` file and include/uncomment a line that says `DisableCapsuleUpdateOnDisk=true`.
Thankfully, the Nix community has noticed this and added a fix so we do not have to mess around with configuration files.
It was initially brought up in [this PR][fwupd-fix-closed] and a fix was merged in [this PR][fwupd-fix-merged].
With all that said, here was you need to do to update your Framework laptop's BIOS using NixOS.

_Note: I have an 11th Gen Intel Framework laptop. The process might be slightly different for another generation and/or architecture._

## Instructions

1. Make sure your laptop is plugged in and not running on its battery.
1. Enable `fwupd` via

    ```nix
    services.fwupd.enable = true;
    ```

1. Rebuild your system using `nixos-rebuild`.
    I used the `switch` flag because `fwupd` needs to run after reboot.
    I cannot say for certain if the `test` will work but better safe than a bricked laptop.
1. Add the LVFS testing channgel via

    ```shell
    fwupdmgr enable-remote lvfs-testing
    ```

1. Then run the following

    ```shell
    fwupdmgr refresh
    fwupdmgr get-updates
    fwupdmgr update
    ```

1. The prompt will recommend that you reboot and you should do so. The system will reboot and `fwupd` will begin updating your BIOS.

Do not worry if it appears to take a while.
My system took a few minutes to update, rebooted, showed nothing but a black screen for another minute and then continued with the boot process normally.
You got this.

👋

[nixos-hardware-framework-readme]: https://github.com/NixOS/nixos-hardware/blob/8772491ed75f150f02552c60694e1beff9f46013/framework/README.md
[framework-update-bios-guide]: https://knowledgebase.frame.work/en_us/updating-bios-on-linux-Hk4pROTn
[framework-discourse-lvfs-testing]: https://community.frame.work/t/solved-trying-to-upgrade-firmware/25512
[fwupd-fix-closed]: https://github.com/NixOS/nixpkgs/pull/208326
[fwupd-fix-merged]: https://github.com/NixOS/nixpkgs/pull/212860
