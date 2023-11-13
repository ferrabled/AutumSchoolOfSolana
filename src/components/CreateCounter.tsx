import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, PublicKey, SystemProgram, Transaction, TransactionMessage, TransactionSignature, VersionedTransaction } from '@solana/web3.js';
import { FC, useCallback, useState } from 'react';
import * as anchor from '@project-serum/anchor';
import idl from '../../blockchain/counter-program/target/idl/counter.json';
import { Counter } from '../../blockchain/counter-program/target/types/counter'; 


import { notify } from "../utils/notifications";
import { set } from 'date-fns';

export const CreateCounter: FC = () => {
    const { connection } = useConnection();
    const  wallet = useWallet();
    //const wallet = useAnchorWallet();

    const idl_object = JSON.parse(JSON.stringify(idl));
    //const programID = new PublicKey(idl_object.metadata.address);

    const getProvider = () => {
        // Anchor Provider        
        const anchorProvider = new anchor.AnchorProvider(connection, wallet, 
            anchor.AnchorProvider.defaultOptions()
        );
        return anchorProvider;
    }

    const onClick = useCallback(async () => {
        let latestBlockhash = await connection.getLatestBlockhash()

        if (!wallet.publicKey) {
            notify({ type: 'error', message: `Wallet not connected!` });
            console.log('error', `Send Transaction: Wallet not connected!`);
            return;
        }

        // Anchor Provider        
        const anchorProvider = getProvider();

        try {  
            // Anchor program to connect to our on-chain program
            const program = new anchor.Program(idl_object,"EcabWoR6LZA1VKK3WaW4rbJCG6RrKXKr17cm8ZgENEU3",anchorProvider);

            //Find a pda address for the seeds we've specified
            const [counter] = await anchor.web3.PublicKey.findProgramAddressSync(
                [anchor.utils.bytes.utf8.encode("counter"), anchorProvider.wallet.publicKey.toBuffer()],
                program.programId
            );

            //Instructions, first one to create a new counter
            const tx = await program.rpc.createCounter({                         
                accounts: {
                    authority: anchorProvider.wallet.publicKey,
                    //pd account of the bank
                    counter: counter,
                    systemProgram: SystemProgram.programId,
                },
            });
            
            console.log("new counter created: " + counter.toString());
            notify({ type: 'success', message: 'Transaction successful!', txid:"" });
        
        } catch (error: any) {
            notify({ type: 'error', message: `Transaction failed!`, description: error?.message, txid:""});
            console.log('error', `Transaction failed! ${error?.message}`, "signature");
            return;
        } 

        }, [wallet.publicKey, notify, connection]);

    return (
        <div className="flex flex-row justify-center">
            <div className="relative group items-center">
                <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 
                rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                    <button
                        className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
                        onClick={onClick} disabled={!wallet.publicKey}
                    >
                        <div className="hidden group-disabled:block ">
                        Wallet not connected
                        </div>
                         <span className="block group-disabled:hidden" >
                            Create Counter Account
                        </span>
                    </button>
             </div>
        </div>
    );
};
