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
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
} from "@chakra-ui/react";
import { AtSignIcon, LockIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import logo from "../../assets/logo.png";
import RouterLink from "../../components/RouterLink";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const { register, handleSubmit } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const signUp = (data: any) => {
    setErrorMessage("");
    if (data.name.trim().length === 0) {
      setErrorMessage("Informe o seu nome.");
      return;
    }
    if (data.email.trim().length === 0) {
      setErrorMessage("Informe o seu email.");
      return;
    }
    if (data.password) {
      if (data.password !== data.passwordConfirm) {
        setErrorMessage("As senhas não são iguais.");
        return;
      }
    } else {
      setErrorMessage("Informe uma senha.");
      return;
    }
    delete data["passwordConfirm"];
    fetch("https://cadastro-clientes-backend.herokuapp.com/v1/sign-up", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        const json = await response.json();
        if (response.ok) {
          navigate("/");
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
        <Heading>Cadastrar-se</Heading>
        <Box minW={{ base: "90%", md: "470px" }}>
          <form onSubmit={handleSubmit(signUp)}>
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
                    children={<InfoOutlineIcon color="gray.300" />}
                  />
                  <Input type="text" placeholder="Nome" {...register("name")} />
                </InputGroup>
              </FormControl>

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
              </FormControl>

              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<LockIcon color="gray.300" />}
                  />
                  <Input
                    type="password"
                    placeholder="Confirmar senha"
                    {...register("passwordConfirm")}
                  />
                </InputGroup>
              </FormControl>
              <Button type="submit" variant="solid" colorScheme="green">
                Cadastrar
              </Button>
              <RouterLink to="/" variant="link">
                Voltar
              </RouterLink>
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
    </Flex>
  );
}
