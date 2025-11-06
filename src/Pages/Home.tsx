import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import UserInfo from '../components/UserInfo';
import PostHistory from '../components/PostHistory';
import '../CSS/Home.css';

interface User {
  id: number;
  email: string;
  name: string | null;
  username: string;
}

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

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Fetch user info
  const { data: userData, error: userError, loading: userLoading } = useApi<{
    user: User;
    isPremium: boolean;
  }>('/get-user-info');

  // Fetch initial posts
  const { data: postsData, error: postsError, loading: postsLoading } = useApi<{
    posts: Post[];
    pagination: PaginationInfo;
  }>('/get-user-posts?page=1&limit=10');

  useEffect(() => {
    if (postsData) {
      setPosts(postsData.posts);
      setPagination(postsData.pagination);
    }
  }, [postsData]);

  const handlePostsUpdate = (newPosts: Post[], newPagination: PaginationInfo) => {
    setPosts(newPosts);
    setPagination(newPagination);
  };

  if (userLoading || postsLoading) {
    return (
      <div className="home-container">
        <div className="loading">Loading your dashboard...</div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="home-container">
        <div className="error">Error loading user information: {userError}</div>
      </div>
    );
  }

  if (postsError) {
    return (
      <div className="home-container">
        <div className="error">Error loading posts: {postsError}</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="home-container">
        <div className="error">No user data available</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <UserInfo user={userData.user} isPremium={userData.isPremium} />
      <PostHistory
        initialPosts={posts}
        pagination={pagination}
        onPostsUpdate={handlePostsUpdate}
      />
    </div>
  );
};

export default Home;