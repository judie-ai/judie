import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { CreatePermissionType } from "@judie/data/mutations";
import {
  Organization,
  Permission,
  PermissionType,
  Room,
  School,
} from "@judie/data/types/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../Button/Button";
import useAuth from "@judie/hooks/useAuth";
import useFlatAllEntities from "@judie/hooks/useFlatAllEntities";

const PermissionRow = ({
  permission,
}: {
  permission: CreatePermissionType;
  editable?: boolean;
  onChange: (permission: CreatePermissionType) => void;
}) => {
  return (
    <Flex
      style={{
        width: "100%",
        padding: "0.5rem",
        borderWidth: "0.5px",
        borderRadius: "0.5rem",
      }}
    >
      {/* TODO: Style this, add org, school, room name */}
      {permission.type}
    </Flex>
  );
};

interface SubmitData {
  type: PermissionType;
  organizationId?: string;
  schoolId?: string;
  roomId?: string;
}

// This is required to correctly fill permission IDs
// TODO Ryan - figure out a stricter solution for this on the backend
const fillPermissionIds = ({
  permission,
  organization,
  school,
  room,
}: {
  permission: CreatePermissionType;
  organization: Organization | undefined;
  school: School | undefined;
  room: Room | undefined;
}): CreatePermissionType => {
  let newPermission = permission;
  let organizationId =
    organization?.id ||
    school?.organizationId ||
    room?.organizationId ||
    permission.organizationId ||
    undefined;
  let schoolId =
    school?.id || room?.schoolId || permission.schoolId || undefined;
  let roomId = room?.id || permission.roomId || undefined;
  if (!organizationId) {
    throw new Error("Incorrectly formatted permission. Please try again.");
  }
  newPermission = {
    ...permission,
    organizationId: organizationId || permission.organizationId,
    schoolId: schoolId || permission.schoolId,
    roomId: roomId || permission.roomId,
  };
  return newPermission;
};

const NewPermissionRow = ({
  setNewPermission,
}: {
  setNewPermission: (perm: CreatePermissionType) => void;
}) => {
  const auth = useAuth();
  const toast = useToast();
  const [type, setType] = useState<PermissionType>(PermissionType.STUDENT);
  const { organizations, schools, rooms } = useFlatAllEntities();
  // State
  const [organization, setOrganization] = useState<Organization>();
  const [school, setSchool] = useState<School>();
  const [room, setRoom] = useState<Room>();
  const [organizationId, setOrganizationId] = useState<string>();
  const [schoolId, setSchoolId] = useState<string>();
  const [roomId, setRoomId] = useState<string>();

  useEffect(() => {
    const reset = () => {
      setOrganizationId(undefined);
      setSchoolId(undefined);
      setRoomId(undefined);
      setOrganization(undefined);
      setSchool(undefined);
      setRoom(undefined);
    };
    reset();
    switch (type) {
      case PermissionType.ORG_ADMIN:
        setOrganizationId(organizations?.[0]?.id);
        break;
      case PermissionType.SCHOOL_ADMIN:
        setSchoolId(schools?.[0]?.id);
        break;
      case PermissionType.ROOM_ADMIN:
        setRoomId(rooms?.[0]?.id);
        break;
    }
  }, [
    type,
    setOrganizationId,
    setSchoolId,
    setRoomId,
    setOrganization,
    setSchool,
    setRoom,
  ]);

  useEffect(() => {
    if (organizationId) {
      const newOrg = organizations?.find((org) => org.id === organizationId);
      setOrganization(newOrg);
    } else {
      setOrganization(undefined);
    }
  }, [organizationId, setOrganization, organizations]);

  useEffect(() => {
    if (schoolId) {
      const newSchool = schools?.find((sch) => sch.id === schoolId);
      setSchool(newSchool);
    } else {
      setSchool(undefined);
    }
  }, [schoolId, setSchool, schools]);

  useEffect(() => {
    if (roomId) {
      const newRoom = rooms?.find((rm) => rm.id === roomId);
      setRoom(newRoom);
    } else {
      setRoom(undefined);
    }
  }, [roomId, setRoom, rooms]);

  const { handleSubmit, register, reset, watch } = useForm<SubmitData>({
    defaultValues: {
      type,
      organizationId: organizationId,
      schoolId: schoolId,
      roomId: roomId,
    },
    reValidateMode: "onBlur",
  });

  const onSubmit: SubmitHandler<SubmitData> = (
    {}: SubmitData,
    e?: React.BaseSyntheticEvent
  ) => {
    e?.preventDefault();
    try {
      console.log("permission", {
        permission: {
          type,
          organizationId:
            organizationId === "None" ? undefined : organizationId,
          schoolId: schoolId === "None" ? undefined : schoolId,
          roomId: roomId === "None" ? undefined : roomId,
        },
        organization,
        school,
        room,
      });
      // console.log("room", room);
      // console.log("roomId", roomId);
      const permission = fillPermissionIds({
        permission: {
          type,
          organizationId:
            organizationId === "None" ? undefined : organizationId,
          schoolId: schoolId === "None" ? undefined : schoolId,
          roomId: roomId === "None" ? undefined : roomId,
        },
        organization,
        school,
        room,
      });
      console.log("newPermission", permission);
      setNewPermission(permission);
      // Add permission to array
    } catch (err) {
      toast({
        title: "Error formatting permission",
      });
    }
  };

  // useEffect(() => {
  //   const org = organizations?.find(
  //     (org) => org.id === watch("organizationId")
  //   );
  //   if (org) {
  //     setOrganization(org);
  //   }
  // }, [watch("organizationId")]);

  // useEffect(() => {
  //   const school = schools?.find((school) => school.id === watch("schoolId"));
  //   if (school) {
  //     setSchool(school);
  //   }
  // }, [watch("schoolId")]);

  // useEffect(() => {
  //   const room = rooms?.find((room) => room.id === watch("roomId"));
  //   if (room) {
  //     setRoom(room);
  //   }
  // }, [watch("roomId")]);

  // useEffect(() => {
  //   setOrganization(undefined);
  //   setSchool(undefined);
  //   setRoom(undefined);
  //   setOrganizationId(undefined);
  //   setSchoolId(undefined);
  //   setRoomId(undefined);
  //   // reset();
  // }, [
  //   watch("type"),
  //   setOrganization,
  //   setSchool,
  //   setRoom,
  //   reset,
  //   setRoomId,
  //   setSchoolId,
  //   setOrganizationId,
  // ]);

  // useEffect(() => {
  //   return () => {
  //     setOrganization(undefined);
  //     setSchool(undefined);
  //     setRoom(undefined);
  //     setOrganizationId(undefined);
  //     setSchoolId(undefined);
  //     setRoomId(undefined);
  //     // reset();
  //   };
  // }, [
  //   reset,
  //   setRoom,
  //   setSchool,
  //   setOrganization,
  //   setRoomId,
  //   setSchoolId,
  //   setOrganizationId,
  // ]);

  return (
    <Flex
      style={{
        width: "100%",
        borderWidth: "0.5px",
        borderRadius: "0.5rem",
        padding: "1rem",
      }}
    >
      <form
        style={{
          width: "100%",
        }}
      >
        <Flex
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <FormControl
            style={{
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
              width: "100%",
            }}
            isRequired
          >
            <FormLabel htmlFor="permissionType">Permission Type</FormLabel>
            <Select
              id="type"
              {...register("type", {})}
              value={type}
              onChange={(e) => setType(e.target.value as PermissionType)}
            >
              {/* TODO Ryan: Make user-facing versions of these */}
              {Object.keys(PermissionType).map((key) => (
                <option value={key}>{key}</option>
              ))}
            </Select>
          </FormControl>
          {type === PermissionType.ORG_ADMIN ||
          type === PermissionType.STUDENT ? (
            <FormControl
              style={{
                marginTop: "0.5rem",
                marginBottom: "0.5rem",
                width: "100%",
              }}
              isRequired={type === PermissionType.ORG_ADMIN}
            >
              <FormLabel htmlFor="organization">Organization</FormLabel>
              <Select
                id="organizationId"
                {...register("organizationId", {})}
                value={organizationId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  console.log("organizationId", e.target.value);
                  setOrganizationId(e.target.value);
                }}
              >
                {type !== PermissionType.ORG_ADMIN && (
                  <option key="none" value={undefined}>
                    None
                  </option>
                )}
                {organizations?.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          ) : null}
          {type === PermissionType.SCHOOL_ADMIN ||
          (type === PermissionType.STUDENT && organization) ? (
            <FormControl
              style={{
                marginTop: "0.5rem",
                marginBottom: "0.5rem",
                width: "100%",
              }}
              isRequired={type === PermissionType.SCHOOL_ADMIN}
            >
              <FormLabel htmlFor="school">School</FormLabel>
              <Select
                id="schoolId"
                {...register("schoolId", {})}
                value={schoolId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  console.log("schoolId", e.target.value);
                  setSchoolId(e.target.value);
                }}
              >
                {type !== PermissionType.SCHOOL_ADMIN && (
                  <option key="none" value={undefined}>
                    None
                  </option>
                )}
                {(type === PermissionType.SCHOOL_ADMIN
                  ? schools
                  : organization?.schools
                )?.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          ) : null}
          {type === PermissionType.ROOM_ADMIN ||
          (type === PermissionType.STUDENT && organization && school) ? (
            <FormControl
              style={{
                marginTop: "0.5rem",
                marginBottom: "0.5rem",
                width: "100%",
              }}
              isRequired={type === PermissionType.ROOM_ADMIN}
            >
              <FormLabel htmlFor="room">Room</FormLabel>
              <Select
                id="roomId"
                {...register("roomId", {})}
                value={roomId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  console.log("schoolId", e.target.value);
                  setSchoolId(e.target.value);
                }}
              >
                {type !== PermissionType.ROOM_ADMIN && (
                  <option key="none" value={undefined}>
                    None
                  </option>
                )}
                {(type === PermissionType.ROOM_ADMIN
                  ? rooms
                  : school?.rooms
                )?.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          ) : null}

          <Button
            style={{
              width: "100%",
              marginTop: "0.8rem",
            }}
            colorScheme="green"
            variant={"solid"}
            loading={false}
            label="+ Add"
            onClick={handleSubmit(onSubmit)}
          />
        </Flex>
      </form>
    </Flex>
  );
};

const CreatePermissionWidget = ({
  setPermission,
}: {
  setPermission: (permission: CreatePermissionType) => void;
}) => {
  const [displayNewPermission, setDisplayNewPermission] = useState(false);
  return (
    <VStack
      style={{
        flexDirection: "column",
        width: "100%",
      }}
      spacing={"1rem"}
    >
      <Flex
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0.5rem",
          borderWidth: "0.5px",
          borderRadius: "0.5rem",
        }}
        borderColor={"gray.400"}
        backgroundColor="white"
        textColor={"black"}
        cursor={"pointer"}
        onClick={() => setDisplayNewPermission(true)}
      >
        + Add a permission
      </Flex>
      {displayNewPermission ? (
        <NewPermissionRow setNewPermission={setPermission} />
      ) : null}
    </VStack>
  );
};

const PermissionsWidget = ({
  onChangePermissions,
  permissions,
}: {
  onChangePermissions: (permissions: CreatePermissionType[]) => void;
  permissions: CreatePermissionType[];
}) => {
  // TODO: Get permissions by user ID (if not of create user type)

  const setPermission = useCallback(
    (newPermission: CreatePermissionType) => {
      const newPermissions = [...permissions, newPermission];
      onChangePermissions(newPermissions);
    },
    [permissions, onChangePermissions]
  );
  return (
    <VStack
      style={{
        width: "100%",
        padding: "1rem",
        borderWidth: "0.5px",
        borderRadius: "0.5rem",
        flexDirection: "column",
      }}
      gap={"1rem"}
    >
      {permissions?.length && (
        <Text
          style={{
            alignSelf: "flex-start",
            fontWeight: 500,
          }}
        >
          Existing Permissions
        </Text>
      )}
      {permissions.map((permission) => (
        <PermissionRow
          permission={permission}
          onChange={(permission) => {
            // TODO: Update permission in permissions array and do mutation
            console.log("permission changed", permission);
          }}
        />
      ))}
      <CreatePermissionWidget setPermission={setPermission} />
    </VStack>
  );
};

export default PermissionsWidget;
