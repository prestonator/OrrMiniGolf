import { motion } from 'framer-motion';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface CitySelectorProps {
  cities: string[];
  onSelectCity: (city: string) => void;
  onSkip: () => void;
}

export function CitySelector({ cities, onSelectCity, onSkip }: CitySelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="max-w-2xl w-full mx-4"
      >
        <Modal innerClassName="items-center text-center">
          <h2 className="text-3xl font-bold text-dark-blue mb-6 font-serif uppercase tracking-wide">
            Claim a Specific Plot
          </h2>
          <p className="text-dark-blue/80 mb-6 font-medium text-base">
            Select a region to zoom in and stake your land claim.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 w-full">
            {cities.map((city) => (
              <Button
                key={city}
                variant="primary"
                onClick={() => onSelectCity(city)}
              >
                {city}
              </Button>
            ))}
          </div>
          <Button variant="outline" className="sm:w-auto px-8" onClick={onSkip}>
            Skip and see entire map
          </Button>
        </Modal>
      </motion.div>
    </motion.div>
  );
}
