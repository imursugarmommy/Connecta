import React, { forwardRef } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { ViewStyle } from "react-native";

interface BottomSheetComponentProps {
  snapPoints: string[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
}

const BottomSheetComponent = forwardRef<BottomSheet, BottomSheetComponentProps>(
  ({ snapPoints, isOpen, setIsOpen, children, containerStyle }, ref) => {
    return (
      <BottomSheet
        ref={ref}
        snapPoints={snapPoints}
        containerStyle={[{ zIndex: 999 }, containerStyle]}
        enablePanDownToClose={true}
        onClose={() => setIsOpen(false)}>
        <BottomSheetView>{children}</BottomSheetView>
      </BottomSheet>
    );
  }
);

export default BottomSheetComponent;
