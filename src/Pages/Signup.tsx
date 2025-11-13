import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import zxcvbn from "zxcvbn";
import { NotificationContext } from "../components/NotificationContext";
import { buildApiUrl, API_ENDPOINTS } from "../config/api";

interface Info {
  email:string,
  name?: string;
  username: string;
  password: string;
}

const SignUp = () => {
  const navigate = useNavigate();
  const { showNotification } = useContext(NotificationContext);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm<Info>({
    defaultValues: {
      email:"",
      name: "",
      username: "",
      password: "",
    },
  });

  const WhenSubmit: SubmitHandler<Info> = async (data) => {
    setLoading(true);
    setError("");
    
    try {
      // First, register the user
      const response = await fetch(buildApiUrl(API_ENDPOINTS.SIGN_UP), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for including HTTP-only cookies
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        showNotification("Signup successful! Please sign in.", "success");
        // Redirect to sign in page after successful signup
        setTimeout(() => {
          navigate("/Signin");
        }, 2000);
      } else {
        setError(result.message || "Signup failed");
      }
    } catch (err) {
      setError("An error occurred during signup");
    } finally {
      setLoading(false);
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
              <span>Enter</span> your details
            </>
          )}
        </h2>{" "}
        </div>
        <form onSubmit={handleSubmit(WhenSubmit)} autoComplete="off">
          <input
            {...register("email", {
              required: "This is important",
              minLength: {
                value: 1,
                message: "Invalid",
              },
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email format"
              }
            })}
            placeholder="Email"
            className={errors.email?.message ? "error" : ""}
            
          />

          {errors.email?.message && (
            <span className="error-message">{errors.email.message}</span>
          )}
          
          <input
            {...register("name", {
              required: false,
              minLength: {
                value: 4,
                message: "Way too short",
              },
            })}
            placeholder="Name"
            className={errors.name?.message ? "error" : ""}
          />

          {errors.name?.message && (
            <span className="error-message">{errors.name.message}</span>
          )}
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
              // added zxcvbn here  it is by far the best password checker i have seen..the score 3 and above is okat but if you want more precise errors you can get those other fields it offers so yuou can guyide the user better..personally for me those extra fieldes don't realy matter
              validate: (value) => {
                const result = zxcvbn(value);
                return result.score >= 3 || result.feedback.suggestions;
              }
            })}
            placeholder="Password"
            className={errors.password?.message ? "error" : ""}
          />
          {errors.password?.message && (
            <span className="error-message">{errors.password.message}</span>
          )}

          <h2>Already a member ? <Link to="/Signin">Sign In</Link></h2>
          <input type="submit" value={loading ? "Creating Account..." : "Create Account"} disabled={loading} />
          
        </form>
      </div>
    );
};

export default SignUp;
