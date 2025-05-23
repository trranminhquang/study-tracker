import { User } from "./client";
import { Tables } from "./db-types";

export const transformUser = (
  user: User,
  userMetadata: Tables<"user_metadata">
) => {
  return {
    id: user.id,
    email: user.email,
    name: userMetadata.name,
    avatar_url: userMetadata.avatar_url,
    created_at: user.created_at ?? userMetadata.created_at,
    confirmed_at: user.confirmed_at,
    last_sign_in_at: user.last_sign_in_at,
    updated_at: userMetadata.updated_at ?? user.updated_at,
    role: user.role,
    email_change_sent_at: user.email_change_sent_at,
    invited_at: user.invited_at,
    phone: user.phone,
    is_anonymous: user.is_anonymous,
    is_sso_user: user.is_sso_user,
  };
};
