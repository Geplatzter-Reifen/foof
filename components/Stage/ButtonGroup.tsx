import React from "react";
import { Layout } from "@ui-kitten/components";
import { StyleSheet } from "react-native";

interface ButtonGroupProps {
  children: React.ReactNode;
}

function ButtonGroup({ children }: ButtonGroupProps) {
  return (
    <Layout style={style.buttonsContainer} level="2">
      {children}
    </Layout>
  );
}

export default ButtonGroup;

const style = StyleSheet.create({
  buttonsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
});
