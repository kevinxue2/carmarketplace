import AuthForm from "../components/AuthForm";
import { signIn } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const navigate = useNavigate();

  const handleSubmit = async (email: string, password: string) => {
    try {
      const user = await signIn(email, password);
      console.log("Signed up:", user);
      navigate("/cars")
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return <AuthForm mode="signin" onSubmit={handleSubmit} />;
}
