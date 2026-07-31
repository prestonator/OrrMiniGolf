import { AuthForm } from "../components/AuthForm";
import { Wheat, Pickaxe } from "lucide-react";

export default function Login() {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 relative font-sans"
      style={{ backgroundImage: "url('/landingBackground.webp')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="z-10 flex flex-col items-center max-w-md w-full mt-8">
        
        {/* Branding Area */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex gap-4 mb-2 text-red">
            <Wheat size={48} strokeWidth={1.5} />
            <Pickaxe size={48} strokeWidth={1.5} />
          </div>
          <h2 className="text-red font-bold tracking-[0.2em] uppercase text-sm sm:text-base mb-1">
            Orr Family Farm
          </h2>
          <h1 className="text-5xl sm:text-7xl font-bold text-dark-blue font-serif uppercase tracking-wide">
            Mini Golf
          </h1>
        </div>

        {/* Modal Container */}
        <div className="relative w-full bg-cream p-1 shadow-2xl mt-4">
          {/* Double Border Inner Container */}
          <div className="border border-dark-blue/60 p-[3px] h-full w-full">
            <div className="border border-dark-blue/60 p-6 sm:p-8 bg-cream flex flex-col">
              <AuthForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
