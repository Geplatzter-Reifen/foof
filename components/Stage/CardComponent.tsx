import React from "react";

import { Card, Text, Layout, useTheme } from "@ui-kitten/components";
import { StyleSheet } from "react-native";

interface cardProps {
  form: React.ReactElement;
  title: string;
}

const cardHeder = ({ title }: { title: string }): React.ReactElement => {
  const theme = useTheme();
  return (
    <Text
      style={{
        textAlign: "center",
        padding: 5,
        borderBottomColor: theme["color-basic-500"],
      }}
      category="h4"
    >
      {title}
    </Text>
  );
};

function CardComponent(props: cardProps) {
  const { form, title } = props;
  return (
    <Layout style={style.flexContainer} level="2">
      <Card style={style.card} header={() => cardHeder({ title })}>
        {form}
      </Card>
    </Layout>
  );
}

export default CardComponent;

const style = StyleSheet.create({
  card: {
    flex: 1, // Allow the element to grow
    borderRadius: 8,
    borderWidth: 0,
    // Schatten für iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    // Schatten für Android
    elevation: 3,
  },
  flexContainer: {
    flex: 1,
    flexDirection: "row",
    marginVertical: 5,
    marginHorizontal: 10,
  },
});
