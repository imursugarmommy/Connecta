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
  const [usernameExists, setUsernameExists] = useState(false);

  const { authState } = useAuth();

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

  const checkForUsername = (username: string) => {
    setUsernameExists(false);
    setErrorMessage("");

    setTimeout(() => {
      axios.get("http://192.168.178.170:6969/users/" + username).then((res) => {
        if (res.data) {
          setUsernameExists(true);
          setErrorMessage("Username already exists");
        }
      });
    }, 500);
  };

  const onSubmit = (data: any) => {
    setErrorMessage("");

    axios.post("http://192.168.178.170:6969/users", data).then((res) => {
      if (res.data.error) setErrorMessage(res.data.error);
      else router.push("/auth/login");
    });
  };

  return (
    <View className="flex-1 items-center bg-white dark:bg-black p-8">
      <Text className="text-5xl text-text-light dark:text-text-dark w-full justify-start mb-6">
        Register
      </Text>

      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}>
        {({ handleSubmit, errors, touched }) => (
          <View className="w-full">
            <View
              className="w-full"
              key="email">
              <View className="flex-row items-center justify-between w-full">
                <Text
                  className="text-black dark:text-text-dark w-auto"
                  style={{
                    color:
                      errors["email"] && touched["email"] ? "red" : "#FFD343",
                  }}>
                  Email:
                </Text>
                <ErrorMessage name="email">
                  {(msg) => <Text className="text-red-500 w-auto">{msg}</Text>}
                </ErrorMessage>
              </View>

              <Field
                name="email"
                component={CustomInput}
                placeholder="Email"
                error={errors["email"] && touched["email"]}
              />
            </View>

            <View
              className="w-full"
              key="username">
              <View className="flex-row items-center justify-between w-full">
                <Text
                  className="text-black dark:text-text-dark w-auto"
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

              <View className="relative">
                <Field
                  name="username"
                  component={CustomInput}
                  placeholder="Username"
                  error={errors["username"] && touched["username"]}
                  checkUsername={checkForUsername}
                />

                {usernameExists && (
                  <Text className="text-red-500 text-lg absolute right-0">
                    X
                  </Text>
                )}
              </View>
            </View>

            <View
              className="w-full"
              key="password">
              <View className="flex-row items-center justify-between w-full">
                <Text
                  className="text-black dark:text-text-dark w-auto"
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
                disabled={
                  errorMessage ||
                  errors.username ||
                  errors.password ||
                  errors.email
                    ? true
                    : false
                }
                style={{
                  backgroundColor:
                    errorMessage ||
                    errors.username ||
                    errors.password ||
                    errors.email
                      ? "rgba(255, 211, 67, 0.2)"
                      : "#FFD343",
                }}>
                <Text className="text-white text-lg">Register</Text>
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
  checkUsername,
  ...props
}: {
  field: any;
  form: any;
  error: boolean;
  checkUsername?: any;
}) => {
  return (
    <TextInput
      value={field.value}
      onChangeText={(text) => {
        form.handleChange(field.name)(text);
        if (checkUsername) checkUsername(text);
      }}
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
