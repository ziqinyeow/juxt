<div align="center">
  <p>
    <a align="center" target="_blank">
      <img
        width="850"
        src="https://github.com/ziqinyeow/juxt/blob/main/asset/juxt-banner.png?raw=true"
      >
    </a>
  </p>
</div>

<!-- # Juxt -->

## Introduction

Juxt is a full stack monorepo that helps to streamline sport analysis workflow with pose tracking and estimation.

## Tech Stack

- [Next.js](https://nextjs.org/) – framework
- [Typescript](https://www.typescriptlang.org/) – language
- [Tailwind](https://tailwindcss.com/) – CSS
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) – database
- [Turborepo](https://turbo.build/repo) – monorepo
- [Vercel](https://vercel.com/) – deployments

## Apps

- [Web](./apps/web/) - Next.js Interface
- [Desktop](./apps/desktop/) - Electron Interface
- [Docs](./apps/docs/) - Nextra Docs
- [SDK](./apps/sdk/) - Pip Package For Pose Estimation
- [Server](./apps/server/) - FastAPI WebSocket Server

## Local Development

To develop RTM locally, you will need to clone this repository.

Once that's done, you can use the following commands to run the app locally:

```
pnpm i
npm i -g turbo
turbo dev
```

<!-- ![Alt](https://repobeats.axiom.co/api/embed/2f39348ed381d16e07997a9790c41fb503330a9c.svg "Repobeats analytics image") -->
