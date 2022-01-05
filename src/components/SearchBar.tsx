import { SearchIcon } from "@chakra-ui/icons";
import { Box, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";

interface SearchBarProps {
  onTextChanged: (text: string) => void;
}

export default function SearchBar(props: SearchBarProps) {
  return (
    <Box
      backgroundColor="whiteAlpha.900"
      boxShadow="md"
      borderRadius="md"
      p="1rem"
    >
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<SearchIcon color="gray.300" />}
        />
        <Input
          type="text"
          placeholder="Buscar"
          onChange={(e) => props.onTextChanged(e.target.value)}
        />
      </InputGroup>
    </Box>
  );
}
