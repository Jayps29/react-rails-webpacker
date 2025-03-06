import React from "react";
import PropTypes from "prop-types";

class NewArticle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      content: "",
      errors: "",
      isEditing: false, // Track editing mode
      articleId: null, // Store article ID when editing
    };
  }

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get("id");

    if (articleId) {
      this.fetchArticle(articleId);
    }
  }

  fetchArticle = async (id) => {
    try {
      const response = await fetch(`/articles/${id}.json`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch article details.");
      }

      this.setState({ title: data.title, content: data.content, isEditing: true, articleId: id });
    } catch (error) {
      this.setState({ errors: error.message });
    }
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value, errors: "" });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { title, content, isEditing, articleId } = this.state;

    if (title.trim() === "" || content.trim() === "") {
      this.setState({ errors: "Title and content cannot be empty." });
      return;
    }

    const url = isEditing ? `/articles/${articleId}` : "/articles";
    const method = isEditing ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": document.querySelector("meta[name='csrf-token']").getAttribute("content"),
        },
        body: JSON.stringify({ article: { title, content } }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors?.join(", ") || "Failed to save article.");
      }

      alert(isEditing ? "Article updated successfully!" : "Article created successfully!");
      window.location.href = "/";
    } catch (error) {
      this.setState({ errors: error.message });
    }
  };

  handleBack = () => {
    window.location.href = "/";
  };

  render() {
    return (
      <React.Fragment>
        <h2>{this.state.isEditing ? "Edit Article" : "Create New Article"}</h2>
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
          <button type="submit">{this.state.isEditing ? "Update" : "Submit"}</button>
        </form>
        <button onClick={this.handleBack} style={{ marginTop: "10px" }}>Back</button>
      </React.Fragment>
    );
  }
}

NewArticle.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
};

export default NewArticle;
