import React from "react";
import { Modal, View, Image, TouchableOpacity, StyleSheet } from "react-native";

const EnlargedImageModal = ({
  visible,
  imageUri,
  onClose,
}: {
  visible: boolean;
  imageUri: string | undefined;
  onClose: () => void;
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade">
      <TouchableOpacity
        style={styles.overlay}
        onPress={onClose}>
        <View style={styles.container}>
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "90%",
    height: "90%",
  },
});

export default EnlargedImageModal;
