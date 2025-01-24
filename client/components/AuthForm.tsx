import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

import { Formik, Field, ErrorMessage } from "formik/dist/index";

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

  function capitalizeFirstLetter(val: string) {
    return val.charAt(0).toUpperCase() + String(val).slice(1);
  }

  return (
    <View className="w-full">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}>
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
                      className="text-black dark:text-text-dark w-auto"
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

                  <View className="relative">
                    <Field
                      name={key}
                      component={CustomInput}
                      placeholder={capitalizedKey}
                      error={errors[key] && touched[key]}
                      checkUsername={
                        key === "username" ? checkForUsername : null
                      }
                    />
                    {errorMessage === "Username already exists" &&
                      key === "username" && (
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
                className="bg-[#FFD343] py-2 rounded-md w-full items-center"
                disabled={
                  errors.username ||
                  errors.password ||
                  errorMessage === "Username already exists"
                    ? true
                    : false
                }
                style={{
                  backgroundColor:
                    errors.username ||
                    errors.password ||
                    errorMessage === "Username already exists"
                      ? "rgba(255, 211, 67, 0.2)"
                      : "#FFD343",
                }}>
                <Text className="text-white text-lg">{value}</Text>
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
