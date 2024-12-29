/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const schema: any = {
  menuId: 16,
  postUrl: "/services",
  buttonName: "Items",
  sheetTitle: "Add New Items",
  sheetDescription: "",
  fields: [
    {
      label: "Item Name",
      name: "name",
      type: "text",
      required: true,
      error: "Item Name is required",
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
      label: "Description",
      name: "description",
      type: "text",
      required: false,
      error: "",
      validations: [],
    },
    {
      label: "MRP (Rs.)",
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
      label: "SKU",
      name: "sku",
      type: "text",
      required: true,
      error: "SKU is required",
      validations: [],
    },

    // {
    //   label: "Discount",
    //   name: "discount",
    //   type: "number",
    //   required: false,
    //   error: "Amount field is required",
    //   validations: [],
    // },
    {
      label: "Item Type",
      name: "itemType",
      type: "select",
      optionsAPI: "/item-types",
      required: true,
      error: "Item Type field is required",
      validations: [],
    },
    {
      label: "Item Category",
      name: "category",
      type: "text",
      required: false,
      error: "Item Name is required",
      validations: [],
    },
    {
      label: "Item brand",
      name: "brand",
      type: "text",
      required: false,
      error: "Item Name is required",
      validations: [],
    },
    {
      label: "Rating",
      name: "rating",
      type: "number",
      required: false,
      error: "Tax Amount field is required",
      validations: [
        {
          max: 2,
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
      error: "",
      validations: [],
      setExtraValues: true,
      takeValue: "percentage",
      extraValuesToSet: ["taxPerc"],
      defaultValue: 4,
    },
    // {
    //   label: "Item Cost (Rs.)",
    //   name: "costPrice",
    //   type: "number",
    //   required: true,
    //   error: "Amount field is required",
    //   validations: [],
    // },
    {
      label: "Tax",
      name: "taxPerc",
      isHidden: true,
      required: false,
    },
    {
      label: "Tax Amount (Rs.)",
      name: "taxAmount",
      type: "number",
      required: false,
      readOnly: true,
      error: "",
      validations: [],
    },
    // {
    //   label: "Is Featured",
    //   name: "isFeatured",
    //   type: "checkbox",
    //   required: false,
    //   defaultValue: false,
    //   error: "",
    //   validations: [],
    // },
    {
      label: "Is Inactive",
      name: "isInactive",
      type: "checkbox",
      required: false,
      defaultValue: false,
      error: "",
      validations: [],
    },
  ],
};