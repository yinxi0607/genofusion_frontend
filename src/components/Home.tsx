// src/components/Home.tsx
import React, { useState, useEffect } from 'react';
import {Button, Image, message} from 'antd';
import { Web3Provider, JsonRpcSigner } from '@ethersproject/providers';
import {useAccountContext} from "../contexts/AccountContext";
import {useLocation,useNavigate} from "react-router-dom";
import ConnectButton from "./ConnectButton";



const Home: React.FC = () => {
    const { account, setAccount } = useAccountContext();
    const location = useLocation()
    const navigate = useNavigate();
    const invitationAccount = location.state?.invitationAccount as string | undefined;
    const invitationNftData = location.state?.invitationNftData as string | undefined;
    console.log("invitationAccount",invitationAccount)
    const connectWallet = async () => {
        if (!window.ethereum) {
            alert('请先安装MetaMask!');
            return;
        }

        const [selectedAccount] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(selectedAccount);
        if(invitationAccount){
            message.success('three seconds to jump to the mint page');
            const timer = setTimeout(() => {
                const startNewOne = true
                navigate('/mint', { state: { invitationNftData, invitationAccount,startNewOne } });
            }, 3000);

            return () => {
                clearTimeout(timer);
            };
            // navigate('/mint',{ state: { invitationNftData, invitationAccount } })
        }
    };

    const disconnectWallet = () => {
        setAccount('');
    };

    useEffect(() => {
        const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length === 0) {
                setAccount('');
            } else {
                setAccount(accounts[0]);
            }
        };

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            }
        };
    }, []);

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    height: 'calc(100vh - 80px)',
                }}
            >
                <div>
                    <Image
                        width={400}
                        src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                    />
                </div>
                <div>
                    {account ? (
                        <>
                            <p>Connected Account: {account}</p>
                            {/*<Button type="primary" onClick={disconnectWallet}>*/}
                            {/*    Disconnect Wallet*/}
                            {/*</Button>*/}
                            <ConnectButton text={"Disconnect Wallet"} onClick={disconnectWallet} style={{
                                backgroundColor: '#AE887B',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                width: '80%',
                                height: '70%',
                                fontSize: '30px',
                                // marginLeft: '-40%',
                                // padding: '5px 10px',
                            }}/>
                        </>
                    ) : (
                        // <Button type="primary" onClick={connectWallet}>
                        //     Connect Wallet
                        // </Button>
                        <ConnectButton text={"Connect Wallet"} onClick={connectWallet} style={{

                            backgroundColor: '#AE887B',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            width: '180%',
                            height: '150%',
                            fontSize: '30px',
                            marginLeft: '-40%',
                            // padding: '5px 10px',

                        }}/>
                    )}
                </div>
                <div style={{
                    marginTop: '-5%',
                }}>
                    Disclaimer: Connecting your wallet is only for detecting NFT in the address, and it will not cause any risks.
                </div>
            </div>
        </div>
    );
};

export default Home;
