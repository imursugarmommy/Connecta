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

interface Comment {
  id: number;
  username: string;
  commentBody: string;
}

function Post() {
  const { postState, setPostState } = usePosts();

  let { id } = useLocalSearchParams();

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

  if (Object.keys(postObj).length === 0 && postObj.constructor === Object)
    return <Text>Loading...</Text>;

  const addComment = async () => {
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
    console.log("deleting comment with id: ", id);

    axios
      .delete(`http://${serverip}:6969/comments/${id}`, {
        headers: {
          accessToken: await AsyncStorage.getItem("accessToken"),
        },
      })
      .then(() => {
        console.log("comment deleting ...");

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

        console.log("comment deleted");
      });
  };

  return (
    <View className="flex-1 bg-white">
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
        <View className="w-full items-center">
          <View className="w-full items-center">
            {comments.map((comment: Comment, key) => {
              return (
                <View
                  className="w-full border border-gray-200 rounded-lg my-2"
                  key={key}>
                  <View className="flex p-2 px-4 flex-row justify-between">
                    <View>
                      <View className="flex-row justify-between items-center">
                        <Text className="font-bold">{comment.username}:</Text>
                      </View>
                      <View>
                        <Text>{comment.commentBody}</Text>
                      </View>
                    </View>
                    {/* TODO: fix wierd bug where the comment get deleted only after 3 times pressing */}
                    {authState.username === comment.username && (
                      <TouchableOpacity
                        onPress={() => deleteComment(comment.id)}
                        className="p-2 bg-gray-200">
                        <TouchableOpacity>
                          <Trash2
                            color="black"
                            size={16}
                          />
                        </TouchableOpacity>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <KeyboardAvoidingView
        behavior="position"
        keyboardVerticalOffset={70}
        className="w-full bg-black absolute bottom-0">
        <View className="flex-row flex-grow items-center justify-between px-4 py-2 pb-10 gap-x-4 bg-gray-500">
          <TextInput
            ref={inputRef}
            placeholder="What's your opinion?"
            value={newComment}
            onChangeText={(text) => setNewComment(text)}
            maxLength={maxCharLimit}
            className="p-2 flex-grow border border-gray-200 bg-white rounded-lg"
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
