import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ApiService from '../services/ApiService';
import PostListItem from '../components/PostListItem';

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // fetch posts from the API
    ApiService.getPosts()
      .then(setPosts)
      .catch(error => console.log('Error fetching posts:', error));
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
        renderItem={({ item }) => <PostListItem post={item} />}
        ListEmptyComponent={<Text>No posts yet.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  }
});

export default HomeScreen; 