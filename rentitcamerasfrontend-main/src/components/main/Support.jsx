import React from 'react';
import { FileText, ShieldCheck, Clock, AlertTriangle, RefreshCcw, CheckCircle } from 'lucide-react';

const Support = () => (
  <>
    {/* Hero Section */}
    <section className="relative flex flex-col items-center justify-center text-center py-16 px-4 bg-gradient-to-b from-[#1A97A9] to-[#153c43] text-white shadow-lg">
      <div className="max-w-3xl mx-auto">
        <ShieldCheck className="w-14 h-14 text-white mb-4 drop-shadow-lg mx-auto" />
        <h1 className="text-5xl md:text-6xl font-extrabold drop-shadow-lg mb-4">
          Rental <span className="text-[#1A97A9]">Agreement</span>
        </h1>
        <p className="text-lg md:text-2xl text-white/90 max-w-2xl mx-auto mb-6">
          Please read our terms and conditions carefully before renting any equipment. Your safety and satisfaction are our top priorities.
        </p>
      </div>
    </section>

    {/* Agreement Card */}
    <main className="min-h-screen bg-gradient-to-b from-[#1A97A9] to-[#153c43] text-white py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12 mt-[-5rem] relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-8 h-8 text-[#1A97A9]" />
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A97A9]">Terms and Conditions</h2>
        </div>
        <ol className="list-decimal pl-6 space-y-4 text-gray-700 text-base">
          <li>
            <span className="font-semibold text-[#1A97A9] flex items-center gap-2"><Clock className="w-5 h-5 text-[#1A97A9]" /> Rental Period:</span>
            The cameras and equipment must be used only within the specified rental period, including the designated date and time for each rented item. Additional charges may apply for extended periods.
          </li>
          <li>
            <span className="font-semibold text-[#1A97A9] flex items-center gap-2"><CheckCircle className="w-5 h-5 text-[#1A97A9]" /> Rental Rates:</span>
            The rental rates for each camera and equipment are as per the rates specified at the time of booking. All charges are exclusive of taxes and fees, which will be charged as applicable.
          </li>
          <li>
            <span className="font-semibold text-[#1A97A9] flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-[#1A97A9]" /> Security Deposit:</span>
            A security deposit, as determined by Rentit Camera Rentals, is required for each rental. The security deposit will be refunded upon safe and timely return of the rented items. The security deposit may be withheld or forfeited in case of damages, late returns, or violations of terms and conditions.
          </li>
          <li>
            <span className="font-semibold text-[#1A97A9] flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-[#1A97A9]" /> Late Fees:</span>
            A late fee will be charged for items not returned by the agreed-upon return date/time. The late fee amount will be specified by Rentit Camera Rentals and will be applicable for each day of delay beyond the rental period.
          </li>
          <li>
            <span className="font-semibold text-[#1A97A9] flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-[#1A97A9]" /> Damages and Losses:</span>
            The customer is responsible for any damages or losses to the rented items during the rental period. The customer must promptly notify Rentit Camera Rentals in case of any damages or losses and shall be liable for the cost of repairs or replacement, as determined by Rentit Camera Rentals.
          </li>
          <li>
            <span className="font-semibold text-[#1A97A9] flex items-center gap-2"><RefreshCcw className="w-5 h-5 text-[#1A97A9]" /> Maintenance and Care:</span>
            The customer shall handle and maintain the rented items with utmost care and shall follow all instructions provided by Rentit Camera Rentals regarding the proper use, handling, and storage of the items. The customer must not attempt to repair or modify the items without prior permission from Rentit Camera Rentals.
          </li>
          <li>
            <span className="font-semibold text-[#1A97A9] flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-[#1A97A9]" /> Liability:</span>
            Rentit Camera Rentals shall not be liable for any injuries, accidents, damages, or losses incurred by the customer or any third party during the rental period. The customer shall assume full responsibility and liability for the proper and safe use of the rented items.
          </li>
          <li>
            <span className="font-semibold text-[#1A97A9] flex items-center gap-2"><Clock className="w-5 h-5 text-[#1A97A9]" /> Reservation and Cancellation:</span>
            The customer may reserve the cameras and equipment in advance, subject to availability. A cancellation fee may apply for cancellations made within a specified timeframe, as determined by Rentit Camera Rentals.
          </li>
          <li>
            <span className="font-semibold text-[#1A97A9] flex items-center gap-2"><FileText className="w-5 h-5 text-[#1A97A9]" /> Miscellaneous:</span>
            Any changes or modifications to this rental agreement must be in writing and agreed upon by both parties. This rental agreement constitutes the entire understanding between the customer and Rentit Camera Rentals, and supersedes any prior agreements or understandings, whether written or verbal.
          </li>
          <li>
            <span className="font-semibold text-[#1A97A9] flex items-center gap-2"><CheckCircle className="w-5 h-5 text-[#1A97A9]" /> Acceptance:</span>
            By renting the cameras and equipment from Rentit Camera Rentals, the customer acknowledges and agrees to abide by all the terms and conditions of this rental agreement.
          </li>
        </ol>
      </div>
    </main>
  </>
);

export default Support;