# Airtribe Assignments Mono Repo

This is a mono repo for all the assignments given by Airtribe for the Backend Engineer course. All the assignments are in their own folders under the projects folder.

## Folder Structure

```bash
$ tree -L 3 -I node_modules
├── README.md
├── commitlint.config.js
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── projects
    ├── news-rest-api
    │   ├── package.json
    │   ├── src
    │   └── tsconfig.json
    └── task-manager-rest-api
        ├── README.MD
        ├── package.json
        ├── src
        └── tsconfig.json
```

## Architecture

This monorepo utitlizes [pnpm](https://pnpm.io/motivation) for package management and [commitlint](https://commitlint.js.org/#/) for commit message linting and [husky](https://typicode.github.io/husky/#/) for git hooks.
If you are not familiar with pnpm, you can read more about in the link above. It is a great package manager and I highly recommend it.
To install pnpm, run the following command:

```bash
$ npm install -g pnpm
```

**Installing pnpm to run these projects is recommended since there are additional setup in `pnpm-workspace.yaml` file.**

## Installation

To install all the dependencies for all the projects, run the following command:

```bash
$ pnpm install
```

## Running the app

To run the projects, run any of the following commands:

```bash
$ pnpm task-manager-rest-api:start
$ pnpm news-rest-api:start
```
