import {
  Box,
  Center,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { GET_USER_CHATS, getUserChatsQuery } from "@judie/data/queries";
import useAuth from "@judie/hooks/useAuth";
import { useQuery } from "react-query";
import TableFooter from "./admin/tables/TableFooter";
import { useRouter } from "next/router";
import { getTitleForChat } from "./Sidebar/Sidebar";
import { useMemo, useState } from "react";
import { Chat } from "@judie/data/types/api";

const ChatsTable = ({
  chats,
  isLoading,
}: {
  chats?: Chat[];
  isLoading?: boolean;
}) => {
  const router = useRouter();

  const headerBgColor = useColorModeValue(
    "brand.backgroundLight",
    "brand.backgroundDark"
  );
  const rowHoverBgColor = useColorModeValue("gray.100", "gray.700");
  return (
    <TableContainer
      width={"100%"}
      height={"100%"}
      // maxH={"100%"}
      minH={"20rem"}
      overflowY={"auto"}
    >
      {isLoading ? (
        <Center width={"100%"} height={"100%"}>
          <Spinner colorScheme={"purple"} />
        </Center>
      ) : (
        <Table variant={"simple"} size="md">
          <Thead position={"sticky"} top={0} backgroundColor={headerBgColor}>
            <Tr>
              <Th>Name</Th>
              <Th>Folder</Th>
              <Th>Last edit</Th>
            </Tr>
          </Thead>
          <Tbody>
            {chats?.map((chat) => (
              <Tr
                key={chat.id}
                onClick={() => {
                  router.push(`/chat?id=${chat.id}`);
                }}
                cursor={"pointer"}
                _hover={{
                  backgroundColor: rowHoverBgColor,
                  transition: "ease-in-out 0.3s",
                }}
              >
                <Td>{getTitleForChat(chat)}</Td>
                <Td>{chat.folder?.userTitle || "n/a"}</Td>
                <Td>
                  {chat.updatedAt
                    ? new Date(chat.updatedAt)?.toISOString().replace(/T.*/, "")
                    : "n/a"}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </TableContainer>
  );
};

export default ChatsTable;
