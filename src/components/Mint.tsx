import React, {useEffect, useState} from 'react';
import {Row, Col, Typography, Button, Image, Mentions, message, Popover} from 'antd';
import {useAccountContext} from '../contexts/AccountContext';
import {useNavigate, useLocation} from 'react-router-dom';
import axios from 'axios';
import SelectNFT, {NFTData} from './SelectNFT';
import MintInvitation, {MintInvitationInterface} from "./MintInvitation";
import {connectMetaMask} from "../util";
import mint1 from '../assets/mint1.png';
import mint2 from '../assets/mint2.png';

interface SalesInfo {
    contract_address: string;
    collection_size: string;
    end_timestamp: string;
    price: string;
    sale_phase: string;
    sold: string;
    start_timestamp: string;
}


const popoverContentStyle = {
    // width: window.innerWidth * 0.6 + 'px',
    // height: window.innerHeight * 0.6 + 'px',
    width: '60vw',
    height: '60vh',
    background: '#F0DED0',
    overflow: 'auto',
};

const popoverWrapperStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
};

const popoverStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
};

export function divideByTenToEighteen(number: number): string {
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
    const startNewOne = location.state?.startNewOne as boolean | undefined;
    const closeClick = location.state?.closeClick as boolean | undefined;

    const [invitationLink, setInvitationLink] = useState<string | undefined>(undefined);
    const [salesInfo, setSalesInfo] = useState<SalesInfo | undefined>(undefined);
    const [showMintInvitation, setShowMintInvitation] = useState(false);
    const [allInvitationLink, setAllInvitationLink] = useState<MintInvitationInterface[]>([]);

    const [popoverVisible, setPopoverVisible] = useState(false);

    useEffect(() => {
        const fetchInvitationLink = async () => {
            console.log("closeClick:", closeClick)
            if (closeClick == undefined || closeClick == false) {
                if (account && selectedCard && !invitationAccount) {
                    try {
                        const response = await axios.post(process.env.REACT_APP_API_BASE_URL + '/api/v1/initiator-invite', {
                            "initiator_contract_address": selectedCard.contract,
                            "initiator_account_address": account,
                            "initiator_token_id": String(selectedCard.tokenId),
                            "initiator_image": selectedCard.image,
                        });
                        console.log("fetchInvitationLink response.data", response.data);
                        if (response.data.code === 200) {
                            setInvitationLink(response.data.data.inviteCode);
                        } else {
                            alert(response.data.message);
                        }
                    } catch (error) {
                        console.error('Error sending request:', error);
                    }
                }
            }
        };
        fetchInvitationLink();
    }, [selectedCard]);

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

    useEffect(() => {
        // 在此 useEffect 内部检查邀请链接并设置 showMintInvitation 的值
        const checkInvitationLinks = async () => {
            if (account) {
                try {
                    const response = await axios.get(
                        `${process.env.REACT_APP_API_BASE_URL}/api/v1/initiator-invite/account/${account}`
                    );
                    // console.log("checkInvitationLinks response.data", response.data)
                    if (response.data.code === 200 && response.data.data.length > 0) {
                        console.log("checkInvitationLinks response.data.data", response.data.data)
                        setShowMintInvitation(true);
                        setAllInvitationLink(response.data.data)
                    } else {
                        setShowMintInvitation(false);
                    }
                } catch (error) {
                    console.error('Error sending request:', error);
                }
            }
        };

        checkInvitationLinks();
    }, [account]);

    const handlePopoverClick = () => {
        // 检查用户是否连接了钱包
        if (!account) {
            alert("Please connect wallet first!")
            navigate('/', {state: {invitationNftData, invitationAccount, startNewOne}});
        }
        console.log("handlePopoverClick")
        setPopoverVisible(!popoverVisible);
    };

    // const handleSelectButtonClick = async () => {
    //     console.log("handleSelectButtonClick",selectedCard)
    //     if (selectedCard) {
    //         navigate('/mint', {state: {selectedCard, invitationAccount, invitationNftData}});
    //     } else {
    //         alert('Please Choose One Card！');
    //     }
    //     // setPopoverVisible(false);
    // };

    const handleSelectNFTButtonClick = async () => {
        console.log("handleSelectNFTButtonClick", selectedCard)
        setPopoverVisible(false);
    };

    const handleMint = async () => {
        try {
            // 检查用户是否连接了钱包
            if (!window.ethereum) {
                alert('请先连接钱包！');
                return;
            }
            if (selectedCard !== undefined) {

                if (invitationNftData) {
                    try {
                        const request1 = axios.put(process.env.REACT_APP_API_BASE_URL + '/api/v1/initiator-invite', {
                            "initiator_contract_address": invitationNftData.contract,
                            "initiator_account_address": invitationAccount,
                            "initiator_token_id": String(invitationNftData.tokenId),
                            "initiator_image": invitationNftData.image,
                            "invitee_contract_address": selectedCard.contract,
                            "invitee_account_address": account,
                            "invitee_token_id": String(selectedCard.tokenId),
                            "invitee_image": selectedCard.image,
                            "used": 1
                        });

                        const request2 = axios.get(process.env.REACT_APP_API_BASE_URL + '/api/v1/fusion-index?initiator_contract_address=' + invitationNftData.contract + '&initiator_token_id=' + invitationNftData.tokenId);

                        const [response, response_fusion_index] = await Promise.all([request1, request2]);
                        const expiretAt = Math.floor(Date.now() / 1000) + 600;
                        if (response.data.code === 200 && response_fusion_index.data.code === 200) {
                            console.log("fetchInvitationLink response.data", response.data);
                            console.log("fetchInvitationLink response.data", response_fusion_index.data);
                            const backendSignParams = {
                                "proposer_contract_address": selectedCard.contract,
                                "proposer_address": account,
                                "proposer_token_id": Number(selectedCard.tokenId),
                                "expire_at": expiretAt,
                                "fusion_index": response_fusion_index.data.data.fusion_index
                            }
                            console.log("backendSignParams", backendSignParams)
                            const contractSign = await axios.post(process.env.REACT_APP_API_BASE_URL + '/api/v1/sign', backendSignParams)
                            if (contractSign.data.code === 200) {
                                console.log("contractSign.data.data", contractSign.data.data)
                                await connectMetaMask(expiretAt, contractSign.data.data, selectedCard.contract, Number(selectedCard.tokenId), account, response_fusion_index.data.data.fusion_index);
                            }

                        } else {
                            alert("Network Error")
                        }
                    } catch (error) {
                        console.error('Error sending request:', error);
                    }

                }
            }
        } catch (error) {
            console.error('Mint 错误:', error);
        }
    };

    return (
        <div>
            {showMintInvitation && !startNewOne ? (
                <MintInvitation allInvitationLinks={allInvitationLink}/>
            ) : (
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
                        <Col xs={40} md={4}>
                            <div style={{
                                fontSize: '1vw',
                                color: '#913E21',
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
                                    Price: FREE
                                </p>
                            </div>
                        </Col>
                        <Col xs={24} md={3}>
                            <Image
                                src={
                                    invitationNftData
                                        ? invitationNftData.image.replace('ipfs://', 'https://ipfs.io/ipfs/')
                                        : selectedCard
                                            ? selectedCard.image.replace('ipfs://', 'https://ipfs.io/ipfs/')
                                            : mint1
                                }
                                alt="Rectangle 1"
                                style={{width: '15vw', height: 'auto'}}
                            />
                        </Col>

                        <Col xs={24} md={3}>
                            <Image
                                src={
                                    invitationNftData
                                        ? selectedCard
                                            ? selectedCard.image.replace('ipfs://', 'https://ipfs.io/ipfs/')
                                            : mint2
                                        : mint2
                                }
                                alt="Rectangle 2"
                                style={{width: '15vw', height: 'auto'}}
                            />
                        </Col>
                    </Row>
                    <div style={{textAlign: 'center', marginTop: '-3%'}}>
                        <Title level={4}>
                            Stock: {salesInfo?.sold}/ {salesInfo?.collection_size}
                        </Title>
                        <Text>Price: {salesInfo ? salesInfo.price=="0"?"free":divideByTenToEighteen(Number(salesInfo.price)) : ''}</Text>
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
                                    <Mentions readOnly value={invitationLink} placeholder="邀请链接将在这里显示"
                                              style={{width: '20%'}}/>
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
                                <div style={popoverWrapperStyle}>


                                    <Popover
                                        content={

                                            <div style={popoverContentStyle}>
                                                <SelectNFT onSelect={handleSelectNFTButtonClick}/>
                                            </div>
                                        }
                                        // title="选择一个 NFT"
                                        trigger="click"
                                        visible={popoverVisible}
                                        onVisibleChange={setPopoverVisible}
                                        // placement="top"
                                        transitionName=""
                                        overlayStyle={popoverStyle}
                                    >
                                        <Button type="primary" onClick={handlePopoverClick}>
                                            Select Your NFT
                                        </Button>
                                    </Popover>
                                </div>
                            ))}
                    </div>
                </div>
            )}

        </div>

    );
};

export default Mint;
