// https://testing-library.com/docs/react-testing-library/setup/#add-custom-queries
import React from "react";
import { render, RenderOptions } from "@testing-library/react-native";
import { FontAwesomeIconsPack } from "@/components/Font/fontAwesome";
import { mapping } from "@eva-design/eva";
import {
  IconRegistry,
  ApplicationProvider,
  ModalService,
} from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { foofDarkTheme, foofLightTheme } from "@/constants/custom-theme";
import { library } from "@fortawesome/fontawesome-svg-core";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

// Iconpacks laden
library.add(far, fas, fab);

// ModalService wird verwendet, um die Modal-Positionierung zu steuern
ModalService.setShouldUseTopInsets = true;

type Props = {
  children: React.ReactNode;
  use_dark_theme?: boolean;
};
// Der Wrapper wird verwendet, um die Provider zu umschließen, die für die Komponenten notwendig sind
const AllTheProviders = ({ children, use_dark_theme = true }: Props) => {
  const theme = use_dark_theme
    ? { ...eva.dark, ...foofDarkTheme }
    : { ...eva.light, ...foofLightTheme };
  return (
    <>
      <IconRegistry icons={FontAwesomeIconsPack} />
      <ApplicationProvider {...eva} customMapping={mapping} theme={theme}>
        {children}
      </ApplicationProvider>
    </>
  );
};

// Erstellt einen Custom-Render, der die Provider um die Komponenten wickelt
const customRender = (
  component: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => {
  return render(component, { wrapper: AllTheProviders, ...options });
};

// Exportiert alle Funktionen der Testing Library, weswegen man diese dann auch von dieser Datei importieren kann
export * from "@testing-library/react-native";
export { customRender as render };
