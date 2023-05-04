// src/components/Mint.tsx
import React, {useEffect, useState} from 'react';
import {Row, Col, Typography, Button, Image, Mentions, message} from 'antd';
import {Link, useLocation} from 'react-router-dom';
import rectangleImage1 from '../assets/mint1.png';
import rectangleImage2 from '../assets/mint2.png';
import circleImage from '../assets/mint3.png';
import {useAccountContext} from "../contexts/AccountContext";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {NFTData} from "./SelectNFT";
import {ethers} from "ethers";



const {Title, Text} = Typography;

const Mint: React.FC = () => {
    const {account} = useAccountContext();
    const navigate = useNavigate();
    const location = useLocation();
    const selectedCard = location.state?.selectedCard as NFTData | undefined;
    const invitationAccount = location.state?.invitationAccount as string | undefined;
    const invitationNftData = location.state?.invitationNftData as NFTData | undefined;
    console.log("invitationAccount", invitationAccount)
    console.log("invitationNftData", invitationNftData)
    console.log("selectedCard", selectedCard)

    const [invitationLink, setInvitationLink] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchInvitationLink = async () => {
            if (account && selectedCard) {
                try {
                    const response = await axios.post(process.env.REACT_APP_API_BASE_URL + '/api/invitation', {
                        account,
                        nft: selectedCard,
                    });
                    console.log("mint useEffect response.data", response.data)
                    console.log("mint useEffect response.data.invitation", response.data.invitation)
                    setInvitationLink(response.data.data.invitation);
                } catch (error) {
                    console.error('Error sending request:', error);
                }
            }
        };

        fetchInvitationLink();
    }, [account, selectedCard]);
    useEffect(() => {
        console.log('invitationLink', invitationLink);
    }, [invitationLink]);
    const handleMint = async () => {
        //todo 链接链上，发送mint请求
        navigate("/nft", {state: {selectedCard, invitationAccount, invitationNftData}})
    }

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
                <Title level={4}>Stock: 1/30</Title>
                <Text>Price: Free</Text>
            </div>
            <div style={{textAlign: 'center', marginTop: 10, marginBottom: '10%'}}>
                {invitationNftData && selectedCard ? (
                    <Button type="primary" onClick={handleMint}>
                        mint
                    </Button>
                ):(
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
