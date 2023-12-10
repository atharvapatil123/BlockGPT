import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import HomeIcon from "@mui/icons-material/Home";
import {
    AddCircle,
    Chat,
    Favorite,
    Person,
} from "@mui/icons-material";
import { BounceLoader } from "react-spinners";
import { useLocation, useNavigate, useParams } from "react-router-dom/dist";
import { fetchPostsById, getCommentsByPostId } from "../context/tableland";
import ForumComponent from "../components/ForumComponent";
import { ContentPairProvider } from "@waku/react";

const CaseForum = () => {
    const navigate = useNavigate();
    const {state} = useLocation();
    console.log(state);
    const params = useParams();
    const address = useAddress();
    const caseId = params.id;

    const [post, setPost] = useState({});
    const [postComments, setPostComments] = useState([]);

    useEffect(() => {
        if (!address) {
            // navigate("/");
        } else {
            fetchCaseForum();
        }
    }, [address]);

    const fetchCaseForum = () => {

    }

    return (
        <ContentPairProvider contentTopic={`/crime-miners/2/report/case_${caseId}`}>
            <ForumComponent caseId={caseId} originalPost={state}/>
        </ContentPairProvider>
    )
};

export default CaseForum;
