import React, { useContext } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { loadStripe, Stripe } from "@stripe/stripe-js";

const STRIPE_PUB_KEY = import.meta.env.VITE_STRIPE_PUB_KEY || "";

// A toast message is a message that is shown to the user for a short period of time. It is usually used to show a success or error message to the user after an action is performed.
type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
}; // Define the type of the toast message1

type AppContext = {
  showToast: (toastMessage: ToastMessage) => void; // Define the function to show the toast message
  isLoggedIn: boolean; // Define the state to check if the user is logged in
  stripePromise: Promise<Stripe | null>; // Define the promise to load the Stripe object
}; // Define the AppContext type

const AppContext = React.createContext<AppContext | undefined>(undefined); // Create the AppContext

const stripePromise = loadStripe(STRIPE_PUB_KEY); // Create a promise to load the Stripe object

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [toast, setToast] = React.useState<ToastMessage | undefined>(undefined); // Define the state to store the toast message

  const { isError } = useQuery("validateToken", apiClient.validateToken, {
    retry: false,
  }); // Define a query to check if the user is logged in

  return (
    <AppContext.Provider
      value={{
        showToast: (toastMessage) => {
          setToast(toastMessage);
        },
        isLoggedIn: !isError,
        stripePromise,
      }}
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(undefined)}
        />
      )}
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  return context as AppContext;
};
