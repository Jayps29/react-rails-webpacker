import React from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

class NewArticle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      content: "",
      errors: "",
      isEditing: false, 
      articleId: null, 
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
      Swal.fire("Error", error.message, "error");
    }
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value, errors: "" });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { title, content, isEditing, articleId } = this.state;

    if (title.trim() === "" && content.trim() === "") {
      Swal.fire("Error", "Cannot post empty title and content article.", "error");
      return;
    } else if (title.trim() === "") {
      Swal.fire("Error", "Cannot post empty title article.", "error");
      return;
    } else if (content.trim() === "") {
      Swal.fire("Error", "Cannot post empty content article.", "error");
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

      Swal.fire("Success", isEditing ? "Article updated successfully!" : "Article created successfully!", "success").then(() => {
        window.location.href = "/";
      });
    } catch (error) {
      this.setState({ errors: error.message });
      Swal.fire("Error", error.message, "error");
    }
  };

  handleBack = () => {
    window.location.href = "/";
  };

  render() {
    return (
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          {this.state.isEditing ? "Edit Article" : "Create New Article"}
        </h2>
        <form onSubmit={this.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Title:</label>
            <input 
              type="text" 
              name="title" 
              value={this.state.title} 
              onChange={this.handleChange} 
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Content:</label>
            <textarea 
              name="content" 
              value={this.state.content} 
              onChange={this.handleChange} 
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          >
            {this.state.isEditing ? "Update" : "Submit"}
          </button>
        </form>
        <button 
          onClick={this.handleBack} 
          className="w-full mt-4 py-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600"
        >
          Back
        </button>
      </div>
    );
  }
}

NewArticle.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
};

export default NewArticle;
