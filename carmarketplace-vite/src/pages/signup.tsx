import AuthForm from "../components/AuthForm";
import { signUp } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  
  const handleSubmit = async (email: string, password: string) => {
    try {
      const user = await signUp(email, password);
      console.log("Signed up:", user);
      navigate("/cars");
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return <AuthForm mode="signup" onSubmit={handleSubmit} />;
}
