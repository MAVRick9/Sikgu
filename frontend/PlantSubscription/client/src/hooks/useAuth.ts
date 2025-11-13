// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { apiRequest } from "@/lib/queryClient";
//
// interface User {
//   id: string;
//   username: string;
//   coins: number;
//   address: string | null;
//   phone: string | null;
// }
//
// export function useAuth() {
//   const queryClient = useQueryClient();
//
//   const { data: user, isLoading } = useQuery<User>({
//     queryKey: ["/api/auth/me"],
//     retry: false,
//   });
//
//   const loginMutation = useMutation({
//     mutationFn: async ({ username, password }: { username: string; password: string }) => {
//       const response = await fetch("/api/auth/login", {
//         method: "POST",
//         body: JSON.stringify({ username, password }),
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//       });
//
//       if (!response.ok) {
//         const error = await response.text();
//         throw new Error(error);
//       }
//
//       return response.json();
//     },
//     onSuccess: (data) => {
//       queryClient.setQueryData(["/api/auth/me"], data);
//       queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
//     },
//   });
//
//   const logoutMutation = useMutation({
//     mutationFn: async () => {
//       const response = await fetch("/api/auth/logout", {
//         method: "POST",
//         credentials: "include",
//       });
//
//       if (!response.ok) {
//         const error = await response.text();
//         throw new Error(error);
//       }
//
//       return response.json();
//     },
//     onSuccess: () => {
//       queryClient.setQueryData(["/api/auth/me"], null);
//       queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
//     },
//   });
//
//   return {
//     user,
//     isLoading,
//     isAuthenticated: !!user,
//     login: loginMutation.mutateAsync,
//     logout: logoutMutation.mutateAsync,
//     isLoginLoading: loginMutation.isPending,
//     isLogoutLoading: logoutMutation.isPending,
//   };
// }

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: string;
  username: string;
  coins: number;
  address: string | null;
  phone: string | null;
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      // Bearer token을 받아서 로컬 스토리지에 저장
      const token = await response.text();
      localStorage.setItem("authToken", token);
      return { token };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/auth/me"], data);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/me"], null);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoginLoading: loginMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
  };
}