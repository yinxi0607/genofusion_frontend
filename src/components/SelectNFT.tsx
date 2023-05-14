import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'antd';
import { useAccountContext } from '../contexts/AccountContext';
import { useNavigate, useLocation } from 'react-router-dom';

export interface NFTData {
    contract: string;
    tokenId: string;
    image: string;
    name: string;
}

interface SelectNFTProps {
    onSelect: () => void;
}

const cardImageStyle = {
    width: '100%',
    display: 'block',
    margin: '0 auto',
};

const cardStyle = {
    backgroundColor: 'transparent',
    width: '50%',
    marginLeft: '20%',
};

const cardTitleStyle = {
    marginLeft: '-80%',
    top: 0,
    left: 0,
    fontSize: '200%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: '2px 5px',
};

const fetchNFTData = async (account: string) => {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/v1/nft/${account}`);
    const data = await response.json();
    return data;
};

export interface InvitationAccount {
    account: string
}

const SelectNFT: React.FC<SelectNFTProps> = ({ onSelect }) => {
    const [nftData, setNftData] = useState<{ [key: string]: NFTData[] }>({});
    const { account } = useAccountContext();
    const navigate = useNavigate();
    const location = useLocation();
    const invitationAccount = location.state?.invitationAccount as string | undefined;
    const invitationNftData = location.state?.invitationNftData as NFTData | undefined;
    const [selectedCard, setSelectedCard] = useState<NFTData | undefined>(undefined);

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
            navigate('/mint', { state: { selectedCard, invitationAccount, invitationNftData } });
            onSelect(); // 调用 onSelect 属性
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
                                        <img
                                            alt={nft.name}
                                            src={nft.image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                                            style={cardImageStyle}
                                        />
                                    }
                                    style={{
                                        ...cardStyle,
                                        border:
                                            selectedCard?.contract === nft.contract && selectedCard?.tokenId === nft.tokenId
                                                ? '2px solid blue'
                                                : 'none',
                                    }}
                                >
                                    <Card.Meta title={nft.name} />
                                </Card>
                            </Col>
                        ))}
                        <Col xs={0} sm={0} md={0} lg={4} xl={4}></Col>
                        <Col xs={0} sm={0} md={0} lg={4} xl={4}></Col>
                    </Row>
                </div>
            ))}
            <div style={{ textAlign: 'center', marginTop: 20, marginBottom: '5%', width: '10%', marginLeft: '45%' }}>
                <Button type="primary" onClick={handleSelectButtonClick} size="large" block>
                    Select
                </Button>
            </div>
        </div>
    );
};

export default SelectNFT;
