import axios from "axios";
import React, { Component } from "react";
import Editor from "../editor/Editor";
import { Link } from "react-router-dom";
import image from "../../assets/img/logo.jpg";
import DropDown from "../dropdown/dropdown";
import Spinner from "../UI/Spinner/Spinner";
import Modal from "react-responsive-modal";
import { connect } from "react-redux";

class Publish extends Component {
  constructor(props) {
    super(props);

    this.state = {
      warning: false,
      loading: false,
      posted: false,
      content: "",
      title: "",
      tags: ["python", "interview"]
    };

    this.handlePost = this.handlePost.bind(this);
    this.successPosted = this.successPosted.bind(this);
    this.updateContent = this.updateContent.bind(this);
  }

  handlePost() {
    const token = localStorage.getItem("token");

    const post = {
      author: this.props.username,
      title: this.state.title,
      content: this.state.content,
      tags: this.state.tags || []
    };
    this.setState({ loading: true });

    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`
      }
    };

    axios
      .post(`${process.env.REACT_APP_BACKEND_SERVER}/api/posts`, post, headers)
      .then(res => {
        axios.post(
          `${process.env.REACT_APP_BACKEND_SERVER}/api/users/myPosts/${
          this.props.userID
          }`,
          { postID: res.data._id },
          headers
        )
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.log(err);
          });
        var newMyPosts = this.props.myPosts;
        newMyPosts.push(res.data._id);
        this.props.handleMyPosts(newMyPosts);
      })
      .catch(err => {
        console.log(err);
      });
    this.setState({ posted: true, loading: false });
  }

  updateContent = value => {
    this.setState({ content: value });
  };

  handleCancel = () => {
    this.setState({ warning: true });
  };

  onCloseModal = () => {
    this.setState({ warning: false });
  };
  // handleTags = e => {
  //   e.preventDefault();
  //   this.setState({ tags: e.target.value });
  // };

  handleTitle = e => {
    e.preventDefault();
    this.setState({ title: e.target.value });
  };
  successPosted() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "10%"
        }}
      >
        <i
          className="far fa-check-circle "
          style={{
            color: "green",
            fontSize: "100px",
            margin: "auto auto "
          }}
        />
        <p
          style={{
            marginTop: "10%",
            margin: "auto auto"
          }}
        >
          Successfully Posted
        </p>
        <Link
          to="/index"
          className="button is-success"
          style={{
            marginTop: "10%",
            width: "10%",
            margin: "auto auto"
          }}
        >
          Main Page
        </Link>
      </div>
    );
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <nav
            className="navbar"
            role="navigation"
            aria-label="main navigation"
          >
            <div className="navbar-brand">
              <div className="navbar-item">
                <Link to="/index">
                  <img src={image} width="112" height="48" alt="logo" />
                </Link>
              </div>
            </div>

            <div id="navbarBasicExample" className="navbar-menu">
              <div className="navbar-start" />
              <DropDown lists={["Save", "Draft"]} />
            </div>
          </nav>
        </div>
        <div style={{ width: "80%", margin: "auto auto" }}>
          {this.state.loading ? (
            <Spinner />
          ) : this.state.posted ? (
            this.successPosted()
          ) : (
                <React.Fragment>
                  <form onSubmit={this.handlePost}>
                    <input
                      className="input is-rounded"
                      type="text"
                      required
                      placeholder="Enter Your Title..."
                      value={this.state.title}
                      onChange={this.handleTitle}
                    />
                    <input
                      className="input is-rounded"
                      type="text"
                      placeholder="Enter Your Tags..."
                    />
                    <div style={{ margin: "auto auto" }}>
                      <Editor
                        updateContent={this.updateContent}
                        value={this.state.content}
                      />
                    </div>
                    <div class="level-left">
                      <button
                        className="button is-primary level-item"
                        type="submit"
                      >
                        Post
                  </button>
                      <button
                        className="button is-primary level-item"
                        onClick={this.handleCancel}
                      >
                        Cancel
                  </button>
                    </div>
                  </form>
                </React.Fragment>
              )}
        </div>
        <Modal
          className="modal-lg"
          open={this.state.warning}
          onClose={this.onCloseModal}
          center
        >
          <div>
            <h1>
              <strong>Warning</strong>
            </h1>
            <p style={{ color: "red" }}>Your Post Will Not Be Saved</p>
            <Link className="button is-link" to="/index">
              Okay, I Got It
            </Link>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    username: state.username,
    userID: state.userID,
    myPosts: state.myPosts
  };
};


const mapDispatchToProps = dispatch => {
  return {
    handleMyPosts: (newMyPosts) =>
      dispatch({
        type: "PUBLISHEDNEWPOST",
        myPosts: newMyPosts
      }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Publish);
