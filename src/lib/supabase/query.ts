import supabaseClient from "./client";

export const getUser = async () => {
  const { data, error } = await supabaseClient.auth.getUser();
  if (error) throw error;
  return data.user;
};

export const getUserMetadata = async () => {
  const { data, error } = await supabaseClient
    .from("user_metadata")
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};
