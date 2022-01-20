import { AtSignIcon, InfoOutlineIcon, PhoneIcon } from "@chakra-ui/icons";
import {
  Button,
  Container,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import CustomerPicture from "../../components/CustomerPicture";
import Header from "../../components/Header";
import SearchBar from "../../components/SearchBar";
import { Customer } from "../../models/customer-model";
import ClientList from "./ClientList";

export default function Home() {
  const modalAddClient = useDisclosure();
  const modalLogout = useDisclosure();
  const { register, handleSubmit, setValue } = useForm();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any | null>(null);
  const [file, setFile] = useState<any | null>(null);
  const [pictureBase64, setPictureBase64] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const updateList = () => {
    fetch("https://cadastro-clientes-backend.herokuapp.com/v1/customers", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      method: "GET",
    })
      .then(async (response) => {
        const json = await response.json();
        if (response.ok) {
          setCustomers(json.customers || []);
        } else {
          console.log("Error", json.message);
        }
      })
      .catch((e) => console.log(e));
  };

  const selectPicture = () => {
    document.getElementById("avatar-input")?.click();
  };

  const onFileSelected = (event: any) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = function () {
        // @ts-ignore
        setPictureBase64(reader.result);
      };
      reader.onerror = function (error) {
        console.log("Error: ", error);
      };
    }
  };

  const savePicture = (id: number) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("id", id.toString());
    fetch(
      "https://cadastro-clientes-backend.herokuapp.com/v1/customers/profile-picture",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        method: "POST",
        body: formData,
      }
    )
      .then(async (response) => {
        const json = await response.json();
        if (response.ok) {
          updateList();
        } else {
          console.log(json);
        }
      })
      .catch((e) => console.log(e));
  };

  const save = (data: any) => {
    modalAddClient.onClose();
    const method = editingCustomer && editingCustomer.id > 0 ? "PUT" : "POST";
    if (method === "PUT") {
      data.id = editingCustomer?.id;
    }
    fetch("https://cadastro-clientes-backend.herokuapp.com/v1/customers", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        const json = await response.json();
        if (response.ok) {
          setEditingCustomer(null);
          setValue("name", "");
          setValue("email", "");
          setValue("phone", "");
          if (file) {
            savePicture(json.updated.id);
          }
        } else {
          updateList();
          console.log("Error", json.message);
        }
      })
      .catch((e) => console.log(e));
  };

  const edit = (customer: Customer) => {
    setEditingCustomer(customer);
    setValue("name", customer.name);
    setValue("email", customer.email);
    setValue("phone", customer.phone);
    modalAddClient.onOpen();
  };

  const logout = () => {
    modalLogout.onOpen();
  };

  const doLogout = useCallback(() => {
    localStorage.removeItem("token");
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    fetch("https://cadastro-clientes-backend.herokuapp.com/v1/users/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      method: "GET",
    })
      .then(async (response) => {
        const json = await response.json();
        if (response.ok) {
          setUser(json.user);
        } else {
          console.log("Error", json.message);
          doLogout();
        }
      })
      .catch((e) => console.log(e));
    updateList();
  }, [doLogout]);

  console.log(searchTerm);

  const filtedCustomers =
    searchTerm.trim().length > 0
      ? customers.filter(
          (customer) =>
            customer.name
              .toLowerCase()
              .indexOf(searchTerm.trim().toLowerCase()) >= 0
        )
      : customers;

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      backgroundColor="gray.200"
    >
      <Header onLogout={logout} />
      <Container maxW="container.lg">
        <Stack mt={4}>
          <Text>
            {user?.name || "-"} ({user?.email || "-"})
          </Text>
          {/* BARRA DE BUSCA */}
          <SearchBar onTextChanged={setSearchTerm} />
          {/* BOTÃO DE ADICIONAR */}
          <Flex justifyContent="flex-end">
            <Button
              type="button"
              variant="solid"
              colorScheme="green"
              onClick={modalAddClient.onOpen}
            >
              Adicionar
            </Button>
          </Flex>
          {/* LISTA DE CLIENTES */}
          <ClientList customers={filtedCustomers} onEditing={edit} />
        </Stack>
      </Container>
      {/* MODAL DE CADASTRO */}
      <Modal isOpen={modalAddClient.isOpen} onClose={modalAddClient.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cadastro</ModalHeader>
          <form onSubmit={handleSubmit(save)}>
            <ModalBody>
              <Stack spacing={4}>
                <CustomerPicture
                  pictureBase64={pictureBase64}
                  customer={editingCustomer}
                  onSelectPicture={selectPicture}
                />

                <input
                  type="file"
                  id="avatar-input"
                  style={{ width: 1, height: 1 }}
                  accept="image/png, image/jpeg"
                  onChange={onFileSelected}
                />
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<InfoOutlineIcon color="gray.300" />}
                  />
                  <Input
                    type="text"
                    placeholder="Nome completo"
                    {...register("name")}
                  />
                </InputGroup>
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
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<PhoneIcon color="gray.300" />}
                  />
                  <Input
                    type="text"
                    placeholder="Telefone"
                    {...register("phone")}
                  />
                </InputGroup>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={modalAddClient.onClose}>
                Cancelar
              </Button>
              <Button colorScheme="green" type="submit">
                Salvar
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
      {/* MODAL LOGOUT */}
      <Modal isOpen={modalLogout.isOpen} onClose={modalLogout.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tem certeza?</ModalHeader>
          <ModalBody>
            <Text>Você tem certeza que deseja sair?</Text>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={modalLogout.onClose}>
              Cancelar
            </Button>
            <Button colorScheme="green" type="button" onClick={doLogout}>
              Sair
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
