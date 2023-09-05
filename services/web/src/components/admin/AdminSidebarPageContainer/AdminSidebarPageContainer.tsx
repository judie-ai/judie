import { Box, Flex } from "@chakra-ui/react";
import { LuChevronLeftSquare, LuChevronRightSquare } from "react-icons/lu";
import useStorageState from "@judie/hooks/useStorageState";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import { useSidebarOpenClose } from "@judie/context/sidebarOpenCloseProvider";

interface AdminSidebarPageContainerProps {
  children: React.ReactNode;
}

type OpenCloseButtonProps = {
  isAdminSidebarOpen: boolean;
  toggleAdminSidebar: () => void;
};

const OpenCloseButton = ({
  isAdminSidebarOpen,
  toggleAdminSidebar,
}: OpenCloseButtonProps) => {
  return (
    <Box
      style={{
        position: "fixed",
        top: "0.4rem",
        left: isAdminSidebarOpen ? "18.5rem" : "1.5rem",
        padding: "0.5rem",
      }}
    >
      {isAdminSidebarOpen ? (
        <LuChevronLeftSquare
          style={{
            zIndex: 1000,
          }}
          cursor={"pointer"}
          onClick={toggleAdminSidebar}
          size={20}
        />
      ) : (
        <LuChevronRightSquare
          style={{
            zIndex: 1000,
          }}
          cursor={"pointer"}
          onClick={toggleAdminSidebar}
          size={20}
        />
      )}
    </Box>
  );
};

const AdminSidebarPageContainer = ({
  children,
}: AdminSidebarPageContainerProps) => {
  const { isAdminSidebarOpen, toggleAdminSidebar } = useSidebarOpenClose();

  return (
    <Flex
      style={{
        flexDirection: "row",
        height: "100vh",
        width: "100vw",
      }}
    >
      <AdminSidebar isOpen={isAdminSidebarOpen} />
      <Box
        style={{
          width: "100%",
          height: "100%",
          maxHeight: "100vh",
          position: "relative",
          overflow: "scroll",
          maxWidth: "100%",
          padding: "2rem 2rem",
        }}
      >
        <OpenCloseButton
          isAdminSidebarOpen={isAdminSidebarOpen}
          toggleAdminSidebar={toggleAdminSidebar}
        />
        {children}
      </Box>
    </Flex>
  );
};

export default AdminSidebarPageContainer;
