const NotificationFilter = ({ filter, setFilter }) => {
  return (
    <div className="flex gap-3 mb-4">
      {["All", "Client", "Admin"].map((item) => (
        <button
          key={item}
          className={`px-4 py-1 rounded border ${
            filter === item ? "bg-black text-white" : ""
          }`}
          onClick={() => setFilter(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default NotificationFilter;
