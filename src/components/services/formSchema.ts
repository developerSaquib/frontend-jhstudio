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
        console.log(amount, taxValue);
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
      readOnly: true,
      error: "Tax Amount field is required",
      validations: [],
    },
    {
      label: "Status",
      name: "isInactive",
      type: "checkbox",
      required: false,
      defaultValue: true,
      error: "",
      validations: [],
    },
  ],
};
