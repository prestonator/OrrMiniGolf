import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import { getMapState } from "../utils/api";
import { useKioskStore } from "../store/useKioskStore";
import {
  Tent,
  ChevronLeft,
  Lock,
  UserPlus,
  Users,
  Search,
} from "lucide-react";

export function AuthForm({
  players = [],
}: {
  players?: { id: string; username: string }[];
}) {
  const [view, setView] = useState<
    "home" | "signin-list" | "signin-pin" | "signup"
  >("home");
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    username: string;
  } | null>(null);
  const [identity, setIdentity] = useState("");
  const [pin, setPin] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const setSession = useKioskStore((state) => state.setSession);

  const filteredPlayers = players.filter((player) =>
    player.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const signInMutation = useMutation({
    mutationFn: async ({
      username,
      pin,
    }: {
      username: string;
      pin: string;
    }) => {
      // Mocking RPC call for PIN validation per plan
      const { data, error } = await supabase.rpc("validate_pin", {
        p_identity: username,
        p_pin: pin,
      });
      if (error) throw error;
      if (!data || !data.success) throw new Error("Invalid PIN");
      return data; // Expected to return { success: true, user: { id: string, username: string } }
    },
    onSuccess: async (_data, variables) => {
      const pioneerId = selectedUser?.id || "";
      setSession({
        pioneerId,
        alias: variables.username,
      });
      
      try {
        const mapState = await getMapState(pioneerId);
        if (mapState.myPlotId !== null) {
          navigate("/visit-payment");
        } else {
          navigate("/map");
        }
      } catch (err) {
        // Fallback to map if query fails
        navigate("/map");
      }
    },
    onError: (error) => {
      setLocalError(error.message || "An unexpected error occurred");
      setPin("");
    },
  });

  const signUpMutation = useMutation({
    mutationFn: async ({
      username,
      pin,
    }: {
      username: string;
      pin: string;
    }) => {
      const { data, error } = await supabase.rpc("register_pin", {
        p_identity: username,
        p_pin: pin,
      });
      if (error) throw error;
      if (!data || !data.success) throw new Error("Failed to register");
      return data;
    },
    onSuccess: (data, variables) => {
      setSession({
        pioneerId: data.user?.id || "new-id",
        alias: variables.username,
      });
      navigate("/map");
    },
    onError: (error) => {
      setLocalError(error.message || "An unexpected error occurred");
      setPin("");
    },
  });

  const isSubmitting = signInMutation.isPending || signUpMutation.isPending;
  const displayError = localError;

  useEffect(() => {
    if (view !== "signin-pin" && view !== "signup") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT") return;

      if (isSubmitting) return;
      if (e.key >= "0" && e.key <= "9") {
        if (pin.length < 4) {
          setPin((prev) => prev + e.key);
        }
      } else if (e.key === "Backspace") {
        setPin((prev) => prev.slice(0, -1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [view, pin.length, isSubmitting]);

  const handlePinDigit = (digit: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + digit);
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) {
      setLocalError("PIN must be 4 digits");
      return;
    }
    if (!selectedUser) return;

    setLocalError(null);
    signInMutation.mutate({ username: selectedUser.username, pin });
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity.trim()) {
      setLocalError("We need a name for the deed!");
      return;
    }
    if (pin.length !== 4) {
      setLocalError("PIN must be exactly 4 digits");
      return;
    }

    setLocalError(null);
    signUpMutation.mutate({ username: identity.trim(), pin });
  };

  const resetToHome = () => {
    setView("home");
    setSelectedUser(null);
    setPin("");
    setIdentity("");
    setSearchQuery("");
    setLocalError(null);
  };

  const renderPinPad = (onBack: () => void) => (
    <>
      <div className="flex justify-center mb-6 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-14 h-16 rounded-xl flex items-center justify-center text-3xl font-bold border ${
              pin.length > i
                ? "bg-red border-dark-blue text-cream"
                : "bg-white/50 border-dark-blue/30 text-dark-blue"
            } transition-all`}
          >
            {pin.length > i ? "•" : ""}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
          <button
            key={digit}
            type="button"
            disabled={isSubmitting}
            onClick={() => handlePinDigit(digit)}
            className="bg-light-blue hover:bg-light-blue/90 disabled:opacity-50 text-cream font-medium rounded-xl py-6 text-2xl transition-colors shadow-md shadow-light-blue/20"
          >
            {digit}
          </button>
        ))}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onBack}
          className="bg-transparent hover:bg-dark-blue/5 disabled:opacity-50 text-dark-blue font-medium rounded-xl py-6 text-sm transition-colors border-2 border-dark-blue/30 active:scale-[0.98] uppercase font-serif"
        >
          Back
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => handlePinDigit("0")}
          className="bg-light-blue hover:bg-light-blue/90 disabled:opacity-50 text-cream font-medium rounded-xl py-6 text-2xl transition-colors shadow-md shadow-light-blue/20"
        >
          0
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleDelete}
          className="bg-transparent hover:bg-dark-blue/5 disabled:opacity-50 text-dark-blue font-medium rounded-xl py-6 text-sm transition-colors border-2 border-dark-blue/30 active:scale-[0.98] uppercase font-serif"
        >
          Del
        </button>
      </div>
    </>
  );

  return (
    <>
      {view === "home" && (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <p className="text-center text-dark-blue font-medium text-lg sm:text-xl mb-6">
            Stake your claim on the greens! Are you a returning settler or a new pioneer?
          </p>

          <button
            onClick={() => {
              setView("signin-list");
              setLocalError(null);
              setSearchQuery("");
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

      {view === "signin-list" && (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={resetToHome}
              className="p-2 text-dark-blue hover:bg-dark-blue/5 rounded transition-colors"
            >
              <ChevronLeft />
            </button>
            <h3 className="font-serif font-bold text-xl text-dark-blue uppercase tracking-wider">
              Settler Registry
            </h3>
            <div className="w-10"></div>
          </div>

          <p className="text-center text-dark-blue/80 text-sm mb-4">
            Find your name in the land registry below.
          </p>

          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-dark-blue/50" />
            </div>
            <input
              type="text"
              placeholder="Search registry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 p-3 bg-white/50 border border-dark-blue/30 rounded text-dark-blue font-medium focus:outline-none focus:border-light-blue focus:ring-1 focus:ring-light-blue"
            />
          </div>

          <div className="max-h-64 overflow-y-auto border border-dark-blue/30 bg-white/50 rounded shadow-inner">
            <ul className="divide-y divide-dark-blue/20">
              {filteredPlayers.map((player) => (
                <li key={player.id}>
                  <button
                    onClick={() => {
                      setSelectedUser(player);
                      setPin("");
                      setLocalError(null);
                      setView("signin-pin");
                    }}
                    className="w-full text-left p-4 hover:bg-dark-blue/5 text-dark-blue font-serif text-lg font-medium transition-colors flex justify-between items-center group"
                  >
                    {player.username}
                    <Lock
                      size={16}
                      className="text-dark-blue/40 group-hover:text-dark-blue"
                    />
                  </button>
                </li>
              ))}
              {filteredPlayers.length === 0 && players.length > 0 && (
                <li className="p-4 text-center text-dark-blue/60 italic">
                  No pioneers found.
                </li>
              )}
              {players.length === 0 && (
                <li className="p-4 text-center text-dark-blue/60 italic">
                  No claims staked yet.
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {view === "signin-pin" && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center mb-2">
            <button
              onClick={() => {
                setView("signin-list");
                setLocalError(null);
                setPin("");
              }}
              className="p-2 text-dark-blue hover:bg-dark-blue/5 rounded transition-colors -ml-2"
            >
              <ChevronLeft />
            </button>
          </div>

          <div className="text-center space-y-2">
            <h3 className="font-serif text-red font-bold uppercase tracking-widest text-sm">
              Welcome Back,
            </h3>
            <p className="font-serif text-dark-blue text-2xl font-bold uppercase tracking-tighter">
              {selectedUser?.username}
            </p>
          </div>

          <form onSubmit={handleSignInSubmit} className="space-y-6">
            <label className="block text-center text-dark-blue font-sans font-bold uppercase tracking-widest text-sm mb-4">
              Enter Your 4-Digit PIN
            </label>

            {renderPinPad(() => {
              setView("signin-list");
              setLocalError(null);
              setPin("");
            })}

            {displayError && (
              <p className="text-center text-red font-bold text-sm bg-red/10 py-2 rounded border border-red/30">
                {displayError}
              </p>
            )}

            <button
              type="submit"
              disabled={pin.length !== 4 || isSubmitting}
              className="w-full py-4 bg-light-blue text-cream disabled:bg-dark-blue/40 hover:bg-light-blue/90 transition-colors rounded shadow-lg shadow-light-blue/30 tracking-wide uppercase font-bold text-lg"
            >
              {isSubmitting ? "Unlocking..." : "Unlock Claim"}
            </button>
          </form>
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
                Pioneer Name
              </label>
              <input
                type="text"
                value={identity}
                onChange={(e) => {
                  setIdentity(e.target.value);
                  setLocalError(null);
                }}
                disabled={isSubmitting}
                className="w-full p-3 bg-white/50 border border-dark-blue/30 rounded text-dark-blue font-serif text-lg focus:outline-none focus:border-light-blue focus:ring-1 focus:ring-light-blue"
                placeholder="e.g. Wyatt Earp"
                autoFocus
              />
            </div>

            <div className="space-y-1">
              <label className="block text-center text-dark-blue font-sans font-bold uppercase tracking-widest text-xs mb-4 mt-6">
                Create 4-Digit PIN
              </label>

              {renderPinPad(resetToHome)}

              <p className="text-xs text-center text-dark-blue/70 mt-2 font-medium">
                Don't forget it! You'll need it to return.
              </p>
            </div>

            {displayError && (
              <p className="text-center text-red font-bold text-sm bg-red/10 py-2 border border-red/30 rounded">
                {displayError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || pin.length !== 4 || !identity.trim()}
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
