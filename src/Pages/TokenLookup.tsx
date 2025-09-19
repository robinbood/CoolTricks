import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { useState } from "react";

interface Info {
  token:string,
  password:string,
  newPass:string;
}

const TokenLook = () => {
    const [response, SetResponse] = useState<string>("");

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch
  } = useForm<Info>({
    defaultValues: {
      token: "",
      password: ""
    },
  });

  const navigate = useNavigate();
  const match = watch("password")

  const WhenSubmit: SubmitHandler<Info> = async (data: Info) => {
    const {token,newPass} = data
    
    try {
      const response = await fetch("http://localhost:3000/token-lookup", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ token, newPass }),
      });
      
      if (response.status === 201) {
        setTimeout(() => {
          navigate("/Signin");
        }, 2000);
        const rec = await response.json();
        SetResponse(rec.message);
        setTimeout(() => {
          SetResponse("");
        }, 2000);
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
        <div className="box">
          <h2 className={response ? "response" : "heading"}>
          {response ? (
            response
          ) : (
            <>
              <span>Enter</span> your details
            </>
          )}
        </h2>{" "}
        </div>
        <form onSubmit={handleSubmit(WhenSubmit)} autoComplete="off">
          <input
            {...register("token", {
              required: "This is important",
              minLength: {
                value: 1,
                message: "Invalid",
              },
              
            })}
            placeholder="Token"
            className={errors.token?.message ? "error" : ""}
            
          />

          {errors.token?.message && (
            <span className="error-message">{errors.token.message}</span>
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
          
          <input
            {...register("newPass", {
              required: "This is important",
              validate:(value) => value === match || "Passwords do not mactch "
            })}
            placeholder=" Confirm Password"
            className={errors.password?.message ? "error" : ""}
          />
          {errors.newPass?.message && (
            <span className="error-message">{errors.newPass.message}</span>
          )}

          <input type="submit" value="Change password"  />
          
        </form>
      </div>
    );
};

export default TokenLook;
