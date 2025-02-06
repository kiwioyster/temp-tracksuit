# Take-Home Test (TypeScript)

This is a template for a take-home test. See the [Instructions][Instructions]
for details on the activity.

<!-- Link definitions -->

[DenoInstall]: https://docs.deno.com/runtime/getting_started/installation/
[Flake]: ./flake.nix
[Instructions]: ./Instructions.md

## Setup

Install Deno 2 using your preferred method--typically this would be your
system's package manager. See [Deno's installation instructions][DenoInstall] to
find the command that's right for you.

<!-- deno-fmt-ignore-start -->
> [!Tip]
> Nix users can use `nix develop` to install tools declared in this repo's
> [Flake][] .
<!-- deno-fmt-ignore-end -->

This repo was developed against Deno 2.1.2.

## Common tasks

Most of the commands you'll need are provided by the Deno toolchain. You can run
tasks either from the repo root or within each package

### Running client and server

```sh
deno task dev
```

### Typechecking

```sh
deno check .
```

### Linting

```sh
deno lint
```

### Formatting

```
deno fmt
```
