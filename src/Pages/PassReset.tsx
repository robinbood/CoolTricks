import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import "../CSS/Form.css";
import { useFormSubmit } from "../Functionalities/useFormSubmit";

interface Info {
  email:string
}

const PassReset = () => {
  const { response, handleSubmit: handleFormSubmit } = useFormSubmit<Info>({ url: "/forgot-pass", redirectUrl: "/token-lookup" });

  const {
    register,
    handleSubmit,
    formState: { errors },
    
  } = useForm<Info>({
    defaultValues: {
      email:""
    },
  });

  const WhenSubmit: SubmitHandler<Info> = (data) => {
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
