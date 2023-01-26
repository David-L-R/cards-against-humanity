import { signIn, getProviders } from "next-auth/react";
import { CgCloseO } from "react-icons/cg";
import { FcGoogle } from "react-icons/fc";

export async function getServerSideProps(context) {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}

const redirectTo = { callbackUrl: "http://localhost:3000/" };

export default function SignIn({ providers, showSignIn, setShowSignIn }) {
  if (!showSignIn) return;
  console.log(providers, "providers");
  return (
    <div className="gameRulesBackdrop">
      <div className="signInContainer">
        <button onClick={() => setShowSignIn(false)}>
          <CgCloseO className="signInClose" />
        </button>
        {Object.values(providers).map((provider) => (
          <div key={provider.name} className="authProviderButtonContainer">
            <button
              onClick={() => signIn(provider.id, redirectTo)}
              className="authProviderButton"
            >
              {provider.name === "Google" && <FcGoogle className="Google" />}
              Sign in with {""}
              {provider.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
/*
{Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button onClick={() => signIn(provider.id, redirectTo)}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}



*/
