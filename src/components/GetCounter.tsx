import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, PublicKey, SystemProgram, Transaction, TransactionMessage, TransactionSignature, VersionedTransaction } from '@solana/web3.js';
import { FC, useCallback, useState } from 'react';
import * as anchor from '@project-serum/anchor';
import idl from '../../blockchain/counter-program/target/idl/counter.json';
import { Counter } from '../../blockchain/counter-program/target/types/counter'; 


import { notify } from "../utils/notifications";
import { set } from 'date-fns';

export const GetCounter: FC = () => {
    const { connection } = useConnection();
    const  wallet = useWallet();

    const idl_object = JSON.parse(JSON.stringify(idl));

    const getProvider = () => {
        // Anchor Provider        
        const anchorProvider = new anchor.AnchorProvider(connection, wallet, 
            anchor.AnchorProvider.defaultOptions()
        );
        return anchorProvider;
    }
    

    const onClick = useCallback(async () => {

        if (!wallet.publicKey) {
            notify({ type: 'error', message: `Wallet not connected!` });
            console.log('error', `Send Transaction: Wallet not connected!`);
            return;
        }

        // Anchor Provider        
        const anchorProvider = getProvider();

        
        
        const program = new anchor.Program(idl_object, "EcabWoR6LZA1VKK3WaW4rbJCG6RrKXKr17cm8ZgENEU3", anchorProvider);
        try {
            const accounts = await connection.getProgramAccounts(program.programId);
            console.log(accounts);    
            accounts.map((account) => {
                program.account.counter.fetch(account.pubkey).then((counter:any) => {
                    console.log(counter.count);
                    notify({ type: 'success', message:"The counter with pda : "+  account.pubkey.toString() + "\ncontains the value ->" + counter.count.toString(), txid:"" });
                })
            })        
            console.log("Counters obtained: " + accounts.toString());
            //notify({ type: 'success', message: accounts.toString(), txid:"" });
        } catch (error: any) {
            notify({ type: 'error', message: `Transaction failed!`, description: error?.message, txid:""});
            console.log('error', `Transaction failed!, You may not have created a counter: ${error?.message}`, "signature");
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
                            Get My Counter
                        </span>
                    </button>
             </div>
        </div>
    );
};
