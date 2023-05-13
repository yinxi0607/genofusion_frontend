// src/components/Mint.tsx
import React, {useEffect, useState} from 'react';
import {Row, Col, Typography, Button, Image, Mentions, message} from 'antd';
import {useLocation} from 'react-router-dom';
import rectangleImage1 from '../assets/mint1.png';
import rectangleImage2 from '../assets/mint2.png';
import circleImage from '../assets/mint3.png';
import {useAccountContext} from "../contexts/AccountContext";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {NFTData} from "./SelectNFT";
import {connectMetaMask} from "../util";

interface SalesInfo {
    contract_address: string;
    collection_size: string;
    end_timestamp: string;
    price: string;
    sale_phase: string;
    sold: string;
    start_timestamp: string
}

interface allInvitationLinkInterface {

}

function divideByTenToEighteen(number: number): string {
    const numberBigInt = BigInt(Math.floor(number * 1e14));
    const dividerBigInt = BigInt(10) ** BigInt(18);
    const resultBigInt = numberBigInt / dividerBigInt;
    const result = parseFloat(resultBigInt.toString()) / 1e14;
    return result.toFixed(2);
}

const {Title, Text} = Typography;

const Mint: React.FC = () => {
    const {account} = useAccountContext();
    const navigate = useNavigate();
    const location = useLocation();
    const selectedCard = location.state?.selectedCard as NFTData | undefined;
    const invitationAccount = location.state?.invitationAccount as string | undefined;
    const invitationNftData = location.state?.invitationNftData as NFTData | undefined;
    // console.log("invitationAccount", invitationAccount)
    // console.log("invitationNftData", invitationNftData)
    console.log("selectedCard", selectedCard)

    const [invitationLink, setInvitationLink] = useState<string | undefined>(undefined);
    const [allInvitationLink, setAllInvitationLink] = useState<allInvitationLinkInterface[] | undefined>(undefined);
    const [salesInfo, setSalesInfo] = useState<SalesInfo | undefined>(undefined);

    useEffect(() => {
        const fetchAllInvitationLink = async () => {
            if (account && selectedCard) {

                try {
                    const response = await axios.get(process.env.REACT_APP_API_BASE_URL + '/api/v1/initiator-invite/account/'+account);
                    console.log("fetchAllInvitationLink response.data", response.data)
                    if (response.data.code===200){
                        setAllInvitationLink(response.data.data.inviteCode);
                    }else{
                        alert(response.data.message)
                    }
                } catch (error) {
                    console.error('Error sending request:', error);
                }

            }
        };
        fetchAllInvitationLink();
    }, [account]);

    useEffect(() => {
        const fetchInvitationLink = async () => {
            if (account && selectedCard) {

                    try {
                        const response = await axios.post(process.env.REACT_APP_API_BASE_URL + '/api/v1/initiator-invite', {
                            "initiator_contract_address":selectedCard.contract,
                            "initiator_account_address":account,
                            "initiator_token_id":String(selectedCard.tokenId),
                            "initiator_image":selectedCard.image,
                        });
                        console.log("fetchInvitationLink response.data", response.data)
                        if (response.data.code===200){
                            setInvitationLink(response.data.data.inviteCode);
                        }else{
                            alert(response.data.message)
                        }
                    } catch (error) {
                        console.error('Error sending request:', error);
                    }

            }
        };

        fetchInvitationLink();
    }, [account]);

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
        fetchSalesInfoData(); // 在 useEffect 中立即调用一次
        const intervalId = setInterval(() => {
            fetchSalesInfoData();
        }, Number(process.env.REACT_APP_API_SALES_INFO_TIME)); // 每两秒钟获取一次数据

        // 在组件卸载时清除定时器
        return () => {
            clearInterval(intervalId);
        };
    }, []); // 移除 salesInfo 依赖，避免不必要的重新渲染



    const handleMint = async () => {
        try {
            // 检查用户是否连接了钱包
            if (!window.ethereum) {
                alert('请先连接钱包！');
                return;
            }
            if (selectedCard !== undefined) {

                if (invitationNftData){
                    try {
                        const request1 = axios.put(process.env.REACT_APP_API_BASE_URL + '/api/v1/initiator-invite', {
                            "initiator_contract_address": selectedCard.contract,
                            "initiator_account_address": account,
                            "initiator_token_id": String(selectedCard.tokenId),
                            "initiator_image": selectedCard.image,
                            "invitee_contract_address": invitationNftData.contract,
                            "invitee_account_address": invitationAccount,
                            "invitee_token_id": String(invitationNftData.tokenId),
                            "invitee_image": invitationNftData.image,
                            "used": 1
                        });

                        const request2 = axios.get(process.env.REACT_APP_API_BASE_URL + '/api/v1/fusion-index?initiator_contract_address=' + invitationNftData.contract + '&initiator_token_id=' + invitationNftData.tokenId);

                        const [response, response_fusion_index] = await Promise.all([request1, request2]);

                        console.log("fetchInvitationLink response.data", response.data);
                        console.log("fetchInvitationLink response.data", response_fusion_index.data);

                        await connectMetaMask(selectedCard.contract, Number(selectedCard.tokenId), account, response_fusion_index.data.data.fusion_index);
                    } catch (error) {
                        console.error('Error sending request:', error);
                    }

                }
            }
        } catch (error) {
            console.error('Mint 错误:', error);
        }
    };

    const handleSelectNFT = async () => {
        try {
            // 在这里发送请求，例如：
            if (!account) {
                alert("Please connect wallet first!")
                navigate('/', {state: {invitationNftData, invitationAccount}})
            } else {
                // const response = await axios.get('http://127.0.0.1:58088/api/'+account+'/getNft');
                navigate('/select', {state: {invitationNftData, invitationAccount}});
            }

        } catch (error) {
            console.error('Error sending request:', error);
        }
    };
    return (
        <div>
            <h1>Mint</h1>
            <p>This is the Mint page.</p>
            <Row
                align="middle"
                justify="center"
                style={{
                    gap: 'calc(100%/10)',
                    paddingTop: 'calc(100%/20)',
                    paddingBottom: 'calc(100%/20)',
                }}
            >
                <Col xs={24} md={3}>
                    {/*<img src={rectangleImage1} alt="Rectangle 1" style={{ width: '100%', height: 'auto' }} />*/}
                    <Image
                        src={invitationNftData ? invitationNftData.image.replace('ipfs://', 'https://ipfs.io/ipfs/') : selectedCard ? selectedCard.image.replace('ipfs://', 'https://ipfs.io/ipfs/') : rectangleImage1}
                        alt="Rectangle 1"
                        style={{width: '100%', height: 'auto'}}/>
                </Col>
                <Col xs={24} md={2}>
                    <Image
                        src={circleImage}
                        alt="Circle"
                        style={{width: '100%', height: 'auto', borderRadius: '50%'}}
                    />
                </Col>
                <Col xs={24} md={3}>
                    <Image
                        src={invitationNftData ? (selectedCard ? selectedCard.image.replace('ipfs://', 'https://ipfs.io/ipfs/') : rectangleImage2) : (rectangleImage2)}
                        alt="Rectangle 2" style={{width: '100%', height: 'auto'}}/>
                </Col>
            </Row>
            <div style={{textAlign: 'center', marginTop: '-3%'}}>
                <Title level={4}>Stock: {salesInfo?.sold}/ {salesInfo?.collection_size}</Title>
                <Text>Price: {salesInfo?divideByTenToEighteen(Number(salesInfo.price)):""}</Text>
            </div>
            <div style={{textAlign: 'center', marginTop: 10, marginBottom: '10%'}}>
                {invitationNftData && selectedCard ? (
                    <Button type="primary" onClick={handleMint}>
                        mint
                    </Button>
                ) : (
                    invitationLink ? (
                        <>
                            <label>Invitation link: </label>
                            <Mentions readOnly value={invitationLink} placeholder="邀请链接将在这里显示" style={{width: '20%'}}/>
                            <Button
                                type="primary"
                                style={{marginTop: 8}}
                                onClick={() => {
                                    navigator.clipboard.writeText(invitationLink || '');
                                    message.success('邀请链接已复制到剪贴板');
                                }}
                            >
                                复制邀请链接
                            </Button>
                        </>
                    ) : (
                        <Button type="primary" onClick={handleSelectNFT}>
                            Select Your NFT
                        </Button>
                    ))}
            </div>
        </div>
    );
};

export default Mint;
