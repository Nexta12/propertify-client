import DataTable from "@components/ui/DataTable";
import { paths } from "@routes/paths";
import { appointments } from "@utils/data";

const Schedule = () => {
  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: info => info.getValue(),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: info => info.getValue(),
    },
    {
      accessorKey: "age",
      header: "Age",
      cell: info => info.getValue(),
    },
    {
      accessorKey: "country",
      header: "Country",
      cell: info => info.getValue(),
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
    console.log("Viewing", data);
    // Navigate or open modal etc
  };
  
  const handleEdit = (data) => {
    console.log("Editing", data);
    // Navigate or open edit form
  };
  
  const handleDelete = (data) => {
    console.log("Deleting", data);
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
    { id: 9, name: "James Taylor", age: 33, country: "Australia", email: "james.taylor@example.com" },
    { id: 10, name: "Rachel Clark", age: 25, country: "Germany", email: "rachel.clark@example.com" },
    { id: 11, name: "Michael King", age: 30, country: "USA", email: "michael.king@example.com" },
    { id: 12, name: "Elizabeth Scott", age: 38, country: "Canada", email: "elizabeth.scott@example.com" },
    { id: 13, name: "William Harris", age: 27, country: "UK", email: "william.harris@example.com" },
    { id: 14, name: "Laura Walker", age: 31, country: "Australia", email: "laura.walker@example.com" },
    { id: 15, name: "Kevin White", age: 36, country: "Germany", email: "kevin.white@example.com" },
    { id: 16, name: "Mary Hall", age: 29, country: "USA", email: "mary.hall@example.com" },
    { id: 17, name: "Andrew Allen", age: 40, country: "Canada", email: "andrew.allen@example.com" },
    { id: 18, name: "Olivia Young", age: 24, country: "UK", email: "olivia.young@example.com" },
    { id: 19, name: "Daniel Hernandez", age: 30, country: "Australia", email: "daniel.hernandez@example.com" },
    { id: 20, name: "Sophia Martinez", age: 28, country: "Germany", email: "sophia.martinez@example.com" },
  ];
  

  return (
    <section>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-6">Appointment Schedule</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {appointment.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {appointment.property}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{appointment.date}</div>
                    <div>{appointment.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        appointment.type === "In-person"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {appointment.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-[#28B16D] hover:text-[#09C269] mr-3">
                      Confirm
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

        {/* User Table */}
        <section className="my-12">
        <DataTable columns={columns} data={data} tableTitle="Appointment Schedule" addNewLink={paths.login} />
      </section>
    </section>
  );
};

export default Schedule;
