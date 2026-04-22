import React from 'react';
import { amountInWordsShort } from '../../utils/numberToWords';

const PrintableReceipt = React.forwardRef(({ data }, ref) => {
  const printStyles = {
    WebkitPrintColorAdjust: 'exact',
    printColorAdjust: 'exact',
  };

  const allocations = Array.isArray(data?.allocations) ? data.allocations : [];
  const student = data?.student || {};
  const totals = data?.totals || {};
  const meta = data?.meta || {};
  const paidAmount = Number(totals?.paid_amount || 0) || 0;
  const feesBalance = Number(
    totals?.balance ??
      totals?.fees_balance ??
      student?.balance ??
      meta?.fees_balance ??
      0,
  ) || 0;

  const voteHeadRows = [
    'Lunch programme',
    'Repair, Maintenance & Improvement RMI',
    'Local Traveling & Transport',
    'Administrative Cost',
    'Medical Fees',
    'Electricity Water & Conservancy EW&C',
    'Activity fund',
    'Personal Emolument',
    'Insurance',
    'Student ID',
    'Caution Money',
    'Fees Arrears',
    'Others (Specify)',
  ];

  const normalizeVoteHead = (value) =>
    String(value || '')
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();

  const formatReceiptNo = (value) => {
    const raw = String(value || '').trim();
    const digits = raw.replace(/\D/g, '');
    const fallbackDigits = String(Date.now()).slice(-4);
    const source = digits || fallbackDigits;
    return source.slice(-4).padStart(4, '0');
  };

  const formattedReceiptNo = formatReceiptNo(data?.receipt_no);
  const amountInWords = totals?.amount_in_words || `${amountInWordsShort(paidAmount)} Only`;

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

    if (voteHead === 'Fees Arrears' && mappedAmount <= 0 && feesBalance > 0) {
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

  return (
    <div ref={ref} className="hidden print:block font-serif bg-white text-black" style={printStyles}>
      <div className="w-[148mm] mx-auto p-2.5 border-4 border-black bg-white text-black">
        <div className="text-center mb-2.5">
          <h1 className="text-[18px] leading-none font-bold">ST GERALD HIGH SCHOOL</h1>
          <h2 className="text-[13px] leading-none font-semibold border-b-4 border-double border-black inline-block px-4 mt-1">
            School Official Receipt
          </h2>
        </div>

        <div className="flex justify-between mb-2 text-[11px]">
          <span>Receipt No: {formattedReceiptNo}</span>
          <span>Date: {data?.date ? new Date(data.date).toLocaleDateString() : 'N/A'}</span>
        </div>

        <div className="mb-2 text-[11px] space-y-1.5">
          <div className="flex items-end">
            <span className="font-semibold">Received From:</span>
            <span className="flex-grow border-b border-dotted border-black mx-2"></span>
            <span>{student.name || '____________________'}</span>
          </div>
          <div className="flex justify-between">
            <div className="flex items-end w-1/2">
              <span className="font-semibold">Form/Class:</span>
              <span className="flex-grow border-b border-dotted border-black mx-2"></span>
              <span>{student.form || '____'}</span>
            </div>
            <div className="flex items-end w-1/2">
              <span className="font-semibold">Adm No:</span>
              <span className="flex-grow border-b border-dotted border-black mx-2"></span>
              <span>{student.adm_no || '______'}</span>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex items-end w-1/2">
              <span className="font-semibold">Term:</span>
              <span className="flex-grow border-b border-dotted border-black mx-2"></span>
              <span>{student.term || '__'}</span>
            </div>
            <div className="flex items-end w-1/2">
              <span className="font-semibold">Year:</span>
              <span className="flex-grow border-b border-dotted border-black mx-2"></span>
              <span>{student.year || '______'}</span>
            </div>
          </div>
        </div>

        <table className="w-full border-collapse border-2 border-black text-[10px] mb-2.5">
          <thead>
            <tr className="border-2 border-black">
              <th className="border-r-2 border-black p-0.5 w-2/3">Vote Head</th>
              <th className="p-0.5">Amount (KES)</th>
            </tr>
          </thead>
          <tbody>
            {filledVoteHeads.map((row, index) => (
              <tr key={index} className="border-b-2 border-black h-[16px] leading-none">
                <td className="border-r-2 border-black p-0.5">{row.voteHead}</td>
                <td className="p-0.5 text-right font-mono">
                  {row.amount > 0
                    ? Number(row.amount).toLocaleString('en-KE', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : ''}
                </td>
              </tr>
            ))}
            {emptyRows > 0 && Array.from({ length: emptyRows }).map((_, index) => (
              <tr key={`empty-${index}`} className="border-b-2 border-black h-[16px] leading-none">
                <td className="border-r-2 border-black p-0.5"></td>
                <td className="p-0.5"></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-4 border-black font-bold">
              <td className="border-r-2 border-black p-0.5 text-right">TOTAL</td>
              <td className="p-0.5 text-right font-mono">{paidAmount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
          </tfoot>
        </table>

        <div className="mb-2 text-[11px] leading-tight">
          <span className="font-semibold">Amount in Words:</span>
          <span className="ml-2 italic">{amountInWords}</span>
        </div>

        <div className="flex justify-between items-end mt-2 text-[11px] leading-tight">
          <div className="w-2/3">
            <p className="font-bold">RECEIVED WITH THANKS</p>
            <div className="mt-4">
              <span className="border-t-2 border-dotted border-black w-full block"></span>
              <p className="text-center">A/C Clerk</p>
            </div>
          </div>
          <div className="text-[10px] font-semibold text-right">
            <p>
              Fees Arrears / Balance:{" "}
              {feesBalance.toLocaleString('en-KE', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p>Receiving Officer: {meta.receiving_officer || 'N/A'}</p>
            <p>Reference No: {meta.reference_no || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

PrintableReceipt.displayName = 'PrintableReceipt';

export default PrintableReceipt;
