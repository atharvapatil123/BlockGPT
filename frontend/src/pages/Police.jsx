import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import HomeIcon from "@mui/icons-material/Home";
import {
    Add,
    AddCircle,
    Chat,
    Close,
    ErrorOutlineOutlined,
    Favorite,
    HeatPumpRounded,
    Person,
} from "@mui/icons-material";
import { BeatLoader, BounceLoader } from "react-spinners";
import { useNavigate } from "react-router-dom/dist";
import {
    approveCommentToDB,
    createCaseToDB,
    disapproveCommentToDB,
    fetchPosts,
} from "../context/tableland";
import PoliceSideBar from "../components/PoliceSideBar";
import { toast } from "react-toastify";

const Police = () => {
    const navigate = useNavigate();
    const address = useAddress();
    const [feedsList, setFeedsList] = useState([]);

    const [isFeedsLoading, setIsFeedsLoading] = useState(false);
    const [isApproveSending, setIsApproveSending] = useState(false);
    const [isDisapproveSending, setIsDisapproveSending] = useState(false);
    const [actionedOnId, setActionedOnId] = useState(-1);

    useEffect(() => {
        console.log(address);
        if (!address) {
            // navigate("/");
        } else {
            fetchFeeds();
        }
    }, [address]);

    const fetchFeeds = async () => {
        setIsFeedsLoading(true);
        const result = await fetchPosts();
        console.log(result);
        setFeedsList(result);
        setIsFeedsLoading(false);
    };

    const createNewCase = async (reportId, user_wallet_address, report) => {
        const newCaseId = await createCaseToDB([address, user_wallet_address, "0xDDDa8055aa402769499a6695cC90c84160d3148f"], reportId);
        toast.success("Case created, fetching case records...");
        navigate(`/case/${newCaseId}`, {state: report});
    }

    const disapproveAPost = async (postId) => {
        setActionedOnId(postId);
        setIsDisapproveSending(true);
        await disapproveCommentToDB(postId);
        setIsDisapproveSending(false);
        toast.success("Post disapproved!");
        fetchFeeds();
    }

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
                    {!isFeedsLoading ? (
                            feedsList.length > 0 ? (
                                feedsList.map((news) => {
                                    return (
                                        <ProfileContentContainer>
                                            <ProfileInfoContainer>
                                                <ProfileName>
                                                    {news.wallet_address.substring(
                                                        0,
                                                        10
                                                    )}
                                                    ...
                                                </ProfileName>
                                            </ProfileInfoContainer>
                                            <MainProfileImage
                                                src={`${news.content.cid}`}
                                            />
                                            <ProfileWriteUpContainer>
                                                <NewsCaption>
                                                    {news.content.caption}
                                                </NewsCaption>
                                            </ProfileWriteUpContainer>
                                            <OverflowActionButtons>
                                                <ApproveButton
                                                    onClick={() => {
                                                      createNewCase(news.id, news.wallet_address, news);
                                                    }}
                                                >
                                                    Create Case
                                                </ApproveButton>
                                                <DisapproveButton
                                                    onClick={() => {
                                                        disapproveAPost(news.id);
                                                    }}
                                                >
                                                    {isDisapproveSending &&
                                                    actionedOnId === news.id ? (
                                                        <BounceLoader
                                                            size={40}
                                                            color="#ec4b66"
                                                        />
                                                    ) : (
                                                        <>
                                                            <Close color="#ec4b66" />
                                                            Disapprove
                                                        </>
                                                    )}
                                                </DisapproveButton>
                                            </OverflowActionButtons>
                                        </ProfileContentContainer>
                                    );
                                })
                            ) : (
                                <EmptyListPlaceholder>
                                    Uh oh! No news found :(
                                </EmptyListPlaceholder>
                            )
                        ) : (
                            <EmptyListPlaceholder>
                                <BeatLoader color="#8e44ad" />
                            </EmptyListPlaceholder>
                        )}
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


const EmptyListPlaceholder = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
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

const ProfileContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem;
    background-color: white;
    margin-bottom: 1rem;
    border-radius: 8px;
    box-shadow: 5px 5px 10px #1515152f;
`;

const MainProfileImage = styled.img`
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

const ProfileFakeContainer = styled.div`
    display: flex;
    flex-direction: row;
    color: red;
`;

const ProfileName = styled.span`
    font-weight: bold;
    font-size: 1rem;
    padding-right: 0.5rem;
`;

const ProfileGender = styled.span`
    font-weight: 600;
`;
const ProfileAge = styled.span`
    font-weight: 600;
`;

const ProfileWriteUpContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 1rem 0;
`;

const NewsCaption = styled.div``;

const AdditionContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem 0;
`;

const OverflowActionButtons = styled.div`
    display: flex;
    flex-direction: row;
`;

const DisapproveButton = styled.div`
    background-color: white;
    border: none;
    color: red;
    outline: none;
    margin: 0.5rem;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    cursor: pointer;
`;

const ApproveButton = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #2980b9;
    border: none;
    outline: none;
    color: white;
    margin: 0.5rem;
    margin-left: 0rem;
    padding: 0 1rem;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50vh;
    cursor: pointer;
`;

const LoveButton = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #e74c3c;
    border: none;
    outline: none;
    color: white;
    margin: 0.5rem;
    margin-left: 0rem;
    padding: 0 1rem;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50vh;
    cursor: pointer;
`;

export default Police;
