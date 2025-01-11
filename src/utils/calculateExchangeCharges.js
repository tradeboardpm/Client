// // Constants for different equity types
// export const EQUITY_TYPES = {
//   DELIVERY: "DELIVERY",
//   INTRADAY: "INTRADAY",
//   FNO_FUTURES: "F&O-FUTURES",
//   FNO_OPTIONS: "F&O-OPTIONS",
// };

// // Constants for transaction types
// export const TRANSACTION_TYPES = {
//   BUY: "buy",
//   SELL: "sell",
// };

// // Rate constants for different charges
// const RATES = {
//   // STT (Securities Transaction Tax) rates
//   STT: {
//     [EQUITY_TYPES.DELIVERY]: 0.001, // 0.1% both sides
//     [EQUITY_TYPES.INTRADAY]: 0.00025, // 0.025% sell side
//     [EQUITY_TYPES.FNO_FUTURES]: 0.0001, // 0.01% sell side
//     [EQUITY_TYPES.FNO_OPTIONS]: 0.0005, // 0.05% sell side
//   },

//   // Exchange Transaction charges
//   EXCHANGE: {
//     [EQUITY_TYPES.DELIVERY]: 0.0000322, // 0.00322%
//     [EQUITY_TYPES.INTRADAY]: 0.0000307, // 0.00307%
//     [EQUITY_TYPES.FNO_FUTURES]: 0.00002, // 0.002%
//     [EQUITY_TYPES.FNO_OPTIONS]: 0.00053, // 0.053%
//   },

//   // SEBI charges
//   SEBI: 0.000001, // 0.0001% universal

//   // Stamp duty rates (buy side only)
//   STAMP: {
//     [EQUITY_TYPES.DELIVERY]: 0.00015, // 0.015%
//     [EQUITY_TYPES.INTRADAY]: 0.00003, // 0.003%
//     [EQUITY_TYPES.FNO_FUTURES]: 0.00002, // 0.002%
//     [EQUITY_TYPES.FNO_OPTIONS]: 0.00003, // 0.003%
//   },

//   // GST rate
//   GST: 0.18, // 18%

//   // DP charges for delivery selling
//   DP_CHARGES: 13.0,
// };

// // Calculate STT charges
// function calculateSTT(equityType, action, turnover) {
//   const sttRate = RATES.STT[equityType];
//   if (equityType === EQUITY_TYPES.DELIVERY) {
//     return sttRate * turnover;
//   }
//   return action === TRANSACTION_TYPES.SELL ? sttRate * turnover : 0;
// }

// // Calculate Exchange Transaction charges
// export function calculateExchangeCharges(equityType, turnover) {
//   return RATES.EXCHANGE[equityType] * turnover;
// }

// // Calculate SEBI charges
// function calculateSEBICharges(turnover) {
//   return RATES.SEBI * turnover;
// }

// // Calculate Stamp Duty
// function calculateStampDuty(equityType, action, turnover) {
//   return action === TRANSACTION_TYPES.BUY
//     ? RATES.STAMP[equityType] * turnover
//     : 0;
// }

// // Calculate GST
// function calculateGST(equityType, turnover, brokerage) {
//   const exchangeCharges = calculateExchangeCharges(equityType, turnover);
//   const sebiCharges = calculateSEBICharges(turnover);
//   return RATES.GST * (brokerage + exchangeCharges + sebiCharges);
// }

// // Calculate DP Charges
// function calculateDPCharges(equityType, action) {
//   if (
//     equityType === EQUITY_TYPES.DELIVERY &&
//     action === TRANSACTION_TYPES.SELL
//   ) {
//     return RATES.DP_CHARGES;
//   }
//   return 0;
// }

// // Main function to calculate total charges
// export function calculateCharges(params) {
//   const {
//     equityType,
//     action,
//     price,
//     quantity,
//     brokerage = 20, // Default brokerage per side
//   } = params;

//   const turnover = price * quantity;

//   // Calculate individual components
//   const sttCharges = calculateSTT(equityType, action, turnover);
//   const exchangeCharges = calculateExchangeCharges(equityType, turnover);
//   const sebiCharges = calculateSEBICharges(turnover);
//   const stampDuty = calculateStampDuty(equityType, action, turnover);
//   const gstCharges = calculateGST(equityType, turnover, brokerage);
//   const dpCharges = calculateDPCharges(equityType, action);

//   // Calculate total charges
//   const totalCharges =
//     sttCharges +
//     exchangeCharges +
//     sebiCharges +
//     stampDuty +
//     gstCharges +
//     dpCharges +
//     brokerage;

//   // Return detailed breakdown
//   return {
//     turnover,
//     brokerage,
//     sttCharges,
//     exchangeCharges,
//     sebiCharges,
//     stampDuty,
//     gstCharges,
//     dpCharges,
//     totalCharges,
//     breakEvenPoints: totalCharges / quantity,
//   };
// }



export function calculateExchangeCharges(equityType, action, price, quantity) {
  const turnover = price * quantity;

  switch (equityType) {
    case "DELIVERY":
      return (
        (action === "sell" ? 0.001 * turnover : 0) + // STT
        0.00345 * turnover + // Transaction Charges
        (10 / 10000000) * turnover + // SEBI Charges
        (action === "buy" ? 0.00015 * turnover : 0) + // Stamp Charges
        0.18 * (0.00345 * turnover) + // GST
        (action === "sell" ? 15.93 : 0) // DP Charges
      );
    case "INTRADAY":
      return (
        0.00025 * turnover + // STT
        0.00345 * turnover + // Transaction Charges
        (10 / 10000000) * turnover + // SEBI Charges
        (action === "buy" ? 0.00003 * turnover : 0) + // Stamp Charges
        0.18 * (0.00345 * turnover) // GST
      );
    case "F&O-FUTURES":
      return (
        (action === "sell" ? 0.0001 * turnover : 0) + // STT
        0.002 * turnover + // Transaction Charges
        (10 / 10000000) * turnover + // SEBI Charges
        (action === "buy" ? 0.00002 * turnover : 0) + // Stamp Charges
        0.18 * (0.002 * turnover) // GST
      );
    case "F&O-OPTIONS":
      return (
        (action === "sell" ? 0.0005 * turnover : 0) + // STT
        0.00053 * turnover + // Transaction Charges
        (10 / 10000000) * turnover + // SEBI Charges
        (action === "buy" ? 0.00003 * turnover : 0) + // Stamp Charges
        0.18 * (0.00053 * turnover) // GST
      );
    default:
      return 0;
  }
}
