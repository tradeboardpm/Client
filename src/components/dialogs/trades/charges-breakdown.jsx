import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { calculateCharges, TRANSACTION_TYPES } from "@/utils/tradeCalculations";

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

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="charges" className="border-none">
        <AccordionTrigger className="p-0 hover:no-underline">
          <div className="flex justify-start gap-2 items-center">
            <span className="font-medium">Total Order Amount:</span>
            <span className="text-base font-medium text-primary">
              ₹ {(charges.turnover + charges.totalCharges).toFixed(2)}
            </span>
          </div>
        </AccordionTrigger>
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
                <span>₹ {value}</span>
              </div>
            ))}
            <div className="border-t pt-1 mt-1 space-y-1 font-medium">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Charges:</span>
                <span>₹ {charges.totalCharges}</span>
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
      </AccordionItem>
    </Accordion>
  );
};

export default ChargesBreakdown;
