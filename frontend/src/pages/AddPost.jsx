import React, { useCallback, useEffect, useMemo, useState } from "react";
import { styled } from "styled-components";
import { Database } from "@tableland/sdk";
import { Wallet, getDefaultProvider, ethers } from "ethers";
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
  UploadFileOutlined,
} from "@mui/icons-material";
import moment from "moment";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import { addPostToDB } from "../context/tableland";
import { useNavigate } from "react-router-dom/dist";
import makeStorageClient from "../context/web3storage";
import {
  ContentPairProvider,
  useWaku,
  useLightPush,
  useFilterMessages,
  useStoreMessages,
  useContentPair,
} from "@waku/react";
import protobuf from "protobufjs";
import { useStake } from "../context/StakeContractContext";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: "2px",
  borderRadius: "1rem",
  borderColor: "#E3E3E3",
  backgroundColor: "#a1a1a155",
  color: "#6e6e6e",
  outline: "none",
  transition: "border .24s ease-in-out",
  cursor: "pointer",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const AddPost = () => {
  const navigate = useNavigate();
  const address = useAddress();
  const { node } = useWaku();
  window.tmp = node;
  console.log(node);

  const { encoder, decoder } = useContentPair();
  const { push } = useLightPush({ node, encoder });

  const { addStakedAmount } = useStake();

  // Create a message structure using Protobuf
  const ReportMessageFormat = new protobuf.Type("ReportMessage")
    .add(new protobuf.Field("timestamp", 1, "uint64"))
    .add(new protobuf.Field("message", 2, "string"));

  const [isLoading, setIsLoading] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postCaption, setPostCaption] = useState("");
  const [postType, setPostType] = useState("news");
  const [isPrivate, setIsPrivate] = useState(false);
  const [profilePicFile, setProfilePicFile] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const tempList = acceptedFiles;
      let profileContent;
      tempList.forEach((f, index) => {
        if (
          f.path.includes(".png") ||
          f.path.includes(".jpg") ||
          f.path.includes(".jpeg")
        ) {
          profileContent = f;
          tempList.splice(index, 1);
        }
      });
      if (!profileContent) {
        alert("Atleast upload one image!");
        return;
      }
      setProfilePicFile([profileContent, ...tempList]);
    },
    [setProfilePicFile]
  );

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({ onDrop });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const createPost = async () => {
    setIsLoading(true);
    //const postContentCID = storeFiles(profilePicFile);
    const postContentCID = "this is an image";
    const content = {
      cid: `${postContentCID}`,
      caption: postCaption,
      supportIds: [],
      againstIds: [],
      likes: [],
    };

    if (postType == "crime") {
      const response = await addStakedAmount();
      console.log("response", response);
      if (response) {
        if (isPrivate) {
          //waku create topic
          const reportContent = {
            wallet_address: address,
            cid: `${postContentCID}`,
            caption: postCaption,
          };
          await createPrivateWakuChannel(reportContent);
          console.log("here")
        } else {
          // tableland
          await addPostToDB(
            postTitle,
            address,
            "test",
            postType,
            JSON.stringify(content),
            false,
            `${moment().valueOf()}`
          );
        }
        toast.success("Post created successfully!");
      } else {
        toast.error("Something went wrong while adding staked amount!");
      }
    } else {
    }

    setIsLoading(false);
    navigate("/feed");
  };

  const createPrivateWakuChannel = async (reportContent) => {
    if (!push) return;

    // Create a new message object
    const timestamp = Date.now();
    const protoMessage = ReportMessageFormat.create({
      timestamp: timestamp,
      message: JSON.stringify(reportContent),
    });

    // Serialise the message and push to the network
    const payload = ReportMessageFormat.encode(protoMessage).finish();
    console.log("payload", payload);

    let counter = 0;
    while (counter < 20) {
      // TODO: To refine the logic of retry
      const { recipients, errors } = await push({ payload, timestamp });
      console.log("recipients", recipients);
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

  const storeFiles = async (fileToStore) => {
    const client = makeStorageClient();
    console.log(fileToStore);
    const cid = await client.put(fileToStore);
    console.log("stored files with cid:", cid);
    return cid;
  };

  return (
    <HomeContainer>
      <HomeAppContainer>
        <SideBarNavigationContainer>
          <NavOption
            onClick={() => {
              // navigate("/feed");
              navigate("/feed");
            }}
          >
            <HomeIcon fontSize="small" />
            Feed
          </NavOption>
          <NavOption
            onClick={() => {
              // navigate("/hearts");
              navigate("/add");
            }}
          >
            <AddCircle fontSize="small" />
            Add
          </NavOption>
          <NavOption
            onClick={() => {
              navigate("/chats");
            }}
          >
            <Chat fontSize="small" />
            Chats
          </NavOption>
          <FlexFullContainer />
          <NavOption
            onClick={() => {
              navigate("/account");
            }}
          >
            <Person fontSize="small" />
            Account
          </NavOption>
        </SideBarNavigationContainer>
        <MainContentContainer>
          <AppHeaderContainer>
            <AppLogo>Indie News</AppLogo>
            <ConnectWallet />
          </AppHeaderContainer>
          <RegisterPageContainer>
            <TextInputGroup>
              <span>Title</span>
              <CustomInput
                type="text"
                value={postTitle}
                onChange={(e) => {
                  setPostTitle(e.target.value);
                }}
                placeholder="Select an anonymous username"
              />
            </TextInputGroup>
            <TextInputGroup>
              <span>Image or Video</span>
              <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <UploadFileOutlined />
                <p>
                  {profilePicFile != null
                    ? `${profilePicFile.length} files added`
                    : "Upload image"}
                </p>
              </div>
            </TextInputGroup>
            <TextInputGroup>
              <span>Caption</span>
              <CustomInputTextArea
                type="textfield"
                value={postCaption}
                onChange={(e) => {
                  setPostCaption(e.target.value);
                }}
                placeholder="Describe it"
                rows={4}
              />
            </TextInputGroup>
            <TextInputGroup>
              <span>Type</span>
              <RadioButtonWithLabel>
                <input
                  type="radio"
                  value="News"
                  checked={postType === "news"}
                  onChange={(e) => {
                    setPostType("news");
                  }}
                />{" "}
                News
              </RadioButtonWithLabel>
              <RadioButtonWithLabel>
                <input
                  type="radio"
                  value="Crime"
                  checked={postType === "crime"}
                  onChange={(e) => {
                    setPostType("crime");
                  }}
                />{" "}
                Crime
              </RadioButtonWithLabel>
            </TextInputGroup>
            <TextInputGroup>
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => {
                  setIsPrivate(e.target.checked);
                }}
              />
              Keep the post private?
            </TextInputGroup>
          </RegisterPageContainer>
          <SubmitButton onClick={createPost}>
            {isLoading ? <BeatLoader color="#ffffff" /> : "Create"}
          </SubmitButton>
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
  box-shadow: 5px 5px 10px #1515154f;
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

const LikeButton = styled.div`
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

const RadioButtonWithLabel = styled.div`
  display: flex;
  flex-direction: row;
`;

export default AddPost;
