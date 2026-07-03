import {test} from "node:test";
import assert from "node:assert/strict";
import { Buffer } from "buffer";
import {LiteSVM} from "litesvm";
import {
    Keypair,
    SystemProgram,
    Transaction,
    TransactionInstruction
} from "@solana/web3.js";

test("create data account", async () =>{
    const svm = new LiteSVM();
    const user = Keypair.generate();
    const contractPubKey = Keypair.generate();

    svm.addProgramFromFile(contractPubKey.publicKey, "./double.so");
    svm.airdrop(user.publicKey, BigInt(2_000_000_000));

    //data account public key
    const dataAccount = Keypair.generate();

    //create data account instruction
    const ix = [
        SystemProgram.createAccount({
            fromPubkey: user.publicKey,
            newAccountPubkey: dataAccount.publicKey,
            lamports: Number(svm.minimumBalanceForRentExemption(BigInt(4))),
            space: 4,
            programId: contractPubKey.publicKey,
        }),
    ]

    const transaction = new Transaction();
    const blockhash = svm.latestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = user.publicKey;
    transaction.add(...ix);
    transaction.sign(user, dataAccount);
    await svm.sendTransaction(transaction);
    
    function doubleIt(){
        const ix2 = new TransactionInstruction({
        keys:[
            {pubkey: dataAccount.publicKey, isSigner: false, isWritable: true},
        ],
        programId: contractPubKey.publicKey,
        data: Buffer.from("")
    })

    const transaction2 = new Transaction();
    transaction2.recentBlockhash = blockhash;
    transaction2.feePayer = user.publicKey;
    transaction2.add(ix2);
    transaction2.sign(user);
    svm.sendTransaction(transaction2);
    svm.expireBlockhash();
    }
    
    doubleIt();
    doubleIt();
    doubleIt();
    doubleIt();

    const data = svm.getAccount(dataAccount.publicKey);
    console.log("data account data: ", data?.data);
    assert.strictEqual(data?.data[0], 1);
    assert.strictEqual(data?.data[1], 0);
    assert.strictEqual(data?.data[2], 0);
    assert.strictEqual(data?.data[3], 0);
})


