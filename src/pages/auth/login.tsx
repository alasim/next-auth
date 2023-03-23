import React from "react";
import { signIn } from "next-auth/react";
function login() {
  return (
    <div>
      <h2>Login to Account</h2>

      <input type="text" />
      <button
        onClick={async () => {
          const res = await signIn("credentials", {
            name: "Hasan Mahmud",
            email: "hasan@klwebco.com",
            password: "123456",
            redirect: false,
          }).catch((err) => {
            console.error(err);
          });
          console.log({ res });
        }}
      >
        Continue with Credential
      </button>

      <button
        onClick={() => {
          signIn("google", { callbackUrl: "/" })
            .then((res) => {
              console.log({ res });
            })
            .catch((err) => {
              console.log({ err });
            });
        }}
      >
        Google
      </button>
      <button>Github</button>
    </div>
  );
}

export default login;
