import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";

import * as Yup from "yup";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useAuth } from "../helpers/AuthContext";

import { Formik, Field, ErrorMessage, Form } from "formik";
import { router } from "expo-router";

const login = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const { login, authState } = useAuth();

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).required("Username is required"),
    password: Yup.string().min(3).required("Password is required"),
  });

  const onSubmit = async (data: any) => {
    setErrorMessage("");

    try {
      const loginResponse = await axios.post(
        "http://192.168.178.170:6969/users/login",
        data
      );

      if (loginResponse.data.error)
        return setErrorMessage(loginResponse.data.error);

      const userResponse = await axios.get(
        `http://192.168.178.170:6969/users/${data.username}`
      );

      if (userResponse.data.error)
        return setErrorMessage(userResponse.data.error);

      await AsyncStorage.setItem("accessToken", loginResponse.data);

      login({
        ...authState,
        id: userResponse.data.id,
        email: userResponse.data.email,
        username: data.username,
        state: true,
      });

      setErrorMessage("");

      router.push("/");
    } catch (error) {
      console.error("An error occurred:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <View className="flex-1 items-center bg-white dark:bg-black p-8">
      <Text className="text-5xl text-text-light dark:text-text-dark w-full justify-start mb-6">
        Sign in
      </Text>

      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}>
        {({ handleSubmit, errors, touched }) => (
          <View className="w-full">
            <View
              className="w-full"
              key="username">
              <View className="flex-row items-center justify-between w-full">
                <Text
                  className="tex-black dark:text-text-dark w-auto"
                  style={{
                    color:
                      errors["username"] && touched["username"]
                        ? "red"
                        : "#FFD343",
                  }}>
                  Username:
                </Text>
                <ErrorMessage name="username">
                  {(msg) => <Text className="text-red-500 w-auto">{msg}</Text>}
                </ErrorMessage>
              </View>

              <Field
                name="username"
                component={CustomInput}
                placeholder="Username"
                error={errors["username"] && touched["username"]}
              />
            </View>

            <View
              className="w-full"
              key="password">
              <View className="flex-row items-center justify-between w-full">
                <Text
                  className="tex-black dark:text-text-dark w-auto"
                  style={{
                    color:
                      errors["password"] && touched["password"]
                        ? "red"
                        : "#FFD343",
                  }}>
                  Password:
                </Text>
                <ErrorMessage name="password">
                  {(msg) => <Text className="text-red-500 w-auto">{msg}</Text>}
                </ErrorMessage>
              </View>

              <Field
                name="password"
                component={CustomInput}
                placeholder="Password"
                error={errors["password"] && touched["password"]}
              />
            </View>

            {errorMessage && (
              <View className="flex-row items-center gap-2">
                <Text className="text-red-500 ">{errorMessage}</Text>
              </View>
            )}

            <View className="mt-6">
              <TouchableOpacity
                onPress={() => handleSubmit()}
                className="bg-[#FFD343] py-2 rounded-md w-full items-center"
                disabled={errors.username || errors.password ? true : false}
                style={{
                  backgroundColor:
                    errors.username || errors.password
                      ? "rgba(255, 211, 67, 0.2)"
                      : "#FFD343",
                }}>
                <Text className="text-white text-lg">Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

const CustomInput = ({
  field,
  form,
  error,
  ...props
}: {
  field: any;
  form: any;
  error: boolean;
}) => {
  return (
    <TextInput
      value={field.value}
      onChangeText={form.handleChange(field.name)}
      onBlur={form.handleBlur(field.name)}
      secureTextEntry={field.name === "password"}
      {...props}
      className="border-b-1 rounded-md p-3 mb-2 w-full text-text-light dark:text-text-dark"
      style={{
        borderColor: error ? "red" : "#FFD343",
        borderBottomWidth: 1,
        color: error ? "#C81E1E" : "black",
      }}
    />
  );
};

export default login;
