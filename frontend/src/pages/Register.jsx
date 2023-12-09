import React, { useCallback, useEffect, useState, useMemo } from "react";
import { styled } from "styled-components";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import { LogInWithAnonAadhaar, useAnonAadhaar } from "anon-aadhaar-react";
import { useNavigate } from "react-router-dom";
import { getUserById, registerUserToDB } from "../context/tableland";

const Register = () => {
    const address = useAddress();
    const navigate = useNavigate();
    const [anonAadhaar] = useAnonAadhaar();
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [profileDob, setProfileDob] = useState("");
    const [profileGender, setProfileGender] = useState("0");
    const [aadharHash, setAadharHash] = useState("");
    const [profileCity, setProfileCity] = useState("");
    const [modulus, setModulus] = useState(0);

    useEffect(() => {
        const mod = JSON.stringify(anonAadhaar.pcd, null, 2);
        console.log(mod, "modulus");
        setModulus(mod);
    }, [anonAadhaar?.status]);

    const registerUser = async () => {
        setIsLoading(true);
        await registerUserToDB(
            username,
            address,
            profileDob,
            profileGender,
            "3543584",
            profileCity
        );
        setIsLoading(false);
        handleAfterLoginNavigation(address);
        toast.success("You are in!");
    };

    const handleAfterLoginNavigation = async (signedInAddress) => {
        const isRegistered = await checkIfAddressRegistered(signedInAddress);
        if (isRegistered) {
            navigate("/feed");
        } else {
            alert("Looks like you weren't registered!");
        }
        setIsLoading(false);
    };

    const checkIfAddressRegistered = async (signedInAddress) => {
        const data = await getUserById(signedInAddress);
        console.log(data);
        return data.length > 0;
    };

    // const storeFiles = async () => {
    //     const client = makeStorageClient();
    //     console.log(profilePicFile);
    //     const cid = await client.put(profilePicFile);
    //     console.log("stored files with cid:", cid);
    //     return cid;
    // };

    return (
        <HomeContainer>
            <HomeAppContainer>
                <AppHeaderContainer>
                    <AppLogo>Indie News</AppLogo>
                    <ConnectWallet />
                </AppHeaderContainer>
                <RegisterPageContainer>
                    <TextInputGroup>
                        <span>Username</span>
                        <CustomInput
                            type="text"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                            }}
                            placeholder="Select an anonymous username"
                        />
                    </TextInputGroup>
                    <TextInputGroup>
                        <span>Date of Birth</span>
                        <CustomInput
                            type="date"
                            value={profileDob}
                            onChange={(e) => {
                                setProfileDob(e.target.value);
                            }}
                            placeholder="When were you born?"
                        />
                    </TextInputGroup>
                    <TextInputGroup>
                        <span>Gender</span>
                        <RadioButtonWithLabel>
                            <input
                                type="radio"
                                value="Male"
                                checked={profileGender === "1"}
                                onChange={(e) => {
                                    setProfileGender("1");
                                }}
                            />{" "}
                            Male
                        </RadioButtonWithLabel>
                        <RadioButtonWithLabel>
                            <input
                                type="radio"
                                value="Female"
                                checked={profileGender === "0"}
                                onChange={(e) => {
                                    setProfileGender("0");
                                }}
                            />{" "}
                            Female
                        </RadioButtonWithLabel>
                    </TextInputGroup>
                    <TextInputGroup>
                        <span>City</span>
                        <CustomInput
                            type="text"
                            value={profileCity}
                            onChange={(e) => {
                                setProfileCity(e.target.value);
                            }}
                            placeholder="Permanent City Location"
                        />
                    </TextInputGroup>
                    <div>
                        <LogInWithAnonAadhaar />
                    </div>
                </RegisterPageContainer>

                <SubmitButton
                    disabled={
                        anonAadhaar?.status !== "logged-in" ? true : false
                    }
                    onClick={registerUser}
                >
                    {isLoading ? <BeatLoader color="#ffffff" /> : "Create"}
                </SubmitButton>
                {/* <p>modulus : {JSON.stringify(anonAadhaar.pcd, null, 2)}</p> */}
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
    background-color: #f4f4f4;
    box-shadow: #00000052 5px 5px 30px;
    width: max(30%, 400px);
    height: 90%;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    padding: 1rem;
`;

const AppHeaderContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const AppLogo = styled.div`
    color: #8e44ad;
    font-weight: bold;
    font-size: 1.4rem;
`;

const RegisterPageContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
    padding: 1rem 0;
`;

const TextInputGroup = styled.div`
    background-color: #e7e7e7;
    border-radius: 6px;
    border: none;
    outline: none;
    padding: 0.8rem 1rem;
    font-size: 1rem;
    margin-bottom: 0.5rem;
    flex-direction: column;
    display: flex;

    span {
        font-size: 0.9rem;
        font-weight: bold;
        margin-bottom: 0.6rem;
        color: #444444;
    }
`;

const CustomInput = styled.input`
    background-color: transparent;
    border: none;
    outline: none;
    font-size: 1.1rem;
`;

const CustomInputTextArea = styled.textarea`
    background-color: transparent;
    border: none;
    outline: none;
    font-size: 1rem;
    resize: none;
    font-family: "Noto Sans", sans-serif;
`;

const SubmitButton = styled.button`
    background-color: #8e44ad;
    color: white;
    border: none;
    outline: none;
    border-bottom: #763293 6px solid;
    padding: 0.8rem 2rem;
    border-radius: 0.5rem;
    font-size: 1.1rem;
    margin-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.5s ease;
    &:hover {
        transform: translateY(-2px);
    }
    &:active {
        transition: all 0.1s ease;
        transform: translateY(4px);
        border-bottom: 0;
    }
`;

const RadioButtonWithLabel = styled.div`
    display: flex;
    flex-direction: row;
`;

export default Register;
