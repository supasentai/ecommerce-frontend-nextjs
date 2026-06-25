import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addItemToCart,
  clearCart,
  getCurrentCart,
  removeCartItem,
  updateCartItemQuantity,
} from "@/features/cart/api";

export const cartQueryKey = ["cart"] as const;

export function useCart(enabled = true) {
  return useQuery({
    queryKey: cartQueryKey,
    queryFn: getCurrentCart,
    enabled,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addItemToCart,
    onSuccess: (cart) => {
      queryClient.setQueryData(cartQueryKey, cart);
      void queryClient.invalidateQueries({ queryKey: cartQueryKey });
    },
  });
}

export function useUpdateCartItemQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCartItemQuantity,
    onSuccess: (cart) => {
      queryClient.setQueryData(cartQueryKey, cart);
      void queryClient.invalidateQueries({ queryKey: cartQueryKey });
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCartItem,
    onSuccess: (cart) => {
      queryClient.setQueryData(cartQueryKey, cart);
      void queryClient.invalidateQueries({ queryKey: cartQueryKey });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,
    onSuccess: (cart) => {
      queryClient.setQueryData(cartQueryKey, cart);
      void queryClient.invalidateQueries({ queryKey: cartQueryKey });
    },
  });
}
