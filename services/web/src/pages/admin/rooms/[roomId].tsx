import Head from "next/head";
import useAuth from "@judie/hooks/useAuth";
import { ChatProvider } from "@judie/hooks/useChat";
import AdminSidebarPageContainer from "@judie/components/admin/AdminSidebarPageContainer/AdminSidebarPageContainer";
import AdminRoom from "@judie/components/admin/AdminRoom/AdminRoom";
import { useRouter } from "next/router";

function AdminPage() {
  useAuth();
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Judie - Admin</title>
        <meta
          name="description"
          content="Welcome to Judie Admin! We're here to help with your classes, from elementary english to college level maths."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <ChatProvider>
          <AdminSidebarPageContainer>
            <AdminRoom id={router.query.roomId as string} />
          </AdminSidebarPageContainer>
        </ChatProvider>
      </main>
    </>
  );
}

AdminPage.displayName = "Admin Root";

export default AdminPage;
