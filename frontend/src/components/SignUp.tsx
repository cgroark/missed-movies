import { useState } from "react";
import { useAuth } from "../context/AuthContext";

interface formData {
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
}

function SignUp() {

  // const [formData, setFormData] = useState<formData>({
  //   name: '',
  //   email: '',
  //   password: '',
  //   confirmPassword: '',
  // });
  // const [error, setError] = useState<string>('');
  // const [message, setMessage] = useState<string>('');
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (mode === "login") await signIn(email, password);
      else await signUp(email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError('');
  //   setMessage('');

  //   const { name, email, password, confirmPassword } = formData;

  //   if(password !== confirmPassword) {
  //     setError('Passwords must match');
  //     return;
  //   }

  //   try {
  //     const {data, error} = await supabase.auth.signUp({
  //       email,
  //       password,
  //       options: {
  //         data: {name},
  //       }
  //     });

  //     if (error) throw error;
  //     setMessage("✅ Check your email to confirm your account!");
  //     console.log("Supabase signUp response:", data);
  //   } catch (err: any) {
  //     setError(err.message || "Error signing up");
  //   }
  // }

  return (
    <>
      <div>
      <h2>{mode === "login" ? "Login" : "Sign Up"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{mode === "login" ? "Login" : "Sign Up"}</button>
      </form>
      <p style={{ color: "red" }}>{error}</p>
      <button onClick={() => setMode(mode === "login" ? "signup" : "login")}>
        {mode === "login" ? "Need an account?" : "Already have one?"}
      </button>
    </div>
    </>
  )
}
export default SignUp;