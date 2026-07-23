import { Link } from "react-router-dom";
import { Wheat, Pickaxe } from "lucide-react";

export default function Home() {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 relative font-sans"
      style={{ backgroundImage: "url('/landingBackground.webp')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="z-10 flex flex-col items-center max-w-lg w-full mt-8">
        
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
          
          {/* Badge */}
          <div className="absolute -top-4 left-0 right-0 flex justify-center z-20">
            <div className="bg-red text-cream px-4 py-1.5 rounded-sm text-sm sm:text-base font-bold tracking-widest shadow-md font-serif">
              1889 LAND RUSH EDITION
            </div>
          </div>

          {/* Double Border Inner Container */}
          <div className="border border-dark-blue/60 p-[3px] h-full w-full">
            <div className="border border-dark-blue/60 p-6 sm:p-10 bg-cream text-center flex flex-col pt-12">
              
              <p className="text-dark-blue mb-8 text-lg sm:text-xl font-medium">
                Select an option below to begin<br/>your adventure.
              </p>

              <div className="space-y-5 flex flex-col w-full">
                <Link
                  to="/login"
                  className="w-full bg-red hover:bg-red/90 text-cream font-bold text-xl sm:text-2xl py-6 px-4 rounded shadow-lg shadow-red/30 transition-all active:translate-y-1 flex flex-col items-center justify-center tracking-wide leading-tight"
                >
                  <span>REGISTER / LOGIN FOR</span>
                  <span>THE HOMESTEAD</span>
                  <span>CHALLENGE</span>
                </Link>

                <p className="text-dark-blue/90 text-base sm:text-lg font-medium px-4 leading-snug">
                  Necessary to be eligible for our<br/>$20k prized tournament.
                </p>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-dark-blue/30"></div>
                  <span className="flex-shrink-0 mx-4 text-dark-blue font-bold text-base uppercase tracking-wider">
                    Or
                  </span>
                  <div className="flex-grow border-t border-dark-blue/30"></div>
                </div>

                <Link
                  to="/quick-round-payment"
                  className="w-full bg-light-blue hover:bg-light-blue/90 text-cream font-bold text-xl sm:text-2xl py-6 px-4 rounded shadow-lg shadow-light-blue/30 transition-all active:translate-y-1 block uppercase tracking-wide"
                >
                  Quick Round
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
