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
                    <AppSlogan>A transparent & decentralized news & crime reporting app!</AppSlogan>
                </AppInfo>
                <WalletConnectContainer>
                    <ConnectWallet />
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
    font-family: "Noto Sans", sans-serif;
`;

const HomeAppContainer = styled.div`
    background-image: linear-gradient(#8E44AD, #7e339e);
    box-shadow: #00000052 5px 5px 30px;
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
    font-family: "Pacifico", cursive;
    font-size: 4rem;
`;

const AppSlogan = styled.div`
    color: white;
    font-family: "Pacifico", cursive;
    font-size: 1.5rem;
    text-align: center;
`;

const WalletConnectContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export default Welcome;
