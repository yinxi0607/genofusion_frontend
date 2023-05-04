// src/components/Home.tsx
import React, { useState, useEffect } from 'react';
import {Button, Image, message} from 'antd';
import { Web3Provider, JsonRpcSigner } from '@ethersproject/providers';
import {useAccountContext} from "../contexts/AccountContext";
import {useLocation,useNavigate} from "react-router-dom";



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
                navigate('/mint', { state: { invitationNftData, invitationAccount } });
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
                            <Button type="primary" onClick={disconnectWallet}>
                                Disconnect Wallet
                            </Button>
                        </>
                    ) : (
                        <Button type="primary" onClick={connectWallet}>
                            Connect Wallet
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
