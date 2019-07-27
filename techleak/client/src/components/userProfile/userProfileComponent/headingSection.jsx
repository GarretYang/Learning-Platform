import React from "react";
import { connect } from "react-redux";
import axios from "../../../axios-blogs";
import profile from "../../../assets/img/Portrait_Placeholder.png";

var faker = require("faker");

class HeadingSection extends React.Component {
  state = {
    selectedFile: null,
    loading: false
  };

  fileHandler = e => {
    this.setState({
      selectedFile: e.target.files[0]
    });
    var reader = new FileReader();
    reader.onload = function() {
      var dataURL = reader.result;
      var output = document.getElementById("profile");
      output.src = dataURL;
      output.width = 200;
      output.height = 200;
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  handleUpload = () => {
    if (this.state.selectedFile) {
      const data = new FormData();
      data.append("avatar", this.state.selectedFile);
      this.setState({ loading: true });

      const token = localStorage.getItem("token");
      const headers = {
        headers: {
          Authorization: `Token ${token}`,
          withCredentials: true
        }
      };
      axios
        .post(
          `${process.env.REACT_APP_BACKEND_SERVER}/api/users/profile/${
            this.props.userID
          }`,
          data,
          headers
        )
        .then(res => {
          // then print response status
          // new Promise(resolve => setTimeout(resolve, 3000));
          this.setState({ loading: false });
          this.props.updateAvatar(res.data.avatar);
          this.setState({ selectedFile: null });
        })
        .catch(err => {
          this.setState({ loading: false });
          this.setState({ selectedFile: null });
        });
    }
  };
  render() {
    return (
      <div className="section profile-heading">
        <div className="columns is-mobile is-multiline">
          <div
            className="column is-2-tablet is-6-mobile name"
            style={{ textAlign: "center" }}
          >
            <span className="header-icon user-profile-image">
              <img
                id="profile"
                alt=""
                src={this.props.avatar || profile}
                width="200px"
                height="200px"
                style={{ filter: `blur(${this.state.loading ? 2 : 0}px)` }}
              />
              <div className="file is-small">
                <label class="file-label" style={{ margin: "auto" }}>
                  <input
                    class="file-input"
                    ode
                    type="file"
                    name="resume"
                    onChange={this.fileHandler}
                  />
                  <span class="file-cta">
                    <span class="file-icon">
                      <i class="fas fa-upload" />
                    </span>
                    <span class="file-label">Select Images</span>
                  </span>
                </label>
              </div>
              <a
                class={`button is-active is-small ${
                  this.state.loading ? "is-loading" : ""
                }`}
                onClick={this.handleUpload}
              >
                Upload
              </a>
            </span>
          </div>
          <div className="column is-6-tablet is-6-mobile name">
            <p>
              <span className="title is-bold">{this.props.username}</span>
              <br />
              <a
                className="button is-primary is-outlined"
                href="#"
                id="edit-preferences"
                style={{ margin: "5px 0" }}
              >
                Edit Preferences
              </a>
            </p>
            <p className="tagline">
              The users profile bio would go here, of course. It could be two
              lines or more or whatever. We should probably limit the amount of
              characters to ~500 at most though.
            </p>
          </div>
          <div className="column is-1-tablet is-2-mobile has-text-centered" />
          <div className="column is-1-tablet is-4-mobile has-text-centered">
            <p className="stat-val">30</p>
            <p className="stat-key">reputation</p>
          </div>
          <div className="column is-1-tablet is-4-mobile has-text-centered">
            <p className="stat-val">10</p>
            <p className="stat-key">likes</p>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    username: state.persistedReducer.username,
    userID: state.persistedReducer.userID,
    avatar: state.persistedReducer.avatar
  };
};
const mapDispatchToProps = dispatch => {
  return {
    updateAvatar: avatar => dispatch({ type: "UPDATEAVATAR", avatar: avatar })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeadingSection);
