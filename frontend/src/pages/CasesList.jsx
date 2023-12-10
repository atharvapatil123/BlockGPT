import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import HomeIcon from "@mui/icons-material/Home";
import {
    Add,
    AddCircle,
    Chat,
    Close,
    Favorite,
    Person,
    ThumbUpRounded,
} from "@mui/icons-material";
import { BounceLoader } from "react-spinners";
import { toast } from "react-toastify";
import _ from "lodash";
import { useNavigate } from "react-router-dom/dist";
import { fetchPosts, likePostToDB } from "../context/tableland";
import PoliceSideBar from "../components/PoliceSideBar";

const CasesList = () => {
    // const router = useRouter();
    const navigate = useNavigate();
    const address = useAddress();
    const [casesList, setCasesList] = useState([]);

    useEffect(() => {
        if (!address) {
            navigate("/");
        } else {
            fetchAllCases();
        }
    }, [address]);

    const fetchAllCases = () => {
        setCasesList([
            {
                id: 1,
                title: "Political Corruptions",
                wallet_address: "0xDDDa8055aa402769499a6695cC90c84160d3148f"
            },
            {
                id: 2,
                title: "Water issues",
                wallet_address: "0xDDDa8055aa402769499a6695cC90c84160d3148f"
            },
        ])
    }

    const navigateToCasesForum = (id) => {
        navigate(`/case/${id}`);
    };

    return (
        <HomeContainer>
            <HomeAppContainer>
                <PoliceSideBar />
                <MainContentContainer>
                    <AppHeaderContainer>
                        <AppLogo>Indie News</AppLogo>
                        <ConnectWallet />
                    </AppHeaderContainer>
                    <ScrollingFeedsContainer>
                        {casesList.length > 0
                            ? casesList.map((caseInfo) => {
                                  return (
                                      <PostCardContainer onClick={() => {
                                        navigateToCasesForum(caseInfo.id)
                                      }}>
                                          <ProfileInfoContainer>
                                              <ProfileName>
                                                  {caseInfo.title}
                                              </ProfileName>
                                          </ProfileInfoContainer>
                                          <PostDescription>
                                              By: {caseInfo.wallet_address.substring(
                                                      0,
                                                      10
                                                  )}
                                                  ...
                                          </PostDescription>
                                      </PostCardContainer>
                                  );
                              })
                            : "Looks like you don't have any active cases!"}
                    </ScrollingFeedsContainer>
                </MainContentContainer>
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
    width: max(30%, 550px);
    height: 90%;
    border-radius: 1rem;
    display: flex;
    flex-direction: row;
    align-items: stretch;
`;

const SideBarNavigationContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem 1rem;
    background-color: #8e44ad;
    border-radius: 1rem 0 0 1rem;
    color: white;
`;

const NavOption = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 0.8rem;
    border-radius: 0.5rem;
    padding: 0.8rem;
    cursor: pointer;
    &:hover {
        background-color: #ffffff36;
    }
`;

const FlexFullContainer = styled.div`
    flex: 1;
`;

const MainContentContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    position: relative;
`;

const ScrollingFeedsContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
    padding-right: 1rem;
`;

const AppHeaderContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
`;

const AppLogo = styled.div`
    color: #8e44ad;
    font-weight: bold;
    font-size: 1.4rem;
`;

const PostCardContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem;
    background-color: white;
    margin-bottom: 1rem;
    border-radius: 8px;
    box-shadow: 5px 5px 10px #1515152f;
    cursor: pointer;
    transition: all 0.5s ease;
    &:active {
        transform: translateY(-2px);
    }
`;

const PostContentImage = styled.img`
    width: 100%;
    border-radius: 1rem;
`;

const ProfileInfoContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: end;
    padding: 0.5rem 0;
`;

const ProfileName = styled.span`
    font-weight: bold;
    font-size: 1rem;
    padding-right: 0.5rem;
`;

const PostDescription = styled.div`
    margin: 1rem 0;
`;

const PostActionButtons = styled.div`
    display: flex;
    flex-direction: row;
`;

const AgainstButton = styled.div`
    background-color: white;
    border: none;
    outline: none;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    cursor: pointer;
`;

const LikeButton = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: ${(props) => (props.isActive ? "#2980b9" : "#45b5ff12")};
    border: ${(props) => (props.isActive ? "none" : "#2980b9 1px solid")};
    outline: none;
    color: ${(props) => (props.isActive ? "white" : "#2980b9")};
    padding: 0 1rem;
    margin-right: 1rem;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50vh;
    cursor: pointer;
`;

const SupportButton = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #e74c3c;
    border: none;
    outline: none;
    color: white;
    padding: 0 1rem;
    margin-right: 1rem;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50vh;
    cursor: pointer;
`;

export default CasesList;
