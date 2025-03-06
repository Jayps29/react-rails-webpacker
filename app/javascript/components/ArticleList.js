import React from "react";
import PropTypes from "prop-types";
import WarningMessage from "./WarningMessage";

class ArticleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      error: "",
      warningMessage: "",
      articleToDelete: null,
    };
  }

  componentDidMount() {
    this.fetchArticles();
  }

  fetchArticles = async () => {
    try {
      const response = await fetch("/articles.json");
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch articles.");
      }

      this.setState({ articles: data });
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  handleCreate = () => {
    window.location.href = "/articles/new";
  };

  handleEdit = (id) => {
    window.location.href = `/articles/new?id=${id}`;
  };

  handleDelete = (id) => {
    this.setState({
      warningMessage: "Are you sure you want to delete this article?",
      articleToDelete: id,
    });
  };

  confirmDelete = async () => {
    const { articleToDelete } = this.state;
    if (!articleToDelete) return;

    try {
      const response = await fetch(`/articles/${articleToDelete}`, {
        method: "DELETE",
        headers: {
          "X-CSRF-Token": document.querySelector("meta[name='csrf-token']").getAttribute("content"),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete article.");
      }

      this.setState({ warningMessage: "", articleToDelete: null });
      alert("Article deleted successfully!");
      this.fetchArticles();
    } catch (error) {
      this.setState({ error: error.message, warningMessage: "", articleToDelete: null });
    }
  };

  cancelWarning = () => {
    this.setState({ warningMessage: "", articleToDelete: null });
  };

  render() {
    return (
      <div className="max-w-3xl mx-auto mt-10">
        {/* Display Warning Message Outside the Box */}
        {this.state.warningMessage && (
          <div className="mb-4">
            <WarningMessage
              message={this.state.warningMessage}
              onConfirm={this.confirmDelete}
              onCancel={this.cancelWarning}
            />
          </div>
        )}

        <div className="p-6 bg-white shadow-md rounded-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Article List</h2>

          {this.state.error && <p className="text-red-500 mb-4">{this.state.error}</p>}

          <button 
            onClick={this.handleCreate} 
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create New Article
          </button>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 text-left">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 border">ID</th>
                  <th className="p-3 border">Title</th>
                  <th className="p-3 border">Content</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.state.articles.length > 0 ? (
                  this.state.articles.map((article) => (
                    <tr key={article.id} className="border">
                      <td className="p-3 border">{article.id}</td>
                      <td className="p-3 border">{article.title}</td>
                      <td className="p-3 border">{article.content}</td>
                      <td className="p-3 border flex gap-2">
                        <button 
                          onClick={() => this.handleEdit(article.id)} 
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => this.handleDelete(article.id)} 
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-3 text-center text-gray-500">No articles found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

ArticleList.propTypes = {
  articles: PropTypes.array,
};

export default ArticleList;
