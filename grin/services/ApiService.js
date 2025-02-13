const ApiService = {
  getPosts: async () => {
    // Dummy implementation: returning an empty array
    return [];
  },
  postEntry: async (postData) => {
    // Dummy implementation: assume post is successful
    return { success: true, post: postData };
  }
};

export default ApiService; 