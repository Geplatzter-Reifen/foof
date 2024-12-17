import React from "react";
import { Card, Text, Layout, useTheme } from "@ui-kitten/components";
import { StyleSheet } from "react-native";

/**
 * CardComponent
 *
 * A reusable card component with a customizable title and content.
 * This component is styled using Eva Design System's `Card` and provides a
 * visually appealing card layout with a header.
 *
 * @param {Object} props - The properties for the card.
 * @param {string} props.title - The title displayed at the top of the card.
 * @param {React.ReactNode} props.form - The content rendered inside the card under the header.
 * @returns {JSX.Element} A card component with a header and customizable content.
 */
interface cardProps {
  form: React.ReactNode;
  title: string;
}

const CardHeader = React.memo(({ title }: { title: string }) => {
  const theme = useTheme();
  return (
    <Text
      style={StyleSheet.flatten([
        style.cardHeader,
        { borderBottomColor: theme["color-basic-500"] },
      ])}
      category="h4"
    >
      {title}
    </Text>
  );
});

const CardComponent: React.FC<cardProps> = ({ form, title }) => {
  return (
    <Layout style={style.flexContainer} level="2">
      <Card
        style={style.card}
        header={() => <CardHeader title={title} />}
        pointerEvents="none"
        disabled={true}
        pressableProps={{
          android_ripple: { color: "transparent" }, // Remove ripple effect
        }}
      >
        {form}
      </Card>
    </Layout>
  );
};

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
  cardHeader: {
    textAlign: "center",
    padding: 5,
    borderBottomWidth: 1,
  },
  flexContainer: {
    flex: 1,
    flexDirection: "row",
    marginVertical: 5,
    marginHorizontal: 10,
  },
});
