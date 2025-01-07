export const formSchema = {
  menuId: 16,
  postUrl: "/sale-headers/bulk",
  getUrl: "/sale-headers",
  buttonName: "Make Item Sale",
  sheetTitle: "Make Item Sale",
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
      label: "Customer",
      name: "customer",
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
                id: 1,
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
      error: "Customer field is required",
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
      label: "Sale Executive",
      name: "user",
      type: "select",
      optionsAPI: "/users",
      required: true,
      error: "Sale Executive is required",
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
