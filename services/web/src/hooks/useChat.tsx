import {
  ChatResponse,
  completionFromQueryMutation,
  createChatMutation,
  putChatMutation,
} from "@judie/data/mutations";
import { GET_CHAT_BY_ID, getChatByIdQuery, getUserChatsQuery, GET_USER_CHATS } from "@judie/data/queries";
import { Message, MessageType } from "@judie/data/types/api";
import { useMutation, useQuery } from "react-query";
import useAuth from "./useAuth";
import {  useCallback, createContext, useContext, useEffect, useMemo, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { HTTPResponseError } from "@judie/data/baseFetch";
import useStorageState from "./useStorageState";
import { useRouter } from "next/router";
import { set } from "react-hook-form";

export interface TempMessage {
  type?: MessageType.BOT | MessageType.USER;
  readableContent?: string;
  createdAt?: Date;
}

export type UIMessageType = Message | TempMessage;

interface UseChatData {
  activeChatId?: string;
  chat?: ChatResponse;
  streaming: boolean;
  addMessage: (message: string) => void;
  messages: Message[];
  beingStreamedMessage?: string;
  displayWelcome: boolean;
  paywallOpen?: boolean;
  submitSubject: (subject: string) => void;
  tempUserMessage?: TempMessage;
  setTempUserMessage: (message: TempMessage | undefined) => void;
  setPaywallOpen: (open: boolean) => void;
  beingStreamedChatId?: string;
  tempUserMessageChatId?: string;
}

export const ChatContext = createContext<UseChatData>({
  activeChatId: undefined,
  chat: undefined,
  streaming: false,
  addMessage: () => {},
  messages: [],
  beingStreamedMessage: undefined,
  displayWelcome: true,
  paywallOpen: false,
  submitSubject: () => {},
  tempUserMessage: undefined,
  setTempUserMessage: () => {},
  setPaywallOpen: () => {},
  beingStreamedChatId: undefined,
  tempUserMessageChatId: undefined,
});



export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const toast = useToast();
  const router = useRouter();
  const [displayWelcome, setDisplayWelcome] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [beingStreamedMessage, setBeingStreamedMessage] = useStorageState<
    string | undefined
  >(undefined, "beingStreamedMessage");
  const [paywallOpen, setPaywallOpen] = useState<boolean>(false);
  const [tempUserMessage, setTempUserMessage] = useState<TempMessage>();
  const [streaming, setStreaming] = useState<boolean>(false);

  const chatId = useMemo(() => {
    return router.query.id as string;
  }, [router.query.id]);

  const [beingStreamedChatId, setBeingStreamedChatId] = useStorageState<
    string | undefined
  >(undefined, "beingStreamedChatId");
  const [tempUserMessageChatId, setTempUserMessageChatId] = useStorageState<
    string | undefined
  >(undefined, "tempUserMessageChatId");

  const abortController = useMemo(() => {
    return new AbortController();
  }, []);

  useEffect(() => {
    setStreaming(false);
  }, [chatId]);

  useEffect(() => {
    if (beingStreamedMessage) {
      setBeingStreamedMessage(undefined);
      setBeingStreamedChatId(undefined);
      setTempUserMessage(undefined);
      setTempUserMessageChatId(undefined);
    }
  }, [auth?.userData?.id, setBeingStreamedMessage, setBeingStreamedChatId, setTempUserMessage, setTempUserMessageChatId]);

  // If beingStreamedMessage hasn't been updated in 5 seconds, reset it
  useEffect(() => {
    if (beingStreamedMessage) {
      const timeout = setTimeout(() => {
        setBeingStreamedMessage(undefined);
        setBeingStreamedChatId(undefined);
        setTempUserMessage(undefined);
      setTempUserMessageChatId(undefined);
      }, 5000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [beingStreamedMessage, setBeingStreamedMessage, setBeingStreamedChatId, setTempUserMessage, setTempUserMessageChatId]);

  const [prevChatId, setPrevChatId] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (beingStreamedMessage && chatId !== prevChatId) {
      // setBeingStreamedMessage(undefined);
      setTempUserMessage(undefined);
    }
    setPrevChatId(chatId);
  }, [chatId, beingStreamedMessage, prevChatId, setBeingStreamedMessage]);

  useEffect(() => {
    const abortStream = () => {
      if (beingStreamedMessage) {
        // setBeingStreamedMessage(undefined);
        setTempUserMessage(undefined);
      }
    }
    router.events.on('routeChangeStart', abortStream);
    return () => {
      router.events.off('routeChangeStart', abortStream);
    }
  }, [router, beingStreamedMessage, abortController, setBeingStreamedMessage]);

  const userChatsQuery = useQuery({
    queryKey: [GET_USER_CHATS, auth.userData?.id],
    enabled: false,
    refetchOnWindowFocus: false,
    queryFn: getUserChatsQuery
  });
  const streamCallback = useCallback((message: string) => {
    if (message.includes(`{"error":`)) {
      return;
    }
    if (message.includes("undefined")) {
      const newMessage = message.replace("undefined", "");
      setBeingStreamedMessage((prev) => prev + newMessage);
    } else {
      setBeingStreamedMessage((prev) => prev + message);
    }
  }, [streaming, setBeingStreamedMessage]);

  useEffect(() => {
    return () => {
      setBeingStreamedMessage(undefined);
      setBeingStreamedChatId(undefined);
      setTempUserMessage(undefined);
      setTempUserMessageChatId(undefined);
      setStreaming(false);
    }
  }, [])
  
  const completionOnError = useCallback((err: HTTPResponseError) => {
    console.log('errored!')
    setBeingStreamedChatId(() => undefined);
    setBeingStreamedMessage(() => undefined);
    setTempUserMessageChatId(() => undefined);
    setTempUserMessage(() => undefined);
    setStreaming(() => false);
    
    if (err.response.code === 429) {
      setPaywallOpen(true);
    } else {
      toast({
        title: "Oops!",
        description: err.message || "Something went wrong changing pages, please try again.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  }, [setBeingStreamedChatId, setBeingStreamedMessage, setTempUserMessageChatId, setTempUserMessage, setStreaming, toast, setPaywallOpen]);

  const completionMutation = useMutation({
    mutationFn: ({ query }: { query: string }): Promise<string> => {
      if (chatId) {
        setStreaming(true);
        setBeingStreamedMessage(undefined);
        setBeingStreamedChatId(chatId);
        return completionFromQueryMutation({
          query,
          chatId,
          abortController,
          setChatValue: streamCallback,
          onStreamEnd: async () => {
            setBeingStreamedChatId(undefined);
            auth.refresh();
            userChatsQuery.refetch();
            await existingChatQuery.refetch();
            setBeingStreamedMessage(undefined);
            setStreaming(false);
          },
          onError: completionOnError
        });
      } else {
        toast({
          title: "Oops!",
          description:
            "Something went wrong, please create a new chat or refresh.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        return Promise.reject();
      }
    },
    retry: false,
  });

  const existingChatQuery = useQuery({
    queryKey: [GET_CHAT_BY_ID, chatId],
    enabled: !!chatId,
    refetchOnWindowFocus: false,
    queryFn: () => getChatByIdQuery(chatId as string),
    onSuccess: (data) => {
      if (data?.subject || data?.messages?.length > 0) {
        setDisplayWelcome(false);
      } else {
        setDisplayWelcome(true);
      }
      setMessages(data?.messages);
      // if (!completionMutation.isLoading) {
      //   if (beingStreamedMessage) {
      //     setBeingStreamedMessage(undefined);
      //   }
      // }
    },
    onError: (err: HTTPResponseError) => {
      toast({
        title: "Oops!",
        description: err.message || "Something went wrong, please try again.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      router.push("/chat");
    },
  });

  const putChat = useMutation({
    mutationFn: putChatMutation,
    onError: (err: HTTPResponseError) => {
      toast({
        title: "Oops!",
        description: err.message || "Something went wrong, please try again.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    },
    retry: false,
  });

  const createChat = useMutation({
    mutationFn: createChatMutation,
    onSuccess: (data) => {
      router.push({
        query: {
          id: data.id,
        },
        pathname: "/chat",
      });
    },
  });


  // console.log('outside callback - streaming', streaming)
  // console.log('outside callback - beingStreamedMessage', beingStreamedMessage)
  // console.log('outside callback - beingStreamedChatId', beingStreamedChatId)

  const addMessage = useCallback(async (prompt: string) => {
    // Guard clauses
    if (!prompt || prompt.length === 0 || (prompt.replace("\n", "").length === 0)) {
      return;
    }
    if (!chatId) {
      console.error("No chatId found")
      toast({
        title: "Oops!",
        description:
          "Something went wrong, please create a new chat or refresh.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
    // console.log('inside callback - streaming', streaming)
    // console.log('inside callback - beingStreamedMessage', beingStreamedMessage)
    // console.log('inside callback - beingStreamedChatId', beingStreamedChatId)
    if ((streaming) || (beingStreamedChatId && (beingStreamedChatId !== chatId))) {
      toast({
        title: "Please wait for the previous message to respond",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    
    setTempUserMessage(() => 
      ({
        type: MessageType.USER,
        readableContent: prompt,
        createdAt: new Date(),
      })
    );
    setTempUserMessageChatId(chatId);
    // Call mutation
    setStreaming(true);
    await completionMutation.mutateAsync({ query: prompt });
    
  }, [chatId, beingStreamedMessage, completionMutation, toast, streaming, setStreaming, setTempUserMessage, beingStreamedChatId]);

  // User sets a subject from the chat window
  const submitSubject = useCallback(async (subject: string) => {
    if (!chatId) {
      // Create a chat
      await createChat.mutateAsync({
        subject,
      });
      return;
    }
    await putChat.mutateAsync({
      chatId,
      subject,
    });
    existingChatQuery.refetch();
    userChatsQuery.refetch();
  }, [chatId, createChat, putChat, existingChatQuery, userChatsQuery]);

  const providerValue = useMemo(() => {
      return {
        chat: existingChatQuery.data,
        addMessage,
        streaming,
        messages,
        beingStreamedMessage,
        displayWelcome,
        paywallOpen,
        submitSubject,
        activeChatId: chatId,
        tempUserMessage,
        setTempUserMessage,
        setPaywallOpen,
        beingStreamedChatId,
        tempUserMessageChatId,
      };
    }, [
      existingChatQuery.data,
      addMessage,
      messages,
      beingStreamedMessage,
      displayWelcome,
      paywallOpen,
      submitSubject,
      chatId,
      tempUserMessage,
      setTempUserMessage,
      streaming,
      setPaywallOpen,
      beingStreamedChatId,
      tempUserMessageChatId,
    ]);
  return (
    <ChatContext.Provider value={providerValue}>
      {children}
    </ChatContext.Provider>
  );
};
