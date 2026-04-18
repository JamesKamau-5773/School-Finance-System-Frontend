import React, { forwardRef } from 'react';
import { amountInWordsShort } from '../../utils/numberToWords';

// We use forwardRef so a parent component can trigger a print on this specific DOM node if needed,
// though standard window.print() with CSS hiding also works perfectly.
const PrintableReceipt = forwardRef(({ data }, ref) => {
  if (!data) return null;

  return (
    // Visible in modal, with print-only styles for printing
    <div ref={ref} className="print-container w-full max-w-[148mm] mx-auto bg-white text-black p-6 font-serif print:p-0 print:bg-white">

      {/* HEADER */}
      <div className="text-center border-b-2 border-black pb-2 mb-4">
        <h1 className="text-xl font-bold uppercase tracking-wide">St Gerald High School</h1>
        <p className="text-xs italic">P.O. Box 4484 - 20100, Nakuru.</p>
        <h2 className="text-sm font-bold uppercase mt-2 underline decoration-double">School Official Receipt</h2>
      </div>

      {/* META DATA */}
      <div className="flex justify-between items-end mb-4 text-sm">
        <div className="font-bold">No. <span className="text-red-600 font-mono text-lg">{data.receipt_no}</span></div>
        <div className="flex items-end gap-1">
          <span>Date:</span>
          <span className="border-b border-black border-dashed px-2 pb-0.5 min-w-[140px]">{data.date}</span>
        </div>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-baseline">
          <span className="whitespace-nowrap mr-1">RECEIVED from</span>
          <span className="border-b border-black border-dashed flex-grow font-bold px-2 pb-0.5">{data.student.name}</span>
        </div>
        <div className="flex items-baseline gap-4">
          <div className="flex items-baseline gap-1">
            <span className="whitespace-nowrap">Form</span>
            <span className="border-b border-black border-dashed w-12 text-center pb-0.5">{data.student?.form || '-'}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="whitespace-nowrap">Term</span>
            <span className="border-b border-black border-dashed w-12 text-center pb-0.5">{data.student?.term || '-'}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="whitespace-nowrap">20</span>
            <span className="border-b border-black border-dashed w-10 text-center pb-0.5">{data.student?.year ? data.student.year.slice(-2) : '--'}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="whitespace-nowrap">Adm. No.</span>
            <span className="border-b border-black border-dashed flex-grow font-bold px-1 pb-0.5">{data.student?.admissionNumber || '-'}</span>
          </div>
        </div>
      </div>

      {/* THE ALLOCATIONS TABLE */}
      <table className="w-full border-collapse border-2 border-black mb-4 text-sm">
        <thead>
          <tr className="border-b-2 border-black">
            <th className="border-r border-black p-1 text-left italic font-normal">Being payment of</th>~
            <th className="border-r border-black p-1 w-20 text-center font-bold">Kshs</th>
            <th className="p-1 w-10 text-center font-bold">Cts</th>
          </tr>
        </thead>
        <tbody>
          {/* Standard fee categories - show allocations where they apply */}
          {[
            { label: 'Lunch Programme', key: 'lunch' },
            { label: 'Repair, Maintenance & Improvement (PMI)', key: 'maintenance' },
            { label: 'Local Traveling & Transport', key: 'transport' },
            { label: 'Administrative Costs', key: 'admin' },
            { label: 'Medical Fees', key: 'medical' },
            { label: 'Electricity, Water & Conservancy (EWSC)', key: 'utilities' },
            { label: 'Activity Fund', key: 'activity' },
            { label: 'Personal Enrolment', key: 'enrolment' },
            { label: 'Insurance', key: 'insurance' },
            { label: 'Student ID', key: 'student id' },
            { label: 'Fees Arrears', key: 'arrears' },
            { label: 'Others (Specify)', key: 'others' },
          ].map((category, idx) => {
            let allocation = { amount: 0 };
            
            // Special handling for Fees Arrears - use student balance
            if (category.key === 'arrears') {
              allocation = { amount: data.student?.balance || 0 };
            } else {
              allocation = data.allocations?.find((a) =>
                a.vote_head?.toLowerCase().includes(category.label.split('(')[0].toLowerCase().trim())
              ) || { voteHead: category.label, amount: 0 };
            }

            return (
              <tr key={idx} className="border-b border-black">
                <td className="border-r border-black p-1 px-2">{category.label}</td>
                <td className="border-r border-black p-1 text-right font-mono pr-2">
                  {allocation.amount > 0 ? allocation.amount.toLocaleString() : ''}
                </td>
                <td className="p-1 text-center font-mono">{allocation.amount > 0 ? '00' : ''}</td>
              </tr>
            );
          })}
          <tr className="border-t-2 border-black font-bold">
            <td className="border-r border-black p-1 px-2 text-right">TOTAL Kshs.</td>
            <td className="border-r border-black p-1 text-right font-mono pr-2">
              {data.totals.amount ? data.totals.amount.toLocaleString() : '0'}
            </td>
            <td className="p-1 text-center font-mono">00</td>
          </tr>
        </tbody>
      </table>

      {/* FOOTER & SIGNATURES */}
      <div className="space-y-3 text-sm mt-6">
        <div className="flex">
          <span className="whitespace-nowrap mr-2">Amount in Kshs (words):</span>
          <span className="border-b border-black border-dashed flex-grow italic px-2 font-serif">
            {amountInWordsShort(data.totals.amount || 0)}
          </span>
        </div>

        <div className="flex">
          <span className="whitespace-nowrap mr-2">Receiving Officer's Name:</span>
          <span className="border-b border-black border-dashed flex-grow font-bold px-2">{data.meta?.receivedBy || ''}</span>
        </div>

        <div className="flex">
          <span className="whitespace-nowrap mr-2">Cheque No/ Cash / Mpesa / Bank Slip Ref. No:</span>
          <span className="border-b border-black border-dashed flex-grow font-mono px-2">{data.meta?.reference || ''}</span>
        </div>

        <div className="flex justify-between items-end mt-10">
          <div className="font-bold italic text-lg tracking-widest">RECEIVED WITH THANKS</div>
          <div className="text-center">
            <div className="border-b border-black w-32 mb-2 mt-4"></div>
            <div className="text-xs">A/C Clerk</div>
          </div>
        </div>
      </div>
    </div>
  );
});

PrintableReceipt.displayName = 'PrintableReceipt';

export default PrintableReceipt;
