import React, {useEffect, useState} from 'react';
import {Row, Col, Typography, Button, Image, Mentions, message, Popover} from 'antd';
import {useAccountContext} from '../contexts/AccountContext';
import {useNavigate, useLocation} from 'react-router-dom';
import axios from 'axios';
import SelectNFT, {NFTData} from './SelectNFT';

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
    width: window.innerWidth * 0.5 + 'px',
    height: window.innerHeight * 0.5 + 'px',
    background: '#F0DED0',
    overflow: 'auto',
};

const popoverWrapperStyle: React.CSSProperties  = {
    position: 'relative',
    width: '100%',
    height: '100%',
};

const popoverStyle: React.CSSProperties  = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
};

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

    const [invitationLink, setInvitationLink] = useState<string | undefined>(undefined);
    const [salesInfo, setSalesInfo] = useState<SalesInfo | undefined>(undefined);

    const [popoverVisible, setPopoverVisible] = useState(false);

    useEffect(() => {
        const fetchInvitationLink = async () => {
            if (account && selectedCard) {
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
        fetchSalesInfoData();
        const intervalId = setInterval(() => {
            fetchSalesInfoData();
        }, Number(process.env.REACT_APP_API_SALES_INFO_TIME));

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const handlePopoverClick = () => {
        setPopoverVisible(!popoverVisible);
    };

    const handleSelectButtonClick = async () => {
        if (selectedCard) {
            navigate('/mint', {state: {selectedCard, invitationAccount, invitationNftData}});
        } else {
            alert('请先选择一个卡片！');
        }
        setPopoverVisible(false);
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
                <Col xs={24} md={2}>
                    <div>
                        <h2>
                            Phase 1: Free Mint
                        </h2>
                        <p></p>
                        <p></p>
                        <p>
                            Available: {salesInfo?.sold}/{salesInfo?.collection_size}
                        </p>
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
                                    : 'https://via.placeholder.com/150'
                        }
                        alt="Rectangle 1"
                        style={{width: '100%', height: 'auto'}}
                    />
                </Col>

                <Col xs={24} md={3}>
                    <Image
                        src={
                            invitationNftData
                                ? selectedCard
                                    ? selectedCard.image.replace('ipfs://', 'https://ipfs.io/ipfs/')
                                    : 'https://via.placeholder.com/150'
                                : 'https://via.placeholder.com/150'
                        }
                        alt="Rectangle 2"
                        style={{width: '100%', height: 'auto'}}
                    />
                </Col>
            </Row>
            <div style={{textAlign: 'center', marginTop: '-3%'}}>
                <Title level={4}>
                    Stock: {salesInfo?.sold}/ {salesInfo?.collection_size}
                </Title>
                <Text>Price: {salesInfo ? divideByTenToEighteen(Number(salesInfo.price)) : ''}</Text>
            </div>
            <div style={{textAlign: 'center', marginTop: 10, marginBottom: '10%'}}>
                {invitationNftData && selectedCard ? (
                    <Button type="primary" onClick={handleSelectButtonClick}>
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
                        <div style={popoverWrapperStyle}>


                            <Popover
                                content={

                                    <div style={popoverContentStyle}>
                                        <SelectNFT onSelect={handleSelectButtonClick}/>
                                    </div>
                                }
                                title="选择一个 NFT"
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
    );
};

export default Mint;
