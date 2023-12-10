import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import HomeIcon from "@mui/icons-material/Home";
import {
    AddCircle,
    Chat,
    Favorite,
    Person,
    ThumbUpRounded,
} from "@mui/icons-material";
import { BounceLoader } from "react-spinners";
import { useNavigate, useParams } from "react-router-dom/dist";
import {
    fetchPostsById,
    getCommentsByPostId,
    likePostToDB,
} from "../context/tableland";
import UserSideBar from "../components/UserSideBar";
import { toast } from "react-toastify";
import _ from "lodash";

const Post = () => {
    const navigate = useNavigate();
    const params = useParams();
    const address = useAddress();
    const postId = params.id;

    const [post, setPost] = useState({});
    const [postComments, setPostComments] = useState([]);
    const [actionedOnId, setActionedOnId] = useState(-1);

    useEffect(() => {
        if (!address) {
            navigate("/");
        } else {
            fetchPostAndComments();
        }
    }, [address]);

    const fetchPostAndComments = async () => {
        const parentPost = await fetchPostsById(postId);
        const parentPostContent = parentPost.content;
        let commentIds = [];
        if (parentPostContent) {
            if (parentPostContent.supportIds) {
                commentIds = commentIds.concat(parentPostContent.supportIds);
            }
            if (parentPostContent.againstIds) {
                commentIds = commentIds.concat(parentPostContent.againstIds);
            }
        }
        const commentsOfParent = await getCommentsByPostId(commentIds);
        setPost(parentPost);
        setPostComments(commentsOfParent);
    };

    const sendLike = async (postId) => {
        setIsLikeSending(true);
        setActionedOnId(postId);
        await likePostToDB(postId, address);
        setIsLikeSending(false);
        fetchPostAndComments();
        toast.success("Post liked!");
    };

    const hasUserLikedPost = (post) => {
        if (post.content && post.content.likes) {
            return post.content.likes.includes(address);
        }
        return false;
    };

    const [isLikeSending, setIsLikeSending] = useState(false);

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
                        {post.content !== undefined && (
                            <ProfileContentContainer>
                                <ProfileInfoContainer>
                                    <ProfileName>
                                        {post.wallet_address.substring(0, 10)}
                                        ...
                                    </ProfileName>
                                </ProfileInfoContainer>
                                <PostContentImage src={`${post.content.cid}`} />
                                <PostDescription>
                                    {post.content.caption}
                                </PostDescription>
                                <PostActionButtons>
                                    <LikeButton
                                        isActive={hasUserLikedPost(post)}
                                        onClick={() => {
                                            sendLike(post.id);
                                        }}
                                    >
                                        {isLikeSending &&
                                        actionedOnId === post.id ? (
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
                                                            post,
                                                            "content.likes",
                                                            []
                                                        ).length
                                                    }`}
                                                </ActionCount>
                                            </>
                                        )}
                                    </LikeButton>
                                </PostActionButtons>
                            </ProfileContentContainer>
                        )}
                        <CommentsDivider>Comments</CommentsDivider>
                        <CommentsOuterContainer>
                            {postComments.length > 0
                                ? postComments.map((news) => {
                                      return (
                                          news.content && (
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
                                                  <PostContentImage
                                                      src={`${news.content.cid}`}
                                                  />
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
                                                          actionedOnId ===
                                                          news.id ? (
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
                                                                          )
                                                                              .length
                                                                      }`}
                                                                  </ActionCount>
                                                              </>
                                                          )}
                                                      </LikeButton>
                                                  </PostActionButtons>
                                              </ProfileContentContainer>
                                          )
                                      );
                                  })
                                : "No Comments found!"}
                        </CommentsOuterContainer>
                    </ScrollingFeedsContainer>
                    <AddCommentButton
                        onClick={() => {
                            navigate(`/post/${postId}/comment`, undefined, {
                                shallow: true,
                            });
                        }}
                    >
                        Support or Against
                    </AddCommentButton>
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

const CommentsDivider = styled.div`
    font-weight: 600;
`;

const CommentsOuterContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding-left: 2rem;
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

const PostContentImage = styled.img`
    width: 100%;
    border-radius: 1rem;
`;

const PostDescription = styled.div`
    margin: 1rem 0;
    font-size: 0.9rem;
`;

const PostActionButtons = styled.div`
    display: flex;
    flex-direction: row;
`;

const ActionCount = styled.div`
    margin-left: 1rem;
`;

const ProfileName = styled.span`
    font-weight: bold;
    font-size: 1rem;
    padding-right: 0.5rem;
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

const AddCommentButton = styled.button`
    background-color: #8e44ad;
    color: white;
    border: none;
    outline: none;
    border-bottom: #7d339c 6px solid;
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

export default Post;
