import React from "react";
import { Button, Text, ThemeTypings } from "@chakra-ui/react";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { Token } from "@chakra-ui/styled-system/dist/declarations/src/utils";
import * as CSS from "csstype";

interface RouterLinkProps {
  to: string;
  children?: React.ReactNode;
  color?: Token<CSS.Property.Color, "colors">;
  colorScheme?: ThemeTypings["colorSchemes"];
  variant?: ThemeTypings["components"]["Button"]["variants"];
}

export default function RouterLink(props: RouterLinkProps) {
  const navigate = useNavigate();
  return (
    <>
      {props.variant ? (
        <Button
          type="button"
          variant={props.variant}
          colorScheme={props.colorScheme ? props.colorScheme : "green"}
          onClick={() => navigate(props.to)}
        >
          Voltar
        </Button>
      ) : (
        <ReactRouterLink to={props.to}>
          <Text as="span" color={props.color ? props.color : "green"}>
            {props.children}
          </Text>
        </ReactRouterLink>
      )}
    </>
  );
}
