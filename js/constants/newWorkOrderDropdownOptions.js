export const NWO_DROPDOWN_OPTIONS = {
  // Top-level work order fields
  frequency: [
    'One-time',
    'Every 3 weeks',
    'Every 4 weeks',
    'Weekly',
    'Bi-weekly',
    'Every 6 weeks',
    'Every 5 weeks',
  ],
  status: [
    'New',
    'In Progress',
    'On Hold',
    'Completed',
    'Closed',
    'Cannot Complete',
    'Canceled',
    'Draft',
  ],
  cancellationReason: [
    'Moving',
    'Not Happy with Service',
    'No Longer Required',
    'Price',
    'Other',
    'Company Initiated',
    'Skip Service',
  ],
  cancellationCharge: [
    'Waive Cancellation Charge',
    'Apply Team Travel Charge',
  ],

  // Shared yes/no dropdowns
  yesNo: ['Yes', 'No'],

  // Billing & payment tax types
  // NOTE: this list must be reused for Tax Type #1 / #2 / #3.
  taxTypes: ['PST', 'GST', 'HST'],

  // Payment type dropdown
  paymentTypes: ['Cash', 'Cheque', 'Credit Card', 'Gift Certificate'],

  // Payment recurrence dropdown
  paymentRecurrence: ['Non-Monthly', 'Monthly'],

  // Regular cleaning frequency dropdown (different from top-level WO frequency)
  regularCleaningFrequency: [
    'One-time',
    'Every 3 weeks',
    'Every 4 weeks',
    'Weekly',
    'Bi-weekly',
    'Every 6 weeks',
    'Every 5 weeks',
  ],

  // Regular time preference for email
  emailTimePreferences: ['Flexible (8am-4pm)', '8am-1pm', '11am-4pm'],

  parking: [
    'Driveway',
    'Free street parking',
    'Paid parking (charges apply)',
    'Other, please specify',
  ],
  garbageDisposal: [
    'Bin in the Garage',
    'Dumpster in the back of the house',
    'Dumpster in the front of the house',
    'Other, please specify',
  ],

  // Checklist frequency dropdowns (e.g. Oven/Fridge/Windows Frequency)
  // In Salesforce these come back as data-value: both/regular/initial.
  checklistFrequencyBasic: ['both', 'regular', 'initial'],

  // Dishes Amount
  dishesAmount: ['Average', 'Few', 'Many'],

  // Laundry Options
  laundryOptions: ['Gold', 'Silver'],

  // Disinfection Frequency (from Salesforce titles)
  // Salesforce data-value: initial/regular/both; labels are more descriptive.
  disinfectionFrequencyDetailed: [
    { value: 'initial', label: 'Apply once to first clean only' },
    { value: 'regular', label: 'Apply to all subsequent cleaning from second visit' },
    { value: 'both', label: 'Apply to all visits' },
  ],
};

