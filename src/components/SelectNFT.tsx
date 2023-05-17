import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'antd';
import { useAccountContext } from '../contexts/AccountContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {CloseOutlined} from "@ant-design/icons";

export interface NFTData {
    contract: string;
    tokenId: string;
    image: string;
    name: string;
    used: number;
}

interface SelectNFTProps {
    onSelect: () => void;
}

const cardImageStyle = {
    width: '10vw',
    height: '13vw',
    display: 'block',
    // margin: '0 auto',
};

const cardMetaStyle = {
    display: 'flex',
    alignItems: 'center',
    fontSize: '20px',
    color: 'red',
};

const cardStyle = {
    backgroundColor: 'transparent',
    width: '10vw',
    minWidth: '1vw',
    height: '16vw',
    marginLeft: '20%',
};

const closeIconStyle = {
    display: 'right',
    justifyContent: 'flex-end',
    top: '10px',
    right: '10px',
    fontSize: '30px',
    color: '#913E21',
    cursor: 'pointer'
};

const cardTitleStyle = {
    // marginLeft: '-80%',
    fontSize: '1vw',
    // backgroundColor: 'rgba(255, 255, 255, 0.7)',
    // color: 'black',
    // padding: '2px 5px',
    marginTop: '2vw',
    marginLeft: '2vw'
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
                // console.log("SelectNft account",account)
                const data = await fetchNFTData(account);
                if (data.code === 200) {
                    console.log("fetchNFTData data.data", data.data)
                    setNftData(data.data);

                }
            } catch (error) {
                console.error('Error fetching NFT data:', error);
            }
        };
        console.log("fetchNFTData")
        if (account||invitationAccount) {
            fetchData();
        }
    }, [account, invitationAccount]);

    const handleCardClick = (nft: NFTData) => {
        console.log('nft', nft)
        setSelectedCard(nft);
    };

    const handleSelectButtonClick = async () => {
        // console.log('selectedCard', selectedCard)
        if (selectedCard) {
            const startNewOne = true
            navigate('/mint', { state: { selectedCard, invitationAccount, invitationNftData,startNewOne } });
            onSelect(); // 调用 onSelect 属性
        } else {
            console.log('selectedCard else', selectedCard)
            alert('请先选择一个卡片！');
        }
    };

    const handleCloseClick = async () => {
        const startNewOne = true
        const closeClick = true
        navigate('/mint', { state: { selectedCard, invitationAccount, invitationNftData,startNewOne,closeClick } });
        onSelect(); // 调用 onSelect 属性
    };

    return (
        <div>
            <CloseOutlined style={closeIconStyle} onClick={handleCloseClick}/>
            {/*<h1>Phrase I: Free Mint</h1>*/}
            {Object.keys(nftData).map((group) => (
                <div key={group}>

                    <h2 style={cardTitleStyle}>{group}</h2>
                    <Row gutter={[16, 16]}>
                        {nftData[group].map((nft, index) => (

                            <Col key={nft.tokenId} xs={48} sm={6} md={2} lg={5} xl={5}>

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
                                    <Card.Meta title={"#"+nft.tokenId} style={cardMetaStyle} />
                                </Card>
                            </Col>
                        ))}
                        {/*<Col xs={0} sm={0} md={0} lg={4} xl={4}></Col>*/}
                        {/*<Col xs={0} sm={0} md={0} lg={4} xl={4}></Col>*/}
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
