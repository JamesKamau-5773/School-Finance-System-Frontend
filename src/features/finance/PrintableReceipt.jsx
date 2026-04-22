import React from "react";
import { amountInWordsShort } from "../../utils/numberToWords";

const PrintableReceipt = React.forwardRef(({ data }, ref) => {
  const printStyles = {
    WebkitPrintColorAdjust: "exact",
    printColorAdjust: "exact",
    backgroundColor: "#ffffff",
    color: "#000000",
  };

  const allocations = Array.isArray(data?.allocations) ? data.allocations : [];
  const student = data?.student || {};
  const totals = data?.totals || {};
  const meta = data?.meta || {};
  const paidAmount = Number(totals?.paid_amount || 0) || 0;
  const feesBalance =
    Number(
      totals?.balance ??
        totals?.fees_balance ??
        student?.balance ??
        meta?.fees_balance ??
        0,
    ) || 0;

  const voteHeadRows = [
    "Lunch programme",
    "Repair, Maintenance & Improvement RMI",
    "Local Traveling & Transport",
    "Administrative Cost",
    "Medical Fees",
    "Electricity Water & Conservancy EW&C",
    "Activity fund",
    "Personal Emolument",
    "Insurance",
    "Student ID",
    "Caution Money",
    "Fees Arrears",
    "Others (Specify)",
  ];

  const normalizeVoteHead = (value) =>
    String(value || "")
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();

  const formatReceiptNo = (value) => {
    const raw = String(value || "").trim();
    const digits = raw.replace(/\D/g, "");
    const fallbackDigits = String(Date.now()).slice(-4);
    const source = digits || fallbackDigits;
    return source.slice(-4).padStart(4, "0");
  };

  const formattedReceiptNo = formatReceiptNo(data?.receipt_no);
  const amountInWords =
    totals?.amount_in_words || `${amountInWordsShort(paidAmount)} Only`;

  const allocationMap = allocations.reduce((acc, allocation) => {
    const key = normalizeVoteHead(allocation?.vote_head);
    const amount = Number(allocation?.amount || 0) || 0;
    if (!key) return acc;
    acc[key] = (acc[key] || 0) + amount;
    return acc;
  }, {});

  const filledVoteHeads = voteHeadRows.map((voteHead, index) => {
    const key = normalizeVoteHead(voteHead);
    const mappedAmount = Number(allocationMap[key] || 0) || 0;

    if (voteHead === "Fees Arrears" && mappedAmount <= 0 && feesBalance > 0) {
      return { voteHead, amount: feesBalance };
    }

    if (mappedAmount > 0) {
      return { voteHead, amount: mappedAmount };
    }

    if (index === 0 && paidAmount > 0 && allocations.length === 0) {
      return { voteHead, amount: paidAmount };
    }

    return { voteHead, amount: 0 };
  });

  const totalRows = Math.max(13, filledVoteHeads.length);
  const emptyRows = Math.max(0, totalRows - filledVoteHeads.length);

  // Helper to split amounts for the Kshs / Cts columns visually
  const splitAmount = (amt) => {
    if (amt <= 0) return { kshs: "", cts: "" };
    const parts = Number(amt).toFixed(2).split(".");
    return {
      kshs: Number(parts[0]).toLocaleString("en-KE"),
      cts: parts[1],
    };
  };

  const { kshs: paidKshs, cts: paidCts } = splitAmount(paidAmount);

  return (
    <div
      ref={ref}
      className="hidden print:block font-serif bg-white text-stone-900"
      style={printStyles}
    >
      {/* Container simulating the physical receipt paper constraints */}
      <div
        className="w-[148mm] mx-auto p-4 bg-white min-h-[188mm]"
        style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
      >
        {/* Header Section */}
        <div className="text-center mb-1">
          <h1 className="text-[20px] leading-none font-bold tracking-wide uppercase font-serif">
            ST GERALD HIGH SCHOOL
          </h1>
          <p className="text-[10px] italic mt-1">
            P.O. Box 4484 - 20100, Nakuru.
          </p>
        </div>

        {/* Double Line Separator */}
        <div className="border-y-4 border-double border-stone-900 py-[2px] mb-3 text-center">
          <h2 className="text-[12px] leading-none font-bold tracking-widest italic uppercase">
            School Official Receipt
          </h2>
        </div>

        {/* Top Metadata */}
        <div className="flex justify-between items-end mb-3 text-[12px] italic font-semibold">
          <div className="flex items-end">
            <span>No.</span>
            <span className="ml-4 font-mono not-italic text-[16px] tracking-wider">
              {formattedReceiptNo}
            </span>
          </div>
          <div className="flex items-end">
            <span>Date</span>
            <span className="w-32 border-b border-dotted border-stone-900 ml-2 text-center font-mono not-italic text-[11px] pb-[1px]">
              {data?.date
                ? new Date(data.date).toLocaleDateString("en-GB")
                : ""}
            </span>
          </div>
        </div>

        {/* Student Fill-in Info */}
        <div className="space-y-3 text-[12px] italic mb-4">
          <div className="flex items-end">
            <span className="uppercase">Received from</span>
            <span className="flex-1 border-b border-dotted border-stone-900 ml-2 text-center font-semibold not-italic font-sans text-[11px] pb-[1px]">
              {student.name || ""}
            </span>
          </div>

          <div className="flex items-end justify-between">
            <span>Form</span>
            <span className="w-16 border-b border-dotted border-stone-900 mx-1 text-center font-semibold not-italic font-sans text-[11px] pb-[1px]">
              {student.form || ""}
            </span>
            <span>Term</span>
            <span className="w-16 border-b border-dotted border-stone-900 mx-1 text-center font-semibold not-italic font-sans text-[11px] pb-[1px]">
              {student.term || ""}
            </span>
            <span>20</span>
            <span className="w-8 border-b border-dotted border-stone-900 mx-1 text-center font-semibold not-italic font-sans text-[11px] pb-[1px]">
              {student.year ? String(student.year).slice(-2) : ""}
            </span>
            <span>Adm. No.</span>
            <span className="flex-1 border-b border-dotted border-stone-900 ml-1 text-center font-semibold not-italic font-mono text-[11px] pb-[1px]">
              {student.adm_no || ""}
            </span>
          </div>
        </div>

        {/* Table styled as Ledger */}
        <table className="w-full border-collapse border border-stone-900 text-[11px] mb-4">
          <thead>
            <tr className="border-b border-stone-900 italic">
              <th className="border-r border-stone-900 p-1 text-left font-normal w-[70%]">
                Being payment of
              </th>
              <th className="border-r border-stone-900 p-1 font-semibold text-center w-[20%]">
                Kshs
              </th>
              <th className="p-1 font-semibold text-center w-[10%]">Cts</th>
            </tr>
          </thead>
          <tbody>
            {filledVoteHeads.map((row, index) => {
              const { kshs, cts } = splitAmount(row.amount);
              return (
                <tr
                  key={index}
                  className="border-b border-stone-900 h-[18px] leading-none"
                >
                  <td className="border-r border-stone-900 px-1 py-0.5 italic">
                    {row.voteHead}
                  </td>
                  <td className="border-r border-stone-900 px-1 py-0.5 text-right font-mono text-[12px]">
                    {kshs}
                  </td>
                  <td className="px-1 py-0.5 text-center font-mono text-[12px]">
                    {cts}
                  </td>
                </tr>
              );
            })}
            {emptyRows > 0 &&
              Array.from({ length: emptyRows }).map((_, index) => (
                <tr
                  key={`empty-${index}`}
                  className="border-b border-stone-900 h-[18px] leading-none"
                >
                  <td className="border-r border-stone-900 px-1 py-0.5"></td>
                  <td className="border-r border-stone-900 px-1 py-0.5"></td>
                  <td className="px-1 py-0.5"></td>
                </tr>
              ))}
          </tbody>
          <tfoot>
            <tr className="h-[22px]">
              <td className="border-r border-stone-900 px-1 text-right italic font-semibold uppercase">
                TOTAL Kshs.
              </td>
              <td className="border-r border-stone-900 px-1 text-right font-mono font-bold text-[13px]">
                {paidKshs}
              </td>
              <td className="px-1 text-center font-mono font-bold text-[13px]">
                {paidCts}
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Footer Signatures and References */}
        <div className="space-y-4 text-[11px] italic">
          <div className="flex items-end">
            <span>Amount in Kshs.</span>
            <span className="flex-1 border-b border-dotted border-stone-900 ml-2 text-center not-italic font-semibold font-sans text-[10px] pb-[1px]">
              {amountInWords}
            </span>
          </div>

          <div className="flex items-end justify-between">
            <span>Receiving Officer's Name</span>
            <span className="flex-1 border-b border-dotted border-stone-900 mx-2 text-center not-italic font-semibold font-sans text-[11px] pb-[1px]">
              {meta.receiving_officer || ""}
            </span>
            <span>Fees Balance</span>
            <span className="w-28 border-b border-dotted border-stone-900 ml-2 text-center not-italic font-semibold font-mono text-[12px] pb-[1px]">
              {feesBalance > 0
                ? feesBalance.toLocaleString("en-KE", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : ""}
            </span>
          </div>

          <div className="flex items-end">
            <span>Cheque No/ Cash / Mpesa / Bank Slip Ref. No.</span>
            <span className="flex-1 border-b border-dotted border-stone-900 ml-2 text-center not-italic font-semibold font-sans text-[11px] pb-[1px]">
              {meta.reference_no || ""}
            </span>
          </div>

          <div className="flex items-end justify-between pt-2">
            <span className="font-bold uppercase not-italic tracking-wider text-[13px] font-sans">
              RECEIVED WITH THANKS
            </span>
            <div className="flex items-end w-[45%]">
              <span>Sign:</span>
              <span className="flex-1 border-b border-dotted border-stone-900 ml-2 relative">
                <span className="absolute -bottom-4 right-4 text-[10px] not-italic font-semibold font-sans">
                  A/C Clerk
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

PrintableReceipt.displayName = "PrintableReceipt";

export default PrintableReceipt;
