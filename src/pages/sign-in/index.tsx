import { SignIn } from "@clerk/react";

export function SignInPage() {
  return (
    <div className="flex flex-1 h-screen items-center justify-center">
      <SignIn
        appearance={{
          elements: {
            cardBox: {
              boxShadow: 'none',
              border: '1px solid #e5e7eb',
            },
            button: {
              boxShadow: 'none',
              height: '40px',
            },
          }
        }}
      />
    </div>
  );
}

export default SignInPage;
