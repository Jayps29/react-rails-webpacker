import React from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

class ArticleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      pagination: { current_page: 1, total_pages: 1 },
      error: "",
      user: null,
    };
  }

  componentDidMount() {
    this.checkAuthentication();
  }

  checkAuthentication = async () => {
    try {
      const response = await fetch("/users/current", { credentials: "include" });
      const data = await response.json();

      if (!data.signed_in) {
        window.location.href = "/users/sign_in";
      } else {
        this.setState({ user: data.user });
        this.fetchArticles();
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
    }
  };

  fetchArticles = async (page = 1) => {
    try {
      const response = await fetch(`/articles.json?page=${page}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch articles.");
      }

      this.setState({
        articles: data.articles || [],
        pagination: data.pagination || { current_page: 1, total_pages: 1 },
      });
    } catch (error) {
      this.setState({ error: error.message });
      Swal.fire("Error", error.message, "error");
    }
  };

  handleCreate = () => {
    window.location.href = "/articles/new";
  };

  handleEdit = (id) => {
    window.location.href = `/articles/new?id=${id}`;
  };

  handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Do you want to delete this article?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/articles/${id}`, {
          method: "DELETE",
          headers: {
            "X-CSRF-Token": document.querySelector("meta[name='csrf-token']").getAttribute("content"),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete article.");
        }

        Swal.fire("Deleted!", "Your article has been deleted.", "success");
        this.fetchArticles();
      } catch (error) {
        this.setState({ error: error.message });
        Swal.fire("Error!", "Failed to delete article.", "error");
      }
    }
  };

  renderPagination = () => {
    const { pagination } = this.state;

    return (
      <div className="mt-4 flex justify-center space-x-2">
        {pagination.current_page > 1 && (
          <button
            onClick={() => this.fetchArticles(pagination.current_page - 1)}
            className="px-4 py-2 bg-gray-300 text-black rounded"
          >
            Previous
          </button>
        )}

        <span className="px-4 py-2 bg-gray-100 border">
          {`Page ${pagination.current_page} of ${pagination.total_pages}`}
        </span>

        {pagination.current_page < pagination.total_pages && (
          <button
            onClick={() => this.fetchArticles(pagination.current_page + 1)}
            className="px-4 py-2 bg-gray-300 text-black rounded"
          >
            Next
          </button>
        )}
      </div>
    );
  };

  render() {
    return (
      <div className="max-w-3xl mx-auto mt-10">
        <div className="p-6 bg-white shadow-md rounded-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Article List</h2>

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
                  
                  <th className="p-3 border">Title</th>
                  <th className="p-3 border">Content</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.state.articles.length > 0 ? (
                  this.state.articles.map((article) => (
                    <tr key={article.id} className="border">
                      
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
          {this.renderPagination()}
        </div>
      </div>
    );
  }
}

ArticleList.propTypes = {
  articles: PropTypes.array,
  pagination: PropTypes.object,
};

ArticleList.defaultProps = {
  articles: [],
  pagination: { current_page: 1, total_pages: 1 },
};

export default ArticleList;
