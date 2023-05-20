// src/components/Invitation.tsx

import React, { useState, useEffect } from 'react';
import {Row, Col, Image} from 'antd';
import { useLocation} from 'react-router-dom';
import axios from 'axios';
import rectangleImage1 from '../assets/mint1.png';
import {SalesInfo} from "./MintInvitation";
import ConnectButton from "./ConnectButton";
import {connectMetaMask} from "../util";
import {useAccountContext} from "../contexts/AccountContext";
import {divideByTenToEighteen} from "./Mint";


const MintMatched: React.FC = () => {
    const { account} = useAccountContext();
    const location = useLocation();
    const tokenImage = location.state?.tokenImage as string | undefined;
    const tokenId = location.state?.tokenId as string | undefined;
    const contractName = location.state?.contractName as string | undefined;
    const contractAddress = location.state?.contractAddress as string | undefined;
    const [salesInfo, setSalesInfo] = useState<SalesInfo>();

    useEffect(() => {
        const fetchSalesInfoData = async () => {
            try {
                console.log('fetchSalesInfoData');
                const response = await axios.get(
                    process.env.REACT_APP_API_BASE_URL + `/api/v1/sales-info`
                );
                console.log('fetchSalesInfoData response.data', response.data);
                setSalesInfo(response.data.data);
            } catch (error) {
                console.error('Error sending request:', error);
            }
        };
        fetchSalesInfoData();
        const intervalId = setInterval(() => {
            fetchSalesInfoData();
        }, Number(process.env.REACT_APP_API_SALES_INFO_TIME));

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const handleStartMinting = async () => {
        console.log("handleStartMinting");
        try {
            // 检查用户是否连接了钱包
            if (!window.ethereum) {
                alert('请先连接钱包！');
                return;
            }
            try {
                const request2 = axios.get(process.env.REACT_APP_API_BASE_URL + '/api/v1/fusion-index?initiator_contract_address=' + contractAddress + '&initiator_token_id=' + tokenId);
                const [response_fusion_index] = await Promise.all([request2]);
                const expiretAt = Math.floor(Date.now() / 1000) + 600;
                if (response_fusion_index.data.code === 200) {
                    console.log("fetchInvitationLink response.data", response_fusion_index.data);
                    const backendSignParams = {
                        "proposer_contract_address": contractAddress,
                        "proposer_address": account,
                        "proposer_token_id": Number(tokenId),
                        "expire_at": expiretAt,
                        "fusion_index": response_fusion_index.data.data.fusion_index
                    }
                    // console.log("backendSignParams", backendSignParams)
                    const contractSign = await axios.post(process.env.REACT_APP_API_BASE_URL + '/api/v1/sign', backendSignParams)
                    console.log("contractSign", contractSign)
                    console.log("contractAddress", contractAddress)
                    if (contractSign.data.code === 200 && contractAddress && salesInfo) {
                        console.log("contractSign.data.data", contractSign.data.data)
                        await connectMetaMask(expiretAt, contractSign.data.data, contractAddress, Number(tokenId), account, response_fusion_index.data.data.fusion_index,salesInfo.price);
                    }

                } else {
                    alert("Network Error")
                }
            } catch (error) {
                console.error('Error sending request:', error);
            }

        } catch (error) {
            console.error('Mint 错误:', error);
        }
    }

    return (
        <div style={{
            marginTop: '9vh',
        }}>
            <Row
                align="middle"
                justify="center"
                style={{
                    gap: 'calc(100%/10)',
                    paddingTop: 'calc(100%/20)',
                    paddingBottom: 'calc(100%/20)',
                }}
            >
                <Col xs={24} md={4}>
                    <div style={{
                        fontSize: '1vw',
                        color: '#913E21',
                        marginTop: '-20vh',
                    }}>
                        <h1>
                            Phase 1: Free Mint
                        </h1>


                    </div>
                    <div style={{
                        marginTop: '20%',
                        alignItems: 'initial',
                        fontSize: '0.9vw',
                        color: '#913E21',
                    }}>
                        <p>
                            Available: {salesInfo?.sold}/{salesInfo?.collection_size}
                        </p>
                    </div>
                    <div style={{
                        marginTop: '10%',
                        fontSize: '0.9vw',
                        color: '#913E21',
                    }}>
                        <p>
                            Price: {salesInfo ? salesInfo.price==="0"?"free":divideByTenToEighteen(Number(salesInfo.price)) : ''}
                        </p>
                    </div>
                </Col>
                <Col xs={24} md={4}>
                    <Image
                        src={tokenImage ? tokenImage.replace('ipfs://', 'https://ipfs.io/ipfs/') : rectangleImage1}
                        alt="Rectangle 1"
                        style={{ width: '15vw', height: '20vh' }}
                    />
                    <div style={{
                        marginTop: '10%',
                    }}>
                        <p style={{
                            fontSize: '1vw',
                            color: '#913E21',
                        }}>
                            {contractName} #{tokenId}
                        </p>
                        <p style={{
                            fontSize: '1vw',
                            color: '#913E21',
                            marginTop: '5vh',
                        }}>
                            {contractName}  #{tokenId} has been matched.

                        </p>
                        <p style={{
                            fontSize: '1vw',
                            color: '#913E21',
                        }}>
                            Start your own mint match invitation!
                        </p>
                        <div style={{
                            marginTop: '5vh',
                            marginBottom: '15%',
                        }}>
                            {/*<Button type="primary" onClick={handleStartMinting}>*/}
                            {/*    start minting*/}
                            {/*</Button>*/}
                            <ConnectButton text={"Start minting"} onClick={handleStartMinting} style={{
                                width: '8vw',
                                height: '5vh',
                                color: '#FFFFFF',
                                fontSize: '1vw',
                                borderRadius: '5px',
                                backgroundColor: '#AE887B',
                            }}/>
                        </div>
                    </div>
                </Col>
            </Row>
            <div style={{
                marginTop: '-3%',
            }}>
            </div>

        </div>
    );
};

export default MintMatched;
