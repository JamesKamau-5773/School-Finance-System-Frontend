import React, { forwardRef } from 'react';
import { amountInWordsShort } from '../../utils/numberToWords';

const PrintableReceipt = forwardRef(({ data }, ref) => {
  if (!data) return null;

  const student = data.student || {};
  const meta = data.meta || {};
  const totals = data.totals || {};
  const allocations = Array.isArray(data.allocations) ? data.allocations : [];
  const paidAmount = Number(totals.paid_amount ?? totals.amount ?? 0) || 0;
  const amountInWords = totals.amount_in_words || amountInWordsShort(paidAmount);
  const printStyles = {
    printColorAdjust: 'exact',
    WebkitPrintColorAdjust: 'exact',
  };

  return (
    // The outer container enforces the thick black border and serif font
    <div
      ref={ref}
      style={printStyles}
      className="w-full max-w-[148mm] mx-auto bg-white text-black p-6 border-4 border-black font-serif print:w-[148mm] print:mx-auto print:p-8"
    >
      {/* HEADER */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold tracking-wide">ST GERALD HIGH SCHOOL</h1>
        <p className="text-sm mt-1">P.O. Box 4484 - 20100, Nakuru.</p>
        <h2 className="text-lg font-bold mt-4 underline decoration-2 underline-offset-4 uppercase">
          School Official Receipt
        </h2>
      </div>

      {/* Top Thick Separator */}
      <hr className="border-t-4 border-black mb-4" />

      {/* META DATA */}
      <div className="flex justify-between items-end mb-6">
        <div className="font-bold">
          No. <span className="text-red-600 font-bold ml-1">{data.receipt_no || 'N/A'}</span>
        </div>
        <div className="flex items-end">
          <span className="mr-2">Date:</span>
          <span className="border-b-2 border-dotted border-black px-8 pb-1 text-center min-w-[150px]">
            {data.date || ''}
          </span>
        </div>
      </div>

      {/* STUDENT INFO LINES */}
      <div className="flex items-end mb-6">
        <span className="mr-3">RECEIVED from</span>
        <span className="border-b-2 border-dotted border-black flex-grow pb-1 font-bold px-2">
          {student.name || ''}
        </span>
      </div>

      <div className="flex justify-between items-end mb-6 space-x-4">
        <div className="flex items-end flex-1">
          <span className="mr-2">Form</span>
          <span className="border-b-2 border-dotted border-black flex-grow pb-1 text-center">
            {student.form || student.gradeLevel || '-'}
          </span>
        </div>
        <div className="flex items-end flex-1">
          <span className="mr-2">Term</span>
          <span className="border-b-2 border-dotted border-black flex-grow pb-1 text-center">
            {student.term || '-'}
          </span>
        </div>
        <div className="flex items-end flex-1">
          <span className="mr-2">Year</span>
          <span className="border-b-2 border-dotted border-black flex-grow pb-1 text-center">
            {student.year || ''}
          </span>
        </div>
        <div className="flex items-end flex-1">
          <span className="mr-2 whitespace-nowrap">Adm. No.</span>
          <span className="border-b-2 border-dotted border-black flex-grow pb-1 text-center font-bold">
            {student.adm_no || student.admissionNumber || ''}
          </span>
        </div>
      </div>

      {/* THE ALLOCATIONS TABLE */}
      <table className="w-full border-collapse border-2 border-black mb-6">
        <thead>
          <tr className="border-b-2 border-black">
            <th className="text-left p-2 font-mono text-sm font-normal">
              Being payment of <span className="float-right">~</span>
            </th>
            <th className="border-l-2 border-black p-2 w-24 font-bold text-center">Kshs</th>
            <th className="border-l-2 border-black p-2 w-16 font-bold text-center">Cts</th>
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
              // Use the balance from the receipt data if available, otherwise default to 0
              allocation = { amount: data.student?.balance || 0 };
            } else {
              allocation = data.allocations?.find((a) =>
                a.vote_head?.toLowerCase().includes(category.label.split('(')[0].toLowerCase().trim())
              ) || { voteHead: category.label, amount: 0 };
            }

            return (
              <tr key={idx} className="border-b border-black last:border-b-2">
                <td className="p-2 font-mono text-sm">{category.label}</td>
                <td className="border-l-2 border-black p-2 text-right font-mono">
                  {allocation.amount ? Number(allocation.amount).toLocaleString() : ''}
                </td>
                <td className="border-l-2 border-black p-2 text-center font-mono">00</td>
              </tr>
            );
          })}
          {/* Fill empty rows to maintain layout if few items were paid */}
          {Array.from({ length: Math.max(0, 10 - allocations.length) }).map((_, idx) => (
            <tr key={`empty-${idx}`} className="border-b border-black h-9">
              <td className="p-2 font-mono text-sm"></td>
              <td className="border-l-2 border-black p-2"></td>
              <td className="border-l-2 border-black p-2"></td>
            </tr>
          ))}
          <tr className="border-t-2 border-black font-bold">
            <td className="p-2 text-right font-mono text-sm font-bold">TOTAL Kshs.</td>
            <td className="border-l-2 border-black p-2 text-right font-mono font-bold">
              {paidAmount.toLocaleString()}
            </td>
            <td className="border-l-2 border-black p-2 text-center font-mono font-bold">00</td>
          </tr>
        </tbody>
      </table>

      {/* FOOTER & SIGNATURES */}
      <div className="space-y-6">
        <div className="flex items-end">
          <span className="mr-3 whitespace-nowrap">Amount in Kshs (words):</span>
          <span className="border-b-2 border-dotted border-black flex-grow pb-1 italic px-2">
            {amountInWords}
          </span>
        </div>

        <div className="flex items-end">
          <span className="mr-3 whitespace-nowrap">Receiving Officer's Name:</span>
          <span className="border-b-2 border-dotted border-black flex-grow pb-1 font-bold px-2">
            {meta.receiving_officer || meta.receivedBy || ''}
          </span>
        </div>

        <div className="flex items-end">
          <span className="mr-3 whitespace-nowrap">Cheque No/ Cash / Mpesa / Bank Slip Ref. No:</span>
          <span className="border-b-2 border-dotted border-black flex-grow pb-1 font-bold px-2">
            {meta.reference_no || meta.reference || ''}
          </span>
        </div>
      </div>

      {/* Bottom Signoff */}
      <div className="flex justify-between items-end mt-12">
        <div className="font-bold italic text-lg tracking-widest uppercase">RECEIVED WITH THANKS</div>
        <div className="w-48 text-center">
          <div className="border-b-2 border-black mb-1"></div>
          <div className="text-xs">A/C Clerk</div>
        </div>
      </div>
    </div>
  );
});

export default PrintableReceipt;
