import React, { useCallback, useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { AuthContext } from "@/app/helpers/AuthContext";

import { Trash2 } from "lucide-react-native";

import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import PostTemplate from "../../components/PostTemplate";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Post as PostType } from "@/types/Post";

import { usePosts } from "../helpers/PostContext";
import { useAuth } from "../helpers/AuthContext";
import BottomSheet from "@gorhom/bottom-sheet";
import LoginReminder from "@/components/ui/LoginReminder";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import BottomSheetComponent from "@/components/ui/BottomSheetComponent";
import Divider from "@/components/ui/Divider";
import { User } from "@/types/User";

interface Comment {
  id: number;
  username: string;
  commentBody: string;
  createdAt: string;
  updatedAt: string;
}

function Post() {
  const { postState, setPostState } = usePosts();

  let { id } = useLocalSearchParams();

  const [userMap, setUserMap] = useState<{ [key: number]: User }>({});
  const [postObj, setPostObj] = useState({} as PostType);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const { authState } = useAuth();

  const inputRef = useRef<TextInput>(null);
  const sheetRef = useRef<BottomSheet>(null);
  const [isOpen, setIsOpen] = useState(false);

  const snapPoints = ["40%"];

  const handleSnapPress = useCallback((index: number) => {
    sheetRef.current?.snapToIndex(index);
    setIsOpen(true);
  }, []);

  useEffect(() => {
    axios.get(`http://${serverip}:6969/posts`).then((res) => {
      setPostState(res.data);
    });
  }, []);

  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withTiming(isOpen ? 1 : 0, { duration: 300 });
  }, [isOpen]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: isOpen ? "rgba(0,0,0,0.2)" : "transparent",
      opacity: opacity.value,
    };
  });

  const serverip = process.env.EXPO_PUBLIC_SERVERIP;

  const maxCharLimit = 150;

  useEffect(() => {
    axios.get(`http://${serverip}:6969/comments/${id}`).then((res) => {
      setComments(res.data);
    });

    axios.get(`http://${serverip}:6969/posts/byid/${id}`).then((res) => {
      const postObj = res.data[0];

      setPostObj(postObj);

      // update corresponding post in global state
      setPostState((prev: any[]) => {
        return prev.map((post) => {
          if (post.id === postObj.id) {
            return postObj;
          } else {
            return post;
          }
        });
      });
    });
  }, []);

  useEffect(() => {
    const foundPost = postState.find(
      (post: PostType) => post.id === parseInt(id as string)
    );
    if (foundPost) {
      setPostObj(foundPost);
    }
  }, [postState, id]);

  useEffect(() => {
    async function fetchUsers() {
      const userPromises = comments.map(async (comment) => {
        const userResponse = await axios.get(
          `http://${serverip}:6969/users/${comment.username}`
        );
        return { id: comment.id, user: userResponse.data[0] };
      });

      const users = await Promise.all(userPromises);
      const userMap = users.reduce((acc, { id, user }) => {
        acc[id] = user;
        return acc;
      }, {} as { [key: number]: User });

      setUserMap(userMap);
    }

    fetchUsers();
  }, [comments]);

  if (Object.keys(postObj).length === 0 && postObj.constructor === Object)
    return <Text>Loading...</Text>;

  const addComment = async () => {
    if (!newComment) return;

    axios
      .post(
        `http://${serverip}:6969/comments`,
        {
          commentBody: newComment,
          PostId: id,
        },
        {
          headers: {
            accessToken: await AsyncStorage.getItem("accessToken"),
          },
        }
      )
      .then((res) => {
        if (res.data.error) {
          inputRef.current?.blur();
          handleSnapPress(0);
          return;
        } else {
          const commentToAdd = {
            commentBody: newComment,
            username: res.data.username,
            // ensure comment id is also in this object to prevent bug:
            // newly added comments can not be deleted bc of missing id
            id: res.data.id,
            createdAt: res.data.createdAt,
            updatedAt: res.data.updatedAt,
          };

          setPostState((prev: any[]) => {
            return prev.map((post) => {
              if (post.id === postObj.id) {
                post.Comments = [commentToAdd, ...post.Comments];
              }
              return post;
            });
          });

          setComments([commentToAdd, ...comments]);

          setNewComment("");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const deleteComment = async (id: number) => {
    axios
      .delete(`http://${serverip}:6969/comments/${id}`, {
        headers: {
          accessToken: await AsyncStorage.getItem("accessToken"),
        },
      })
      .then(() => {
        // remove comment from local state
        setPostState((prev: any[]) => {
          return prev.map((post) => {
            if (post.id === postObj.id) {
              post.Comments = post.Comments.filter(
                (comment: Comment) => comment.id !== id
              );
            }
            return post;
          });
        });

        setComments(
          comments.filter((val) => {
            return val.id !== id;
          })
        );
      });
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Animated.View
        className="absolute top-0 left-0 w-full h-full z-10"
        style={animatedStyle}
      />

      <ScrollView className="flex-1 p-4">
        <View className="items-center">
          <PostTemplate
            post={postObj}
            handleSnapPress={handleSnapPress}
          />
        </View>

        <View className="w-full">
          <Text className="text-sm font-bold text-black">
            Comments ({comments.length}):
          </Text>

          <Divider orientation="horizontal" />

          <View className="w-full items-center p-2">
            {comments.map((comment: Comment, key) => {
              const userData = userMap[comment.id];

              return (
                <View
                  className="w-full my-2 flex flex-row justify-between relative"
                  key={key}>
                  <View className="flex-row gap-x-2 w-full">
                    <Image
                      source={{
                        uri: `http://${serverip}:6969/images/users/${userData?.profileImage}`,
                      }}
                      className="w-8 h-8 rounded-full object-contain bg-gray-200"
                    />

                    <View className="flex-1">
                      <View className="flex-row justify-between items-center">
                        <Text className="font-bold text-[#FFD343]">
                          {userMap[comment.id]?.username}:
                        </Text>
                      </View>

                      <Text>{comment.commentBody}</Text>
                    </View>
                  </View>

                  {authState.username === comment.username && (
                    <TouchableOpacity
                      onPress={() => deleteComment(comment.id)}
                      className="p-2 absolute top-0 right-0">
                      <Trash2
                        color="gray"
                        size={12}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <KeyboardAvoidingView
        behavior="position"
        keyboardVerticalOffset={70}
        className="w-full absolute bottom-0">
        <View className="flex-row flex-grow items-center justify-between px-4 py-2 pb-10 gap-x-4 bg-gray-300">
          <TextInput
            ref={inputRef}
            placeholder="What's your opinion?"
            value={newComment}
            onChangeText={(text) => setNewComment(text)}
            maxLength={maxCharLimit}
            className="p-2 flex-1 border border-gray-200 bg-white rounded-lg"
          />
          <TouchableOpacity
            onPress={addComment}
            className="items-center p-8 py-2 bg-[#ffd455] rounded-2xl">
            <Text className="text-white">Reply</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {isOpen && (
        <BottomSheetComponent
          ref={sheetRef}
          snapPoints={snapPoints}
          isOpen={isOpen}
          setIsOpen={setIsOpen}>
          <LoginReminder />
        </BottomSheetComponent>
      )}
    </View>
  );
}

export default Post;
