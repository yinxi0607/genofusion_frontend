// src/components/Invitation.tsx

import React, {useState, useEffect} from 'react';
import {Row, Col, Image, Button} from 'antd';
import {useLocation, useNavigate} from 'react-router-dom';
import eggImage from "../assets/egg.jpg";


const NFT: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const tokenId = "#001";
    const handlerBackToHome = () => {
        navigate('/')
    }

    return (
        <div>
            <div style={{
                width: '50%',
                height: '50%',
                position: 'absolute',
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            }}>
                <h1>Congratulations!</h1>
                <div>
                    <Image src={eggImage} style={{
                        width: '20%',
                        height: '20%',
                        marginTop: '5%'
                    }}></Image>
                </div>
                <div style={{
                    marginTop: '5%'
                }}>
                    <p>
                        Genofusion {tokenId}
                    </p>
                    <p>
                        Your NFT has been successfully minted!
                    </p>

                    <Button type="primary" style={{
                        width: '20%',
                        marginBottom: '10%'
                    }} onClick={handlerBackToHome}>
                        Back Home
                    </Button>
                </div>
            </div>


        </div>
    );
};

export default NFT;
