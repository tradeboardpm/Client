import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { calculateCharges, TRANSACTION_TYPES, EQUITY_TYPES } from "@/utils/tradeCalculations";

const ChargesBreakdown = ({ trade }) => {
  const price =
    trade.action === TRANSACTION_TYPES.BUY
      ? trade.buyingPrice
      : trade.sellingPrice;

  if (!trade.quantity || !price) {
    return (
      <div className="flex justify-start gap-2 items-center">
        <span className="font-medium">Total Order Amount:</span>
        <span className="text-base font-medium text-primary">₹ 0.00</span>
      </div>
    );
  }

  const charges = calculateCharges({
    equityType: trade.equityType,
    action: trade.action,
    price,
    quantity: trade.quantity,
    brokerage: trade.brokerage,
  });

  const showBreakdown = trade.equityType !== EQUITY_TYPES.OTHER && !trade.manualExchangeCharge;

  return (
    <Accordion type="single" collapsible className="w-full ">
      <AccordionItem value="charges" className="border-none h-full">
        <AccordionTrigger className="p-0 hover:no-underline w-full h-16 rounded-lg px-4 bg-[#F4E4FF] dark:bg-[#312d33]rounded-lg max-h-52 overflow-y-auto">
          <div className="flex justify-start gap-2 items-center w-full">
            <span className="font-medium">Total Order Amount:</span>
            <span className="text-base font-medium text-primary">
              ₹ {(charges.turnover + (showBreakdown ? charges.totalCharges : trade.exchangeRate)).toFixed(2)}
            </span>
          </div>
        </AccordionTrigger>
        {showBreakdown && (
          <AccordionContent className="pt-4">
            <div className="space-y-1 text-xs bg-card p-2 rounded-lg">
              {[
                { label: "Order Value:", value: charges.turnover },
                { label: "Brokerage:", value: charges.brokerage },
                { label: "STT:", value: charges.sttCharges },
                { label: "Exchange Charges:", value: charges.exchangeCharges },
                { label: "SEBI Charges:", value: charges.sebiCharges },
                { label: "Stamp Duty:", value: charges.stampDuty },
                { label: "GST:", value: charges.gstCharges },
              ].map(({ label, value }, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span>₹ {value.toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-1 mt-1 space-y-1 font-medium">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Charges:</span>
                  <span>₹ {charges.totalCharges.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Break Even Per Unit:
                  </span>
                  <span>₹ {charges.breakEvenPoints.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </AccordionContent>
        )}
      </AccordionItem>
    </Accordion>
  );
};

export default ChargesBreakdown;
