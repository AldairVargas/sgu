export default function UsersTable({ users, onEdit, onDelete }) {
  return (
    <div className="card">
      <h2>Usuarios</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th style={{ width: 160 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>
                  Sin registros
                </td>
              </tr>
            )}
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.fullName}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>
                  <button onClick={() => onEdit(u)}>Editar</button>
                  <button className="danger" onClick={() => onDelete(u.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
