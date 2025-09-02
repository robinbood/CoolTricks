import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { useState } from "react";

interface Info {
  name?: string;
  username: string;
  password: string;
}

const SignUp = () => {
  const [response, SetResponse] = useState<string>("");

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Info>({
    defaultValues: {
      name: "",
      username: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const WhenSubmit: SubmitHandler<Info> = async (data) => {
    try {
      const response = await fetch("http://localhost:3000/api/Signup", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.status === 201) {
        setTimeout(() => {
          navigate("/api/Signin");
        }, 1000);
        const rec = await response.json();
        SetResponse(rec.message);
        setTimeout(() => {
          SetResponse("");
        }, 1200);
      } else {
        const errorText = await response.json();
        SetResponse(errorText.message);
        setTimeout(() => {
          SetResponse("");
        }, 2000);
      }
    } catch (error: unknown) {
      console.log("Network Error: ", error);
    }

    
  };
  return (
      <div className="Signup-form">
        <h2 className="heading">
          {response ? (
            response
          ) : (
            <>
              <span>Enter</span> your details
            </>
          )}
        </h2>{" "}
        <form onSubmit={handleSubmit(WhenSubmit)}>
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
          <input type="submit" />
        </form>
      </div>
    );
};

export default SignUp;
