import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { createContext, useState, useContext } from "react";

export const ListContext = createContext();
const serverip = process.env.EXPO_PUBLIC_SERVERIP;

export const PostProvider = ({ children }) => {
  const [postState, setPostState] = useState([]);

  const addItem = async (newItem) => {
    try {
      const response = await axios.post(
        `http://${serverip}:6969/posts/`,
        newItem,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            accessToken: await AsyncStorage.getItem("accessToken"),
          },
        }
      );

      const savedItem = response.data;

      setPostState((prev) => [savedItem, ...prev]);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const removeItem = async (id) => {
    axios
      .delete(`http://${serverip}:6969/posts/${id}`, {
        headers: {
          accessToken: await AsyncStorage.getItem("accessToken"),
        },
      })
      .then(() => {
        setPostState((prev) => prev.filter((item) => item.id !== id));

        router.push("/");
      });
  };

  const updateItem = async (updatedItem) => {
    // yet to come
  };

  return (
    <ListContext.Provider
      value={{ postState, setPostState, addItem, removeItem, updateItem }}>
      {children}
    </ListContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(ListContext);
  if (!context) {
    throw new Error("useListContext must be used within a PostProvider");
  }
  return context;
};

export default PostProvider;
