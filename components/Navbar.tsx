import { useOutletContext } from "react-router";
import { Box } from "lucide-react";

// If you built the custom Button component from the video, import it here.
// Otherwise, we can use a standard button for now to prevent "undefined" errors.
interface AuthContext {
  isSignedIn: boolean;
  userName: string | null;
  userId: string | null;
  signIn: () => Promise<boolean>;
  signOut: () => Promise<boolean>;
}

export default function Navbar() {
  // Extract the auth state and actions directly from the React Router outlet context
  const { isSignedIn, userName, signIn, signOut } = useOutletContext<AuthContext>();

  return (
      <header className="navbar">
        <nav className="inner">
          {/* Left Side: Branding & Navigation Links */}
          <div className="left">
            <div className="brand">
              <Box className="logo" />
              <span className="name">arche</span>
            </div>

            <ul className="links">
              <li><a href="#">Product</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">Community</a></li>
              <li><a href="#">Enterprise</a></li>
            </ul>
          </div>

          {/* Right Side: Conditional Authentication Actions */}
          <div className="actions">
            {!isSignedIn ? (
                <>
                  <button
                      onClick={signIn}
                      className="btn btn-variant-ghost btn-size-sm login"
                  >
                    Log in
                  </button>
                  <a href="#upload" className="cta">
                    Get started
                  </a>
                </>
            ) : (
                <>
              <span className="greeting">
                Hi {userName || "User"}
              </span>
                  <button
                      onClick={signOut}
                      className="btn btn-size-sm logout"
                  >
                    Log out
                  </button>
                </>
            )}
          </div>
        </nav>
      </header>
  );
}