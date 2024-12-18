export function calculateExchangeCharges(
  equityType,
  action,
  price,
  quantity
) {
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
