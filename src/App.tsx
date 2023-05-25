// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import {Avatar, Layout, Menu} from 'antd';
import Home from './components/Home';
import Mint from './components/Mint';
import AccountContext from './contexts/AccountContext';
import logo from './assets/logo.png';
import './App.css';
import Invitation from "./components/Invitation";
import NFT from "./components/NFT";
import twitterImage from "./assets/twitter1.png";
import discordImage from "./assets/discord1.png";
import MintMinted from "./components/MintMinted";

const { Header, Content } = Layout;

const App: React.FC = () => {
    const [account, setAccount] = useState('');

    return (
        <Router>
            <Layout className="App" style={{backgroundColor: '#F0DED0'}}>
                <Header
                    className="header"
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#F0DED0'
                    }}
                >
                    <Link to="/" className="logo-container">
                        <img src={logo} alt="Logo" className="logo" style={{ width: '50px', height: '50px' }} />
                    </Link>
                    <Menu mode="horizontal" theme="dark" style={{ display: 'flex', justifyContent: 'flex-end', flexGrow: 1,backgroundColor: '#F0DED0'}}>
                        <Menu.Item key="1" style={{ marginRight: '3%',color:'#903E21'}}>
                            <Link to="/">Home</Link>
                        </Menu.Item>
                        <Menu.Item key="2" style={{ marginRight: '3%' ,color:'#903E21'}}>
                            <Link to="/mint">Mint</Link>
                        </Menu.Item>
                        <Menu.Item key="3" style={{ marginRight: '3%' }} >
                            <a href="https://www.baidu.com" target="_blank">
                                <Avatar src={<img src={twitterImage} alt="avatar" />}/>
                            </a>
                        </Menu.Item>
                        <Menu.Item key="4" style={{ marginRight: '3%' }} >
                            <a href="https://www.baidu.com" target="_blank">
                                <Avatar src={<img src={discordImage} alt="avatar" />} />
                            </a>
                        </Menu.Item>
                    </Menu>
                    {/*{account ? (*/}
                    {/*    <>*/}
                    {/*        <p>Connected Account: {account}</p>*/}
                    {/*        <button onClick={disconnectWallet}>Disconnect Wallet</button>*/}
                    {/*    </>*/}
                    {/*) : null}*/}
                </Header>
                <Content style={{backgroundColor: '#F0DED0'}}>
                    <AccountContext.Provider value={{ account, setAccount }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/mint" element={<Mint/>} />
                        {/*<Route path="/select" element={<SelectNFT/>} />*/}
                        <Route path="/invite/:code" element={<Invitation />} />
                        <Route path="/matched" element={<MintMinted/>} />
                        <Route path="/nft" element={<NFT/>} />

                    </Routes>
                    </AccountContext.Provider>
                </Content>
            </Layout>
        </Router>
    );
};

export default App;
