import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import React, { useEffect } from "react";
import { styled } from "styled-components";
import { getUserById } from "../context/tableland";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
    const address = useAddress();
    const navigate = useNavigate();

    const handleAfterLoginNavigation = async (signedInAddress) => {
        const isRegistered = await checkIfAddressRegistered(signedInAddress);
        if (isRegistered) {
            navigate("/feed");
        } else {
            navigate("/register");
        }
    };

    const checkIfAddressRegistered = async (signedInAddress) => {
        const data = await getUserById(signedInAddress);
        console.log(data);
        return data.length > 0;
    };

    useEffect(() => {
        if (address) {
            handleAfterLoginNavigation(address);
        }
    }, [address]);

    return (
        <HomeContainer>
            <HomeAppContainer>
                <AppInfo>
                    <AppLogo>Indie News</AppLogo>
                    <AppSlogan>A transparent & decentralized <br/>news & crime reporting app!</AppSlogan>
                </AppInfo>
                <WalletConnectContainer>
                    <StyledConnectWallet><ConnectWallet /></StyledConnectWallet>
                </WalletConnectContainer>
            </HomeAppContainer>
        </HomeContainer>
    );
};

const HomeContainer = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'Noto Sans', sans-serif;
    background-image: linear-gradient(#eec5ff, #f8e7ff);
`;

const HomeAppContainer = styled.div`
    background-image: linear-gradient(#8E44AD, #7e339e);
    box-shadow: #00000052 10px 10px 30px;
    width: max(30%, 400px);
    height: 90%;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    padding: 1rem;
`;

const AppInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const AppLogo = styled.div`
    color: white;
    font-size: 4rem;
    font-weight: bold;
`;

const AppSlogan = styled.div`
    color: white;
    font-size: 1.5rem;
    text-align: center;
`;

const WalletConnectContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const StyledConnectWallet = styled.div`
    transition: all 0.5s ease;
    &:hover {
        transform: translateY(-2px);
    }
    &:active {
        transition: all 0.1s ease;
        transform: translateY(4px);
    }
`;

export default Welcome;
