import React from 'react';

interface ButtonWithIconProps {
    text: string;
    onClick: () => void;
    style?: React.CSSProperties; // 添加 style 属性
}

const ConnectButton: React.FC<ButtonWithIconProps> = ({ text, onClick,style }) => {
    return (
        <button className="button-with-icon" onClick={onClick} style={style}>
            {/*<img style={{*/}
            {/*    width: '300px',*/}
            {/*    height: '60px',*/}
            {/*}} src="https://previews.123rf.com/images/vectorhome/vectorhome1902/vectorhome190200014/127670152-connect-icon-vector-illustration.jpg"/>*/}
            {text}
        </button>
    );
};

export default ConnectButton;
