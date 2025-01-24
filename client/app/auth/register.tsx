import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";

import * as Yup from "yup";

import axios from "axios";

import { router } from "expo-router";

import AuthForm from "../../components/AuthForm";

const login = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const initialValues = {
    email: "",
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().min(3).required("Name is required"),
    username: Yup.string().min(3).required("Username is required"),
    password: Yup.string().min(3).required("Password is required"),
  });

  const onSubmit = (data: any) => {
    setErrorMessage("");

    axios.post("http://192.168.178.170:6969/users", data).then((res) => {
      if (res.data.error) setErrorMessage(res.data.error);
      else router.push("/auth/login");
    });
  };

  const checkForUsername = (username: string) => {
    setErrorMessage("Loading...");

    setTimeout(() => {
      axios.get("http://192.168.178.170:6969/users/" + username).then((res) => {
        if (res.data) return setErrorMessage("Username already exists");

        setErrorMessage("");
      });
    }, 500);
  };

  return (
    <View className="flex-1 items-center bg-white dark:bg-black p-8">
      <Text className="text-5xl text-text-light dark:text-text-dark w-full justify-start mb-6">
        Register
      </Text>

      <AuthForm
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={onSubmit}
        value={"Register"}
        errorMessage={errorMessage}
        checkForUsername={checkForUsername}
      />
    </View>
  );
};

export default login;
