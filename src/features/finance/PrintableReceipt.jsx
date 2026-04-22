import React from 'react';

const PrintableReceipt = React.forwardRef(({ data }, ref) => {
  const printStyles = {
    WebkitPrintColorAdjust: 'exact',
    printColorAdjust: 'exact',
  };

  const allocations = Array.isArray(data?.allocations) ? data.allocations : [];
  const student = data?.student || {};
  const totals = data?.totals || {};
  const meta = data?.meta || {};

  const totalRows = 10;
  const emptyRows = Math.max(0, totalRows - allocations.length);

  return (
    <div ref={ref} className="hidden print:block font-serif" style={printStyles}>
      <div className="w-[148mm] mx-auto p-4 border-4 border-black">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold">ST GERALD HIGH SCHOOL</h1>
          <h2 className="text-xl font-semibold border-b-4 border-double border-black inline-block px-4">
            School Official Receipt
          </h2>
        </div>

        <div className="flex justify-between mb-4 text-sm">
          <span>Receipt No: {data?.receipt_no || 'N/A'}</span>
          <span>Date: {data?.date ? new Date(data.date).toLocaleDateString() : 'N/A'}</span>
        </div>

        <div className="mb-4 text-sm space-y-2">
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

        <table className="w-full border-collapse border-2 border-black text-sm mb-4">
          <thead>
            <tr className="border-2 border-black">
              <th className="border-r-2 border-black p-1 w-2/3">Vote Head</th>
              <th className="p-1">Amount (KES)</th>
            </tr>
          </thead>
          <tbody>
            {allocations.map((alloc, index) => (
              <tr key={index} className="border-b-2 border-black">
                <td className="border-r-2 border-black p-1">{alloc.vote_head || ''}</td>
                <td className="p-1 text-right font-mono">{Number(alloc?.amount || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
            ))}
            {emptyRows > 0 && Array.from({ length: emptyRows }).map((_, index) => (
              <tr key={`empty-${index}`} className="border-b-2 border-black h-6">
                <td className="border-r-2 border-black p-1"></td>
                <td className="p-1"></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-4 border-black font-bold">
              <td className="border-r-2 border-black p-1 text-right">TOTAL</td>
              <td className="p-1 text-right font-mono">{Number(totals?.paid_amount || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
          </tfoot>
        </table>

        <div className="mb-4 text-sm">
          <span className="font-semibold">Amount in Words:</span>
          <span className="ml-2 italic">{totals.amount_in_words || '____________________'}</span>
        </div>

        <div className="flex justify-between items-end mt-8 text-sm">
          <div className="w-2/3">
            <p className="font-bold">RECEIVED WITH THANKS</p>
            <div className="mt-8">
              <span className="border-t-2 border-dotted border-black w-full block"></span>
              <p className="text-center">A/C Clerk</p>
            </div>
          </div>
          <div className="text-xs">
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
