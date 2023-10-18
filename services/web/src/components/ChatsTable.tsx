import {
  Button,
  Center,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaTrashAlt } from "react-icons/fa";
import { useRouter } from "next/router";
import { getTitleForChat } from "@judie/utils/chat/getTitleForChat";
import { Chat } from "@judie/data/types/api";

const ChatsTable = ({
  chats,
  isLoading,
  folderName,
}: {
  chats?: Chat[];
  isLoading?: boolean;
  folderName?: string;
}) => {
  const router = useRouter();

  const headerBgColor = useColorModeValue("brand.backgroundLight", "gray.800");
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
      ) : chats?.length ? (
        <Table variant={"simple"} size="md">
          <Thead position={"sticky"} top={0} backgroundColor={headerBgColor}>
            <Tr>
              <Th>Name</Th>
              <Th>Folder</Th>
              <Th>Delete</Th>
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
                <Td>{chat.folder?.userTitle || folderName || "--"}</Td>
                <Td>
                  {chat.updatedAt
                    ? new Date(chat.updatedAt)?.toISOString().replace(/T.*/, "")
                    : "--"}
                </Td>
                <Td>
                  <Button variant={"ghost"}>
                    <FaTrashAlt size={16} />
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Center width={"100%"}>
          <Text variant={"subheaderDetail"}>No chats yet!</Text>
        </Center>
      )}
    </TableContainer>
  );
};

export default ChatsTable;
