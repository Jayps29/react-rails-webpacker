import React from "react";
import PropTypes from "prop-types";

class NewArticle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      content: "",
      errors: ""
    };
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value, errors: "" });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { title, content } = this.state;

    if (title.trim() === "" || content.trim() === "") {
      this.setState({ errors: "Title and content cannot be empty." });
      return;
    }

    try {
      const response = await fetch("/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": document.querySelector("meta[name='csrf-token']").getAttribute("content"),
        },
        body: JSON.stringify({ article: { title, content } }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors.join(", "));
      }

      alert("Article created successfully!");
      this.setState({ title: "", content: "", errors: "" }); // Clear form
    } catch (error) {
      this.setState({ errors: error.message });
    }
  };

  handleBack = () => {
    window.location.href = "http://localhost:3000";
  };

  render() {
    return (
      <React.Fragment>
        <h2>Create New Article</h2>
        {this.state.errors && <p style={{ color: "red" }}>{this.state.errors}</p>}
        <form onSubmit={this.handleSubmit}>
          <div>
            <label>Title:</label>
            <input 
              type="text" 
              name="title" 
              value={this.state.title} 
              onChange={this.handleChange} 
            />
          </div>
          <div>
            <label>Content:</label>
            <textarea 
              name="content" 
              value={this.state.content} 
              onChange={this.handleChange} 
            />
          </div>
          <button type="submit">Submit</button>
        </form>
        <button onClick={this.handleBack} style={{ marginTop: "10px" }}>Back</button>
      </React.Fragment>
    );
  }
}

NewArticle.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string
};

export default NewArticle;