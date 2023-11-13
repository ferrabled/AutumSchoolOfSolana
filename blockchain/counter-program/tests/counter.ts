import * as anchor from "@project-serum/anchor";
import { Counter } from "../target/types/counter";
import {Keypair, SystemProgram } from "@solana/web3.js";

describe("counter", async () => {
  const provider = anchor.AnchorProvider.env()
  const wallet = provider.wallet as anchor.Wallet;
  anchor.setProvider(provider);
  let connection = anchor.getProvider().connection;

  const program = anchor.workspace.Counter as anchor.Program<Counter>;
  const user = Keypair.generate();


  it("Create Counter", async () => {
    
    const [counter] = await anchor.web3.PublicKey.findProgramAddressSync(
        [anchor.utils.bytes.utf8.encode("counter"), provider.wallet.publicKey.toBuffer()],
        program.programId
    );
    console.log("User balance: ", await connection.getBalance(user.publicKey));

    const tx = await program.methods.createCounter().accounts({
        authority: user.publicKey,
        counter: counter,
        systemProgram: SystemProgram.programId,
        }).signers([user]).rpc();
    console.log("Transaction receipt: ", tx);
  });
});