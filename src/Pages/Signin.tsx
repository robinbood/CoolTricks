import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import "../CSS/Form.css";
import { useAuth } from "../contexts/AuthContext";
import { NotificationContext } from "../components/NotificationContext";

interface Info {
  username: string;
  password: string;
}

const SignIn = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useContext(NotificationContext);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Info>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const WhenSubmit: SubmitHandler<Info> = async (data) => {
    setLoading(true);
    setError("");
    
    try {
      const success = await signIn(data);
      if (success) {
        showNotification("Sign in successful!", "success");
        navigate("/home");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("An error occurred during sign in");
    } finally {
      setLoading(false);
      reset();
    }
  };

  return (
    <div className="Signup-form">
      <div className="box">
        <h2 className={error ? "response" : "heading"}>
        {error ? (
          error
        ) : (
          <>
            <span>Enter</span> your Info
          </>
        )}
      </h2>{" "}
      </div>
      <form onSubmit={handleSubmit(WhenSubmit)} autoComplete="off">
        <input
          {...register("username", {
            required: "This is important",
            minLength: {
              value: 4,
              message: "Too short",
            },
          })}
          placeholder="Username"
          className={errors.username?.message ? "error" : ""}
        />
        {errors.username?.message && (
          <span className="error-message">{errors.username.message}</span>
        )}
        <input
          {...register("password", {
            required: "This is important",
            minLength: {
              value: 8,
              message: "Weak password",
            },
          })}
          placeholder="Password"
          className={errors.password?.message ? "error" : ""}
        />
        {errors.password?.message && (
          <span className="error-message">{errors.password.message}</span>
        )}

        <h2 className="password-reset">
          <Link to="/forgot-pass" > Forgot the password huh?</Link>
        </h2>

        <h2>
          Not a member ? <Link to="/Signup"  >Sign up</Link>
        </h2>

        <input type="submit" value={loading ? "Signing In..." : "Sign In"} disabled={loading} />
      </form>
    </div>
  );
};

export default SignIn;
