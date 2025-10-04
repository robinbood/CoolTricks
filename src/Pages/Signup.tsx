import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import zxcvbn from "zxcvbn";

interface Info {
  email:string,
  name?: string;
  username: string;
  password: string;
}

const SignUp = () => {
  const [response, SetResponse] = useState<string>("");

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

  const navigate = useNavigate();

  const WhenSubmit: SubmitHandler<Info> = async (data) => {
    console.log(data);
    
    try {
      const response = await fetch("http://localhost:3000/Signup", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
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
          <input type="submit" value="Create Account"  />
          
        </form>
      </div>
    );
};

export default SignUp;
