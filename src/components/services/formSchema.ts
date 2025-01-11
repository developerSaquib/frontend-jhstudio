/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const formSchema = {
  menuId: 16,
  postUrl: "/services",
  buttonName: "Service",
  sheetTitle: "Add New Service",
  sheetDescription: "",
  fields: [
    {
      label: "Service Name",
      name: "name",
      type: "text",
      required: true,
      error: "Service Name is required",
      validations: [
        {
          min: 3,
          message: "Should have min 3 characters",
        },
        {
          max: 100,
          message: "Should not have more than 100 characters",
        },
      ],
    },
    {
      label: "Tax",
      name: "tax",
      type: "select",
      optionsAPI: "/taxes",
      required: false,
      error: "Tax field is required",
      validations: [],
      setExtraValues: true,
      takeValue: "percentage",
      defaultValue:4,
      extraValuesToSet: ["taxPerc"],
    },
    {
      label: "Service Charge (Rs.)",
      name: "amount",
      type: "number",
      required: true,
      error: "Amount field is required",
      validations: [],
      isDependent: true,
      reflectedFrom: "taxPerc",
      reflectTo: "taxAmount",
      cb: (amount?: any, taxValue?: any, ..._rest: any[]) => {
        return (amount * taxValue) / 100;
      },
    },
    {
      label: "Tax",
      name: "taxPerc",
      type: "",
      error:"",
      isHidden: true,
      required: false,
      validations:[]
    },
    {
      label: "Tax Amount (Rs.)",
      name: "taxAmount",
      type: "number",
      required: false,
      readOnly: false,
      error: "",
      validations: [],
    },
    {
      label: "Is InActive",
      name: "isInactive",
      type: "checkbox",
      required: false,
      defaultValue: false,
      error: "",
      validations: [],
    },
  ],
};
