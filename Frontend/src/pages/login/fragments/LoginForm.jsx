// import library yang dibutuhkan
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "react-feather";
import {
  Button,
  Box,
  Heading,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  FormHelperText,
  Text,
} from "@chakra-ui/react";
import loginHandler from "./LoginHandler";
import AlertNotification from "../../../components/alert";

// buat komponen LoginForm
export default function LoginForm() {
  // buat state
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  // buat fungsi untuk menampilkan password
  const handleClick = () => setShow(!show);
  // buat fungsi untuk navigasi
  const navigate = useNavigate();
  // buat fungsi untuk validasi form
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  // buat fungsi untuk submit form
  const submitHandler = async (values) => {
    setIsLoading(true);
    const response = await loginHandler(values);
    setMessage(response.message);
    setStatus(response.status);

    setTimeout(() => {
      if (response.status === "success" && response.data?.role) {
        if (response.data.role === "admin") {
          navigate("/dashboard/admin/");
        } else if (response.data.role === "manager") {
          navigate("/dashboard/manajer/");
        } else if (response.data.role === "kasir") {
          navigate("/dashboard/kasir/");
        }
      }
      setMessage("");
      setStatus("");
      setIsLoading(false);
    }, 1500);

    setIsLoading(false);
  };

  return (
    <Box width={{ lg: "70%" }} mx={"auto"}>
      {/*  jika status sukses, tampilkan alert notifikasi */}
      <AlertNotification status={status} message={message} />
      <Box mt={4}>
        <Heading fontWeight={600} color="blue.600">
          Masuk
        </Heading>
        <Text fontSize="md" my={3}>
          Masuk Untuk Mulai Mengelola Bisnis Anda
        </Text>
      </Box>
      <Box>
        <FormControl method="POST">
          <Input
            type="username"
            name="username"
            id="username"
            borderRadius="full"
            focusBorderColor="blue.600"
            placeholder="Username"
            {...register("username", { required: true })} // validasi form
          />
          {/*  jika error username, tampilkan pesan error */}
          {errors.username?.type === "required" && (
            <FormHelperText textColor="red" mb={4}>
              Masukkan username
            </FormHelperText>
          )}
          <InputGroup mt={4}>
            <Input
              type={show ? "text" : "password"} // tampilkan password jika state show true
              name="password"
              id="password"
              borderRadius="full"
              focusBorderColor="blue.600"
              placeholder="Password"
              {...register("password", {
                required: true, // validasi tidak boleh kosong
                minLength: 8, // validasi minimal 8 karakter
              })} // validasi form
            />
            <InputRightElement>
              <IconButton
                borderRadius="full"
                size="sm"
                variant="ghost"
                mr={[2, 6, 10]}
                onClick={handleClick}
                aria-label={"whod hide"}
                icon={show ? <EyeOff /> : <Eye />} // tampilkan icon eye jika state show true dan sebaliknya
              />
            </InputRightElement>
          </InputGroup>
          {/*  jika error password, tampilkan pesan error */}
          {errors.password?.type === "required" && (
            <FormHelperText textColor="red">Masukkan password</FormHelperText>
          )}
          {errors.password?.type === "minLength" && (
            <FormHelperText textColor="red">
              Password minimal 8 karakter
            </FormHelperText>
          )}
          <Button
            mt={8}
            bg="blue.700"
            color="white"
            isLoading={isLoading}
            type="submit"
            w="full"
            borderRadius="full"
            borderWidth={2}
            borderColor="blue.600"
            _hover={{
              bg: "white",
              color: "blue.600",
              borderColor: "blue.600",
            }}
            // submit form
            onClick={handleSubmit(async (values) => {
              await submitHandler(values); // jalankan fungsi submitHandler
            })}
          >
            Masuk
          </Button>
        </FormControl>
      </Box>
    </Box>
  );
}
