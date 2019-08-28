import React from "react";
<<<<<<< HEAD
import ErrorBoundary from "../UI/ErrorHandler/ErrorHandler";
import axios from "../../axios/axios-blogs";
=======
>>>>>>> 3cf66d7d6bef4d083e578574db6c9e355ef922d5
import "./userProfile.css";
import HeadingSection from "./userProfileComponent/headingSection";
import ProfileOptions from "./userProfileComponent/profieOptions";
import "./profileOption.css";
import { connect } from "react-redux";

class UserProfile extends React.Component {
  render() {
    return (
      <div className="hero is-fullheight">
        <div className="hero-head">
          <HeadingSection {...this.props} />
        </div>
        <div className="hero-body" style={{ padding: "0px", display: "block" }}>
          <ProfileOptions />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    username: state.persistedReducer.username,
    loggedIn: state.persistedReducer.loggedIn,
    likedPosts: state.persistedReducer.likedPosts,
    myPosts: state.persistedReducer.myPosts
  };
};

export default ErrorBoundary(connect(mapStateToProps)(UserProfile), axios);
