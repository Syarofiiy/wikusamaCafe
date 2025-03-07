import React from "react";
import {
  Box,
  Flex,
  VStack,
  IconButton,
  useDisclosure,
  Stack,
  Heading,
} from "@chakra-ui/react";
import { BsFillGrid1X2Fill } from "react-icons/bs";
import { FaUserAlt, FaNewspaper } from "react-icons/fa";
import { MdDining, MdDinnerDining } from "react-icons/md";
import { X, AlignCenter } from "react-feather";
import NavItem from "./fragments/NavItem";
import Logout from "./fragments/Logout";
import { getLocalStorage } from "../../utils/helper/localStorage";
import { LOCAL_STORAGE_USER } from "../../utils/constants";

export default function Sidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dataUser = getLocalStorage(LOCAL_STORAGE_USER);

  const renderNavItems = () => (
    <>
      {dataUser.role === "admin" && (
        <>
          <NavItem
            link={"/dashboard/admin/"}
            label={"Dashboard"}
            icon={BsFillGrid1X2Fill}
          />
          <NavItem
            link={"/dashboard/admin/menu"}
            label={"Menu"}
            icon={MdDinnerDining}
          />
          <NavItem
            link={"/dashboard/admin/meja"}
            label={"Meja"}
            icon={MdDining}
          />
          <NavItem
            link={"/dashboard/admin/user"}
            label={"Pengguna"}
            icon={FaUserAlt}
          />
        </>
      )}
      {dataUser.role === "manager" && (
        <>
          <NavItem
            link={"/dashboard/manajer/"}
            label={"Dashboard"}
            icon={BsFillGrid1X2Fill}
          />
          <NavItem
            link={"/dashboard/manajer/transaksi"}
            label={"Transaksi"}
            icon={FaNewspaper}
          />
        </>
      )}
      {dataUser.role === "kasir" && (
        <>
          <NavItem
            link={"/dashboard/kasir/"}
            label={"Dashboard"}
            icon={BsFillGrid1X2Fill}
          />
          <NavItem
            link={"/dashboard/kasir/transaksi"}
            label={"Transaksi"}
            icon={FaNewspaper}
          />
        </>
      )}
      <Logout />
    </>
  );

  return (
    <Box
      w={{ base: "full", md: "15rem" }}
      h={{ base: "auto", md: "full" }}
      bgColor={"white"}
      px={{ base: 4, md: 0 }}
      py={2}
      zIndex={10}
      boxShadow={"2px 0px 20px 2px rgba(0, 0, 0, 0.1)"}
      position={"fixed"}
    >
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <Heading
          mx={"auto"}
          color={"blue.600"}
          fontSize={"xl"}
          fontFamily={"Poppins"}
          display={{ base: "none", md: "block" }}
        >
          Wikusama Caffee
        </Heading>
        <IconButton
          size={"md"}
          p={2}
          icon={isOpen ? <X /> : <AlignCenter />}
          aria-label={"Open Menu"}
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
        />
      </Flex>

      {/* Sidebar for larger screens (md and above) */}
      <VStack
        mt={4}
        alignItems={"center"}
        display={{ base: "none", md: "flex" }}
      >
        <Stack w={"full"}>
          <Box w={"full"}>{renderNavItems()}</Box>
        </Stack>
      </VStack>

      {/* Sidebar for smaller screens (base to md) */}
      {isOpen && (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as={"nav"} spacing={4}>
            {renderNavItems()}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
