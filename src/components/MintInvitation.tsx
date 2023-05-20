import React, {useEffect, useState} from 'react';
import {Row, Col, Button, List} from 'antd';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import mint1 from '../assets/mint1.png';
import {divideByTenToEighteen} from "./Mint";

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
    "contract_name": string
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
    height: '13vh'
}

const ListItem: React.FC<ListItemProps> = ({tokenImage, code, contractName, tokenId, contractAddress, used}) => {
    const [imageError, setImageError] = useState(false);
    const navigate = useNavigate();
    const handleImageError = () => {
        setImageError(true);
    };
    const handlerLinkClick = () => {
        // console.log('handlerLinkClick');
        if (used===0){
            navigate('/mint', {state: {code, contractName, tokenId, tokenImage, contractAddress}});
        }
        if (used===2){
            alert("The invitation link has already been used, please use another one")
            return
        }else if (used===1){
            navigate('/matched', {state: {code, contractName, tokenId, tokenImage, contractAddress}});
        }else{
            alert("error")
            return;
        }
    }
    return (
        <List.Item>
            {/*{used === 1 ? (<div style={{color: 'red'}}>已使用</div>) : (<div style={{color: 'green'}}>未使用</div>)}*/}
            <div onClick={handlerLinkClick} style={{
                display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
            }}>
                <div>
                    {imageError ? (<img src={mint1} alt={"token"} style={imageStyle}/>) : (
                        <img src={tokenImage} style={imageStyle} alt={"token"} onError={handleImageError}/>)}
                </div>
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center',marginLeft:'2vw'
                }}>
                    <div style={{marginTop: '10%', fontSize: '1.2vw', marginLeft: "10px"}}>{contractName} #{tokenId}</div>
                    <div style={{marginTop: '10%', fontSize: '1.2vw', marginLeft: "10px"}}>Status: {used===1?("Matched"):("Minted")}</div>
                </div>

            </div>
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
                            Price: {salesInfo ? salesInfo.price==="0"?"free":divideByTenToEighteen(Number(salesInfo.price)) : ''}
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
                <Col xs={24} md={6}>

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
                                contractName={item.contract_name}
                                tokenImage={item.initiator_image}
                                contractAddress={item.initiator_contract_address}
                                used={item.used}
                            />
                        )}
                    />
                </Col>
            </Row>

        </div>
    );
};

export default MintInvitation;
