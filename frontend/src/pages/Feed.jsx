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
    ReportProblem,
    ThumbUpRounded,
} from "@mui/icons-material";
import { BeatLoader, BounceLoader } from "react-spinners";
import { toast } from "react-toastify";
import _ from "lodash";
import { useNavigate } from "react-router-dom/dist";
import { fetchPosts, likePostToDB } from "../context/tableland";
import UserSideBar from "../components/UserSideBar";

const Feed = () => {
    // const router = useRouter();
    const navigate = useNavigate();
    const address = useAddress();
    const [feedsList, setFeedsList] = useState([]);
    const [isFeedsLoading, setIsFeedsLoading] = useState(false);
    const [isLikeSending, setIsLikeSending] = useState(false);
    const [actionedOnId, setActionedOnId] = useState(-1);

    useEffect(() => {
        if (!address) {
            navigate("/");
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

    const sendLike = async (postId) => {
        setIsLikeSending(true);
        setActionedOnId(postId);
        await likePostToDB(postId, address);
        setIsLikeSending(false);
        fetchFeeds();
        toast.success("Post liked!");
    };

    const hasUserLikedPost = (post) => {
        if (post.content && post.content.likes) {
            return post.content.likes.includes(address);
        }
        return false;
    };

    const navigateToCommentsPage = (id) => {
        navigate(`/post/${id}`);
    };

    return (
        <HomeContainer>
            <HomeAppContainer>
                <UserSideBar />
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
                                        <PostCardContainer>
                                            <ProfileInfoContainer>
                                                <ProfileName>
                                                    {news.wallet_address.substring(
                                                        0,
                                                        10
                                                    )}
                                                    ...
                                                </ProfileName>
                                            </ProfileInfoContainer>
                                            <PostContentImage
                                                src={`${news.content.cid}`}
                                            />
                                            <PostTitle>
                                                {news.title}
                                            </PostTitle>
                                            <PostDescription>
                                                {news.content.caption}
                                            </PostDescription>
                                            <PostActionButtons>
                                                <LikeButton
                                                    isActive={hasUserLikedPost(
                                                        news
                                                    )}
                                                    onClick={() => {
                                                        sendLike(news.id);
                                                    }}
                                                >
                                                    {isLikeSending &&
                                                    actionedOnId === news.id ? (
                                                        <BounceLoader
                                                            size={40}
                                                            color="#2980b9"
                                                        />
                                                    ) : (
                                                        <>
                                                            <ThumbUpRounded />
                                                            <ActionCount>
                                                                {`${
                                                                    _.get(
                                                                        news,
                                                                        "content.likes",
                                                                        []
                                                                    ).length
                                                                }`}
                                                            </ActionCount>
                                                        </>
                                                    )}
                                                </LikeButton>
                                                <SupportButton
                                                    onClick={() => {
                                                        navigateToCommentsPage(
                                                            news.id
                                                        );
                                                    }}
                                                >
                                                    <Favorite color="white" />
                                                    <ActionCount>
                                                        {`${
                                                            _.get(
                                                                news,
                                                                "content.supportIds",
                                                                []
                                                            ).length
                                                        }`}
                                                    </ActionCount>
                                                </SupportButton>
                                                <AgainstButton
                                                    onClick={() => {
                                                        navigateToCommentsPage(
                                                            news.id
                                                        );
                                                    }}
                                                >
                                                    <ReportProblem color="white" />
                                                    <ActionCount>
                                                        {`${
                                                            _.get(
                                                                news,
                                                                "content.againstIds",
                                                                []
                                                            ).length
                                                        }`}
                                                    </ActionCount>
                                                </AgainstButton>
                                            </PostActionButtons>
                                        </PostCardContainer>
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
                    <FloatingAddButton
                        onClick={() => {
                            navigate("/add");
                        }}
                    >
                        <Add fontSize="medium" />
                    </FloatingAddButton>
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
    background-image: linear-gradient(#eec5ff, #f8e7ff);
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
`;

const PostTitle = styled.div`
    font-size: 1.1rem;
    font-weight: bold;
    margin-top: 1rem;
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
    margin: 0.2rem 0 1rem 0;
    font-size: 0.9rem;
`;

const PostActionButtons = styled.div`
    display: flex;
    flex-direction: row;
`;

const ActionCount = styled.div`
    margin-left: 1rem;
`;

const LikeButton = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: ${(props) => (props.isActive ? "#2980b9" : "#45b5ff12")};
    border: ${(props) => (props.isActive ? "none" : "#2980b9 1px solid")};
    outline: none;
    color: ${(props) => (props.isActive ? "white" : "#2980b9")};
    padding: 0 0.8rem;
    margin-right: 0.8rem;
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
    border: #27ae60 2px solid;
    background-color: #e8fff2;
    outline: none;
    color: #27ae60;
    padding: 0 0.8rem;
    margin-right: 0.8rem;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50vh;
    cursor: pointer;
`;

const AgainstButton = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    border: #e74c3c 2px solid;
    background-color: #fff0ef;
    outline: none;
    color: #e74c3c;
    padding: 0 0.8rem;
    margin-right: 0.8rem;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50vh;
    cursor: pointer;
`;

const FloatingAddButton = styled.div`
    position: absolute;
    bottom: 0;
    right: 0;
    margin: 2rem;
    border-radius: 50vh;
    width: 3rem;
    height: 3rem;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #8e44ad;
    box-shadow: #0000002d 5px 5px 20px;
    cursor: pointer;
    transition: all 0.5s ease;

    &:hover {
        transform: translateY(-2px);
    }
    &:active {
        transition: all 0.1s ease;
        transform: translateY(2px);
        border-bottom: 0;
        background-color: #8e44ad;
        color: white;
    }
`;

const EmptyListPlaceholder = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export default Feed;
