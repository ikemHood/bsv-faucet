## Description

Create an open-source faucet service offering small amounts of digital tokens for testing purposes on the BSV Blockchain. This service aids developers and testers in their work without requiring them to acquire real digital currencies. It's applicable to non-production environments such as testnet.

A testnet faucet provides users with free testnet tokens for testing and development. This allows developers to test their applications and smart contracts before deploying them to the main network.

## Contents

- Introduction
- Getting Started
- Development Libraries
- Application Technology Stack
- Pre-requisites
- Steps to get started
- 

## Introduction

Bitcoin SV (BSV) is a blockchain that aims to maintain the original vision of Bitcoin, focusing on scalability, security, and stability. This list gathers various resources to help you explore, develop, and contribute to the BSV ecosystem.

## **Getting Started**

- [Bitcoin SV Website](https://bitcoinsv.io/)
- [Bitcoin SV Wiki](https://en.wikipedia.org/wiki/Bitcoin_SV)
- [BSV Developer Documentation](https://docs.bitcoinsv.io/)
- [BSV GitHub Repository](https://github.com/bitcoin-sv/bitcoin-sv)
- [Open Standards](https://openstandards.cash/) for industry collaboration
- [BSV Wiki](https://wiki.bitcoinsv.io/) – Aim to provide correct and up-to-date information on the Bitcoin protocol, network, and its features and functionality.
- [Paymail](https://tsc.bsvblockchain.org/standards/paymail/) – A collection of protocols for BSV blockchain wallets that allow for a set of simplified user experiences to be delivered across all wallets in the ecosystem.

## BSV Quick Start

https://docs.bsvblockchain.org/intro/quick-start

https://www.bsvblockchain.org/features/tools-libraries

## Development Libraries

- [Official BSV SDK](https://github.com/bitcoin-sv/ts-sdk) maintained by the BSV Association with zero dependencies.
- [Bitcoin SV Lib](https://github.com/moneybutton/bsv) - A pure and powerful JavaScript Bitcoin SV library. A fork of BitPay's bitcore-lib-cash, but for Bitcoin SV only. Maintained by Yours Inc.

## Application Technology Stack

[**Fullstack App with Next.js, Prisma, and Vercel Postgres**](https://vercel.com/guides/nextjs-prisma-postgres#how-to-build-a-fullstack-app-with-next.js-prisma-and-vercel-postgres)

Create a fullstack application with Next.js, Prisma, Vercel Postgres, and deploy to Vercel

---

[Prisma](https://prisma.io/) is a next-generation ORM that can be used to access a database in Node.js and TypeScript applications.

- [Next.js](https://nextjs.org/) as the React framework
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) for server-side API routes as the backend
- [Prisma](https://prisma.io/) as the ORM for migrations and database access
- [Vercel Postgres](https://vercel.com/storage/postgres) as the database
- [NextAuth.js](https://next-auth.js.org/) for authentication via GitHub (OAuth)
- [TypeScript](https://www.typescriptlang.org/) as the programming language
- [Vercel](http://vercel.com/) deployment

## Pre-requisites

To successfully finish this guide, you'll need:

- Node.js
- A Vercel Account (to set up a free Postgres database and deploy the app)
- A GitHub Account (to create an OAuth app)

## Steps to get started.

## Setup

First, let’s make sure that your development environment is ready.

- If you don’t have **Node.js** installed, [install it from here](https://nodejs.org/en/). You’ll need Node.js version **18** or higher.
- You’ll be using your own text editor and terminal app for this tutorial.

> If you are on Windows, we recommend downloading Git for Windows and use Git Bash that comes with it, which supports the UNIX-specific commands in this tutorial. Windows Subsystem for Linux (WSL) is another option.
> 

### Create a Next.js app

To create a Next.js app, open your terminal, `cd` into the directory you’d like to create the app in, and run the following command:

```
npx create-next-app@latest nextjs-blog --use-npm --example "https://github.com/vercel/next-learn/tree/main/basics/learn-starter"

```

> Under the hood, this uses the tool called create-next-app, which bootstraps a Next.js app for you. It uses this template through the --example flag.
> 
> 
> If it doesn’t work, please take a look at [this page](https://github.com/vercel/next-learn/blob/main/basics/errors/install.md).
> 

### Run the development server

You now have a new directory called `nextjs-blog`. Let’s `cd` into it:

```
cd nextjs-blog

```

Then, run the following command:

```
npm run dev

```

This starts your Next.js app’s "development server" (more on this later) on port **3000**.

Let’s check to see if it’s working. Open [http://localhost:3000](http://localhost:3000/) from your browser.
