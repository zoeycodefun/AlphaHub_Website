// import create function from zustand to create a global state store for market switching
import { create } from 'zustand';
// the `persist` middleware will store the state in localStorage so that selected market
// survives page reloads. it also makes the API backward-compatible with the plain store.
import { persist, createJSONStorage } from 'zustand/middleware';

// define the interface for the market switch state, describing the structure of the store (state and methods)
interface MarketSwitchState {
    selectedMarket: string;
    setSelectedMarket: (market: string) => void;
}

// We wrap the store with `persist` and give it a unique name.  The default value
// is aligned with `MARKET_OPTIONS` used elsewhere (`crypto_assets_web3`).
export const useMarketSwitchStore = create<MarketSwitchState>()(
    persist(
        (set) => ({
            selectedMarket: 'crypto_assets_web3',
            setSelectedMarket: (market) => set({ selectedMarket: market }),
        }),
        {
            name: 'market-switch', // key for localStorage
            // use createJSONStorage helper to satisfy PersistStorage type
            storage: createJSONStorage(() => localStorage),
        }
    )
);

