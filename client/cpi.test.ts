import { test } from "node:test";
import assert from "node:assert/strict";
import { Buffer } from "buffer";
import { LiteSVM } from "litesvm";
import {
    Keypair,
    SystemProgram,
    Transaction,
    TransactionInstruction
} from "@solana/web3.js";

test("CPI to double program", async () => {
    const svm = new LiteSVM();
    const user = Keypair.generate();
    const cpiContract = Keypair.generate();
    const doubleContract = Keypair.generate();
    const dataAcc = Keypair.generate();

    svm.addProgramFromFile(doubleContract.publicKey, "./double.so");
    svm.addProgramFromFile(cpiContract.publicKey, "./cpi.so");
    svm.airdrop(user.publicKey, BigInt(2_000_000_000));

    //create data account instruction
    const ix =[
        SystemProgram.createAccount({
            fromPubkey: user.publicKey,
            newAccountPubkey: dataAcc.publicKey,
            lamports: Number(svm.minimumBalanceForRentExemption(BigInt(4))),
            space: 4,
            programId: doubleContract.publicKey,
        }),
    ]

    const transaction = new Transaction();
    const blockhash = svm.latestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = user.publicKey;
    transaction.add(...ix);
    transaction.sign(user, dataAcc);
    await svm.sendTransaction(transaction);

    function callCPI(){
        const ix2 = new TransactionInstruction({
            keys:[
                {pubkey: dataAcc.publicKey, isSigner: true, isWritable: true},
                {pubkey: doubleContract.publicKey, isSigner: false, isWritable: false}
            ],
            programId: cpiContract.publicKey,
            data: Buffer.from("")
        })

        const transaction2 = new Transaction();
        transaction2.recentBlockhash = blockhash;
        transaction2.feePayer = user.publicKey;
        transaction2.add(ix2);
        transaction2.sign(user,dataAcc);
        svm.sendTransaction(transaction2);
        svm.expireBlockhash();
    }

    callCPI();
    callCPI();
    callCPI();
    callCPI();

    const data = svm.getAccount(dataAcc.publicKey);
    console.log("data account data: ", data?.data);
    assert.strictEqual(data?.data[0], 1);
    assert.strictEqual(data?.data[1], 0);
    assert.strictEqual(data?.data[2], 0);
    assert.strictEqual(data?.data[3], 0);
})