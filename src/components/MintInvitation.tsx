import React, {useEffect, useState} from 'react';
import {Row, Col, Button, List} from 'antd';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';

interface SalesInfo {
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
    link: string;
    contractName: string;
    tokenId: string;
}

const ListItem: React.FC<ListItemProps> = ({tokenImage, link, contractName, tokenId}) => {
    return (
        <List.Item>
            <Link to={link} style={{
                display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
            }}>
                <div>
                    <img src={tokenImage} style={{
                        width: '100%',
                    }}/>
                </div>
                <div style={{ marginTop: '20%', fontSize: '20px',marginLeft:"10px" }}>{contractName} #{tokenId}
                </div>
            </Link>
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
            marginTop: '8%',
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
                <Col xs={40} md={4}>
                    <div style={{
                        fontSize: '200%',
                        color: '#913E21',
                    }}>
                        <h1>
                            Phase 1: Free Mint
                        </h1>


                    </div>
                    <div style={{
                        marginTop: '20%',
                        alignItems: 'initial',
                        fontSize: '160%',
                        color: '#913E21',
                    }}>
                        <p>
                            Available: {salesInfo?.sold}/{salesInfo?.collection_size}
                        </p>
                    </div>
                    <div style={{
                        marginTop: '10%',
                        fontSize: '160%',
                        color: '#913E21',
                    }}>
                        <p>
                            Price: FREE
                        </p>
                    </div>
                    <div style={{
                        marginTop: '25%',
                        fontSize: '160%',
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
                <Col xs={40} md={4}>

                    <List

                        pagination={{
                            position: 'bottom',
                            pageSize: 3,
                            align: 'center'
                        }}
                        dataSource={allInvitationLinks}
                        bordered={true}

                        renderItem={(item, index) => (
                            // <List.Item style={{
                            //     border: '1px solid #913E21',
                            //     margin: '3%',
                            //     width: '100%',
                            // }}>
                            //     {/*<div style={{*/}
                            //     {/*    display: 'flex',*/}
                            //     {/*    flexDirection: 'column',*/}
                            //     {/*    alignItems: 'center',*/}
                            //     {/*    justifyContent: 'center',*/}
                            //     {/*    width: '50%',*/}
                            //     {/*}}>*/}
                            //     {/*    <img src={item.initiator_image} style={{*/}
                            //     {/*        width: '100%',*/}
                            //     {/*    }}/>*/}
                            //     {/*</div>*/}
                            //     {/*<div style={{}}>*/}
                            //     {/*    {item.contract_name} #{item.initiator_token_id}*/}
                            //     {/*</div>*/}
                            // </List.Item>
                            <ListItem tokenId={item.initiator_token_id} link={item.initiator_image}
                                      contractName={item.contract_name} tokenImage={item.initiator_image}/>
                        )}
                    />
                </Col>
            </Row>

        </div>
    );
};

export default MintInvitation;
