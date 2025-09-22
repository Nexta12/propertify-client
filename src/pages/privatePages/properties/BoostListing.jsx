import DataTable from "@components/ui/DataTable";

const BoostListing = () => {
  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "age",
      header: "Age",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "country",
      header: "Country",
      cell: (info) => info.getValue(),
    },
    {
      id: "actions", // No accessorKey needed for actions
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleView(row.original)}
            className="px-2 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            View
          </button>
          <button
            onClick={() => handleEdit(row.original)}
            className="px-2 py-1 text-xs text-white bg-yellow-500 rounded hover:bg-yellow-600"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.original)}
            className="px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const handleView = (data) => {
    if (!data) return;
    // Navigate or open modal etc
  };

  const handleEdit = (data) => {
    if (!data) return;
    // Navigate or open edit form
  };

  const handleDelete = (data) => {
    if (!data) return;
    // Open confirm dialog or directly delete
  };

  const data = [
    { id: 1, name: "John Doe", age: 28, country: "USA", email: "john.doe@example.com" },
    { id: 2, name: "Jane Smith", age: 32, country: "Canada", email: "jane.smith@example.com" },
    { id: 3, name: "Chris Johnson", age: 24, country: "UK", email: "chris.johnson@example.com" },
    { id: 4, name: "Sarah Lee", age: 29, country: "Australia", email: "sarah.lee@example.com" },
    { id: 5, name: "Mike Brown", age: 35, country: "Germany", email: "mike.brown@example.com" },
    { id: 6, name: "Emily Davis", age: 22, country: "USA", email: "emily.davis@example.com" },
    { id: 7, name: "David Wilson", age: 41, country: "Canada", email: "david.wilson@example.com" },
    { id: 8, name: "Jessica Moore", age: 27, country: "UK", email: "jessica.moore@example.com" },
    {
      id: 9,
      name: "James Taylor",
      age: 33,
      country: "Australia",
      email: "james.taylor@example.com",
    },
    {
      id: 10,
      name: "Rachel Clark",
      age: 25,
      country: "Germany",
      email: "rachel.clark@example.com",
    },
    { id: 11, name: "Michael King", age: 30, country: "USA", email: "michael.king@example.com" },
    {
      id: 12,
      name: "Elizabeth Scott",
      age: 38,
      country: "Canada",
      email: "elizabeth.scott@example.com",
    },
    { id: 13, name: "William Harris", age: 27, country: "UK", email: "william.harris@example.com" },
    {
      id: 14,
      name: "Laura Walker",
      age: 31,
      country: "Australia",
      email: "laura.walker@example.com",
    },
    { id: 15, name: "Kevin White", age: 36, country: "Germany", email: "kevin.white@example.com" },
    { id: 16, name: "Mary Hall", age: 29, country: "USA", email: "mary.hall@example.com" },
    { id: 17, name: "Andrew Allen", age: 40, country: "Canada", email: "andrew.allen@example.com" },
    { id: 18, name: "Olivia Young", age: 24, country: "UK", email: "olivia.young@example.com" },
    {
      id: 19,
      name: "Daniel Hernandez",
      age: 30,
      country: "Australia",
      email: "daniel.hernandez@example.com",
    },
    {
      id: 20,
      name: "Sophia Martinez",
      age: 28,
      country: "Germany",
      email: "sophia.martinez@example.com",
    },
  ];

  return (
    <section>
      {/* User Table */}
      <section className="">
        <DataTable columns={columns} data={data} tableTitle="Promote Listings" />
      </section>
    </section>
  );
};

export default BoostListing;
