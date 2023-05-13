// src/components/SelectNFT.tsx
import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Row} from 'antd';
import {useAccountContext} from '../contexts/AccountContext';
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";

const cardImageStyle = {
    width: '100%', // 设置图片宽度为容器宽度的五分之一
    display: 'block', // 图片居中
    margin: '0 auto',
};
const cardStyle = {
    backgroundColor: 'transparent', // 设置 Card 背景为透明
    width: '50%', // 设置 Card 宽度为图片宽度的 108%
    // width: '108%', // 设置 Card 宽度为图片宽度的 108%
    marginLeft: '20%', // 居中 Card
};

const cardTitleStyle = {
    // position: 'absolute',
    marginLeft: '-80%',
    top: 0,
    left: 0,
    fontSize: '200%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: '2px 5px',
};

export interface NFTData {
    contract: string;
    tokenId: string;
    image: string;
    name: string;
}

export interface InitiatorInvitee {
    initiator_contract_address: string;
    initiator_account_address: string;
    initiator_token_id: number;
    initiator_image: string;
    invitee_contract_address: string;
    invitee_account_address: string;
    invitee_token_id: number;
    invitee_image: string;
}


export interface InvitationAccount {
    account: string
}

interface NFTGroup {
    [key: string]: NFTData[];
}

const fetchNFTData = async (account: string) => {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/v1/nft/${account}`);
    const data = await response.json();
    return data;
};

const SelectNFT: React.FC = () => {
    const [nftData, setNftData] = useState<NFTGroup>({});
    const {account} = useAccountContext();
    const [selectedCard, setSelectedCard] = useState<NFTData | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const invitationAccount = location.state?.invitationAccount as InvitationAccount | undefined;
    const invitationNftData = location.state?.invitationNftData as NFTData | undefined;
    console.log('select account', account)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchNFTData(account);
                if (data.code === 200) {
                    setNftData(data.data);
                }
            } catch (error) {
                console.error('Error fetching NFT data:', error);
            }
        };

        if (account) {
            fetchData();
        }
    }, [account]);
    const handleCardClick = (nft: NFTData) => {
        setSelectedCard(nft);
    };

    const handleSelectButtonClick = async () => {
        if (selectedCard) {
            console.log("SelectNFT selectedCard",selectedCard)
            navigate('/mint', {state: {selectedCard, invitationAccount, invitationNftData}});
            // ... 发送 POST 请求以获取邀请链接
        } else {
            alert('请先选择一个卡片！');
        }
    };

    return (
        <div>
            <h1>Phrase I: Free Mint</h1>
            {Object.keys(nftData).map((group) => (
                <div key={group}>
                    <h2 style={cardTitleStyle}>{group}</h2>
                    <Row gutter={[32, 32]}>
                        {nftData[group].map((nft, index) => (
                            <Col key={nft.tokenId} xs={24} sm={12} md={8} lg={4} xl={4}>
                                <Card
                                    hoverable
                                    onClick={() => handleCardClick(nft)}
                                    cover={
                                        <img alt={nft.name}
                                             src={nft.image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                                             style={cardImageStyle}/>}
                                    style={{
                                        ...cardStyle,
                                        border:
                                            selectedCard?.contract === nft.contract && selectedCard?.tokenId === nft.tokenId
                                                ? '2px solid blue'
                                                : 'none',
                                    }}>
                                    <Card.Meta title={nft.name}/>
                                </Card>
                            </Col>
                        ))}
                        <Col xs={0} sm={0} md={0} lg={4} xl={4}></Col>
                        <Col xs={0} sm={0} md={0} lg={4} xl={4}></Col>
                    </Row>
                </div>
            ))}
            <div style={{textAlign: 'center', marginTop: 20, marginBottom: '5%', width: "10%", marginLeft: "45%"}}>
                <Button type="primary" onClick={handleSelectButtonClick} size="large" block>
                    Select
                </Button>
            </div>
        </div>
    );
};

export default SelectNFT;
