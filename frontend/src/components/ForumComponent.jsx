import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import HomeIcon from "@mui/icons-material/Home";
import { AddCircle, Chat, Favorite, Person } from "@mui/icons-material";
import { BounceLoader } from "react-spinners";
import { useNavigate, useParams } from "react-router-dom/dist";
import { fetchPostsById, getCommentsByPostId } from "../context/tableland";
import {
    ContentPairProvider,
    useWaku,
    useLightPush,
    useFilterMessages,
    useStoreMessages,
    useContentPair,
} from "@waku/react";
import protobuf from "protobufjs";
import PoliceSideBar from "./PoliceSideBar";

const ForumComponent = ({ caseId, originalPost }) => {
    const navigate = useNavigate();
    const address = useAddress();
    console.log(originalPost);
    const { node } = useWaku();
    window.tmp = node;
    console.log(node);
    const [hasOriginalPostTriggered, setHasOriginalPostTriggered] =
        useState(false);
    const [inputMessage, setInputMessage] = useState("");

    const { encoder, decoder } = useContentPair();
    const { push } = useLightPush({ node, encoder });

    // Create a message structure using Protobuf
    const CaseMessageFormat = new protobuf.Type("CaseMessage")
        .add(new protobuf.Field("timestamp", 1, "uint64"))
        .add(new protobuf.Field("message", 2, "string"));

    const [caseMessages, setCaseMessages] = useState([]);

    useEffect(() => {
        if (!address) {
            // navigate("/");
        } else {
            // if (originalPost && node && !hasOriginalPostTriggered) {
            //     postTheOriginalPost();
            // }
            // fetchCaseForum();
            fetchTempCaseMessages();
        }
    }, [address, node]);

    const fetchTempCaseMessages = () => {
        setCaseMessages([
            {
                wallet_address: "0xDDDa8055aa402769499a6695cC90c84160d3148f",
                caption: "Phasellus vestibulum vestibulum sagittis. Mauris non lacus ac massa ultrices mattis. Fusce sollicitudin vulputate eros eu eleifend."
            },
            {
                wallet_address: "0xDDDa8055aa402769499a6695cC90c84160d3148f",
                caption: "Phasellus vestibulum vestibulum sagittis. Mauris non lacus ac massa ultrices mattis. Fusce sollicitudin vulputate eros eu eleifend."
            },
            {
                wallet_address: "0xDDDa8055aa402769499a6695cC90c84160d3148f",
                caption: "Phasellus vestibulum vestibulum sagittis. Mauris non lacus ac massa ultrices mattis. Fusce sollicitudin vulputate eros eu eleifend."
            },
        ]);
    }

    const sendMessageToWaku = async () => {
        if (!push) return;

        const content = {
            caption: inputMessage,
            wallet_address: address,
        };

        // Create a new message object
        const timestamp = Date.now();
        const protoMessage = CaseMessageFormat.create({
            timestamp: timestamp,
            message: JSON.stringify(content),
        });

        // Serialise the message and push to the network
        const payload = CaseMessageFormat.encode(protoMessage).finish();
        console.log("payload", payload);

        let counter = 0;
        while (counter < 20) {
            // TODO: To refine the logic of retry
            const { recipients, errors } = await push({ payload, timestamp });
            console.log("receipants", recipients);
            if (recipients.length > 0) {
                if (errors.length === 0) {
                    console.log("MESSAGE PUSHED");
                } else {
                    console.log(errors);
                }
                break;
            } else {
                counter += 1;
            }
        }
    };

    const postTheOriginalPost = async () => {
        if (!push) return;
        setHasOriginalPostTriggered(true);

        // Create a new message object
        const timestamp = Date.now();
        const protoMessage = CaseMessageFormat.create({
            timestamp: timestamp,
            message: JSON.stringify(originalPost),
        });

        // Serialise the message and push to the network
        const payload = CaseMessageFormat.encode(protoMessage).finish();
        console.log("payload", payload);

        let counter = 0;
        while (counter < 20) {
            // TODO: To refine the logic of retry
            const { recipients, errors } = await push({ payload, timestamp });
            console.log("receipants", recipients);
            if (recipients.length > 0) {
                if (errors.length === 0) {
                    console.log("MESSAGE PUSHED");
                } else {
                    console.log(errors);
                }
                break;
            } else {
                counter += 1;
            }
        }
    };

    // const { messages: filterMessages } = useFilterMessages({ node, decoder });
    // const { messages: storeMessages } = useStoreMessages({ node, decoder });

    // useEffect(() => {
    //     console.log("node", node);
    //     if (node !== undefined) {
    //         const allMessages = storeMessages.concat(filterMessages);
    //         console.log("allMessages", allMessages);
    //         setCaseMessages(
    //             allMessages.map((wakuMessage) => {
    //                 if (!wakuMessage.payload) return;
    //                 return CaseMessageFormat.decode(wakuMessage.payload);
    //             })
    //         );
    //     }
    // }, [filterMessages, storeMessages]);

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
                        <CommentsOuterContainer>
                            {/* {JSON.stringify(caseMessages)} */}

                            {caseMessages.length > 0
                            ? caseMessages.map((news) => {
                                  return news.caption && (
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
                                          <ProfileWriteUpContainer>
                                              <NewsCaption>
                                                  {news.caption}
                                              </NewsCaption>
                                          </ProfileWriteUpContainer>
                                      </ProfileContentContainer>
                                  );
                              })
                            : "No Comments found!"}
                        </CommentsOuterContainer>
                    </ScrollingFeedsContainer>
                    <TextInputGroup>
                            <CustomInputTextArea
                                type="textfield"
                                value={inputMessage}
                                onChange={(e) => {
                                    setInputMessage(e.target.value);
                                }}
                                placeholder="Add content to a case"
                                rows={2}
                            />
                            <SendCaseMessageButton onClick={sendMessageToWaku}>Send</SendCaseMessageButton>
                        </TextInputGroup>
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

const TextInputGroup = styled.div`
    margin-top: 1rem;
    background-color: white;
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

const CustomInputTextArea = styled.textarea`
    background-color: transparent;
    border: none;
    outline: none;
    font-size: 1rem;
    resize: none;
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
    padding-bottom: 1rem;
`;

const CommentsOuterContainer = styled.div`
    display: flex;
    flex-direction: column;
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

const SkipButton = styled.div`
    background-color: white;
    border: none;
    outline: none;
    margin: 0.5rem;
    margin-left: 0rem;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    cursor: pointer;
`;

const SendCaseMessageButton = styled.div`
    display: flex;
    flex-direction: row;
    align-self: flex-end;
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

export default ForumComponent;
