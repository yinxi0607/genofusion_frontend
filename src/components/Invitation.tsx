// src/components/Invitation.tsx

import React, { useState, useEffect } from 'react';
import {Row, Col, Image, Button} from 'antd';
import { useLocation,useNavigate } from 'react-router-dom';
import axios from 'axios';
import {InvitationAccount, NFTData} from './SelectNFT';
import rectangleImage1 from '../assets/mint1.png';
import circleImage from '../assets/mint3.png';
import rectangleImage2 from "../assets/mint2.png";


const Invitation: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const invitationLink = location.pathname;
    const [invitationNftData, setNftData] = useState<NFTData | undefined>(undefined);
    const [invitationAccount, setInvitationAccount] = useState<InvitationAccount | undefined>(undefined);
    const handleStartMinting = () => {
        navigate('/mint', { state: { invitationNftData, invitationAccount } });
    };

    useEffect(() => {
        const fetchNftData = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_API_BASE_URL+`/api${invitationLink}`);
                setNftData(response.data.data.nft);
                setInvitationAccount(response.data.data.account);
            } catch (error) {
                console.error('Error sending request:', error);
            }
        };

        fetchNftData();
    }, [invitationLink]);

    return (
        <div>
            <h1>Invitation</h1>
            <p>This is the Invitation page.</p>
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
                    <Image
                        src={invitationNftData ? invitationNftData.image.replace('ipfs://', 'https://ipfs.io/ipfs/') : rectangleImage1}
                        alt="Rectangle 1"
                        style={{ width: '100%', height: 'auto' }}
                    />
                </Col>
            </Row>
            <div style={{
                marginTop: '-3%',
            }}>
                    {invitationNftData ? <p>nftData.name Invites you to join this minting, Select your NFT to join</p>:<p>Invitation link is invalid</p>}
            </div>
            <div style={{
                marginTop: '2%',
                marginBottom: '15%',
            }}>
                <Button type="primary" onClick={handleStartMinting}>
                    start minting
                </Button>
            </div>
        </div>
    );
};

export default Invitation;
