import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "STR | Sign In",
  description: "",
};

export default function SignIn() {
  return <SignInForm />;
}
