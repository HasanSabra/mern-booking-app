import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";

const SignOutButton = () => {
  const queryClient = useQueryClient();

  const { showToast } = useAppContext();

  const mutation = useMutation(apiClient.signOut, {
    onSuccess: async () => {
      // Show Toast
      showToast({
        message: "Sign Out!",
        type: "SUCCESS",
      });
      await queryClient.invalidateQueries("validateToken"); // force the validateToken funtion to run again
    },
    onError: (error: Error) => {
      // Show Toast
      showToast({
        message: error.message,
        type: "ERROR",
      });
    },
  });

  const handleClick = () => {
    mutation.mutate();
  };

  return (
    <button
      className='text-blue-600 px-3 font-bold bg-white hover:bg-gray-100'
      onClick={handleClick}
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;
