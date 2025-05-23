import { RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import router from "@pages/content/router";

import AuthProvider from "@providers/auth-provider";
import AppProvider from "@providers/app-provider";

const queryClient = new QueryClient();

const ContentIndex = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppProvider>
          <RouterProvider router={router} />
        </AppProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default ContentIndex;
