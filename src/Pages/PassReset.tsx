import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import { useState } from "react";
import "../CSS/Form.css";

interface Info {
  email:string
}

const PassReset = () => {
  const [response, SetResponse] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<Info>({
    defaultValues: {
      email:""
    },
  });

  const navigate = useNavigate();

  const WhenSubmit: SubmitHandler<Info> = async (data) => {
    try {
      const response = await fetch("http://localhost:3000/forgot-pass", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.status === 200) {
        const res = await response.json();
        SetResponse(res.message);
        
        setTimeout(() => {
          navigate("/token-verification");
        }, 2000);
        setTimeout(() => {
          SetResponse("");
        },1200);
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
      <div className="box">
        <h2 className={response ? "response" : "heading"}>
        {response ? (
          response
        ) : (
          <>
            <span>Enter</span> your Email
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

    

        <input type="submit" value="Send Token" />
      </form>
    </div>
  );
};

export default PassReset;
