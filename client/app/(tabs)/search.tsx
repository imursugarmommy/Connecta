import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import axios from 'axios';
import { router } from 'expo-router';
import PostTemplate from '@/components/PostTemplate';

const serverip = process.env.EXPO_PUBLIC_SERVERIP;

type Post = {
  id: number;
  title: string;
  content: string;
  username: string;
  comments: number;
  likes: number;
};

export default function SearchScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    axios.get(`http://${serverip}:6969/posts`,)
        .then((response) => {
          setPosts(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
      }, []);

  const updateSearch = (search: string) => {
    setSearch(search);
    axios.get(`http://${serverip}:6969/posts`, { params: { searchparam: search } })
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={{ height: 10 }} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.headline}>Suche</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgb(255, 255, 255)" />
      <TextInput
        placeholder="Nach was suchst du diesmal?"
        onChangeText={updateSearch}
        value={search}
        style={{ borderWidth: 1, borderColor: 'black', width: '80%', padding: 5 }}
      />
      <ScrollView className="w-full h-full p-4">
        {posts.map((post) => (
          <TouchableOpacity
            onPress={() => router.push(`/post/${post.id}` as any)}
            key={post.id}>
            <PostTemplate post={post} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  headline: {
    fontSize: 24,
    fontWeight: 'bold',
  }
});