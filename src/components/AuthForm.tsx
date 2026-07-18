import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import { getMapState } from "../utils/api";
import { useKioskStore } from "../store/useKioskStore";
import {
  Pickaxe,
  Tent,
  ChevronLeft,
  Lock,
  UserPlus,
  Users,
  Wheat,
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
                ? "bg-[#8b3a3a] border-[#5c3a21] text-[#f4ecd8]"
                : "bg-[#fbf8f1] border-[#8c6d46] text-[#4a2e15]"
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
            className="bg-[#5c3a21] hover:bg-[#4a2e15] disabled:opacity-50 text-[#f4ecd8] font-medium rounded-xl py-6 text-2xl transition-colors border border-[#2c1e16] active:bg-[#2c1e16] active:scale-[0.98] shadow-md"
          >
            {digit}
          </button>
        ))}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onBack}
          className="bg-[#eaddbd] hover:bg-[#d9c5a0] disabled:opacity-50 text-[#5c3a21] font-medium rounded-xl py-6 text-sm transition-colors border border-[#8c6d46] active:scale-[0.98] shadow-sm uppercase font-serif"
        >
          Back
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => handlePinDigit("0")}
          className="bg-[#5c3a21] hover:bg-[#4a2e15] disabled:opacity-50 text-[#f4ecd8] font-medium rounded-xl py-6 text-2xl transition-colors border border-[#2c1e16] active:bg-[#2c1e16] active:scale-[0.98] shadow-md"
        >
          0
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleDelete}
          className="bg-[#eaddbd] hover:bg-[#d9c5a0] disabled:opacity-50 text-[#5c3a21] font-medium rounded-xl py-6 text-sm transition-colors border border-[#8c6d46] active:scale-[0.98] shadow-sm uppercase font-serif"
        >
          Del
        </button>
      </div>
    </>
  );

  return (
    <>
      <div className="text-center mb-8">
        <div className="flex justify-center mb-2 text-[#5c3a21]">
          <Wheat size={32} className="mr-2" />
          <Pickaxe size={32} className="ml-2" />
        </div>
        <h2 className="text-[#8b3a3a] font-serif font-bold tracking-widest uppercase text-sm mb-1">
          Orr Family Farm
        </h2>
        <h1 className="text-[#4a2e15] font-serif text-4xl font-black uppercase tracking-tighter shadow-sm mb-2">
          Mini Golf
        </h1>
        <div className="inline-block bg-[#8b3a3a] text-[#f4ecd8] px-4 py-1 rounded-sm shadow-md border border-[#5c3a21]">
          <span className="font-serif font-bold text-sm tracking-widest uppercase">
            1889 Land Rush Edition
          </span>
        </div>
      </div>

      {view === "home" && (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <p className="text-center text-[#5c3a21] font-serif italic mb-6">
            Stake your claim on the greens! Are you a returning settler or a new
            pioneer?
          </p>

          <button
            onClick={() => {
              setView("signin-list");
              setLocalError(null);
              setSearchQuery("");
            }}
            className="w-full flex items-center justify-center p-4 bg-[#5c3a21] text-[#f4ecd8] hover:bg-[#4a2e15] transition-colors border-2 border-[#2c1e16] rounded shadow-md group"
          >
            <Users className="mr-3 text-[#d9c5a0] group-hover:scale-110 transition-transform" />
            <span className="font-serif text-lg tracking-wide uppercase font-bold">
              Find My Claim (Sign In)
            </span>
          </button>

          <div className="flex items-center justify-center space-x-2 my-2">
            <span className="h-px bg-[#b89b72] w-1/4"></span>
            <span className="text-[#8c6d46] font-serif text-sm uppercase">
              or
            </span>
            <span className="h-px bg-[#b89b72] w-1/4"></span>
          </div>

          <button
            onClick={() => {
              setView("signup");
              setLocalError(null);
            }}
            className="w-full flex items-center justify-center p-4 bg-[#8b3a3a] text-[#f4ecd8] hover:bg-[#6e2c2c] transition-colors border-2 border-[#4a1a1a] rounded shadow-md group"
          >
            <UserPlus className="mr-3 text-[#f4ecd8] group-hover:scale-110 transition-transform" />
            <span className="font-serif text-lg tracking-wide uppercase font-bold">
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
              className="p-2 text-[#5c3a21] hover:bg-[#eaddbd] rounded transition-colors"
            >
              <ChevronLeft />
            </button>
            <h3 className="font-serif font-bold text-xl text-[#4a2e15] uppercase tracking-wider">
              Settler Registry
            </h3>
            <div className="w-10"></div>
          </div>

          <p className="text-center text-[#8c6d46] text-sm mb-4">
            Find your name in the land registry below.
          </p>

          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-[#8c6d46]" />
            </div>
            <input
              type="text"
              placeholder="Search registry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 p-3 bg-[#fbf8f1] border-2 border-[#8c6d46] rounded text-[#4a2e15] font-serif focus:outline-none focus:border-[#8b3a3a] focus:ring-1 focus:ring-[#8b3a3a]"
            />
          </div>

          <div className="max-h-64 overflow-y-auto border-2 border-[#8c6d46] bg-[#fbf8f1] rounded shadow-inner">
            <ul className="divide-y divide-[#d0b894]">
              {filteredPlayers.map((player) => (
                <li key={player.id}>
                  <button
                    onClick={() => {
                      setSelectedUser(player);
                      setPin("");
                      setLocalError(null);
                      setView("signin-pin");
                    }}
                    className="w-full text-left p-4 hover:bg-[#eaddbd] text-[#4a2e15] font-serif text-lg font-medium transition-colors flex justify-between items-center group"
                  >
                    {player.username}
                    <Lock
                      size={16}
                      className="text-[#b89b72] group-hover:text-[#5c3a21]"
                    />
                  </button>
                </li>
              ))}
              {filteredPlayers.length === 0 && players.length > 0 && (
                <li className="p-4 text-center text-[#8c6d46] italic">
                  No pioneers found.
                </li>
              )}
              {players.length === 0 && (
                <li className="p-4 text-center text-[#8c6d46] italic">
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
              className="p-2 text-[#5c3a21] hover:bg-[#eaddbd] rounded transition-colors -ml-2"
            >
              <ChevronLeft />
            </button>
          </div>

          <div className="text-center space-y-2">
            <h3 className="font-serif text-[#8b3a3a] font-bold uppercase tracking-widest text-sm">
              Welcome Back,
            </h3>
            <p className="font-serif text-[#4a2e15] text-2xl font-black uppercase tracking-tighter">
              {selectedUser?.username}
            </p>
          </div>

          <form onSubmit={handleSignInSubmit} className="space-y-6">
            <label className="block text-center text-[#5c3a21] font-serif font-bold uppercase tracking-widest text-sm mb-4">
              Enter Your 4-Digit PIN
            </label>

            {renderPinPad(() => {
              setView("signin-list");
              setLocalError(null);
              setPin("");
            })}

            {displayError && (
              <p className="text-center text-[#8b3a3a] font-bold text-sm bg-[#f2d5d5] py-2 rounded border border-[#8b3a3a]">
                {displayError}
              </p>
            )}

            <button
              type="submit"
              disabled={pin.length !== 4 || isSubmitting}
              className="w-full py-4 bg-[#5c3a21] text-[#f4ecd8] disabled:bg-[#8c6d46] hover:bg-[#4a2e15] transition-colors border-2 border-[#2c1e16] rounded shadow-md font-serif text-xl tracking-wide uppercase font-bold"
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
              className="p-2 text-[#5c3a21] hover:bg-[#eaddbd] rounded transition-colors -ml-2"
            >
              <ChevronLeft />
            </button>
          </div>

          <div className="text-center space-y-2">
            <Tent className="mx-auto text-[#8b3a3a] mb-2" size={40} />
            <h3 className="font-serif text-[#4a2e15] text-2xl font-black uppercase tracking-tighter">
              Stake Your Claim
            </h3>
            <p className="text-[#8c6d46] text-sm italic">
              Register for the Land Rush to start puttin'.
            </p>
          </div>

          <form onSubmit={handleSignUpSubmit} className="space-y-5">
            <div className="space-y-1 mb-4">
              <label className="block text-[#5c3a21] font-serif font-bold uppercase tracking-widest text-xs">
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
                className="w-full p-3 bg-[#fbf8f1] border-2 border-[#8c6d46] rounded text-[#4a2e15] font-serif text-lg focus:outline-none focus:border-[#8b3a3a] focus:ring-1 focus:ring-[#8b3a3a]"
                placeholder="e.g. Wyatt Earp"
                autoFocus
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[#5c3a21] font-serif font-bold uppercase tracking-widest text-xs mb-2">
                Create 4-Digit PIN
              </label>

              {renderPinPad(resetToHome)}

              <p className="text-xs text-center text-[#8c6d46] mt-2">
                Don't forget it! You'll need it to return.
              </p>
            </div>

            {displayError && (
              <p className="text-center text-[#8b3a3a] font-bold text-sm bg-[#f2d5d5] py-2 border border-[#8b3a3a] rounded">
                {displayError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || pin.length !== 4 || !identity.trim()}
              className="w-full py-4 mt-2 bg-[#8b3a3a] text-[#f4ecd8] disabled:bg-[#8c6d46] hover:bg-[#6e2c2c] transition-colors border-2 border-[#4a1a1a] rounded shadow-md font-serif text-xl tracking-wide uppercase font-bold"
            >
              {isSubmitting ? "Registering..." : "Register & Play"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
