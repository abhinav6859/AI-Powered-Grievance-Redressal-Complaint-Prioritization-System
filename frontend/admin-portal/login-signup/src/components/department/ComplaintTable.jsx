const ComplaintTable = ({ complaints }) => {
  return (
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-200">
          <th>Title</th>
          <th>Status</th>
          <th>Priority</th>
          <th>Department</th>
        </tr>
      </thead>
      <tbody>
        {complaints.map((c) => (
          <tr key={c._id} className="text-center border-t">
            <td>{c.title}</td>
            <td>{c.status}</td>
            <td>{c.priority}</td>
            <td>{c.department}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ComplaintTable;