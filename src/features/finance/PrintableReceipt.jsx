import React, { forwardRef } from 'react';

const PrintableReceipt = forwardRef(({ data }, ref) => {
  if (!data) return null;

  return (
    // The outer container enforces the thick black border and serif font
    <div ref={ref} className="hidden print:block print:w-[148mm] print:mx-auto print:bg-white print:text-black print:p-8 print:border-[3px] print:border-black print:font-serif">
      
      {/* HEADER */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold tracking-wide">ST GERALD HIGH SCHOOL</h1>
        <p className="text-sm mt-1">P.O. Box 4484 - 20100, Nakuru.</p>
        <h2 className="text-lg font-bold mt-4 underline decoration-2 underline-offset-4 uppercase">School Official Receipt</h2>
      </div>

      {/* Top Thick Separator */}
      <hr className="border-t-[3px] border-black mb-4" />

      {/* META DATA */}
      <div className="flex justify-between items-end mb-6">
        <div className="font-bold">
          No. <span className="text-red-600 font-bold ml-1">{data.receipt_no || "N/A"}</span>
        </div>
        <div className="flex items-end">
          <span className="mr-2">Date:</span>
          {/* The dotted underline stretches */}
          <span className="border-b-[1.5px] border-dotted border-black px-8 pb-1 text-center min-w-[150px]">
            {data.date}
          </span>
        </div>
      </div>

      {/* STUDENT INFO LINES */}
      <div className="flex items-end mb-6">
        <span className="mr-3">RECEIVED from</span>
        <span className="border-b-[1.5px] border-dotted border-black flex-grow pb-1 font-bold px-2">
          {data.student.name}
        </span>
      </div>

      <div className="flex justify-between items-end mb-6 space-x-4">
        <div className="flex items-end flex-1">
          <span className="mr-2">Form</span>
          <span className="border-b-[1.5px] border-dotted border-black flex-grow pb-1 text-center">{data.student.form}</span>
        </div>
        <div className="flex items-end flex-1">
          <span className="mr-2">Term</span>
          <span className="border-b-[1.5px] border-dotted border-black flex-grow pb-1 text-center">{data.student.term || "-"}</span>
        </div>
        <div className="flex items-end flex-1">
          <span className="mr-2">Year</span>
          <span className="border-b-[1.5px] border-dotted border-black flex-grow pb-1 text-center">{data.student.year}</span>
        </div>
        <div className="flex items-end flex-1">
          <span className="mr-2 whitespace-nowrap">Adm. No.</span>
          <span className="border-b-[1.5px] border-dotted border-black flex-grow pb-1 text-center font-bold">{data.student.adm_no}</span>
        </div>
      </div>

      {/* THE ALLOCATIONS TABLE */}
      <table className="w-full border-collapse border-[1.5px] border-black mb-6">
        <thead>
          <tr className="border-b-[1.5px] border-black">
            <th className="text-left p-2 font-mono text-sm font-normal">Being payment of <span className="float-right">~</span></th>
            <th className="border-l-[1.5px] border-black p-2 w-24 font-bold text-center">Kshs</th>
            <th className="border-l-[1.5px] border-black p-2 w-16 font-bold text-center">Cts</th>
          </tr>
        </thead>
        <tbody>
          {data.allocations.map((item, idx) => (
            <tr key={idx} className="border-b border-black last:border-b-[1.5px]">
              <td className="p-2 font-mono text-sm">{item.vote_head}</td>
              <td className="border-l-[1.5px] border-black p-2 text-right font-mono">{item.amount.toLocaleString()}</td>
              <td className="border-l-[1.5px] border-black p-2 text-center font-mono">00</td>
            </tr>
          ))}
          {/* Fill empty rows to maintain layout if few items were paid */}
          {Array.from({ length: Math.max(0, 10 - data.allocations.length) }).map((_, idx) => (
            <tr key={`empty-${idx}`} className="border-b border-black h-9">
              <td className="p-2 font-mono text-sm"></td>
              <td className="border-l-[1.5px] border-black p-2"></td>
              <td className="border-l-[1.5px] border-black p-2"></td>
            </tr>
          ))}
          <tr className="border-t-[1.5px] border-black font-bold">
            <td className="p-2 text-right font-mono text-sm font-bold">TOTAL Kshs.</td>
            <td className="border-l-[1.5px] border-black p-2 text-right font-mono font-bold">{data.totals.paid_amount.toLocaleString()}</td>
            <td className="border-l-[1.5px] border-black p-2 text-center font-mono font-bold">00</td>
          </tr>
        </tbody>
      </table>

      {/* FOOTER & SIGNATURES */}
      <div className="space-y-6">
        <div className="flex items-end">
          <span className="mr-3 whitespace-nowrap">Amount in Kshs (words):</span>
          <span className="border-b-[1.5px] border-dotted border-black flex-grow pb-1 italic px-2">
             {data.totals.amount_in_words}
          </span>
        </div>
        
        <div className="flex items-end">
          <span className="mr-3 whitespace-nowrap">Receiving Officer's Name:</span>
          <span className="border-b-[1.5px] border-dotted border-black flex-grow pb-1 font-bold px-2">
            {data.meta.receiving_officer}
          </span>
        </div>

        <div className="flex items-end">
          <span className="mr-3 whitespace-nowrap">Cheque No/ Cash / Mpesa / Bank Slip Ref. No:</span>
          <span className="border-b-[1.5px] border-dotted border-black flex-grow pb-1 font-bold px-2">
            {data.meta.reference_no}
          </span>
        </div>
      </div>

      {/* Bottom Signoff */}
      <div className="flex justify-between items-end mt-12">
        <div className="font-bold italic text-lg tracking-widest uppercase">
          RECEIVED WITH THANKS
        </div>
        <div className="w-48 text-center">
          <div className="border-b-[1.5px] border-black mb-1"></div>
          <div className="text-xs">A/C Clerk</div>
        </div>
      </div>

    </div>
  );
});

export default PrintableReceipt;
