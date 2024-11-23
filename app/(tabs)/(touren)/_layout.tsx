import { Stack } from "expo-router";
import { foofDarkTheme } from "@/constants/custom-theme";
import createManualEtappe from "./createManualEtappe";



export default function ReiseStackLayout() {
    return (
        <Stack
            screenOptions={{
                headerTintColor: foofDarkTheme["color-basic-100"],
                headerShown: true,
                headerStyle: {
                    backgroundColor: foofDarkTheme["color-basic-500"],
                },
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    headerShown: true,
                    title: "Meine Touren",
                }}
            />
            <Stack.Screen
                name="createManualEtappe"
                options={{
                    headerShown: true,
                    title: "Etappe"
                }}
            />
        </Stack>
    );
}
