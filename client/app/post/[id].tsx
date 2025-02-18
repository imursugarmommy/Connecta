import React, { useEffect, useState, useContext, useRef } from "react";
import { useLocalSearchParams } from "expo-router";
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

function Post() {
  let { id } = useLocalSearchParams();
  const [postObj, setPostObj] = useState({
    id: 1,
    title: "Cock",
    content: "Koks und Heroin",
    username: "imursugarmomm",
    comments: 2,
    likes: 310,
  });
  const [comments, setComments] = useState([
    {
      username: "lelv",
      commentBody: "Not again",
    },
    {
      username: "EpicGamer69420",
      commentBody: "Fuck you man",
    },
  ]);
  const [newComment, setNewComment] = useState("");

  const { authState } = useContext(AuthContext);
  // const navigate = useNavigate();

  const maxCharLimit = 150;

  // useEffect(() => {
  //   axios.get(`http://localhost:3002/posts/byid/${id}`).then((res) => {
  //     setPostObj(res.data);
  //   });

  //   axios.get(`http://localhost:3002/comments/${id}`).then((res) => {
  //     setComments(res.data);
  //   });
  // }, []);

  // const addComment = () => {
  //   axios
  //     .post(
  //       "http://localhost:3002/comments",
  //       {
  //         commentBody: newComment,
  //         PostId: id,
  //       },
  //       // check if user is logged in
  //       {
  //         headers: {
  //           accessToken: localStorage.getItem("accessToken"),
  //         },
  //       }
  //     )
  //     .then((res) => {
  //       console.log(res.data);

  //       if (res.data.error) alert(res.data.error);
  //       else {
  //         const commentToAdd = {
  //           commentBody: newComment,
  //           username: res.data.username,
  //           // ensure comment id is also in this object to prevent bug:
  //           // newly added comments can not be deleted bc of missing id
  //           id: res.data.id,
  //         };

  //         setComments([...comments, commentToAdd]);

  //         setNewComment("");
  //       }
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // };

  // const deleteComment = (id) => {
  //   axios
  //     .delete(
  //       `http://localhost:3002/comments/${id}`,
  //       // check if user is logged in
  //       {
  //         headers: {
  //           accessToken: localStorage.getItem("accessToken"),
  //         },
  //       }
  //     )
  //     .then(() => {
  //       setComments(
  //         comments.filter((val) => {
  //           // * next Time: prevent bug where comment is not deleted bc of missing id (include it in comments from beginning)
  //           return val.id !== id;
  //         })
  //       );
  //     });
  // };

  // const deletePost = (id) => {
  //   axios
  //     .delete(
  //       `http://localhost:3002/posts/${id}`,
  //       // check if user is logged in
  //       {
  //         headers: {
  //           accessToken: localStorage.getItem("accessToken"),
  //         },
  //       }
  //     )
  //     .then(() => {
  //       navigate("/");
  //     });
  // };

  // const editPost = (option) => {
  //   if (authState.username !== postObj.username) return;

  //   if (option === "title") changeTitle();
  //   else if (option === "body") changePostText();
  // };

  // function changeTitle() {
  //   const newTitle = prompt("Enter new title:", postObj.title);

  //   if (!newTitle) return;

  //   axios.put(
  //     `http://localhost:3002/posts/title`,
  //     { newTitle, id },
  //     {
  //       headers: {
  //         accessToken: localStorage.getItem("accessToken"),
  //       },
  //     }
  //   );

  //   setPostObj({ ...postObj, title: newTitle });
  // }

  // function changePostText() {
  //   const newPostText = prompt("Enter new post text:", postObj.content);

  //   if (!newPostText) return;

  //   axios.put(
  //     `http://localhost:3002/posts/postText`,
  //     { newText: newPostText, id },
  //     {
  //       headers: {
  //         accessToken: localStorage.getItem("accessToken"),
  //       },
  //     }
  //   );

  //   setPostObj({ ...postObj, postText: newPostText });
  // }

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        <View className="items-center">
          <PostTemplate post={postObj} />
        </View>
        <View className="w-full items-center p-4">
          <View className="w-full items-center">
            {comments.map((comment, key) => {
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
                    {authState.username === comment.username && (
                      <TouchableOpacity className="p-2">
                        <Trash2
                          color="black"
                          size={16}
                        />
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
            placeholder="What's your opinion?"
            value={newComment}
            // onChange={(e) => setNewComment(e.target.value)}
            maxLength={maxCharLimit}
            className="p-2 flex-grow border border-gray-200 bg-white rounded-lg"
          />
          <TouchableOpacity
            // onPress={addComment}
            className="items-center p-8 py-2 bg-[#ffd455] rounded-2xl">
            <Text className="text-white">Reply</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

export default Post;
