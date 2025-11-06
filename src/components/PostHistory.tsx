import React, { useState } from 'react';
import { usePostApi } from '../hooks/useApi';
import '../CSS/Home.css';

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface PostHistoryProps {
  initialPosts: Post[];
  pagination: PaginationInfo;
  onPostsUpdate: (posts: Post[], pagination: PaginationInfo) => void;
}

const PostHistory: React.FC<PostHistoryProps> = ({ 
  initialPosts, 
  pagination, 
  onPostsUpdate 
}) => {
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [createPost, { error: createError, loading: createLoading }] = usePostApi('/create-post');

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      return;
    }

    const result = await createPost({
      title: newPostTitle,
      content: newPostContent,
    });

    if (result) {
      // Reset form
      setNewPostTitle('');
      setNewPostContent('');
      setIsCreatingPost(false);
      
      // Refresh posts list
      fetchPosts(1);
    }
  };

  const fetchPosts = async (page: number) => {
    try {
      const response = await fetch(`/get-user-posts?page=${page}&limit=${pagination.limit}`);
      if (response.ok) {
        const data = await response.json();
        onPostsUpdate(data.posts, data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="post-history-section">
      <div className="section-header">
        <h3>Post History</h3>
        <button 
          className="create-post-btn"
          onClick={() => setIsCreatingPost(!isCreatingPost)}
        >
          {isCreatingPost ? 'Cancel' : 'Create New Post'}
        </button>
      </div>

      {isCreatingPost && (
        <div className="create-post-form">
          <form onSubmit={handleCreatePost}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                placeholder="Enter post title..."
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Write your post content..."
                rows={4}
                required
              />
            </div>
            {createError && <div className="error-message">{createError}</div>}
            <button type="submit" disabled={createLoading} className="submit-btn">
              {createLoading ? 'Creating...' : 'Create Post'}
            </button>
          </form>
        </div>
      )}

      {initialPosts.length === 0 ? (
        <div className="no-posts">
          <p>No posts yet. Create your first post!</p>
        </div>
      ) : (
        <div className="posts-list">
          {initialPosts.map((post) => (
            <div key={post.id} className="post-card">
              <h4 className="post-title">{post.title}</h4>
              <p className="post-content">{post.content}</p>
              <div className="post-meta">
                <span className="post-date">Created: {formatDate(post.createdAt)}</span>
                {post.updatedAt !== post.createdAt && (
                  <span className="post-date">Updated: {formatDate(post.updatedAt)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => fetchPosts(pagination.page - 1)}
            disabled={!pagination.hasPrevPage}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => fetchPosts(pagination.page + 1)}
            disabled={!pagination.hasNextPage}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PostHistory;