// import React, { useEffect, useState } from 'react';
// import { createServiceman, getServicemen } from '../api/adminApi';

// export default function CreateServiceman() {
//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     skill: '',
//     status: 'Available',
//   });
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [servicemen, setServicemen] = useState([]);

//   const loadServicemen = async () => {
//     try {
//       const res = await getServicemen();
//       setServicemen(res.data || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     loadServicemen();
//   }, []);

//   const handleChange = (e) => {
//     setForm((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');

//     try {
//       const payload = {
//         name: form.name,
//         email: form.email || null,
//         phone: form.phone,
//         skill: form.skill,
//         status: form.status,
//       };

//       const res = await createServiceman(payload);

//       setMessage(res.message || 'Serviceman created successfully');
//       setForm({
//         name: '',
//         email: '',
//         phone: '',
//         skill: '',
//         status: 'Available',
//       });

//       await loadServicemen();
//     } catch (err) {
//       console.error(err);
//       setMessage(
//         err?.response?.data?.message || 'Failed to create serviceman'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={styles.page}>
//       <div style={styles.card}>
//         <h2 style={styles.title}>Create Serviceman</h2>

//         {message ? <p style={styles.message}>{message}</p> : null}

//         <form onSubmit={handleSubmit} style={styles.form}>
//           <div style={styles.group}>
//             <label style={styles.label}>Name</label>
//             <input
//               type="text"
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               placeholder="Enter name"
//               style={styles.input}
//               required
//             />
//           </div>

//           <div style={styles.group}>
//             <label style={styles.label}>Email</label>
//             <input
//               type="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               placeholder="Enter email"
//               style={styles.input}
//             />
//           </div>

//           <div style={styles.group}>
//             <label style={styles.label}>Phone</label>
//             <input
//               type="text"
//               name="phone"
//               value={form.phone}
//               onChange={handleChange}
//               placeholder="Enter phone"
//               style={styles.input}
//               required
//             />
//           </div>

//           <div style={styles.group}>
//             <label style={styles.label}>Skill</label>
//             <input
//               type="text"
//               name="skill"
//               value={form.skill}
//               onChange={handleChange}
//               placeholder="Enter skill"
//               style={styles.input}
//               required
//             />
//           </div>

//           <div style={styles.group}>
//             <label style={styles.label}>Status</label>
//             <select
//               name="status"
//               value={form.status}
//               onChange={handleChange}
//               style={styles.input}
//             >
//               <option value="Available">Available</option>
//               <option value="Busy">Busy</option>
//               <option value="Inactive">Inactive</option>
//             </select>
//           </div>

//           <button type="submit" style={styles.button} disabled={loading}>
//             {loading ? 'Saving...' : 'Create Serviceman'}
//           </button>
//         </form>
//       </div>

//       <div style={styles.card}>
//         <h2 style={styles.title}>Serviceman List</h2>

//         <div style={styles.list}>
//           {servicemen.map((item) => (
//             <div key={item.id} style={styles.item}>
//               <h4 style={styles.itemTitle}>{item.name}</h4>
//               <p style={styles.itemText}>Email: {item.email || '-'}</p>
//               <p style={styles.itemText}>Phone: {item.phone}</p>
//               <p style={styles.itemText}>Skill: {item.skill}</p>
//               <p style={styles.itemText}>Status: {item.status}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   page: {
//     padding: 24,
//     display: 'grid',
//     gridTemplateColumns: '1fr 1fr',
//     gap: 24,
//     background: '#f7f8fc',
//     minHeight: '100vh',
//   },
//   card: {
//     background: '#fff',
//     borderRadius: 16,
//     padding: 24,
//     boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
//   },
//   title: {
//     marginBottom: 20,
//     fontSize: 24,
//     fontWeight: 700,
//   },
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: 16,
//   },
//   group: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: 8,
//   },
//   label: {
//     fontWeight: 600,
//     color: '#333',
//   },
//   input: {
//     height: 44,
//     borderRadius: 10,
//     border: '1px solid #d9dce3',
//     padding: '0 12px',
//     fontSize: 14,
//   },
//   button: {
//     height: 46,
//     border: 'none',
//     borderRadius: 10,
//     background: '#1D5AA6',
//     color: '#fff',
//     fontSize: 15,
//     fontWeight: 700,
//     cursor: 'pointer',
//   },
//   message: {
//     marginBottom: 12,
//     color: '#1D5AA6',
//     fontWeight: 600,
//   },
//   list: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: 14,
//   },
//   item: {
//     border: '1px solid #ececec',
//     borderRadius: 12,
//     padding: 14,
//   },
//   itemTitle: {
//     margin: 0,
//     marginBottom: 8,
//   },
//   itemText: {
//     margin: '4px 0',
//     color: '#666',
//     fontSize: 14,
//   },
// };