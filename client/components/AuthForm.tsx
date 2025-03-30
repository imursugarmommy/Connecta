import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

import { Formik, Field, ErrorMessage } from "formik/dist/index";

function capitalizeFirstLetter(val: string) {
  return val.charAt(0).toUpperCase() + val.slice(1);
}

export default function AuthForm({
  validationSchema,
  initialValues,
  onSubmit,
  value = "Action",
  errorMessage = "",
  checkForUsername,
}: {
  validationSchema: any;
  initialValues: any;
  onSubmit: any;
  value?: string;
  errorMessage?: string;
  checkForUsername?: any;
}) {
  const objectKeysArr = Object.keys(initialValues);

  return (
    <View className="w-full">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        >
        {({ handleSubmit, errors, touched }) => (
          <View>
            {objectKeysArr.map((key) => {
              const capitalizedKey = capitalizeFirstLetter(key);

              return (
                <View
                  className="w-full"
                  key={key}>
                  <View className="flex-row items-center justify-between w-full">
                    <Text
                      className="text-black dark:text-white w-auto"
                      style={{
                        color: errors[key] && touched[key] ? "red" : "#FFD343",
                      }}>
                      {capitalizedKey}:
                    </Text>
                    <ErrorMessage name={key}>
                      {(msg) => (
                        <Text className="text-red-500 w-auto">{msg}</Text>
                      )}
                    </ErrorMessage>
                  </View>

                  <View className="relative dark:text-white">
                    <Field
                      name={key}
                      component={CustomInput}
                      placeholder={capitalizedKey}
                      error={errors[key] && touched[key]}
                      checkUsername={
                        key === "username" || key === "email"
                          ? checkForUsername
                          : null
                      }
                    />
                    {(errorMessage === `${capitalizedKey} already exists` ||
                      errorMessage === "Username does not exist") &&
                      (key === "username" || key === "email") && (
                        <Text className="text-red-500 text-lg absolute right-0">
                          X
                        </Text>
                      )}
                  </View>
                </View>
              );
            })}

            {errorMessage && (
              <View className="flex-row items-center gap-2">
                <Text className="text-red-500 ">{errorMessage}</Text>
              </View>
            )}

            <View className="mt-6">
              <TouchableOpacity
                onPress={() => handleSubmit()}
                className="bg-[#FFD343] dark:bg-white py-2 rounded-md w-full items-center"
                disabled={
                  objectKeysArr.some((key) => errors[key] && touched[key]) ||
                  (errorMessage &&
                    errorMessage !== "Wrong username or password")
                    ? true
                    : false
                }
                style={{
                  backgroundColor:
                    objectKeysArr.some((key) => errors[key] && touched[key]) ||
                    (errorMessage &&
                      errorMessage !== "Wrong username or password")
                      ? "rgba(255, 211, 67, 0.2)"
                      : "#FFD343",
                }}>
                <Text className="text-white dark:text-black text-lg">{value}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
}

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
        if (checkUsername)
          checkUsername(text, capitalizeFirstLetter(field.name));
      }}
      onBlur={form.handleBlur(field.name)}
      secureTextEntry={field.name === "password"}
      keyboardType={field.name === "email" ? "email-address" : "default"}
      {...props}
      className="border-b-1 rounded-md p-3 mb-2 w-full text-text-light dark:text-white"
      style={{
        borderColor: error ? "red" : "#FFD343",
        borderBottomWidth: 1,
        color: error ? "#C81E1E" : "black",
      }}
    />
  );
};
