import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  const [contacts, setContacts] = useState(() => {
    const savedContacts = localStorage.getItem("contacts");
    return savedContacts ? JSON.parse(savedContacts) : [];
  });

  useEffect(() => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }, [contacts]);

  const addNewContact = () => {
    const randomId = Math.floor(Math.random() * 1000000); // Membuat angka acak
    const newContact = {
      name: `Chat-${randomId}`, // Menggunakan angka acak sebagai bagian nama
      message: "",
    };
    setContacts([...contacts, newContact]);
  };

  const deleteContact = (index) => {
    const updatedContacts = contacts.filter((_, i) => i !== index);
    setContacts(updatedContacts);

    // Menghapus chat yang terkait dengan kontak yang dihapus dari localStorage
    const contactName = contacts[index].name;
    localStorage.removeItem(contactName);
  };

  return (
    <div className="homepage">
      <h2>Daftar Chat</h2>
      <ul>
        {contacts.map((contact, index) => (
          <li key={index}>
            <strong>{contact.name}</strong>
            <br />
            <br />
            <button
              className="start-chat"
              onClick={() => navigate(`/chat/${contact.name}`)}
            >
              Mulai Chat
            </button>
            <button
              className="delete-contact"
              onClick={() => deleteContact(index)}
            >
              Hapus
            </button>
          </li>
        ))}
      </ul>
      <button className="add-contact" onClick={addNewContact}>
        Tambah Chat
      </button>
    </div>
  );
};

export default HomePage;