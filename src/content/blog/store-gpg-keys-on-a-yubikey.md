---
title: How to store a GPG key on a YubiKey
description: A quick and easy guide to storing GPG keys on a YubiKey.
pubDatetime: 2023-11-15T6:00:00Z
tags:
  - gpg
  - hardware key
  - yubikey
---

## Table of contents

## Introduction

I have been looking at integrating [sops-nix][sops-nix] into my upcoming NixOS config.
One method of encryption is to use a GPG key on a YubiKey.
My friend, [sandbox][sandbox] sent me several links so I could educate myself:

* [drduh's YubiKey Guide][drduh]
* [Phil Dibowitz's PGP Setup][phil]
* [Xe's guide to storing a SSH key on a YubiKey][xe]

There is a lot of information to digest.
After reading through most of it, I asked sandbox if they would walk through it with me.
It is nice having someone who knows what they are doing there in case things go awry.

## Setup

You need, at the very least, 1 YubiKey.
*Note*: You should have at least 2.
> You've got a nice single point of failure here. It would be a shame if something happened to it.

You need a handful a packages.
I won't list them out here as drduh has done a great job documenting that for a variety of OSs.

## Create your master keys

Open your favorite terminal emulator and run the following.

```shell
$ gpg --full-generate-key
```

You will be greated with several questions.

```
gpg (GnuPG) 2.2.19; Copyright (C) 2019 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Please select what kind of key you want:
   (1) RSA and RSA (default)
   (2) DSA and Elgamal
   (3) DSA (sign only)
   (4) RSA (sign only)
  (14) Existing key from card
Your selection? 
```

Type `1` and press `Enter`.

```
RSA keys may be between 1024 and 4096 bits long.
What keysize do you want? (3072) 
```

Type `4096` and press `Enter`.

```
Please specify how long the key should be valid.
         0 = key does not expire
      <n>  = key expires in n days
      <n>w = key expires in n weeks
      <n>m = key expires in n months
      <n>y = key expires in n years
Key is valid for? (0)
```

Type `0` and press `Enter`.

***Note:*** Your key will never expire. Make sure you do this if you are sure you will _never_ lose your key.

```
Key does not expire at all
Is this correct? (y/N)
```

Type `Y` and press `Enter`.

`gpg` will ask you for a name, email, and comment.
Enter the requested information and press `Enter`.
The commnet is solely for you and not necessary.

```
GnuPG needs to construct a user ID to identify your key.

Real name:
Email address:
Comment: 
```

I filled out my name as `djacu` and my email as `dan@djacu.dev` and left the comment empty.
You should see something like the following but with your entered information.

```
You selected this USER-ID:
    "djacu <dan@djacu.dev>"

Change (N)ame, (C)omment, (E)mail or (O)kay/(Q)uit?
```

If everything looks correct, type `O` and press `Enter`.

You will be asked to enter a password.
This password is for your master signing key.
Pick a good one.
As you enter your password you should see the following.

```
We need to generate a lot of random bytes. It is a good idea to perform
some other action (type on the keyboard, move the mouse, utilize the
disks) during the prime generation; this gives the random number
generator a better chance to gain enough entropy.
```

After your enter your password (twice), you should see something like the following.

```
gpg: key F02D533E35E86143 marked as ultimately trusted
gpg: revocation certificate stored as '<REDACTED>'
public and secret key created and signed.

pub   rsa4096 2023-11-15 [SC]
      B7F085B528CC38717CBA5848F02D533E35E86143
uid                      djacu <dan@djacu.dev>
sub   rsa4096 2023-11-15 [E]
```

Congrats! You have made your master key!

Now to create the rest.
We are going to need your master key's fingerprint for the following commands.
In the example above, it is `B7F085B528CC38717CBA5848F02D533E35E86143`.
Copy that into a text file somewhere so you can copy it easily.
Wherever you see me refernce `<fingerprint>`, use your fingerprint.
Also, because we set a password, we are going to need that as well so keep it handy.

## Create your sub keys

### Signing key

Run the following.

```shell
$ gpg --edit-key <fingerprint>
```

You should see something like the following.

```
gpg (GnuPG) 2.2.19; Copyright (C) 2019 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Secret key is available.

sec  rsa4096/F02D533E35E86143
     created: 2023-11-15  expires: never       usage: SC  
     trust: ultimate      validity: ultimate
ssb  rsa4096/193706112639C741
     created: 2023-11-15  expires: never       usage: E   
[ultimate] (1). djacu <dan@djacu.dev>

gpg> 
```

You are now in the `gpg` shell.
Run the following.

```shell
gpg> addkey
```

You will be greeted with several question.

```
Please select what kind of key you want:
   (3) DSA (sign only)
   (4) RSA (sign only)
   (5) Elgamal (encrypt only)
   (6) RSA (encrypt only)
  (14) Existing key from card
Your selection? 
```

Type `4` and press `Enter`.

```
RSA keys may be between 1024 and 4096 bits long.
What keysize do you want? (3072)
```

Type `4096` and press `Enter`.

```
Please specify how long the key should be valid.
         0 = key does not expire
      <n>  = key expires in n days
      <n>w = key expires in n weeks
      <n>m = key expires in n months
      <n>y = key expires in n years
Key is valid for? (0) 
```

Type `0` and press `Enter`.

```
Key does not expire at all
Is this correct? (y/N) 
```

Type `Y` and press `Enter`.

```
Really create? (y/N) 
```

Type `Y` and press `Enter`.

You will be prompted to enter your master signing key password.
After entering, you will see something like the following.

```
We need to generate a lot of random bytes. It is a good idea to perform
some other action (type on the keyboard, move the mouse, utilize the
disks) during the prime generation; this gives the random number
generator a better chance to gain enough entropy.

sec  rsa4096/F02D533E35E86143
     created: 2023-11-15  expires: never       usage: SC  
     trust: ultimate      validity: ultimate
ssb  rsa4096/193706112639C741
     created: 2023-11-15  expires: never       usage: E   
ssb  rsa4096/B27561F7D73B8072
     created: 2023-11-15  expires: never       usage: S   
[ultimate] (1). djacu <dan@djacu.dev>
```

There is a new entry for this fingerprint.
You can see the difference if you compare it to the output from creating the master key.
It is these two lines.

```
ssb  rsa4096/B27561F7D73B8072
     created: 2023-11-15  expires: never       usage: S   
```

Run the following to save your new sub key.

```shell
gpg> save
```

You have created your signing key!

### Authentication key

Creating the authentication key is a little different than before.
We have to enter the `gpg` shell in expert mode and customize the key's capabilities.

Run the following.

```shell
gpg --expert --edit-key <fingerprint>
```

You should see something like the following.

```
gpg (GnuPG) 2.2.19; Copyright (C) 2019 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.
                                       
Secret key is available.            
                                       
sec  rsa4096/F02D533E35E86143
     created: 2023-11-15  expires: never       usage: SC  
     trust: ultimate      validity: ultimate
ssb  rsa4096/193706112639C741
     created: 2023-11-15  expires: never       usage: E                
ssb  rsa4096/B27561F7D73B8072                                                  
     created: 2023-11-15  expires: never       usage: S         
ssb  rsa4096/F20D4F38F42B8F6F                                                  
     created: 2023-11-15  expires: never       usage: E   
[ultimate] (1). djacu <dan@djacu.dev>

gpg>
```

Run the following.

```shell
gpg> addkey                                                                    
```

You will see a similar question from before but with more options.

```
Please select what kind of key you want:
   (3) DSA (sign only)                                                         
   (4) RSA (sign only)       
   (5) Elgamal (encrypt only)                                                  
   (6) RSA (encrypt only)    
   (7) DSA (set your own capabilities)                                         
   (8) RSA (set your own capabilities)
  (10) ECC (sign only)                                                         
  (11) ECC (set your own capabilities)
  (12) ECC (encrypt only)
  (13) Existing key                                                                                                                                           
  (14) Existing key from card                                                                                                                                 
Your selection?
```

Type `8` and press `Enter`.

At this point the key is configured to `Sign` and `Encrypt` which you can see on the second line.
We want it to `Authenticate` only.

```
Possible actions for a RSA key: Sign Encrypt Authenticate 
Current allowed actions: Sign Encrypt 

   (S) Toggle the sign capability
   (E) Toggle the encrypt capability
   (A) Toggle the authenticate capability
   (Q) Finished

Your selection?
```

To do so, we need to toggle all the options as follows.
Type `S` and press `Enter`, then type `E` and press `Enter`, then type `A` and press `Enter`, and finally type `Q` and press `Enter`.
You should see an output similar to below.

```
Possible actions for a RSA key: Sign Encrypt Authenticate 
Current allowed actions: Sign Encrypt 

   (S) Toggle the sign capability
   (E) Toggle the encrypt capability
   (A) Toggle the authenticate capability
   (Q) Finished

Your selection? S

Possible actions for a RSA key: Sign Encrypt Authenticate 
Current allowed actions: Encrypt 

   (S) Toggle the sign capability
   (E) Toggle the encrypt capability
   (A) Toggle the authenticate capability
   (Q) Finished

Your selection? E

Possible actions for a RSA key: Sign Encrypt Authenticate 
Current allowed actions: 

   (S) Toggle the sign capability
   (E) Toggle the encrypt capability
   (A) Toggle the authenticate capability
   (Q) Finished

Your selection? A

Possible actions for a RSA key: Sign Encrypt Authenticate 
Current allowed actions: Authenticate 

   (S) Toggle the sign capability
   (E) Toggle the encrypt capability
   (A) Toggle the authenticate capability
   (Q) Finished

Your selection? Q
```

The following is the same as the previous two keys: choose a key length, specify a expiration date, and enter your master password.
I have show the rest of the output below.

```
RSA keys may be between 1024 and 4096 bits long.
What keysize do you want? (3072) 4096
Requested keysize is 4096 bits
Please specify how long the key should be valid.
         0 = key does not expire
      <n>  = key expires in n days
      <n>w = key expires in n weeks
      <n>m = key expires in n months
      <n>y = key expires in n years
Key is valid for? (0) 
Key does not expire at all
Is this correct? (y/N) Y
Really create? (y/N) Y
We need to generate a lot of random bytes. It is a good idea to perform
some other action (type on the keyboard, move the mouse, utilize the
disks) during the prime generation; this gives the random number
generator a better chance to gain enough entropy.

sec  rsa4096/F02D533E35E86143
     created: 2023-11-15  expires: never       usage: SC  
     trust: ultimate      validity: ultimate
ssb  rsa4096/193706112639C741
     created: 2023-11-15  expires: never       usage: E   
ssb  rsa4096/B27561F7D73B8072
     created: 2023-11-15  expires: never       usage: S   
ssb  rsa4096/D464D993C82BC321
     created: 2023-11-15  expires: never       usage: A   
[ultimate] (1). djacu <dan@djacu.dev>

gpg> save
```

### Encryption key

An RSA key was already created when we made the master key, but we want a symmetric key that only exists on our YubiKey.
The steps are very similar to the previous steps with 1 small difference.
See the whole output below.
After we run `addkey`, we select option `12` for the type of key and option `1` for the type of elliptic curve.
Other than that the steps are the same.

```
gpg --expert --edit-key B7F085B528CC38717CBA5848F02D533E35E86143
gpg (GnuPG) 2.2.19; Copyright (C) 2019 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Secret key is available.

sec  rsa4096/F02D533E35E86143
     created: 2023-11-15  expires: never       usage: SC  
     trust: ultimate      validity: ultimate
ssb  rsa4096/193706112639C741
     created: 2023-11-15  expires: never       usage: E   
ssb  rsa4096/B27561F7D73B8072
     created: 2023-11-15  expires: never       usage: S   
ssb  rsa4096/D464D993C82BC321
     created: 2023-11-15  expires: never       usage: A   
[ultimate] (1). djacu <dan@djacu.dev>

gpg> addkey
Please select what kind of key you want:
   (3) DSA (sign only)
   (4) RSA (sign only)
   (5) Elgamal (encrypt only)
   (6) RSA (encrypt only)
   (7) DSA (set your own capabilities)
   (8) RSA (set your own capabilities)
  (10) ECC (sign only)
  (11) ECC (set your own capabilities)
  (12) ECC (encrypt only)
  (13) Existing key
  (14) Existing key from card
Your selection? 12
Please select which elliptic curve you want:
   (1) Curve 25519
   (3) NIST P-256
   (4) NIST P-384
   (5) NIST P-521
   (6) Brainpool P-256
   (7) Brainpool P-384
   (8) Brainpool P-512
   (9) secp256k1
Your selection? 1
Please specify how long the key should be valid.
         0 = key does not expire
      <n>  = key expires in n days
      <n>w = key expires in n weeks
      <n>m = key expires in n months
      <n>y = key expires in n years
Key is valid for? (0) 0
Key does not expire at all
Is this correct? (y/N) Y
Really create? (y/N) Y
We need to generate a lot of random bytes. It is a good idea to perform
some other action (type on the keyboard, move the mouse, utilize the
disks) during the prime generation; this gives the random number
generator a better chance to gain enough entropy.

sec  rsa4096/F02D533E35E86143
     created: 2023-11-15  expires: never       usage: SC  
     trust: ultimate      validity: ultimate
ssb  rsa4096/193706112639C741
     created: 2023-11-15  expires: never       usage: E   
ssb  rsa4096/B27561F7D73B8072
     created: 2023-11-15  expires: never       usage: S   
ssb  rsa4096/D464D993C82BC321
     created: 2023-11-15  expires: never       usage: A   
ssb  cv25519/AD088408E3F58ECB
     created: 2023-11-15  expires: never       usage: E   
[ultimate] (1). djacu <dan@djacu.dev>

gpg> save
```

You've done it!
All the keys are created!

### Backup the keys

The master key and sub-keys will be encrypted with your passphrase when exported.
Run the following commands.

```shell
$ gpg --armor --export-secret-keys <fingerprint> > master-sub.key

$ gpg --armor --export-secret-subkeys <fingerprint> > sub.key
```

For completeness, we will also export our public keys and generate a revocation certificate.

```shell
$ gpg --armor --export <fingerprint> > pub.key

$ gpg --output revoke.asc --gen-revoke <fingerprint>
```

Store all these files somewhere very safe.

## Store the key on a YubiKey

### Managing the YubiKey

Plug in your YubiKey and run the following command.

```shell
gpg --card-edit                                                 
```

You should see something similar to the following.

```
Reader ...........: 1050:0406:X:0
Application ID ...: D2760001240103040006137968850000
Application type .: OpenPGP
Version ..........: 3.4
Manufacturer .....: Yubico
Serial number ....: 13796885
Name of cardholder: [not set]
Language prefs ...: [not set]
Salutation .......: 
URL of public key : [not set]
Login data .......: [not set]
Signature PIN ....: not forced
Key attributes ...: rsa2048 rsa2048 rsa2048
Max. PIN lengths .: 127 127 127
PIN retry counter : 3 0 3
Signature counter : 0
KDF setting ......: off
Signature key ....: [none]
Encryption key....: [none]
Authentication key: [none]
General key info..: [none]

gpg/card> 
```

See the last several lines that say `XXXXXXX key...: [none]`?
We are going to populate those with our newly created keys.
But first we should configure our YubiKey.

### Change the PINs

The default values for the PIN and admin PIN are `123456` and `12345678` respectively.

Run the following.

```shell
gpg/card> admin
```

You should see the following.

```
Admin commands are allowed
```

Run the following.

```shell
gpg/card> passwd
```

```
gpg: OpenPGP card no. D2760001240103040006137968850000 detected

1 - change PIN
2 - unblock PIN
3 - change Admin PIN
4 - set the Reset Code
Q - quit

Your selection? 
```

Type `1` and press `Enter`.
You will be prompted to enter the PIN once and your new PIN twice.
You will be shown the following again.

```
1 - change PIN
2 - unblock PIN
3 - change Admin PIN
4 - set the Reset Code
Q - quit

Your selection? 
```

Type `3` and press `Enter`.
You will be prompted to enter the admin PIN once and your new admin PIN twice.
You will be shown the following again.

```
1 - change PIN
2 - unblock PIN
3 - change Admin PIN
4 - set the Reset Code
Q - quit

Your selection? 
```

Type `Q` and press `Enter`.

### Set your information

Run the following command to set your name. You may be prompted for the admin PIN.

```shell
gpg/card> name
```

You will be prompted for information. Type it and press `Enter`.

```
Cardholder's surname: Baker
Cardholder's given name: Daniel
```

Run the following command to set your language.

```shell
gpg/card> lang
```

You will be prompted for information. Type it and press `Enter`.

```
Language preferences: en
```

Run the following command to set your login.

```shell
gpg/card> login
```

You will be prompted for information. Type it and press `Enter`.

```
Login data (account name): <REDACTED>
```

Run the following.

```shell
gpg/card> list
```

You should see something similar to below but with your information.

```
Reader ...........: Yubico YubiKey FIDO CCID 00 00
Application ID ...: D2760001240103040006137968850000
Application type .: OpenPGP
Version ..........: 3.4
Manufacturer .....: Yubico
Serial number ....: 13796885
Name of cardholder: Daniel Baker
Language prefs ...: en
Salutation .......: 
URL of public key : [not set]
Login data .......: <REDACTED>
Signature PIN ....: not forced
Key attributes ...: rsa2048 rsa2048 rsa2048
Max. PIN lengths .: 127 127 127
PIN retry counter : 3 0 3
Signature counter : 0
KDF setting ......: off
Signature key ....: [none]
Encryption key....: [none]
Authentication key: [none]
General key info..: [none]
```

Run the following to quit out and return to your regular shell.

```shell
gpg/card> quit
```

### Transfer keys

***Important***
Transferring keys to YubiKey using keytocard is a destructive, one-way operation only.
Make sure you've made a backup before proceeding: keytocard converts the local, on-disk key into a stub, which means the on-disk copy is no longer usable to transfer to subsequent security key devices or mint additional keys.

Run the following command.

```shell
$ gpg --edit-key <fingerprint>
```

You should see something like the following.

```
gpg (GnuPG) 2.2.19; Copyright (C) 2019 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Secret key is available.

sec  rsa4096/F02D533E35E86143
     created: 2023-11-15  expires: never       usage: SC  
     trust: ultimate      validity: ultimate
ssb  rsa4096/193706112639C741
     created: 2023-11-15  expires: never       usage: E   
ssb  rsa4096/B27561F7D73B8072
     created: 2023-11-15  expires: never       usage: S   
ssb  rsa4096/D464D993C82BC321
     created: 2023-11-15  expires: never       usage: A   
ssb  cv25519/AD088408E3F58ECB
     created: 2023-11-15  expires: never       usage: E   
[ultimate] (1). djacu <dan@djacu.dev>
```

Run the following command.

```shell
gpg> key 2
```

You should see something like the following.
See how the 3rd entry, `ssb*` has an asterisk now?
That key is selected for transfer.

```
sec  rsa4096/F02D533E35E86143
     created: 2023-11-15  expires: never       usage: SC  
     trust: ultimate      validity: ultimate
ssb  rsa4096/193706112639C741
     created: 2023-11-15  expires: never       usage: E   
ssb* rsa4096/B27561F7D73B8072
     created: 2023-11-15  expires: never       usage: S   
ssb  rsa4096/D464D993C82BC321
     created: 2023-11-15  expires: never       usage: A   
ssb  cv25519/AD088408E3F58ECB
     created: 2023-11-15  expires: never       usage: E   
[ultimate] (1). djacu <dan@djacu.dev>
```

Run the following command.

```shell
gpg> keytocard
```

You should see something like the following.
This is our signature key as denoted by the `usage: S`.

```
Please select where to store the key:
   (1) Signature key
   (3) Authentication key
Your selection?
```

Type `1` and press `Enter`.

You will be prompted for your master signing key password followed by the YubiKey admin PIN.

Run `key 2` again to deselect and `key 3` to select the next key.

```
gpg> key 2
gpg> key 3
```

You should see something like the following.

```
sec  rsa4096/F02D533E35E86143
     created: 2023-11-15  expires: never       usage: SC  
     trust: ultimate      validity: ultimate
ssb  rsa4096/193706112639C741
     created: 2023-11-15  expires: never       usage: E   
ssb  rsa4096/B27561F7D73B8072
     created: 2023-11-15  expires: never       usage: S   
ssb* rsa4096/D464D993C82BC321
     created: 2023-11-15  expires: never       usage: A   
ssb  cv25519/AD088408E3F58ECB
     created: 2023-11-15  expires: never       usage: E   
[ultimate] (1). djacu <dan@djacu.dev>
```

Run the following command.

```shell
gpg> keytocard
```

You should see something like the following.
This is our authentication key as denoted by the `usage: A`.

```
Please select where to store the key:
   (3) Authentication key
Your selection?
```

Type `3` and press `Enter`.

You will be prompted for your master signing key password followed by the YubiKey admin PIN.

Run `key 3` again to deselect and `key 4` to select the next key.

```
gpg> key 3
gpg> key 4
```

You should see something like the following.

```
sec  rsa4096/F02D533E35E86143
     created: 2023-11-15  expires: never       usage: SC  
     trust: ultimate      validity: ultimate
ssb  rsa4096/193706112639C741
     created: 2023-11-15  expires: never       usage: E   
ssb  rsa4096/B27561F7D73B8072
     created: 2023-11-15  expires: never       usage: S   
ssb  rsa4096/D464D993C82BC321
     created: 2023-11-15  expires: never       usage: A   
ssb* cv25519/AD088408E3F58ECB
     created: 2023-11-15  expires: never       usage: E   
[ultimate] (1). djacu <dan@djacu.dev>
```

Run the following command.

```shell
gpg> keytocard
```

You should see something like the following.
This is our encryption key as denoted by the `usage: E`.

```
Please select where to store the key:
   (2) Encryption key
Your selection?
```

Type `2` and press `Enter`.

You will be prompted for your master signing key password followed by the YubiKey admin PIN.

Run the following command.

```shell
gpg> save
```

### Verify

Our keys should be stored now on the yubikey.
Let's check.

Run the following command.

```shell
$ gpg -K
```

You should see something like the following.

```shell
<REDACTED>
--------------------------------
sec   rsa4096 2023-11-15 [SC]
      B7F085B528CC38717CBA5848F02D533E35E86143
uid           [ultimate] djacu <dan@djacu.dev>
ssb   rsa4096 2023-11-15 [E]
ssb>  rsa4096 2023-11-15 [S]
ssb>  rsa4096 2023-11-15 [A]
ssb>  cv25519 2023-11-15 [E]
```

See how the last 3 `ssb` entries now have the `>` character next to them. They are stubs and have been moved to the YubiKey.

Run the following command.

```shell
$ gpg --card-status
```

You should see something like the following.

```
Reader ...........: Yubico YubiKey FIDO CCID 00 00
Application ID ...: D2760001240103040006137968850000
Application type .: OpenPGP
Version ..........: 3.4
Manufacturer .....: Yubico
Serial number ....: 13796885
Name of cardholder: Daniel Baker
Language prefs ...: en
Salutation .......: 
URL of public key : [not set]
Login data .......: bakerdn
Signature PIN ....: not forced
Key attributes ...: rsa4096 cv25519 rsa4096
Max. PIN lengths .: 127 127 127
PIN retry counter : 3 0 3
Signature counter : 0
KDF setting ......: off
Signature key ....: 0A24 1BDA E9E0 E057 699D  F661 B275 61F7 D73B 8072
      created ....: 2023-11-15 02:49:02
Encryption key....: 55C6 708C 76A0 ACF0 D849  2A10 AD08 8408 E3F5 8ECB
      created ....: 2023-11-15 03:53:05
Authentication key: DE56 B674 7EAE DFA2 3F63  63FA D464 D993 C82B C321
      created ....: 2023-11-15 03:32:35
General key info..: sub  rsa4096/B27561F7D73B8072 2023-11-15 djacu <dan@djacu.dev>
sec   rsa4096/F02D533E35E86143  created: 2023-11-15  expires: never     
ssb   rsa4096/193706112639C741  created: 2023-11-15  expires: never     
ssb>  rsa4096/B27561F7D73B8072  created: 2023-11-15  expires: never     
                                card-no: 0006 13796885
ssb>  rsa4096/D464D993C82BC321  created: 2023-11-15  expires: never     
                                card-no: 0006 13796885
ssb>  cv25519/AD088408E3F58ECB  created: 2023-11-15  expires: never     
                                card-no: 0006 13796885
```

Remember how before all the keys near the bottom said `XXXXXXX key...: [none]`?
Now they are populated!
We did it! 🎉

## Multiple YubiKeys

This method might seem a little hacky (because it is) but this is similar to drduh's method and it works.
I will denote <gnupghome> as the directory where the GPG keys are stored. For me, it is in `~/.gnupg/`.

Run the following commands.

```shell
$ cd ~/.gnupg
$ mv private-keys-v1.d private-keys-v1.d.bak
$ mkdir private-keys-v1.d
$ gpg --import master-sub.key
```

If you run `gpg -K` you should notice that your private keys are no longer stubs and you can begin the process of transferring to your next YubiKey.

👋

[drduh]: https://github.com/drduh/YubiKey-Guide
[phil]: https://www.phildev.net/pgp/gpgkeygen.html
[sandbox]: https://boxen.page
[sops-nix]: https://github.com/Mic92/sops-nix
[xe]: https://xeiaso.net/blog/yubikey-ssh-key-storage/
