class ArticlesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_article, only: %i[show update destroy]

  def index
    @articles = Article.page(params[:page]).per(5) # Paginate with 5 articles per page
  
    respond_to do |format|
      format.html
      format.json { render json: { articles: @articles, pagination: pagination_data(@articles) } }
    end
  end

  def show
    render json: @article
  end

  def create
    @article = Article.new(article_params)

    if @article.save
      render json: @article, status: :created
    else
      render json: { errors: @article.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @article.update(article_params)
      render json: @article, status: :ok
    else
      render json: { errors: @article.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    if @article.destroy
      render json: { message: "Article deleted successfully!" }, status: :ok
    else
      render json: { error: "Failed to delete article." }, status: :unprocessable_entity
    end
  end

  private

  def set_article
    @article = Article.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Article not found." }, status: :not_found
  end

  def article_params
    params.require(:article).permit(:title, :content)
  end

  def pagination_data(collection)
    {
      current_page: collection.current_page,
      total_pages: collection.total_pages,
      total_count: collection.total_count
    }
  end
  
end
