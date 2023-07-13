import {
  Button,
  HStack,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  GET_INVITES_FOR_ORG,
  GET_ORG_BY_ID,
  GET_USERS_FOR_ORG,
  getInvitesForOrgQuery,
  getOrgByIdQuery,
  getUsersForOrgQuery,
} from "@judie/data/queries";
import { useQuery } from "react-query";
import SchoolRow from "../EntityRow/SchoolRow";
import RoomRow from "../EntityRow/RoomRow";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { useState } from "react";
import CreateSchoolModal from "../CreateSchoolModal";
import UserRow from "../EntityRow/UserRow";
import InviteRow from "../EntityRow/InviteRow";

const AdminOrganization = ({ id }: { id: string }) => {
  const { data: organizationData } = useQuery({
    queryKey: [GET_ORG_BY_ID, id],
    queryFn: () => getOrgByIdQuery(id),
    enabled: !!id,
  });

  const { data: organizationUserData } = useQuery({
    queryKey: [GET_USERS_FOR_ORG, id],
    queryFn: () => getUsersForOrgQuery(id),
    enabled: !!id,
  });

  const { data: organizationInvitesData } = useQuery({
    queryKey: [GET_INVITES_FOR_ORG, id],
    queryFn: () => getInvitesForOrgQuery(id),
    enabled: !!id,
  });

  const [createSchoolOpen, setCreateSchoolOpen] = useState(false);

  return (
    <VStack
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        maxWidth: "100%",
      }}
    >
      <CreateSchoolModal
        isOpen={createSchoolOpen}
        onClose={() => setCreateSchoolOpen(false)}
        organizationId={organizationData?.id as string}
      />
      <HStack
        alignItems={"center"}
        justifyContent={"space-between"}
        width={"100%"}
        paddingLeft={"1rem"}
        paddingTop={"2rem"}
      >
        <Text
          style={{
            fontSize: "2rem",
          }}
        >
          {organizationData?.name}
        </Text>
        <Button
          size={"sm"}
          variant={"solid"}
          colorScheme="green"
          onClick={() => setCreateSchoolOpen(true)}
        >
          <PlusSquareIcon marginRight={"0.3rem"} /> Create School
        </Button>
      </HStack>
      <Tabs size={"sm"} variant="line" width={"100%"} defaultIndex={0}>
        <TabList width={"100%"}>
          {organizationData?.schools?.length ? <Tab>Schools</Tab> : null}
          {organizationData?.rooms?.length ? <Tab>Rooms</Tab> : null}
          {organizationUserData?.length ? <Tab>Users</Tab> : null}
          {organizationInvitesData?.length ? <Tab>Invites</Tab> : null}
        </TabList>
        <TabPanels>
          {organizationData?.schools?.length ? (
            <TabPanel>
              <VStack
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  width: "100%",
                }}
                spacing={"1rem"}
              >
                {organizationData?.schools.map((school) => (
                  <SchoolRow key={school.id} school={school} />
                ))}
              </VStack>
            </TabPanel>
          ) : null}
          {organizationData?.rooms?.length ? (
            <TabPanel>
              <VStack
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  width: "100%",
                }}
                spacing={"1rem"}
              >
                {organizationData?.rooms.map((room) => (
                  <RoomRow key={room.id} room={room} />
                ))}
              </VStack>
            </TabPanel>
          ) : null}
          {organizationUserData?.length ? (
            <TabPanel>
              <VStack
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  width: "100%",
                }}
                spacing={"1rem"}
              >
                {organizationUserData.map((user) => (
                  <UserRow key={user.id} user={user} />
                ))}
              </VStack>
            </TabPanel>
          ) : null}
          {organizationInvitesData?.length ? (
            <TabPanel>
              <VStack
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  width: "100%",
                }}
                spacing={"1rem"}
              >
                {organizationInvitesData.map((invite) => (
                  <InviteRow key={invite.id} invite={invite} />
                ))}
              </VStack>
            </TabPanel>
          ) : null}
        </TabPanels>
        <TabIndicator />
      </Tabs>
    </VStack>
  );
};

export default AdminOrganization;
