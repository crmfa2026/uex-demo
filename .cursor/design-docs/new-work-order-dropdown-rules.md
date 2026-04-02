# New Work Order dropdown rules

## Single source of truth for picklist/dropdown options

The New Work Order modal uses a constants-driven approach:
- dropdown option lists should live in one place (e.g. `js/constants/newWorkOrderDropdownOptions.js`)
- the UI should bind dropdowns by reusing those constants (instead of hardcoding lists in HTML or duplicating values across fields)

## Billing & Payment: Tax Type dropdowns share the same option list

In the New Work Order modal, the tax type dropdown for **Tax Type #1**, **Tax Type #2**, and **Tax Type #3** must all use the same option list:
- `#nwo-tax1-type`
- `#nwo-tax2-type`
- `#nwo-tax3-type`

Implementation rule:
- Create one shared constant (e.g. `NWO_DROPDOWN_OPTIONS.taxTypes`) and bind all three selects from it.
- Do not create separate constants like `taxType1Options`, `taxType2Options`, etc.

Default behavior:
- keep the standard `--None--` option as the first option for all tax type dropdowns (value `""`).

