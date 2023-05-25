import React, {useEffect, useState} from 'react';
import {Row, Col, Button, List, Card, Space} from 'antd';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import mint1 from '../assets/mint1.png';
import {divideByTenToEighteen} from "./Mint";
import {NFTData} from "./SelectNFT";

export interface SalesInfo {
    contract_address: string;
    collection_size: string;
    end_timestamp: string;
    price: string;
    sale_phase: string;
    sold: string;
    start_timestamp: string;
}

export interface MintInvitationInterface {
    "invite_link": string,
    "used": number,
    "initiator_contract_address": string,
    "initiator_account_address": string,
    "initiator_token_id": string,
    "initiator_image": string,
    "initiator_contract_name": string
}


export interface MintInvitationProps {
    allInvitationLinks: MintInvitationInterface[]; // 根据实际数据类型更改为适当的类型
}

interface ListItemProps {
    tokenImage: string;
    code: string;
    contractName: string;
    tokenId: string;
    contractAddress: string;
    used: number
}

const imageStyle = {
    width: '10vw',
    height: '18vh'
}

const ListItem: React.FC<ListItemProps> = ({tokenImage, code, contractName, tokenId, contractAddress, used}) => {
    const [imageError, setImageError] = useState(false);
    const navigate = useNavigate();
    const handleImageError = () => {
        setImageError(true);
    };
    const handlerLinkClick = async () => {
        console.log('handlerLinkClick,used:', used);
        const startNewOne = true
        if (used === 0) {
            let selectedCard = {
                contract: contractAddress,
                tokenId: tokenId,
                image: tokenImage,
                name: contractName,
                used: 0
            }
            const invitationLinkCode = process.env.REACT_APP_API_FRONTEND_URL + `/invite/${code}`
            navigate('/mint', {state: {selectedCard, invitationLinkCode, startNewOne}});
        } else if (used === 2) {
            alert("The invitation link has already been used, please use another one")
            return
        } else if (used === 1) {
            const response = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/api/v1/initiator-invite/${code}`
            );
            console.log("initiator-invite response.data", response.data)
            if (response.data.code === 200) {
                const responseData = response.data.data
                let selectedCard = {
                    contract: responseData.initiator_contract_address,
                    tokenId: responseData.initiator_token_id,
                    image: responseData.initiator_image,
                    name: responseData.initiator_contract_name,
                    used: 1
                }
                let invitationNftData = {
                    contract: responseData.invitee_contract_address,
                    tokenId: responseData.invitee_token_id,
                    image: responseData.invitee_image,
                    name: responseData.invitee_contract_name,
                    used: 1
                }
                const invitationAccount = responseData.invitee_account_address
                console.log("get initiator invite response.data.data", response.data.data)
                navigate('/mint', {state: {invitationNftData,selectedCard,invitationAccount, startNewOne}});
            } else {
                alert("error")
                return;
            }
        } else {
            alert("error")
            return;
        }
    }
    return (
        <List.Item>
            {/*{used === 1 ? (<div style={{color: 'red'}}>已使用</div>) : (<div style={{color: 'green'}}>未使用</div>)}*/}
            <a onClick={handlerLinkClick} style={{
                display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',pointerEvents:used===2?"none":"auto"
            }}>
                <div>
                    {imageError ? (<img src={mint1} alt={"token"} style={imageStyle}/>) : (
                        <img src={tokenImage.replace('ipfs://', 'https://ipfs.io/ipfs/')} style={imageStyle} alt={"token"} onError={handleImageError}/>)}
                </div>
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center',marginLeft:'2vw'
                }}>
                    <div style={{marginTop: '10%', fontSize: '1.2vw', marginLeft: "10px"}}>{contractName} #{tokenId.toString().padStart(5,'0')}</div>
                    <div style={{marginTop: '10%', fontSize: '1.2vw', marginLeft: "10px", display:"flex"}}>
                        <div style={{padding:'0.5vw'}}>Status:</div>
                        <div style={{padding:'0.5vw',marginLeft:'1vw',borderRadius:'5px',background:used === 1 ? 'rgba(11, 142, 0, 0.3)' : used === 2 ? 'rgba(174, 136, 123, 0.5)' : 'rgba(85, 85, 85, 0.3)'}}> {used===1?("Matched"):(used===2? "Minted":"Waiting")}</div>
                    </div>

                </div>

            </a>
        </List.Item>

    );
};

const MintInvitation: React.FC<MintInvitationProps> = ({allInvitationLinks}) => {
    // const {account} = useAccountContext();
    const navigate = useNavigate();

    const [salesInfo, setSalesInfo] = useState<SalesInfo | undefined>(undefined);

    console.log('allInvitationLinks', allInvitationLinks)
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


    return (
        <div style={{
            marginTop: '5vh',
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
                <Col xs={24} md={6}>
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
                            Price: {salesInfo ? salesInfo.price.toString()==="0"?"Free":divideByTenToEighteen(Number(salesInfo.price)) : ''}
                        </p>
                    </div>
                    <div style={{
                        marginTop: '25%',
                        fontSize: '0.9vw',
                        color: '#913E21',
                    }}>
                        <Button type="primary" onClick={() => navigate('/mint', {
                            state: {
                                startNewOne: true,
                            }
                        })}>
                            Start a new one
                        </Button>
                    </div>
                </Col>
                <Col xs={24} md={10}>
                    <Space direction="vertical" size="middle" style={{width: '100%'}}>
                    <List

                        pagination={{
                            position: 'bottom',
                            pageSize: 3,
                            align: 'center'
                        }}
                        dataSource={allInvitationLinks}
                        bordered={true}

                        renderItem={(item, index) => (
                            <ListItem
                                tokenId={item.initiator_token_id}
                                code={item.invite_link}
                                contractName={item.initiator_contract_name}
                                tokenImage={item.initiator_image}
                                contractAddress={item.initiator_contract_address}
                                used={item.used}
                            />
                        )}
                    />
                    </Space>
                </Col>
            </Row>

        </div>
    );
};

export default MintInvitation;
