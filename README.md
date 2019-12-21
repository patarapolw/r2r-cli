# r2r-cli

Repeat Until You Can Recall

## Installation

```
yarn add @r2r/cli
```

## Usage

```
r2r <root>

Create or open in r2r

Positionals:
  root  Run as <root>/user.r2r                                         [string]

Options:
  --version       Show version number                                  [boolean]
  --filename, -f  Custom filename to open, including the extension, such as
                  custom.r2r                               [default: "user.r2r"]
  --port          Server port to open for R2r server          [default: "48000"]
  --help          Show help                                            [boolean]
```

## How is this created / works?

This is made using [Lerna](https://lerna.js.org/) and [Vue CLI](https://cli.vuejs.org/) with Express.js server and [ResTyped](https://github.com/rawrmaan/restyped)
- So, there is actually three repos, controlled by Lerna
  - Vue CLI-based front-end repo
  - Express.js repo
  - API definition repo

## Installation in development mode

- Git clone
- Install Yarn, and Lerna, run

```
yarn
yarn bootstrap
yarn build
cd packages/cli
yarn link
```

- Now, you can use it anywhere with command `r2r <root>`
