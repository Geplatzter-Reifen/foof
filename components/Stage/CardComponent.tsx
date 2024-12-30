import React from "react";

import { Card, Text, Layout, useTheme } from "@ui-kitten/components";
import { StyleSheet } from "react-native";
import customStyles from "@/constants/styles";

interface cardProps {
  form: React.ReactElement;
  title: string;
}

const CardHeder = ({ title }: { title: string }): React.ReactElement => {
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
      <Card
        style={{
          ...customStyles.basicCard,
          ...customStyles.basicShadow,
          ...style.card,
        }}
        header={() => CardHeder({ title })}
        disabled={true}
      >
        {form}
      </Card>
    </Layout>
  );
}

export default CardComponent;

const style = StyleSheet.create({
  card: {
    flex: 1, // Allow the element to grow
  },
  flexContainer: {
    flex: 1,
    flexDirection: "row",
    marginVertical: 5,
    marginHorizontal: 10,
  },
});
