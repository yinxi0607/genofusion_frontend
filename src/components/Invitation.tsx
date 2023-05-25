// src/components/Invitation.tsx

import React, {useState, useEffect} from 'react';
import {Row, Col, Image, Button, Result, Spin} from 'antd';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import {InvitationAccount, NFTData} from './SelectNFT';
import rectangleImage1 from '../assets/mint1.png';
import {divideByTenToEighteen, SalesInfo} from "./Mint";


const Invitation: React.FC = () => {
    const params = useParams();
    const code = params.code;
    const location = useLocation();
    const navigate = useNavigate();
    const invitationLink = location.pathname;
    const [salesInfo, setSalesInfo] = useState<SalesInfo | undefined>(undefined);

    const [pageShow, setPageShow] = useState<boolean>(false);
    const [invitationNftData, setNftData] = useState<NFTData | undefined>(undefined);
    const [invitationAccount, setInvitationAccount] = useState<InvitationAccount | undefined>(undefined);
    const handleStartMinting = () => {
        const startNewOne = true
        navigate('/mint', {state: {invitationNftData, invitationAccount, startNewOne}});
    };
    const handleHome=() =>{
        navigate('/');
    }

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
        const fetchNftData = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_API_BASE_URL + `/api/v1/initiator-invite/${code}`);
                console.log("fetchNftData response.data", response.data)
                if (response.data.code===200){
                    let nft: NFTData = {
                        contract: response.data.data.initiator_contract_address,
                        tokenId: response.data.data.initiator_token_id,
                        image: response.data.data.initiator_image,
                        name: response.data.data.initiator_contract_name,
                        used: 0
                    }
                    setNftData(nft);
                    setInvitationAccount(response.data.data.initiator_account_address);
                }

            } catch (error) {
                console.error('Error sending request:', error);
            }
            setPageShow(true)
        };

        fetchNftData();
    }, [invitationLink]);

    return (
        <div>
            {pageShow?(
                <div style={{
                    marginTop: '9vh',
                }}>
                    {/*<h1>Invitation</h1>*/}
                    {/*<p>This is the Invitation page.</p>*/}
                    {invitationNftData? (
                        <Row
                            align="middle"
                            justify="center"
                            style={{
                                gap: 'calc(100%/10)',
                                paddingTop: 'calc(100%/20)',
                                paddingBottom: 'calc(100%/20)',
                            }}
                        >
                            <Col xs={24} md={6}>
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
                                        Price: {salesInfo ? salesInfo.price === "0" ? "free" : divideByTenToEighteen(Number(salesInfo.price)) : ''}
                                    </p>
                                </div>
                            </Col>
                            <Col xs={24} md={6}>
                                <Image
                                    src={invitationNftData ? invitationNftData.image.replace('ipfs://', 'https://ipfs.io/ipfs/') : rectangleImage1}
                                    alt="Rectangle 1"
                                    style={{width: '15vw', height: 'auto'}}
                                />
                                {invitationNftData?.used === 1 ?(
                                    <div>
                                        <div style={{
                                            marginTop: '-3%',
                                        }}>
                                            {invitationNftData ?
                                                <div>
                                                    <p>{invitationNftData.name} #{invitationNftData.tokenId.toString().padEnd(5, "0")} Invites
                                                        you to join this minting, </p>
                                                    <p>Select your NFT to join</p>
                                                </div>
                                                :
                                                <p>Invitation link is invalid</p>}
                                        </div>
                                        <div style={{
                                            marginTop: '2vh',
                                            marginBottom: '2vh',
                                        }}>
                                            <Button type="primary" onClick={handleStartMinting}>
                                                Select NFT
                                            </Button>
                                        </div>

                                    </div>
                                ):(
                                    <div>
                                        <div style={{
                                            marginTop: '-3%',
                                        }}>
                                            {invitationNftData ?<div>
                                                    <p>{invitationNftData.name} #{invitationNftData.tokenId?.toString().padEnd(5, "0")} has been matched.</p>
                                                    <p>Start your own mint match invitation!</p>
                                                </div>
                                                :
                                                <p>Invitation link is invalid</p>}
                                        </div>
                                        <div style={{
                                            marginTop: '2%',
                                            marginBottom: '15%',
                                        }}>
                                            <Button type="primary" onClick={handleStartMinting}>
                                                Start Now
                                            </Button>
                                        </div>

                                    </div>
                                )}


                            </Col>
                        </Row>
                    ):(
                        <div>
                            <Result
                                status="error"
                                title="There are some problems with your operation."
                                extra={
                                    <Button type="primary" key="console" onClick={handleHome}>
                                        Home
                                    </Button>
                                }
                            />
                        </div>
                    )}


                </div>
            ):(

                <Spin tip="Loading" size="large">
                    <div className="content" />
                </Spin>
            )}


        </div>

    );
};

export default Invitation;
