import React from "react";
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
import { useNavigate } from "react-router-dom/dist";
import styled from "styled-components";

const PoliceSideBar = () => {
    const navigate = useNavigate();
    return (
        <SideBarNavigationContainer>
            <NavOption
                onClick={() => {
                    navigate("/police");
                }}
            >
                <HomeIcon fontSize="small" />
                All Posts
            </NavOption>
            <NavOption
                onClick={() => {
                    navigate("/reports");
                }}
            >
                <AddCircle fontSize="small" />
                Private
            </NavOption>
            <NavOption
                onClick={() => {
                    navigate("/casesList");
                }}
            >
                <Chat fontSize="small" />
                Cases
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
    );
};

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

export default PoliceSideBar;