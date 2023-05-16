import React, {useEffect, useState} from 'react';
import {Row, Col, Button, List} from 'antd';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {NFTData} from "./SelectNFT";

interface SalesInfo {
    contract_address: string;
    collection_size: string;
    end_timestamp: string;
    price: string;
    sale_phase: string;
    sold: string;
    start_timestamp: string;
}


interface MintInvitationProps {
    allInvitationLinks: NFTData[]; // 根据实际数据类型更改为适当的类型
}

const MintInvitation: React.FC<MintInvitationProps> = ({allInvitationLinks}) => {
    // const {account} = useAccountContext();
    const navigate = useNavigate();

    const [salesInfo, setSalesInfo] = useState<SalesInfo | undefined>(undefined);


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
        <div>
            <Row
                align="middle"
                justify="center"
                style={{
                    gap: 'calc(100%/10)',
                    paddingTop: 'calc(100%/20)',
                    paddingBottom: 'calc(100%/20)',
                }}
            >
                <Col xs={60} md={1}>
                    <div>
                        <h2>
                            Phase 1: Free Mint
                        </h2>


                    </div>
                    <div>
                        <p>
                            Available: {salesInfo?.sold}/{salesInfo?.collection_size}
                        </p>
                    </div>
                    <div>
                        <p>
                            Price: FREE
                        </p>
                    </div>
                    <div>
                        <Button type="primary" onClick={() => navigate('/mint', {
                            state: {
                                startNewOne: true,
                            }
                        })}>
                            Start a new one
                        </Button>
                    </div>
                </Col>
                <Col xs={60} md={6}>
                    <List
                        itemLayout="vertical"
                        size="large"
                        pagination={{
                            onChange: (page) => {
                                console.log(page);
                            },
                            pageSize: 3,
                        }}
                        dataSource={allInvitationLinks}
                        renderItem={(item) => (
                            <List.Item
                                key={item.name}
                                extra={
                                    <img
                                        width={272}
                                        alt="logo"
                                        src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                                    />
                                }
                            >
                                <List.Item.Meta
                                    title={<a href={item.image}>{item.name}</a>}
                                />
                                Status: {item.used === 1 ? 'Matched' : (item.used === 2 ? 'Minted' : 'Waiting')}
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>

        </div>
    );
};

export default MintInvitation;
