import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../utils/supabase";
import { getMapState } from "../../map/api/useMapState";
import { useKioskStore } from "../../../store/useKioskStore";
import { Tent, ChevronLeft, UserPlus, Users, Phone } from "lucide-react";

export function AuthForm() {
  const [view, setView] = useState<"home" | "signin" | "signup">("home");
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const setSession = useKioskStore((state: any) => state.setSession);

  const signInMutation = useMutation({
    mutationFn: async ({ phone }: { phone: string }) => {
      const { data, error } = await supabase.rpc("login_with_phone", {
        p_phone: phone,
      });
      if (error) throw error;
      if (!data || !data.success)
        throw new Error(data?.error || "Invalid phone number");
      return data;
    },
    onSuccess: async (data) => {
      const pioneerId = data.user.id;
      const alias = data.user.first_name;

      setSession({
        pioneerId,
        alias,
      });

      setWelcomeMessage(`Welcome back, ${alias}!`);

      // Wait for a couple seconds before redirecting
      setTimeout(async () => {
        try {
          const mapState = await getMapState(pioneerId);
          if (mapState.myPlotId !== null) {
            navigate("/visit-payment");
          } else {
            navigate("/map");
          }
        } catch {
          navigate("/map");
        }
      }, 2000);
    },
    onError: (error) => {
      setLocalError(error.message || "An unexpected error occurred");
    },
  });

  const signUpMutation = useMutation({
    mutationFn: async ({
      firstName,
      phone,
    }: {
      firstName: string;
      phone: string;
    }) => {
      const { data, error } = await supabase.rpc("register_with_phone", {
        p_first_name: firstName,
        p_phone: phone,
      });
      if (error) throw error;
      if (!data || !data.success)
        throw new Error(data?.error || "Failed to register");
      return data;
    },
    onSuccess: (data) => {
      setSession({
        pioneerId: data.user.id,
        alias: data.user.first_name,
      });
      navigate("/map");
    },
    onError: (error) => {
      setLocalError(error.message || "An unexpected error occurred");
    },
  });

  const isSubmitting =
    signInMutation.isPending ||
    signUpMutation.isPending ||
    welcomeMessage !== null;
  const displayError = localError;

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setLocalError("Please enter your phone number");
      return;
    }

    setLocalError(null);
    signInMutation.mutate({ phone: phone.trim() });
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setLocalError("We need a name for the deed!");
      return;
    }
    if (!phone.trim()) {
      setLocalError("Please enter your phone number");
      return;
    }

    setLocalError(null);
    signUpMutation.mutate({ firstName: firstName.trim(), phone: phone.trim() });
  };

  const resetToHome = () => {
    setView("home");
    setFirstName("");
    setPhone("");
    setLocalError(null);
    setWelcomeMessage(null);
  };

  return (
    <>
      {view === "home" && (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <p className="text-center text-dark-blue font-medium text-lg sm:text-xl mb-6">
            Stake your claim on the greens! Are you a returning settler or a new
            pioneer?
          </p>

          <button
            onClick={() => {
              setView("signin");
              setLocalError(null);
            }}
            className="w-full flex items-center justify-center p-4 bg-light-blue text-cream hover:bg-light-blue/90 transition-colors rounded shadow-lg shadow-light-blue/30 group"
          >
            <Users className="mr-3 group-hover:scale-110 transition-transform" />
            <span className="font-sans text-lg tracking-wide uppercase font-bold">
              Find My Claim (Sign In)
            </span>
          </button>

          <div className="flex items-center justify-center space-x-2 my-2">
            <span className="h-px bg-dark-blue/30 w-1/4"></span>
            <span className="text-dark-blue font-bold text-sm uppercase">
              or
            </span>
            <span className="h-px bg-dark-blue/30 w-1/4"></span>
          </div>

          <button
            onClick={() => {
              setView("signup");
              setLocalError(null);
            }}
            className="w-full flex items-center justify-center p-4 bg-red text-cream hover:bg-red/90 transition-colors rounded shadow-lg shadow-red/30 group"
          >
            <UserPlus className="mr-3 group-hover:scale-110 transition-transform" />
            <span className="font-sans text-lg tracking-wide uppercase font-bold">
              Stake A Claim (Sign Up)
            </span>
          </button>
        </div>
      )}

      {view === "signin" && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center mb-2">
            <button
              onClick={resetToHome}
              disabled={welcomeMessage !== null}
              className="p-2 text-dark-blue hover:bg-dark-blue/5 disabled:opacity-50 rounded transition-colors -ml-2"
            >
              <ChevronLeft />
            </button>
          </div>

          <div className="text-center space-y-2">
            <h3 className="font-serif text-dark-blue text-2xl font-bold uppercase tracking-tighter">
              Welcome Back
            </h3>
            <p className="text-dark-blue/70 text-sm font-medium">
              Enter your phone number to find your claim.
            </p>
          </div>

          {welcomeMessage ? (
            <div className="py-12 text-center animate-in zoom-in duration-300">
              <h2 className="text-3xl font-serif text-red font-bold uppercase tracking-wider mb-2">
                {welcomeMessage}
              </h2>
              <p className="text-dark-blue/70 font-medium">
                Heading to the greens...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSignInSubmit} className="space-y-6">
              <div className="space-y-1 text-left">
                <label className="block text-dark-blue font-sans font-bold uppercase tracking-widest text-xs">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={18} className="text-dark-blue/50" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setLocalError(null);
                    }}
                    disabled={isSubmitting}
                    className="w-full pl-10 p-3 bg-white/50 border border-dark-blue/30 rounded text-dark-blue font-serif text-lg focus:outline-none focus:border-light-blue focus:ring-1 focus:ring-light-blue"
                    placeholder="(555) 555-5555"
                    autoFocus
                  />
                </div>
              </div>

              {displayError && (
                <p className="text-center text-red font-bold text-sm bg-red/10 py-2 rounded border border-red/30">
                  {displayError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !phone.trim()}
                className="w-full py-4 bg-light-blue text-cream disabled:bg-dark-blue/40 hover:bg-light-blue/90 transition-colors rounded shadow-lg shadow-light-blue/30 tracking-wide uppercase font-bold text-lg"
              >
                {isSubmitting ? "Searching..." : "Unlock Claim"}
              </button>
            </form>
          )}
        </div>
      )}

      {view === "signup" && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center mb-2">
            <button
              onClick={resetToHome}
              className="p-2 text-dark-blue hover:bg-dark-blue/5 rounded transition-colors -ml-2"
            >
              <ChevronLeft />
            </button>
          </div>

          <div className="text-center space-y-2">
            <Tent className="mx-auto text-red mb-2" size={40} />
            <h3 className="font-serif text-dark-blue text-2xl font-bold uppercase tracking-tighter">
              Stake Your Claim
            </h3>
            <p className="text-dark-blue/70 text-sm font-medium">
              Register for the Land Rush to start puttin'.
            </p>
          </div>

          <form onSubmit={handleSignUpSubmit} className="space-y-5">
            <div className="space-y-1 mb-4 text-left">
              <label className="block text-dark-blue font-sans font-bold uppercase tracking-widest text-xs">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setLocalError(null);
                }}
                disabled={isSubmitting}
                className="w-full p-3 bg-white/50 border border-dark-blue/30 rounded text-dark-blue font-serif text-lg focus:outline-none focus:border-light-blue focus:ring-1 focus:ring-light-blue"
                placeholder="e.g. Wyatt"
                autoFocus
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="block text-dark-blue font-sans font-bold uppercase tracking-widest text-xs">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={18} className="text-dark-blue/50" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setLocalError(null);
                  }}
                  disabled={isSubmitting}
                  className="w-full pl-10 p-3 bg-white/50 border border-dark-blue/30 rounded text-dark-blue font-serif text-lg focus:outline-none focus:border-light-blue focus:ring-1 focus:ring-light-blue"
                  placeholder="(555) 555-5555"
                />
              </div>
            </div>

            {displayError && (
              <p className="text-center text-red font-bold text-sm bg-red/10 py-2 border border-red/30 rounded">
                {displayError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !firstName.trim() || !phone.trim()}
              className="w-full py-4 mt-2 bg-red text-cream disabled:bg-dark-blue/40 hover:bg-red/90 transition-colors rounded shadow-lg shadow-red/30 tracking-wide uppercase font-bold text-lg"
            >
              {isSubmitting ? "Registering..." : "Register & Play"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
