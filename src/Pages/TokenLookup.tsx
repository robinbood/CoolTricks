import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useFormSubmit } from "../Functionalities/useFormSubmit";

// create interface
interface Info {
  token:string,
  password:string,
  newPass:string;
}

const TokenLook = () => {
  const { response, handleSubmit: handleFormSubmit } = useFormSubmit<Info>({ url: "/token-lookup", redirectUrl: "/Signin" });

// using react-hook-form here for obvious reasons
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch
  } = useForm<Info>({
    // is this important ? no but it looks cool
    defaultValues: {
      token: "",
      password: ""
    },
  });

  // watching a field means it's being controlled and causing re=renders
  const match = watch("password")

  const WhenSubmit: SubmitHandler<Info> = (data: Info) => {
    handleFormSubmit(data);
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

export default TokenLook;
