export const formSchema = {
  menuId: 20,
  postUrl: "/purchase-headers/bulk",
  getUrl: "/purchase-headers",
  buttonName: "Make Item Purchase",
  sheetTitle: "Make Item Purchase",
  sheetDescription: "",
  fields: [
    {
      label: "Code",
      name: "code",
      type: "text",
      required: false,
      disabled: true,
      error: "Code field is required",
      validations: [],
    },
    {
      label: "Billing Date",
      name: "txnDate",
      type: "date",
      required: true,
      error: "Billing Date is required",
      validations: [],
    },
    {
      label: "Supplier",
      name: "supplier",
      type: "autoComplete",
      targetMenuId: 14,
      optionsAPI: "/contacts",
      filtercb: (query: string): object => {
        return {
          fields: {
            name: true,
            id: true,
            mobile: true,
          },
          ...(query
            ? {
                where: {
                  $a: {
                    like: {
                      name: query,
                    },
                  },
                },
              }
            : {}),
          relations: [
            {
              name: "contactType",
              where: {
                id: 2,
              },
              fields: {
                name: true,
              },
            },
          ],
        };
      },
      required: true,
      isAddAllowed: true,
      error: "Supplier field is required",
      validations: [],
    },
    {
      label: "Payment Type",
      name: "paymentType",
      type: "select",
      optionsAPI: "/payment-types",
      required: true,
      error: "Payment Type field is required",
      validations: [],
    },
    {
      label: "Purchase Executive",
      name: "user",
      type: "select",
      optionsAPI: "/users",
      required: true,
      error: "Purchase Executive is required",
      validations: [],
    },
    {
      label: "Description",
      name: "description",
      type: "textarea",
      required: false,
      error: "",
      validations: [],
    },
  ],
};
