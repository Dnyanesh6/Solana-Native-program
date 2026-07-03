# Solana Native Programs

A collection of native Solana smart contracts written in Rust to learn core Solana development concepts. This repository currently contains two programs:

- **Double Program** – Creates a program-owned data account and doubles the stored counter value.
- **CPI Program** – Demonstrates Cross-Program Invocation (CPI) by invoking the Double Program from another Solana program.

## Features

### Double Program

- Creates a program-owned data account.
- Stores a 32-bit unsigned integer (`u32`).
- Reads the current value from the account.
- Doubles the stored value on every instruction invocation.
- Demonstrates account creation, ownership checks, and account data serialization.

### CPI Program

- Demonstrates Cross-Program Invocation (CPI).
- Receives a transaction from the client.
- Invokes the Double Program internally.
- Shows how one Solana program can execute instructions on another program.

## Steps to follow
1. Copy the program from cpi-contract/src/lib.rs and src/lib.rs
2. Build the program from https://beta.solpg.io/
3. After the build is compelete export the binary file from the Solana Playground
4. Copy the .so files in the *client/* folder and update the name of the file in the test files

## Project Structure

```
.
├── src/lib.rs          # Double counter program
├── cpi/                # CPI example program
└── client/             # TypeScript tests and examples
```

## Tech Stack

- Rust
- Solana Program SDK
- TypeScript
- LiteSVM
- @solana/web3.js

## Testing

The programs are tested locally using LiteSVM.

Run the tests:

```bash
npm install
npm test
```

## Concepts Covered

- Solana program development
- Program-owned accounts
- Account initialization
- Reading and writing account data
- Transaction construction
- Instruction processing
- Cross-Program Invocation (CPI)

## Learning Goal

This repository serves as a hands-on exploration of native Solana development, progressing from basic account management to inter-program communication through Cross-Program Invocations.