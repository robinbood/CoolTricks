import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import "../CSS/Form.css";

interface Info {
  username: string;
  password: string;
}

const SignIn = () => {
  const [response, SetResponse] = useState<string>("");

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

  const navigate = useNavigate();

  const WhenSubmit: SubmitHandler<Info> = async (data) => {
    try {
      const response = await fetch("http://localhost:3000/Signin", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      setTimeout(() => {
        reset()
      }, 1000);
      if (response.status === 200) {
        const res = await response.json();
        SetResponse(res.message);
        setTimeout(() => {
          reset();
        });
        setTimeout(() => {
          navigate("/api/home");
        }, 2000);
        setTimeout(() => {
          SetResponse("");
        });
      } else {
        const res = await response.json();
        SetResponse(res.message);
        setTimeout(() => {
          SetResponse("");
        }, 2000);
      }
    } catch (error: unknown) {
      console.log("Unknown error:", error);
    }
  };

  return (
    <div className="Signup-form">
      <h2 className="heading">
        {response ? (
          response
        ) : (
          <>
            <span>Enter</span> your Info
          </>
        )}
      </h2>{" "}
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

        <h2>
          Not a member ? <Link to="/Signup">Sign up</Link>
        </h2>

        <input type="submit" value="Sign In" onClick={() => setTimeout(() => reset(), 1000)}/>
      </form>
    </div>
  );
};

export default SignIn;
