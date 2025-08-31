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
        const response = await  fetch("http://localhost:3000/api/Signup",{
            method:"POST",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify(data)
        })
    } catch (error) {
        
    }
  };
};

export default SignUp;
