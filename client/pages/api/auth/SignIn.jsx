import { signIn, getProviders } from "next-auth/react";

export async function getServerSideProps(context) {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}

const redirectTo = { callbackUrl: "http://localhost:3000/testpage" };

export default function SignIn({ providers }) {
  return (
    <div>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button onClick={() => signIn(provider.id, redirectTo)}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}
