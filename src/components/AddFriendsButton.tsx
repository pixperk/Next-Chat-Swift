"use client";

import { addFriendValidator } from "@/lib/validations/add-friend";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Button from "./ui/Button";

interface AddFriendsButtonProps {}

type FormData = z.infer<typeof addFriendValidator>;

const AddFriendsButton: FC<AddFriendsButtonProps> = ({}) => {
  const [showSuccessState, setShowSuccessState] = useState<boolean>(false);

  const { register, handleSubmit, setError, formState:{errors} } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  });

  const addFriend = async (email: string) => {
    try {
      const validatedEmail = addFriendValidator.parse({ email });

      await axios.post("/api/friends/add", {
        email: validatedEmail,
      });

      setShowSuccessState(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError('email',{message : error.message});
        return;
      }
      if (error instanceof AxiosError) {
        setError('email',{message : error.response?.data});
        return;
      }

      setError('email',{message : 'Oops! Something Went Wrong'});
    }
  };

  const onSubmit = (data:FormData) => {
    addFriend(data.email)
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
      <label
        htmlFor="email"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Search by E-Mail
      </label>
      <div className="mt-2 flex gap-4">
        <input
          {...register("email")}
          type="text"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="chatSwiftUser@awesome.com"
        />
        <Button>Add</Button>
      </div>
      <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
      {showSuccessState && (
        <p className="mt-1 text-sm text-green-600">Friend Request Sent</p>
      )}
    </form>
  );
};

export default AddFriendsButton;
