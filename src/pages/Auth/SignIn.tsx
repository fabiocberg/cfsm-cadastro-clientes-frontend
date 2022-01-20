import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  CloseButton,
  Flex,
  FormControl,
  FormHelperText,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Stack,
} from "@chakra-ui/react";
import { AtSignIcon, LockIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import logo from "../../assets/logo.png";
import RouterLink from "../../components/RouterLink";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SignIn() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const login = (data: any) => {
    // verificar se os dados de email e senha foram digitados
    // requisição para o backend
    // em caso de sucesso, ir para a rota home
    setErrorMessage("");
    fetch("https://cadastro-clientes-backend.herokuapp.com/v1/sign-in", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        const json = await response.json();
        if (response.ok) {
          localStorage.setItem("token", json.token);
          navigate("/home");
        } else {
          setErrorMessage(json.message);
        }
      })
      .catch((e) => setErrorMessage(e));
  };

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      backgroundColor="gray.200"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Image src={logo} alt="Logo" boxSize="80px" objectFit="contain" />
        <Heading>Cadastro de Clientes</Heading>
        <Box minW={{ base: "90%", md: "470px" }}>
          <form onSubmit={handleSubmit(login)}>
            <Stack
              spacing={4}
              p="1rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
              borderRadius="md"
            >
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<AtSignIcon color="gray.300" />}
                  />
                  <Input
                    type="email"
                    placeholder="Endereço de email"
                    {...register("email")}
                  />
                </InputGroup>
              </FormControl>

              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<LockIcon color="gray.300" />}
                  />
                  <Input
                    type="password"
                    placeholder="Senha"
                    {...register("password")}
                  />
                </InputGroup>
                <FormHelperText textAlign="right">
                  <Link>esqueceu a senha?</Link>
                </FormHelperText>
              </FormControl>
              <Button type="submit" variant="solid" colorScheme="green">
                Login
              </Button>
            </Stack>
            {errorMessage.length > 0 ? (
              <Alert status="error">
                <AlertIcon />
                <AlertTitle mr={2}>Erro: </AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
                <CloseButton
                  position="absolute"
                  right="8px"
                  top="8px"
                  onClick={() => setErrorMessage("")}
                />
              </Alert>
            ) : null}
          </form>
        </Box>
      </Stack>
      <Box>
        Ainda não possui cadastro?{" "}
        <RouterLink to="/signup">Cadastre-se</RouterLink>
      </Box>
    </Flex>
  );
}
